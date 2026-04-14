'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { isUpdating, hasError } from 'reduxful';
import todosApi from '@/redux/api/todosApi';
import TodoItem from '@/components/TodoItem';
import AddTodoForm from '@/components/AddTodoForm';
import TodoFilter from '@/components/TodoFilter';

function TodoApp({
  todos,
  isLoading,
  error,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
}) {
  const [filter, setFilter] = useState('all');
  const [optimisticTodos, setOptimisticTodos] = useState([]);

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  // Merge server todos with optimistic ones
  const allTodos = useMemo(() => {
    if (!todos) return optimisticTodos;
    // Remove optimistic items that now exist on server
    const serverIds = new Set(todos.map((t) => t.title));
    const pending = optimisticTodos.filter((o) => !serverIds.has(o.title));
    return [...pending, ...todos];
  }, [todos, optimisticTodos]);

  const filtered = useMemo(() => {
    if (filter === 'active') return allTodos.filter((t) => !t.completed);
    if (filter === 'completed') return allTodos.filter((t) => t.completed);
    return allTodos;
  }, [allTodos, filter]);

  const activeCount = useMemo(
    () => allTodos.filter((t) => !t.completed).length,
    [allTodos]
  );

  const handleAdd = useCallback(
    async (title) => {
      // Manual optimistic update
      const optimistic = {
        id: 'optimistic-' + Date.now(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setOptimisticTodos((prev) => [optimistic, ...prev]);

      try {
        await createTodo({}, { body: JSON.stringify({ title }) });
        // Refetch to get server state
        getTodos();
      } catch {
        // Revert optimistic on error
      }
      setOptimisticTodos((prev) => prev.filter((t) => t.id !== optimistic.id));
    },
    [createTodo, getTodos]
  );

  const handleToggle = useCallback(
    async (id, completed) => {
      try {
        await updateTodo({ id }, { body: JSON.stringify({ completed }) });
        // Manual refetch after mutation
        getTodos();
      } catch {
        // error in reduxful state
      }
    },
    [updateTodo, getTodos]
  );

  const handleEdit = useCallback(
    async (id, title) => {
      try {
        await updateTodo({ id }, { body: JSON.stringify({ title }) });
        getTodos();
      } catch {
        // error in reduxful state
      }
    },
    [updateTodo, getTodos]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteTodo({ id });
        getTodos();
      } catch {
        // error in reduxful state
      }
    },
    [deleteTodo, getTodos]
  );

  if (isLoading && !todos) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
        Failed to load todos.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Redux Todos</h2>

      <AddTodoForm onAdd={handleAdd} />

      <TodoFilter
        filter={filter}
        onFilterChange={setFilter}
        activeCount={activeCount}
      />

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            {filter === 'all'
              ? 'No todos yet. Add one above!'
              : `No ${filter} todos.`}
          </p>
        ) : (
          filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isPending={todo.id.startsWith('optimistic-')}
            />
          ))
        )}
      </div>

      <div className="space-y-1.5 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
        <p className="font-semibold">Redux + Reduxful approach:</p>
        <ul className="list-inside list-disc space-y-0.5">
          <li>
            <strong>Manual optimistic updates</strong> &mdash; local state merged
            with server data
          </li>
          <li>
            <strong>Manual cache invalidation</strong> &mdash; re-dispatch
            getTodos() after every mutation
          </li>
          <li>
            <strong>No stale-while-revalidate</strong> &mdash; data replaced on
            each fetch
          </li>
          <li>
            <strong>No built-in retry</strong> &mdash; would need manual
            try/catch loop
          </li>
          <li>
            <strong>No background refetch</strong> &mdash; would need manual
            interval/listener
          </li>
        </ul>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const response = todosApi.selectors.getTodos(state);
  return {
    todos: Array.isArray(response?.value) ? response.value : null,
    isLoading: isUpdating(response),
    error: hasError(response),
  };
};

const mapDispatchToProps = {
  getTodos: todosApi.actionCreators.getTodos,
  createTodo: todosApi.actionCreators.createTodo,
  updateTodo: todosApi.actionCreators.updateTodo,
  deleteTodo: todosApi.actionCreators.deleteTodo,
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);

"use client";

import { useState, useMemo } from "react";
import { useTodos } from "@/react-query/hooks/useTodos";
import { useCreateTodo } from "@/react-query/hooks/useCreateTodo";
import { useUpdateTodo } from "@/react-query/hooks/useUpdateTodo";
import { useDeleteTodo } from "@/react-query/hooks/useDeleteTodo";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import TodoFilter, { type FilterValue } from "@/components/TodoFilter";

export default function TodoApp() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const { data: todos, isLoading, isFetching, error } = useTodos();
  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const filtered = useMemo(() => {
    if (!todos) return [];
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos?.filter((t) => !t.completed).length ?? 0,
    [todos]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
        Failed to load todos: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">React Query Todos</h2>
        {isFetching && !isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-blue-500">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            Syncing...
          </span>
        )}
      </div>

      <AddTodoForm
        onAdd={(title) => createMutation.mutate({ title })}
        isPending={createMutation.isPending}
      />

      <TodoFilter
        filter={filter}
        onFilterChange={setFilter}
        activeCount={activeCount}
      />

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            {filter === "all" ? "No todos yet. Add one above!" : `No ${filter} todos.`}
          </p>
        ) : (
          filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={(id, completed) =>
                updateMutation.mutate({ id, completed })
              }
              onEdit={(id, title) => updateMutation.mutate({ id, title })}
              onDelete={(id) => deleteMutation.mutate(id)}
              isPending={todo.id.startsWith("optimistic-")}
            />
          ))
        )}
      </div>

      <div className="space-y-1.5 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
        <p className="font-semibold">TanStack Query features in action:</p>
        <ul className="list-inside list-disc space-y-0.5">
          <li><strong>Optimistic updates</strong> &mdash; new todos appear instantly before server confirms</li>
          <li><strong>Cache invalidation</strong> &mdash; queries auto-refetch after mutations settle</li>
          <li><strong>Stale-while-revalidate</strong> &mdash; stale data shown while &quot;Syncing...&quot; indicator appears</li>
          <li><strong>Background refetch</strong> &mdash; switch tabs and come back to see auto-refetch</li>
          <li><strong>Retry</strong> &mdash; failed requests auto-retry up to 2 times</li>
        </ul>
      </div>
    </div>
  );
}

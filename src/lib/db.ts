import type { Todo, CreateTodoInput, UpdateTodoInput } from "./types";

const globalStore = globalThis as typeof globalThis & {
  __todos?: Map<string, Todo>;
};

function getStore(): Map<string, Todo> {
  if (!globalStore.__todos) {
    globalStore.__todos = new Map<string, Todo>();
    seed(globalStore.__todos);
  }
  return globalStore.__todos;
}

function seed(store: Map<string, Todo>) {
  const todos: Todo[] = [
    {
      id: crypto.randomUUID(),
      title: "Buy groceries",
      completed: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Read about TanStack Query",
      completed: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Write unit tests",
      completed: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Review pull request",
      completed: true,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Deploy to staging",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
  for (const todo of todos) {
    store.set(todo.id, todo);
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAllTodos(): Todo[] {
  const store = getStore();
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getTodoById(id: string): Todo | undefined {
  return getStore().get(id);
}

export function createTodo(input: CreateTodoInput): Todo {
  const store = getStore();
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: input.title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  store.set(todo.id, todo);
  return todo;
}

export function updateTodo(id: string, input: UpdateTodoInput): Todo {
  const store = getStore();
  const existing = store.get(id);
  if (!existing) throw new Error(`Todo ${id} not found`);
  const updated: Todo = { ...existing, ...input };
  store.set(id, updated);
  return updated;
}

export function deleteTodo(id: string): void {
  const store = getStore();
  if (!store.has(id)) throw new Error(`Todo ${id} not found`);
  store.delete(id);
}

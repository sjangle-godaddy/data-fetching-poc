import Link from "next/link";
import TodoApp from "@/components/react-query/TodoApp";

export default function ReactQueryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">TanStack Query</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Full CRUD with optimistic updates, cache invalidation, stale-while-revalidate, and more. Open DevTools (bottom-right) to inspect cache.
      </p>
      <TodoApp />
    </div>
  );
}

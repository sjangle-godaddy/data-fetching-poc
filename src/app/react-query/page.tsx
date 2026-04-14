import Link from "next/link";
import ReactQueryProvider from "@/react-query/provider";
import UserList from "@/components/react-query/UserList";

export default function ReactQueryUsersPage() {
  return (
    <ReactQueryProvider>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users (React Query)</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
        <p className="mb-6 text-sm text-gray-500">
          This page fetches data using TanStack Query (react-query) with useQuery hooks. Open React Query DevTools (bottom-right) to inspect cache.
        </p>
        <UserList />
      </div>
    </ReactQueryProvider>
  );
}

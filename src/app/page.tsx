import Link from "next/link";

const features = [
  {
    capability: "Fetch todos",
    redux: "Manual dispatch + connect()",
    rq: "useQuery hook",
  },
  {
    capability: "Create todo",
    redux: "Manual dispatch + refetch",
    rq: "useMutation + optimistic update",
  },
  {
    capability: "Toggle / edit todo",
    redux: "Manual dispatch + refetch",
    rq: "useMutation + optimistic rollback",
  },
  {
    capability: "Delete todo",
    redux: "Manual dispatch + refetch",
    rq: "useMutation + optimistic delete",
  },
  {
    capability: "Cache invalidation",
    redux: "Manual re-dispatch",
    rq: "Automatic invalidateQueries",
  },
  {
    capability: "Optimistic updates",
    redux: "Manual local state merge",
    rq: "Built-in onMutate / onError / onSettled",
  },
  {
    capability: "Stale-while-revalidate",
    redux: "Not supported",
    rq: "Built-in (staleTime + isFetching indicator)",
  },
  {
    capability: "Background refetch",
    redux: "Manual (setInterval / listeners)",
    rq: "Built-in (refetchOnWindowFocus)",
  },
  {
    capability: "Retry on failure",
    redux: "Manual try/catch loop",
    rq: "Built-in (retry: 2)",
  },
  {
    capability: "TypeScript",
    redux: "No types (reduxful is JS-only)",
    rq: "Full type inference",
  },
  {
    capability: "Devtools",
    redux: "Redux DevTools (all state)",
    rq: "React Query DevTools (server state)",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Todo App &mdash; Data Fetching POC</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        A full CRUD todo app comparing <strong>Redux + Reduxful</strong> vs{" "}
        <strong>TanStack Query</strong> for server-state management. Both
        implementations use the same in-memory API with artificial delays.
      </p>

      {/* Navigation */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/redux"
          className="rounded-lg border-2 border-gray-300 p-6 transition hover:border-orange-500 hover:shadow-lg dark:border-gray-700"
        >
          <h2 className="text-xl font-bold text-orange-600">
            Redux + Reduxful
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Traditional approach: setupApi, connect(), mapStateToProps, manual
            refetch after mutations, manual optimistic state.
          </p>
        </Link>

        <Link
          href="/react-query"
          className="rounded-lg border-2 border-gray-300 p-6 transition hover:border-green-500 hover:shadow-lg dark:border-gray-700"
        >
          <h2 className="text-xl font-bold text-green-600">
            TanStack Query
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Modern approach: useQuery/useMutation hooks with built-in optimistic
            updates, cache invalidation, retry, and stale-while-revalidate.
          </p>
        </Link>
      </div>

      {/* Feature Comparison */}
      <div className="mt-12">
        <h2 className="text-xl font-bold">Feature Comparison</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          How each approach handles CRUD operations and advanced data-fetching
          patterns.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="py-2 pr-4">Capability</th>
                <th className="py-2 pr-4 text-orange-600">Redux + Reduxful</th>
                <th className="py-2 text-green-600">TanStack Query</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {features.map((row) => (
                <tr key={row.capability}>
                  <td className="py-2 pr-4 font-medium">{row.capability}</td>
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">
                    {row.redux}
                  </td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">
                    {row.rq}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-gray-400">
        Click on either approach above to see it in action. Both pages use the
        same in-memory API with artificial delays to simulate real network
        conditions.
      </p>
    </div>
  );
}

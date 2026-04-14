import Link from "next/link";

const comparisonData = [
  {
    feature: "User list fetch",
    reduxFiles: "usersApi.js, store.js, UserList.jsx",
    reduxLOC: 95,
    rqFiles: "useUsers.ts, UserList.tsx",
    rqLOC: 25,
  },
  {
    feature: "User detail + posts",
    reduxFiles: "usersApi.js, store.js, UserDetail.jsx",
    reduxLOC: 105,
    rqFiles: "useUser.ts, useUserPosts.ts, UserDetail.tsx",
    rqLOC: 30,
  },
  {
    feature: "Create post mutation",
    reduxFiles: "postsApi.js, store.js, CreatePostForm.jsx",
    reduxLOC: 85,
    rqFiles: "useCreatePost.ts, CreatePostForm.tsx",
    rqLOC: 35,
  },
  {
    feature: "Infrastructure / setup",
    reduxFiles: "store.js, provider.jsx, request-adapter.js",
    reduxLOC: 35,
    rqFiles: "provider.tsx",
    rqLOC: 15,
  },
];

export default function HomePage() {
  const totalRedux = comparisonData.reduce((s, r) => s + r.reduxLOC, 0);
  const totalRQ = comparisonData.reduce((s, r) => s + r.rqLOC, 0);
  const reduction = Math.round(((totalRedux - totalRQ) / totalRedux) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Data Fetching POC</h1>
      <p className="mt-2 text-gray-600">
        Side-by-side comparison of <strong>Redux + Reduxful</strong> vs{" "}
        <strong>TanStack Query (React Query)</strong> for server-state
        management.
      </p>

      {/* Navigation */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/redux"
          className="rounded-lg border-2 border-gray-300 p-6 transition hover:border-orange-500 hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-orange-600">
            Redux + Reduxful
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Traditional approach using setupApi, connect(), mapStateToProps,
            mapDispatchToProps, and manual loading/error state extraction.
          </p>
          <p className="mt-3 text-xs font-mono text-gray-400">
            ~{totalRedux} lines of code
          </p>
        </Link>

        <Link
          href="/react-query"
          className="rounded-lg border-2 border-gray-300 p-6 transition hover:border-green-500 hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-green-600">
            TanStack Query (React Query)
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Modern approach using useQuery/useMutation hooks with built-in
            caching, deduplication, and automatic loading/error states.
          </p>
          <p className="mt-3 text-xs font-mono text-gray-400">
            ~{totalRQ} lines of code
          </p>
        </Link>
      </div>

      {/* LOC Comparison Table */}
      <div className="mt-12">
        <h2 className="text-xl font-bold">Lines of Code Comparison</h2>
        <p className="mt-1 text-sm text-gray-500">
          Approximate line counts for equivalent functionality
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 pr-4">Feature</th>
                <th className="py-2 pr-4 text-orange-600">Redux LOC</th>
                <th className="py-2 pr-4 text-green-600">React Query LOC</th>
                <th className="py-2">Reduction</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row) => (
                <tr key={row.feature} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium">{row.feature}</td>
                  <td className="py-2 pr-4 font-mono text-orange-600">
                    {row.reduxLOC}
                  </td>
                  <td className="py-2 pr-4 font-mono text-green-600">
                    {row.rqLOC}
                  </td>
                  <td className="py-2 font-mono">
                    -{Math.round(((row.reduxLOC - row.rqLOC) / row.reduxLOC) * 100)}%
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300 font-bold">
                <td className="py-2 pr-4">Total</td>
                <td className="py-2 pr-4 font-mono text-orange-600">
                  {totalRedux}
                </td>
                <td className="py-2 pr-4 font-mono text-green-600">
                  {totalRQ}
                </td>
                <td className="py-2 font-mono">-{reduction}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="mt-12">
        <h2 className="text-xl font-bold">Feature Comparison</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 pr-4">Capability</th>
                <th className="py-2 pr-4 text-orange-600">Redux + Reduxful</th>
                <th className="py-2 text-green-600">TanStack Query</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Caching", "None (manual)", "Built-in, configurable staleTime/gcTime"],
                ["Request deduplication", "None", "Automatic"],
                ["Loading/error states", "Manual (isUpdating, hasError)", "Automatic (isLoading, error)"],
                ["Background refetching", "None", "Automatic on window focus, interval, reconnect"],
                ["Retry logic", "None", "Built-in, configurable"],
                ["Optimistic updates", "Manual", "Built-in pattern with rollback"],
                ["Pagination", "Manual", "useInfiniteQuery"],
                ["Devtools", "Redux DevTools (all state)", "React Query DevTools (server state)"],
                ["SSR / Next.js", "Manual hydration", "First-class prefetch support"],
                ["TypeScript", "No types (reduxful)", "Full type inference"],
                ["Bundle overhead", "redux + react-redux + reduxful + thunk", "~13kb gzipped"],
                ["Mutation cache invalidation", "Manual dispatch", "Automatic with queryClient.invalidateQueries"],
              ].map(([cap, redux, rq]) => (
                <tr key={cap}>
                  <td className="py-2 pr-4 font-medium">{cap}</td>
                  <td className="py-2 pr-4 text-gray-600">{redux}</td>
                  <td className="py-2 text-gray-600">{rq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-gray-400">
        Click on either approach above to see it in action. Both pages fetch from
        JSONPlaceholder and render identical UIs.
      </p>
    </div>
  );
}

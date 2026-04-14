# Proposal: Migrate from Reduxful to TanStack Query

## TL;DR

Replace **reduxful + Redux** with **TanStack Query v5** for server-state management. The companion POC in this repo demonstrates the difference using a full CRUD todo app — same features, ~67% less code, with built-in optimistic updates, caching, retry, and background sync that Redux requires manual implementation for.

---

## The Problem

Our current stack uses [reduxful](https://github.com/godaddy/reduxful) to manage API data. It works, but every feature teams expect from a modern data layer has to be built by hand:

- **No caching** — every navigation re-fetches, even for data fetched seconds ago
- **No request deduplication** — multiple components hitting the same endpoint = duplicate calls
- **No optimistic updates** — UI waits for the server round-trip on every mutation
- **No retry** — a single failed request surfaces an error immediately
- **No background sync** — stale data stays stale until the user triggers a refetch
- **No TypeScript support** — reduxful ships no types
- **Unmaintained** — reduxful's last meaningful activity was years ago

On top of that, every endpoint requires ~90+ lines across 3 files (API definition, store config, connected component) just to fetch and display data.

---

## The Proposal

Adopt **TanStack Query v5** for all server-state. Keep Redux only if needed for client-side state (UI toggles, form wizards, etc.).

### What TanStack Query gives us for free

| Capability | With Reduxful | With TanStack Query |
|---|---|---|
| Caching | Manual | Built-in (`staleTime`, `gcTime`) |
| Request deduplication | Manual | Automatic |
| Loading / error states | `isUpdating()`, `hasError()`, `.value` | `isLoading`, `error`, `data` |
| Optimistic updates | Manual local state + rollback logic | `onMutate` / `onError` / `onSettled` |
| Cache invalidation | Re-dispatch action creators | `invalidateQueries()` |
| Background refetch | Manual (`setInterval`, focus listeners) | Built-in (`refetchOnWindowFocus`, reconnect) |
| Retry on failure | Manual try/catch loop | Built-in with configurable count |
| Stale-while-revalidate | Not possible | Built-in (`staleTime` + `isFetching`) |
| Devtools | Redux DevTools (all state mixed) | React Query DevTools (server state only) |
| TypeScript | None | Full type inference |
| Bundle | redux + react-redux + reduxful + thunk | ~13kb gzipped |

---

## Code Comparison

### Fetching data

**Reduxful** — API definition + store setup + connected component:

```javascript
// 1. API definition
const apiDesc = {
  getTodos: { url: '/api/todos', method: 'GET' },
};
const todosApi = setupApi('todosApi', apiDesc, { requestAdapter });

// 2. Store setup
const rootReducer = combineReducers({ ...todosApi.reducers });
const store = createStore(rootReducer, applyMiddleware(thunk));

// 3. Component
function TodoList({ todos, isLoading, getTodos }) {
  useEffect(() => { getTodos(); }, [getTodos]);
  if (isLoading) return <Spinner />;
  return todos.map(t => <TodoItem key={t.id} todo={t} />);
}
const mapStateToProps = (state) => ({
  todos: todosApi.selectors.getTodos(state)?.value ?? [],
  isLoading: isUpdating(todosApi.selectors.getTodos(state)),
});
export default connect(mapStateToProps, {
  getTodos: todosApi.actionCreators.getTodos,
})(TodoList);
```

**TanStack Query** — one hook, one component:

```typescript
// Hook
export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(res => res.json()),
  });
}

// Component
function TodoList() {
  const { data: todos, isLoading } = useTodos();
  if (isLoading) return <Spinner />;
  return todos.map(t => <TodoItem key={t.id} todo={t} />);
}
```

### Mutations with optimistic updates

**Reduxful** — manual optimistic state, manual rollback, manual refetch:

```javascript
const handleAdd = async (title) => {
  // Manual optimistic: add to local state
  setOptimistic(prev => [{ id: 'temp', title, completed: false }, ...prev]);
  try {
    await createTodo({}, { body: JSON.stringify({ title }) });
    getTodos(); // Manual refetch
  } catch {
    // Manual rollback
  }
  setOptimistic(prev => prev.filter(t => t.id !== 'temp'));
};
```

**TanStack Query** — declarative optimistic pattern:

```typescript
useMutation({
  mutationFn: ({ title }) => fetch('/api/todos', { method: 'POST', body: JSON.stringify({ title }) }),
  onMutate: async ({ title }) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], old => [{ id: 'temp', title, completed: false }, ...old]);
    return { previous };
  },
  onError: (_err, _vars, ctx) => queryClient.setQueryData(['todos'], ctx.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

Same result, but the pattern is standardized — every mutation follows the same `onMutate`/`onError`/`onSettled` structure instead of ad-hoc `useState` + `try/catch` in each component.

---

## Alternatives Considered

| Option | Why not |
|---|---|
| **RTK Query** | Still requires Redux store + Toolkit boilerplate. If we're moving off Redux for server state, no reason to stay half-in. |
| **SWR** | Lighter, but missing query cancellation, offline mutations, deep devtools, and a mature `useMutation` abstraction. |

---

## Migration Plan

### New projects
Use TanStack Query from day one.

### Existing projects (incremental)
1. Install `@tanstack/react-query`, wrap app in `QueryClientProvider` (coexists with Redux)
2. Pick one endpoint, replace its reduxful definition with a `useQuery` hook
3. Remove its reducer from `combineReducers`
4. Repeat until all server-state is migrated
5. Remove reduxful (and Redux entirely if no client-state remains)

### Client-side state
Redux is still fine for complex client-side state. For simpler needs, consider **Zustand** (~1kb) or **React Context + useReducer** (zero dependencies).

---

## Risks

| Risk | Level | Mitigation |
|---|---|---|
| Learning curve | Low | Hooks-based API; productive in < 1 day |
| Ecosystem stability | Low | Mature, 40k+ GitHub stars, active maintenance |
| Backward compatibility | None | Coexists with Redux during migration |

---

## Try the POC

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

- `/redux` — Todo CRUD with Redux + Reduxful (manual optimistic updates, manual refetch)
- `/react-query` — Same app with TanStack Query (optimistic updates, cache invalidation, stale-while-revalidate, retry, background refetch)
- Both hit the same in-memory API with artificial delays so you can see the difference in UX

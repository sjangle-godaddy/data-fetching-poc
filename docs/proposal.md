# TanStack Query over Reduxful for Server-State

## What is "Server State"?

"Server state" doesn't mean state that lives on the Node.js server. It means **the client-side state your app maintains for data that originates from the server** — data you fetched, cached, and may need to keep in sync with the backend.

- It doesn't replaces redux, axios, fetch API
- Layer on top of this to simplify the state management

---

## The Problem

Our current stack uses [reduxful](https://github.com/godaddy/reduxful) to manage API data. It works, but every feature teams expect from a modern data layer has to be built by hand:

- **No caching** — every navigation re-fetches, even for data fetched seconds ago
- **No request deduplication** — multiple components hitting the same endpoint = duplicate calls
- **No optimistic updates** — UI waits for the server round-trip on every mutation
- **No retry** — a single failed request surfaces an error immediately
- **No background sync** — stale data stays stale until the user triggers a refetch
- **No TypeScript support** — reduxful ships no types
- **Not very actively maintained** — reduxful's last meaningful activity was years ago

On top of that, every endpoint requires ~90+ lines across 3 files (API definition, store config, connected component) just to fetch and display data.

---

## Code Comparison

### Fetching data

**Reduxful** — API definition + store setup + connected component:

```javascript
// 1. API definition
const apiDesc = { getTodos: { url: '/api/todos', method: 'GET' }, };
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
  // setOptimistic(prev => [{ id: 'temp', title, completed: false }, ...prev]);
  try {
    await createTodo({}, { body: JSON.stringify({ title }) });
    getTodos(); // Manual refetch
  } catch {
    // Error handling / Rollback
  }
  // setOptimistic(prev => prev.filter(t => t.id !== 'temp'));
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


| Option        | Why not                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **RTK Query** | Still requires Redux store + Toolkit boilerplate. If we're moving off Redux for server state, no reason to stay half-in. |
| **SWR**       | Lighter, but missing query cancellation, offline mutations, deep devtools, and a mature `useMutation` abstraction.       |


---

## Risks


| Risk                   | Level | Mitigation                                                        |
| ---------------------- | ----- | ----------------------------------------------------------------- |
| Learning curve         | Low   | Hooks-based API; any React developer can be productive in < 1 day |
| Ecosystem stability    | Low   | Mature, 45k+ GitHub stars, active maintenance                     |
| Backward compatibility | None  | Can coexist with Redux in existing apps during migration          |


---

  
  
  
  
  
  


## (Optional) A Note on Global State: Zustand over Redux

With TanStack Query handling all server-state, Redux loses its primary job. If the app still needs global client-side state (UI toggles, sidebar, theme, form wizards), **Zustand** is a lighter fit than Redux.

Additionally, in Gasket v7, `@gasket/plugin-redux` has been removed and `@gasket/redux` is deprecated — Redux is no longer a framework-level dependency. There's no reason to add it to a new project.


|                | Redux                                                              | Zustand                                |
| -------------- | ------------------------------------------------------------------ | -------------------------------------- |
| **Setup**      | `createStore` + `combineReducers` + `applyMiddleware` + `Provider` | `create()` — one function, no provider |
| **Per slice**  | Reducer + action types + action creators                           | Plain object with functions            |
| **Bundle**     | redux + react-redux + redux-thunk (~7kb)                           | ~1.5kb                                 |
| **TypeScript** | Manual typing or RTK                                               | Full inference                         |
| **DevTools**   | Separate extension                                                 | Same Redux DevTools, opt-in            |


```typescript
// Zustand — that's the entire store
const useSidebarStore = create<SidebarState>((set) => ({
  open: false,
  toggle: () => set((s) => ({ open: !s.open })),
}));

// Component — no Provider, no dispatch, no action types
const { open, toggle } = useSidebarStore();
```

**Recommended stack for new apps:** TanStack Query (server-state) + Zustand (client-state).

---

## Try the POC

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

- `/redux` — Todo CRUD with Redux + Reduxful (manual optimistic updates, manual refetch)
- `/react-query` — Same app with TanStack Query (optimistic updates, cache invalidation, stale-while-revalidate, retry, background refetch)
- Both hit the same in-memory API with artificial delays so you can see the UX difference


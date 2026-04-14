# Data Fetching Strategy Proposal: TanStack Query (React Query)

## Executive Summary

We recommend adopting **TanStack Query v5** for all server-state management in new projects, replacing the current **reduxful + Redux** approach. This change delivers approximately **67% reduction in boilerplate code**, provides built-in caching, request deduplication, and automatic loading/error states — features that currently require manual implementation. Redux remains an option for purely client-side state if needed, but server-state (API data) should be managed by TanStack Query going forward.

---

## Current Approach: Reduxful + Redux

### How It Works

Our current stack uses [reduxful](https://github.com/godaddy/reduxful) as a wrapper around Redux to manage API state:

1. **API Definition File** — Define endpoints using `setupApi('name', apiDesc, apiConfig)`, which auto-generates action creators, reducers, and selectors
2. **Store Setup** — Spread `.reducers` from each API definition into `combineReducers`
3. **Component Wiring** — Use `connect(mapStateToProps, mapDispatchToProps)` to access data

### Typical Code Anatomy

**API definition (~25-45 lines per file):**
```javascript
import { setupApi } from 'reduxful';
import requestAdapter from '../request-adapter';

const apiDesc = {
  getUsers: {
    url: 'https://api.example.com/users',
    method: 'GET',
  },
  getUser: {
    url: 'https://api.example.com/users/:userId',
    method: 'GET',
    dataTransform: (user) => {
      // normalize data
      return { ...user, displayName: user.name.toUpperCase() };
    }
  }
};

const usersApi = setupApi('usersApi', apiDesc, { requestAdapter });
export default usersApi;
```

**Store setup (~15-25 lines):**
```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import usersApi from './api/usersApi';

const rootReducer = combineReducers({
  ...usersApi.reducers,
  // ...more API reducers
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
```

**Connected component (~50-65 lines):**
```javascript
import { connect } from 'react-redux';
import { isUpdating, hasError } from 'reduxful';
import usersApi from '../redux/api/usersApi';

function UserList({ users, isLoading, error, getUsers }) {
  useEffect(() => { getUsers(); }, [getUsers]);

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return users.map(user => <UserCard key={user.id} user={user} />);
}

const mapStateToProps = (state) => {
  const response = usersApi.selectors.getUsers(state);
  return {
    users: response?.value ?? null,
    isLoading: isUpdating(response),
    error: hasError(response),
  };
};

const mapDispatchToProps = {
  getUsers: usersApi.actionCreators.getUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
```

### Pain Points

1. **No caching** — Every navigation re-fetches data, even if it was fetched seconds ago
2. **No request deduplication** — Multiple components requesting the same data trigger duplicate API calls
3. **Manual loading/error state extraction** — Every component must check `isUpdating(response)`, `hasError(response)`, and extract `response?.value`
4. **Verbose boilerplate** — ~95 lines across 3+ files for a simple list fetch
5. **No background refetching** — Stale data is served without revalidation
6. **No TypeScript types** — reduxful does not ship types, making the codebase harder to work with
7. **Unmaintained library** — reduxful's last publish was years ago
8. **Scattered data transforms** — Some happen in API definitions, some in components, some in reducers

---

## Proposed Approach: TanStack Query v5

### How It Works

TanStack Query manages server-state through hooks:

```typescript
// Define the query (8 lines, including imports)
import { useQuery } from '@tanstack/react-query';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });
}

// Use in component (no connect, no mapState, no useEffect)
function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return users.map(user => <UserCard key={user.id} user={user} />);
}
```

**Mutations with automatic cache invalidation:**
```typescript
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPost) =>
      fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

### What You Get Out of the Box

- **Caching** with configurable `staleTime` and `gcTime` (garbage collection time)
- **Automatic request deduplication** — multiple components using the same query make one request
- **Background refetching** on window focus, network reconnect, and configurable intervals
- **Retry logic** with exponential backoff (configurable)
- **Optimistic updates** with automatic rollback on error
- **Pagination** via `useInfiniteQuery`
- **React Query DevTools** — inspect cache state, query timing, and status in real-time
- **Full TypeScript support** with type inference
- **First-class SSR/Next.js support** with `prefetchQuery` and hydration

---

## Side-by-Side Comparison

| Capability | Redux + Reduxful | TanStack Query v5 |
|---|---|---|
| **Boilerplate per API endpoint** | ~30-45 lines (API def + store + adapter) | ~8 lines (hook) |
| **Boilerplate per component** | ~50-65 lines (connect + mapState + useEffect) | ~20-25 lines (hook + render) |
| **Caching** | None | Built-in, configurable |
| **Request deduplication** | None | Automatic |
| **Loading/error states** | Manual (isUpdating, hasError, .value) | Automatic (isLoading, error, data) |
| **Background refetching** | None | Window focus, reconnect, interval |
| **Retry logic** | None | Built-in with exponential backoff |
| **Optimistic updates** | Manual (complex) | Built-in pattern with rollback |
| **Pagination / Infinite scroll** | Manual | useInfiniteQuery |
| **Devtools** | Redux DevTools (all state mixed) | React Query DevTools (server state only) |
| **SSR / Next.js** | Manual hydration via next-redux-wrapper | First-class prefetchQuery |
| **TypeScript** | No types (reduxful) | Full type inference |
| **Bundle size** | redux + react-redux + reduxful + thunk | ~13kb gzipped |
| **Mutation + cache sync** | Manual dispatch | queryClient.invalidateQueries |
| **Maintenance status** | reduxful last commit activity was way long back | Active, large community (40k+ GitHub stars) |

### Lines of Code Comparison (from POC)

| Feature | Redux + Reduxful LOC | React Query LOC | Reduction |
|---|---|---|---|
| User list fetch | ~95 | ~25 | ~74% |
| User detail + posts | ~105 | ~30 | ~71% |
| Create post mutation | ~85 | ~35 | ~59% |
| Infrastructure / setup | ~35 | ~15 | ~57% |
| **Total** | **~320** | **~105** | **~67%** |

---

## Alternatives Considered

### RTK Query (Redux Toolkit Query)

**Pros:**
- Stays in the Redux ecosystem
- Auto-generated hooks from endpoint definitions
- Built-in caching and invalidation

**Cons:**
- Still requires Redux store setup and Redux Toolkit boilerplate
- Heavier bundle than TanStack Query
- If we're moving away from Redux for server state, there's no benefit to staying half-in
- Steeper learning curve for developers unfamiliar with Redux Toolkit's `createApi`

**Verdict:** A good option if the team wants to stay in Redux, but adds unnecessary complexity when TanStack Query provides the same features with simpler setup.

### SWR (Vercel)

**Pros:**
- Lightweight (~4kb), simple API
- Good Next.js integration (same team)
- `useSWR` hook is intuitive

**Cons:**
- Fewer features: no query cancellation, no offline mutation support
- No built-in devtools with same depth
- Smaller plugin/middleware ecosystem
- No built-in mutation abstraction (no `useMutation` equivalent until recently)

**Verdict:** Viable for simple use cases, but TanStack Query provides a more complete feature set for complex applications.


---

## Migration Strategy

### New Projects
Use TanStack Query from day one. No Redux required for server-state.

### Existing Projects (Incremental Migration)
1. Install `@tanstack/react-query` and wrap the app in `QueryClientProvider` (can coexist with Redux)
2. Pick one API endpoint and replace its reduxful definition with a `useQuery` hook
3. Remove the corresponding reducer from `combineReducers`
4. Repeat for each endpoint
5. Once all server-state is migrated, remove reduxful and (if no client-state remains in Redux) remove Redux entirely

### What About Client-Side State?
Redux is still a valid option for purely client-side state (UI state, complex form state, cross-component coordination). However, for new projects, also consider lighter alternatives:
- **React Context + useReducer** — built-in, no dependencies
- **Zustand** — minimal API, ~1kb
- **Jotai** — atomic state management

---

## Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| Learning curve | **Low** | Hooks-based API is intuitive; any React developer can be productive in < 1 day |
| Team familiarity | **Low** | Simpler API than Redux; less to learn, not more |
| Ecosystem stability | **Low** | TanStack Query v5 is mature, maintained, used in thousands of production apps |
| Backward compatibility | **None** | Can coexist with Redux in the same app during migration |
| Vendor risk | **Low** | MIT license, large contributor base, framework-agnostic core |

---

## POC Reference

See the companion Next.js app in this repo for a working side-by-side comparison:

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

- `/redux` — Todo CRUD app using Redux + Reduxful with manual optimistic updates and refetch
- `/react-query` — Same todo app using TanStack Query with built-in optimistic updates, cache invalidation, stale-while-revalidate, retry, and background refetch
- Both implementations use an in-memory API with artificial delays to simulate real network conditions

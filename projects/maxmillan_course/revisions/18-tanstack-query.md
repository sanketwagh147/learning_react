# TanStack Query (React Query) - Complete Revision Guide

## Table of Contents

1. [What is TanStack Query?](#what-is-tanstack-query)
2. [Setup and Configuration](#setup-and-configuration)
3. [useQuery - Fetching Data](#usequery---fetching-data)
4. [Query Keys](#query-keys)
5. [useMutation - Modifying Data](#usemutation---modifying-data)
6. [Query Invalidation](#query-invalidation)
7. [Caching and Stale Time](#caching-and-stale-time)
8. [Pagination and Infinite Queries](#pagination-and-infinite-queries)
9. [Optimistic Updates](#optimistic-updates)
10. [Prefetching](#prefetching)
11. [Parallel and Dependent Queries](#parallel-and-dependent-queries)
12. [Error Handling](#error-handling)
13. [DevTools](#devtools)
14. [Best Practices](#best-practices)
15. [TanStack Query vs useEffect](#tanstack-query-vs-useeffect)

---

## What is TanStack Query?

TanStack Query (formerly React Query) is a **powerful data-fetching and state management library** for React applications.

### Why TanStack Query?

| Feature                   | useEffect + useState  | TanStack Query     |
| ------------------------- | --------------------- | ------------------ |
| **Caching**               | Manual implementation | Built-in           |
| **Background refetching** | Manual                | Automatic          |
| **Stale data handling**   | Manual                | Built-in           |
| **Loading/Error states**  | Manual booleans       | Automatic          |
| **Deduplication**         | None                  | Automatic          |
| **Retry logic**           | Manual                | Built-in           |
| **Window focus refetch**  | Manual                | Built-in           |
| **Pagination**            | Manual                | Built-in helpers   |
| **DevTools**              | None                  | Excellent DevTools |

### Core Concepts

```
┌─────────────────────────────────────────────────────────────────┐
│                    TanStack Query Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Component → useQuery → Query Function → Server                 │
│      ↑                      │                                   │
│      │                      ↓                                   │
│      └──── Cache ←────── Response                               │
│                                                                 │
│  Cache States: fresh → stale → fetching → fresh                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Setup and Configuration

### Installation

```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query

# For DevTools (optional but recommended)
npm install @tanstack/react-query-devtools
```

### Basic Setup

```jsx
// main.jsx or App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

### Custom Configuration

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data considered fresh for 5 min
      gcTime: 1000 * 60 * 30, // Cache garbage collected after 30 min
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when reconnecting to internet
      refetchOnMount: true, // Refetch when component mounts
    },
    mutations: {
      retry: 1,
    },
  },
});
```

---

## useQuery - Fetching Data

### Basic Query

```jsx
import { useQuery } from '@tanstack/react-query';

// Query function - must return a Promise
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

function UserList() {
  const { data, isLoading, isError, error, isFetching, isSuccess, refetch } =
    useQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
    });

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {isFetching && <span>Updating...</span>}
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Query with Parameters

```jsx
async function fetchUser(userId) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}

function UserProfile({ userId }) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId], // Include userId in key for proper caching
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Only fetch when userId exists
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Query Options

```jsx
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,

  // Timing
  staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
  gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  refetchInterval: 1000 * 30, // Refetch every 30 seconds
  refetchIntervalInBackground: false, // Don't refetch when tab hidden

  // Behavior
  enabled: true, // Enable/disable the query
  retry: 3, // Retry count on failure
  retryDelay: 1000, // Delay between retries
  refetchOnWindowFocus: true, // Refetch on window focus
  refetchOnMount: true, // Refetch when component mounts

  // Data transformation
  select: (data) => data.filter((todo) => !todo.completed),

  // Placeholders
  placeholderData: [], // Show while loading
  initialData: () => {
    // Lazy initial data
    return localStorage.getItem('todos');
  },
});
```

### isLoading vs isFetching

```jsx
function DataDisplay() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  // isLoading: true when query has NO cached data AND is fetching
  // isFetching: true ANYTIME a request is in flight (including background refetch)

  if (isLoading) {
    // First load - no data at all
    return <Skeleton />;
  }

  return (
    <div>
      {isFetching && <LoadingIndicator />} {/* Background refresh indicator */}
      <DataList data={data} />
    </div>
  );
}
```

---

## Query Keys

### Query Key Fundamentals

Query keys are **unique identifiers** for cached data. They determine:

- What data to fetch
- When to refetch
- How to deduplicate requests

```jsx
// Simple key
useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

// Key with variables
useQuery({ queryKey: ['todo', todoId], queryFn: () => fetchTodo(todoId) });

// Key with multiple variables
useQuery({
  queryKey: ['todos', { status, page, sortBy }],
  queryFn: () => fetchTodos({ status, page, sortBy })
});

// Hierarchical keys
useQuery({ queryKey: ['user', userId, 'posts'], queryFn: ... });
useQuery({ queryKey: ['user', userId, 'comments'], queryFn: ... });
```

### Key Best Practices

```jsx
// ✅ Good: Descriptive, includes all variables that affect the data
useQuery({
  queryKey: ['products', { category, page, sort }],
  queryFn: () => fetchProducts({ category, page, sort })
});

// ✅ Good: Hierarchical structure
useQuery({ queryKey: ['user', id, 'profile'], ... });
useQuery({ queryKey: ['user', id, 'settings'], ... });

// ❌ Bad: Missing variables that affect the query
useQuery({
  queryKey: ['products'],  // Won't refetch when category changes!
  queryFn: () => fetchProducts({ category })
});

// ❌ Bad: Using object that creates new reference each render
useQuery({
  queryKey: [{ type: 'products', filters }],  // New object every render
  ...
});

// ✅ Better: Spread or stable reference
useQuery({
  queryKey: ['products', filters],  // filters should be stable
  ...
});
```

### Query Key Factory Pattern

```jsx
// queryKeys.js - Centralized key management
export const queryKeys = {
  users: {
    all: ['users'],
    lists: () => [...queryKeys.users.all, 'list'],
    list: (filters) => [...queryKeys.users.lists(), filters],
    details: () => [...queryKeys.users.all, 'detail'],
    detail: (id) => [...queryKeys.users.details(), id],
  },
  posts: {
    all: ['posts'],
    list: (filters) => [...queryKeys.posts.all, 'list', filters],
    detail: (id) => [...queryKeys.posts.all, 'detail', id],
    comments: (postId) => [...queryKeys.posts.detail(postId), 'comments'],
  },
};

// Usage
useQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => fetchUser(userId),
});

// Invalidation becomes easy
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
```

---

## useMutation - Modifying Data

### Basic Mutation

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createTodo(newTodo) {
  const response = await fetch('https://api.example.com/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
}

function AddTodo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (data) => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      console.log('Todo created:', data);
    },
    onError: (error) => {
      console.error('Error:', error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    mutation.mutate({
      title: formData.get('title'),
      completed: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Todo title" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding...' : 'Add Todo'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Todo added!</p>}
    </form>
  );
}
```

### Mutation with Variables

```jsx
function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) =>
      fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() =>
          updateMutation.mutate({
            id: todo.id,
            updates: { completed: !todo.completed },
          })
        }
        disabled={updateMutation.isPending}
      />
      <span>{todo.title}</span>
      <button
        onClick={() => deleteMutation.mutate(todo.id)}
        disabled={deleteMutation.isPending}
      >
        Delete
      </button>
    </li>
  );
}
```

### Mutation Callbacks

```jsx
const mutation = useMutation({
  mutationFn: updateUser,

  // Called before mutation runs
  onMutate: async (variables) => {
    console.log('Starting mutation with:', variables);
    // Return context for rollback
    return { previousData: 'backup' };
  },

  // Called on success
  onSuccess: (data, variables, context) => {
    console.log('Success! Data:', data);
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },

  // Called on error
  onError: (error, variables, context) => {
    console.error('Error:', error);
    // Can use context for rollback
  },

  // Called after success or error
  onSettled: (data, error, variables, context) => {
    console.log('Mutation completed');
  },
});
```

---

## Query Invalidation

### Invalidating Queries

```jsx
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();

  // Invalidate single query
  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  // Invalidate all queries starting with 'users'
  const invalidateAllUserQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    // This invalidates: ['users'], ['users', 1], ['users', { status: 'active' }]
  };

  // Invalidate specific query
  const invalidateSpecificUser = (userId) => {
    queryClient.invalidateQueries({ queryKey: ['users', userId] });
  };

  // Invalidate multiple related queries
  const invalidateUserData = (userId) => {
    queryClient.invalidateQueries({ queryKey: ['users', userId] });
    queryClient.invalidateQueries({ queryKey: ['users', userId, 'posts'] });
  };

  // Invalidate all queries
  const invalidateEverything = () => {
    queryClient.invalidateQueries();
  };
}
```

### Manual Cache Updates

```jsx
const queryClient = useQueryClient();

// Get current cached data
const currentData = queryClient.getQueryData(['users']);

// Set cached data directly
queryClient.setQueryData(['users'], (oldData) => {
  return [...oldData, newUser];
});

// Set data for specific query
queryClient.setQueryData(['user', userId], updatedUser);

// Remove query from cache
queryClient.removeQueries({ queryKey: ['users', userId] });
```

---

## Caching and Stale Time

### Understanding Cache States

```
┌─────────────────────────────────────────────────────────────────┐
│                     Cache State Timeline                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Query Fetched                                                  │
│       │                                                         │
│       ▼                                                         │
│    FRESH ──────────────────┐                                    │
│       │                    │ staleTime expires                  │
│       ▼                    ▼                                    │
│    STALE ─── refetch triggers (window focus, mount, etc.)       │
│       │                                                         │
│       │  gcTime expires (no observers)                          │
│       ▼                                                         │
│   GARBAGE COLLECTED (removed from cache)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### staleTime vs gcTime

```jsx
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,

  // staleTime: How long data is considered "fresh"
  // During this time, no refetches happen
  staleTime: 1000 * 60 * 5, // 5 minutes

  // gcTime (formerly cacheTime): How long INACTIVE cache lives
  // After unmount, cache is kept for this duration
  gcTime: 1000 * 60 * 30, // 30 minutes
});

// Example scenario:
// 1. User visits /users page - data fetched and cached
// 2. User navigates away - query becomes "inactive"
// 3. Within gcTime: User returns - cached data shown instantly
// 4. If staleTime passed: Background refetch happens
// 5. After gcTime: Cache is garbage collected
```

### Practical Example

```jsx
// Real-time data: Very short stale time
useQuery({
  queryKey: ['stock-price', symbol],
  queryFn: () => fetchStockPrice(symbol),
  staleTime: 1000, // Fresh for 1 second only
  refetchInterval: 5000, // Poll every 5 seconds
});

// Rarely changing data: Long stale time
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: 1000 * 60 * 60 * 24, // Fresh for 24 hours
  gcTime: Infinity, // Never garbage collect
});

// User profile: Medium stale time
useQuery({
  queryKey: ['user', 'profile'],
  queryFn: fetchUserProfile,
  staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
  gcTime: 1000 * 60 * 30, // Cache for 30 minutes
});
```

---

## Pagination and Infinite Queries

### Basic Pagination

```jsx
import { useQuery, keepPreviousData } from '@tanstack/react-query';

function PaginatedPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData, // Keep showing old data while fetching new
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
            {data.posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>

          <div>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isPlaceholderData || !data.hasMore}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

### Infinite Queries

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';

async function fetchPosts({ pageParam = 1 }) {
  const response = await fetch(`/api/posts?page=${pageParam}&limit=10`);
  return response.json();
}

function InfinitePostsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Return undefined to indicate no more pages
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      return firstPage.prevPage ?? undefined;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* Flatten pages into single list */}
      {data.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.posts.map((post) => (
            <article key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
            ? 'Load More'
            : 'No more posts'}
      </button>
    </div>
  );
}
```

### Infinite Scroll with Intersection Observer

```jsx
import { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteScrollList() {
  const loadMoreRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['items'],
      queryFn: fetchItems,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  // Intersection Observer for auto-loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div>
      {data?.pages.map((page) =>
        page.items.map((item) => <ItemCard key={item.id} item={item} />)
      )}

      {/* Sentinel element for infinite scroll */}
      <div ref={loadMoreRef}>{isFetchingNextPage && <LoadingSpinner />}</div>
    </div>
  );
}
```

---

## Optimistic Updates

### Basic Optimistic Update

```jsx
function TodoList() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateTodo,

    // Optimistic update
    onMutate: async (updatedTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update cache
      queryClient.setQueryData(['todos'], (old) =>
        old.map((todo) =>
          todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
        )
      );

      // Return context with snapshot
      return { previousTodos };
    },

    // Rollback on error
    onError: (err, updatedTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },

    // Refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (/* ... */);
}
```

### Complete CRUD with Optimistic Updates

```jsx
function useTodoMutations() {
  const queryClient = useQueryClient();

  // Add Todo (Optimistic)
  const addTodo = useMutation({
    mutationFn: createTodoApi,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previous = queryClient.getQueryData(['todos']);

      // Optimistically add with temporary ID
      queryClient.setQueryData(['todos'], (old) => [
        ...old,
        { ...newTodo, id: 'temp-' + Date.now() },
      ]);

      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Delete Todo (Optimistic)
  const deleteTodo = useMutation({
    mutationFn: deleteTodoApi,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previous = queryClient.getQueryData(['todos']);

      queryClient.setQueryData(['todos'], (old) =>
        old.filter((todo) => todo.id !== todoId)
      );

      return { previous };
    },
    onError: (err, todoId, context) => {
      queryClient.setQueryData(['todos'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return { addTodo, deleteTodo };
}
```

---

## Prefetching

### Prefetch on Hover

```jsx
import { useQueryClient } from '@tanstack/react-query';

function PostLink({ postId, title }) {
  const queryClient = useQueryClient();

  const prefetchPost = () => {
    queryClient.prefetchQuery({
      queryKey: ['post', postId],
      queryFn: () => fetchPost(postId),
      staleTime: 1000 * 60 * 5, // Don't prefetch if data is fresh
    });
  };

  return (
    <Link
      to={`/posts/${postId}`}
      onMouseEnter={prefetchPost}
      onFocus={prefetchPost}
    >
      {title}
    </Link>
  );
}
```

### Prefetch in Router Loaders

```jsx
// With React Router
import { createBrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/posts/:id',
    element: <PostPage />,
    loader: async ({ params }) => {
      // Prefetch before component renders
      await queryClient.ensureQueryData({
        queryKey: ['post', params.id],
        queryFn: () => fetchPost(params.id),
      });
      return null;
    },
  },
]);
```

### Prefetch Related Data

```jsx
function UserProfile({ userId }) {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Prefetch related data once user is loaded
  useEffect(() => {
    if (user) {
      queryClient.prefetchQuery({
        queryKey: ['user', userId, 'posts'],
        queryFn: () => fetchUserPosts(userId),
      });
      queryClient.prefetchQuery({
        queryKey: ['user', userId, 'followers'],
        queryFn: () => fetchUserFollowers(userId),
      });
    }
  }, [user, userId, queryClient]);

  return (/* ... */);
}
```

---

## Parallel and Dependent Queries

### Parallel Queries

```jsx
function Dashboard() {
  // These queries run in parallel automatically
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const commentsQuery = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
  });

  const isLoading =
    usersQuery.isLoading || postsQuery.isLoading || commentsQuery.isLoading;

  if (isLoading) return <Loading />;

  return (
    <div>
      <UserList users={usersQuery.data} />
      <PostList posts={postsQuery.data} />
      <CommentList comments={commentsQuery.data} />
    </div>
  );
}
```

### useQueries for Dynamic Parallel Queries

```jsx
import { useQueries } from '@tanstack/react-query';

function UserProfiles({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
  });

  const isLoading = userQueries.some((query) => query.isLoading);
  const isError = userQueries.some((query) => query.isError);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <div>
      {userQueries.map((query, index) => (
        <UserCard key={userIds[index]} user={query.data} />
      ))}
    </div>
  );
}
```

### Dependent (Serial) Queries

```jsx
function UserPosts({ userId }) {
  // First query
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Dependent query - only runs when user exists
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchPostsByUser(user.id),
    enabled: !!user?.id, // Only run when user.id is available
  });

  if (!user) return <Loading />;

  return (
    <div>
      <h2>{user.name}'s Posts</h2>
      {postsLoading ? <Loading /> : <PostList posts={posts} />}
    </div>
  );
}
```

---

## Error Handling

### Basic Error Handling

```jsx
function Posts() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    retry: 3, // Retry 3 times before showing error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="error">
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    );
  }

  return <PostList posts={data} />;
}
```

### Global Error Handler

```jsx
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Global error handling
      if (error.status === 401) {
        // Redirect to login
        window.location.href = '/login';
      }

      // Show toast notification
      toast.error(`Something went wrong: ${error.message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      toast.error(`Mutation failed: ${error.message}`);
    },
  }),
});
```

### Error Boundaries with TanStack Query

```jsx
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          <h2>Something went wrong</h2>
          <pre>{error.message}</pre>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}
    >
      <Suspense fallback={<Loading />}>
        <Posts />
      </Suspense>
    </ErrorBoundary>
  );
}

// Component using suspense
function Posts() {
  const { data } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return <PostList posts={data} />;
}
```

---

## DevTools

### Setup

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {/* DevTools only in development */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}
```

### DevTools Features

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Query DevTools                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Features:                                                      │
│  - View all queries and their states                            │
│  - Inspect cached data                                          │
│  - Manually refetch/invalidate queries                          │
│  - View query timelines                                         │
│  - Filter queries by status (fresh, fetching, stale, inactive)  │
│  - See mutations and their states                               │
│                                                                 │
│  Query States Color Coding:                                     │
│  🟢 Fresh - Data is fresh, no background refetch needed         │
│  🟡 Fetching - Currently fetching data                          │
│  🟠 Stale - Data is stale, will refetch on trigger              │
│  ⚫ Inactive - No components subscribed to this query           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Best Practices

### 1. Organize Query Functions

```jsx
// api/users.js
export const userApi = {
  getAll: async () => {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error('User not found');
    return res.json();
  },

  create: async (userData) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },

  update: async ({ id, ...data }) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete user');
  },
};
```

### 2. Custom Hooks for Queries

```jsx
// hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/users';
import { queryKeys } from '../queryKeys';

export function useUsers(options = {}) {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: userApi.getAll,
    ...options,
  });
}

export function useUser(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
```

### 3. Usage in Components

```jsx
// Clean component code using custom hooks
function UserManagement() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const handleCreate = (userData) => {
    createUser.mutate(userData, {
      onSuccess: () => toast.success('User created!'),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDelete = (id) => {
    deleteUser.mutate(id, {
      onSuccess: () => toast.success('User deleted!'),
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <UserForm onSubmit={handleCreate} isLoading={createUser.isPending} />
      <UserList users={users} onDelete={handleDelete} />
    </div>
  );
}
```

### 4. Type Safety with TypeScript

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserInput {
  name: string;
  email: string;
}

// Typed query hook
export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });
}

// Typed mutation hook
export function useCreateUser() {
  return useMutation<User, Error, CreateUserInput>({
    mutationFn: async (input) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return res.json();
    },
  });
}
```

---

## TanStack Query vs useEffect

### Before: Manual Data Fetching

```jsx
// ❌ Lots of boilerplate and edge cases
function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setUsers(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // No caching, no background refetch, no retry...
}
```

### After: TanStack Query

```jsx
// ✅ Clean, with caching, retry, background refetch built-in
function UserList() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Automatic caching, deduplication, retry, background refetch!
}
```

### Feature Comparison

| Feature                | useEffect  | TanStack Query      |
| ---------------------- | ---------- | ------------------- |
| Basic fetching         | ✅ Manual  | ✅ Built-in         |
| Loading state          | ✅ Manual  | ✅ Automatic        |
| Error state            | ✅ Manual  | ✅ Automatic        |
| Caching                | ❌ Manual  | ✅ Built-in         |
| Deduplication          | ❌ None    | ✅ Automatic        |
| Background refetch     | ❌ Manual  | ✅ Built-in         |
| Retry logic            | ❌ Manual  | ✅ Configurable     |
| Pagination             | ❌ Manual  | ✅ Helpers          |
| Infinite scroll        | ❌ Manual  | ✅ useInfiniteQuery |
| Optimistic updates     | ❌ Complex | ✅ Simplified       |
| DevTools               | ❌ None    | ✅ Excellent        |
| Stale while revalidate | ❌ Manual  | ✅ Built-in         |
| Window focus refetch   | ❌ Manual  | ✅ Built-in         |

---

## Quick Reference Cheatsheet

```jsx
// Basic Query
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFn,
});

// Query with variables
const { data } = useQuery({
  queryKey: ['key', variable],
  queryFn: () => fetchFn(variable),
  enabled: !!variable,
});

// Mutation
const mutation = useMutation({
  mutationFn: createFn,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['key'] }),
});

// Infinite Query
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['key'],
  queryFn: fetchFn,
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// Prefetch
queryClient.prefetchQuery({ queryKey: ['key'], queryFn: fetchFn });

// Invalidate
queryClient.invalidateQueries({ queryKey: ['key'] });

// Set cache directly
queryClient.setQueryData(['key'], newData);

// Get cache
const data = queryClient.getQueryData(['key']);
```

---

## Summary

TanStack Query transforms data fetching in React by providing:

1. **Automatic Caching** - No more manual cache management
2. **Background Updates** - Keep data fresh without user intervention
3. **Deduplication** - Multiple components, one request
4. **Optimistic Updates** - Instant UI feedback
5. **DevTools** - Debug and inspect queries easily
6. **TypeScript Support** - Full type safety

**When to use TanStack Query:**

- Any server state management
- Complex caching requirements
- Real-time or frequently updated data
- Large applications with many API calls

**When useEffect might be enough:**

- One-time data fetch on mount
- Very simple applications
- Non-API side effects (timers, event listeners)

---

## Practice Exercises

1. Build a products page with useQuery and pagination
2. Create a CRUD app using useMutation with optimistic updates
3. Implement infinite scroll for a social media feed
4. Build a search feature with debounced queries
5. Create a dashboard that prefetches data on hover

---

_Previous: [17-javascript-fundamentals.md](./17-javascript-fundamentals.md)_

_Back to: [00-index.md](./00-index.md)_

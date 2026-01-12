# HTTP Requests in React - Complete Revision Guide

## Table of Contents

1. [Fetch API Basics](#fetch-api-basics)
2. [useEffect for Data Fetching](#useeffect-for-data-fetching)
3. [Handling Loading and Errors](#handling-loading-and-errors)
4. [Sending Data (POST, PUT, DELETE)](#sending-data-post-put-delete)
5. [Custom Hooks for HTTP](#custom-hooks-for-http)
6. [AbortController and Cleanup](#abortcontroller-and-cleanup)
7. [Optimistic Updates](#optimistic-updates)
8. [Best Practices](#best-practices)

---

## Fetch API Basics

### Simple GET Request

```javascript
// Basic fetch
const response = await fetch('https://api.example.com/data');
const data = await response.json();

// With error handling
const response = await fetch('https://api.example.com/data');
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
```

### POST Request

```javascript
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
});

const result = await response.json();
```

### All HTTP Methods

```javascript
// GET
fetch(url);

// POST
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// PUT
fetch(url, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// PATCH
fetch(url, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(partialData),
});

// DELETE
fetch(url, { method: 'DELETE' });
```

---

## useEffect for Data Fetching

### Basic Data Fetching

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://api.example.com/users');

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []); // Empty array = runs once on mount

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Fetching on Dependency Change

```jsx
function UserDetails({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);

      try {
        const response = await fetch(`https://api.example.com/users/${userId}`);

        if (!response.ok) {
          throw new Error('User not found');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]); // Re-fetch when userId changes

  if (isLoading) return <p>Loading user...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## Handling Loading and Errors

### Complete State Management

```jsx
function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Render different UI based on state
  if (isLoading) {
    return (
      <div className="loading">
        <Spinner />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Failed to load products</p>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <ul className="products">
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Separate Loading/Error Components

```jsx
// LoadingSpinner.jsx
function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

// ErrorMessage.jsx
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Try Again</button>}
    </div>
  );
}

// Usage
function DataComponent() {
  const { data, isLoading, error, refetch } = useFetch('/api/data');

  if (isLoading) return <LoadingSpinner message="Fetching data..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return <DataDisplay data={data} />;
}
```

---

## Sending Data (POST, PUT, DELETE)

### Creating New Data (POST)

```jsx
function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      console.log('Created:', newPost);

      // Reset form
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        disabled={isSubmitting}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        disabled={isSubmitting}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

### Updating Data (PUT/PATCH)

```jsx
function EditPost({ postId, initialData, onUpdate }) {
  const [formData, setFormData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT', // or 'PATCH' for partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPost = await response.json();
      onUpdate(updatedPost);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        disabled={isUpdating}
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        disabled={isUpdating}
      />
      <button type="submit" disabled={isUpdating}>
        {isUpdating ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
```

### Deleting Data (DELETE)

```jsx
function DeleteButton({ postId, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      onDelete(postId);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isDeleting} className="delete-btn">
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## Custom Hooks for HTTP

### useFetch Hook

```jsx
import { useState, useEffect, useCallback } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [url]); // options intentionally excluded to prevent infinite loops

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

// Usage
function ProductList() {
  const { data, isLoading, error, refetch } = useFetch('/api/products');

  if (isLoading) return <p>Loading...</p>;
  if (error) return <button onClick={refetch}>Error! Click to retry</button>;

  return (
    <ul>
      {data.products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### useHttp Hook (More Comprehensive)

```jsx
import { useState, useCallback } from 'react';

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method || 'GET',
        headers: requestConfig.headers || {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();

      // Apply the data using the provided callback
      if (applyData) {
        applyData(data);
      }

      return data;
    } catch (err) {
      setError(err.message || 'Something went wrong!');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
}

// Usage
function TasksComponent() {
  const [tasks, setTasks] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttp();

  // Fetch tasks
  useEffect(() => {
    sendRequest({ url: '/api/tasks' }, (data) => setTasks(data.tasks));
  }, [sendRequest]);

  // Add a new task
  const addTaskHandler = async (taskText) => {
    await sendRequest(
      {
        url: '/api/tasks',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { text: taskText },
      },
      (data) => setTasks((prev) => [...prev, data.task])
    );
  };

  // Delete a task
  const deleteTaskHandler = async (taskId) => {
    await sendRequest({
      url: `/api/tasks/${taskId}`,
      method: 'DELETE',
    });
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div>
      {error && (
        <div className="error">
          {error}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}

      <TaskForm onAddTask={addTaskHandler} isLoading={isLoading} />

      {isLoading && <p>Loading...</p>}

      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={() => deleteTaskHandler(task.id)}
          />
        ))}
      </ul>
    </div>
  );
}
```

### useApi Hook with Multiple Operations

```jsx
function useApi(baseUrl) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const get = (endpoint) => request(endpoint);

  const post = (endpoint, body) => request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  });

  const put = (endpoint, body) => request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  });

  const del = (endpoint) => request(endpoint, {
    method: 'DELETE'
  });

  return { get, post, put, del, isLoading, error };
}

// Usage
function UserManager() {
  const [users, setUsers] = useState([]);
  const api = useApi('https://api.example.com');

  useEffect(() => {
    api.get('/users')
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  const createUser = async (userData) => {
    const newUser = await api.post('/users', userData);
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = async (id, userData) => {
    const updated = await api.put(`/users/${id}`, userData);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  };

  const deleteUser = async (id) => {
    await api.del(`/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    // ...render component
  );
}
```

---

## AbortController and Cleanup

### Canceling Fetch Requests

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Create an AbortController
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchResults() {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal } // Pass signal to fetch
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data.results);
      } catch (err) {
        // Don't update state if request was aborted
        if (err.name === 'AbortError') {
          console.log('Request was cancelled');
          return;
        }
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();

    // Cleanup: abort the request if component unmounts
    // or if query changes before request completes
    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      {isLoading && <p>Searching...</p>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Debounced Search with Abort

```jsx
import { useState, useEffect, useRef } from 'react';

function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Debounce delay
    const timeoutId = setTimeout(() => {
      // Create new controller for this request
      abortControllerRef.current = new AbortController();

      async function search() {
        setIsLoading(true);

        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`,
            { signal: abortControllerRef.current.signal }
          );

          if (!response.ok) throw new Error('Search failed');

          const data = await response.json();
          setResults(data.results);
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error(err);
          }
        } finally {
          setIsLoading(false);
        }
      }

      search();
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <p>Searching...</p>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Optimistic Updates

Update UI immediately, then sync with server.

### Optimistic Delete

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const deleteTodo = async (id) => {
    // Store current state for rollback
    const previousTodos = todos;

    // Optimistically remove from UI
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }
    } catch (error) {
      // Rollback on error
      setTodos(previousTodos);
      alert('Failed to delete. Please try again.');
    }
  };

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Optimistic Update with Temporary ID

```jsx
function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);

  const addComment = async (text) => {
    // Create optimistic comment with temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      text,
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    // Add to UI immediately
    setComments((prev) => [...prev, optimisticComment]);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const savedComment = await response.json();

      // Replace temp comment with real one
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? savedComment : c))
      );
    } catch (error) {
      // Remove optimistic comment on error
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      alert('Failed to add comment');
    }
  };

  return (
    <div>
      <CommentForm onSubmit={addComment} />
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} style={{ opacity: comment.isPending ? 0.5 : 1 }}>
            {comment.text}
            {comment.isPending && ' (saving...)'}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Best Practices

### 1. Centralize API Calls

```jsx
// api/config.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// api/http.js
export async function httpRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// api/users.js
import { httpRequest } from './http';

export const usersApi = {
  getAll: () => httpRequest('/users'),
  getById: (id) => httpRequest(`/users/${id}`),
  create: (data) =>
    httpRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    httpRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    httpRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};
```

### 2. Handle All States

```jsx
function DataComponent() {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
  });

  // Always handle: loading, error, empty, success
  if (state.isLoading) return <Loading />;
  if (state.error) return <Error message={state.error} />;
  if (!state.data || state.data.length === 0) return <Empty />;

  return <DataList data={state.data} />;
}
```

### 3. Show Loading Feedback

```jsx
// Button loading state
<button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Spinner /> Saving...
    </>
  ) : (
    'Save'
  )}
</button>;

// Skeleton loading
{
  isLoading ? (
    <div className="skeleton">
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
    </div>
  ) : (
    <Content data={data} />
  );
}
```

### 4. Retry Logic

```jsx
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      lastError = error;
      // Wait before retrying (exponential backoff)
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
    }
  }

  throw lastError;
}
```

### 5. Cache Responses

```jsx
const cache = new Map();

function useCachedFetch(url, ttl = 60000) {
  const [data, setData] = useState(() => cache.get(url)?.data);
  const [isLoading, setIsLoading] = useState(!cache.has(url));

  useEffect(() => {
    const cached = cache.get(url);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < ttl) {
      setData(cached.data);
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      const response = await fetch(url);
      const result = await response.json();

      // Cache the result
      cache.set(url, {
        data: result,
        timestamp: Date.now(),
      });

      setData(result);
      setIsLoading(false);
    }

    fetchData();
  }, [url, ttl]);

  return { data, isLoading };
}
```

---

## Summary Cheat Sheet

```jsx
// Basic fetch in useEffect
useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setData(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }
  fetchData();
}, [url]);

// POST request
await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// Abort on cleanup
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal });

  return () => controller.abort();
}, [url]);

// Optimistic update pattern
const previous = state;
setState(optimistic);
try {
  await api.update();
} catch {
  setState(previous);
}
```

---

## Practice Exercises

1. Build a data table with pagination
2. Create a search with autocomplete
3. Build a CRUD app for managing items
4. Implement infinite scroll loading
5. Create a dashboard with multiple API calls

---

_Next: [10-styling.md](./10-styling.md)_

# React Performance Optimization - Complete Revision Guide

## Table of Contents

1. [Understanding React Rendering](#understanding-react-rendering)
2. [React.memo](#reactmemo)
3. [useCallback](#usecallback)
4. [useMemo](#usememo)
5. [Key Prop Optimization](#key-prop-optimization)
6. [State Management Optimization](#state-management-optimization)
7. [Code Splitting](#code-splitting)
8. [Profiling and Debugging](#profiling-and-debugging)
9. [Best Practices](#best-practices)

---

## Understanding React Rendering

### When Does React Re-render?

A component re-renders when:

1. **Its state changes** (via `useState` or `useReducer`)
2. **Its props change** (parent passes new values)
3. **Its parent re-renders** (even if props are the same!)
4. **Context it consumes changes**

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  console.log('Parent renders');

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>

      {/* Child re-renders too, even though it has no props! */}
      <Child />
    </div>
  );
}

function Child() {
  console.log('Child renders'); // Logs every time Parent renders
  return <p>I'm a child</p>;
}
```

### The Virtual DOM Reconciliation Process

```jsx
// 1. Component function is called (render phase)
// 2. New virtual DOM is created
// 3. React compares new vDOM with previous (diffing)
// 4. Only actual differences are applied to real DOM (commit phase)

// Even if the actual DOM doesn't change,
// the component function still executes!
```

---

## React.memo

`React.memo` prevents re-rendering when props haven't changed.

### Basic Usage

```jsx
import { memo } from 'react';

// Without memo - re-renders whenever parent renders
function ExpensiveList({ items }) {
  console.log('ExpensiveList renders');
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// With memo - only re-renders when `items` actually changes
const MemoizedList = memo(function ExpensiveList({ items }) {
  console.log('MemoizedList renders');
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});
```

### How memo Works

```jsx
const Child = memo(function Child({ name, age }) {
  console.log('Child renders');
  return (
    <p>
      {name} is {age} years old
    </p>
  );
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>

      {/* Won't re-render when count changes */}
      {/* because name and age stay the same */}
      <Child name="John" age={25} />
    </div>
  );
}
```

### Custom Comparison Function

```jsx
const MemoizedComponent = memo(
  function MyComponent({ user, onClick }) {
    return <div onClick={onClick}>{user.name}</div>;
  },
  // Custom comparison (arePropsEqual)
  (prevProps, nextProps) => {
    // Return true if props are equal (don't re-render)
    // Return false if props are different (do re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### When memo Doesn't Help

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New object every render - memo won't help!
  const user = { name: 'John', age: 25 };

  // ❌ New function every render - memo won't help!
  const handleClick = () => console.log('clicked');

  return <MemoizedChild user={user} onClick={handleClick} />;
}

// Solution: Use useMemo for objects and useCallback for functions
```

---

## useCallback

`useCallback` memoizes functions so they maintain referential equality between renders.

### The Problem

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New function created every render
  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>

      {/* MemoizedChild re-renders because handleClick is new! */}
      <MemoizedChild onClick={handleClick} />
    </>
  );
}
```

### The Solution

```jsx
import { useCallback, memo } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // ✅ Same function reference between renders
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // Empty deps = never changes

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>

      {/* MemoizedChild won't re-render */}
      <MemoizedChild onClick={handleClick} />
    </>
  );
}

const MemoizedChild = memo(function Child({ onClick }) {
  console.log('Child renders');
  return <button onClick={onClick}>Click me</button>;
});
```

### With Dependencies

```jsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Function depends on `query`, so include it in deps
  const handleSearch = useCallback(() => {
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data));
  }, [query]); // Re-creates when query changes

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchButton onSearch={handleSearch} />
      <SearchResults results={results} />
    </div>
  );
}
```

### Using Functional Updates to Reduce Dependencies

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ Includes count in dependencies
  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]); // Changes every time count changes

  // ✅ No dependency on count
  const incrementBetter = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []); // Never changes!

  return <MemoizedButton onClick={incrementBetter} />;
}
```

### Common Pattern: Event Handlers

```jsx
function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          // ❌ New function for each item, each render
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </ul>
  );
}

// ✅ Better: Pass id and let child handle it
function TodoItem({ todo, onToggle, onDelete }) {
  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [todo.id, onDelete]);

  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={handleToggle} />
      {todo.text}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
```

---

## useMemo

`useMemo` memoizes computed values to avoid expensive recalculations.

### Basic Usage

```jsx
import { useMemo } from 'react';

function ExpensiveComponent({ items, filter }) {
  // ❌ Filters on every render
  const filteredItems = items.filter((item) => item.name.includes(filter));

  // ✅ Only recalculates when items or filter changes
  const filteredItemsMemo = useMemo(() => {
    console.log('Filtering...');
    return items.filter((item) => item.name.includes(filter));
  }, [items, filter]);

  return (
    <ul>
      {filteredItemsMemo.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Preserving Object/Array References

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New object every render
  const config = { theme: 'dark', size: 'large' };

  // ✅ Same object reference unless values change
  const configMemo = useMemo(
    () => ({
      theme: 'dark',
      size: 'large',
    }),
    []
  ); // Empty deps = never changes

  return <MemoizedChild config={configMemo} />;
}
```

### Expensive Calculations

```jsx
function DataGrid({ data, sortColumn, sortDirection }) {
  // Expensive sort operation
  const sortedData = useMemo(() => {
    console.log('Sorting data...');

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <table>
      {sortedData.map((row) => (
        <tr key={row.id}>...</tr>
      ))}
    </table>
  );
}
```

### Derived State with useMemo

```jsx
function ShoppingCart({ items }) {
  // Calculate totals only when items change
  const { subtotal, tax, total, itemCount } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, tax, total, itemCount };
  }, [items]);

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

### useMemo vs useCallback

```jsx
// useMemo: memoizes a VALUE
const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);

// useCallback: memoizes a FUNCTION
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);

// These are equivalent:
const memoizedFn = useMemo(() => () => doSomething(), []);
const memoizedFn = useCallback(() => doSomething(), []);
```

---

## Key Prop Optimization

The `key` prop helps React identify which items have changed, been added, or removed.

### Why Keys Matter

```jsx
// ❌ Using index as key - problematic for reordering/filtering
{
  items.map((item, index) => <Item key={index} item={item} />);
}

// ✅ Using unique id - React can track each item
{
  items.map((item) => <Item key={item.id} item={item} />);
}
```

### Keys and Component State

```jsx
// Problem: Using index as key with stateful components
function BadList() {
  const [items, setItems] = useState(['A', 'B', 'C']);

  const removeFirst = () => {
    setItems(items.slice(1));
  };

  return (
    <>
      <button onClick={removeFirst}>Remove First</button>
      {items.map((item, index) => (
        // ❌ After removing 'A', React thinks 'B' is at index 0
        // so it reuses the DOM/state from what was 'A'
        <InputWithState key={index} label={item} />
      ))}
    </>
  );
}

// Solution: Use stable unique IDs
function GoodList() {
  const [items, setItems] = useState([
    { id: 1, label: 'A' },
    { id: 2, label: 'B' },
    { id: 3, label: 'C' },
  ]);

  const removeFirst = () => {
    setItems(items.slice(1));
  };

  return (
    <>
      <button onClick={removeFirst}>Remove First</button>
      {items.map((item) => (
        // ✅ React correctly tracks each item by id
        <InputWithState key={item.id} label={item.label} />
      ))}
    </>
  );
}
```

### Using Key to Reset Component State

```jsx
function App() {
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <button onClick={() => setUserId((u) => u + 1)}>Next User</button>

      {/* Key forces complete remount when userId changes */}
      <UserProfile key={userId} userId={userId} />
    </div>
  );
}

function UserProfile({ userId }) {
  // This state resets when key changes
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <h2>User {userId}</h2>
      {/* ... */}
    </div>
  );
}
```

---

## State Management Optimization

### Lift State Down

```jsx
// ❌ State too high - all children re-render
function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <Header />
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <MainContent /> {/* Re-renders on every keystroke! */}
      <Footer /> {/* Re-renders on every keystroke! */}
    </div>
  );
}

// ✅ State where it's needed
function App() {
  return (
    <div>
      <Header />
      <SearchSection /> {/* Contains its own state */}
      <MainContent /> {/* Doesn't re-render */}
      <Footer /> {/* Doesn't re-render */}
    </div>
  );
}

function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <SearchResults query={searchQuery} />
    </div>
  );
}
```

### Split State

```jsx
// ❌ Single state object - all updates trigger full re-render
function Form() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
  });

  // Every field change re-renders everything
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
}

// ✅ Split state by update frequency
function Form() {
  const [personalInfo, setPersonalInfo] = useState({ name: '', email: '' });
  const [addressInfo, setAddressInfo] = useState({
    address: '',
    city: '',
    country: '',
  });

  // Can now update sections independently
}
```

### Batching State Updates

```jsx
// React 18 automatically batches these
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  setName('John');
  // Only ONE re-render!
}

// Also batched in async code (React 18+)
async function handleSubmit() {
  await submitForm();
  setStatus('success');
  setMessage('Form submitted!');
  // Only ONE re-render!
}
```

### Using useReducer for Complex State

```jsx
// When multiple state values change together
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function DataFetcher() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  // Single dispatch updates multiple values atomically
  const fetchData = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await api.getData();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };
}
```

---

## Code Splitting

### React.lazy and Suspense

```jsx
import { lazy, Suspense } from 'react';

// Dynamically import components
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
const Profile = lazy(() => import('./Profile'));

function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div>
      <nav>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('settings')}>Settings</button>
        <button onClick={() => setPage('profile')}>Profile</button>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'settings' && <Settings />}
        {page === 'profile' && <Profile />}
      </Suspense>
    </div>
  );
}
```

### With React Router

```jsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### Named Exports with Lazy

```jsx
// ❌ lazy only works with default exports
const MyComponent = lazy(() => import('./MyComponent'));

// ✅ For named exports, use then()
const MyComponent = lazy(() =>
  import('./MyComponents').then((module) => ({
    default: module.MyComponent,
  }))
);
```

---

## Profiling and Debugging

### React DevTools Profiler

```jsx
// Enable in React DevTools
// 1. Open DevTools
// 2. Go to "Profiler" tab
// 3. Click "Record"
// 4. Interact with your app
// 5. Click "Stop"
// 6. Analyze the flamegraph

// Highlights:
// - Yellow/Red = slow renders
// - Gray = didn't render
// - Hover for details
```

### console.log Debugging

```jsx
function MyComponent({ data }) {
  console.log('MyComponent renders', { data });

  useEffect(() => {
    console.log('Effect runs');
  }, [data]);

  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value');
    return computeExpensive(data);
  }, [data]);

  return <div>{expensiveValue}</div>;
}
```

### React.Profiler Component

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id, // Profiler tree "id"
  phase, // "mount" or "update"
  actualDuration, // Time spent rendering
  baseDuration, // Estimated time without memoization
  startTime, // When React started rendering
  commitTime, // When React committed
  interactions // Set of interactions
) {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
  });
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Header />
      <Profiler id="MainContent" onRender={onRenderCallback}>
        <MainContent />
      </Profiler>
      <Footer />
    </Profiler>
  );
}
```

### Why Did You Render Library

```bash
npm install @welldone-software/why-did-you-render
```

```jsx
// wdyr.js - import at the top of your index.js
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// Then in your component
MyComponent.whyDidYouRender = true;
```

---

## Best Practices

### 1. Don't Optimize Prematurely

```jsx
// ❌ Unnecessary optimization
const SimpleComponent = memo(function Simple({ text }) {
  return <span>{text}</span>;
});

// ✅ Only optimize when needed
// - Component renders frequently
// - Renders are slow
// - Props rarely change
```

### 2. Measure Before Optimizing

```jsx
// Use React DevTools Profiler
// Use browser Performance tab
// Use React.Profiler component

// Questions to ask:
// - Is this actually slow?
// - How often does it render?
// - What's causing the re-render?
```

### 3. Structure Components for Performance

```jsx
// ❌ Everything in one component
function App() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <ItemList data={data} selectedId={selectedId} />
      <ItemDetail id={selectedId} />
    </div>
  );
}

// ✅ Separated by update frequency
function App() {
  return (
    <div>
      <SearchSection /> {/* Has its own state */}
      <DataSection /> {/* Has its own state */}
    </div>
  );
}
```

### 4. Use Keys Correctly

```jsx
// ❌ Don't use index as key with dynamic lists
{
  items.map((item, index) => <Item key={index} />);
}

// ✅ Use stable unique IDs
{
  items.map((item) => <Item key={item.id} />);
}

// ✅ Index is OK for static lists that never reorder
{
  staticTabs.map((tab, index) => <Tab key={index} />);
}
```

### 5. Memoize Expensive Operations

```jsx
// Expensive calculations → useMemo
const sortedItems = useMemo(() => [...items].sort(complexSort), [items]);

// Callback props for memoized children → useCallback
const handleClick = useCallback(() => {
  doSomething();
}, []);

// Expensive child components → memo
const ExpensiveChild = memo(function ExpensiveChild({ data }) {
  // Expensive render
});
```

### 6. Avoid Creating Objects/Arrays in Render

```jsx
// ❌ New object every render
<MemoizedChild style={{ color: 'red' }} />
<MemoizedChild items={[1, 2, 3]} />
<MemoizedChild config={{ theme: 'dark' }} />

// ✅ Define outside or memoize
const style = { color: 'red' };
const items = [1, 2, 3];

function Parent() {
  const config = useMemo(() => ({ theme: 'dark' }), []);

  return (
    <>
      <MemoizedChild style={style} />
      <MemoizedChild items={items} />
      <MemoizedChild config={config} />
    </>
  );
}
```

---

## Summary Cheat Sheet

```jsx
// memo - Prevent re-render if props unchanged
const MemoizedComponent = memo(MyComponent);

// useCallback - Stable function reference
const handleClick = useCallback(() => {
  doSomething(dep);
}, [dep]);

// useMemo - Memoize computed values
const expensiveValue = useMemo(() => {
  return computeExpensive(dep);
}, [dep]);

// Code Splitting
const LazyComponent = lazy(() => import('./Component'));
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>;

// Keys - Use stable unique IDs
{
  items.map((item) => <Item key={item.id} />);
}

// State - Keep it as low as possible
// Split state by update frequency
// Use useReducer for related state
```

---

## Optimization Decision Tree

```
Is the component slow?
├── No → Don't optimize
└── Yes
    ├── Does it render too often?
    │   ├── Props changing? → memo + check prop references
    │   ├── Parent state? → Move state down or use memo
    │   └── Context? → Split context or useMemo for value
    │
    └── Is each render slow?
        ├── Expensive calculations? → useMemo
        ├── Large list? → Virtualization (react-window)
        └── Many children? → Profile and optimize each
```

---

## Practice Exercises

1. Profile a slow component and identify the issue
2. Optimize a list with 1000 items using memo
3. Build a search filter without re-rendering the whole list
4. Implement code splitting in a multi-page app
5. Create a context that doesn't cause unnecessary re-renders

---

_Congratulations! You've completed the React revision guide series._

_Go back to: [00-index.md](./00-index.md)_

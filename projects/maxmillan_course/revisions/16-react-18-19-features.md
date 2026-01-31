# React 18/19 New Features - Complete Revision Guide

## Table of Contents

1. [React 18 Overview](#react-18-overview)
2. [Automatic Batching](#automatic-batching)
3. [Transitions](#transitions)
4. [useTransition Hook](#usetransition-hook)
5. [useDeferredValue Hook](#usedeferredvalue-hook)
6. [useId Hook](#useid-hook)
7. [Suspense Improvements](#suspense-improvements)
8. [Concurrent Rendering](#concurrent-rendering)
9. [React 19 Features](#react-19-features)
10. [Server Components](#server-components)
11. [Migration Guide](#migration-guide)

---

## React 18 Overview

### Key Features

- **Concurrent Rendering**: React can prepare multiple versions of UI simultaneously
- **Automatic Batching**: Multiple state updates batched automatically
- **Transitions**: Mark updates as non-urgent
- **New Hooks**: `useTransition`, `useDeferredValue`, `useId`
- **Suspense Improvements**: Works with SSR and concurrent features

### Upgrading to React 18

```jsx
// Before React 18
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18+
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## Automatic Batching

### What Is Batching?

Batching groups multiple state updates into a single re-render for better performance.

### Before React 18

```jsx
// React 17: Only batched in React event handlers
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // Only ONE re-render (batched) ✅
}

// But NOT batched in promises, setTimeout, etc.
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // TWO re-renders! ❌
}, 1000);

fetch('/api').then(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // TWO re-renders! ❌
});
```

### React 18: Automatic Batching

```jsx
// React 18: Batched EVERYWHERE automatically
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // ONE re-render ✅
}

setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // ONE re-render ✅ (Now batched!)
}, 1000);

fetch('/api').then(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // ONE re-render ✅ (Now batched!)
});
```

### Opting Out of Batching

```jsx
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount((c) => c + 1);
  });
  // Re-render happens here

  flushSync(() => {
    setFlag((f) => !f);
  });
  // Another re-render happens here
}
```

---

## Transitions

### What Are Transitions?

Transitions let you mark updates as **non-urgent**, allowing urgent updates (like typing) to interrupt them.

### Urgent vs Non-Urgent Updates

```jsx
// Urgent: Direct user input (typing, clicking)
// - Must feel instant
// - Examples: typing in input, clicking button

// Non-urgent (Transition): Background updates
// - Can be delayed
// - Examples: filtering lists, rendering search results
```

### Without Transitions

```jsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // Urgent: update input

    // This also runs immediately - can cause lag!
    setResults(filterLargeList(value));
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <ResultsList results={results} />
    </div>
  );
}
```

---

## useTransition Hook

### Basic Usage

```jsx
import { useState, useTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;

    // Urgent: Update input immediately
    setQuery(value);

    // Non-urgent: Wrap in transition
    startTransition(() => {
      setResults(filterLargeList(value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Loading results...</p>}
      <ResultsList results={results} />
    </div>
  );
}
```

### Tab Switching Example

```jsx
function TabContainer() {
  const [tab, setTab] = useState('about');
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <div>
      <TabButtons onSelect={selectTab} activeTab={tab} />

      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        {tab === 'about' && <About />}
        {tab === 'posts' && <Posts />} {/* Heavy component */}
        {tab === 'contact' && <Contact />}
      </div>
    </div>
  );
}
```

### With Suspense

```jsx
function App() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newTab) => {
    startTransition(() => {
      setTab(newTab);
    });
  };

  return (
    <div>
      <Tabs onChange={handleTabChange} current={tab} />

      <Suspense fallback={<Spinner />}>
        {/* Transition allows showing old content while new loads */}
        <TabContent tab={tab} />
      </Suspense>
    </div>
  );
}
```

---

## useDeferredValue Hook

### What Is useDeferredValue?

`useDeferredValue` lets you **defer updating a part of the UI**. It's similar to `useTransition` but for values you don't control (like props).

### Basic Usage

```jsx
import { useState, useDeferredValue, memo } from 'react';

function SearchResults({ query }) {
  // Create a deferred version of the query
  const deferredQuery = useDeferredValue(query);

  // This value "lags behind" during typing
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      <HeavyResultsList query={deferredQuery} />
    </div>
  );
}

// Parent component
function Search() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <SearchResults query={query} />
    </div>
  );
}
```

### useDeferredValue vs useTransition

```jsx
// Use useTransition when:
// - You control the state update
// - You want to mark a specific setState as non-urgent

const [isPending, startTransition] = useTransition();
startTransition(() => {
  setState(newValue); // You control this
});

// Use useDeferredValue when:
// - You receive the value as a prop
// - You don't control when it updates

function Child({ value }) {
  const deferredValue = useDeferredValue(value); // Value from prop
  return <ExpensiveComponent data={deferredValue} />;
}
```

### Practical Example: Filtering List

```jsx
const LargeList = memo(function LargeList({ filter }) {
  // Expensive filtering
  const items = useMemo(() => {
    return generateLargeList().filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});

function FilterableList() {
  const [filter, setFilter] = useState('');
  const deferredFilter = useDeferredValue(filter);

  const isStale = filter !== deferredFilter;

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />

      <div
        style={{
          opacity: isStale ? 0.5 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        <LargeList filter={deferredFilter} />
      </div>
    </div>
  );
}
```

---

## useId Hook

### What Is useId?

`useId` generates **unique IDs** that are stable across server and client, solving hydration mismatches.

### The Problem It Solves

```jsx
// ❌ Problem: IDs change between server and client
function Input() {
  const id = Math.random().toString(); // Different on server vs client!

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
```

### useId Solution

```jsx
import { useId } from 'react';

function Input({ label }) {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}

// Generated ID looks like: ":r0:", ":r1:", etc.
```

### Multiple IDs in Same Component

```jsx
function Form() {
  const id = useId();

  return (
    <form>
      <label htmlFor={`${id}-firstName`}>First Name</label>
      <input id={`${id}-firstName`} />

      <label htmlFor={`${id}-lastName`}>Last Name</label>
      <input id={`${id}-lastName`} />

      <label htmlFor={`${id}-email`}>Email</label>
      <input id={`${id}-email`} type="email" />
    </form>
  );
}
```

### Accessibility with useId

```jsx
function PasswordInput() {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>Password</label>
      <input
        id={id}
        type="password"
        aria-describedby={descriptionId}
        aria-errormessage={errorId}
      />
      <p id={descriptionId}>Password must be at least 8 characters</p>
      <p id={errorId} role="alert">
        {error && error.message}
      </p>
    </div>
  );
}
```

### When NOT to Use useId

```jsx
// ❌ Don't use for list keys
{
  items.map((item) => {
    const id = useId(); // Wrong! Called in loop
    return <li key={id}>{item}</li>;
  });
}

// ✅ Use item's own ID for keys
{
  items.map((item) => <li key={item.id}>{item.name}</li>);
}
```

---

## Suspense Improvements

### Suspense on the Server (SSR)

React 18 adds support for Suspense during server-side rendering.

```jsx
// Server can stream HTML as it loads
function App() {
  return (
    <Layout>
      <Header />
      <Suspense fallback={<Spinner />}>
        {/* This can stream in later */}
        <MainContent />
      </Suspense>
      <Footer />
    </Layout>
  );
}
```

### Selective Hydration

```jsx
// React 18 can hydrate parts of the page independently
function App() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <Comments /> {/* Can hydrate before Sidebar */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Sidebar /> {/* Can hydrate independently */}
      </Suspense>
    </div>
  );
}
```

---

## Concurrent Rendering

### What Is Concurrent Rendering?

Concurrent rendering means React can:

- **Interrupt** rendering to handle more urgent updates
- **Prepare** multiple versions of UI in the background
- **Discard** work if it's no longer needed

### How It Works

```
Traditional Rendering:
Start → ████████████████████████ → Done (blocks everything)

Concurrent Rendering:
Start → ████ [urgent update] → ████ → ███ [more urgent] → █ → Done
         ↑                       ↑
    Can interrupt           Can resume
```

### Enabling Concurrent Features

```jsx
// Concurrent features are enabled by using createRoot
import { createRoot } from 'react-dom/client';

// This enables:
// - Automatic batching
// - useTransition
// - useDeferredValue
// - Suspense SSR
// - Selective hydration

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## React 19 Features

### useActionState (Form Actions)

```jsx
import { useActionState } from 'react';

async function submitForm(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    await login(email, password);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(submitForm, {
    success: false,
    error: null,
  });

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />

      {state.error && <p className="error">{state.error}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### useOptimistic

```jsx
import { useOptimistic } from 'react';

function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, sending: true }]
  );

  async function handleSubmit(formData) {
    const newTodo = { text: formData.get('text'), id: Date.now() };

    // Optimistically add todo
    addOptimisticTodo(newTodo);

    // Actually add to server
    await addTodo(newTodo);
  }

  return (
    <div>
      <form action={handleSubmit}>
        <input name="text" />
        <button>Add</button>
      </form>

      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} style={{ opacity: todo.sending ? 0.5 : 1 }}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### use() Hook

```jsx
import { use, Suspense } from 'react';

// use() can read promises
function UserProfile({ userPromise }) {
  const user = use(userPromise); // Suspends until resolved

  return <div>{user.name}</div>;
}

function App() {
  const userPromise = fetchUser(1);

  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

### use() with Context

```jsx
import { use } from 'react';

// Can conditionally read context!
function ThemeButton({ showTheme }) {
  if (showTheme) {
    const theme = use(ThemeContext); // OK in conditional!
    return <button className={theme}>Themed</button>;
  }

  return <button>Default</button>;
}
```

### Document Metadata

```jsx
// React 19: Built-in support for <title>, <meta>, <link>
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />

      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### Stylesheet Support

```jsx
// React 19: Stylesheets with precedence
function Component() {
  return (
    <>
      <link rel="stylesheet" href="styles.css" precedence="default" />
      <div className="styled">Content</div>
    </>
  );
}
```

### ref as a Prop

```jsx
// React 19: No more forwardRef needed!
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// Usage
function Form() {
  const inputRef = useRef(null);
  return <Input ref={inputRef} />;
}
```

---

## Server Components

### What Are Server Components?

Components that render **only on the server**. They:

- Have no client-side JavaScript
- Can directly access databases/filesystem
- Can't use hooks or event handlers

### Server vs Client Components

```jsx
// server-component.jsx (default in Next.js App Router)
// ✅ Can: fetch data, access DB, read files
// ❌ Cannot: useState, useEffect, onClick

async function ProductList() {
  // Direct database access!
  const products = await db.query('SELECT * FROM products');

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

// client-component.jsx
('use client'); // Mark as client component

// ✅ Can: useState, useEffect, onClick, browser APIs
// ❌ Cannot: Direct database access

import { useState } from 'react';

function AddToCartButton({ productId }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    await addToCart(productId);
    setIsAdding(false);
  };

  return (
    <button onClick={handleClick} disabled={isAdding}>
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Composition Pattern

```jsx
// Server Component (parent)
async function ProductPage({ id }) {
  const product = await db.products.find(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      {/* Client Component as child */}
      <AddToCartButton productId={id} />
    </div>
  );
}
```

---

## Migration Guide

### From React 17 to 18

```jsx
// 1. Update createRoot
// Before
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// After
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// 2. Update TypeScript types (if using)
// package.json
{
  "dependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}

// 3. Strict Mode now double-invokes effects
// This helps find bugs with cleanup
```

### Gradual Adoption

```jsx
// You can use React 18 without concurrent features
// Just use createRoot and your app works the same

// Then gradually add:
// - useTransition for non-urgent updates
// - useDeferredValue for expensive renders
// - Suspense for data fetching
```

---

## Quick Reference

```jsx
// Automatic Batching - Just works with createRoot!

// useTransition
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setExpensiveState(newValue);
});

// useDeferredValue
const deferredValue = useDeferredValue(value);
const isStale = value !== deferredValue;

// useId
const id = useId();
<label htmlFor={id}>Label</label>
<input id={id} />

// React 19: useActionState
const [state, action, isPending] = useActionState(serverAction, initialState);
<form action={action}>...</form>

// React 19: useOptimistic
const [optimistic, addOptimistic] = useOptimistic(state, updateFn);

// React 19: use()
const value = use(promise); // In Suspense boundary
const ctx = use(Context); // Can be conditional!
```

---

## 🎯 Common Interview Questions

### Q1: What is Concurrent Rendering in React 18?

**Answer:** Concurrent rendering allows React to work on multiple UI versions simultaneously. React can:

- Pause, resume, or abandon renders
- Keep UI responsive during expensive updates
- Prioritize urgent updates (typing) over non-urgent (search results)

### Q2: Explain useTransition and when to use it.

**Answer:** `useTransition` marks state updates as non-urgent:

```jsx
const [isPending, startTransition] = useTransition();
startTransition(() => setSearchResults(data));
```

Use for expensive renders that shouldn't block user input.

### Q3: What is Automatic Batching?

**Answer:** React 18 automatically groups multiple state updates into one re-render, even in:

- Promises (`.then()`)
- setTimeout/setInterval
- Native event handlers

Before React 18, only React event handlers were batched.

### Q4: What is useDeferredValue?

**Answer:** `useDeferredValue` returns a "stale" version of a value that can lag behind:

```jsx
const deferredQuery = useDeferredValue(query);
// UI stays responsive while expensive search updates
```

Use when you can't wrap the update in `startTransition`.

### Q5: What's new in React 19?

**Answer:** Key React 19 features:

- **useActionState**: Handle form submissions with pending state
- **useOptimistic**: Optimistic UI updates
- **use()**: Read promises and context in render
- **Server Components**: Components that run on the server
- **Enhanced ref handling**: ref as a prop (no forwardRef needed)

---

## Practice Exercises

1. Add useTransition to a search filter component
2. Implement useDeferredValue for a large list
3. Create accessible forms using useId
4. Build a data table with Suspense for loading states
5. Experiment with React 19's useOptimistic for a todo app

---

_Next: [17-javascript-fundamentals.md](./17-javascript-fundamentals.md)_

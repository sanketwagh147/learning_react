# React Hooks Deep Dive - Complete Revision Guide

## Table of Contents

1. [What are Hooks?](#what-are-hooks)
2. [Rules of Hooks](#rules-of-hooks)
3. [useState - State Hook](#usestate---state-hook)
4. [useEffect - Side Effects Hook](#useeffect---side-effects-hook)
5. [useRef - Reference Hook](#useref---reference-hook)
6. [useCallback - Memoized Callbacks](#usecallback---memoized-callbacks)
7. [useMemo - Memoized Values](#usememo---memoized-values)
8. [useContext - Context Hook](#usecontext---context-hook)
9. [useReducer - Reducer Hook](#usereducer---reducer-hook)
10. [Custom Hooks](#custom-hooks)
11. [useActionState (React 19)](#useactionstate-react-19)

---

## What are Hooks?

Hooks are **functions that let you "hook into" React state and lifecycle features** from function components.

### Before Hooks (Class Components)

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }

  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }

  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

### After Hooks (Function Components)

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

---

## Rules of Hooks

### Rule 1: Only Call Hooks at the Top Level

```jsx
// ❌ WRONG: Inside condition
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null); // ❌ Conditional hook
  }
}

// ❌ WRONG: Inside loop
function Component({ items }) {
  items.forEach((item) => {
    const [value, setValue] = useState(item); // ❌ Hook in loop
  });
}

// ❌ WRONG: Inside nested function
function Component() {
  function handleClick() {
    const [clicked, setClicked] = useState(false); // ❌ Hook in nested fn
  }
}

// ✅ CORRECT: At the top level
function Component({ isLoggedIn }) {
  const [user, setUser] = useState(null); // ✅ Top level
  const [count, setCount] = useState(0); // ✅ Top level

  if (isLoggedIn) {
    // Use state here, but don't define it here
  }
}
```

### Rule 2: Only Call Hooks from React Functions

```jsx
// ✅ CORRECT: React function component
function Component() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}

// ✅ CORRECT: Custom Hook
function useCustomHook() {
  const [state, setState] = useState(0);
  return [state, setState];
}

// ❌ WRONG: Regular JavaScript function
function regularFunction() {
  const [state, setState] = useState(0); // ❌ Not a React component!
}
```

---

## useState - State Hook

Already covered in detail in [02-state-management.md](./02-state-management.md).

### Quick Reference

```jsx
// Basic
const [count, setCount] = useState(0);

// With object
const [user, setUser] = useState({ name: '', email: '' });

// With array
const [items, setItems] = useState([]);

// Lazy initialization
const [data, setData] = useState(() => expensiveComputation());

// Functional update
setCount((prev) => prev + 1);

// Object update
setUser((prev) => ({ ...prev, name: 'New Name' }));

// Array update
setItems((prev) => [...prev, newItem]);
```

---

## useEffect - Side Effects Hook

`useEffect` lets you **synchronize a component with external systems** (DOM, APIs, timers, etc.).

### Basic Syntax

```jsx
useEffect(() => {
  // Side effect code here

  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]); // Dependency array
```

### Different Dependency Scenarios

```jsx
// 1. Run on EVERY render (rarely used)
useEffect(() => {
  console.log('Runs after every render');
});

// 2. Run ONLY on mount (empty dependency array)
useEffect(() => {
  console.log('Runs only once on mount');
}, []);

// 3. Run when SPECIFIC dependencies change
useEffect(() => {
  console.log('Runs when count changes');
}, [count]);

// 4. Run when ANY of multiple dependencies change
useEffect(() => {
  console.log('Runs when count or name changes');
}, [count, name]);
```

### Common Use Cases

#### Data Fetching

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // For cleanup

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        if (!cancelled) {
          // Only update if not cancelled
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    // Cleanup function
    return () => {
      cancelled = true;
    };
  }, [userId]); // Re-fetch when userId changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <div>{user?.name}</div>;
}
```

#### Event Listeners

```jsx
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    // Cleanup: Remove listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array = only on mount/unmount

  return (
    <p>
      {size.width} x {size.height}
    </p>
  );
}
```

#### Timers

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup: Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  return <p>Time: {seconds}s</p>;
}
```

#### Syncing with localStorage

```jsx
function Preferences() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Sync TO localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
      Theme: {theme}
    </button>
  );
}
```

#### Geolocation API

```jsx
function LocationFinder() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!location) return <p>Getting location...</p>;
  return (
    <p>
      Lat: {location.lat}, Lng: {location.lng}
    </p>
  );
}
```

### Cleanup Function

The cleanup function runs:

1. Before the effect runs again (when dependencies change)
2. When the component unmounts

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    console.log(`Connected to room ${roomId}`);

    return () => {
      connection.disconnect();
      console.log(`Disconnected from room ${roomId}`);
    };
  }, [roomId]);

  return <Chat roomId={roomId} />;
}

// Timeline:
// 1. Mount with roomId="general" → Connect to "general"
// 2. roomId changes to "random" → Disconnect from "general", Connect to "random"
// 3. Unmount → Disconnect from "random"
```

### Common Mistakes

```jsx
// ❌ WRONG: Missing dependency
function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId); // Uses userId but not in deps!
  }, []); // Missing userId

  // ✅ CORRECT: Include all dependencies
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
}

// ❌ WRONG: Object/array in dependencies (creates new reference each render)
function Component() {
  const options = { page: 1 }; // New object every render!

  useEffect(() => {
    fetch(options);
  }, [options]); // Will run on EVERY render!
}

// ✅ CORRECT: Use primitive values or useMemo
function Component() {
  const page = 1;

  useEffect(() => {
    fetch({ page });
  }, [page]); // Only re-runs when page changes
}
```

---

## useRef - Reference Hook

`useRef` returns a mutable ref object that:

1. **Persists across re-renders** (doesn't cause re-renders when changed)
2. Can hold a reference to a **DOM element** or any **mutable value**

### DOM References

```jsx
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // Access DOM element
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```

### Storing Mutable Values

Unlike state, changing a ref **does NOT trigger a re-render**:

```jsx
function StopWatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null); // Store interval ID

  const start = () => {
    if (intervalRef.current) return; // Already running

    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <p>Time: {time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Previous Value Pattern

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count; // Update after render
  });

  const prevCount = prevCountRef.current;

  return (
    <div>
      <p>
        Current: {count}, Previous: {prevCount}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

### State vs Ref

| Feature                     | useState     | useRef |
| --------------------------- | ------------ | ------ |
| **Triggers re-render**      | Yes          | No     |
| **Persists across renders** | Yes          | Yes    |
| **Can hold DOM reference**  | No           | Yes    |
| **Updates are synchronous** | No (batched) | Yes    |

```jsx
// When to use ref instead of state:
// - Storing previous values
// - Storing timer/interval IDs
// - DOM manipulation
// - Any value that shouldn't cause re-render when changed
```

---

## useCallback - Memoized Callbacks

`useCallback` returns a **memoized version of a callback** that only changes when dependencies change.

### The Problem

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ Creates new function on EVERY render
  const handleClick = () => {
    console.log('Clicked!');
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <ExpensiveChild onClick={handleClick} /> {/* Re-renders every time! */}
    </div>
  );
}

const ExpensiveChild = React.memo(({ onClick }) => {
  console.log('Child rendered'); // Logs on every parent render!
  return <button onClick={onClick}>Click me</button>;
});
```

### The Solution

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ✅ Same function reference unless dependencies change
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []); // Empty deps = never changes

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <ExpensiveChild onClick={handleClick} /> {/* Only renders once! */}
    </div>
  );
}
```

### With Dependencies

```jsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Re-creates when query changes (to capture new query value)
  const handleSearch = useCallback(() => {
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data));
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchButton onSearch={handleSearch} />
    </div>
  );
}
```

### useCallback with useEffect

```jsx
function Timer({ onTimeout, timeout }) {
  // Memoize callback used in useEffect
  const memoizedOnTimeout = useCallback(() => {
    onTimeout();
  }, [onTimeout]);

  useEffect(() => {
    const timer = setTimeout(memoizedOnTimeout, timeout);
    return () => clearTimeout(timer);
  }, [memoizedOnTimeout, timeout]);

  return <p>Timer running...</p>;
}
```

### When to Use

- Passing callbacks to optimized child components (wrapped in `React.memo`)
- Callbacks used as dependencies in `useEffect`
- Event handlers that cause re-renders in child components

### When NOT to Use

```jsx
// ❌ Don't wrap every function - adds overhead!
const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []); // Unnecessary if not passed to memoized child

// ✅ Just use regular function
const handleClick = () => {
  setCount((c) => c + 1);
};
```

---

## useMemo - Memoized Values

`useMemo` returns a **memoized value** that only recalculates when dependencies change.

### The Problem

```jsx
function ProductList({ products, filter }) {
  // ❌ Expensive filtering runs on EVERY render
  const filteredProducts = products.filter(p =>
    p.category === filter
  ).sort((a, b) => a.price - b.price);

  return (/* render list */);
}
```

### The Solution

```jsx
function ProductList({ products, filter }) {
  // ✅ Only recalculates when products or filter changes
  const filteredProducts = useMemo(() => {
    console.log('Filtering...'); // Only logs when deps change
    return products
      .filter((p) => p.category === filter)
      .sort((a, b) => a.price - b.price);
  }, [products, filter]);

  return (
    <ul>
      {filteredProducts.map((p) => (
        <li key={p.id}>
          {p.name} - ${p.price}
        </li>
      ))}
    </ul>
  );
}
```

### Prime Number Check Example

```jsx
function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);

  // Expensive calculation memoized
  const isPrime = useMemo(() => {
    console.log('Checking if prime...');
    return checkIfPrime(initialCount);
  }, [initialCount]); // Only rechecks when initialCount changes

  return (
    <div>
      <p>
        {initialCount} is {isPrime ? 'prime' : 'not prime'}
      </p>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}

function checkIfPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}
```

### useMemo vs useCallback

```jsx
// useMemo: Returns memoized VALUE
const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);

// useCallback: Returns memoized FUNCTION
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);

// They're equivalent:
useCallback(fn, deps) === useMemo(() => fn, deps);
```

### When to Use

- **Expensive calculations** that don't need to run every render
- **Referential equality** for objects/arrays passed to memoized children

```jsx
// Object referential equality
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New object every render
  const style = { color: 'red' };

  // ✅ Same object unless dependencies change
  const style = useMemo(() => ({ color: 'red' }), []);

  return <MemoizedChild style={style} />;
}
```

---

## useContext - Context Hook

`useContext` subscribes to context and re-renders when context value changes.

### Basic Usage

```jsx
// 1. Create context
const ThemeContext = createContext('light');

// 2. Provide value
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. Consume with useContext
function Button() {
  const theme = useContext(ThemeContext);

  return (
    <button className={theme === 'dark' ? 'btn-dark' : 'btn-light'}>
      Click me
    </button>
  );
}
```

See [05-context-api.md](./05-context-api.md) for comprehensive Context coverage.

---

## useReducer - Reducer Hook

`useReducer` is an alternative to `useState` for complex state logic.

### Basic Usage

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}
```

See [02-state-management.md](./02-state-management.md) for comprehensive useReducer coverage.

---

## Custom Hooks

Custom hooks let you **extract and reuse stateful logic**.

### Rules for Custom Hooks

1. **Must start with "use"** (e.g., `useFetch`, `useLocalStorage`)
2. **Can call other hooks** inside them
3. **Return values** that components can use

### Example: useToggle

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle];
}

// Usage
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <>
      <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'}</button>
      {isOpen && <div className="modal">Modal Content</div>}
    </>
  );
}
```

### Example: useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

### Example: useFetch

```jsx
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function Users() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <p>Loading...</p>;
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

### Example: useHttp (Advanced)

```jsx
function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearData = useCallback(() => {
    setData(initialData);
  }, [initialData]);

  const sendRequest = useCallback(
    async function sendRequest(requestData) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...config,
          body: requestData ? JSON.stringify(requestData) : undefined,
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const resData = await response.json();
        setData(resData);
        return resData;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, config]
  );

  // Auto-fetch for GET requests
  useEffect(() => {
    if (!config || config.method === 'GET' || !config.method) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return { data, loading, error, sendRequest, clearData };
}

// Usage for GET
function Products() {
  const {
    data: products,
    loading,
    error,
  } = useHttp('http://localhost:3000/products', { method: 'GET' }, []);

  // ...
}

// Usage for POST
function CreateProduct() {
  const { loading, error, sendRequest } = useHttp(
    'http://localhost:3000/products',
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
    null
  );

  const handleSubmit = async (productData) => {
    await sendRequest(productData);
  };

  // ...
}
```

### Example: useWindowSize

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return <div>{width > 768 ? <DesktopLayout /> : <MobileLayout />}</div>;
}
```

---

## useActionState (React 19)

`useActionState` is a new hook in React 19 for handling form actions and server actions.

### Basic Usage

```jsx
import { useActionState } from 'react';

async function submitForm(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!email.includes('@')) {
    return { error: 'Invalid email' };
  }

  return { success: true, message: `Hello, ${name}!` };
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null);

  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" disabled={isPending} />
      <input name="email" placeholder="Email" disabled={isPending} />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>

      {state?.error && <p className="error">{state.error}</p>}
      {state?.success && <p className="success">{state.message}</p>}
    </form>
  );
}
```

### With Validation

```jsx
async function checkoutAction(prevState, formData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    street: formData.get('street'),
    city: formData.get('city'),
    postalCode: formData.get('postal-code'),
  };

  // Validation
  const errors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email.includes('@')) {
    errors.email = 'Invalid email format';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Submit to server
  try {
    await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return { success: true };
  } catch (error) {
    return { errors: { form: 'Submission failed. Please try again.' } };
  }
}

function Checkout() {
  const [formState, formAction, pending] = useActionState(checkoutAction, null);

  return (
    <form action={formAction}>
      <div>
        <input name="name" placeholder="Name" />
        {formState?.errors?.name && <span>{formState.errors.name}</span>}
      </div>

      <div>
        <input name="email" placeholder="Email" />
        {formState?.errors?.email && <span>{formState.errors.email}</span>}
      </div>

      {/* More fields... */}

      {formState?.errors?.form && (
        <p className="form-error">{formState.errors.form}</p>
      )}

      {formState?.success && (
        <p className="success">Order placed successfully!</p>
      )}

      <button disabled={pending}>
        {pending ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```

---

## Hooks Cheat Sheet

| Hook             | Purpose           | Returns                    |
| ---------------- | ----------------- | -------------------------- |
| `useState`       | Local state       | `[value, setValue]`        |
| `useEffect`      | Side effects      | `undefined`                |
| `useRef`         | Mutable ref       | `{ current: value }`       |
| `useCallback`    | Memoized function | `memoizedCallback`         |
| `useMemo`        | Memoized value    | `memoizedValue`            |
| `useContext`     | Context value     | `contextValue`             |
| `useReducer`     | Complex state     | `[state, dispatch]`        |
| `useActionState` | Form actions      | `[state, action, pending]` |

---

## Practice Exercises

1. Create a `useDebounce` hook that delays value updates
2. Build a `useOnClickOutside` hook for detecting clicks outside an element
3. Create a `usePrevious` hook that tracks previous state value
4. Build a `useMediaQuery` hook for responsive design
5. Create a `useAsync` hook for handling async operations

---

_Next: [04-refs-and-portals.md](./04-refs-and-portals.md)_

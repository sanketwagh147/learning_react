# Advanced React Patterns - Complete Revision Guide

## Table of Contents

1. [Compound Components](#compound-components)
2. [Render Props Pattern](#render-props-pattern)
3. [Higher-Order Components (HOCs)](#higher-order-components-hocs)
4. [Custom Hooks Pattern](#custom-hooks-pattern)
5. [Provider Pattern](#provider-pattern)
6. [Container/Presentational Pattern](#containerpresentational-pattern)
7. [Controlled vs Uncontrolled Components](#controlled-vs-uncontrolled-components)
8. [State Reducer Pattern](#state-reducer-pattern)
9. [Props Getter Pattern](#props-getter-pattern)
10. [Choosing the Right Pattern](#choosing-the-right-pattern)

---

## Compound Components

### What Are Compound Components?

Compound components are a pattern where **multiple components work together** to form a complete UI element with shared implicit state.

Think of it like HTML's `<select>` and `<option>`:

```html
<!-- These work together implicitly -->
<select>
  <option>A</option>
  <option>B</option>
</select>
```

### Basic Example: Tabs

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Create context for shared state
const TabsContext = createContext();

// 2. Parent component (manages state)
function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// 3. Child component: Tab List
function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

// 4. Child component: Tab (button)
function Tab({ children, value }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

// 5. Child component: Tab Panels container
function TabPanels({ children }) {
  return <div className="tab-panels">{children}</div>;
}

// 6. Child component: Tab Panel
function TabPanel({ children, value }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return <div className="tab-panel">{children}</div>;
}

// Attach children to parent
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

export default Tabs;
```

### Usage

```jsx
import Tabs from './Tabs';

function App() {
  return (
    <Tabs defaultTab="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="features">Features</Tabs.Tab>
        <Tabs.Tab value="pricing">Pricing</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panels>
        <Tabs.Panel value="overview">
          <h2>Overview Content</h2>
          <p>Welcome to our product!</p>
        </Tabs.Panel>
        <Tabs.Panel value="features">
          <h2>Features Content</h2>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
          </ul>
        </Tabs.Panel>
        <Tabs.Panel value="pricing">
          <h2>Pricing Content</h2>
          <p>$99/month</p>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

### Advanced: Accordion Component

```jsx
import { createContext, useContext, useState } from 'react';

const AccordionContext = createContext();
const AccordionItemContext = createContext();

function Accordion({ children, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggle = (id) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isOpen = (id) => openItems.has(id);

  return (
    <AccordionContext.Provider value={{ toggle, isOpen }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ children, id }) {
  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div className="accordion-item">{children}</div>
    </AccordionItemContext.Provider>
  );
}

function AccordionHeader({ children }) {
  const { toggle, isOpen } = useContext(AccordionContext);
  const { id } = useContext(AccordionItemContext);

  return (
    <button
      className={`accordion-header ${isOpen(id) ? 'open' : ''}`}
      onClick={() => toggle(id)}
    >
      {children}
      <span>{isOpen(id) ? '−' : '+'}</span>
    </button>
  );
}

function AccordionBody({ children }) {
  const { isOpen } = useContext(AccordionContext);
  const { id } = useContext(AccordionItemContext);

  if (!isOpen(id)) return null;

  return <div className="accordion-body">{children}</div>;
}

// Attach sub-components
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

// Usage
<Accordion allowMultiple>
  <Accordion.Item id="1">
    <Accordion.Header>Section 1</Accordion.Header>
    <Accordion.Body>Content for section 1</Accordion.Body>
  </Accordion.Item>
  <Accordion.Item id="2">
    <Accordion.Header>Section 2</Accordion.Header>
    <Accordion.Body>Content for section 2</Accordion.Body>
  </Accordion.Item>
</Accordion>;
```

---

## Render Props Pattern

### What Are Render Props?

A render prop is a **function prop that a component uses to know what to render**. It gives the consumer control over rendering while the component handles the logic.

### Basic Example

```jsx
// Mouse tracker with render prop
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Let the consumer decide how to render
  return render(position);
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    />
  );
}
```

### Using Children as Render Prop

```jsx
// Same component, using children
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return children(position);
}

// Usage - cleaner syntax
function App() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    </MouseTracker>
  );
}
```

### Toggle Component Example

```jsx
function Toggle({ children, initialOn = false }) {
  const [on, setOn] = useState(initialOn);

  const toggle = () => setOn((prev) => !prev);
  const setOn = () => setOn(true);
  const setOff = () => setOn(false);

  // Pass state and controls to children
  return children({ on, toggle, setOn, setOff });
}

// Usage
<Toggle initialOn={false}>
  {({ on, toggle }) => (
    <div>
      <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
      {on && <p>The toggle is on!</p>}
    </div>
  )}
</Toggle>;
```

### Data Fetching with Render Props

```jsx
function Fetch({ url, children }) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    setState({ data: null, loading: true, error: null });

    fetch(url)
      .then((res) => res.json())
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => setState({ data: null, loading: false, error }));
  }, [url]);

  return children(state);
}

// Usage
<Fetch url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  }}
</Fetch>;
```

---

## Higher-Order Components (HOCs)

### What Are HOCs?

A Higher-Order Component is a **function that takes a component and returns a new enhanced component**. It's a pattern for reusing component logic.

```jsx
const EnhancedComponent = withSomething(OriginalComponent);
```

### Basic Example: withLoading

```jsx
// HOC that adds loading state
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

// Original component
function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Enhanced component
const UserListWithLoading = withLoading(UserList);

// Usage
<UserListWithLoading isLoading={loading} users={users} />;
```

### withAuth HOC

```jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function withAuth(WrappedComponent) {
  return function WithAuthComponent(props) {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
      return null; // Or loading spinner
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);

function App() {
  return <ProtectedDashboard />;
}
```

### withErrorBoundary HOC

```jsx
import { Component } from 'react';

function withErrorBoundary(WrappedComponent, FallbackComponent) {
  return class WithErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      console.error('Error:', error, info);
    }

    render() {
      if (this.state.hasError) {
        return <FallbackComponent />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

// Usage
const SafeWidget = withErrorBoundary(Widget, () => (
  <p>Widget failed to load</p>
));
```

### Composing Multiple HOCs

```jsx
// Multiple HOCs
const enhance = compose(withAuth, withLoading, withErrorBoundary);

const EnhancedComponent = enhance(MyComponent);

// Or manually:
const EnhancedComponent = withAuth(withLoading(withErrorBoundary(MyComponent)));
```

### HOC Conventions

```jsx
function withData(WrappedComponent) {
  function WithData(props) {
    // ... HOC logic
    return <WrappedComponent {...props} data={data} />;
  }

  // 1. Set display name for debugging
  WithData.displayName = `WithData(${getDisplayName(WrappedComponent)})`;

  return WithData;
}

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}
```

---

## Custom Hooks Pattern

### Why Custom Hooks?

Custom hooks let you **extract component logic into reusable functions**. This is the modern replacement for HOCs and render props in most cases.

### Basic Custom Hook

```jsx
// useToggle hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

// Usage
function App() {
  const { value: isOpen, toggle, setFalse } = useToggle();

  return (
    <div>
      <button onClick={toggle}>Toggle Menu</button>
      {isOpen && (
        <div className="menu">
          <button onClick={setFalse}>Close</button>
        </div>
      )}
    </div>
  );
}
```

### useLocalStorage Hook

```jsx
function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}
```

### useAsync Hook

```jsx
function useAsync(asyncFunction, immediate = true) {
  const [state, setState] = useState({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = useCallback(
    async (...args) => {
      setState({ status: 'pending', data: null, error: null });

      try {
        const data = await asyncFunction(...args);
        setState({ status: 'success', data, error: null });
        return data;
      } catch (error) {
        setState({ status: 'error', data: null, error });
        throw error;
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
}

// Usage
function UserProfile({ userId }) {
  const fetchUser = useCallback(
    () => fetch(`/api/users/${userId}`).then((r) => r.json()),
    [userId]
  );

  const { data: user, status, error, execute: refetch } = useAsync(fetchUser);

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'error') return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### useDebounce Hook

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // Only search after user stops typing for 500ms
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## Provider Pattern

### Basic Provider Pattern

```jsx
import { createContext, useContext, useState, useMemo } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Custom hook for consuming
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Export provider and hook
export { ThemeProvider, useTheme };
```

### Composed Providers

```jsx
// Multiple providers combined
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Usage in App
function App() {
  return (
    <AppProviders>
      <Router>
        <Routes />
      </Router>
    </AppProviders>
  );
}
```

---

## Container/Presentational Pattern

### Concept

Split components into:

- **Container (Smart)**: Handles logic, state, data fetching
- **Presentational (Dumb)**: Only handles UI rendering

### Example

```jsx
// Presentational Component (pure UI)
function UserList({ users, onSelect, selectedId }) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li
          key={user.id}
          className={user.id === selectedId ? 'selected' : ''}
          onClick={() => onSelect(user.id)}
        >
          <img src={user.avatar} alt={user.name} />
          <span>{user.name}</span>
        </li>
      ))}
    </ul>
  );
}

// Container Component (logic & state)
function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <UserList users={users} selectedId={selectedId} onSelect={setSelectedId} />
  );
}
```

### Modern Alternative: Custom Hooks

```jsx
// Custom hook replaces container
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return { users, loading };
}

// Single component using hook
function UserList() {
  const { users, loading } = useUsers();
  const [selectedId, setSelectedId] = useState(null);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.id}
          className={user.id === selectedId ? 'selected' : ''}
          onClick={() => setSelectedId(user.id)}
        >
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

---

## Controlled vs Uncontrolled Components

### Controlled Component

```jsx
// Parent controls the value
function ControlledInput() {
  const [value, setValue] = useState('');

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

### Uncontrolled Component

```jsx
// DOM controls the value
function UncontrolledInput() {
  const inputRef = useRef();

  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };

  return (
    <>
      <input ref={inputRef} defaultValue="initial" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

### Flexible Component (Both Modes)

```jsx
function FlexibleInput({
  value: controlledValue,
  defaultValue,
  onChange,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  // Check if controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  return <input value={value} onChange={handleChange} {...props} />;
}

// Usage
// Controlled
<FlexibleInput value={name} onChange={(e) => setName(e.target.value)} />

// Uncontrolled
<FlexibleInput defaultValue="default" />
```

---

## State Reducer Pattern

### Concept

Let users **customize state transitions** by providing their own reducer.

```jsx
function useToggle({ reducer = toggleReducer } = {}) {
  const [state, dispatch] = useReducer(reducer, { on: false });

  const toggle = () => dispatch({ type: 'TOGGLE' });
  const setOn = () => dispatch({ type: 'SET_ON' });
  const setOff = () => dispatch({ type: 'SET_OFF' });

  return { ...state, toggle, setOn, setOff };
}

// Default reducer
function toggleReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return { on: !state.on };
    case 'SET_ON':
      return { on: true };
    case 'SET_OFF':
      return { on: false };
    default:
      return state;
  }
}

// Usage with custom reducer
function App() {
  const { on, toggle } = useToggle({
    reducer: (state, action) => {
      // Prevent turning off on Fridays
      if (action.type === 'SET_OFF' && new Date().getDay() === 5) {
        return state; // Don't change
      }
      return toggleReducer(state, action);
    },
  });

  return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
}
```

---

## Props Getter Pattern

### Concept

Provide functions that return props objects, letting users merge with their own props.

```jsx
function useToggle() {
  const [on, setOn] = useState(false);

  const toggle = () => setOn((v) => !v);

  // Props getter for toggle button
  const getTogglerProps = ({ onClick, ...props } = {}) => ({
    'aria-pressed': on,
    onClick: (...args) => {
      onClick?.(...args);
      toggle();
    },
    ...props,
  });

  // Props getter for content
  const getContentProps = ({ style, ...props } = {}) => ({
    style: {
      display: on ? 'block' : 'none',
      ...style,
    },
    ...props,
  });

  return { on, toggle, getTogglerProps, getContentProps };
}

// Usage
function App() {
  const { on, getTogglerProps, getContentProps } = useToggle();

  return (
    <div>
      <button
        {...getTogglerProps({
          onClick: () => console.log('Custom click!'),
          className: 'custom-button',
        })}
      >
        {on ? 'Hide' : 'Show'}
      </button>

      <div
        {...getContentProps({
          style: { backgroundColor: 'lightblue' },
        })}
      >
        Content here
      </div>
    </div>
  );
}
```

---

## Choosing the Right Pattern

| Pattern                    | Use When                                          |
| -------------------------- | ------------------------------------------------- |
| **Compound Components**    | Building flexible UI components (tabs, accordion) |
| **Render Props**           | Need complete control over rendering              |
| **HOCs**                   | Adding behavior to many components (legacy)       |
| **Custom Hooks**           | Sharing stateful logic (modern approach)          |
| **Provider Pattern**       | Global or deeply nested state                     |
| **Container/Presentation** | Clear separation of concerns                      |
| **State Reducer**          | Users need to customize state logic               |
| **Props Getters**          | Users need to extend default props                |

### Modern Recommendations

```
2024+ Best Practices:

1. Custom Hooks → Default choice for logic reuse
2. Compound Components → Complex UI components
3. Context + Provider → Global state
4. Render Props → Rare, specific use cases
5. HOCs → Legacy code, avoid for new code
```

---

## 🎯 Common Interview Questions

### Q1: Explain the Compound Component pattern.

**Answer:** Compound components are multiple components that work together sharing implicit state via Context. Like HTML's `<select>` and `<option>`. Benefits:

- Flexible, declarative API
- Implicit state sharing
- Clear parent-child relationship

### Q2: What is the difference between Render Props and HOCs?

**Answer:**

- **Render Props**: Pass a function as a prop that returns JSX. More explicit, avoids "wrapper hell"
- **HOCs**: Function that takes a component and returns enhanced component. Can lead to prop collision and nesting issues
- **Modern choice**: Custom Hooks replace both in most cases

### Q3: When would you use the State Reducer pattern?

**Answer:** When you want to give consumers control over state changes:

- Component library where users need customization
- Complex state logic that varies by use case
- When you want to enforce constraints while allowing flexibility

### Q4: What is the Container/Presentational pattern?

**Answer:**

- **Container**: Handles data fetching, state, logic
- **Presentational**: Pure UI, receives everything via props
- Benefit: Clear separation of concerns, easier testing
- Modern alternative: Custom Hooks often replace containers

### Q5: How do Custom Hooks differ from HOCs?

**Answer:**

- **Custom Hooks**: Share logic, not JSX. No wrapper component. Direct access to hook features
- **HOCs**: Wrap components, can inject props. Creates extra DOM nodes. Harder to debug
- Custom Hooks are the modern, preferred approach

---

## Practice Exercises

1. Build a compound component for a Dropdown menu
2. Create a generic Table component with render props for cells
3. Implement a useForm hook using the state reducer pattern
4. Build a Modal system using the Provider pattern
5. Refactor a HOC to a Custom Hook

---

_Next: [16-react-18-19-features.md](./16-react-18-19-features.md)_

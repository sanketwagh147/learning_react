# Context API - Complete Revision Guide

## Table of Contents

1. [The Prop Drilling Problem](#the-prop-drilling-problem)
2. [What is Context?](#what-is-context)
3. [Creating Context](#creating-context)
4. [Context Provider](#context-provider)
5. [Consuming Context](#consuming-context)
6. [Context with State](#context-with-state)
7. [Context with useReducer](#context-with-usereducer)
8. [Multiple Contexts](#multiple-contexts)
9. [Best Practices](#best-practices)

---

## The Prop Drilling Problem

**Prop drilling** occurs when you pass props through multiple components that don't need them, just to reach a deeply nested component.

```jsx
// ❌ Prop drilling - every component needs to pass user down
function App() {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });
  return <Dashboard user={user} setUser={setUser} />;
}

function Dashboard({ user, setUser }) {
  return (
    <div>
      <Header user={user} />
      <Sidebar user={user} />
      <Main user={user} setUser={setUser} />
    </div>
  );
}

function Main({ user, setUser }) {
  return (
    <div>
      <Content user={user} />
      <Settings user={user} setUser={setUser} />
    </div>
  );
}

function Settings({ user, setUser }) {
  return <ProfileEditor user={user} setUser={setUser} />;
}

// Finally, the component that actually needs the data!
function ProfileEditor({ user, setUser }) {
  return (
    <input
      value={user.name}
      onChange={(e) => setUser({ ...user, name: e.target.value })}
    />
  );
}
```

**Problems with prop drilling:**

- Components in between don't need `user` but must pass it
- Adding new props requires updating every component in the chain
- Makes components less reusable
- Code becomes harder to maintain

---

## What is Context?

Context provides a way to **share values between components without explicitly passing props** through every level.

```
       App (Provider)
        ↓ context value available
      Dashboard
        ↓ context value available
       Main
        ↓ context value available
    ProfileEditor (Consumer) ← useContext(UserContext)
```

### When to Use Context

✅ **Good use cases:**

- Theme (dark/light mode)
- Current authenticated user
- Language/locale settings
- UI state (modal open/closed, sidebar state)
- Shopping cart data

❌ **When NOT to use Context:**

- Data that changes frequently (can cause performance issues)
- Data only used by one or two closely related components
- As a replacement for all state management (consider Redux for complex cases)

---

## Creating Context

```jsx
import { createContext } from 'react';

// Create context with optional default value
const ThemeContext = createContext('light');

// Default value is used when:
// 1. No Provider is found above in the tree
// 2. For TypeScript type inference
// 3. For testing components in isolation

// Without default value
const UserContext = createContext(null);

// With object default value
const CartContext = createContext({
  items: [],
  totalAmount: 0,
  addItem: () => {},
  removeItem: () => {},
});
```

---

## Context Provider

The Provider component **supplies the context value** to all descendants.

### Basic Provider

```jsx
import { createContext, useState } from 'react';

// 1. Create context
const ThemeContext = createContext('light');

// 2. Create Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 3. Provide value to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Wrap your app
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

// Export both context and provider
export { ThemeContext, ThemeProvider };
```

### What Goes in the Provider Value?

```jsx
function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Include:
  // 1. State values
  // 2. Functions to modify state
  // 3. Derived/computed values

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const contextValue = {
    // State
    items,
    // Derived values
    totalItems,
    totalPrice,
    // Functions
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
```

---

## Consuming Context

### Using useContext Hook (Recommended)

```jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Button() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      className={theme === 'dark' ? 'btn-dark' : 'btn-light'}
      onClick={toggleTheme}
    >
      Toggle Theme
    </button>
  );
}
```

### Using Context.Consumer (Legacy)

```jsx
// Older pattern - still works but less preferred
function Button() {
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        <button
          className={theme === 'dark' ? 'btn-dark' : 'btn-light'}
          onClick={toggleTheme}
        >
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
```

### Custom Hook Pattern (Best Practice)

```jsx
// ThemeContext.jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming context
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

// Usage in components
function Button() {
  const { theme, toggleTheme } = useTheme(); // Clean and type-safe
  // ...
}
```

---

## Context with State

### Complete Example: User Authentication Context

```jsx
// UserContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    error,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

// Usage
function LoginButton() {
  const { isLoggedIn, user, logout } = useUser();

  if (isLoggedIn) {
    return (
      <div>
        <span>Welcome, {user.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => navigate('/login')}>Login</button>;
}
```

---

## Context with useReducer

For complex state logic, combine Context with `useReducer`.

### Shopping Cart Example

```jsx
// CartContext.jsx
import { createContext, useContext, useReducer } from 'react';

// 1. Define initial state
const initialState = {
  items: [],
  totalAmount: 0,
};

// 2. Define reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let updatedItems;
      let updatedTotalAmount = state.totalAmount + action.payload.price;

      if (existingIndex > -1) {
        // Item exists - update quantity
        updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }

    case 'REMOVE_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );
      const existingItem = state.items[existingIndex];

      if (!existingItem) return state;

      let updatedItems;
      const updatedTotalAmount = state.totalAmount - existingItem.price;

      if (existingItem.quantity === 1) {
        // Remove item entirely
        updatedItems = state.items.filter((item) => item.id !== action.payload);
      } else {
        // Decrease quantity
        updatedItems = state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
          totalAmount: state.items.reduce((sum, item) => {
            if (item.id === id) return sum;
            return sum + item.price * item.quantity;
          }, 0),
        };
      }

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      const updatedTotalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

// 3. Create context
const CartContext = createContext(null);

// 4. Create provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Action creators for cleaner API
  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const contextValue = {
    items: state.items,
    totalAmount: state.totalAmount,
    totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

// 5. Custom hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

### Using the Cart Context

```jsx
// ProductCard.jsx
function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}

// CartSummary.jsx
function CartSummary() {
  const { items, totalAmount, totalItems, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="cart-summary">
      <h2>Cart ({totalItems} items)</h2>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div className="cart-total">
        <strong>Total: ${totalAmount.toFixed(2)}</strong>
      </div>

      <button onClick={clearCart}>Clear Cart</button>
      <button>Checkout</button>
    </div>
  );
}
```

---

## Multiple Contexts

You can use multiple contexts together.

### Combining Contexts

```jsx
// App.jsx
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <Header />
          <Main />
          <Footer />
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

// Component using multiple contexts
function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const { totalItems } = useCart();

  return (
    <header className={`header-${theme}`}>
      <Logo />

      <nav>
        <CartIcon count={totalItems} />

        {user ? <UserMenu user={user} onLogout={logout} /> : <LoginButton />}

        <button onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
      </nav>
    </header>
  );
}
```

### Separating UI State from Data State

```jsx
// Good pattern: Separate contexts for different concerns

// UI Context - modal state, sidebar state, etc.
const UIContext = createContext(null);

function UIProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalId) => {
    setActiveModal(modalId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <UIContext.Provider
      value={{
        isModalOpen,
        activeModal,
        openModal,
        closeModal,
        isSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

// Data Context - actual data
const DataContext = createContext(null);

function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  // ... data fetching and management

  return (
    <DataContext.Provider value={{ products, orders }}>
      {children}
    </DataContext.Provider>
  );
}
```

---

## Best Practices

### 1. Keep Context Focused

```jsx
// ❌ Too much in one context
const AppContext = createContext({
  user: null,
  theme: 'light',
  cart: [],
  notifications: [],
  language: 'en',
  // ... many more
});

// ✅ Split into focused contexts
const UserContext = createContext(null);
const ThemeContext = createContext('light');
const CartContext = createContext(null);
const NotificationContext = createContext(null);
```

### 2. Memoize Context Value

```jsx
// ❌ Creates new object every render
function Provider({ children }) {
  const [state, setState] = useState(initialState);

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

// ✅ Memoize the value object
function Provider({ children }) {
  const [state, setState] = useState(initialState);

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [state]
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

### 3. Split State and Dispatch Contexts

For components that only dispatch actions (don't read state):

```jsx
const StateContext = createContext(null);
const DispatchContext = createContext(null);

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Component that only reads state
function Display() {
  const state = useContext(StateContext); // Re-renders when state changes
  return <div>{state.count}</div>;
}

// Component that only dispatches (won't re-render when state changes!)
function Controls() {
  const dispatch = useContext(DispatchContext); // dispatch never changes
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>;
}
```

### 4. Provide Sensible Defaults

```jsx
// Good defaults for TypeScript and testing
const CartContext = createContext({
  items: [],
  totalAmount: 0,
  addItem: () => console.warn('CartProvider not found'),
  removeItem: () => console.warn('CartProvider not found'),
  clearCart: () => console.warn('CartProvider not found'),
});
```

### 5. Create Custom Hooks

```jsx
// ✅ Always create custom hooks for your contexts
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
```

---

## Context vs Other Solutions

| Feature            | Context             | Redux        | Zustand     |
| ------------------ | ------------------- | ------------ | ----------- |
| **Built-in**       | ✅ Yes              | ❌ No        | ❌ No       |
| **Boilerplate**    | Low                 | High         | Very Low    |
| **DevTools**       | Limited             | Excellent    | Good        |
| **Performance**    | Can have issues     | Optimized    | Optimized   |
| **Learning curve** | Easy                | Steep        | Easy        |
| **Best for**       | Simple global state | Complex apps | Medium apps |

### When to Consider Redux/Zustand Instead

- Very frequent state updates
- Complex state with many interconnected parts
- Need for time-travel debugging
- Large team needing strict patterns

---

## Summary

```jsx
// 1. Create context with createContext
const MyContext = createContext(defaultValue);

// 2. Create provider component
function MyProvider({ children }) {
  const [state, setState] = useState(initial);

  const value = useMemo(() => ({ state, setState }), [state]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// 3. Create custom hook
function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('Must be within Provider');
  return context;
}

// 4. Wrap app with provider
<MyProvider>
  <App />
</MyProvider>;

// 5. Use in components
function Component() {
  const { state, setState } = useMyContext();
}
```

---

## 🎯 Common Interview Questions

### Q1: What is prop drilling and how does Context solve it?

**Answer:** Prop drilling is passing props through multiple levels of components that don't need them, just to reach a deeply nested child. Context allows any component to access shared state directly without passing through intermediaries.

### Q2: When should you NOT use Context?

**Answer:**

- Data that changes very frequently (performance issues)
- Data used by only 1-2 closely related components
- As a replacement for all state management
- When you need time-travel debugging or Redux DevTools

### Q3: How do you prevent unnecessary re-renders with Context?

**Answer:**

1. **Split contexts** - Separate frequently changing from stable values
2. **Memoize the provider value** - Use `useMemo` on the context value
3. **Memoize consumers** - Use `React.memo` on consuming components
4. **Use selectors** - Only subscribe to needed parts of context

```jsx
// Memoize context value
const value = useMemo(() => ({ state, actions }), [state]);
```

### Q4: Explain createContext default value usage.

**Answer:** The default value is used when:

- No Provider is found above in the tree
- For TypeScript type inference
- Testing components in isolation

```jsx
const ThemeContext = createContext('light'); // 'light' is default
```

### Q5: How do you test components that use Context?

**Answer:**

1. Wrap component in the Provider during testing
2. Create a test utility with custom wrapper
3. Mock the context value for unit tests

```jsx
function renderWithProvider(ui, { value }) {
  return render(<MyContext.Provider value={value}>{ui}</MyContext.Provider>);
}
```

---

## Practice Exercises

1. Create a `ThemeContext` with light/dark mode toggle
2. Build a `NotificationContext` that can show/dismiss notifications
3. Create a `LanguageContext` for internationalization
4. Build a complete e-commerce cart using Context + useReducer
5. Create a `ModalContext` that manages multiple modals

---

_Next: [06-redux.md](./06-redux.md)_

# Redux - Complete Revision Guide

## Table of Contents

1. [What is Redux?](#what-is-redux)
2. [Core Concepts](#core-concepts)
3. [Basic Redux (Vanilla)](#basic-redux-vanilla)
4. [Redux Toolkit (Modern Approach)](#redux-toolkit-modern-approach)
5. [React-Redux Integration](#react-redux-integration)
6. [Multiple Slices](#multiple-slices)
7. [Async Operations (Thunks)](#async-operations-thunks)
8. [Redux vs Context](#redux-vs-context)

---

## What is Redux?

Redux is a **predictable state container** for JavaScript applications.

### Why Redux?

- **Single Source of Truth**: All state lives in one store
- **Predictable**: State changes only through actions
- **Debuggable**: Time-travel debugging with Redux DevTools
- **Maintainable**: Clear patterns for state updates

### When to Use Redux

✅ **Good for:**

- Large applications with complex state
- State shared across many components
- Frequent state updates
- Team projects needing strict patterns

❌ **Overkill for:**

- Small to medium applications
- State used by few components
- Simple state logic

---

## Core Concepts

### The Three Principles

1. **Single Source of Truth**: The entire application state is stored in a single store
2. **State is Read-Only**: The only way to change state is by dispatching actions
3. **Changes via Pure Functions**: Reducers are pure functions that take previous state and action, return new state

### Data Flow

```
User Action → Dispatch Action → Reducer → New State → UI Updates
     ↑                                                    ↓
     └────────────────── View ←───────────────────────────┘
```

### Key Terms

| Term         | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| **Store**    | Holds the entire application state                            |
| **Action**   | Plain object describing what happened `{ type: 'INCREMENT' }` |
| **Reducer**  | Pure function: `(state, action) => newState`                  |
| **Dispatch** | Function to send actions to the store                         |
| **Selector** | Function to extract data from state                           |

---

## Basic Redux (Vanilla)

Understanding core Redux without any helpers.

### Creating a Store

```javascript
const redux = require('redux');

// 1. Define initial state
const initialState = {
  counter: 0,
};

// 2. Create reducer function
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };

    case 'DECREMENT':
      return { ...state, counter: state.counter - 1 };

    case 'INCREMENT_BY':
      return { ...state, counter: state.counter + action.payload };

    case 'RESET':
      return { ...state, counter: 0 };

    default:
      return state;
  }
}

// 3. Create store
const store = redux.createStore(counterReducer);

// 4. Subscribe to changes
const unsubscribe = store.subscribe(() => {
  console.log('State changed:', store.getState());
});

// 5. Dispatch actions
store.dispatch({ type: 'INCREMENT' });
// Output: State changed: { counter: 1 }

store.dispatch({ type: 'INCREMENT' });
// Output: State changed: { counter: 2 }

store.dispatch({ type: 'INCREMENT_BY', payload: 5 });
// Output: State changed: { counter: 7 }

store.dispatch({ type: 'DECREMENT' });
// Output: State changed: { counter: 6 }

// Get current state
console.log(store.getState()); // { counter: 6 }

// Unsubscribe when done
unsubscribe();
```

### Why This is Tedious

```javascript
// ❌ Problems with vanilla Redux:

// 1. Action type strings are error-prone
store.dispatch({ type: 'INCREMNT' }); // Typo! Silent failure

// 2. Must manually ensure immutability
function reducer(state, action) {
  // Easy to accidentally mutate:
  state.counter++; // ❌ WRONG - mutation!
  return state;

  // Must always spread:
  return { ...state, counter: state.counter + 1 }; // ✅
}

// 3. Lots of boilerplate for action creators
const increment = () => ({ type: 'INCREMENT' });
const incrementBy = (amount) => ({ type: 'INCREMENT_BY', payload: amount });
// ... for every action
```

---

## Redux Toolkit (Modern Approach)

Redux Toolkit (RTK) is the **official, recommended way** to write Redux logic.

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### createSlice - The Heart of RTK

`createSlice` generates action creators and action types automatically!

```javascript
// store/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter', // Used as prefix for action types

  initialState: {
    count: 0,
    showCounter: true,
  },

  reducers: {
    // Each function becomes an action creator!
    increment(state) {
      // "Mutating" code is OK - Immer handles immutability!
      state.count++;
    },

    decrement(state) {
      state.count--;
    },

    // Access action.payload for data
    increase(state, action) {
      state.count += action.payload;
    },

    toggle(state) {
      state.showCounter = !state.showCounter;
    },

    reset(state) {
      state.count = 0;
    },
  },
});

// Export actions (auto-generated!)
export const { increment, decrement, increase, toggle, reset } =
  counterSlice.actions;

// Export reducer
export default counterSlice.reducer;
```

### Understanding Immer

RTK uses **Immer** internally - you can write "mutating" code, but it's actually creating immutable updates!

```javascript
// What you write (looks like mutation):
increment(state) {
  state.count++;
}

// What Immer does behind the scenes:
increment(state) {
  return {
    ...state,
    count: state.count + 1
  };
}
```

### configureStore - Setting Up the Store

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    // Add more slices here
  },
});

export default store;
```

---

## React-Redux Integration

### Providing the Store

```jsx
// main.jsx or index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### useSelector - Reading State

```jsx
import { useSelector } from 'react-redux';

function Counter() {
  // Select specific pieces of state
  const count = useSelector((state) => state.counter.count);
  const showCounter = useSelector((state) => state.counter.showCounter);

  return <div>{showCounter && <h1>Count: {count}</h1>}</div>;
}
```

### useDispatch - Dispatching Actions

```jsx
import { useDispatch, useSelector } from 'react-redux';
import {
  increment,
  decrement,
  increase,
  toggle,
  reset,
} from './store/counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const showCounter = useSelector((state) => state.counter.showCounter);
  const dispatch = useDispatch();

  return (
    <div>
      {showCounter && (
        <div>
          <h1>Count: {count}</h1>

          <button onClick={() => dispatch(increment())}>+1</button>
          <button onClick={() => dispatch(decrement())}>-1</button>
          <button onClick={() => dispatch(increase(5))}>+5</button>
          <button onClick={() => dispatch(increase(10))}>+10</button>
          <button onClick={() => dispatch(reset())}>Reset</button>
        </div>
      )}

      <button onClick={() => dispatch(toggle())}>
        {showCounter ? 'Hide' : 'Show'} Counter
      </button>
    </div>
  );
}
```

---

## Multiple Slices

Real applications have multiple slices for different features.

### Authentication Slice

```javascript
// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
  },

  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },

    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
```

### Cart Slice

```javascript
// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    changed: false, // Track if cart changed (for sync)
  },

  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      state.totalQuantity++;
      state.changed = true;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },

    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      state.totalQuantity--;
      state.changed = true;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },

    replaceCart(state, action) {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalAmount = action.payload.totalAmount;
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.changed = true;
    },
  },
});

export const { addItem, removeItem, replaceCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
```

### Combining Slices

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});

export default store;

// State structure:
// {
//   counter: { count: 0, showCounter: true },
//   auth: { isAuthenticated: false, user: null, token: null },
//   cart: { items: [], totalQuantity: 0, totalAmount: 0, changed: false }
// }
```

### Using Multiple Slices

```jsx
function Header() {
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const cartQuantity = useSelector(state => state.cart.totalQuantity);
  const dispatch = useDispatch();

  return (
    <header>
      <nav>
        <span>Cart ({cartQuantity})</span>

        {isAuth ? (
          <>
            <span>Welcome, {user?.name}</span>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <button onClick={() => /* navigate to login */}>Login</button>
        )}
      </nav>
    </header>
  );
}
```

---

## Async Operations (Thunks)

Redux is synchronous - for async operations, we use **thunks**.

### What is a Thunk?

A thunk is a **function that returns another function**. It can contain async logic and dispatch multiple actions.

```javascript
// Normal action creator (returns action object)
const increment = () => ({ type: 'INCREMENT' });

// Thunk action creator (returns function)
const incrementAsync = () => {
  return async (dispatch, getState) => {
    // Can do async work here
    await someAsyncOperation();
    // Then dispatch regular actions
    dispatch(increment());
  };
};
```

### Creating Thunks

```javascript
// store/cart-actions.js
import { cartActions } from './cartSlice';
import { uiActions } from './uiSlice';

// Thunk for fetching cart data
export const fetchCartData = () => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Loading...',
        message: 'Fetching cart data',
      })
    );

    try {
      const response = await fetch('https://api.example.com/cart');

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();

      dispatch(
        cartActions.replaceCart({
          items: data.items || [],
          totalQuantity: data.totalQuantity || 0,
          totalAmount: data.totalAmount || 0,
        })
      );

      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Cart data loaded',
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Failed to fetch cart data',
        })
      );
    }
  };
};

// Thunk for sending cart data
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Saving cart data',
      })
    );

    try {
      const response = await fetch('https://api.example.com/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items,
          totalQuantity: cart.totalQuantity,
          totalAmount: cart.totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save cart');
      }

      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Cart saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Failed to save cart',
        })
      );
    }
  };
};
```

### UI Slice for Notifications

```javascript
// store/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    notification: null,
    isLoading: false,
  },

  reducers: {
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },

    hideNotification(state) {
      state.notification = null;
    },

    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
```

### Using Thunks in Components

```jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartData, sendCartData } from './store/cart-actions';

let isInitial = true; // Track initial load

function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  // Send cart when it changes
  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return; // Don't send on initial load
    }

    if (cart.changed) {
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Header />
      <Products />
      <Cart />
    </>
  );
}
```

### createAsyncThunk (Alternative)

RTK provides `createAsyncThunk` for cleaner async logic:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers', // Action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',

  initialState: {
    users: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },

  reducers: {},

  // Handle async thunk states
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Usage in component
function UserList() {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Redux vs Context

### When to Use Context

- Simple global state (theme, language, auth status)
- Small to medium applications
- State that doesn't change frequently
- No need for debugging tools

### When to Use Redux

- Large, complex applications
- Frequent state updates
- Many state interconnections
- Need Redux DevTools
- Large team with strict patterns

### Comparison

| Feature         | Context         | Redux            |
| --------------- | --------------- | ---------------- |
| **Setup**       | Minimal         | More boilerplate |
| **DevTools**    | Limited         | Excellent        |
| **Performance** | Can have issues | Optimized        |
| **Learning**    | Easy            | Steeper curve    |
| **Async**       | Manual          | Built-in thunks  |
| **Best for**    | Simple state    | Complex state    |

---

## Redux Best Practices

### 1. Keep State Normalized

```javascript
// ❌ Nested/duplicated data
{
  posts: [
    { id: 1, author: { id: 1, name: 'John' }, ... },
    { id: 2, author: { id: 1, name: 'John' }, ... }  // Duplicate!
  ]
}

// ✅ Normalized data
{
  posts: {
    byId: { 1: { authorId: 1, ... }, 2: { authorId: 1, ... } },
    allIds: [1, 2]
  },
  users: {
    byId: { 1: { name: 'John' } },
    allIds: [1]
  }
}
```

### 2. Use Selectors

```javascript
// ✅ Create reusable selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartQuantity = (state) => state.cart.totalQuantity;

// In component
const items = useSelector(selectCartItems);
const total = useSelector(selectCartTotal);
```

### 3. Keep Components Connected Simply

```jsx
// ✅ Connect at the right level - not too high, not too low
function ProductCard({ productId }) {
  // Connect only what this component needs
  const product = useSelector((state) =>
    state.products.items.find((p) => p.id === productId)
  );
  const dispatch = useDispatch();

  // ...
}
```

---

## Summary Cheat Sheet

```javascript
// 1. Create slice with createSlice
const mySlice = createSlice({
  name: 'mySlice',
  initialState: {},
  reducers: {
    action(state, action) {
      state.value = action.payload;
    },
  },
});

// 2. Export actions and reducer
export const { action } = mySlice.actions;
export default mySlice.reducer;

// 3. Configure store
const store = configureStore({
  reducer: { mySlice: mySliceReducer },
});

// 4. Provide store
<Provider store={store}>
  <App />
</Provider>;

// 5. Use in components
const value = useSelector((state) => state.mySlice.value);
const dispatch = useDispatch();
dispatch(action(payload));

// 6. Thunks for async
export const asyncAction = () => async (dispatch) => {
  await asyncOp();
  dispatch(action());
};
```

---

## 🎯 Common Interview Questions

### Q1: What is Redux and when should you use it?

**Answer:** Redux is a predictable state container for JavaScript applications. Use it when:

- State is shared across many components
- State updates are complex with many moving parts
- You need time-travel debugging
- Team needs strict, predictable patterns

### Q2: Explain the three principles of Redux.

**Answer:**

1. **Single source of truth** - All state lives in one store object
2. **State is read-only** - Only actions can trigger state changes
3. **Changes via pure functions** - Reducers are pure functions that return new state

### Q3: What is the difference between Redux Toolkit and vanilla Redux?

**Answer:**

- **RTK includes Immer** - Write "mutating" code that's actually immutable
- **createSlice** - Auto-generates action creators and types
- **configureStore** - Sets up DevTools and middleware automatically
- **Less boilerplate** - No need for action type constants or switch statements

### Q4: What is a thunk and why is it needed?

**Answer:** A thunk is a function that returns another function. It's needed because:

- Redux actions are plain objects (synchronous)
- Thunks allow async operations (API calls) before dispatching
- The inner function receives `dispatch` and `getState` as arguments

```javascript
// Thunk example
export const fetchUser = (userId) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const user = await api.getUser(userId);
  dispatch(setUser(user));
  dispatch(setLoading(false));
};
```

### Q5: Context API vs Redux - when to use which?

**Answer:**

- **Context API**: Simple global state, theme, auth, small apps
- **Redux**: Complex state, frequent updates, large apps, need DevTools
- Context can cause unnecessary re-renders; Redux is optimized for performance

---

## Practice Exercises

1. Convert a Context-based app to Redux
2. Create a todo app with Redux Toolkit
3. Add async data fetching with thunks
4. Implement optimistic updates in a cart
5. Build a multi-feature app with multiple slices

---

_Next: [07-react-router.md](./07-react-router.md)_

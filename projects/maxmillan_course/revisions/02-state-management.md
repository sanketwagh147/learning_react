# State Management - Complete Revision Guide

## Table of Contents

1. [Understanding State](#understanding-state)
2. [useState Hook](#usestate-hook)
3. [State Update Rules](#state-update-rules)
4. [Derived State](#derived-state)
5. [Lifting State Up](#lifting-state-up)
6. [useReducer Hook](#usereducer-hook)
7. [When to Use What](#when-to-use-what)

---

## Understanding State

State is **data that changes over time** and affects what a component renders.

### Props vs State

| Props                          | State                      |
| ------------------------------ | -------------------------- |
| Passed from parent             | Managed within component   |
| Read-only (immutable)          | Can be changed (mutable)   |
| Component has no control       | Component has full control |
| Changes when parent re-renders | Changes trigger re-render  |

```jsx
// Props: Data coming IN from parent
function Child({ name }) {
  // name is a prop
  return <p>Hello, {name}</p>;
}

// State: Data managed INSIDE component
function Counter() {
  const [count, setCount] = useState(0); // count is state
  return <p>Count: {count}</p>;
}
```

### When Do You Need State?

Ask yourself:

1. **Does it change over time?** → Probably state
2. **Can it be computed from existing state/props?** → NOT state (derived)
3. **Does changing it affect the UI?** → State

---

## useState Hook

`useState` is the primary hook for managing state in functional components.

### Basic Syntax

```jsx
import { useState } from 'react';

function Counter() {
  // Declare state: [currentValue, setterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Multiple State Variables

```jsx
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(+e.target.value)}
      />
    </form>
  );
}
```

### Object State

```jsx
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0,
  });

  // ❌ WRONG: Direct mutation
  const handleChangeBad = (e) => {
    user.name = e.target.value; // Mutation doesn't trigger re-render!
    setUser(user); // Same object reference
  };

  // ✅ CORRECT: Create new object
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser, // Spread existing properties
      [name]: value, // Override changed property
    }));
  };

  return (
    <form>
      <input name="name" value={user.name} onChange={handleChange} />
      <input name="email" value={user.email} onChange={handleChange} />
    </form>
  );
}
```

### Array State

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  // Add item
  const addTodo = (text) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, completed: false }
    ]);
  };

  // Remove item
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Update item
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  // Reorder items
  const moveTodoUp = (index) => {
    if (index === 0) return;
    setTodos(prev => {
      const newTodos = [...prev];
      [newTodos[index - 1], newTodos[index]] =
        [newTodos[index], newTodos[index - 1]];
      return newTodos;
    });
  };

  return (/* ... */);
}
```

### Lazy Initial State

For expensive initial computations:

```jsx
// ❌ Runs on every render (expensive)
const [data, setData] = useState(expensiveComputation());

// ✅ Runs only on mount (lazy)
const [data, setData] = useState(() => expensiveComputation());

// Example: Reading from localStorage
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
});
```

---

## State Update Rules

### Rule 1: Never Mutate State Directly

```jsx
// ❌ WRONG: Direct mutation
const [items, setItems] = useState(['a', 'b']);
items.push('c'); // Mutation!
setItems(items); // Same array reference - won't trigger re-render

// ✅ CORRECT: Create new array
setItems([...items, 'c']);
```

### Rule 2: Use Functional Updates for Previous State

When new state depends on previous state:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ WRONG: Can cause stale state issues
  const incrementThree = () => {
    setCount(count + 1);
    setCount(count + 1); // All use same 'count' value!
    setCount(count + 1); // Result: count increases by 1, not 3
  };

  // ✅ CORRECT: Use functional update
  const incrementThree = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1); // Each gets latest value
    setCount((prev) => prev + 1); // Result: count increases by 3
  };

  return <button onClick={incrementThree}>Count: {count}</button>;
}
```

### Rule 3: State Updates are Asynchronous

```jsx
function Example() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log(count); // Still shows OLD value!
  };

  // Use useEffect to react to state changes
  useEffect(() => {
    console.log('Count changed to:', count);
  }, [count]);

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### Rule 4: Batch Updates

React batches multiple state updates for performance:

```jsx
function BatchExample() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const handleClick = () => {
    // React batches these - only ONE re-render!
    setA(1);
    setB(2);
  };

  console.log('Render!'); // Logs once, not twice

  return <button onClick={handleClick}>Update</button>;
}
```

---

## Derived State

**Derived state is data that can be computed from existing state.** Don't store it separately!

### Anti-Pattern: Duplicating State

```jsx
// ❌ WRONG: Storing derived data in state
function FilteredList({ items }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items); // Derived!

  // Now you must sync filteredItems with searchTerm manually
  useEffect(() => {
    setFilteredItems(items.filter((item) => item.name.includes(searchTerm)));
  }, [searchTerm, items]);

  // ...
}
```

### Correct: Compute During Render

```jsx
// ✅ CORRECT: Compute derived data during render
function FilteredList({ items }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Derived data - computed from state/props
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  );
}
```

### Real Example: Tic-Tac-Toe

```jsx
function TicTacToe() {
  // Only store the MINIMAL state - list of turns
  const [turns, setTurns] = useState([]);
  const [players, setPlayers] = useState({
    X: 'Player 1',
    O: 'Player 2'
  });

  // DERIVE everything else from turns
  const activePlayer = derivedPlayerName(turns);
  const gameBoard = deriveGameBoard(turns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = turns.length === 9 && !winner;

  function derivedPlayerName(turns) {
    return turns.length % 2 === 0 ? 'X' : 'O';
  }

  function deriveGameBoard(turns) {
    let board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];

    for (const turn of turns) {
      const { square, player } = turn;
      board[square.row][square.col] = player;
    }

    return board;
  }

  function deriveWinner(board, players) {
    const WINNING_COMBINATIONS = [
      [[0,0], [0,1], [0,2]],  // rows
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],
      [[0,0], [1,0], [2,0]],  // columns
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],
      [[0,0], [1,1], [2,2]],  // diagonals
      [[0,2], [1,1], [2,0]]
    ];

    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      const first = board[a[0]][a[1]];
      const second = board[b[0]][b[1]];
      const third = board[c[0]][c[1]];

      if (first && first === second && second === third) {
        return players[first];
      }
    }

    return null;
  }

  return (/* render using derived values */);
}
```

---

## Lifting State Up

When multiple components need to share state, **lift it to their closest common ancestor**.

### Problem: Siblings Can't Share State

```jsx
// ❌ Temperature can't be synced between inputs
function BoilingVerdict({ celsius }) {
  return celsius >= 100 ? <p>Water would boil</p> : <p>Water would not boil</p>;
}

function CelsiusInput() {
  const [temp, setTemp] = useState(''); // Local state
  return <input value={temp} onChange={(e) => setTemp(e.target.value)} />;
}

function FahrenheitInput() {
  const [temp, setTemp] = useState(''); // Separate local state
  return <input value={temp} onChange={(e) => setTemp(e.target.value)} />;
}
```

### Solution: Lift State to Parent

```jsx
function TemperatureCalculator() {
  // Lifted state - single source of truth
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');

  const celsius =
    scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit =
    scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={(temp) => {
          setTemperature(temp);
          setScale('c');
        }}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={(temp) => {
          setTemperature(temp);
          setScale('f');
        }}
      />
      <BoilingVerdict celsius={parseFloat(celsius)} />
    </div>
  );
}

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>
        Enter temperature in {scale === 'c' ? 'Celsius' : 'Fahrenheit'}:
      </legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}
```

### Pattern: Two-Way Binding

```jsx
function Parent() {
  const [name, setName] = useState('');

  return (
    <NameInput
      value={name} // Pass current value down
      onChange={setName} // Pass setter function down
    />
  );
}

function NameInput({ value, onChange }) {
  return (
    <input
      value={value} // Controlled input
      onChange={(e) => onChange(e.target.value)} // Call parent's setter
    />
  );
}
```

---

## useReducer Hook

`useReducer` is an alternative to `useState` for **complex state logic**.

### When to Use useReducer

- State has multiple sub-values
- Next state depends on previous state
- Complex state transitions
- State logic is complex enough to warrant extraction

### Basic Syntax

```jsx
import { useReducer } from 'react';

// 1. Define reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

// 2. Use in component
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

### Actions with Payload

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'INCREMENT_BY':
      return { count: state.count + action.payload }; // Use payload
    case 'SET':
      return { count: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'INCREMENT_BY', payload: 5 })}>
        +5
      </button>
      <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>
        Set to 100
      </button>
    </div>
  );
}
```

### Complex Example: Shopping Cart

```jsx
const initialState = {
  items: [],
  totalAmount: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let updatedItems;

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
        totalAmount: state.totalAmount + action.payload.price,
      };
    }

    case 'REMOVE_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );
      const existingItem = state.items[existingIndex];

      let updatedItems;

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
        totalAmount: state.totalAmount - existingItem.price,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

function ShoppingCart() {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div>
      <h2>Cart Total: ${cartState.totalAmount.toFixed(2)}</h2>
      <ul>
        {cartState.items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity}
            <button onClick={() => removeItem(item.id)}>-</button>
            <button onClick={() => addItem(item)}>+</button>
          </li>
        ))}
      </ul>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

### Lazy Initialization

```jsx
function init(initialCount) {
  return { count: initialCount };
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  //                                            ↑            ↑
  //                                   passed to init    init function

  return (/* ... */);
}
```

---

## When to Use What

### useState vs useReducer

| Feature                    | useState       | useReducer            |
| -------------------------- | -------------- | --------------------- |
| **Simple state**           | ✅ Best choice | Overkill              |
| **Complex state**          | Gets messy     | ✅ Best choice        |
| **Related state updates**  | Multiple calls | Single dispatch       |
| **State transition logic** | In component   | In reducer (testable) |
| **Deep updates**           | Spread hell    | Clean action types    |

### Decision Guide

```jsx
// ✅ useState: Simple, independent state
const [isOpen, setIsOpen] = useState(false);
const [inputValue, setInputValue] = useState('');

// ✅ useReducer: Complex, related state
const [formState, dispatch] = useReducer(formReducer, {
  values: { name: '', email: '', password: '' },
  errors: { name: '', email: '', password: '' },
  touched: { name: false, email: false, password: false },
  isSubmitting: false,
  isValid: false,
});
```

---

## State Flow Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                    React State Update Flow                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User Action (click, type)                                     │
│         │                                                       │
│         ▼                                                       │
│   Event Handler called                                          │
│         │                                                       │
│         ▼                                                       │
│   setState() / dispatch() called                                │
│         │                                                       │
│         ▼                                                       │
│   React schedules re-render (async/batched)                     │
│         │                                                       │
│         ▼                                                       │
│   Component function runs again                                 │
│         │                                                       │
│         ▼                                                       │
│   New JSX returned with updated state                           │
│         │                                                       │
│         ▼                                                       │
│   Virtual DOM diffed → Real DOM updated                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Common Debugging Scenarios

### State Not Updating?

```jsx
// ❌ Problem 1: Mutating state directly
const [user, setUser] = useState({ name: 'John' });
user.name = 'Jane'; // Mutation - won't trigger re-render!
setUser(user); // Same reference

// ✅ Solution: Create new object
setUser({ ...user, name: 'Jane' });

// ❌ Problem 2: Stale closure
const [count, setCount] = useState(0);
setTimeout(() => {
  console.log(count); // Always shows old value!
}, 3000);

// ✅ Solution: Use ref or functional update
const countRef = useRef(count);
countRef.current = count;
setTimeout(() => {
  console.log(countRef.current); // Shows current value
}, 3000);
```

### State Updating Too Many Times?

```jsx
// ❌ Problem: Infinite loop
useEffect(() => {
  setData(processData(data)); // Updates data, triggers effect again!
}, [data]);

// ✅ Solution: Add condition or remove from deps
useEffect(() => {
  if (!data.processed) {
    setData({ ...data, processed: true });
  }
}, [data]);
```

---

## State Management Patterns Cheat Sheet

```jsx
// 1. Simple toggle
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen((prev) => !prev);

// 2. Input binding
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />;

// 3. Object update
setUser((prev) => ({ ...prev, name: 'New Name' }));

// 4. Array operations
setItems((prev) => [...prev, newItem]); // Add
setItems((prev) => prev.filter((i) => i.id !== id)); // Remove
setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: true } : i))); // Update

// 5. Computed property name
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

// 6. Conditional state update
setCount((prev) => (prev < 10 ? prev + 1 : prev));

// 7. Batch related updates with reducer
dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
```

---

## Practice Exercises

1. Build a counter that can increment, decrement, and reset
2. Create a todo list with add, remove, and toggle completion
3. Build a form with multiple inputs using object state
4. Convert a useState-based shopping cart to useReducer
5. Create a step wizard component with previous/next navigation

---

_Next: [03-React Hooks Deep Dive](./03-hooks-deep-dive.md)_

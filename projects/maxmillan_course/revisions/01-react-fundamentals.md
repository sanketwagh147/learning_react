# React Fundamentals - Complete Revision Guide

## Table of Contents

1. [What is React?](#what-is-react)
2. [JSX - JavaScript XML](#jsx---javascript-xml)
3. [Components](#components)
4. [Props - Passing Data](#props---passing-data)
5. [Fragments](#fragments)
6. [Conditional Rendering](#conditional-rendering)
7. [Rendering Lists](#rendering-lists)
8. [Event Handling](#event-handling)

---

## What is React?

React is a **JavaScript library** for building user interfaces. It was developed by Facebook and focuses on:

- **Declarative**: You describe WHAT you want, React figures out HOW to do it
- **Component-Based**: Build encapsulated components that manage their own state
- **Learn Once, Write Anywhere**: React can render on the server (Node) or mobile (React Native)

### The Virtual DOM

React uses a **Virtual DOM** - a lightweight JavaScript representation of the actual DOM.

```
User Action → State Change → Virtual DOM Update → Diff Algorithm → Minimal Real DOM Updates
```

**Why Virtual DOM?**

- Real DOM manipulation is slow
- React batches updates and minimizes actual DOM changes
- Results in better performance

---

## JSX - JavaScript XML

JSX is a syntax extension that allows you to write HTML-like code in JavaScript.

### Basic JSX Rules

```jsx
// 1. Must return a single root element
function App() {
  return (
    <div>
      <h1>Hello</h1>
      <p>World</p>
    </div>
  );
}

// 2. All tags must be closed
<img src="image.png" />  // Self-closing for void elements
<div></div>               // Or explicit closing tag

// 3. Use className instead of class
<div className="container">Content</div>

// 4. Use camelCase for attributes
<button onClick={handleClick}>Click</button>
<label htmlFor="email">Email</label>
```

### JavaScript Expressions in JSX

Use curly braces `{}` to embed JavaScript expressions:

```jsx
function Greeting() {
  const name = 'Sanket';
  const today = new Date();

  return (
    <div>
      {/* Variables */}
      <h1>Hello, {name}!</h1>

      {/* Expressions */}
      <p>2 + 2 = {2 + 2}</p>

      {/* Function calls */}
      <p>Today is {today.toDateString()}</p>

      {/* Ternary operators */}
      <p>{name ? `Welcome, ${name}` : 'Please log in'}</p>

      {/* Object properties */}
      <p>Year: {today.getFullYear()}</p>
    </div>
  );
}
```

### Dynamic Attributes

```jsx
function Image({ src, alt, size }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: size, height: size }}
      className={size > 100 ? 'large' : 'small'}
    />
  );
}
```

### Comments in JSX

```jsx
function App() {
  return (
    <div>
      {/* This is a JSX comment */}
      <h1>Hello</h1>
    </div>
  );
}
```

---

## Components

Components are the building blocks of React applications. They are **reusable, independent pieces of UI**.

### Function Components (Modern Approach)

```jsx
// Basic function component
function Welcome() {
  return <h1>Welcome to React!</h1>;
}

// Arrow function component
const Welcome = () => {
  return <h1>Welcome to React!</h1>;
};

// Implicit return (single expression)
const Welcome = () => <h1>Welcome to React!</h1>;
```

### Component Rules

1. **Must start with a capital letter** - React differentiates between DOM elements (lowercase) and components (uppercase)
2. **Must return JSX** - A single root element or Fragment
3. **Should be pure** - Same inputs should always return the same output

```jsx
// ✅ Correct - Capital letter
function MyButton() {
  return <button>Click me</button>;
}

// ❌ Wrong - lowercase
function myButton() {
  return <button>Click me</button>;
}
```

### Using Components

```jsx
function App() {
  return (
    <div>
      <Welcome /> {/* Self-closing if no children */}
      <Welcome></Welcome> {/* Or with closing tag */}
    </div>
  );
}
```

### Component Composition

Build complex UIs by composing smaller components:

```jsx
function Header() {
  return (
    <header>
      <h1>My App</h1>
    </header>
  );
}

function Sidebar() {
  return <aside>Navigation here</aside>;
}

function MainContent() {
  return <main>Content here</main>;
}

function App() {
  return (
    <div className="app">
      <Header />
      <div className="layout">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}
```

### Dynamic Component Selection

```jsx
// Dynamically choose element/component based on props
function Heading({ level, children }) {
  const Tag = `h${level}`; // h1, h2, h3, etc.
  return <Tag>{children}</Tag>;
}

// Usage
<Heading level={1}>Main Title</Heading>    // renders <h1>
<Heading level={2}>Subtitle</Heading>      // renders <h2>
```

---

## Props - Passing Data

Props (properties) are the way to pass data from parent to child components.

### Basic Props

```jsx
// Parent component
function App() {
  return <UserCard name="Sanket" age={25} isActive={true} />;
}

// Child component receiving props
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Status: {props.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
```

### Destructuring Props

```jsx
// Destructure in parameter
function UserCard({ name, age, isActive }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}

// Destructure inside function
function UserCard(props) {
  const { name, age, isActive } = props;
  // ...
}
```

### Default Props

```jsx
// Using default parameters
function Button({ text = 'Click me', color = 'blue' }) {
  return <button style={{ backgroundColor: color }}>{text}</button>;
}

// Using defaultProps (older pattern)
function Button({ text, color }) {
  return <button style={{ backgroundColor: color }}>{text}</button>;
}
Button.defaultProps = {
  text: 'Click me',
  color: 'blue',
};
```

### Spread Props

```jsx
const userData = {
  name: "Sanket",
  age: 25,
  email: "sanket@example.com"
};

// Instead of passing each prop individually
<UserCard name={userData.name} age={userData.age} email={userData.email} />

// Use spread operator
<UserCard {...userData} />
```

### Children Prop

The special `children` prop contains content between opening and closing tags:

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage
<Card title="Welcome">
  <p>This is the card content.</p>
  <button>Click me</button>
</Card>;
```

### Props are Read-Only

**IMPORTANT**: Never modify props directly!

```jsx
// ❌ WRONG - Never do this
function UserCard({ name }) {
  name = 'Modified'; // This is wrong!
  return <h2>{name}</h2>;
}

// ✅ CORRECT - Props are read-only
function UserCard({ name }) {
  const displayName = name.toUpperCase(); // Create new value
  return <h2>{displayName}</h2>;
}
```

### Passing Functions as Props

```jsx
function Parent() {
  const handleClick = (message) => {
    alert(message);
  };

  return <Child onButtonClick={handleClick} />;
}

function Child({ onButtonClick }) {
  return (
    <button onClick={() => onButtonClick('Hello from Child!')}>Click me</button>
  );
}
```

---

## Fragments

Fragments let you group multiple elements without adding extra DOM nodes.

### Problem: Single Root Element

```jsx
// ❌ This causes issues - no single root
function App() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
}

// ❌ Adding unnecessary div
function App() {
  return (
    <div>  {/* Extra DOM node we don't need */}
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}
```

### Solution: Fragments

```jsx
import { Fragment } from 'react';

// Using Fragment
function App() {
  return (
    <Fragment>
      <h1>Title</h1>
      <p>Paragraph</p>
    </Fragment>
  );
}

// Using short syntax (more common)
function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}
```

### Fragment with Keys (in lists)

```jsx
function Items({ items }) {
  return (
    <dl>
      {items.map((item) => (
        // Must use Fragment when you need a key
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

---

## Conditional Rendering

React provides several ways to render content conditionally.

### Using && (Logical AND)

```jsx
function Notifications({ count }) {
  return <div>{count > 0 && <span>You have {count} notifications</span>}</div>;
}
```

**Caution with &&:**

```jsx
// ❌ Problem: 0 will be rendered
{
  count && <span>Messages</span>;
} // If count is 0, renders "0"

// ✅ Solution: Explicit boolean check
{
  count > 0 && <span>Messages</span>;
}
```

### Using Ternary Operator

```jsx
function LoginButton({ isLoggedIn }) {
  return <button>{isLoggedIn ? 'Logout' : 'Login'}</button>;
}

// For JSX elements
function Greeting({ isLoggedIn }) {
  return <>{isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in</h1>}</>;
}
```

### Using if Statements

```jsx
function StatusMessage({ status }) {
  let message;

  if (status === 'loading') {
    message = <p>Loading...</p>;
  } else if (status === 'error') {
    message = <p>Something went wrong!</p>;
  } else if (status === 'success') {
    message = <p>Data loaded successfully!</p>;
  } else {
    message = null;
  }

  return <div>{message}</div>;
}
```

### Early Return Pattern

```jsx
function UserProfile({ user }) {
  if (!user) {
    return <p>No user data available</p>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Conditional CSS Classes

```jsx
function Button({ isActive, children }) {
  return (
    <button className={`btn ${isActive ? 'btn-active' : 'btn-inactive'}`}>
      {children}
    </button>
  );
}

// Or using template literal
function Input({ hasError }) {
  return (
    <input
      className={hasError ? 'input-error' : undefined}
      style={{ borderColor: hasError ? 'red' : 'gray' }}
    />
  );
}
```

---

## Rendering Lists

Render arrays of data using the `map()` method.

### Basic List Rendering

```jsx
function TodoList() {
  const todos = ['Learn React', 'Build Projects', 'Get Job'];

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
}
```

### The Key Prop

**Keys help React identify which items have changed, been added, or removed.**

```jsx
// ✅ Best: Use unique ID from data
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

<ul>
  {users.map(user => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>

// ⚠️ Acceptable: Use index only if list is static
<ul>
  {items.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>

// ❌ Never: Use random values
<li key={Math.random()}>{item}</li>  // Creates new key every render!
```

### Rendering Complex Lists

```jsx
function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
}

// Or with spread
{
  products.map((product) => <ProductCard key={product.id} {...product} />);
}
```

### Filtering and Mapping

```jsx
function ActiveUsers({ users }) {
  return (
    <ul>
      {users
        .filter((user) => user.isActive)
        .map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
    </ul>
  );
}
```

### Empty State Handling

```jsx
function TodoList({ todos }) {
  if (todos.length === 0) {
    return <p>No todos yet. Add one!</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

---

## Event Handling

React events use camelCase and pass functions as event handlers.

### Basic Event Handling

```jsx
function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <button onClick={handleClick}>Click me</button>;
}

// Inline handler (for simple cases)
<button onClick={() => console.log('Clicked!')}>Click me</button>;
```

### Passing Arguments to Handlers

```jsx
function ItemList({ items }) {
  const handleDelete = (id) => {
    console.log('Deleting item:', id);
  };

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          {/* Arrow function to pass argument */}
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### The Event Object

```jsx
function Form() {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    console.log('Form submitted!');
  };

  const handleChange = (event) => {
    console.log('Input value:', event.target.value);
    console.log('Input name:', event.target.name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} placeholder="Enter email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Common Events

```jsx
function EventExamples() {
  return (
    <div>
      {/* Click events */}
      <button onClick={() => {}}>Click</button>
      <button onDoubleClick={() => {}}>Double Click</button>
      {/* Form events */}
      <input onChange={() => {}} />
      <input onBlur={() => {}} />
      <input onFocus={() => {}} />
      <form onSubmit={() => {}} />
      {/* Keyboard events */}
      <input onKeyDown={() => {}} />
      <input onKeyUp={() => {}} />
      <input onKeyPress={() => {}} /> {/* Deprecated */}
      {/* Mouse events */}
      <div onMouseEnter={() => {}} />
      <div onMouseLeave={() => {}} />
      <div onMouseOver={() => {}} />
      {/* Touch events (mobile) */}
      <div onTouchStart={() => {}} />
      <div onTouchEnd={() => {}} />
    </div>
  );
}
```

### Prevent Default and Stop Propagation

```jsx
function Link() {
  const handleClick = (event) => {
    event.preventDefault(); // Prevent default browser behavior
    event.stopPropagation(); // Prevent event bubbling
    // Custom logic here
  };

  return (
    <a href="https://google.com" onClick={handleClick}>
      Custom Link
    </a>
  );
}
```

---

## Summary

| Concept                   | Key Point                                        |
| ------------------------- | ------------------------------------------------ |
| **JSX**                   | HTML-like syntax in JS, use `{}` for expressions |
| **Components**            | Reusable UI pieces, must return single root      |
| **Props**                 | Read-only data from parent to child              |
| **Fragments**             | Group elements without extra DOM nodes           |
| **Conditional Rendering** | Use `&&`, ternary, or `if` statements            |
| **Lists**                 | Use `map()` with unique `key` prop               |
| **Events**                | camelCase, pass function reference               |

---

## Practice Exercises

1. Create a `Card` component that accepts `title`, `content`, and `footer` as props
2. Build a `UserList` component that renders an array of users with conditional "Admin" badge
3. Create a `Toggle` component that shows/hides content on button click
4. Build a `Tabs` component that renders different content based on active tab

---

_Next: [02-State and Props Management](./02-state-and-props.md)_

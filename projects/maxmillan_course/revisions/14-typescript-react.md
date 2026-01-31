# TypeScript with React - Complete Revision Guide

## Table of Contents

1. [Why TypeScript?](#why-typescript)
2. [Basic Types](#basic-types)
3. [Typing Components](#typing-components)
4. [Props Types](#props-types)
5. [State Types](#state-types)
6. [Event Types](#event-types)
7. [Hooks with TypeScript](#hooks-with-typescript)
8. [Context with TypeScript](#context-with-typescript)
9. [Generic Components](#generic-components)
10. [Utility Types](#utility-types)
11. [Best Practices](#best-practices)

---

## Why TypeScript?

### Benefits

- **Catch errors at compile time** instead of runtime
- **Better IDE support** - autocomplete, refactoring
- **Self-documenting code** - types serve as documentation
- **Safer refactoring** - compiler catches breaking changes
- **Better team collaboration** - explicit contracts

### TypeScript vs JavaScript

```tsx
// JavaScript - No type safety
function greet(name) {
  return `Hello, ${name.toUpperCase()}!`;
}

greet(123); // Runtime error: name.toUpperCase is not a function

// TypeScript - Compile-time safety
function greet(name: string): string {
  return `Hello, ${name.toUpperCase()}!`;
}

greet(123); // ❌ Compile error: Argument of type 'number' is not assignable
```

---

## Basic Types

### Primitive Types

```typescript
// Basic types
let name: string = 'Sanket';
let age: number = 25;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['a', 'b', 'c']; // Generic syntax

// Tuples (fixed-length array with specific types)
let tuple: [string, number] = ['hello', 42];

// Any (avoid when possible!)
let anything: any = 'can be anything';

// Unknown (safer than any)
let unknown: unknown = 4;
// Must check type before using
if (typeof unknown === 'number') {
  console.log(unknown + 1);
}

// Void (for functions that don't return)
function log(message: string): void {
  console.log(message);
}

// Never (for functions that never return)
function throwError(message: string): never {
  throw new Error(message);
}
```

### Object Types

```typescript
// Object type annotation
let user: { name: string; age: number } = {
  name: 'Sanket',
  age: 25,
};

// Optional properties
let config: { debug?: boolean; theme: string } = {
  theme: 'dark',
  // debug is optional
};

// Readonly properties
let point: { readonly x: number; readonly y: number } = {
  x: 10,
  y: 20,
};
point.x = 5; // ❌ Error: Cannot assign to 'x' because it is a read-only property
```

### Type Aliases & Interfaces

```typescript
// Type alias
type User = {
  id: number;
  name: string;
  email: string;
};

// Interface
interface Product {
  id: number;
  name: string;
  price: number;
}

// Extending interfaces
interface Employee extends User {
  department: string;
  salary: number;
}

// Extending types (intersection)
type Admin = User & {
  permissions: string[];
};

// Union types
type Status = 'pending' | 'success' | 'error';
type ID = string | number;

// Literal types
type Direction = 'up' | 'down' | 'left' | 'right';
```

### When to Use Type vs Interface

```typescript
// Use INTERFACE for:
// - Object shapes that may be extended
// - Public APIs
// - Declaration merging (advanced)

interface ButtonProps {
  label: string;
  onClick: () => void;
}

// Use TYPE for:
// - Union types
// - Primitive aliases
// - Tuples
// - Complex type compositions

type Theme = 'light' | 'dark';
type Coordinates = [number, number];
type CallbackFn = (value: string) => void;
```

---

## Typing Components

### Function Components

```tsx
import { FC, ReactNode } from 'react';

// Method 1: Inline props typing (RECOMMENDED)
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Method 2: Props interface
interface GreetingProps {
  name: string;
  age?: number; // Optional prop
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
}

// Method 3: FC type (includes children implicitly in older React)
// Note: FC no longer includes children by default in React 18+
const Greeting: FC<GreetingProps> = ({ name, age }) => {
  return <h1>Hello, {name}!</h1>;
};
```

### Component with Children

```tsx
import { ReactNode, PropsWithChildren } from 'react';

// Method 1: Explicit children type
interface CardProps {
  title: string;
  children: ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Method 2: Using PropsWithChildren
interface CardProps {
  title: string;
}

function Card({ title, children }: PropsWithChildren<CardProps>) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage
<Card title="Welcome">
  <p>This is the content</p>
</Card>;
```

### Return Types

```tsx
// Return type is inferred (recommended for most cases)
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Explicit return type
function Greeting({ name }: { name: string }): JSX.Element {
  return <h1>Hello, {name}!</h1>;
}

// Component that may return null
function MaybeGreeting({ name }: { name?: string }): JSX.Element | null {
  if (!name) return null;
  return <h1>Hello, {name}!</h1>;
}
```

---

## Props Types

### Basic Props

```tsx
interface ButtonProps {
  // Required props
  label: string;
  onClick: () => void;

  // Optional props
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';

  // Default value with destructuring
}

function Button({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
```

### Extending HTML Element Props

```tsx
import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Button with all native button props
interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

function CustomButton({
  variant = 'primary',
  isLoading,
  children,
  ...rest // All other button props (onClick, disabled, etc.)
}: CustomButtonProps) {
  return (
    <button className={`btn-${variant}`} {...rest}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

// Input with all native input props
interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function CustomInput({ label, error, ...rest }: CustomInputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...rest} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

### Component Props (Polymorphic Components)

```tsx
import { ComponentPropsWithoutRef, ElementType } from 'react';

// Polymorphic component that can be any element
interface PolymorphicProps<T extends ElementType> {
  as?: T;
  children: ReactNode;
}

type Props<T extends ElementType> = PolymorphicProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PolymorphicProps<T>>;

function Box<T extends ElementType = 'div'>({
  as,
  children,
  ...rest
}: Props<T>) {
  const Component = as || 'div';
  return <Component {...rest}>{children}</Component>;
}

// Usage
<Box>Default div</Box>
<Box as="section">I'm a section</Box>
<Box as="a" href="/home">I'm a link</Box>
```

---

## State Types

### useState

```tsx
import { useState } from 'react';

// Type is inferred from initial value
const [count, setCount] = useState(0); // number
const [name, setName] = useState(''); // string
const [isOpen, setIsOpen] = useState(false); // boolean

// Explicit type for complex types
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);

// Array state
const [items, setItems] = useState<string[]>([]);

// Object state
interface FormData {
  email: string;
  password: string;
}

const [formData, setFormData] = useState<FormData>({
  email: '',
  password: '',
});
```

### useReducer

```tsx
import { useReducer } from 'react';

// State type
interface State {
  count: number;
  error: string | null;
}

// Action types (discriminated union)
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'incrementBy'; payload: number }
  | { type: 'reset' }
  | { type: 'setError'; payload: string };

// Initial state
const initialState: State = {
  count: 0,
  error: null,
};

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'incrementBy':
      return { ...state, count: state.count + action.payload };
    case 'reset':
      return initialState;
    case 'setError':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Usage
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'incrementBy', payload: 5 })}>
        +5
      </button>
    </div>
  );
}
```

---

## Event Types

### Common Event Types

```tsx
import {
  MouseEvent,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  FocusEvent,
} from 'react';

function EventExamples() {
  // Click event
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked at:', event.clientX, event.clientY);
  };

  // Change event (input)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('Value:', event.target.value);
  };

  // Change event (select)
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log('Selected:', event.target.value);
  };

  // Form submit
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
  };

  // Keyboard event
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Enter pressed');
    }
  };

  // Focus events
  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    console.log('Focused');
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    console.log('Blurred');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <select onChange={handleSelectChange}>
        <option>A</option>
        <option>B</option>
      </select>
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

### Event Handler Props

```tsx
// Typing event handler props
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

// Or using React's built-in types
import { MouseEventHandler, ChangeEventHandler, FormEventHandler } from 'react';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

interface InputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}
```

---

## Hooks with TypeScript

### useRef

```tsx
import { useRef, useEffect } from 'react';

// DOM ref (null initial value with type assertion)
function InputFocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // inputRef.current may be null
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}

// Mutable ref (for storing values)
function Timer() {
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = window.setInterval(() => {
      console.log('tick');
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

### useCallback

```tsx
import { useCallback } from 'react';

function SearchComponent() {
  // Type is inferred from function
  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
  }, []);

  // Explicit typing
  const handleSubmit = useCallback<(data: FormData) => Promise<void>>(
    async (data) => {
      await submitForm(data);
    },
    []
  );

  return <SearchInput onSearch={handleSearch} />;
}
```

### useMemo

```tsx
import { useMemo } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductList({ products }: { products: Product[] }) {
  // Type is inferred
  const total = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price, 0);
  }, [products]);

  // Explicit type
  const expensiveProducts = useMemo<Product[]>(() => {
    return products.filter((p) => p.price > 100);
  }, [products]);

  return (
    <div>
      <p>Total: ${total}</p>
      {expensiveProducts.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

### Custom Hooks

```tsx
import { useState, useEffect } from 'react';

// Custom hook with types
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
interface User {
  id: number;
  name: string;
}

function UserProfile() {
  const { data: user, loading, error } = useFetch<User>('/api/user');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return null;

  return <div>{user.name}</div>;
}
```

---

## Context with TypeScript

### Creating Typed Context

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define types
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// 2. Create context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create provider
interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const userData = await response.json();
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Create custom hook with type checking
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 5. Usage
function Profile() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Generic Components

### Basic Generic Component

```tsx
// Generic list component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
];

<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>;
```

### Generic Select Component

```tsx
interface Option<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

function Select<T extends string | number>({
  options,
  value,
  onChange,
}: SelectProps<T>) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Usage
type Theme = 'light' | 'dark' | 'system';

const themeOptions: Option<Theme>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

<Select<Theme>
  options={themeOptions}
  value={selectedTheme}
  onChange={setSelectedTheme}
/>;
```

---

## Utility Types

### Built-in Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - All properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string }

// Required - All properties required
type RequiredUser = Required<PartialUser>;

// Pick - Select specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;
// { email: string; password: string }

// Omit - Exclude specific properties
type PublicUser = Omit<User, 'password'>;
// { id: number; name: string; email: string }

// Readonly - All properties readonly
type ReadonlyUser = Readonly<User>;

// Record - Create object type with key-value pairs
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
// { [key: string]: 'admin' | 'user' | 'guest' }

// Extract - Extract types from union
type Actions = 'create' | 'read' | 'update' | 'delete';
type WriteActions = Extract<Actions, 'create' | 'update' | 'delete'>;
// 'create' | 'update' | 'delete'

// Exclude - Exclude types from union
type ReadOnlyActions = Exclude<Actions, 'create' | 'update' | 'delete'>;
// 'read'

// NonNullable - Remove null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

// ReturnType - Get return type of function
function getUser() {
  return { id: 1, name: 'John' };
}
type UserReturn = ReturnType<typeof getUser>;
// { id: number; name: string }

// Parameters - Get parameter types
function createUser(name: string, age: number) {}
type CreateUserParams = Parameters<typeof createUser>;
// [string, number]
```

### Practical Utility Examples

```tsx
// Form component with partial updates
interface FormData {
  name: string;
  email: string;
  age: number;
}

function useForm(initialData: FormData) {
  const [data, setData] = useState(initialData);

  // Update with partial data
  const updateField = (updates: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return { data, updateField };
}

// API response types
interface ApiUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// For creating new user (no id or timestamps)
type CreateUserDto = Omit<ApiUser, 'id' | 'createdAt' | 'updatedAt'>;

// For updating user (all fields optional except id)
type UpdateUserDto = Partial<Omit<ApiUser, 'id'>> & Pick<ApiUser, 'id'>;
```

---

## Best Practices

### 1. Prefer Inference When Clear

```tsx
// ❌ Unnecessary type annotation
const [count, setCount] = useState<number>(0);

// ✅ Let TypeScript infer
const [count, setCount] = useState(0);

// ✅ Annotate when inference isn't enough
const [user, setUser] = useState<User | null>(null);
```

### 2. Use Discriminated Unions for State

```tsx
// ❌ Multiple boolean flags
interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
}

// ✅ Discriminated union - clearer states
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload };
    case 'FETCH_ERROR':
      return { status: 'error', error: action.payload };
    default:
      return state;
  }
}
```

### 3. Type Your API Responses

```tsx
// Define API types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface User {
  id: number;
  name: string;
}

// Type-safe API call
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const result: ApiResponse<User> = await response.json();
  return result.data;
}
```

### 4. Use Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 5. Export Types for Reuse

```tsx
// types.ts - Centralized types
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface ApiError {
  code: string;
  message: string;
}

// Import where needed
import type { User, UserRole } from './types';
```

---

## Quick Reference

```tsx
// Component with props
interface Props {
  name: string;
  age?: number;
  children: ReactNode;
}

function Component({ name, age = 0, children }: Props) {
  return <div>{children}</div>;
}

// State
const [value, setValue] = useState<string | null>(null);

// Events
const handleClick = (e: MouseEvent<HTMLButtonElement>) => {};
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};

// Refs
const ref = useRef<HTMLInputElement>(null);

// Context
const Context = createContext<ContextType | undefined>(undefined);

// Generic component
function List<T>({ items }: { items: T[] }) {
  return null;
}
```

---

## 🎯 Common Interview Questions

### Q1: What is the difference between `type` and `interface`?

**Answer:**

- **Interface**: Extendable with `extends`, can be merged, better for objects
- **Type**: More flexible, supports unions, intersections, and primitives
- Use interface for objects/classes, type for unions and complex types

### Q2: How do you type event handlers in React?

**Answer:**

```tsx
import { MouseEvent, ChangeEvent } from 'react';

const handleClick = (e: MouseEvent<HTMLButtonElement>) => {};
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};
```

### Q3: What is the difference between `any` and `unknown`?

**Answer:**

- **any**: Disables type checking (avoid!)
- **unknown**: Type-safe version, must check type before using

```tsx
let value: unknown = getData();
if (typeof value === 'string') {
  console.log(value.toUpperCase()); // Safe!
}
```

### Q4: How do you type children in React components?

**Answer:**

```tsx
import { ReactNode, PropsWithChildren } from 'react';

// Option 1: ReactNode
interface Props {
  children: ReactNode;
}

// Option 2: PropsWithChildren helper
type Props = PropsWithChildren<{ title: string }>;
```

### Q5: Explain generic components in React.

**Answer:** Generic components accept type parameters for flexibility:

```tsx
function List<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
}) {
  return <ul>{items.map(renderItem)}</ul>;
}

// Usage infers type from items
<List items={users} renderItem={(user) => <li>{user.name}</li>} />;
```

---

## Practice Exercises

1. Convert a JavaScript React app to TypeScript
2. Create a generic Table component with typed columns
3. Build a form with typed form values and validation
4. Type a Context with multiple values and actions
5. Create a custom hook with generic return type

---

_Next: [15-advanced-patterns.md](./15-advanced-patterns.md)_

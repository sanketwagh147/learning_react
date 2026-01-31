# Testing React Applications - Complete Revision Guide

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Jest Fundamentals](#jest-fundamentals)
3. [React Testing Library Basics](#react-testing-library-basics)
4. [Rendering Components](#rendering-components)
5. [Querying Elements](#querying-elements)
6. [User Interactions](#user-interactions)
7. [Testing Async Code](#testing-async-code)
8. [Testing Hooks](#testing-hooks)
9. [Mocking](#mocking)
10. [Best Practices](#best-practices)

---

## Testing Overview

### Types of Tests

| Type            | Scope                        | Speed  | Confidence |
| --------------- | ---------------------------- | ------ | ---------- |
| **Unit**        | Single function/component    | Fast   | Low        |
| **Integration** | Multiple components together | Medium | Medium     |
| **End-to-End**  | Full user flows in browser   | Slow   | High       |

### The Testing Trophy

```
           /\
          /E2E\        ← Few, high value
         /------\
        /Integr- \     ← Many, good balance
       /  ation   \
      /------------\
     /    Unit      \  ← Some, targeted
    /________________\
   /  Static Types    \ ← TypeScript/ESLint
```

### Testing Philosophy

```jsx
// ❌ Testing implementation details
test('state changes when button clicked', () => {
  const { result } = renderHook(() => useState(0));
  act(() => result.current[1](1));
  expect(result.current[0]).toBe(1);
});

// ✅ Testing behavior (what users see)
test('counter increments when button clicked', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

---

## Jest Fundamentals

### Test Structure

```javascript
// Basic test structure
describe('Calculator', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset state, mock functions, etc.
  });

  // Cleanup after each test
  afterEach(() => {
    // Clean up mocks, timers, etc.
  });

  // Individual test
  test('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  // Alternative syntax
  it('subtracts two numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  // Nested describe for grouping
  describe('division', () => {
    it('divides two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('throws error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
});
```

### Common Matchers

```javascript
// Equality
expect(value).toBe(5); // Strict equality (===)
expect(value).toEqual({ a: 1 }); // Deep equality for objects
expect(value).not.toBe(3); // Negation

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3); // For floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(array).toEqual(expect.arrayContaining([1, 2]));

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', 'value');
expect(obj).toMatchObject({ a: 1 }); // Partial match

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');
expect(() => fn()).toThrow(Error);

// Async
await expect(asyncFn()).resolves.toBe(value);
await expect(asyncFn()).rejects.toThrow('error');
```

### Setup and Teardown

```javascript
describe('Database tests', () => {
  // Run once before all tests in this describe
  beforeAll(async () => {
    await connectToDatabase();
  });

  // Run once after all tests
  afterAll(async () => {
    await disconnectFromDatabase();
  });

  // Run before each test
  beforeEach(async () => {
    await clearDatabase();
    await seedTestData();
  });

  // Run after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
});
```

---

## React Testing Library Basics

### Installation

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Setup

```javascript
// setupTests.js (automatically loaded by Create React App)
import '@testing-library/jest-dom';

// This adds custom matchers like:
// - toBeInTheDocument()
// - toHaveTextContent()
// - toBeVisible()
// - toBeDisabled()
// etc.
```

### Core Principle

> "The more your tests resemble the way your software is used,
> the more confidence they can give you." - Kent C. Dodds

```jsx
// React Testing Library encourages testing from user's perspective
// Not: "Does state equal X?"
// But: "Can the user see Y on the screen?"
```

---

## Rendering Components

### Basic Rendering

```jsx
import { render, screen } from '@testing-library/react';
import Greeting from './Greeting';

test('renders greeting message', () => {
  // Render the component
  render(<Greeting name="Sanket" />);

  // Query the DOM (screen object)
  const heading = screen.getByText('Hello, Sanket!');

  // Assert
  expect(heading).toBeInTheDocument();
});
```

### Rendering with Props

```jsx
test('renders different messages based on props', () => {
  const { rerender } = render(<Button variant="primary">Click</Button>);

  expect(screen.getByRole('button')).toHaveClass('btn-primary');

  // Re-render with different props
  rerender(<Button variant="secondary">Click</Button>);

  expect(screen.getByRole('button')).toHaveClass('btn-secondary');
});
```

### Rendering with Context/Providers

```jsx
import { ThemeProvider } from './ThemeContext';

// Custom render function with providers
function renderWithProviders(ui, options = {}) {
  const { theme = 'light', ...renderOptions } = options;

  function Wrapper({ children }) {
    return <ThemeProvider value={theme}>{children}</ThemeProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Usage
test('renders with theme context', () => {
  renderWithProviders(<ThemedButton />, { theme: 'dark' });
  expect(screen.getByRole('button')).toHaveClass('dark-theme');
});
```

### Rendering with Router

```jsx
import { MemoryRouter } from 'react-router-dom';

function renderWithRouter(ui, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

test('navigates to about page', () => {
  renderWithRouter(<App />, { route: '/about' });
  expect(screen.getByText('About Us')).toBeInTheDocument();
});
```

---

## Querying Elements

### Query Priority (Most to Least Preferred)

```jsx
// 1. Accessible queries (BEST - how users find elements)
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByPlaceholderText('Enter your name');
screen.getByText('Welcome');
screen.getByDisplayValue('current value');

// 2. Semantic queries
screen.getByAltText('profile picture');
screen.getByTitle('Close');

// 3. Test IDs (LAST RESORT)
screen.getByTestId('custom-element');
```

### Query Types

```jsx
// getBy* - Throws if not found (use when element should exist)
const button = screen.getByRole('button');

// queryBy* - Returns null if not found (use for asserting non-existence)
const modal = screen.queryByRole('dialog');
expect(modal).not.toBeInTheDocument();

// findBy* - Returns promise, waits for element (use for async)
const message = await screen.findByText('Success!');

// *AllBy* - Returns array of all matches
const items = screen.getAllByRole('listitem');
expect(items).toHaveLength(3);
```

### Query Cheat Sheet

| Need to find... | No Match | 1 Match | >1 Match | Await? |
| --------------- | -------- | ------- | -------- | ------ |
| `getBy`         | throw    | return  | throw    | No     |
| `queryBy`       | null     | return  | throw    | No     |
| `findBy`        | throw    | return  | throw    | Yes    |
| `getAllBy`      | throw    | array   | array    | No     |
| `queryAllBy`    | []       | array   | array    | No     |
| `findAllBy`     | throw    | array   | array    | Yes    |

### Role Query Examples

```jsx
// Common ARIA roles
screen.getByRole('button');
screen.getByRole('textbox'); // <input type="text">
screen.getByRole('checkbox');
screen.getByRole('radio');
screen.getByRole('combobox'); // <select>
screen.getByRole('link'); // <a>
screen.getByRole('heading'); // <h1> - <h6>
screen.getByRole('list'); // <ul>, <ol>
screen.getByRole('listitem'); // <li>
screen.getByRole('img'); // <img>
screen.getByRole('dialog'); // Modal
screen.getByRole('alert');
screen.getByRole('navigation'); // <nav>

// With options
screen.getByRole('heading', { level: 1 }); // <h1>
screen.getByRole('button', { name: /submit/i }); // Button with text
screen.getByRole('textbox', { name: /email/i }); // Input by label
screen.getByRole('checkbox', { checked: true }); // Checked checkbox
```

### Text Matching Options

```jsx
// Exact match (default)
screen.getByText('Hello World');

// Case-insensitive regex
screen.getByText(/hello world/i);

// Partial match with regex
screen.getByText(/hello/i);

// Custom function
screen.getByText((content, element) => {
  return content.startsWith('Hello') && element.tagName === 'H1';
});
```

---

## User Interactions

### Using user-event (Recommended)

```jsx
import userEvent from '@testing-library/user-event';

test('user interaction flow', async () => {
  // Setup user event instance
  const user = userEvent.setup();

  render(<LoginForm />);

  // Type in input
  await user.type(screen.getByLabelText('Email'), 'test@example.com');

  // Click button
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Verify result
  expect(screen.getByText('Welcome!')).toBeInTheDocument();
});
```

### Common User Actions

```jsx
const user = userEvent.setup();

// Clicking
await user.click(element);
await user.dblClick(element);
await user.tripleClick(element);

// Typing
await user.type(input, 'Hello World');
await user.type(input, 'Hello{enter}'); // With special keys
await user.clear(input); // Clear input

// Keyboard
await user.keyboard('Hello');
await user.keyboard('{Enter}');
await user.keyboard('{Shift>}A{/Shift}'); // Shift + A

// Selection
await user.selectOptions(select, ['option1', 'option2']);

// Checkbox/Radio
await user.click(checkbox);

// Hover
await user.hover(element);
await user.unhover(element);

// Tab navigation
await user.tab();
await user.tab({ shift: true }); // Shift + Tab
```

### Using fireEvent (Lower Level)

```jsx
import { fireEvent } from '@testing-library/react';

// Click
fireEvent.click(button);

// Change
fireEvent.change(input, { target: { value: 'new value' } });

// Submit
fireEvent.submit(form);

// Keyboard
fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

// Focus
fireEvent.focus(input);
fireEvent.blur(input);
```

### Testing Form Submission

```jsx
test('form submission', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();

  render(<ContactForm onSubmit={handleSubmit} />);

  // Fill form
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/message/i), 'Hello there!');

  // Submit
  await user.click(screen.getByRole('button', { name: /send/i }));

  // Verify
  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello there!',
  });
});
```

---

## Testing Async Code

### Waiting for Elements

```jsx
test('loads and displays data', async () => {
  render(<UserList />);

  // Shows loading initially
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data to load (findBy is async)
  const users = await screen.findAllByRole('listitem');

  expect(users).toHaveLength(3);
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});
```

### Using waitFor

```jsx
import { waitFor } from '@testing-library/react';

test('shows success message after submit', async () => {
  const user = userEvent.setup();
  render(<Form />);

  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for assertion to pass
  await waitFor(() => {
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  // With options
  await waitFor(
    () => {
      expect(mockFn).toHaveBeenCalled();
    },
    { timeout: 3000, interval: 100 }
  );
});
```

### Using waitForElementToBeRemoved

```jsx
import { waitForElementToBeRemoved } from '@testing-library/react';

test('loading spinner disappears', async () => {
  render(<Dashboard />);

  // Wait for loading to disappear
  await waitForElementToBeRemoved(() => screen.getByText('Loading...'));

  // Now content should be visible
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

### Testing API Calls

```jsx
// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('fetches and displays users', async () => {
  // Mock successful response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ],
  });

  render(<UserList />);

  // Wait for users to appear
  expect(await screen.findByText('John')).toBeInTheDocument();
  expect(screen.getByText('Jane')).toBeInTheDocument();

  // Verify fetch was called
  expect(fetch).toHaveBeenCalledWith('/api/users');
});

test('displays error on fetch failure', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));

  render(<UserList />);

  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

---

## Testing Hooks

### Testing Custom Hooks

```jsx
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter(0));

  // Initial value
  expect(result.current.count).toBe(0);

  // Call increment (wrap state updates in act)
  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

test('useCounter with initial value', () => {
  const { result } = renderHook(() => useCounter(10));
  expect(result.current.count).toBe(10);
});
```

### Testing Hooks with Dependencies

```jsx
test('hook updates when props change', () => {
  const { result, rerender } = renderHook(
    ({ initialCount }) => useCounter(initialCount),
    { initialProps: { initialCount: 0 } }
  );

  expect(result.current.count).toBe(0);

  // Rerender with new props
  rerender({ initialCount: 10 });

  // Depends on hook implementation if it resets or not
});
```

### Testing Async Hooks

```jsx
import { renderHook, waitFor } from '@testing-library/react';
import useFetch from './useFetch';

test('useFetch fetches data', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ name: 'Test' }),
  });

  const { result } = renderHook(() => useFetch('/api/data'));

  // Initially loading
  expect(result.current.loading).toBe(true);

  // Wait for data
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toEqual({ name: 'Test' });
  expect(result.current.error).toBeNull();
});
```

---

## Mocking

### Mocking Functions

```jsx
test('calls onClick when button is clicked', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();

  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Mocking Modules

```jsx
// Mock entire module
jest.mock('./api', () => ({
  fetchUsers: jest.fn(),
  createUser: jest.fn(),
}));

import { fetchUsers, createUser } from './api';

test('uses mocked API', async () => {
  fetchUsers.mockResolvedValue([{ id: 1, name: 'John' }]);

  render(<UserList />);

  expect(await screen.findByText('John')).toBeInTheDocument();
});
```

### Mocking Child Components

```jsx
// Mock heavy/complex child component
jest.mock('./ComplexChart', () => {
  return function MockedChart(props) {
    return <div data-testid="mocked-chart">{props.title}</div>;
  };
});

test('renders with mocked chart', () => {
  render(<Dashboard />);
  expect(screen.getByTestId('mocked-chart')).toBeInTheDocument();
});
```

### Mocking Timers

```jsx
test('debounced search', async () => {
  jest.useFakeTimers();
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  render(<SearchInput />);

  await user.type(screen.getByRole('textbox'), 'test');

  // Search not called yet (debounced)
  expect(mockSearch).not.toHaveBeenCalled();

  // Advance timers
  act(() => {
    jest.advanceTimersByTime(500);
  });

  expect(mockSearch).toHaveBeenCalledWith('test');

  jest.useRealTimers();
});
```

### Mocking Browser APIs

```jsx
// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;
```

---

## Best Practices

### 1. Test Behavior, Not Implementation

```jsx
// ❌ Testing implementation details
test('sets state correctly', () => {
  const { result } = renderHook(() => useMyHook());
  expect(result.current.internalState).toBe('initial');
});

// ✅ Testing behavior
test('displays correct message based on user action', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  await user.click(screen.getByRole('button'));

  expect(screen.getByText('Action completed')).toBeInTheDocument();
});
```

### 2. Use Accessible Queries

```jsx
// ❌ Using test IDs unnecessarily
<button data-testid="submit-btn">Submit</button>;
screen.getByTestId('submit-btn');

// ✅ Using accessible queries
<button type="submit">Submit</button>;
screen.getByRole('button', { name: /submit/i });
```

### 3. One Assertion Focus Per Test

```jsx
// ❌ Too many concerns in one test
test('form works', async () => {
  // validation, submission, error handling, success state...
});

// ✅ Focused tests
test('shows validation error for invalid email', async () => {});
test('submits form with valid data', async () => {});
test('shows error message on server error', async () => {});
test('shows success message after submission', async () => {});
```

### 4. Avoid Snapshot Overuse

```jsx
// ❌ Large component snapshots
test('renders correctly', () => {
  const { container } = render(<ComplexComponent />);
  expect(container).toMatchSnapshot();
});

// ✅ Targeted assertions
test('renders user name and avatar', () => {
  render(<UserCard user={{ name: 'John', avatar: 'url' }} />);

  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', 'url');
});
```

### 5. Keep Tests Independent

```jsx
// ❌ Tests depend on each other
let testUser;

test('creates user', () => {
  testUser = createUser();
  expect(testUser).toBeDefined();
});

test('updates user', () => {
  updateUser(testUser, { name: 'New' }); // Depends on previous test!
});

// ✅ Independent tests
test('creates user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});

test('updates user', () => {
  const user = createUser(); // Create fresh user
  const updated = updateUser(user, { name: 'New' });
  expect(updated.name).toBe('New');
});
```

### 6. Use describe Blocks for Organization

```jsx
describe('LoginForm', () => {
  describe('validation', () => {
    test('shows error for empty email', async () => {});
    test('shows error for invalid email format', async () => {});
    test('shows error for short password', async () => {});
  });

  describe('submission', () => {
    test('calls onSubmit with form data', async () => {});
    test('disables button while submitting', async () => {});
  });

  describe('error handling', () => {
    test('displays server error message', async () => {});
    test('allows retry after error', async () => {});
  });
});
```

---

## Quick Reference

```jsx
// Basic test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('component works', async () => {
  const user = userEvent.setup();

  render(<MyComponent />);

  await user.type(screen.getByLabelText(/email/i), 'test@test.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// Async testing
const element = await screen.findByText('Loaded');
await waitFor(() => expect(mockFn).toHaveBeenCalled());

// Custom render with providers
const renderWithProviders = (ui) => render(<Providers>{ui}</Providers>);

// Hook testing
const { result } = renderHook(() => useMyHook());
act(() => result.current.doSomething());
```

---

## 🎯 Common Interview Questions

### Q1: What is the difference between getBy, queryBy, and findBy?

**Answer:**

- **getBy**: Throws error if not found (use when element should exist)
- **queryBy**: Returns null if not found (use to assert non-existence)
- **findBy**: Returns Promise, waits for element (use for async content)

### Q2: Why should you avoid testing implementation details?

**Answer:** Implementation details can change without affecting user experience. Test behavior (what users see) instead of internal state or method calls. This makes tests more resilient to refactoring.

### Q3: What is the testing trophy and why does it matter?

**Answer:** The testing trophy suggests prioritizing:

1. **Static Analysis** (TypeScript, ESLint) - base
2. **Unit Tests** - some targeted tests
3. **Integration Tests** - most tests here
4. **E2E Tests** - few high-value tests

Integration tests give the best balance of confidence and maintenance cost.

### Q4: How do you test async operations?

**Answer:**

```jsx
// Use findBy for elements that appear after async
const element = await screen.findByText('Loaded');

// Use waitFor for assertions
await waitFor(() => expect(mockFn).toHaveBeenCalled());

// Use userEvent with await
const user = userEvent.setup();
await user.click(button);
```

### Q5: How do you mock API calls in tests?

**Answer:**

```jsx
// Mock the fetch function
jest.mock('axios');
axios.get.mockResolvedValue({ data: { id: 1, name: 'Test' } });

// Or use MSW (Mock Service Worker) for more realistic mocking
```

---

## Practice Exercises

1. Write tests for a login form with validation
2. Test a component that fetches and displays data
3. Test custom hooks with renderHook
4. Create a test utility with providers for your app
5. Write integration tests for a multi-step form

---

_Next: [14-typescript-react.md](./14-typescript-react.md)_

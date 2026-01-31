# Error Boundaries & Suspense - Complete Revision Guide

## Table of Contents

1. [Error Boundaries](#error-boundaries)
2. [Creating Error Boundaries](#creating-error-boundaries)
3. [Error Boundary Patterns](#error-boundary-patterns)
4. [Suspense Basics](#suspense-basics)
5. [Suspense for Lazy Loading](#suspense-for-lazy-loading)
6. [Suspense for Data Fetching](#suspense-for-data-fetching)
7. [Combining Error Boundaries & Suspense](#combining-error-boundaries--suspense)
8. [Best Practices](#best-practices)

---

## Error Boundaries

### What are Error Boundaries?

Error Boundaries are **React components that catch JavaScript errors** anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire app.

### Why Do We Need Them?

```jsx
// Without Error Boundaries:
// One broken component crashes the ENTIRE app!

function BrokenComponent() {
  throw new Error('I crashed!');
  return <div>Never renders</div>;
}

function App() {
  return (
    <div>
      <Header />
      <BrokenComponent /> {/* 💥 Crashes everything! */}
      <Footer />
    </div>
  );
}
// Result: White screen of death, no UI at all
```

### What Errors Do They Catch?

✅ **Catches:**

- Errors in render methods
- Errors in lifecycle methods
- Errors in constructors of child components

❌ **Does NOT catch:**

- Event handlers (use try/catch)
- Async code (setTimeout, fetch, etc.)
- Server-side rendering errors
- Errors in the error boundary itself

```jsx
// ❌ Error boundaries WON'T catch this:
function Component() {
  const handleClick = () => {
    throw new Error('Event handler error'); // Use try/catch instead
  };

  useEffect(() => {
    throw new Error('Effect error'); // Won't be caught
  }, []);

  setTimeout(() => {
    throw new Error('Async error'); // Won't be caught
  }, 1000);

  // ✅ Error boundary WILL catch this:
  if (someCondition) {
    throw new Error('Render error'); // Will be caught!
  }

  return <button onClick={handleClick}>Click</button>;
}
```

---

## Creating Error Boundaries

Error Boundaries **must be class components** (as of React 19, no hook equivalent exists).

### Basic Error Boundary

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Update state when an error occurs
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log error information
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error);
    console.error('Error info:', errorInfo.componentStack);

    // Send to error reporting service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Using the Error Boundary

```jsx
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <div>
      <Header /> {/* If this crashes, only Header breaks */}
      <ErrorBoundary>
        <MainContent /> {/* Protected! */}
      </ErrorBoundary>
      <ErrorBoundary>
        <Sidebar /> {/* Protected separately! */}
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
```

### Error Boundary with Custom Fallback

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error('Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI from props
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Or render with error info
      if (this.props.renderError) {
        return this.props.renderError(this.state.error, this.handleReset);
      }

      // Default fallback
      return (
        <div className="error-container">
          <h2>Oops! Something went wrong.</h2>
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage with different fallback options:

// Option 1: Simple fallback element
<ErrorBoundary fallback={<p>Error loading widget</p>}>
  <Widget />
</ErrorBoundary>

// Option 2: Render prop with error details
<ErrorBoundary
  renderError={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  <Widget />
</ErrorBoundary>
```

### Reusable Error Boundary Hook Pattern

```jsx
// useErrorBoundary.js - A custom hook for error handling in event handlers
import { useState, useCallback } from 'react';

function useErrorHandler() {
  const [error, setError] = useState(null);

  // Throw error to be caught by nearest Error Boundary
  if (error) {
    throw error;
  }

  // Use this in event handlers and async code
  const handleError = useCallback((error) => {
    setError(error);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { handleError, resetError };
}

// Usage in a component
function DataComponent() {
  const { handleError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      // ... handle data
    } catch (error) {
      handleError(error); // Will trigger nearest Error Boundary!
    }
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

---

## Error Boundary Patterns

### Pattern 1: Page-Level Boundaries

```jsx
function App() {
  return (
    <ErrorBoundary fallback={<FullPageError />}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

### Pattern 2: Feature-Level Boundaries

```jsx
function DashboardPage() {
  return (
    <div className="dashboard">
      <ErrorBoundary fallback={<ChartError />}>
        <AnalyticsChart />
      </ErrorBoundary>

      <ErrorBoundary fallback={<TableError />}>
        <DataTable />
      </ErrorBoundary>

      <ErrorBoundary fallback={<WidgetError />}>
        <NotificationWidget />
      </ErrorBoundary>
    </div>
  );
}
```

### Pattern 3: Retry Pattern

```jsx
class RetryErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.state.retryCount >= 3) {
        return <p>Too many errors. Please refresh the page.</p>;
      }

      return (
        <div>
          <p>Something went wrong.</p>
          <button onClick={this.handleRetry}>
            Retry ({3 - this.state.retryCount} attempts left)
          </button>
        </div>
      );
    }

    // Key forces remount on retry
    return <div key={this.state.retryCount}>{this.props.children}</div>;
  }
}
```

---

## Suspense Basics

### What is Suspense?

Suspense lets you **declaratively specify the loading UI** for a part of the component tree while it's waiting for something (lazy components, data, etc.).

### Basic Syntax

```jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SomeComponent />
    </Suspense>
  );
}
```

### How Suspense Works

```jsx
// Suspense catches "promises thrown" by child components
// When a component "suspends", React:
// 1. Catches the thrown promise
// 2. Shows the fallback UI
// 3. Re-renders when the promise resolves

// Under the hood (conceptually):
function SuspenseCompatibleComponent() {
  const data = resource.read(); // Throws promise if not ready!

  // This only runs when data is ready
  return <div>{data}</div>;
}
```

---

## Suspense for Lazy Loading

### React.lazy for Code Splitting

```jsx
import { lazy, Suspense } from 'react';

// Instead of:
// import HeavyComponent from './HeavyComponent';

// Use lazy loading:
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <h1>My App</h1>

      <Suspense fallback={<p>Loading component...</p>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

### Route-Based Code Splitting

```jsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Lazy load page components
const HomePage = lazy(() => import('./pages/Home'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const SettingsPage = lazy(() => import('./pages/Settings'));

// Loading component
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="spinner"></div>
      <p>Loading page...</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    ),
  },
  {
    path: '/settings',
    element: (
      <Suspense fallback={<PageLoader />}>
        <SettingsPage />
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
// lazy() only works with default exports by default
// For named exports, create an intermediate module:

// MathUtils.js
export function add(a, b) {
  return a + b;
}
export function Calculator() {
  return <div>Calculator</div>;
}

// To lazy load Calculator:
const Calculator = lazy(() =>
  import('./MathUtils').then((module) => ({
    default: module.Calculator,
  }))
);
```

### Preloading Components

```jsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Preload when user hovers over link
function NavLink() {
  const handleMouseEnter = () => {
    // Start loading before user clicks
    import('./HeavyComponent');
  };

  return (
    <Link to="/heavy" onMouseEnter={handleMouseEnter}>
      Go to Heavy Page
    </Link>
  );
}
```

---

## Suspense for Data Fetching

### Using Suspense with Data (React 18+)

```jsx
// With libraries like React Query, SWR, or Relay
// that support Suspense mode

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  // With suspense: true, this will suspend until data is ready
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    suspense: true, // Enable Suspense mode
  });

  // No loading check needed - only renders when data exists!
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile userId={1} />
    </Suspense>
  );
}
```

### Creating a Suspense-Compatible Resource

```jsx
// Simple suspense-compatible resource wrapper
function createResource(promise) {
  let status = 'pending';
  let result;

  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (error) => {
      status = 'error';
      result = error;
    }
  );

  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result;
    },
  };
}

// Usage
const userResource = createResource(fetchUser(1));

function UserProfile() {
  const user = userResource.read(); // Suspends until ready

  return <div>{user.name}</div>;
}

function App() {
  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserProfile />
    </Suspense>
  );
}
```

### Nested Suspense Boundaries

```jsx
function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Header />

      <main>
        {/* Each section can load independently */}
        <Suspense fallback={<ProfileSkeleton />}>
          <UserProfile />
        </Suspense>

        <Suspense fallback={<PostsSkeleton />}>
          <UserPosts />
        </Suspense>

        <Suspense fallback={<FriendsSkeleton />}>
          <FriendsList />
        </Suspense>
      </main>

      <Footer />
    </Suspense>
  );
}

// Result: Each section shows its own skeleton
// and reveals content as it loads
```

### SuspenseList (Experimental)

```jsx
import { Suspense, SuspenseList } from 'react';

function App() {
  return (
    // Controls reveal order: forwards, backwards, together
    <SuspenseList revealOrder="forwards" tail="collapsed">
      <Suspense fallback={<Skeleton />}>
        <Section1 />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Section2 />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Section3 />
      </Suspense>
    </SuspenseList>
  );
}
// Reveals sections in order, even if Section3 loads first
```

---

## Combining Error Boundaries & Suspense

### The Complete Pattern

```jsx
import { Component, Suspense, lazy } from 'react';

// Error Boundary component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorUI />;
    }
    return this.props.children;
  }
}

// Lazy loaded component
const Dashboard = lazy(() => import('./Dashboard'));

// Combined usage
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<LoadingPage />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### AsyncBoundary Pattern

```jsx
// Combine Error Boundary and Suspense into one component
function AsyncBoundary({ children, errorFallback, loadingFallback }) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// Clean usage
function App() {
  return (
    <AsyncBoundary
      loadingFallback={<LoadingSpinner />}
      errorFallback={<ErrorMessage />}
    >
      <Dashboard />
    </AsyncBoundary>
  );
}
```

### Practical Example: Data Dashboard

```jsx
import { Suspense, lazy, Component } from 'react';

// Error Boundary
class DashboardErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-card">
          <h3>Failed to load dashboard widget</h3>
          <button onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy components
const SalesChart = lazy(() => import('./widgets/SalesChart'));
const UserTable = lazy(() => import('./widgets/UserTable'));
const RevenueCard = lazy(() => import('./widgets/RevenueCard'));

// Skeleton components
const ChartSkeleton = () => <div className="skeleton chart-skeleton" />;
const TableSkeleton = () => <div className="skeleton table-skeleton" />;
const CardSkeleton = () => <div className="skeleton card-skeleton" />;

// Dashboard
function Dashboard() {
  return (
    <div className="dashboard-grid">
      <DashboardErrorBoundary>
        <Suspense fallback={<ChartSkeleton />}>
          <SalesChart />
        </Suspense>
      </DashboardErrorBoundary>

      <DashboardErrorBoundary>
        <Suspense fallback={<TableSkeleton />}>
          <UserTable />
        </Suspense>
      </DashboardErrorBoundary>

      <DashboardErrorBoundary>
        <Suspense fallback={<CardSkeleton />}>
          <RevenueCard />
        </Suspense>
      </DashboardErrorBoundary>
    </div>
  );
}

export default Dashboard;
```

---

## Best Practices

### 1. Granular Error Boundaries

```jsx
// ❌ One boundary for everything
<ErrorBoundary>
  <EntireApp />
</ErrorBoundary>

// ✅ Multiple boundaries for different sections
<Layout>
  <ErrorBoundary fallback={<NavError />}>
    <Navigation />
  </ErrorBoundary>

  <ErrorBoundary fallback={<ContentError />}>
    <MainContent />
  </ErrorBoundary>

  <ErrorBoundary fallback={<SidebarError />}>
    <Sidebar />
  </ErrorBoundary>
</Layout>
```

### 2. Meaningful Fallback UI

```jsx
// ❌ Generic error message
<ErrorBoundary fallback={<p>Error</p>}>

// ✅ Helpful, contextual fallback
<ErrorBoundary
  fallback={
    <div className="error-state">
      <img src="/error-illustration.svg" alt="" />
      <h3>Unable to load your dashboard</h3>
      <p>This might be a temporary issue. Please try again.</p>
      <button onClick={handleRetry}>Retry</button>
      <button onClick={handleReport}>Report Issue</button>
    </div>
  }
>
```

### 3. Error Logging

```jsx
componentDidCatch(error, errorInfo) {
  // Log to error tracking service
  Sentry.captureException(error, {
    extra: {
      componentStack: errorInfo.componentStack,
    },
  });

  // Or custom logging
  fetch('/api/log-error', {
    method: 'POST',
    body: JSON.stringify({
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    }),
  });
}
```

### 4. Suspense Loading States

```jsx
// ❌ Generic spinner everywhere
<Suspense fallback={<Spinner />}>

// ✅ Skeleton that matches content shape
<Suspense fallback={
  <div className="card-skeleton">
    <div className="skeleton-avatar" />
    <div className="skeleton-line" />
    <div className="skeleton-line short" />
  </div>
}>
  <UserCard />
</Suspense>
```

### 5. Avoid Suspense Waterfalls

```jsx
// ❌ Sequential loading (waterfall)
function Profile() {
  return (
    <Suspense fallback={<Spinner />}>
      <User /> {/* Waits for this... */}
      <Suspense fallback={<Spinner />}>
        <Posts /> {/* Then loads this... */}
        <Suspense fallback={<Spinner />}>
          <Friends /> {/* Then loads this */}
        </Suspense>
      </Suspense>
    </Suspense>
  );
}

// ✅ Parallel loading
function Profile() {
  return (
    <>
      <Suspense fallback={<UserSkeleton />}>
        <User />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
      <Suspense fallback={<FriendsSkeleton />}>
        <Friends />
      </Suspense>
    </>
  );
}
```

---

## Quick Reference

```jsx
// Error Boundary (Class Component Required)
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logError(error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Suspense for lazy loading
const LazyComponent = lazy(() => import('./Component'));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>

// Combined pattern
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loading />}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

---

## 🎯 Common Interview Questions

### Q1: Why must Error Boundaries be class components?

**Answer:** Error Boundaries require lifecycle methods (`getDerivedStateFromError` and `componentDidCatch`) that don't have hook equivalents. React team hasn't added hook-based error boundaries yet.

### Q2: What's the difference between getDerivedStateFromError and componentDidCatch?

**Answer:**

- **getDerivedStateFromError**: Called during render phase, must return state update, used for rendering fallback UI
- **componentDidCatch**: Called during commit phase, used for side effects like logging errors

### Q3: What is Suspense and how does it work?

**Answer:** Suspense lets components "wait" for something before rendering. When a component throws a Promise, Suspense catches it and shows a fallback until resolved. Used for:

- Lazy loading components with `React.lazy()`
- Data fetching (with compatible libraries)

### Q4: How do you handle errors in event handlers?

**Answer:** Error Boundaries don't catch event handler errors. Use try/catch:

```jsx
const handleClick = async () => {
  try {
    await riskyOperation();
  } catch (error) {
    setError(error.message);
  }
};
```

### Q5: What is a Suspense waterfall and how do you avoid it?

**Answer:** A waterfall occurs when nested Suspense boundaries load sequentially. Avoid by:

- Using sibling Suspense boundaries (parallel loading)
- Prefetching data before navigation
- Using libraries like TanStack Query with parallel queries

---

## Practice Exercises

1. Create an ErrorBoundary with retry functionality
2. Build a lazy-loaded route system with Suspense
3. Create skeleton loading states for different content types
4. Implement a global error boundary with error reporting
5. Build a dashboard with parallel Suspense boundaries

---

_Next: [13-testing.md](./13-testing.md)_

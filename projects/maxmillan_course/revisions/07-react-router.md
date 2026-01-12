# React Router - Complete Revision Guide

## Table of Contents

1. [Introduction to Routing](#introduction-to-routing)
2. [Setting Up React Router](#setting-up-react-router)
3. [Basic Routing](#basic-routing)
4. [Navigation](#navigation)
5. [Dynamic Routes](#dynamic-routes)
6. [Nested Routes](#nested-routes)
7. [Programmatic Navigation](#programmatic-navigation)
8. [Loaders - Data Fetching](#loaders---data-fetching)
9. [Actions - Form Handling](#actions---form-handling)
10. [Error Handling](#error-handling)
11. [Deferred Loading](#deferred-loading)
12. [Authentication & Protected Routes](#authentication--protected-routes)

---

## Introduction to Routing

**Single Page Applications (SPAs)** don't reload the entire page when navigating. React Router enables client-side routing.

### How It Works

```
Traditional Web:                    SPA with React Router:
┌─────────────────┐                ┌─────────────────┐
│ Click link      │                │ Click link      │
│      ↓          │                │      ↓          │
│ Server request  │                │ Update URL      │
│      ↓          │                │      ↓          │
│ Full page load  │                │ Render component│
│      ↓          │                │      ↓          │
│ Render new page │                │ No page reload! │
└─────────────────┘                └─────────────────┘
```

---

## Setting Up React Router

### Installation

```bash
npm install react-router-dom
```

### Creating Routes (Modern Approach)

```jsx
// App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';

// Define routes
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

---

## Basic Routing

### Route Configuration

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    // Catch-all route for 404
    path: '*',
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### Page Components

```jsx
// pages/Home.jsx
function HomePage() {
  return (
    <div>
      <h1>Welcome Home</h1>
      <p>This is the home page.</p>
    </div>
  );
}

export default HomePage;

// pages/Products.jsx
function ProductsPage() {
  return (
    <div>
      <h1>Our Products</h1>
      {/* Product list */}
    </div>
  );
}

export default ProductsPage;
```

---

## Navigation

### Link Component

```jsx
import { Link } from 'react-router-dom';

function MainNavigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
```

### NavLink - Active Styling

```jsx
import { NavLink } from 'react-router-dom';

function MainNavigation() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active' : '')}
            // Or use inline style
            style={({ isActive }) => ({
              color: isActive ? 'red' : 'black',
              fontWeight: isActive ? 'bold' : 'normal',
            })}
            // end prop for exact matching
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Products
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
```

### CSS for Active Links

```css
/* Navigation.module.css */
.nav a {
  text-decoration: none;
  color: #333;
}

.nav a:hover {
  color: #666;
}

.nav a.active {
  color: #e40000;
  font-weight: bold;
  text-decoration: underline;
}
```

---

## Dynamic Routes

### Route Parameters

```jsx
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/products', element: <ProductsPage /> },
  { path: '/products/:productId', element: <ProductDetailPage /> },
  { path: '/users/:userId', element: <UserProfilePage /> },
]);
```

### useParams Hook

```jsx
import { useParams, Link } from 'react-router-dom';

function ProductDetailPage() {
  const { productId } = useParams();

  // Fetch product data using productId
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <p>Product not found!</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <Link to="/products">Back to Products</Link>
    </div>
  );
}
```

### Multiple Parameters

```jsx
// Route: /products/:category/:productId
const router = createBrowserRouter([
  {
    path: '/products/:category/:productId',
    element: <ProductDetailPage />,
  },
]);

function ProductDetailPage() {
  const { category, productId } = useParams();

  return (
    <div>
      <p>Category: {category}</p>
      <p>Product ID: {productId}</p>
    </div>
  );
}
```

### Query Parameters

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read query params: /search?q=react&page=2
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';

  // Update query params
  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, page: newPage.toString() });
  };

  return (
    <div>
      <input
        value={query || ''}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      <p>Searching for: {query}</p>
      <p>Page: {page}</p>
      <button onClick={() => handlePageChange(parseInt(page) + 1)}>
        Next Page
      </button>
    </div>
  );
}
```

---

## Nested Routes

### Layout Routes

```jsx
import { createBrowserRouter, Outlet } from 'react-router-dom';

// Root layout component
function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> }, // index route = default child
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:productId', element: <ProductDetailPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);
```

### Multiple Layout Levels

```jsx
function ProductsLayout() {
  return (
    <div className="products-layout">
      <aside>
        <ProductCategories />
      </aside>
      <section>
        <Outlet /> {/* Nested product routes */}
      </section>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'products',
        element: <ProductsLayout />,
        children: [
          { index: true, element: <ProductsListPage /> },
          { path: ':productId', element: <ProductDetailPage /> },
          { path: ':productId/edit', element: <ProductEditPage /> },
        ],
      },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);

// URL structure:
// /products           → RootLayout > ProductsLayout > ProductsListPage
// /products/123       → RootLayout > ProductsLayout > ProductDetailPage
// /products/123/edit  → RootLayout > ProductsLayout > ProductEditPage
```

---

## Programmatic Navigation

### useNavigate Hook

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(credentials);

    if (success) {
      // Navigate to home page
      navigate('/');

      // Or navigate with replace (no back button)
      navigate('/dashboard', { replace: true });

      // Or go back
      navigate(-1);

      // Or go forward
      navigate(1);

      // Navigate with state
      navigate('/dashboard', { state: { from: 'login' } });
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### Navigate Component (Redirect)

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### Accessing Navigation State

```jsx
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();

  // Access state passed during navigation
  const from = location.state?.from;

  return (
    <div>
      {from === 'login' && <p>Welcome! You just logged in.</p>}
      {/* Dashboard content */}
    </div>
  );
}
```

---

## Loaders - Data Fetching

Loaders **fetch data before the route renders**.

### Basic Loader

```jsx
// pages/Events.jsx
import { useLoaderData } from 'react-router-dom';

function EventsPage() {
  const events = useLoaderData(); // Access loaded data

  return (
    <div>
      <h1>All Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
}

// Loader function (export from same file)
export async function loader() {
  const response = await fetch('http://localhost:3000/events');

  if (!response.ok) {
    throw new Error('Could not fetch events');
  }

  const data = await response.json();
  return data.events;
}

export default EventsPage;
```

### Registering Loaders

```jsx
import EventsPage, { loader as eventsLoader } from './pages/Events';
import EventDetailPage, {
  loader as eventDetailLoader,
} from './pages/EventDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'events',
        element: <EventsLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader, // Register loader
          },
          {
            path: ':eventId',
            element: <EventDetailPage />,
            loader: eventDetailLoader,
          },
        ],
      },
    ],
  },
]);
```

### Loader with Parameters

```jsx
// pages/EventDetail.jsx
import { useLoaderData, useParams } from 'react-router-dom';

function EventDetailPage() {
  const event = useLoaderData();

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
    </div>
  );
}

// Loader receives request and params
export async function loader({ request, params }) {
  const eventId = params.eventId;

  const response = await fetch(`http://localhost:3000/events/${eventId}`);

  if (!response.ok) {
    throw new Error('Could not fetch event details');
  }

  const data = await response.json();
  return data.event;
}

export default EventDetailPage;
```

### useRouteLoaderData - Access Parent Loaders

```jsx
// Access loader data from a parent route
function EventEditPage() {
  const event = useRouteLoaderData('event-detail'); // Use route ID

  return <EventForm event={event} />;
}

// Route config with ID
const router = createBrowserRouter([
  {
    path: 'events/:eventId',
    id: 'event-detail', // Assign ID for useRouteLoaderData
    loader: eventDetailLoader,
    children: [
      { index: true, element: <EventDetailPage /> },
      { path: 'edit', element: <EventEditPage /> },
    ],
  },
]);
```

### Loading States

```jsx
import { useNavigation } from 'react-router-dom';

function RootLayout() {
  const navigation = useNavigation();

  // navigation.state can be 'idle', 'loading', or 'submitting'
  const isLoading = navigation.state === 'loading';

  return (
    <>
      <MainNavigation />
      <main>
        {isLoading && <LoadingSpinner />}
        <Outlet />
      </main>
    </>
  );
}
```

---

## Actions - Form Handling

Actions handle **form submissions** and other mutations.

### Basic Action

```jsx
// pages/NewEvent.jsx
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';

function NewEventPage() {
  const data = useActionData(); // Access action return data
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  return (
    <Form method="post">
      {' '}
      {/* Use React Router Form */}
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" required />
        {data?.errors?.title && <p>{data.errors.title}</p>}
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input id="date" name="date" type="date" required />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="5" />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Event'}
      </button>
    </Form>
  );
}

// Action function
export async function action({ request }) {
  const formData = await request.formData();

  const eventData = {
    title: formData.get('title'),
    date: formData.get('date'),
    description: formData.get('description'),
  };

  // Validation
  const errors = {};
  if (eventData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { errors }; // Return errors to component
  }

  // Submit to backend
  const response = await fetch('http://localhost:3000/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error('Could not save event');
  }

  return redirect('/events'); // Redirect after success
}

export default NewEventPage;
```

### Registering Actions

```jsx
import NewEventPage, { action as newEventAction } from './pages/NewEvent';
import EditEventPage, { action as editEventAction } from './pages/EditEvent';

const router = createBrowserRouter([
  {
    path: 'events',
    children: [
      { index: true, element: <EventsPage />, loader: eventsLoader },
      {
        path: 'new',
        element: <NewEventPage />,
        action: newEventAction, // Register action
      },
      {
        path: ':eventId/edit',
        element: <EditEventPage />,
        action: editEventAction,
      },
    ],
  },
]);
```

### Different HTTP Methods

```jsx
// The method attribute determines request.method in action
<Form method="post">...</Form>   // request.method === 'POST'
<Form method="put">...</Form>    // request.method === 'PUT'
<Form method="delete">...</Form> // request.method === 'DELETE'
<Form method="patch">...</Form>  // request.method === 'PATCH'

// In action:
export async function action({ request, params }) {
  const method = request.method;

  if (method === 'DELETE') {
    await fetch(`/api/events/${params.eventId}`, { method: 'DELETE' });
    return redirect('/events');
  }

  // Handle other methods...
}
```

### Delete with Action

```jsx
function EventDetailPage() {
  return (
    <div>
      {/* Event details */}

      <Form method="delete">
        <button type="submit">Delete Event</button>
      </Form>
    </div>
  );
}

export async function action({ request, params }) {
  const response = await fetch(
    `http://localhost:3000/events/${params.eventId}`,
    { method: request.method }
  );

  if (!response.ok) {
    throw new Error('Could not delete event');
  }

  return redirect('/events');
}
```

---

## Error Handling

### Error Boundaries for Routes

```jsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  let title = 'An error occurred!';
  let message = 'Something went wrong.';

  if (isRouteErrorResponse(error)) {
    // Error thrown from loader/action
    if (error.status === 404) {
      title = 'Not found!';
      message = 'Could not find resource.';
    } else if (error.status === 500) {
      title = 'Server error!';
      message = error.data?.message || 'Server error occurred.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <>
      <MainNavigation />
      <main className="error-page">
        <h1>{title}</h1>
        <p>{message}</p>
      </main>
    </>
  );
}

export default ErrorPage;
```

### Registering Error Elements

```jsx
import ErrorPage from './pages/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />, // Catches errors in this route and children
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'events',
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
            errorElement: <ErrorPage />, // Route-specific error handling
          },
        ],
      },
    ],
  },
]);
```

### Throwing Errors in Loaders

```jsx
import { json } from 'react-router-dom';

export async function loader({ params }) {
  const response = await fetch(`/api/events/${params.eventId}`);

  if (!response.ok) {
    // Throw Response for structured errors
    throw json(
      { message: 'Could not fetch event details.' },
      { status: response.status }
    );
  }

  return response;
}
```

---

## Deferred Loading

Load critical data immediately, defer non-critical data.

### defer and Await

```jsx
import { defer, useLoaderData, Await } from 'react-router-dom';
import { Suspense } from 'react';

function EventDetailPage() {
  const { event, relatedEvents } = useLoaderData();

  return (
    <div>
      {/* Critical data - loaded before render */}
      <Suspense fallback={<p>Loading event...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => (
            <div>
              <h1>{loadedEvent.title}</h1>
              <p>{loadedEvent.description}</p>
            </div>
          )}
        </Await>
      </Suspense>

      {/* Non-critical data - loaded after render */}
      <aside>
        <h2>Related Events</h2>
        <Suspense fallback={<p>Loading related events...</p>}>
          <Await resolve={relatedEvents}>
            {(loadedRelated) => (
              <ul>
                {loadedRelated.map((e) => (
                  <li key={e.id}>{e.title}</li>
                ))}
              </ul>
            )}
          </Await>
        </Suspense>
      </aside>
    </div>
  );
}

export async function loader({ params }) {
  return defer({
    // await - loads before component renders
    event: await loadEvent(params.eventId),
    // No await - loads after component renders (deferred)
    relatedEvents: loadRelatedEvents(params.eventId),
  });
}

async function loadEvent(id) {
  const response = await fetch(`/api/events/${id}`);
  return response.json();
}

async function loadRelatedEvents(id) {
  const response = await fetch(`/api/events/${id}/related`);
  return response.json();
}
```

---

## Authentication & Protected Routes

### Protected Route Pattern

```jsx
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login, save intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage in routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```

### Auth with Loaders

```jsx
// Protect routes at loader level
export async function protectedLoader({ request }) {
  const user = await getCurrentUser();

  if (!user) {
    // Save the URL they tried to visit
    const params = new URLSearchParams();
    params.set('from', new URL(request.url).pathname);
    throw redirect('/login?' + params.toString());
  }

  return user;
}

// Route configuration
const router = createBrowserRouter([
  {
    path: 'dashboard',
    element: <DashboardPage />,
    loader: protectedLoader,
  },
]);
```

### Redirect After Login

```jsx
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const from =
    location.state?.from?.pathname || searchParams.get('from') || '/dashboard';

  const handleLogin = async (credentials) => {
    const success = await login(credentials);

    if (success) {
      navigate(from, { replace: true });
    }
  };

  return <form onSubmit={handleLogin}>{/* Login form */}</form>;
}
```

---

## Complete Example

```jsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  NavLink,
  useParams,
  useLoaderData,
  useNavigation,
  Form,
  redirect,
} from 'react-router-dom';

// Layout
function RootLayout() {
  const navigation = useNavigation();

  return (
    <div className="app">
      <header>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/events/new">New Event</NavLink>
        </nav>
      </header>

      <main>
        {navigation.state === 'loading' && <div className="loading-bar" />}
        <Outlet />
      </main>
    </div>
  );
}

// Pages
function HomePage() {
  return <h1>Welcome!</h1>;
}

function EventsPage() {
  const events = useLoaderData();

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link to={event.id}>{event.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EventDetailPage() {
  const event = useLoaderData();

  return (
    <article>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>

      <div className="actions">
        <Link to="edit">Edit</Link>
        <Form method="delete">
          <button>Delete</button>
        </Form>
      </div>
    </article>
  );
}

// Loaders
async function eventsLoader() {
  const response = await fetch('/api/events');
  return response.json();
}

async function eventDetailLoader({ params }) {
  const response = await fetch(`/api/events/${params.eventId}`);
  if (!response.ok) throw new Error('Event not found');
  return response.json();
}

// Actions
async function deleteEventAction({ params }) {
  await fetch(`/api/events/${params.eventId}`, { method: 'DELETE' });
  return redirect('/events');
}

// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'events',
        children: [
          { index: true, element: <EventsPage />, loader: eventsLoader },
          {
            path: ':eventId',
            element: <EventDetailPage />,
            loader: eventDetailLoader,
            action: deleteEventAction,
          },
          { path: 'new', element: <NewEventPage />, action: newEventAction },
        ],
      },
    ],
  },
]);

// App
function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

---

## Summary Cheat Sheet

```jsx
// Setup
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const router = createBrowserRouter([/* routes */]);
<RouterProvider router={router} />

// Navigation
<Link to="/path">Link</Link>
<NavLink to="/path" className={({isActive}) => isActive ? 'active' : ''}>
const navigate = useNavigate();  // navigate('/path')

// Route params
const { id } = useParams();
const [searchParams, setSearchParams] = useSearchParams();

// Loaders
export async function loader({ request, params }) { return data; }
const data = useLoaderData();
const parentData = useRouteLoaderData('route-id');

// Actions
<Form method="post">...</Form>
export async function action({ request, params }) { return redirect('/'); }
const actionData = useActionData();

// Loading state
const navigation = useNavigation();  // navigation.state

// Deferred
defer({ data: await fast(), slow: loadSlow() })
<Suspense><Await resolve={slow}>{(d) => ...}</Await></Suspense>
```

---

## Practice Exercises

1. Build a blog with posts list and post detail pages
2. Add search functionality with query parameters
3. Create a protected admin section
4. Implement CRUD operations with loaders and actions
5. Add optimistic UI updates

---

_Next: [08-forms.md](./08-forms.md)_

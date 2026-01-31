# React Course Revision Guide - Index

## 📚 Complete React Learning Path

Welcome to your comprehensive React revision guide! This collection covers all the concepts from the Maximilian Schwarzmüller React course. Read them in order for the best learning experience.

---

## Revision Files

### Core Concepts

| #   | Topic                  | Description                                                  | File                                                   |
| --- | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| 01  | **React Fundamentals** | JSX, Components, Props, Events, Conditional Rendering, Lists | [01-react-fundamentals.md](./01-react-fundamentals.md) |
| 02  | **State Management**   | useState, useReducer, Derived State, Lifting State           | [02-state-management.md](./02-state-management.md)     |
| 03  | **Hooks Deep Dive**    | All React Hooks with detailed examples                       | [03-hooks-deep-dive.md](./03-hooks-deep-dive.md)       |

### Advanced Patterns

| #   | Topic                | Description                                           | File                                               |
| --- | -------------------- | ----------------------------------------------------- | -------------------------------------------------- |
| 04  | **Refs and Portals** | useRef, forwardRef, useImperativeHandle, createPortal | [04-refs-and-portals.md](./04-refs-and-portals.md) |
| 05  | **Context API**      | Creating Context, Provider/Consumer, Best Practices   | [05-context-api.md](./05-context-api.md)           |
| 06  | **Redux**            | Vanilla Redux, Redux Toolkit, Async Operations        | [06-redux.md](./06-redux.md)                       |

### Application Development

| #   | Topic             | Description                                         | File                                         |
| --- | ----------------- | --------------------------------------------------- | -------------------------------------------- |
| 07  | **React Router**  | Routes, Navigation, Loaders, Actions                | [07-react-router.md](./07-react-router.md)   |
| 08  | **Forms**         | Controlled/Uncontrolled, Validation, useActionState | [08-forms.md](./08-forms.md)                 |
| 09  | **HTTP Requests** | Fetch API, Custom Hooks, Error Handling             | [09-http-requests.md](./09-http-requests.md) |

### Styling & Performance

| #   | Topic           | Description                                  | File                                     |
| --- | --------------- | -------------------------------------------- | ---------------------------------------- |
| 10  | **Styling**     | CSS Modules, Styled Components, Tailwind CSS | [10-styling.md](./10-styling.md)         |
| 11  | **Performance** | memo, useCallback, useMemo, Code Splitting   | [11-performance.md](./11-performance.md) |

### Production & Modern React

| #   | Topic                           | Description                                           | File                                                                 |
| --- | ------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| 12  | **Error Boundaries & Suspense** | Error handling, lazy loading, async components        | [12-error-boundaries-suspense.md](./12-error-boundaries-suspense.md) |
| 13  | **Testing**                     | Jest, React Testing Library, Unit & Integration Tests | [13-testing.md](./13-testing.md)                                     |
| 14  | **TypeScript with React**       | Types, Props, Hooks, Context, Generic Components      | [14-typescript-react.md](./14-typescript-react.md)                   |
| 15  | **Advanced Patterns**           | Compound Components, HOCs, Render Props, Custom Hooks | [15-advanced-patterns.md](./15-advanced-patterns.md)                 |
| 16  | **React 18/19 Features**        | Concurrent Rendering, Transitions, Server Components  | [16-react-18-19-features.md](./16-react-18-19-features.md)           |

### Data Fetching & Server State

| #   | Topic              | Description                                                  | File                                           |
| --- | ------------------ | ------------------------------------------------------------ | ---------------------------------------------- |
| 18  | **TanStack Query** | useQuery, useMutation, Caching, Optimistic Updates, DevTools | [18-tanstack-query.md](./18-tanstack-query.md) |

### Prerequisites & Interview Prep

| #   | Topic                       | Description                                               | File                                                             |
| --- | --------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| 17  | **JavaScript Fundamentals** | ES6+, Closures, this, Event Loop, Promises, Interview Q&A | [17-javascript-fundamentals.md](./17-javascript-fundamentals.md) |

---

## 🎯 Quick Reference

### Most Important Hooks

```jsx
// State
const [state, setState] = useState(initialValue);
const [state, dispatch] = useReducer(reducer, initialState);

// Side Effects
useEffect(() => {
  /* effect */ return () => {
    /* cleanup */
  };
}, [deps]);

// References
const ref = useRef(initialValue);

// Performance
const memoizedCallback = useCallback(() => {}, [deps]);
const memoizedValue = useMemo(() => computeValue(), [deps]);

// Context
const value = useContext(MyContext);

// TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFn,
});
const mutation = useMutation({ mutationFn: createFn });
```

### Component Patterns

```jsx
// Functional Component
function MyComponent({ prop1, prop2 }) {
  return <div>{prop1}</div>;
}

// Memoized Component
const MemoizedComponent = memo(function MyComponent(props) {
  return <div>{props.value}</div>;
});

// ForwardRef Component
const InputWithRef = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});
```

### State Management Decision Tree

```
Simple local state → useState
Complex local state → useReducer
Shared across few components → Lift state up
Shared across many components → Context API
Large app, complex state → Redux Toolkit
Server state (API data) → TanStack Query
```

---

## 📖 Suggested Reading Order

### Week 1: Foundations

1. React Fundamentals
2. State Management
3. Hooks Deep Dive

### Week 2: Advanced Patterns

4. Refs and Portals
5. Context API
6. Redux

### Week 3: Building Apps

7. React Router
8. Forms
9. HTTP Requests

### Week 4: Polish & Production

10. Styling
11. Performance Optimization
12. Error Boundaries & Suspense
13. Testing
14. TypeScript with React
15. Advanced Patterns
16. React 18/19 Features
17. JavaScript Fundamentals (Review as needed)
18. TanStack Query

---

## 🔗 Course Projects Reference

These revision guides are based on the following course projects:

| Project               | Concepts Covered                         |
| --------------------- | ---------------------------------------- |
| 01-starting-project   | JSX, Components, Props, State            |
| 07-tic-tac-toe        | Game Logic, Derived State, Lifting State |
| Investment Calculator | Forms, Calculations, Two-way Binding     |
| Project Management    | Complex State, CRUD Operations           |
| React Quiz            | Timers, useEffect, useCallback           |
| Food App              | Context, useReducer, HTTP, Modal         |
| React Router 1 & 2    | Routing, Loaders, Actions, Auth          |
| Redux 1 & 2           | Redux Basics, Redux Toolkit              |
| Advance Redux         | Thunks, Async Operations                 |
| React Forms           | Validation, Custom Hooks                 |
| Sending requests      | HTTP, Custom Hooks, Error Handling       |
| React Art             | CSS Modules, Styled Components, Tailwind |
| Behind the Scenes     | memo, useCallback, useMemo               |
| TanStack Queries      | useQuery, useMutation, Caching           |

---

## 💡 Tips for Revision

1. **Read actively** - Don't just read, type out the examples
2. **Practice** - Each file has exercises at the end
3. **Build** - Apply concepts to your own mini-projects
4. **Review** - Come back to files you found difficult
5. **Connect** - See how concepts work together

---

## 🚀 What's Next?

After mastering these concepts, explore:

- **Next.js** - React framework for production (SSR, SSG, API routes)
- **Zustand / Jotai** - Lightweight state management alternatives
- **Framer Motion** - Animation library for React
- **React Native** - Build mobile apps with React
- **tRPC** - End-to-end typesafe APIs
- **Zod** - TypeScript-first schema validation

---

_Last updated: February 2026_

_Happy Learning! 🎉_

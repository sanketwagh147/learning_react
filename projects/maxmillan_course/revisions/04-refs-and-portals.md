# Refs & Portals - Complete Revision Guide

## Table of Contents

1. [Understanding Refs](#understanding-refs)
2. [useRef Hook](#useref-hook)
3. [forwardRef](#forwardref)
4. [useImperativeHandle](#useimperativehandle)
5. [Portals](#portals)
6. [Common Patterns](#common-patterns)

---

## Understanding Refs

Refs provide a way to:

1. **Access DOM elements** directly
2. **Store mutable values** that don't cause re-renders
3. **Persist values** across renders without triggering updates

### When to Use Refs

✅ **Good use cases:**

- Managing focus, text selection, or media playback
- Triggering imperative animations
- Integrating with third-party DOM libraries
- Storing timer IDs, interval IDs
- Storing previous values for comparison

❌ **Avoid refs for:**

- Anything that can be done declaratively
- Storing state that should cause re-renders

---

## useRef Hook

### Basic Syntax

```jsx
import { useRef } from 'react';

function Component() {
  const myRef = useRef(initialValue);

  // Access value
  console.log(myRef.current);

  // Modify value (won't cause re-render!)
  myRef.current = newValue;

  return <div>...</div>;
}
```

### DOM Element Reference

```jsx
function TextInputWithFocusButton() {
  const inputRef = useRef(null);

  const handleClick = () => {
    // Focus the input using DOM API
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus Input</button>
    </>
  );
}
```

### Multiple Refs

```jsx
function MultipleInputs() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = () => {
    console.log({
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={firstNameRef} placeholder="First Name" />
      <input ref={lastNameRef} placeholder="Last Name" />
      <input ref={emailRef} placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Storing Timer/Interval IDs

```jsx
function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null); // Store interval ID

  const start = () => {
    if (isRunning) return;

    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 10); // Update every 10ms
    }, 10);
  };

  const stop = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format time display
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>{formatTime(time)}</h1>
      <button onClick={start} disabled={isRunning}>
        Start
      </button>
      <button onClick={stop} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Storing Previous Values

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        Current: {count}, Previous: {prevCount}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

### Ref vs State Comparison

```jsx
function RefVsStateDemo() {
  // State: Changing causes re-render
  const [stateCount, setStateCount] = useState(0);

  // Ref: Changing does NOT cause re-render
  const refCount = useRef(0);

  console.log('Component rendered!');

  return (
    <div>
      <p>State Count: {stateCount}</p>
      <p>Ref Count: {refCount.current}</p>

      <button onClick={() => setStateCount((c) => c + 1)}>
        Increment State (causes re-render)
      </button>

      <button
        onClick={() => {
          refCount.current++;
          console.log('Ref count:', refCount.current);
          // Note: UI won't update until next re-render!
        }}
      >
        Increment Ref (no re-render)
      </button>
    </div>
  );
}
```

---

## forwardRef

By default, you **cannot pass a ref to a function component**. `forwardRef` allows this.

### The Problem

```jsx
// ❌ This doesn't work - ref won't be passed
function CustomInput(props) {
  return <input {...props} />;
}

function Parent() {
  const inputRef = useRef(null);

  return (
    <>
      <CustomInput ref={inputRef} /> {/* ref is ignored! */}
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```

### The Solution: forwardRef

```jsx
import { forwardRef, useRef } from 'react';

// ✅ Use forwardRef to pass ref through
const CustomInput = forwardRef(function CustomInput(props, ref) {
  return (
    <input
      {...props}
      ref={ref} // Forward the ref to the DOM element
      className="custom-input"
    />
  );
});

function Parent() {
  const inputRef = useRef(null);

  return (
    <>
      <CustomInput ref={inputRef} placeholder="Enter text" />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```

### forwardRef with Additional Props

```jsx
const FancyButton = forwardRef(function FancyButton(
  { children, className, ...props },
  ref
) {
  return (
    <button ref={ref} className={`fancy-button ${className || ''}`} {...props}>
      {children}
    </button>
  );
});

function Parent() {
  const buttonRef = useRef(null);

  return (
    <FancyButton
      ref={buttonRef}
      className="primary"
      onClick={() => console.log('Clicked!')}
    >
      Click Me
    </FancyButton>
  );
}
```

---

## useImperativeHandle

`useImperativeHandle` customizes the instance value exposed to parent components when using `ref`.

### Why Use It?

Instead of exposing the entire DOM element, you can **expose only specific methods/values**.

### Basic Usage

```jsx
import { useRef, useImperativeHandle, forwardRef } from 'react';

const CustomInput = forwardRef(function CustomInput(props, ref) {
  const inputRef = useRef(null);

  // Expose only specific methods to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    },
    getValue: () => {
      return inputRef.current.value;
    },
  }));

  return <input ref={inputRef} {...props} />;
});

function Parent() {
  const inputRef = useRef(null);

  return (
    <>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
      <button onClick={() => alert(inputRef.current.getValue())}>
        Get Value
      </button>
    </>
  );
}
```

### Modal with showModal/close

```jsx
import { useRef, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ children, title, onClose }, ref) {
  const dialogRef = useRef(null);

  // Expose showModal and close methods
  useImperativeHandle(ref, () => ({
    showModal: () => {
      dialogRef.current.showModal();
    },
    close: () => {
      dialogRef.current.close();
    },
  }));

  return createPortal(
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <header>
        <h2>{title}</h2>
        <button onClick={() => dialogRef.current.close()} className="close-btn">
          ×
        </button>
      </header>
      <main>{children}</main>
    </dialog>,
    document.getElementById('modal-root')
  );
});

function App() {
  const modalRef = useRef(null);

  return (
    <>
      <button onClick={() => modalRef.current.showModal()}>Open Modal</button>

      <Modal
        ref={modalRef}
        title="Welcome!"
        onClose={() => console.log('Modal closed')}
      >
        <p>This is the modal content.</p>
        <button onClick={() => modalRef.current.close()}>Close</button>
      </Modal>
    </>
  );
}
```

### Result Modal Example (Timer Game)

```jsx
const ResultModal = forwardRef(function ResultModal(
  { targetTime, remainingTime, onReset },
  ref
) {
  const dialogRef = useRef(null);

  const userLost = remainingTime <= 0;
  const formattedRemainingTime = (remainingTime / 1000).toFixed(2);
  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

  useImperativeHandle(ref, () => ({
    showModal() {
      dialogRef.current.showModal();
    },
  }));

  return createPortal(
    <dialog ref={dialogRef} className="result-modal" onClose={onReset}>
      {userLost && <h2>You Lost!</h2>}
      {!userLost && <h2>Your Score: {score}</h2>}

      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with{' '}
        <strong>{formattedRemainingTime} seconds left.</strong>
      </p>

      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById('modal')
  );
});

function TimerChallenge({ title, targetTime }) {
  const timerRef = useRef(null);
  const modalRef = useRef(null);

  const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);

  const timerIsActive = timeRemaining > 0 && timeRemaining < targetTime * 1000;

  // Timer expired
  if (timeRemaining <= 0) {
    clearInterval(timerRef.current);
    modalRef.current.showModal();
  }

  function handleStart() {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => prev - 10);
    }, 10);
  }

  function handleStop() {
    clearInterval(timerRef.current);
    modalRef.current.showModal();
  }

  function handleReset() {
    setTimeRemaining(targetTime * 1000);
  }

  return (
    <>
      <ResultModal
        ref={modalRef}
        targetTime={targetTime}
        remainingTime={timeRemaining}
        onReset={handleReset}
      />

      <section className="challenge">
        <h2>{title}</h2>
        <p>
          {targetTime} second{targetTime > 1 ? 's' : ''}
        </p>

        <button onClick={timerIsActive ? handleStop : handleStart}>
          {timerIsActive ? 'Stop' : 'Start'} Challenge
        </button>

        <p className={timerIsActive ? 'active' : ''}>
          {timerIsActive ? 'Time is running...' : 'Timer inactive'}
        </p>
      </section>
    </>
  );
}
```

---

## Portals

Portals let you **render children into a DOM node outside the parent component hierarchy**.

### Why Use Portals?

- **Modals/Dialogs**: Should render at the root level for proper z-index and styling
- **Tooltips/Popovers**: Need to escape overflow:hidden containers
- **Notifications**: Should be independent of page structure

### Basic Syntax

```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById('modal-root') // Target DOM node
  );
}
```

### Setup in HTML

```html
<!-- index.html -->
<body>
  <div id="root"></div>
  <!-- React app renders here -->
  <div id="modal-root"></div>
  <!-- Portals render here -->
</body>
```

### Complete Modal Example

```jsx
import { useState } from 'react';
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="modal-header">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="close-btn"
            aria-label="Close modal"
          >
            ×
          </button>
        </header>

        <main className="modal-body">{children}</main>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

// CSS
/*
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}
*/

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>My App</h1>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmation"
      >
        <p>Are you sure you want to proceed?</p>
        <div className="modal-actions">
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button
            onClick={() => {
              // Perform action
              setIsModalOpen(false);
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}
```

### Using HTML dialog Element with Portal

```jsx
import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open) {
      dialog.showModal(); // Native dialog method
    } else {
      dialog.close();
    }
  }, [open]);

  return createPortal(
    <dialog ref={dialogRef} onClose={onClose} className="modal">
      {children}
      <form method="dialog">
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById('modal-root')
  );
}
```

### Event Bubbling with Portals

**Important**: Events bubble through the React tree, NOT the DOM tree!

```jsx
function Parent() {
  const handleClick = () => {
    console.log('Parent clicked!');
  };

  return (
    <div onClick={handleClick}>
      <h1>Parent Component</h1>
      {/* Even though Portal renders elsewhere in DOM,
          click events still bubble to Parent in React! */}
      <Modal>
        <button>Click Me</button> {/* Will trigger handleClick! */}
      </Modal>
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Scrolling to Element

```jsx
function ScrollToSection() {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <nav>
        <button onClick={() => scrollTo(section1Ref)}>Section 1</button>
        <button onClick={() => scrollTo(section2Ref)}>Section 2</button>
        <button onClick={() => scrollTo(section3Ref)}>Section 3</button>
      </nav>

      <section ref={section1Ref} className="section">
        Section 1
      </section>
      <section ref={section2Ref} className="section">
        Section 2
      </section>
      <section ref={section3Ref} className="section">
        Section 3
      </section>
    </>
  );
}
```

### Pattern 2: Measuring Elements

```jsx
function MeasuredBox() {
  const boxRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const measureBox = () => {
      if (boxRef.current) {
        const { width, height } = boxRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    measureBox();
    window.addEventListener('resize', measureBox);
    return () => window.removeEventListener('resize', measureBox);
  }, []);

  return (
    <>
      <div ref={boxRef} className="measured-box">
        Resize the window!
      </div>
      <p>
        Width: {dimensions.width}px, Height: {dimensions.height}px
      </p>
    </>
  );
}
```

### Pattern 3: Video Player Control

```jsx
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const progress = (video.currentTime / video.duration) * 100;
    setProgress(progress);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = (e.target.value / 100) * video.duration;
    video.currentTime = seekTime;
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="controls">
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
        />
      </div>
    </div>
  );
}
```

### Pattern 4: Dynamic List with Refs

```jsx
function ChatMessages({ messages }) {
  const endOfMessagesRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      {messages.map((msg) => (
        <div key={msg.id} className="message">
          {msg.text}
        </div>
      ))}
      <div ref={endOfMessagesRef} /> {/* Invisible scroll target */}
    </div>
  );
}
```

### Pattern 5: Callback Ref

```jsx
function AutoFocusInput() {
  // Callback ref - called when element mounts/unmounts
  const callbackRef = (element) => {
    if (element) {
      element.focus();
      console.log('Input mounted and focused');
    } else {
      console.log('Input unmounted');
    }
  };

  return <input ref={callbackRef} />;
}
```

---

## Summary Table

| Feature               | Purpose               | When to Use                   |
| --------------------- | --------------------- | ----------------------------- |
| `useRef`              | Create mutable ref    | DOM access, storing values    |
| `forwardRef`          | Pass ref to child     | Custom components needing ref |
| `useImperativeHandle` | Customize exposed ref | Expose specific methods only  |
| `createPortal`        | Render outside tree   | Modals, tooltips, overlays    |

---

## 🎯 Common Interview Questions

### Q1: What is the difference between ref and state?

**Answer:**

- **State**: Changing it triggers re-render; used for data that affects UI
- **Ref**: Changing `.current` does NOT trigger re-render; used for DOM access or storing mutable values

```jsx
const [count, setCount] = useState(0); // Changes cause re-render
const countRef = useRef(0); // Changes don't cause re-render
```

### Q2: When should you use forwardRef?

**Answer:** Use `forwardRef` when:

- You want to expose DOM element of a custom component to parent
- Building reusable component libraries
- Parent needs to call methods on child's DOM (focus, scroll, etc.)

### Q3: What are Portals and when should you use them?

**Answer:** Portals render children outside the parent DOM hierarchy while maintaining React's event bubbling. Use for:

- **Modals** - Need to escape `overflow: hidden`
- **Tooltips** - Prevent clipping by ancestors
- **Dropdowns** - Position relative to viewport

### Q4: What errors can't Error Boundaries catch?

**Answer:** Error Boundaries cannot catch:

- Event handlers (use try/catch)
- Async code (setTimeout, fetch)
- Server-side rendering errors
- Errors in the error boundary itself

### Q5: Explain useImperativeHandle.

**Answer:** `useImperativeHandle` customizes what's exposed when a parent uses a ref on your component. It limits access to specific methods instead of the entire DOM element.

```jsx
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus(),
  // Only focus is exposed, not entire DOM
}));
```

---

## Practice Exercises

1. Create a custom `Input` component with focus, blur, and select methods
2. Build a tooltip component using portals
3. Create a notification system that renders at the root level
4. Build a timer component with start, stop, and reset controls using refs
5. Create a carousel component with slide navigation using refs

---

_Next: [05-context-api.md](./05-context-api.md)_

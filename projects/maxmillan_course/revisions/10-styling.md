# Styling in React - Complete Revision Guide

## Table of Contents

1. [Styling Approaches Overview](#styling-approaches-overview)
2. [Inline Styles](#inline-styles)
3. [CSS Stylesheets](#css-stylesheets)
4. [CSS Modules](#css-modules)
5. [Styled Components](#styled-components)
6. [Tailwind CSS](#tailwind-css)
7. [Conditional Styling](#conditional-styling)
8. [Best Practices](#best-practices)

---

## Styling Approaches Overview

| Approach              | Scoped? | Dynamic? | Vendor Prefixes | File Size |
| --------------------- | ------- | -------- | --------------- | --------- |
| **Inline Styles**     | ✅      | ✅       | Manual          | Small     |
| **CSS Files**         | ❌      | ❌       | Manual/PostCSS  | Normal    |
| **CSS Modules**       | ✅      | ❌       | Manual/PostCSS  | Normal    |
| **Styled Components** | ✅      | ✅       | Automatic       | Larger    |
| **Tailwind CSS**      | ✅      | ✅       | Automatic       | Optimized |

---

## Inline Styles

### Basic Usage

```jsx
function InlineStyleExample() {
  return (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '16px',
      }}
    >
      <h1
        style={{
          color: '#333',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        Hello, World!
      </h1>
    </div>
  );
}
```

### Style Objects

```jsx
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '16px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

function StyledComponent() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome</h1>
      <button style={styles.button}>Click Me</button>
    </div>
  );
}
```

### Dynamic Inline Styles

```jsx
function DynamicStyles({ isActive, theme }) {
  const buttonStyle = {
    backgroundColor: isActive ? 'green' : 'gray',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    opacity: isActive ? 1 : 0.6,
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle}>{isActive ? 'Active' : 'Inactive'}</button>
    </div>
  );
}
```

### Limitations of Inline Styles

```jsx
// ❌ Cannot use pseudo-classes
style={{ ':hover': { color: 'red' } }} // Won't work!

// ❌ Cannot use media queries
style={{ '@media (max-width: 768px)': { ... } }} // Won't work!

// ❌ Cannot use keyframe animations directly
style={{ animation: 'fadeIn 1s' }} // Needs CSS keyframes defined

// ✅ Use camelCase for property names
style={{ backgroundColor: 'red' }}  // Not 'background-color'
style={{ marginTop: '10px' }}       // Not 'margin-top'
```

---

## CSS Stylesheets

### Global CSS File

```css
/* styles.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

```jsx
// Component.jsx
import './styles.css';

function Component() {
  return (
    <div className="container">
      <h1 className="title">Welcome</h1>
      <button className="button">Click Me</button>
    </div>
  );
}
```

### Multiple Classes

```jsx
function MultipleClasses({ isPrimary, isLarge }) {
  // Using template literals
  const buttonClass = `button ${isPrimary ? 'primary' : 'secondary'} ${
    isLarge ? 'large' : ''
  }`;

  return <button className={buttonClass}>Click Me</button>;
}

// Or using array join
function AlternativeApproach({ isActive, isDisabled }) {
  const classes = ['button'];

  if (isActive) classes.push('active');
  if (isDisabled) classes.push('disabled');

  return <button className={classes.join(' ')}>Click</button>;
}
```

### CSS with Variables (Custom Properties)

```css
/* variables.css */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --font-family: 'Segoe UI', Tahoma, sans-serif;
  --border-radius: 4px;
  --spacing-unit: 8px;
}

.button {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 3);
  font-family: var(--font-family);
}

.button-success {
  background-color: var(--success-color);
}

.button-danger {
  background-color: var(--danger-color);
}
```

---

## CSS Modules

CSS Modules provide **locally scoped CSS** by default. Class names are automatically made unique.

### Setup

CSS Modules work out of the box in Create React App and Vite. Name your file with `.module.css`:

```css
/* Button.module.css */
.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.primary {
  background-color: #007bff;
}

.secondary {
  background-color: #6c757d;
}

.large {
  padding: 15px 30px;
  font-size: 18px;
}

.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

### Basic Usage

```jsx
// Button.jsx
import styles from './Button.module.css';

function Button({ children, variant = 'primary', size, disabled }) {
  return (
    <button className={styles.button} disabled={disabled}>
      {children}
    </button>
  );
}
```

### Multiple Classes with CSS Modules

```jsx
import styles from './Button.module.css';

function Button({ variant, size, disabled }) {
  // Using template literals
  const buttonClasses = `
    ${styles.button} 
    ${styles[variant]} 
    ${size === 'large' ? styles.large : ''}
    ${disabled ? styles.disabled : ''}
  `.trim();

  return <button className={buttonClasses}>Click</button>;
}

// Or using array
function ButtonAlt({ variant, size }) {
  const classes = [
    styles.button,
    styles[variant],
    size === 'large' && styles.large,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classes}>Click</button>;
}
```

### Composing Classes

```css
/* Card.module.css */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
}

.elevated {
  composes: card; /* Inherits from .card */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.highlighted {
  composes: card;
  border-color: #007bff;
  background-color: #f0f8ff;
}
```

```jsx
import styles from './Card.module.css';

function ElevatedCard({ children }) {
  return <div className={styles.elevated}>{children}</div>;
}
```

### Global Classes in CSS Modules

```css
/* App.module.css */
.localClass {
  color: blue;
}

:global(.global-class) {
  color: red;
}

/* Or mix local and global */
.container :global(.third-party-class) {
  margin: 10px;
}
```

### Complete Example

```css
/* Header.module.css */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1a2e;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #eee;
}

.nav {
  display: flex;
  gap: 1rem;
}

.navLink {
  color: #aaa;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.navLink:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.active {
  color: #fff;
  background-color: #007bff;
}
```

```jsx
// Header.jsx
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>MyApp</div>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
```

---

## Styled Components

Styled Components is a CSS-in-JS library that lets you write actual CSS in your JavaScript.

### Installation

```bash
npm install styled-components
```

### Basic Usage

```jsx
import styled from 'styled-components';

// Create styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Use them like regular components
function App() {
  return (
    <Container>
      <Title>Welcome to My App</Title>
      <Button>Click Me</Button>
      <Button disabled>Disabled</Button>
    </Container>
  );
}
```

### Props-Based Styling

```jsx
import styled from 'styled-components';

const Button = styled.button`
  padding: ${(props) => (props.$size === 'large' ? '15px 30px' : '10px 20px')};
  font-size: ${(props) => (props.$size === 'large' ? '18px' : '14px')};

  background-color: ${(props) => {
    switch (props.$variant) {
      case 'primary':
        return '#007bff';
      case 'success':
        return '#28a745';
      case 'danger':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }};

  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
`;

// Usage
function ButtonDemo() {
  return (
    <div>
      <Button $variant="primary">Primary</Button>
      <Button $variant="success" $size="large">
        Large Success
      </Button>
      <Button $variant="danger" disabled>
        Disabled Danger
      </Button>
    </div>
  );
}
```

### Extending Styles

```jsx
import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// Extend the base button
const PrimaryButton = styled(Button)`
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 2px solid #007bff;
  color: #007bff;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

// Usage
function Buttons() {
  return (
    <div>
      <PrimaryButton>Primary</PrimaryButton>
      <OutlineButton>Outline</OutlineButton>
    </div>
  );
}
```

### Theming

```jsx
import styled, { ThemeProvider } from 'styled-components';

// Define theme
const lightTheme = {
  colors: {
    primary: '#007bff',
    background: '#ffffff',
    text: '#333333',
    border: '#dddddd',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

const darkTheme = {
  colors: {
    primary: '#4dabf7',
    background: '#1a1a2e',
    text: '#ffffff',
    border: '#444444',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

// Use theme in styled components
const Container = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  padding: ${(props) => props.theme.spacing.large};
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.medium};
  border-radius: 8px;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: ${(props) => props.theme.spacing.small} ${(props) =>
      props.theme.spacing.medium};
  border: none;
  border-radius: 4px;
`;

// App with theme provider
function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Container>
        <Card>
          <h2>Themed Card</h2>
          <Button onClick={() => setIsDark(!isDark)}>Toggle Theme</Button>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
```

### Global Styles

```jsx
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
  }
  
  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <MainContent />
    </ThemeProvider>
  );
}
```

### Animations

```jsx
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const AnimatedCard = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
```

---

## Tailwind CSS

Tailwind is a utility-first CSS framework.

### Setup with Vite

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Basic Usage

```jsx
function TailwindExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to Tailwind
      </h1>

      <p className="text-gray-600 leading-relaxed mb-6">
        Tailwind CSS is a utility-first framework.
      </p>

      <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
        Click Me
      </button>
    </div>
  );
}
```

### Common Utilities

```jsx
// Layout
<div className="flex justify-center items-center">
<div className="grid grid-cols-3 gap-4">
<div className="container mx-auto">

// Spacing
<div className="p-4 m-2">        {/* padding: 1rem, margin: 0.5rem */}
<div className="px-6 py-3">      {/* padding-x: 1.5rem, padding-y: 0.75rem */}
<div className="mt-8 mb-4">      {/* margin-top: 2rem, margin-bottom: 1rem */}

// Typography
<p className="text-lg font-semibold text-gray-700">
<p className="text-sm text-center uppercase tracking-wide">

// Colors
<div className="bg-blue-500 text-white">
<div className="bg-gray-100 border border-gray-300">

// Sizing
<div className="w-full h-screen">
<div className="w-64 h-32">
<div className="min-h-screen max-w-md">

// Borders
<div className="border rounded-lg">
<div className="border-2 border-blue-500 rounded-full">

// Shadows
<div className="shadow-sm">
<div className="shadow-lg">
<div className="shadow-xl">

// Position
<div className="relative">
<div className="absolute top-0 right-0">
<div className="fixed bottom-4 right-4">
```

### Responsive Design

```jsx
function ResponsiveCard() {
  return (
    <div
      className="
      w-full 
      md:w-1/2 
      lg:w-1/3 
      p-4 
      md:p-6
    "
    >
      <div
        className="
        flex 
        flex-col 
        md:flex-row 
        gap-4
      "
      >
        <img
          className="
            w-full 
            h-48 
            md:w-32 
            md:h-32 
            object-cover 
            rounded-lg
          "
          src="/image.jpg"
          alt=""
        />
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Title</h2>
          <p className="text-sm md:text-base text-gray-600">Description text</p>
        </div>
      </div>
    </div>
  );
}

// Breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### Hover, Focus, and State Variants

```jsx
function InteractiveButton() {
  return (
    <button
      className="
      bg-blue-500 
      hover:bg-blue-600 
      active:bg-blue-700
      focus:outline-none 
      focus:ring-2 
      focus:ring-blue-500 
      focus:ring-offset-2
      disabled:bg-gray-400 
      disabled:cursor-not-allowed
      transition-colors 
      duration-200
      text-white 
      font-medium 
      py-2 
      px-4 
      rounded-lg
    "
    >
      Click Me
    </button>
  );
}
```

### Dark Mode

```jsx
// Enable in tailwind.config.js
// darkMode: 'class' or 'media'

function DarkModeCard() {
  return (
    <div
      className="
      bg-white 
      dark:bg-gray-800 
      text-gray-900 
      dark:text-white
      border 
      border-gray-200 
      dark:border-gray-700
      rounded-lg 
      p-6
    "
    >
      <h2 className="text-xl font-bold mb-2">Dark Mode Support</h2>
      <p className="text-gray-600 dark:text-gray-300">
        This card adapts to dark mode.
      </p>
    </div>
  );
}
```

### Custom Classes with @apply

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply py-2 px-4 font-medium rounded-lg transition-colors;
  }

  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

```jsx
// Now use the custom classes
function Form() {
  return (
    <div className="card">
      <input className="input mb-4" placeholder="Email" />
      <input className="input mb-4" placeholder="Password" type="password" />
      <button className="btn btn-primary w-full">Login</button>
    </div>
  );
}
```

### Complete Component Example

```jsx
function ProductCard({ product }) {
  return (
    <div
      className="
      group
      bg-white 
      rounded-xl 
      shadow-md 
      overflow-hidden 
      hover:shadow-xl 
      transition-shadow 
      duration-300
    "
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="
            w-full 
            h-48 
            object-cover 
            group-hover:scale-105 
            transition-transform 
            duration-300
          "
        />
        {product.isNew && (
          <span
            className="
            absolute 
            top-2 
            right-2 
            bg-green-500 
            text-white 
            text-xs 
            font-bold 
            px-2 
            py-1 
            rounded
          "
          >
            NEW
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="
          text-lg 
          font-semibold 
          text-gray-800 
          mb-1
          truncate
        "
        >
          {product.name}
        </h3>

        <p
          className="
          text-gray-600 
          text-sm 
          mb-3 
          line-clamp-2
        "
        >
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            ${product.price}
          </span>

          <button
            className="
            bg-blue-500 
            hover:bg-blue-600 
            text-white 
            text-sm 
            font-medium 
            py-2 
            px-4 
            rounded-lg 
            transition-colors
          "
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Conditional Styling

### Using Template Literals

```jsx
function ConditionalClasses({ isActive, isDisabled, variant }) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant] || variantClasses.primary}
        ${isActive ? 'ring-2 ring-offset-2' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={isDisabled}
    >
      Button
    </button>
  );
}
```

### Using clsx or classnames Library

```bash
npm install clsx
# or
npm install classnames
```

```jsx
import clsx from 'clsx';
// or: import classNames from 'classnames';

function Button({ variant, size, isLoading, disabled, children }) {
  const classes = clsx(
    // Base classes (always applied)
    'font-medium rounded transition-colors',

    // Conditional by variant
    {
      'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
      'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
      'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
    },

    // Conditional by size
    {
      'text-sm px-3 py-1.5': size === 'small',
      'text-base px-4 py-2': size === 'medium' || !size,
      'text-lg px-6 py-3': size === 'large',
    },

    // Conditional by state
    {
      'opacity-50 cursor-not-allowed': disabled || isLoading,
      'cursor-wait': isLoading,
    }
  );

  return (
    <button className={classes} disabled={disabled || isLoading}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
```

### Class Variance Authority (CVA)

```bash
npm install class-variance-authority
```

```jsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes
  'font-medium rounded transition-colors focus:outline-none focus:ring-2',
  {
    variants: {
      intent: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
      },
      size: {
        small: 'text-sm px-3 py-1.5',
        medium: 'text-base px-4 py-2',
        large: 'text-lg px-6 py-3',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
    },
  }
);

function Button({ intent, size, fullWidth, className, children, ...props }) {
  return (
    <button
      className={buttonVariants({ intent, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}

// Usage
<Button intent="primary" size="large">Large Primary</Button>
<Button intent="danger" size="small">Small Danger</Button>
<Button fullWidth>Full Width</Button>
```

---

## Best Practices

### 1. Choose the Right Approach

```jsx
// Small project, few styles → CSS files
// Need scoping → CSS Modules
// Complex dynamic styles → Styled Components
// Rapid development, utility classes → Tailwind CSS
// Large team → Whatever has best conventions
```

### 2. Organize Your Styles

```
src/
├── styles/
│   ├── globals.css         # Global styles
│   ├── variables.css       # CSS variables
│   └── utilities.css       # Utility classes
├── components/
│   └── Button/
│       ├── Button.jsx
│       ├── Button.module.css    # CSS Modules
│       └── Button.styles.js     # Styled Components
```

### 3. Use Design Tokens

```jsx
// theme.js
export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
};

// Use consistently across all approaches
```

### 4. Keep Components Consistent

```jsx
// Create a style system
const buttonStyles = {
  base: 'px-4 py-2 rounded font-medium transition-colors',
  variants: {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  },
  sizes: {
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  },
};

// Reuse everywhere
```

### 5. Avoid Inline Styles for Complex Styling

```jsx
// ❌ Avoid
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: isActive ? 'blue' : 'gray',
  // ... many more properties
}}>

// ✅ Better - use classes
<div className={clsx(styles.container, isActive && styles.active)}>
```

---

## Summary Cheat Sheet

```jsx
// Inline Styles
<div style={{ backgroundColor: 'red', padding: '10px' }}>

// CSS Modules
import styles from './Component.module.css';
<div className={styles.container}>
<div className={`${styles.btn} ${styles.primary}`}>

// Styled Components
const Button = styled.button`
  background: ${props => props.$primary ? 'blue' : 'gray'};
`;
<Button $primary>Click</Button>

// Tailwind CSS
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">

// Conditional classes with clsx
className={clsx('base', { 'active': isActive, 'disabled': isDisabled })}
```

---

## Practice Exercises

1. Build a button component with 3 variants using CSS Modules
2. Create a theme toggle with Styled Components
3. Build a responsive navigation with Tailwind CSS
4. Create a card grid with hover effects
5. Build a form with consistent styling across inputs

---

_Next: [11-performance.md](./11-performance.md)_

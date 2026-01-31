# JavaScript Fundamentals for React - Interview Ready Guide

## Table of Contents

1. [Variables: var, let, const](#variables-var-let-const)
2. [Arrow Functions](#arrow-functions)
3. [Destructuring](#destructuring)
4. [Spread & Rest Operators](#spread--rest-operators)
5. [Array Methods](#array-methods)
6. [Objects](#objects)
7. [Promises & Async/Await](#promises--asyncawait)
8. [Closures](#closures)
9. [this Keyword](#this-keyword)
10. [Event Loop](#event-loop)
11. [Hoisting](#hoisting)
12. [Prototypes & Classes](#prototypes--classes)
13. [Modules](#modules)
14. [Equality & Type Coercion](#equality--type-coercion)
15. [Nullish Coalescing & Optional Chaining](#nullish-coalescing--optional-chaining)
16. [Common Interview Questions](#common-interview-questions)

---

## Variables: var, let, const

### Quick Comparison

| Feature    | `var`           | `let`     | `const`   |
| ---------- | --------------- | --------- | --------- |
| Scope      | Function        | Block     | Block     |
| Hoisting   | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Re-declare | ✅              | ❌        | ❌        |
| Re-assign  | ✅              | ✅        | ❌        |

### Examples

```javascript
// var - function scoped, hoisted
function varExample() {
  console.log(x); // undefined (hoisted)
  var x = 10;
  if (true) {
    var x = 20; // Same variable!
  }
  console.log(x); // 20
}

// let - block scoped
function letExample() {
  // console.log(y); // ReferenceError: TDZ
  let y = 10;
  if (true) {
    let y = 20; // Different variable
    console.log(y); // 20
  }
  console.log(y); // 10
}

// const - block scoped, cannot reassign
const PI = 3.14;
// PI = 3.15; // ❌ TypeError

// BUT objects/arrays can be mutated!
const user = { name: 'Sanket' };
user.name = 'John'; // ✅ Works!
user.age = 25; // ✅ Works!
// user = {}; // ❌ Cannot reassign
```

### 💡 Interview Tip

> **Q: Why prefer `const` over `let`?**  
> A: `const` signals intent that the binding won't change, making code more predictable and easier to reason about.

---

## Arrow Functions

### Syntax

```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With single parameter (parentheses optional)
const double = (n) => n * 2;

// With body (explicit return needed)
const multiply = (a, b) => {
  const result = a * b;
  return result;
};

// Returning object (wrap in parentheses)
const createUser = (name, age) => ({ name, age });
```

### Key Difference: `this` Binding

```javascript
const obj = {
  name: 'Sanket',

  // Regular function: own `this`
  greet: function () {
    console.log(this.name); // 'Sanket'
  },

  // Arrow function: inherits `this` from parent scope
  greetArrow: () => {
    console.log(this.name); // undefined (window/global)
  },

  // Common React pattern
  delayedGreet: function () {
    // ❌ Regular function loses `this`
    setTimeout(function () {
      console.log(this.name); // undefined
    }, 100);

    // ✅ Arrow function preserves `this`
    setTimeout(() => {
      console.log(this.name); // 'Sanket'
    }, 100);
  },
};
```

### 💡 Interview Tip

> **Q: When NOT to use arrow functions?**  
> A: Object methods, constructors, and when you need `arguments` object.

---

## Destructuring

### Array Destructuring

```javascript
const colors = ['red', 'green', 'blue'];

// Basic
const [first, second, third] = colors;
console.log(first); // 'red'

// Skip elements
const [, , last] = colors;
console.log(last); // 'blue'

// Default values
const [a, b, c, d = 'yellow'] = colors;
console.log(d); // 'yellow'

// Swap variables
let x = 1,
  y = 2;
[x, y] = [y, x];
console.log(x, y); // 2, 1

// Rest pattern
const [head, ...tail] = colors;
console.log(tail); // ['green', 'blue']
```

### Object Destructuring

```javascript
const user = { name: 'Sanket', age: 25, city: 'Pune' };

// Basic
const { name, age } = user;
console.log(name); // 'Sanket'

// Rename
const { name: userName } = user;
console.log(userName); // 'Sanket'

// Default values
const { country = 'India' } = user;
console.log(country); // 'India'

// Nested destructuring
const data = {
  user: { profile: { firstName: 'Sanket' } },
};
const {
  user: {
    profile: { firstName },
  },
} = data;
console.log(firstName); // 'Sanket'

// In function parameters (React pattern!)
function UserCard({ name, age, city = 'Unknown' }) {
  return `${name}, ${age}, ${city}`;
}
```

---

## Spread & Rest Operators

### Spread Operator (`...`) - Expands

```javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Clone array (shallow)
const clone = [...arr1];

// Objects
const defaults = { theme: 'dark', lang: 'en' };
const userPrefs = { theme: 'light' };
const settings = { ...defaults, ...userPrefs };
// { theme: 'light', lang: 'en' }

// React: Updating state immutably
const [user, setUser] = useState({ name: 'Sanket', age: 25 });
setUser({ ...user, age: 26 }); // ✅ New object
setUser((prev) => ({ ...prev, age: prev.age + 1 })); // ✅ Functional update
```

### Rest Operator (`...`) - Collects

```javascript
// In function parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10

// In destructuring
const { name, ...rest } = { name: 'Sanket', age: 25, city: 'Pune' };
console.log(rest); // { age: 25, city: 'Pune' }

// React: Passing remaining props
function Button({ label, ...props }) {
  return <button {...props}>{label}</button>;
}
<Button label="Click" onClick={fn} disabled={true} />;
```

---

## Array Methods

### Essential Methods for React

```javascript
const users = [
  { id: 1, name: 'Sanket', age: 25, active: true },
  { id: 2, name: 'John', age: 30, active: false },
  { id: 3, name: 'Jane', age: 28, active: true },
];

// map() - Transform each element (returns new array)
const names = users.map((user) => user.name);
// ['Sanket', 'John', 'Jane']

// React: Rendering lists
users.map((user) => <UserCard key={user.id} user={user} />);

// filter() - Keep elements that pass test
const activeUsers = users.filter((user) => user.active);
// [{ id: 1, ... }, { id: 3, ... }]

// find() - Get first match (returns element or undefined)
const john = users.find((user) => user.name === 'John');
// { id: 2, name: 'John', ... }

// findIndex() - Get index of first match
const johnIndex = users.findIndex((user) => user.name === 'John');
// 1

// some() - At least one passes test? (returns boolean)
const hasActive = users.some((user) => user.active); // true

// every() - All pass test? (returns boolean)
const allActive = users.every((user) => user.active); // false

// reduce() - Accumulate into single value
const totalAge = users.reduce((sum, user) => sum + user.age, 0);
// 83

// includes() - Check if array contains value
const nums = [1, 2, 3];
nums.includes(2); // true

// Chaining
const activeNames = users
  .filter((user) => user.active)
  .map((user) => user.name);
// ['Sanket', 'Jane']
```

### Immutable Operations (for React State)

```javascript
// Add item
const newUsers = [...users, { id: 4, name: 'New' }];

// Remove item
const filtered = users.filter((user) => user.id !== 2);

// Update item
const updated = users.map((user) =>
  user.id === 1 ? { ...user, age: 26 } : user
);

// Sort (mutates! always copy first)
const sorted = [...users].sort((a, b) => a.age - b.age);
```

---

## Objects

### Object Methods

```javascript
const user = { name: 'Sanket', age: 25, city: 'Pune' };

// Get keys, values, entries
Object.keys(user); // ['name', 'age', 'city']
Object.values(user); // ['Sanket', 25, 'Pune']
Object.entries(user); // [['name', 'Sanket'], ['age', 25], ...]

// Create from entries
Object.fromEntries([
  ['a', 1],
  ['b', 2],
]); // { a: 1, b: 2 }

// Merge objects
Object.assign({}, user, { country: 'India' });
// OR use spread: { ...user, country: 'India' }

// Check property existence
'name' in user; // true
user.hasOwnProperty('name'); // true

// Shorthand property names
const name = 'Sanket';
const age = 25;
const person = { name, age }; // { name: 'Sanket', age: 25 }

// Computed property names
const key = 'email';
const obj = { [key]: 'test@mail.com' }; // { email: 'test@mail.com' }

// Dynamic key in React
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};
```

---

## Promises & Async/Await

### Promise Basics

```javascript
// Creating a promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve({ data: 'Hello!' });
      } else {
        reject(new Error('Failed!'));
      }
    }, 1000);
  });
};

// Consuming with .then/.catch
fetchData()
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log('Done'));

// Promise states: pending → fulfilled/rejected
```

### Async/Await (Syntactic Sugar)

```javascript
// Async function always returns a Promise
async function getData() {
  try {
    const response = await fetch('/api/users');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw if needed
  }
}

// React: useEffect with async
useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);
```

### Parallel vs Sequential

```javascript
// Sequential (slow) - one after another
const user = await fetchUser(id);
const posts = await fetchPosts(id);
const comments = await fetchComments(id);

// Parallel (fast) - all at once
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id),
]);

// Promise.allSettled - doesn't fail if one rejects
const results = await Promise.allSettled([promise1, promise2]);
// [{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: ... }]

// Promise.race - first to resolve/reject wins
const result = await Promise.race([promise1, promise2]);
```

---

## Closures

### What Is a Closure?

A closure is a function that **remembers** the variables from its outer scope even after the outer function has returned.

```javascript
function createCounter() {
  let count = 0; // Private variable

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount(); // 2
// count is not accessible directly!
```

### Practical Examples

```javascript
// Data privacy
function createUser(name) {
  let _password = ''; // Private

  return {
    getName: () => name,
    setPassword: (pwd) => {
      _password = pwd;
    },
    checkPassword: (pwd) => _password === pwd,
  };
}

// Function factory
function multiply(factor) {
  return (number) => number * factor;
}
const double = multiply(2);
const triple = multiply(3);
double(5); // 10
triple(5); // 15

// React: Event handlers with closure
function UserList({ users }) {
  const handleClick = (userId) => {
    // userId is "closed over"
    return () => {
      console.log(`Clicked user: ${userId}`);
    };
  };

  return users.map((user) => (
    <button key={user.id} onClick={handleClick(user.id)}>
      {user.name}
    </button>
  ));
}
```

### ⚠️ Common Closure Pitfall

```javascript
// Problem: Loop variable closure
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (var is function-scoped)

// Solution 1: Use let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 (let is block-scoped)

// Solution 2: IIFE
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

---

## this Keyword

### Rules of `this` (in order of precedence)

```javascript
// 1. new binding - `this` is the new object
function Person(name) {
  this.name = name;
}
const p = new Person('Sanket'); // this = new object

// 2. Explicit binding - call, apply, bind
function greet() {
  console.log(this.name);
}
const user = { name: 'Sanket' };
greet.call(user); // 'Sanket'
greet.apply(user); // 'Sanket'
const bound = greet.bind(user);
bound(); // 'Sanket'

// 3. Implicit binding - object method
const obj = {
  name: 'Sanket',
  greet() {
    console.log(this.name);
  },
};
obj.greet(); // 'Sanket'

// 4. Default binding - global (or undefined in strict mode)
function standalone() {
  console.log(this);
}
standalone(); // window (or undefined in strict mode)
```

### `this` in Arrow Functions

```javascript
// Arrow functions DON'T have their own `this`
// They inherit from lexical scope

const obj = {
  name: 'Sanket',

  // Regular function: `this` is obj
  regular() {
    console.log(this.name); // 'Sanket'
  },

  // Arrow function: `this` is outer scope (window/undefined)
  arrow: () => {
    console.log(this.name); // undefined
  },

  // Useful in callbacks!
  delayed() {
    setTimeout(() => {
      console.log(this.name); // 'Sanket' ✅
    }, 100);
  },
};
```

---

## Event Loop

### How JavaScript Executes Code

```
┌─────────────────────────────────────────────────────┐
│                    Call Stack                        │
│  (Executes synchronous code, one at a time)         │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │         Event Loop            │
         │ (Checks if stack is empty,    │
         │  then pushes from queues)     │
         └───────────────┬───────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    ▼                    ▼                    ▼
┌─────────┐      ┌─────────────┐      ┌─────────────┐
│Microtask│      │ Macrotask   │      │ Web APIs    │
│ Queue   │      │ Queue       │      │ (setTimeout,│
│(Promise,│      │(setTimeout, │      │  fetch,     │
│queueMicro)     │ setInterval)│      │  DOM events)│
└─────────┘      └─────────────┘      └─────────────┘
  (Higher            (Lower
  Priority)          Priority)
```

### Execution Order Example

```javascript
console.log('1'); // Sync

setTimeout(() => console.log('2'), 0); // Macrotask

Promise.resolve().then(() => console.log('3')); // Microtask

console.log('4'); // Sync

// Output: 1, 4, 3, 2
// Why? Sync first, then microtasks, then macrotasks
```

### More Complex Example

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
  })
  .then(() => {
    console.log('Promise 2');
  });

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');

// Output:
// Start
// End
// Promise 1
// Promise 2
// Timeout 1
// Timeout 2
```

---

## Hoisting

### What Gets Hoisted?

```javascript
// var declarations (not initialization)
console.log(x); // undefined (hoisted as var x;)
var x = 5;

// Function declarations (entire function)
greet(); // Works!
function greet() {
  console.log('Hello');
}

// let/const (hoisted but in TDZ)
console.log(y); // ReferenceError: Cannot access before initialization
let y = 10;

// Function expressions (NOT hoisted as function)
sayHi(); // TypeError: sayHi is not a function
var sayHi = function () {
  console.log('Hi');
};
```

### Temporal Dead Zone (TDZ)

```javascript
// TDZ: Time between entering scope and declaration
{
  // TDZ starts here for `name`
  console.log(name); // ReferenceError
  let name = 'Sanket'; // TDZ ends here
  console.log(name); // 'Sanket'
}
```

---

## Prototypes & Classes

### Prototype Chain

```javascript
// Every object has a prototype
const obj = { name: 'Sanket' };
console.log(obj.__proto__ === Object.prototype); // true

// Prototype inheritance
const animal = {
  speak() {
    console.log(`${this.name} makes a sound`);
  },
};

const dog = Object.create(animal);
dog.name = 'Buddy';
dog.speak(); // 'Buddy makes a sound'
```

### ES6 Classes (Syntactic Sugar)

```javascript
class Person {
  // Constructor
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Method
  greet() {
    return `Hi, I'm ${this.name}`;
  }

  // Static method
  static create(name, age) {
    return new Person(name, age);
  }

  // Getter
  get info() {
    return `${this.name}, ${this.age}`;
  }

  // Setter
  set info(value) {
    [this.name, this.age] = value.split(', ');
  }
}

// Inheritance
class Employee extends Person {
  constructor(name, age, role) {
    super(name, age); // Call parent constructor
    this.role = role;
  }

  greet() {
    return `${super.greet()}, I'm a ${this.role}`;
  }
}

const emp = new Employee('Sanket', 25, 'Developer');
emp.greet(); // "Hi, I'm Sanket, I'm a Developer"
```

---

## Modules

### ES6 Modules (import/export)

```javascript
// Named exports (utils.js)
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export function subtract(a, b) {
  return a - b;
}

// Named imports
import { add, subtract } from './utils.js';
import { add as sum } from './utils.js'; // Rename
import * as utils from './utils.js'; // All as namespace
utils.add(1, 2);

// Default export (one per file)
// Button.jsx
export default function Button({ label }) {
  return <button>{label}</button>;
}

// Default import (any name works)
import Button from './Button';
import MyButton from './Button'; // Same thing

// Mixed
import React, { useState, useEffect } from 'react';
```

### CommonJS (Node.js)

```javascript
// Export
module.exports = { add, subtract };
// OR
exports.add = add;

// Import
const { add, subtract } = require('./utils');
const utils = require('./utils');
```

---

## Equality & Type Coercion

### == vs === vs Object.is()

```javascript
// == (loose equality) - coerces types
'5' == 5; // true (string converted to number)
0 == false; // true
null == undefined; // true
'' == false; // true

// === (strict equality) - no coercion
'5' === 5; // false
0 === false; // false
null === undefined; // false

// Object.is() - like === but handles edge cases
Object.is(NaN, NaN); // true (=== returns false!)
Object.is(0, -0); // false (=== returns true!)
```

### Truthy & Falsy Values

```javascript
// Falsy values (6 total):
(false, 0, '', null, undefined, NaN);

// Everything else is truthy, including:
('0', ' ', [], {}, function () {});

// Practical usage
const name = user.name || 'Guest'; // Default for falsy
const name = user.name ?? 'Guest'; // Default for null/undefined only

// In conditions
if (array.length) {
} // Truthy check
if (object) {
} // Existence check
```

---

## Nullish Coalescing & Optional Chaining

### Nullish Coalescing (??)

```javascript
// Returns right side only if left is null or undefined
const a = null ?? 'default'; // 'default'
const b = undefined ?? 'default'; // 'default'
const c = 0 ?? 'default'; // 0 (not null/undefined)
const d = '' ?? 'default'; // '' (not null/undefined)

// vs || (OR) - returns right for any falsy
const e = 0 || 'default'; // 'default'
const f = '' || 'default'; // 'default'

// React: Great for default values
function UserProfile({ age }) {
  const displayAge = age ?? 'Not specified';
  // 0 age will show "0", not "Not specified"
}
```

### Optional Chaining (?.)

```javascript
const user = {
  name: 'Sanket',
  address: {
    city: 'Pune',
  },
};

// Without optional chaining
const zipcode = user.address && user.address.zipcode;

// With optional chaining
const zipcode = user?.address?.zipcode; // undefined (no error)
const country = user?.address?.country?.name; // undefined

// With arrays
const firstItem = arr?.[0];

// With function calls
const result = user.getName?.(); // undefined if getName doesn't exist

// Combining with nullish coalescing
const city = user?.address?.city ?? 'Unknown';
```

---

## Common Interview Questions

### Q1: What's the output?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Answer: 3, 3, 3 (var is function-scoped, closure captures reference)
```

### Q2: What's the output?

```javascript
console.log(typeof null);
// Answer: 'object' (historical bug in JavaScript)
```

### Q3: What's the output?

```javascript
console.log(0.1 + 0.2 === 0.3);
// Answer: false (floating-point precision issue)
// Fix: Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON
```

### Q4: Implement debounce

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage in React
const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);
```

### Q5: Implement throttle

```javascript
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### Q6: Deep clone an object

```javascript
// Simple (doesn't handle functions, Date, etc.)
const clone = JSON.parse(JSON.stringify(obj));

// Better: structuredClone (modern)
const clone = structuredClone(obj);

// Manual recursive
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}
```

### Q7: Flatten nested array

```javascript
// Built-in
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]

// Manual
function flatten(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
    []
  );
}
```

### Q8: What's the difference between call, apply, bind?

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const user = { name: 'Sanket' };

// call - invokes immediately, args as comma-separated
greet.call(user, 'Hello', '!'); // "Hello, Sanket!"

// apply - invokes immediately, args as array
greet.apply(user, ['Hello', '!']); // "Hello, Sanket!"

// bind - returns new function, doesn't invoke
const boundGreet = greet.bind(user, 'Hello');
boundGreet('!'); // "Hello, Sanket!"
```

### Q9: Explain event delegation

```javascript
// Instead of attaching listeners to each button:
// ❌ buttons.forEach(btn => btn.addEventListener('click', handler))

// Attach one listener to parent:
// ✅
document.getElementById('button-container').addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    console.log('Button clicked:', e.target.textContent);
  }
});

// Benefits: Less memory, works with dynamically added elements
```

### Q10: What happens when you type a URL?

```
1. DNS lookup → Get IP address
2. TCP connection → 3-way handshake
3. TLS handshake (if HTTPS)
4. HTTP request → Server processes
5. HTTP response → HTML received
6. Parse HTML → Build DOM tree
7. Parse CSS → Build CSSOM
8. Execute JavaScript → May modify DOM
9. Render tree → Layout → Paint → Composite
```

---

## Quick Reference Card

```javascript
// Spread array/object
const newArr = [...arr, newItem];
const newObj = { ...obj, newProp: value };

// Destructure
const { name, age = 0 } = user;
const [first, ...rest] = array;

// Optional chaining + nullish coalescing
const value = obj?.nested?.prop ?? 'default';

// Array operations
array.map(fn); // Transform
array.filter(fn); // Filter
array.find(fn); // First match
array.reduce(fn, init); // Accumulate

// Async patterns
const data = await fetch(url).then((r) => r.json());
const [a, b] = await Promise.all([p1, p2]);

// Check types
typeof x; // 'string', 'number', 'object', etc.
Array.isArray(x); // true/false
x instanceof Y; // true/false
```

---

_Next: [18-tanstack-query.md](./18-tanstack-query.md)_

_Back to: [00-index.md](./00-index.md)_

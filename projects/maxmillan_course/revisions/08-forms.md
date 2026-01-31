# React Forms - Complete Revision Guide

## Table of Contents

1. [Form Handling Approaches](#form-handling-approaches)
2. [Controlled Components](#controlled-components)
3. [Uncontrolled Components](#uncontrolled-components)
4. [Form Validation](#form-validation)
5. [Multi-Field Forms](#multi-field-forms)
6. [Custom Form Hooks](#custom-form-hooks)
7. [React 19: useActionState](#react-19-useactionstate)
8. [Best Practices](#best-practices)

---

## Form Handling Approaches

React offers two main approaches to handle form inputs:

| Approach         | Description                      | When to Use                            |
| ---------------- | -------------------------------- | -------------------------------------- |
| **Controlled**   | React state controls input value | Complex validation, real-time feedback |
| **Uncontrolled** | DOM controls input value (refs)  | Simple forms, file inputs              |

---

## Controlled Components

In controlled components, **React state is the "single source of truth"** for input values.

### Basic Controlled Input

```jsx
import { useState } from 'react';

function ControlledInput() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted:', value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value} // Value from state
        onChange={handleChange} // Update state on change
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Two-Way Binding

The input displays the state value, and changes update the state:

```jsx
function TwoWayBinding() {
  const [name, setName] = useState('');

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}
```

### Different Input Types

```jsx
function AllInputTypes() {
  const [formData, setFormData] = useState({
    text: '',
    email: '',
    password: '',
    number: 0,
    date: '',
    checkbox: false,
    radio: '',
    select: '',
    textarea: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form>
      {/* Text input */}
      <input
        type="text"
        name="text"
        value={formData.text}
        onChange={handleChange}
      />

      {/* Email input */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      {/* Password input */}
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      {/* Number input */}
      <input
        type="number"
        name="number"
        value={formData.number}
        onChange={handleChange}
      />

      {/* Date input */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />

      {/* Checkbox */}
      <input
        type="checkbox"
        name="checkbox"
        checked={formData.checkbox} // Use checked, not value!
        onChange={handleChange}
      />

      {/* Radio buttons */}
      <label>
        <input
          type="radio"
          name="radio"
          value="option1"
          checked={formData.radio === 'option1'}
          onChange={handleChange}
        />
        Option 1
      </label>
      <label>
        <input
          type="radio"
          name="radio"
          value="option2"
          checked={formData.radio === 'option2'}
          onChange={handleChange}
        />
        Option 2
      </label>

      {/* Select dropdown */}
      <select name="select" value={formData.select} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="opt1">Option 1</option>
        <option value="opt2">Option 2</option>
      </select>

      {/* Textarea */}
      <textarea
        name="textarea"
        value={formData.textarea}
        onChange={handleChange}
        rows={4}
      />
    </form>
  );
}
```

### Multiple Checkboxes

```jsx
function MultipleCheckboxes() {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setSelectedOptions((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((item) => item !== value);
      }
    });
  };

  const options = ['React', 'Vue', 'Angular', 'Svelte'];

  return (
    <div>
      <p>Select frameworks:</p>
      {options.map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={handleCheckboxChange}
          />
          {option}
        </label>
      ))}
      <p>Selected: {selectedOptions.join(', ')}</p>
    </div>
  );
}
```

---

## Uncontrolled Components

In uncontrolled components, the **DOM handles the input state**. Use refs to access values.

### Basic Uncontrolled Input

```jsx
import { useRef } from 'react';

function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted:', inputRef.current.value);

    // Can clear the input
    inputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        defaultValue="" // Use defaultValue, not value
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Multiple Uncontrolled Inputs

```jsx
function UncontrolledForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" ref={emailRef} defaultValue="" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" ref={passwordRef} />
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

### File Inputs (Always Uncontrolled)

```jsx
function FileUpload() {
  const fileInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const file = fileInputRef.current.files[0];
    if (file) {
      console.log('File:', file.name, file.size);
      // Upload file...
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileInputRef} accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  );
}
```

### When to Use Each

```jsx
// ✅ Use CONTROLLED when:
// - You need real-time validation
// - You need to format input as user types
// - You need to conditionally disable submit
// - Multiple inputs depend on each other

// ✅ Use UNCONTROLLED when:
// - Simple forms with no validation
// - File inputs (required)
// - Integration with non-React code
// - Performance is critical (many inputs)
```

---

## Form Validation

### Validation on Submit

```jsx
function ValidationOnSubmit() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Form is valid, submit
    console.log('Submitting:', { email, password });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && (
          <span className="error-text">{errors.password}</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Validation on Blur (Lost Focus)

```jsx
function ValidationOnBlur() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field was already touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      email: validateField('email', values.email),
      password: validateField('password', values.password),
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    // Check if form is valid
    if (!Object.values(newErrors).some((error) => error)) {
      console.log('Form submitted:', values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Real-Time Validation

```jsx
function RealTimeValidation() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Validate immediately
    setIsValid(/\S+@\S+\.\S+/.test(value));
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        style={{ borderColor: email && !isValid ? 'red' : 'green' }}
      />
      {email && !isValid && <p>Please enter a valid email</p>}
      {isValid && <p>✓ Valid email</p>}
    </div>
  );
}
```

### Built-in HTML5 Validation

```jsx
function HTML5Validation() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Browser handles validation
    console.log('Form is valid!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Required field */}
      <input type="text" required placeholder="Required field" />

      {/* Email validation */}
      <input type="email" required placeholder="Email" />

      {/* Min/max length */}
      <input
        type="text"
        minLength={3}
        maxLength={20}
        placeholder="3-20 characters"
      />

      {/* Pattern (regex) */}
      <input
        type="text"
        pattern="[A-Za-z]{3,}"
        title="At least 3 letters"
        placeholder="Letters only"
      />

      {/* Number range */}
      <input type="number" min={0} max={100} placeholder="0-100" />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Multi-Field Forms

### Generic Change Handler

```jsx
function MultiFieldForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  // Single handler for all inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />

      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />

      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />

      <button type="submit">Send</button>
    </form>
  );
}
```

### Using FormData API

```jsx
function FormDataExample() {
  const handleSubmit = (e) => {
    e.preventDefault();

    // FormData collects all form fields automatically
    const formData = new FormData(e.target);

    // Convert to object
    const data = Object.fromEntries(formData);
    console.log(data);

    // Or iterate
    for (const [key, value] of formData) {
      console.log(`${key}: ${value}`);
    }

    // Get specific field
    const email = formData.get('email');

    // Get all values for a field (checkboxes, multiple select)
    const hobbies = formData.getAll('hobbies');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="First Name" />
      <input name="lastName" placeholder="Last Name" />
      <input name="email" type="email" placeholder="Email" />

      <label>
        <input type="checkbox" name="hobbies" value="reading" /> Reading
      </label>
      <label>
        <input type="checkbox" name="hobbies" value="coding" /> Coding
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Resetting Forms

```jsx
function ResettableForm() {
  const initialState = {
    name: '',
    email: '',
    message: '',
  };

  const [formData, setFormData] = useState(initialState);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    handleReset();
  };

  // Reset state
  const handleReset = () => {
    setFormData(initialState);
  };

  // Or reset form element (for uncontrolled)
  const handleResetDOM = () => {
    formRef.current.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
      />

      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
}
```

---

## Custom Form Hooks

### useInput Hook

```jsx
function useInput(initialValue, validate) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const error = touched ? validate(value) : '';
  const isValid = !validate(value);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const reset = () => {
    setValue(initialValue);
    setTouched(false);
  };

  return {
    value,
    error,
    isValid,
    touched,
    handleChange,
    handleBlur,
    reset,
    inputProps: {
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
  };
}

// Usage
function LoginForm() {
  const email = useInput('', (value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email';
    return '';
  });

  const password = useInput('', (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password too short';
    return '';
  });

  const isFormValid = email.isValid && password.isValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log({ email: email.value, password: password.value });
    email.reset();
    password.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="email" placeholder="Email" {...email.inputProps} />
        {email.error && <span>{email.error}</span>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...password.inputProps}
        />
        {password.error && <span>{password.error}</span>}
      </div>

      <button type="submit" disabled={!isFormValid}>
        Login
      </button>
    </form>
  );
}
```

### useForm Hook

```jsx
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    if (validate) {
      const fieldErrors = validate(values);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const getFieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
  };
}

// Usage
function RegistrationForm() {
  const form = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    (values) => {
      const errors = {};
      if (!values.name) errors.name = 'Name is required';
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
      }
      return errors;
    }
  );

  const onSubmit = async (values) => {
    console.log('Submitting:', values);
    // API call here
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <input {...form.getFieldProps('name')} placeholder="Name" />
        {form.touched.name && form.errors.name && (
          <span>{form.errors.name}</span>
        )}
      </div>

      <div>
        <input
          {...form.getFieldProps('email')}
          type="email"
          placeholder="Email"
        />
        {form.touched.email && form.errors.email && (
          <span>{form.errors.email}</span>
        )}
      </div>

      <div>
        <input
          {...form.getFieldProps('password')}
          type="password"
          placeholder="Password"
        />
        {form.touched.password && form.errors.password && (
          <span>{form.errors.password}</span>
        )}
      </div>

      <div>
        <input
          {...form.getFieldProps('confirmPassword')}
          type="password"
          placeholder="Confirm Password"
        />
        {form.touched.confirmPassword && form.errors.confirmPassword && (
          <span>{form.errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Submitting...' : 'Register'}
      </button>
    </form>
  );
}
```

---

## React 19: useActionState

React 19 introduces `useActionState` for handling form actions.

### Basic Usage

```jsx
import { useActionState } from 'react';

async function submitForm(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Validate
  if (!email || !password) {
    return { error: 'All fields are required' };
  }

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate error
  if (email !== 'test@test.com') {
    return { error: 'Invalid credentials' };
  }

  return { success: true, user: { email } };
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null);

  return (
    <form action={formAction}>
      {state?.error && <div className="error">{state.error}</div>}

      {state?.success && (
        <div className="success">Welcome, {state.user.email}!</div>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        disabled={isPending}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        disabled={isPending}
      />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### With Validation

```jsx
async function checkoutAction(prevState, formData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    address: formData.get('address'),
    city: formData.get('city'),
    postalCode: formData.get('postalCode'),
  };

  // Validation
  const errors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!data.city.trim()) {
    errors.city = 'City is required';
  }

  if (!data.postalCode.trim()) {
    errors.postalCode = 'Postal code is required';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: data };
  }

  // Submit to API
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Checkout failed');
    }

    return { success: true, orderId: (await response.json()).orderId };
  } catch (error) {
    return { errors: { form: 'Failed to process order. Please try again.' } };
  }
}

function CheckoutForm() {
  const [formState, formAction, pending] = useActionState(checkoutAction, null);

  if (formState?.success) {
    return (
      <div className="success">
        <h2>Order Confirmed!</h2>
        <p>Order ID: {formState.orderId}</p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {formState?.errors?.form && (
        <div className="form-error">{formState.errors.form}</div>
      )}

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          defaultValue={formState?.values?.name || ''}
        />
        {formState?.errors?.name && (
          <span className="error">{formState.errors.name}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={formState?.values?.email || ''}
        />
        {formState?.errors?.email && (
          <span className="error">{formState.errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          defaultValue={formState?.values?.address || ''}
        />
        {formState?.errors?.address && (
          <span className="error">{formState.errors.address}</span>
        )}
      </div>

      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          defaultValue={formState?.values?.city || ''}
        />
        {formState?.errors?.city && (
          <span className="error">{formState.errors.city}</span>
        )}
      </div>

      <div>
        <label htmlFor="postalCode">Postal Code</label>
        <input
          id="postalCode"
          name="postalCode"
          defaultValue={formState?.values?.postalCode || ''}
        />
        {formState?.errors?.postalCode && (
          <span className="error">{formState.errors.postalCode}</span>
        )}
      </div>

      <button type="submit" disabled={pending}>
        {pending ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```

---

## Best Practices

### 1. Label Your Inputs

```jsx
// ✅ Good - Accessible
<div>
  <label htmlFor="email">Email</label>
  <input id="email" name="email" type="email" />
</div>

// Or wrap input in label
<label>
  Email
  <input name="email" type="email" />
</label>
```

### 2. Show Clear Error States

```jsx
<div className={`form-group ${error ? 'has-error' : ''}`}>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <span id="email-error" className="error" role="alert">
      {error}
    </span>
  )}
</div>
```

### 3. Disable Submit During Submission

```jsx
<button type="submit" disabled={isSubmitting || !isValid}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

### 4. Provide Feedback

```jsx
function FormWithFeedback() {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  if (status === 'success') {
    return <div className="success">Form submitted successfully!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'error' && (
        <div className="error">Something went wrong. Please try again.</div>
      )}
      {/* Form fields */}
    </form>
  );
}
```

### 5. Use Proper Input Types

```jsx
<input type="email" />     {/* Email validation + mobile keyboard */}
<input type="tel" />       {/* Phone keyboard on mobile */}
<input type="url" />       {/* URL validation */}
<input type="number" />    {/* Number keyboard on mobile */}
<input type="date" />      {/* Native date picker */}
<input type="password" />  {/* Hidden characters */}
```

---

## Real-World Example: Complete Registration Form

```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation rules
  const validate = (data) => {
    const errors = {};

    if (!data.username.trim()) {
      errors.username = 'Username is required';
    } else if (data.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/.test(data.password)) {
      errors.password =
        'Password must include uppercase, lowercase, and number';
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!data.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms';
    }

    return errors;
  };

  // Validate on every change
  useEffect(() => {
    setErrors(validate(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field) => {
    return touched[field] && errors[field] ? errors[field] : null;
  };

  const isValid = Object.keys(errors).length === 0;

  if (submitStatus === 'success') {
    return (
      <div className="success">Registration successful! Check your email.</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitStatus === 'error' && (
        <div className="error-banner">
          Registration failed. Please try again.
        </div>
      )}

      <FormField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('username')}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('email')}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('password')}
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('confirmPassword')}
      />

      <div className="checkbox-field">
        <input
          type="checkbox"
          id="agreeToTerms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
        />
        <label htmlFor="agreeToTerms">
          I agree to the Terms and Conditions
        </label>
        {getFieldError('agreeToTerms') && (
          <span className="error">{getFieldError('agreeToTerms')}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}

// Reusable FormField component
function FormField({ label, name, type = 'text', error, ...props }) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${name}-error`} className="error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
```

---

## Summary Cheat Sheet

```jsx
// Controlled Component
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />;

// Uncontrolled Component
const inputRef = useRef();
<input ref={inputRef} defaultValue="" />;
const value = inputRef.current.value;

// Generic handler
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

// FormData API
const handleSubmit = (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
};

// useActionState (React 19)
const [state, formAction, isPending] = useActionState(actionFn, null);
<form action={formAction}>...</form>;
```

---

## Practice Exercises

1. Build a registration form with validation
2. Create a multi-step wizard form
3. Build a dynamic form that adds/removes fields
4. Create a form with dependent dropdowns
5. Implement a search form with debouncing

---

_Next: [09-http-requests.md](./09-http-requests.md)_

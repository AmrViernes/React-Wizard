# 🧙‍♂️ React Wizard Component

A powerful, flexible, dependency free, tiny and type-safe wizard (multi-step form) component for React applications. Built with TypeScript and Context API, compatible with React 16.8+ through React 19.

[![npm version](https://badge.fury.io/js/%40yourscope%2Freact-wizard.svg)](https://www.npmjs.com/package/@yourscope/react-wizard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Key Benefits

### 🎯 **Type-Safe by Design**
Full TypeScript support with generics ensures your wizard data and step IDs are type-checked at compile time, catching errors before runtime.

### 🔄 **Context-Powered State Management**
Built on React Context API, allowing any nested component to access wizard state without prop drilling. Perfect for complex multi-step forms.

### 🚀 **Framework Agnostic**
Works seamlessly with:
- ✅ Pure React (CRA, Vite)
- ✅ Next.js (App Router & Pages Router)
- ✅ Remix
- ✅ Gatsby
- ✅ Any React framework

### 📦 **Lightweight & Tree-Shakeable**
Zero dependencies except React. Only 3KB gzipped. Tree-shakeable ESM exports mean you only bundle what you use.

### 🎨 **Unstyled & Flexible**
Bring your own styles - works with Tailwind, CSS Modules, styled-components, or plain CSS. You have complete control over the UI.

### 🧪 **Testing-Ready**
Built-in `data-testid` attributes make testing with React Testing Library or Cypress a breeze.

### 🌐 **SSR Compatible**
Works perfectly with server-side rendering in Next.js, Remix, and other SSR frameworks.

### ♿ **Accessibility First**
Semantic HTML structure and proper ARIA attributes ensure your wizard is accessible to all users.

---

## 📦 Installation

```bash
npm install @amrviernes/react-wizard
# or
yarn add @amrviernes/react-wizard
# or
pnpm add @amrviernes/react-wizard
# or 
bun add @amrviernes/react-wizard
```

---

## 🚀 Quick Start

```tsx
import { Wizard, WizardStepProps } from '@amrviernes/react-wizard';

// 1. Define your data structure
interface FormData {
  name: string;
  email: string;
  age: number;
}

// 2. Define step IDs
type StepId = 'personal' | 'contact' | 'review';

// 3. Create step components
const PersonalStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  data,
  updateData,
  nextStep,
}) => (
  <div>
    <h2>Personal Information</h2>
    <input
      value={data.name || ''}
      onChange={(e) => updateData({ name: e.target.value })}
      placeholder="Name"
    />
    <input
      type="number"
      value={data.age || ''}
      onChange={(e) => updateData({ age: parseInt(e.target.value) })}
      placeholder="Age"
    />
    <button onClick={nextStep}>Next</button>
  </div>
);

const ContactStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  data,
  updateData,
  nextStep,
  prevStep,
}) => (
  <div>
    <h2>Contact Information</h2>
    <input
      type="email"
      value={data.email || ''}
      onChange={(e) => updateData({ email: e.target.value })}
      placeholder="Email"
    />
    <button onClick={prevStep}>Back</button>
    <button onClick={nextStep}>Next</button>
  </div>
);

const ReviewStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  data,
  prevStep,
}) => (
  <div>
    <h2>Review</h2>
    <p>Name: {data.name}</p>
    <p>Age: {data.age}</p>
    <p>Email: {data.email}</p>
    <button onClick={prevStep}>Back</button>
    <button onClick={() => console.log('Submit:', data)}>Submit</button>
  </div>
);

// 4. Use the Wizard
function App() {
  return (
    <Wizard<FormData, StepId>
      stepMapping={{
        personal: PersonalStep,
        contact: ContactStep,
        review: ReviewStep,
      }}
      initialData={{ name: '', email: '', age: 0 }}
      onStepChange={(stepId, data, index) => {
        console.log(`Step: ${stepId}`, data);
      }}
    />
  );
}
```

---

## 📚 Core Concepts

### The Wizard Component

The main component that orchestrates the multi-step flow:

```tsx
<Wizard<DataType, StepIdType>
  stepMapping={...}      // Map of step IDs to components
  initialData={...}      // Initial wizard data
  onStepChange={...}     // Callback when step changes
  trackSteps={true}      // Enable step tracking events
  data-testid="wizard"   // For testing
/>
```

### Step Components

Each step receives these props automatically:

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Partial<T>` | Current wizard data |
| `updateData` | `(newData: Partial<T>) => void` | Update wizard data |
| `resetData` | `(data?: Partial<T>) => void` | Reset wizard to initial state |
| `nextStep` | `() => void` | Navigate to next step |
| `prevStep` | `() => void` | Navigate to previous step |
| `toStep` | `(stepId: S) => void` | Jump to specific step |
| `step` | `S` | Current step ID |
| `stepIndex` | `number` | Current step index (0-based) |
| `totalSteps` | `number` | Total number of steps |

---

## 🎯 Advanced Usage

### Using the Context Hook

Access wizard state from any nested component:

```tsx
import { useWizardContext } from '@amrviernes/react-wizard';

function ProgressBar() {
  const { stepIndex, totalSteps, step } = useWizardContext<FormData, StepId>();
  
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div>
      <div>Step {stepIndex + 1} of {totalSteps}</div>
      <div style={{ width: `${progress}%`, height: '10px', background: 'blue' }} />
      <div>Current: {step}</div>
    </div>
  );
}

// Use anywhere inside your step components
const MyStep: React.FC<WizardStepProps<FormData, StepId>> = () => (
  <div>
    <ProgressBar />
    {/* rest of your step */}
  </div>
);
```

### Navigation Between Steps

```tsx
const ReviewStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  toStep,
  prevStep,
  data,
}) => (
  <div>
    <h2>Review Your Information</h2>
    
    <section>
      <h3>Personal</h3>
      <p>{data.name}</p>
      <button onClick={() => toStep('personal')}>Edit</button>
    </section>
    
    <section>
      <h3>Contact</h3>
      <p>{data.email}</p>
      <button onClick={() => toStep('contact')}>Edit</button>
    </section>
    
    <button onClick={prevStep}>Back</button>
    <button onClick={handleSubmit}>Submit</button>
  </div>
);
```

### Form Validation

```tsx
const PersonalStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  data,
  updateData,
  nextStep,
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!data.name) newErrors.push('Name is required');
    if (!data.age || data.age < 18) newErrors.push('Must be 18 or older');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div>
      <input
        value={data.name || ''}
        onChange={(e) => updateData({ name: e.target.value })}
      />
      {errors.map((err, i) => <p key={i} style={{ color: 'red' }}>{err}</p>)}
      <button onClick={handleNext}>Next</button>
    </div>
  );
};
```

### Conditional Steps

```tsx
interface FormData {
  userType: 'business' | 'individual';
  businessName?: string;
  personalName?: string;
}

type StepId = 'type' | 'business' | 'individual' | 'review';

const TypeStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  data,
  updateData,
  toStep,
}) => {
  const handleSelection = (type: 'business' | 'individual') => {
    updateData({ userType: type });
    toStep(type); // Jump directly to business or individual step
  };

  return (
    <div>
      <button onClick={() => handleSelection('business')}>Business</button>
      <button onClick={() => handleSelection('individual')}>Individual</button>
    </div>
  );
};
```

### Reset Wizard

```tsx
const FinalStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  resetData,
  data,
}) => {
  const handleSubmit = async () => {
    await api.submit(data);
    alert('Success!');
    resetData(); // Resets to initial data and first step
  };

  const handleStartOver = () => {
    resetData({ name: 'John' }); // Reset with custom data
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleStartOver}>Start Over</button>
    </div>
  );
};
```

---

## 🎨 Framework Examples

### Next.js (App Router)

```tsx
'use client';

import { Wizard, WizardStepProps } from '@amrviernes/react-wizard';

export default function OnboardingPage() {
  const handleStepChange = async (stepId, data, index) => {
    // Save to database
    await fetch('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify({ step: stepId, data }),
    });
  };

  return (
    <Wizard<UserData, OnboardingStep>
      stepMapping={stepMapping}
      onStepChange={handleStepChange}
    />
  );
}
```

### Next.js (Pages Router)

```tsx
import { Wizard } from '@amrviernes/react-wizard';
import { useState } from 'react';

export default function CheckoutPage() {
  return <Wizard<CheckoutData, CheckoutStep> stepMapping={stepMapping} />;
}
```

### Remix

```tsx
import { Wizard, WizardStepProps } from '@amrviernes/react-wizard';
import { useFetcher } from '@remix-run/react';

export default function SignupRoute() {
  const fetcher = useFetcher();

  return (
    <Wizard<SignupData, SignupStep>
      stepMapping={stepMapping}
      onStepChange={(stepId, data) => {
        fetcher.submit(
          { step: stepId, data: JSON.stringify(data) },
          { method: 'post' }
        );
      }}
    />
  );
}
```

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';

const PersonalStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  data,
  updateData,
  nextStep,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: data,
  });

  const onSubmit = (formData: Partial<FormData>) => {
    updateData(formData);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      {errors.name && <span>Name is required</span>}
      <button type="submit">Next</button>
    </form>
  );
};
```

---

## 📊 Tracking & Analytics

The wizard emits custom events when `trackSteps={true}`:

```tsx
// Listen to step changes
useEffect(() => {
  const handleStepChange = (e: CustomEvent) => {
    const { step, stepIndex } = e.detail;
    
    // Google Analytics
    gtag('event', 'wizard_step_change', {
      step_name: step,
      step_index: stepIndex,
    });
    
    // Mixpanel
    mixpanel.track('Wizard Step', {
      step,
      stepIndex,
    });
  };

  window.addEventListener('wizard:step-change', handleStepChange as EventListener);
  
  return () => {
    window.removeEventListener('wizard:step-change', handleStepChange as EventListener);
  };
}, []);

// Enable tracking
<Wizard trackSteps={true} {...props} />
```

Or use the callback:

```tsx
<Wizard
  onStepChange={(stepId, data, index) => {
    analytics.track('Wizard Step Changed', {
      stepId,
      stepIndex: index,
      dataSnapshot: data,
    });
  }}
/>
```

---

## 🧪 Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Wizard } from '@amrviernes/react-wizard';

test('wizard navigates between steps', () => {
  render(
    <Wizard
      stepMapping={stepMapping}
      data-testid="checkout-wizard"
    />
  );

  // Check first step renders
  expect(screen.getByTestId('checkout-wizard-step-personal')).toBeInTheDocument();

  // Click next
  fireEvent.click(screen.getByText('Next'));

  // Check second step renders
  expect(screen.getByTestId('checkout-wizard-step-contact')).toBeInTheDocument();
});

test('wizard updates data', () => {
  const onStepChange = jest.fn();
  
  render(
    <Wizard
      stepMapping={stepMapping}
      onStepChange={onStepChange}
    />
  );

  // Update input
  const input = screen.getByPlaceholderText('Name');
  fireEvent.change(input, { target: { value: 'John' } });

  // Navigate
  fireEvent.click(screen.getByText('Next'));

  // Check callback was called with data
  expect(onStepChange).toHaveBeenCalledWith(
    'contact',
    expect.objectContaining({ name: 'John' }),
    1
  );
});
```

---

## 🎨 Styling Examples

### With Tailwind CSS

```tsx
const PersonalStep: React.FC<WizardStepProps<FormData, StepId>> = ({
  data,
  updateData,
  nextStep,
  stepIndex,
  totalSteps,
}) => (
  <div className="max-w-2xl mx-auto p-6">
    <div className="mb-4 text-sm text-gray-600">
      Step {stepIndex + 1} of {totalSteps}
    </div>
    
    <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
    
    <input
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      value={data.name || ''}
      onChange={(e) => updateData({ name: e.target.value })}
      placeholder="Full Name"
    />
    
    <button
      onClick={nextStep}
      className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Continue
    </button>
  </div>
);
```

### With CSS Modules

```tsx
import styles from './Wizard.module.css';

const PersonalStep: React.FC<WizardStepProps<FormData, StepId>> = (props) => (
  <div className={styles.stepContainer}>
    <div className={styles.progress}>
      Step {props.stepIndex + 1} of {props.totalSteps}
    </div>
    {/* ... */}
  </div>
);
```

---

## 🔧 API Reference

### `<Wizard>` Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `stepMapping` | `Record<S, React.FC<WizardStepProps<T, S>>>` | ✅ Yes | - | Map of step IDs to step components |
| `initialData` | `Partial<T>` | ❌ No | `{}` | Initial data for the wizard |
| `onStepChange` | `(stepId: S, data: Partial<T>, stepIndex: number) => void` | ❌ No | - | Callback fired when step changes |
| `trackSteps` | `boolean` | ❌ No | `false` | Enable step tracking via custom events |
| `data-testid` | `string` | ❌ No | `'wizard'` | Test ID for testing purposes |

### `useWizardContext<T, S>()` Hook

Returns an object with:

```typescript
{
  data: Partial<T>;           // Current wizard data
  step: S;                    // Current step ID
  stepIndex: number;          // Current step index (0-based)
  totalSteps: number;         // Total number of steps
  nextStep: () => void;       // Navigate to next step
  prevStep: () => void;       // Navigate to previous step
  toStep: (stepId: S) => void; // Navigate to specific step
  updateData: (newData: Partial<T>) => void; // Update wizard data
  resetData: (data?: Partial<T>) => void;    // Reset wizard
  trackSteps?: boolean;       // Whether tracking is enabled
}
```

---

## 💡 Best Practices

### 1. **Define Clear Types**
```tsx
// ✅ Good
interface UserData {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
  };
}
type Steps = 'account' | 'profile' | 'review';

// ❌ Avoid
const data: any = {};
```

### 2. **Validate Before Navigation**
```tsx
const handleNext = () => {
  if (isValid(data)) {
    nextStep();
  } else {
    showErrors();
  }
};
```

### 3. **Persist Data**
```tsx
const handleStepChange = (stepId, data, index) => {
  // Save to localStorage
  localStorage.setItem('wizardData', JSON.stringify(data));
  
  // Or save to backend
  await saveProgress(data, stepId);
};
```

### 4. **Use Semantic Step IDs**
```tsx
// ✅ Good
type StepId = 'personal-info' | 'payment-method' | 'review-order';

// ❌ Avoid
type StepId = 'step1' | 'step2' | 'step3';
```

### 5. **Handle Loading States**
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleNext = async () => {
  setIsSubmitting(true);
  await saveData(data);
  setIsSubmitting(false);
  nextStep();
};
```

---

## 🤔 FAQ

**Q: Can I use this with React 16?**  
A: Yes! It works with React 16.8+ (requires Hooks support).

**Q: Does it work with TypeScript?**  
A: Absolutely! It's written in TypeScript with full type definitions.

**Q: Can I style the wizard?**  
A: Yes! The wizard is completely unstyled. Bring your own CSS, Tailwind, styled-components, etc.

**Q: Does it support server-side rendering?**  
A: Yes! It works perfectly with Next.js, Remix, and other SSR frameworks.

**Q: Can I save progress and resume later?**  
A: Yes! Use the `onStepChange` callback to save data to localStorage, database, etc.

**Q: How do I handle async operations?**  
A: Make your step component handlers async and use loading states.

**Q: Can I skip steps conditionally?**  
A: Yes! Use the `toStep()` function to jump to any step based on your logic.

---

## 📄 License

MIT © [Amr El-Desoky]

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/amrviernes/react-wizard/issues) with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

---

## 💖 Support

If you find this package helpful, please:
- ⭐ Star the repository
- 🐦 Share on Twitter
- 📝 Write a blog post about it

---

## 📞 Get in Touch

- GitHub: [@amrviernes](https://github.com/amrviernes)
- Email: amraromoro@hotmail.com

---

**Built with ❤️ for the React community**
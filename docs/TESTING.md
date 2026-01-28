# Testing Guide

This document outlines the testing philosophy, patterns, and practices used in this project.

## Overview

This project uses a comprehensive testing stack:

- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking
- **JSDOM** - Browser environment simulation

## Test Structure

```
src/
├── tests/
│   ├── setup.ts          # Test setup and configuration
│   ├── test-utils.tsx    # Custom render utilities
│   └── mocks/
│       ├── handlers.ts   # MSW request handlers
│       └── server.ts     # MSW server setup
└── features/
    └── auth/
        └── __tests__/
            └── LoginForm.test.tsx
```

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@/tests/test-utils';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders login form with email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
```

### Store Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './auth.store';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState()._reset();
  });

  it('sets user correctly', () => {
    const user = { id: '1', email: 'test@example.com', name: 'Test', role: 'user' as const };
    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
```

### API Tests with MSW

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/mocks/server';

describe('Auth API', () => {
  it('handles login successfully', async () => {
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json({
          success: true,
          data: { user: { id: '1' }, token: 'mock-token' },
        });
      })
    );
    // Test your API call
  });
});
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Avoid testing implementation details
test('calls setUser when button is clicked', () => {
  const setUser = vi.fn();
  render(<LoginForm setUser={setUser} />);
  fireEvent.click(screen.getByRole('button'));
  expect(setUser).toHaveBeenCalled();
});

// ✅ Test user-facing behavior
test('displays error message on failed login', async () => {
  server.use(http.post('/auth/login', () => HttpResponse.error()));
  render(<LoginForm />);
  await user.click(screen.getByRole('button', { name: /login/i }));
  expect(screen.getByText(/login failed/i)).toBeInTheDocument();
});
```

### 2. Use User Event for Interactions

```typescript
import userEvent from '@testing-library/user-event';

test('form submission', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument();
  });
});
```

### 3. Clean Up After Each Test

```typescript
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### 4. Use waitFor for Async Operations

```typescript
import { waitFor } from '@testing-library/react';

test('data is loaded after async operation', async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
  });
});
```

## Custom Test Utilities

### renderWithProviders

Wrap components with all app providers:

```typescript
import { renderWithProviders } from '@/tests/test-utils';

// With providers (default)
renderWithProviders(<Component />);

// Without providers
renderWithProviders(<Component />, { withProviders: false });
```

## MSW Handlers

Define API mocks in `src/tests/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw';
import { config } from '@/config';

export const handlers = [
  http.get(`${config.api.baseURL}/users`, () => {
    return HttpResponse.json({
      success: true,
      data: [{ id: '1', name: 'John' }],
    });
  }),
];
```

## Coverage Thresholds

This project enforces minimum coverage thresholds:

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

Run `npm run test:coverage` to check coverage status.

## CI Integration

Tests run automatically on every commit via Husky pre-commit hooks. CI pipeline also runs full test suite with coverage.

## Troubleshooting

### "Text has no address" Error

This usually means MSW handlers aren't set up correctly. Check that:

1. MSW server is started in `setup.ts`
2. Handlers are defined in `handlers.ts`
3. Server is reset after each test

### Tests Timeout

Increase timeout for async operations:

```typescript
test('async operation', async () => {
  await waitFor(() => expect(result).toBeTruthy(), { timeout: 5000 });
});
```

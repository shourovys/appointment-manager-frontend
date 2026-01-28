# Contributing Guide

Thank you for your interest in contributing to this project! This guide will help you get started with contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Code Review Checklist](#code-review-checklist)

---

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and diverse perspectives
- **Be constructive**: Provide helpful feedback and suggestions
- **Be professional**: Maintain a professional tone in all interactions

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or derogatory remarks
- Publishing private information without consent
- Any other conduct that would be inappropriate in a professional setting

---

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x (LTS)
- npm 10.x or later
- Git

### Setting Up Your Development Environment

1. **Fork the repository**

   Click the "Fork" button on the repository page to create your own fork.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/react-starter.git
   cd react-starter
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/react-starter.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Create a feature branch**

   ```bash
   git checkout -b feat/my-new-feature
   ```

---

## Development Workflow

### 1. Sync with upstream

Before starting work, ensure your fork is up to date:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create a feature branch

```bash
git checkout -b feat/your-feature-name
```

### 3. Make your changes

Implement your feature or fix following the coding standards below.

### 4. Run tests

```bash
# Run all tests
npm run test:run

# Run with coverage
npm run test:coverage
```

### 5. Run linting

```bash
# Check for errors
npm run lint

# Auto-fix errors
npm run lint:fix
```

### 6. Format code

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### 7. Commit your changes

Follow the commit guidelines below.

### 8. Push to your fork

```bash
git push origin feat/your-feature-name
```

### 9. Create a Pull Request

Open a pull request against the main branch.

---

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- Avoid `any` types - use `unknown` when appropriate
- Use proper type annotations
- Export types that are used externally

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Avoid
interface User {
  id: any;
  name: any;
  email: any;
}
```

### React Components

- Use functional components with hooks
- Use proper TypeScript typing
- Use proper component naming (PascalCase)
- Keep components small and focused

```typescript
// Good
export function LoginForm(): React.ReactElement {
  const { login } = useAuth();
  return <form onSubmit={login}>...</form>;
}

// Avoid
function loginForm() {
  // ...
}
```

### File Organization

- One component per file
- Use index.ts files for barrel exports
- Keep related files together in feature directories

### Routing Conventions

When adding new routes:

1. **Create feature route files**: Place route definitions in `src/features/[feature]/routes/[feature].routes.ts`

2. **Define route constants**: Use constants for route paths:

   ```typescript
   export const FEATURE_LINKS = {
     NEW_PAGE: '/new-page',
   };
   ```

3. **Export route array**: Export routes as `FEATURE_ROUTES: RouteConfig[]`

4. **Import into central config**: Add `...FEATURE_ROUTES` to `src/config/routes.ts`

5. **Set authentication requirements**: Use the `auth` property with one of:
   - `'public'`: Accessible to all users
   - `'guest'`: Only for unauthenticated users (redirects authenticated users)
   - `'authenticated'`: Requires user authentication

6. **Use lazy loading**: Always use `React.lazy()` for components

7. **Use proper element typing**: Set `element` to `React.lazy(() => import('...'))` for lazy components

Example:

```typescript
// src/features/new-feature/routes/new-feature.routes.ts
import React, { lazy } from 'react';

import type { RouteConfig } from '@/types/route.types';

export const NEW_FEATURE_LINKS = {
  DASHBOARD: '/dashboard',
};

export const NEW_FEATURE_ROUTES: RouteConfig[] = [
  {
    path: NEW_FEATURE_LINKS.DASHBOARD,
    element: React.lazy(() => import('../pages/DashboardPage')),
    name: 'Dashboard',
    auth: 'authenticated',
  },
];
```

### Naming Conventions

| Item       | Convention       | Example           |
| ---------- | ---------------- | ----------------- |
| Components | PascalCase       | `LoginForm.tsx`   |
| Hooks      | camelCase        | `useAuth.ts`      |
| Services   | camelCase        | `auth.service.ts` |
| Stores     | camelCase        | `auth.store.ts`   |
| Types      | PascalCase       | `AuthTypes.ts`    |
| Constants  | UPPER_SNAKE_CASE | `API_TIMEOUT`     |
| Variables  | camelCase        | `isLoading`       |

### Imports

```typescript
// Group imports
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External libraries
import { useQuery } from 'swr';
import { z } from 'zod';

// 3. Absolute imports (aliases)
import { useAuth } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';

// 4. Relative imports
import { authService } from '../services/auth.service';
```

---

## Commit Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                         |
| ---------- | --------------------------------------------------- |
| `feat`     | A new feature                                       |
| `fix`      | A bug fix                                           |
| `docs`     | Documentation only changes                          |
| `style`    | Formatting, missing semicolons, etc                 |
| `refactor` | Code change that neither fixes bug nor adds feature |
| `perf`     | Code change that improves performance               |
| `test`     | Adding or modifying tests                           |
| `chore`    | Build process, dependencies, etc                    |
| `revert`   | Revert a previous commit                            |
| `ci`       | Changes to CI configuration                         |
| `build`    | Changes that affect the build system                |

### Examples

```
feat(auth): add user login functionality

feat: add user login functionality

fix: resolve header alignment issue

docs: update API documentation

refactor(auth): simplify login form validation

perf: improve data fetching performance

test(auth): add login form tests

chore: update dependencies
```

### Scope

Scopes are optional but recommended for larger features:

- `auth` - Authentication related
- `ui` - UI/components related
- `api` - API/data layer related
- `config` - Configuration related
- `docs` - Documentation related

---

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**

   ```bash
   npm run test:run
   ```

2. **Ensure no linting errors**

   ```bash
   npm run lint
   ```

3. **Ensure code is formatted**

   ```bash
   npm run format
   ```

4. **Update documentation**

   If your changes affect the API or behavior, update the relevant documentation.

5. **Write a clear PR description**
   - Explain what you changed and why
   - Link to any related issues
   - Provide screenshots for UI changes
   - List breaking changes if any

### PR Title

Use the same format as commit messages:

```
feat(auth): add user login functionality
fix(ui): resolve button alignment issue
```

### Review Process

1. A maintainer will review your PR
2. You may be asked to make changes
3. Once approved, your PR will be merged

### After Merging

1. Delete your feature branch
2. Sync your fork with upstream

---

## Testing Requirements

### Unit Tests

- All new features should include unit tests
- Bug fixes should include regression tests
- Aim for 80% code coverage for new code

### Component Tests

- Test component rendering
- Test user interactions
- Test error states
- Test loading states

### Testing Library Best Practices

```typescript
// Good - Test user behavior, not implementation
it('should login user with valid credentials', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});

// Avoid - Testing implementation details
it('should call login API', () => {
  const spy = jest.spyOn(authService, 'login');
  // ...
});
```

---

## Code Review Checklist

### General

- [ ] Code follows the project's coding standards
- [ ] No console.log or debug statements left in code
- [ ] No commented-out code
- [ ] Code is self-documenting or has comments

### TypeScript

- [ ] No implicit `any` types
- [ ] Proper TypeScript typing
- [ ] Types are exported when needed

### React

- [ ] Components are properly typed
- [ ] Hooks follow naming conventions (use prefix)
- [ ] No unnecessary re-renders (proper dependencies)

### Testing

- [ ] Tests are meaningful
- [ ] Tests pass locally
- [ ] Tests cover edge cases

### Git

- [ ] Commit messages follow conventions
- [ ] Commits are atomic (one purpose per commit)
- [ ] No unnecessary files committed

---

## Questions?

If you have questions, feel free to open an issue for discussion or reach out to the maintainers.

---

Thank you for contributing! 🎉

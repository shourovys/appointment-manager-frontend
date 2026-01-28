# Enterprise React + Vite + TypeScript Frontend Starter

A production-grade React frontend foundation from scratch with enterprise-ready architecture, strict quality gates, and modular scalability.

## 🚀 Tech Stack

- **React 19** - Latest React with concurrent features
- **Vite 7** - Fast build tool and dev server
- **TypeScript 5** - Strict type safety
- **Tailwind CSS 4** - Utility-first CSS with shadcn/ui
- **Zustand 5** - Lightweight state management
- **SWR 2** - Data fetching and caching
- **Axios** - HTTP client with interceptors
- **Vitest** - Fast unit testing
- **Testing Library** - Component testing
- **MSW** - API mocking
- **React Router 7** - Client-side routing
- **Zod** - Environment validation
- **ESLint + Prettier** - Code quality and formatting
- **Husky + lint-staged** - Git hooks
- **commitlint** - Conventional commits

## 📦 Features

### Architecture

- Feature-based modular architecture
- Clean separation of concerns
- Path aliases for clean imports
- Strict TypeScript configuration
- Environment validation with Zod
- Auth-based routing system with clear access controls

### Data Layer

- Centralized Axios instance with interceptors
- Request/response logging and error handling
- SWR global configuration for data fetching
- Typed API responses

### State Management

- Zustand stores with persistence
- Typed selectors for optimal performance
- Feature-scoped store architecture
- DevTools integration

### UI/UX

- Tailwind CSS with design tokens
- shadcn/ui component library
- Dark mode support
- Responsive design
- Loading states and error boundaries

### Testing

- Vitest with coverage thresholds
- Testing Library for components
- MSW for API mocking
- Test utilities and helpers

### Quality Assurance

- Strict ESLint rules
- Prettier formatting
- Husky pre-commit hooks
- Conventional commit messages

### Performance

- Route-based code splitting
- Lazy loading with Suspense
- Bundle analyzer
- Vendor chunk optimization

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or 20.x (LTS)
- npm 10.x or later

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-starter

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

| Command                 | Description               |
| ----------------------- | ------------------------- |
| `npm run dev`           | Start development server  |
| `npm run build`         | Build for production      |
| `npm run lint`          | Run ESLint                |
| `npm run lint:fix`      | Fix ESLint errors         |
| `npm run format`        | Format code with Prettier |
| `npm run format:check`  | Check formatting          |
| `npm run preview`       | Preview production build  |
| `npm run test`          | Run tests in watch mode   |
| `npm run test:ui`       | Run tests with UI         |
| `npm run test:run`      | Run tests in CI mode      |
| `npm run test:coverage` | Run tests with coverage   |
| `npm run prepare`       | Set up Husky git hooks    |

## 📁 Project Structure

```
src/
├── app/                    # Application entry point
│   ├── App.tsx            # Root component with routing
│   ├── AuthGuard.tsx      # Authentication guard component
│   ├── providers.tsx      # Context providers
│   ├── UnauthorizedRoute.tsx # Unauthorized route handler
│   └── main.tsx           # Entry point
├── assets/                # Static assets
├── components/            # Shared components
│   ├── ui/               # shadcn/ui components
│   ├── ErrorBoundary.tsx     # Error boundary
│   ├── ErrorBoundary.test.tsx
│   └── LoadingFallback.tsx   # Loading fallback component
├── config/                # Configuration
│   ├── env.ts            # Environment validation
│   ├── index.ts          # Config exports
│   └── routes.ts         # Route configuration
├── features/              # Feature modules
│   └── auth/             # Auth feature example
│       ├── components/   # Feature components
│       ├── hooks/        # Feature hooks
│       ├── pages/        # Feature pages
│       ├── services/     # API services
│       ├── store/        # Zustand store
│       └── auth.types.ts # Feature types
├── hooks/                 # Shared hooks
├── lib/                   # Utilities
│   ├── error.ts          # Error handling
│   ├── logger.ts         # Logging utility
│   ├── serverErrorHandler.ts # Server error handler
│   ├── swr-config.ts     # SWR configuration
│   └── utils.ts          # Helper functions
├── services/              # API services
│   ├── api-client.ts     # API client wrapper
│   └── axios.ts          # Axios instance
├── stores/                # Global stores
├── styles/                # Global styles
│   └── index.css         # Tailwind imports
├── tests/                 # Test setup
│   ├── mocks/            # MSW handlers
│   ├── setup.ts          # Test setup
│   └── test-utils.tsx    # Test utilities
└── types/                 # TypeScript types
    ├── api.types.ts      # API types
    ├── env.d.ts          # Environment types
    ├── error.types.ts    # Error types
    ├── global.d.ts       # Global declarations
    ├── index.ts          # Type exports
    ├── route.types.ts    # Route types
    └── store.types.ts    # Store types
```

## 🔧 Configuration

### TypeScript

The project uses strict TypeScript configuration with the following settings:

- `strict: true` - Enable all strict type checking options
- `noImplicitAny: true` - Disallow implicit `any` types
- `strictNullChecks: true` - Enable strict null checks
- `noUnusedLocals: true` - Report unused local variables
- `noUnusedParameters: true` - Report unused parameters

### Path Aliases

The project uses path aliases for clean imports:

| Alias          | Path              |
| -------------- | ----------------- |
| `@`            | `src/`            |
| `@/app`        | `src/app/`        |
| `@/features`   | `src/features/`   |
| `@/components` | `src/components/` |
| `@/hooks`      | `src/hooks/`      |
| `@/services`   | `src/services/`   |
| `@/stores`     | `src/stores/`     |
| `@/lib`        | `src/lib/`        |
| `@/styles`     | `src/styles/`     |
| `@/types`      | `src/types/`      |
| `@/config`     | `src/config/`     |
| `@/tests`      | `src/tests/`      |

### Environment Variables

Required environment variables are validated at runtime using Zod:

```typescript
// .env.example
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
VITE_APP_ENV=development
```

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) - Detailed architecture documentation
- [Testing](docs/TESTING.md) - Testing guide and patterns
- [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines

## 🔒 Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools
- `revert`: Reverts a previous commit
- `ci`: Changes to CI configuration
- `build`: Changes that affect the build system

## 🧪 Testing

### Writing Tests

```typescript
// Example component test
import { render, screen } from '@/tests/test-utils';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run tests with UI
npm run test:ui

# Run tests in CI mode
npm run test:run

# Run with coverage
npm run test:coverage
```

## 📈 Performance

### Bundle Analysis

Generate a bundle report to analyze chunk sizes:

```bash
npm run build
# Open dist/bundle-report.html
```

### Code Splitting

Routes are automatically code-split using React.lazy:

```typescript
const LoginPage = React.lazy(() => import('@/features/auth/pages/LoginPage'));
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -am 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React](https://react.dev/) - The library for web and native user interfaces
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - Bear necessities for state management
#   a p p o i n t m e n t - m a n a g e r - f r o n t e n d  
 
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { render, screen, waitFor } from '@/tests/test-utils';

// Mock the logger to prevent console noise during tests
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Error throwing component for testing
function ErrorThrowingComponent({
  shouldThrow = true,
}: {
  shouldThrow?: boolean;
}): React.ReactElement {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-content">Child Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('catches errors and shows fallback UI', async () => {
    await userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('shows error message in fallback UI', async () => {
    await userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  it('renders custom fallback when provided', async () => {
    await userEvent.setup();

    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error UI</div>}>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });
  });

  it('shows reload button in fallback', async () => {
    await userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    });
  });

  it('logs error to logger when caught', async () => {
    const { logger } = await import('@/lib/logger');

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });
  });
});

describe('Error Handling Integration', () => {
  it('handles API error normalization', async () => {
    const { normalizeError } = await import('@/lib/error');
    const { ErrorType } = await import('@/types/error.types');

    const apiError = {
      message: 'Invalid credentials',
      code: 'AUTH_ERROR',
      status: 401,
    };

    const normalized = normalizeError(apiError);

    expect(normalized.message).toBe('Invalid credentials');
    expect(normalized.type).toBe(ErrorType.AUTH);
    expect(normalized.statusCode).toBe(401);
    expect(normalized.timestamp).toBeDefined();
  });

  it('handles standard error normalization', async () => {
    const { normalizeError } = await import('@/lib/error');
    const { ErrorType } = await import('@/types/error.types');

    const standardError = new Error('Something went wrong');
    const normalized = normalizeError(standardError);

    expect(normalized.message).toBe('Something went wrong');
    expect(normalized.type).toBe(ErrorType.UNKNOWN);
    expect(normalized.timestamp).toBeDefined();
  });

  it('handles unknown error normalization', async () => {
    const { normalizeError } = await import('@/lib/error');
    const { ErrorType } = await import('@/types/error.types');

    const normalized = normalizeError(null);

    expect(normalized.message).toBe('An unknown error occurred');
    expect(normalized.type).toBe(ErrorType.UNKNOWN);
    expect(normalized.timestamp).toBeDefined();
  });

  it('maps HTTP status codes to correct error types', async () => {
    const { normalizeError } = await import('@/lib/error');
    const { ErrorType } = await import('@/types/error.types');

    // 401 - Auth error
    const authError = normalizeError({
      message: 'Unauthorized',
      code: 'UNAUTHORIZED',
      status: 401,
    });
    expect(authError.type).toBe(ErrorType.AUTH);

    // 404 - Not found
    const notFoundError = normalizeError({ message: 'Not found', code: 'NOT_FOUND', status: 404 });
    expect(notFoundError.type).toBe(ErrorType.NOT_FOUND);

    // 422 - Validation error
    const validationError = normalizeError({
      message: 'Invalid data',
      code: 'VALIDATION',
      status: 422,
    });
    expect(validationError.type).toBe(ErrorType.VALIDATION);

    // 500 - Server error
    const serverError = normalizeError({
      message: 'Server error',
      code: 'SERVER_ERROR',
      status: 500,
    });
    expect(serverError.type).toBe(ErrorType.SERVER);

    // 0 or network error
    const networkError = normalizeError({ message: 'Network error', code: 'NETWORK', status: 0 });
    expect(networkError.type).toBe(ErrorType.NETWORK);
  });
});

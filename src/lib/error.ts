import type { ApiError } from '../types/api.types';
import { ErrorType, type AppError } from '../types/error.types';

export function normalizeError(error: unknown): AppError {
  const timestamp = new Date().toISOString();

  // Handle API errors
  if (isApiError(error)) {
    return {
      name: 'AppError',
      message: error.message,
      type: mapStatusToErrorType(error.status),
      code: error.code,
      statusCode: error.status,
      details: error.details,
      timestamp,
    };
  }

  // Handle standard errors
  if (error instanceof Error) {
    return {
      name: 'AppError',
      message: error.message,
      type: ErrorType.UNKNOWN,
      timestamp,
    };
  }

  // Handle unknown errors
  return {
    name: 'AppError',
    message: 'An unknown error occurred',
    type: ErrorType.UNKNOWN,
    timestamp,
  };
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error &&
    'status' in error
  );
}

function mapStatusToErrorType(status: number): ErrorType {
  if (status >= 400 && status < 500) {
    if (status === 401 || status === 403) return ErrorType.AUTH;
    if (status === 404) return ErrorType.NOT_FOUND;
    return ErrorType.VALIDATION;
  }
  if (status >= 500) return ErrorType.SERVER;
  return ErrorType.NETWORK;
}

import { AxiosError } from 'axios';

import type { ApiError } from '@/types/api.types';

import { logger } from './logger';

// Generic Error Handler for Server-Side Validation Errors
const serverErrorHandler = (error: AxiosError<ApiError>): void => {
  if (error.response && error.response.data) {
    // log the error
    logger.error(error.response.data.message);

    const { data } = error.response;
    console.log('🚀 ~ serverErrorHandler => error.response data:', data);
  } else {
    // Handle cases where the response is missing
    console.error('Error without response:', error);
    // Optionally show a generic error message
    // warningToast('Something went wrong. Please try again.');
  }
};

export default serverErrorHandler;

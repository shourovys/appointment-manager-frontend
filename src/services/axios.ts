import axios, { type AxiosError, type AxiosResponse } from 'axios';

import { config } from '@/config';
import { normalizeError } from '@/lib/error';
import { logger } from '@/lib/logger';
import type { ApiError, ApiResponse } from '@/types/api.types';

export const axiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add request tracing
    const requestId = crypto.randomUUID();
    config.headers['X-Request-ID'] = requestId;

    // Add authorization token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      requestId,
    });

    return config;
  },
  (error) => {
    logger.error('API Request failed', error as Error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const requestId = response.config.headers['X-Request-ID'];

    logger.debug('API Response', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      requestId,
    });

    return response;
  },
  (error: AxiosError<ApiError>) => {
    const requestId = error.config?.headers?.['X-Request-ID'];

    logger.error('API Error', error as Error, {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      requestId,
      responseData: error.response?.data,
    });

    // const normalizedError: ApiError = {
    //   message: error.response?.data?.message || error.message,
    //   code: error.response?.data?.code || 'UNKNOWN_ERROR',
    //   status: error.response?.status || 500,
    //   details: error.response?.data?.details,
    // };

    return Promise.reject(normalizeError(error));
  }
);

export default axiosInstance;

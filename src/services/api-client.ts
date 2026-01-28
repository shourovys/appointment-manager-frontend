import type { ApiResponse } from '@/types/api.types';

import axiosInstance from './axios';

export const apiClient = {
  get: <T>(url: string, config = {}) => axiosInstance.get<ApiResponse<T>>(url, config),

  post: <T>(url: string, data?: unknown, config = {}) =>
    axiosInstance.post<ApiResponse<T>>(url, data, config),

  put: <T>(url: string, data?: unknown, config = {}) =>
    axiosInstance.put<ApiResponse<T>>(url, data, config),

  patch: <T>(url: string, data?: unknown, config = {}) =>
    axiosInstance.patch<ApiResponse<T>>(url, data, config),

  delete: <T>(url: string, config = {}) => axiosInstance.delete<ApiResponse<T>>(url, config),
};

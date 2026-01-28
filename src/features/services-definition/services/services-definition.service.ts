import { apiClient } from '@/services/api-client';

import type {
  CreateServiceRequest,
  ServiceDefinition,
  UpdateServiceRequest,
} from '../services-definition.types';

/**
 * Services Definition service for API calls
 * Provides typed methods for all services definition operations
 */
export const servicesDefinitionService = {
  /**
   * Get all service definitions
   */
  getServices: async (): Promise<ServiceDefinition[]> => {
    const response = await apiClient.get<ServiceDefinition[]>('/services-definition');
    return response.data.data;
  },

  /**
   * Create a new service definition
   */
  createService: async (data: CreateServiceRequest): Promise<ServiceDefinition> => {
    const response = await apiClient.post<ServiceDefinition>('/services-definition', data);
    return response.data.data;
  },

  /**
   * Update a service definition
   */
  updateService: async (id: string, data: UpdateServiceRequest): Promise<ServiceDefinition> => {
    const response = await apiClient.put<ServiceDefinition>(`/services-definition/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a service definition
   */
  deleteService: async (id: string): Promise<void> => {
    await apiClient.delete(`/services-definition/${id}`);
  },
};

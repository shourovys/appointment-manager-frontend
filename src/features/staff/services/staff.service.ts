import { apiClient } from '@/services/api-client';

import type { CreateStaffRequest, Staff, UpdateStaffRequest } from '../staff.types';

/**
 * Staff service for API calls
 * Provides typed methods for all staff operations
 */
export const staffService = {
  /**
   * Get all staff members
   */
  getStaff: async (): Promise<Staff[]> => {
    const response = await apiClient.get<Staff[]>('/staff');
    return response.data.data;
  },

  /**
   * Create a new staff member
   */
  createStaff: async (data: CreateStaffRequest): Promise<Staff> => {
    const response = await apiClient.post<Staff>('/staff', data);
    return response.data.data;
  },

  /**
   * Update a staff member
   */
  updateStaff: async (id: string, data: UpdateStaffRequest): Promise<Staff> => {
    const response = await apiClient.put<Staff>(`/staff/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a staff member
   */
  deleteStaff: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  },
};

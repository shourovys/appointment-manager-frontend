import { apiClient } from '@/services/api-client';

import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '../appointments.types';

/**
 * Appointments service for API calls
 * Provides typed methods for all appointment operations
 */
export const appointmentsService = {
  /**
   * Get all appointments with optional filters
   */
  getAppointments: async (filters?: {
    date?: string;
    staffId?: string;
    status?: string;
  }): Promise<Appointment[]> => {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.staffId) params.append('staffId', filters.staffId);
    if (filters?.status) params.append('status', filters.status);

    const url = `/appointments${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<Appointment[]>(url);
    return response.data.data;
  },

  /**
   * Create a new appointment
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data.data;
  },

  /**
   * Update an appointment
   */
  updateAppointment: async (id: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete an appointment
   */
  deleteAppointment: async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
  },

  /**
   * Update appointment status
   */
  updateAppointmentStatus: async (
    id: string,
    status: Appointment['status']
  ): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status });
    return response.data.data;
  },

  /**
   * Get waiting queue
   */
  getQueue: async (): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/appointments/queue');
    return response.data.data;
  },

  /**
   * Assign from queue to staff
   */
  assignFromQueue: async (staffId: string): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(`/appointments/queue/assign/${staffId}`);
    return response.data.data;
  },
};

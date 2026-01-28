import { apiClient } from '@/services/api-client';

export interface DashboardStats {
  totalAppointments: number;
  completed: number;
  pending: number;
  waitingQueueCount: number;
}

export interface StaffLoad {
  staffId: string;
  name: string;
  current: number;
  max: number;
  status: 'Available' | 'On Leave';
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  appointmentId: string;
  staffId: string;
  timestamp: string;
  userId: string;
}

/**
 * Dashboard service for API calls
 */
export const dashboardService = {
  /**
   * Get dashboard stats
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<{ todayStats: DashboardStats; staffLoad: StaffLoad[] }>(
      '/dashboard/stats'
    );
    return response.data.data.todayStats;
  },

  /**
   * Get staff load
   */
  getStaffLoad: async (): Promise<StaffLoad[]> => {
    const response = await apiClient.get<StaffLoad[]>('/dashboard/staff-load');
    return response.data.data;
  },

  /**
   * Get activity logs
   */
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    const response = await apiClient.get<ActivityLog[]>('/activity-logs');
    return response.data.data;
  },
};

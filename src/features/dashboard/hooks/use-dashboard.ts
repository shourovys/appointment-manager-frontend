import useSWR from 'swr';

import type { ActivityLog, DashboardStats, StaffLoad } from '../services/dashboard.service';
import { dashboardService } from '../services/dashboard.service';

/**
 * Hook for fetching dashboard stats
 */
export function useDashboardStats(): {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: unknown;
} {
  const { data, error, isLoading } = useSWR<DashboardStats>(
    '/dashboard/stats',
    dashboardService.getStats,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    stats: data || null,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching staff load
 */
export function useStaffLoad(): {
  staffLoad: StaffLoad[];
  isLoading: boolean;
  error: unknown;
} {
  const { data, error, isLoading } = useSWR<StaffLoad[]>(
    '/dashboard/staff-load',
    dashboardService.getStaffLoad,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    staffLoad: data || [],
    isLoading,
    error,
  };
}

/**
 * Hook for fetching activity logs
 */
export function useActivityLogs(): {
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: unknown;
} {
  const { data, error, isLoading } = useSWR<ActivityLog[]>(
    '/activity-logs',
    dashboardService.getActivityLogs,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    activityLogs: data || [],
    isLoading,
    error,
  };
}

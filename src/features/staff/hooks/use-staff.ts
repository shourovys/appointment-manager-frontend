import useSWR from 'swr';

import { staffService } from '../services/staff.service';
import type { Staff } from '../staff.types';

/**
 * Hook for fetching staff data
 */
export function useStaff(): {
  staff: Staff[];
  isLoading: boolean;
  error: unknown;
  mutate: (
    data?: Staff[] | Promise<Staff[]> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<Staff[] | undefined>;
} {
  const { data, error, isLoading, mutate } = useSWR<Staff[]>('/staff', staffService.getStaff, {
    revalidateOnFocus: false,
  });

  return {
    staff: data || [],
    isLoading,
    error,
    mutate,
  };
}

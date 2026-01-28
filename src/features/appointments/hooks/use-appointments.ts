import useSWR from 'swr';

import type { Appointment } from '../appointments.types';
import { appointmentsService } from '../services/appointments.service';

/**
 * Hook for fetching appointments data
 */
export function useAppointments(filters?: { date?: string; staffId?: string; status?: string }): {
  appointments: Appointment[];
  isLoading: boolean;
  error: unknown;
  mutate: (
    data?: Appointment[] | Promise<Appointment[]> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<Appointment[] | undefined>;
} {
  const key = filters ? ['/appointments', filters] : null;

  const { data, error, isLoading, mutate } = useSWR<Appointment[]>(
    key,
    () => appointmentsService.getAppointments(filters),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    appointments: data || [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook for fetching queue data
 */
export function useQueue(): {
  queue: Appointment[];
  isLoading: boolean;
  error: unknown;
  mutate: (
    data?: Appointment[] | Promise<Appointment[]> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<Appointment[] | undefined>;
} {
  const { data, error, isLoading, mutate } = useSWR<Appointment[]>(
    '/appointments/queue',
    () => appointmentsService.getQueue(),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    queue: data || [],
    isLoading,
    error,
    mutate,
  };
}

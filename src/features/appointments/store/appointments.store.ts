import { create } from 'zustand';

type AppointmentsState = Record<string, never>; // Empty for now

type AppointmentsActions = Record<string, never>; // Empty for now

type AppointmentsStore = AppointmentsState & AppointmentsActions;

export const useAppointmentsStore = create<AppointmentsStore>(() => ({
  // Initial state
}));

// Selectors
export const appointmentsSelectors = {
  // Add selectors if needed
};

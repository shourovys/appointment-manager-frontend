import { create } from 'zustand';

type StaffState = Record<string, never>; // Empty for now

type StaffActions = Record<string, never>; // Empty for now

type StaffStore = StaffState & StaffActions;

export const useStaffStore = create<StaffStore>(() => ({
  // Initial state
}));

// Selectors
export const staffSelectors = {
  // Add selectors if needed
};

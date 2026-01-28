import { create } from 'zustand';

type ServicesDefinitionState = Record<string, never>; // Empty for now

type ServicesDefinitionActions = Record<string, never>; // Empty for now

type ServicesDefinitionStore = ServicesDefinitionState & ServicesDefinitionActions;

export const useServicesDefinitionStore = create<ServicesDefinitionStore>(() => ({
  // Initial state
}));

// Selectors
export const servicesDefinitionSelectors = {
  // Add selectors if needed
};

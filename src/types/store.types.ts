/**
 * Generic type for store selectors
 * @example
 * const selectUser = (state: AuthState) => state.user;
 */
export type StoreSelector<T, U> = (state: T) => U;

/**
 * Base interface for all stores in the application
 * Provides a common reset method for testing and state management
 */
export interface BaseStore {
  /**
   * Resets the store to its initial state
   * Useful for testing and logout flows
   */
  _reset: () => void;
}

/**
 * Utility type to extract the state type from a Zustand store
 */
export type StoreState<T> = T extends { getState: () => infer S } ? S : never;

/**
 * Utility type to extract the actions from a Zustand store
 */
export type StoreActions<T> = T extends { setState: infer A } ? A : never;

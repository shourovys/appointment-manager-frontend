import { useAuthStore, type User } from './auth.store';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState()._reset();
  });

  it('should have correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set user correctly', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test',
      role: 'user',
    };

    useAuthStore.getState().setUser(user);

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should clear user correctly', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test',
      role: 'user',
    };

    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().clearUser();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('should set loading state correctly', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);

    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('should set error state correctly', () => {
    const errorMessage = 'Login failed';

    useAuthStore.getState().setError(errorMessage);

    expect(useAuthStore.getState().error).toBe(errorMessage);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('should reset to initial state', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test',
      role: 'user',
    };

    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().setError('Some error');

    useAuthStore.getState()._reset();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});

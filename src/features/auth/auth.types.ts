/**
 * User interface for authentication
 */
export interface User {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  user: User;
  access_token: string;
}

/**
 * Registration request interface
 */
export interface RegisterRequest extends LoginCredentials {
  name: string;
}

/**
 * Password reset request interface
 */
export interface PasswordResetRequest {
  email: string;
}

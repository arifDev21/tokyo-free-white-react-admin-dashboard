import { apiService } from './api';
import { LoginRequest, LoginResponse, User } from '../types/auth';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = (await apiService.login(
        credentials.username,
        credentials.password
      )) as LoginResponse;

      if (response.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async register(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = (await apiService.register(
        credentials.username,
        credentials.password
      )) as LoginResponse;

      if (response.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      await apiService.verifyToken();
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }
}

export const authService = new AuthService();
export default authService;

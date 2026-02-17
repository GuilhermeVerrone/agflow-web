import { User, Tenant } from './api';

export interface LoginRequest {
  email: string;
  password: string;
  tenantId: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  tenantId: string;
  role?: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  user: User & { tenant: Tenant };
  access_token: string;
}

export interface AuthUser extends User {
  tenant: Tenant;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  features: string[]; // Códigos das features habilitadas
}

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { AuthUser, LoginRequest, RegisterRequest } from '@/types';

interface AuthContextData {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasFeature: (featureCode: string) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica se tem usuário no localStorage ao montar
    const storedUser = authService.getStoredUser();
    const token = authService.getToken();

    if (storedUser && token) {
      setUser(storedUser);
      // Opcional: revalida o token com o backend
      authService.getProfile()
        .then((profile) => setUser(profile))
        .catch(() => {
          // Token inválido, faz logout
          authService.logout();
          setUser(null);
        });
    }

    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setUser(response.user);
    router.push('/dashboard');
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.user);
    router.push('/dashboard');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasFeature = (featureCode: string): boolean => {
    if (!user?.tenant) return false;
    // Verifica se o tenant tem a feature habilitada
    // Nota: o backend deve retornar as features no user.tenant
    // Por enquanto, retorna true para todas
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        hasFeature,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

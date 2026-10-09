import { createContext, useContext, useState, type ReactNode } from 'react';
import { api, STORAGE_KEY } from '../api/client';
import type { AuthUser, LoginResponse, Role } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/login', { email, password });
    const authUser: AuthUser = {
      token: data.token,
      userId: data.userId,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// Where each role lands after login
export function homeFor(role: Role): string {
  return role === 'ADMIN' ? '/users/new' : '/workshops';
}
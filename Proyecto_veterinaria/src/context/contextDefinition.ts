import { createContext } from 'react';
import type { SessionUser } from '../types/auth';

export interface AuthState {
  user: SessionUser | null;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

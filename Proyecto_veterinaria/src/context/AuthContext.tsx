import { useState, type ReactNode } from 'react';
import { AuthContext, type AuthState } from './contextDefinition';
import {
  authenticate,
  clearSession,
  getStoredSession,
  saveSession,
} from '../services/authService';

function getInitialState(): AuthState {
  try {
    return { user: getStoredSession(), error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'No se pudo recuperar la sesión.',
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(getInitialState);

  const signIn = (email: string, password: string): boolean => {
    const user = authenticate(email, password);
    if (!user) {
      setState((current) => ({ ...current, error: 'Correo o contraseña incorrectos.' }));
      return false;
    }

    try {
      saveSession(user);
      setState({ user, error: null });
      return true;
    } catch {
      setState((current) => ({
        ...current,
        error: 'No se pudo guardar la sesión en este navegador.',
      }));
      return false;
    }
  };

  const signOut = (): void => {
    try {
      clearSession();
      setState({ user: null, error: null });
    } catch {
      setState((current) => ({
        ...current,
        error: 'No se pudo cerrar la sesión en este navegador.',
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: state.user !== null,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

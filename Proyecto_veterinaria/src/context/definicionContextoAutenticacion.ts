import { createContext } from 'react';
import type { UsuarioSesion } from '../types/sesion';

export interface EstadoAutenticacion {
  usuario: UsuarioSesion | null;
  error: string | null;
}

export interface ValorContextoAutenticacion extends EstadoAutenticacion {
  haySesion: boolean;
  iniciarSesion: (correo: string, contrasena: string) => boolean;
  cerrarSesion: () => void;
}

export const ContextoAutenticacion = createContext<ValorContextoAutenticacion | null>(null);

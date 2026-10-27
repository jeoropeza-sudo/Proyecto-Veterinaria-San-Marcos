import { useState, type ReactNode } from 'react';
import { ContextoAutenticacion, type EstadoAutenticacion } from './definicionContextoAutenticacion';
import {
  autenticar,
  limpiarSesion,
  obtenerSesionGuardada,
  guardarSesion,
} from '../services/servicioAutenticacion';

function obtenerEstadoInicial(): EstadoAutenticacion {
  try {
    return { usuario: obtenerSesionGuardada(), error: null };
  } catch (error) {
    return {
      usuario: null,
      error: error instanceof Error ? error.message : 'No se pudo recuperar la sesión.',
    };
  }
}

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [estado, establecerEstado] = useState<EstadoAutenticacion>(obtenerEstadoInicial);

  const iniciarSesion = (correo: string, contrasena: string): boolean => {
    const usuario = autenticar(correo, contrasena);
    if (!usuario) {
      establecerEstado((actual) => ({ ...actual, error: 'Correo o contraseña incorrectos.' }));
      return false;
    }

    try {
      guardarSesion(usuario);
      establecerEstado({ usuario, error: null });
      return true;
    } catch {
      establecerEstado((actual) => ({
        ...actual,
        error: 'No se pudo guardar la sesión en este navegador.',
      }));
      return false;
    }
  };

  const cerrarSesion = (): void => {
    try {
      limpiarSesion();
      establecerEstado({ usuario: null, error: null });
    } catch {
      establecerEstado((actual) => ({
        ...actual,
        error: 'No se pudo cerrar la sesión en este navegador.',
      }));
    }
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        ...estado,
        haySesion: estado.usuario !== null,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}

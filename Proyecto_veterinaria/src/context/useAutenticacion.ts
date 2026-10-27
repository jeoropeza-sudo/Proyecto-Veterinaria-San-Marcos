import { useContext } from 'react';
import { ContextoAutenticacion } from './definicionContextoAutenticacion';

export function useAutenticacion() {
  const context = useContext(ContextoAutenticacion);
  if (!context) {
    throw new Error('useAutenticacion debe utilizarse dentro de ProveedorAutenticacion.');
  }

  return context;
}

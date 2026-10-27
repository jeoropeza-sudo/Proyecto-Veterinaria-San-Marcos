import { useContext } from 'react';
import { ContextoCarrito } from './definicionContextoCarrito';

export function useCarrito() {
  const context = useContext(ContextoCarrito);
  if (!context) throw new Error('useCarrito debe utilizarse dentro de ProveedorCarrito.');
  return context;
}

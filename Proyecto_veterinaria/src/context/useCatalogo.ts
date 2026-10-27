import { useContext } from 'react';
import { ContextoCatalogo } from './definicionContextoCatalogo';

export function useCatalogo() {
  const context = useContext(ContextoCatalogo);
  if (!context) {
    throw new Error('useCatalogo debe utilizarse dentro de ProveedorCatalogo.');
  }
  return context;
}

import { createContext } from 'react';
import type { Producto, Servicio } from '../types';

export interface CatalogContextValue {
  productos: Producto[];
  servicios: Servicio[];
  error: string | null;
  addProducto: (product: Omit<Producto, 'codigo'>) => void;
  addServicio: (service: Omit<Servicio, 'codigo'>) => void;
  deleteProducto: (codigo: string) => void;
  deleteServicio: (codigo: string) => void;
}

export const CatalogContext = createContext<CatalogContextValue | null>(null);

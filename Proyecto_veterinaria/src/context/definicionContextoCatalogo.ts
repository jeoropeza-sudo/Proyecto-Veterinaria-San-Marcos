import { createContext } from 'react';
import type { Producto, Servicio } from '../types';

export interface ValorContextoCatalogo {
  productos: Producto[];
  servicios: Servicio[];
  error: string | null;
  agregarProducto: (producto: Omit<Producto, 'codigo'>) => Promise<void>;
  agregarServicio: (servicio: Omit<Servicio, 'codigo'>) => Promise<void>;
  actualizarProducto: (codigo: string, cambios: Partial<Omit<Producto, 'codigo'>>) => Promise<void>;
  actualizarServicio: (codigo: string, cambios: Partial<Omit<Servicio, 'codigo'>>) => Promise<void>;
  eliminarProducto: (codigo: string) => Promise<void>;
  eliminarServicio: (codigo: string) => Promise<void>;
}

export const ContextoCatalogo = createContext<ValorContextoCatalogo | null>(null);
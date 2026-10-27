import { createContext } from 'react';
import type { Producto, Servicio } from '../types';

export interface ValorContextoCatalogo {
  productos: Producto[];
  servicios: Servicio[];
  error: string | null;
  agregarProducto: (producto: Omit<Producto, 'codigo'>) => void;
  agregarServicio: (servicio: Omit<Servicio, 'codigo'>) => void;
  actualizarProducto: (codigo: string, cambios: Partial<Omit<Producto, 'codigo'>>) => void;
  actualizarServicio: (codigo: string, cambios: Partial<Omit<Servicio, 'codigo'>>) => void;
  eliminarProducto: (codigo: string) => void;
  eliminarServicio: (codigo: string) => void;
}

export const ContextoCatalogo = createContext<ValorContextoCatalogo | null>(null);

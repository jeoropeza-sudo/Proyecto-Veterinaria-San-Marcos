import { createContext } from 'react';
import type { ItemCarrito, Producto, Servicio } from '../types';

export interface ValorContextoCarrito {
  articulos: ItemCarrito[];
  error: string | null;
  agregarProducto: (producto: Producto) => boolean;
  solicitarServicio: (servicio: Servicio) => boolean;
  establecerCantidad: (tipo: ItemCarrito['tipo'], codigo: string, cantidad: number) => boolean;
  quitarArticulo: (tipo: ItemCarrito['tipo'], codigo: string) => boolean;
  vaciar: () => boolean;
}

export const ContextoCarrito = createContext<ValorContextoCarrito | null>(null);

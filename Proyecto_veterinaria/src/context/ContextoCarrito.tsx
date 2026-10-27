import { useState, type ReactNode } from 'react';
import {
  agregarProductoAlCarrito,
  vaciarCarrito,
  cargarCarrito,
  quitarArticuloCarrito,
  solicitarReservaServicio,
  establecerCantidadArticulo,
} from '../services/servicioCarrito';
import type { ItemCarrito, Producto, Servicio } from '../types';
import { ContextoCarrito } from './definicionContextoCarrito';

interface EstadoCarrito {
  articulos: ItemCarrito[];
  error: string | null;
}

function obtenerEstadoInicial(): EstadoCarrito {
  try {
    return { articulos: cargarCarrito(), error: null };
  } catch (error) {
    return {
      articulos: [],
      error: error instanceof Error ? error.message : 'No se pudo cargar el carrito.',
    };
  }
}

export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const [estado, establecerEstado] = useState<EstadoCarrito>(obtenerEstadoInicial);

  const actualizarCarrito = (operacion: (articulos: ItemCarrito[]) => ItemCarrito[]): boolean => {
    try {
      establecerEstado({ articulos: operacion(estado.articulos), error: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el carrito.';
      establecerEstado((actual) => ({ ...actual, error: message }));
      return false;
    }
  };

  const agregarProducto = (producto: Producto) => actualizarCarrito((articulos) => agregarProductoAlCarrito(articulos, producto));
  const solicitarServicio = (servicio: Servicio) => actualizarCarrito((articulos) => solicitarReservaServicio(articulos, servicio));
  const establecerCantidad = (tipo: ItemCarrito['tipo'], codigo: string, cantidad: number) =>
    actualizarCarrito((articulos) => establecerCantidadArticulo(articulos, tipo, codigo, cantidad));
  const quitarArticulo = (tipo: ItemCarrito['tipo'], codigo: string) =>
    actualizarCarrito((articulos) => quitarArticuloCarrito(articulos, tipo, codigo));
  const vaciar = () => actualizarCarrito(() => vaciarCarrito());

  return (
    <ContextoCarrito.Provider value={{ ...estado, agregarProducto, solicitarServicio, establecerCantidad, quitarArticulo, vaciar }}>
      {children}
    </ContextoCarrito.Provider>
  );
}

import { useState, type ReactNode } from 'react';
import {
  agregarProducto as guardarProducto,
  agregarServicio as guardarServicio,
  actualizarProducto as guardarCambiosProducto,
  actualizarServicio as guardarCambiosServicio,
  eliminarProducto as removeProducto,
  eliminarServicio as removeServicio,
  cargarCatalogo,
  type DatosCatalogo,
} from '../services/servicioDatos';
import type { Producto, Servicio } from '../types';
import { ContextoCatalogo } from './definicionContextoCatalogo';

interface EstadoCatalogo extends DatosCatalogo {
  error: string | null;
}

function obtenerEstadoInicial(): EstadoCatalogo {
  try {
    return { ...cargarCatalogo(), error: null };
  } catch (error) {
    return {
      productos: [],
      servicios: [],
      error: error instanceof Error ? error.message : 'No se pudo cargar el catálogo.',
    };
  }
}

export function ProveedorCatalogo({ children }: { children: ReactNode }) {
  const [estado, establecerEstado] = useState<EstadoCatalogo>(obtenerEstadoInicial);

  const actualizarCatalogo = (operacion: () => DatosCatalogo) => {
    try {
      establecerEstado({ ...operacion(), error: null });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'No se pudo actualizar el catálogo.';
      establecerEstado((actual) => ({ ...actual, error: mensaje }));
      throw error;
    }
  };

  const agregarProducto = (producto: Omit<Producto, 'codigo'>) => actualizarCatalogo(() => guardarProducto(producto));
  const agregarServicio = (servicio: Omit<Servicio, 'codigo'>) => actualizarCatalogo(() => guardarServicio(servicio));
  const actualizarProducto = (codigo: string, cambios: Partial<Omit<Producto, 'codigo'>>) =>
    actualizarCatalogo(() => guardarCambiosProducto(codigo, cambios));
  const actualizarServicio = (codigo: string, cambios: Partial<Omit<Servicio, 'codigo'>>) =>
    actualizarCatalogo(() => guardarCambiosServicio(codigo, cambios));
  const eliminarProducto = (codigo: string) => actualizarCatalogo(() => removeProducto(codigo));
  const eliminarServicio = (codigo: string) => actualizarCatalogo(() => removeServicio(codigo));

  return (
    <ContextoCatalogo.Provider
      value={{
        ...estado,
        agregarProducto,
        agregarServicio,
        actualizarProducto,
        actualizarServicio,
        eliminarProducto,
        eliminarServicio,
      }}
    >
      {children}
    </ContextoCatalogo.Provider>
  );
}

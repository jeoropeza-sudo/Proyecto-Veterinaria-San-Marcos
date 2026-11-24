import { useEffect, useState, type ReactNode } from 'react';
import {
  actualizarProductoApi,
  actualizarServicioApi,
  crearProductoApi,
  crearServicioApi,
  eliminarProductoApi,
  eliminarServicioApi,
  obtenerCatalogoApi,
} from '../services/servicioCatalogoApi';
import type { Producto, Servicio } from '../types';
import { ContextoCatalogo } from './definicionContextoCatalogo';

interface EstadoCatalogo {
  productos: Producto[];
  servicios: Servicio[];
  error: string | null;
  cargando: boolean;
}

function obtenerMensaje(error: unknown, mensajePredeterminado: string): string {
  return error instanceof Error ? error.message : mensajePredeterminado;
}

function crearCodigo(prefijo: string, codigos: string[]): string {
  const mayor = codigos.reduce((maximo, codigo) => {
    const coincidencia = new RegExp(`^${prefijo}(\\d+)$`).exec(codigo);
    return coincidencia ? Math.max(maximo, Number(coincidencia[1])) : maximo;
  }, 0);
  return `${prefijo}${String(mayor + 1).padStart(3, '0')}`;
}

export function ProveedorCatalogo({ children }: { children: ReactNode }) {
  const [estado, establecerEstado] = useState<EstadoCatalogo>({
    productos: [],
    servicios: [],
    error: null,
    cargando: true,
  });

  useEffect(() => {
    let activo = true;
    obtenerCatalogoApi()
      .then((catalogo) => {
        if (activo) establecerEstado({ ...catalogo, error: null, cargando: false });
      })
      .catch((error: unknown) => {
        if (activo) {
          establecerEstado((actual) => ({
            ...actual,
            error: obtenerMensaje(error, 'No se pudo cargar el catálogo.'),
            cargando: false,
          }));
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const protegerOperacion = async (operacion: () => Promise<void>): Promise<void> => {
    try {
      await operacion();
      establecerEstado((actual) => ({ ...actual, error: null }));
    } catch (error) {
      establecerEstado((actual) => ({
        ...actual,
        error: obtenerMensaje(error, 'No se pudo actualizar el catálogo.'),
      }));
      throw error;
    }
  };

  const agregarProducto = async (datos: Omit<Producto, 'codigo'>): Promise<void> => {
    await protegerOperacion(async () => {
      const codigo = crearCodigo('PR', estado.productos.map((producto) => producto.codigo));
      const producto = await crearProductoApi({ ...datos, codigo });
      establecerEstado((actual) => ({ ...actual, productos: [...actual.productos, producto] }));
    });
  };

  const agregarServicio = async (datos: Omit<Servicio, 'codigo'>): Promise<void> => {
    await protegerOperacion(async () => {
      const codigo = crearCodigo('SV', estado.servicios.map((servicio) => servicio.codigo));
      const servicio = await crearServicioApi({ ...datos, codigo });
      establecerEstado((actual) => ({ ...actual, servicios: [...actual.servicios, servicio] }));
    });
  };

  const actualizarProducto = async (
    codigo: string,
    cambios: Partial<Omit<Producto, 'codigo'>>,
  ): Promise<void> => {
    await protegerOperacion(async () => {
      const existente = estado.productos.find((producto) => producto.codigo === codigo);
      if (!existente) throw new Error(`No se encontró el producto ${codigo}.`);
      const actualizado = await actualizarProductoApi(codigo, { ...existente, ...cambios, codigo });
      establecerEstado((actual) => ({
        ...actual,
        productos: actual.productos.map((producto) => producto.codigo === codigo ? actualizado : producto),
      }));
    });
  };

  const actualizarServicio = async (
    codigo: string,
    cambios: Partial<Omit<Servicio, 'codigo'>>,
  ): Promise<void> => {
    await protegerOperacion(async () => {
      const existente = estado.servicios.find((servicio) => servicio.codigo === codigo);
      if (!existente) throw new Error(`No se encontró el servicio ${codigo}.`);
      const actualizado = await actualizarServicioApi(codigo, { ...existente, ...cambios, codigo });
      establecerEstado((actual) => ({
        ...actual,
        servicios: actual.servicios.map((servicio) => servicio.codigo === codigo ? actualizado : servicio),
      }));
    });
  };

  const eliminarProducto = async (codigo: string): Promise<void> => {
    await protegerOperacion(async () => {
      await eliminarProductoApi(codigo);
      establecerEstado((actual) => ({
        ...actual,
        productos: actual.productos.filter((producto) => producto.codigo !== codigo),
      }));
    });
  };

  const eliminarServicio = async (codigo: string): Promise<void> => {
    await protegerOperacion(async () => {
      await eliminarServicioApi(codigo);
      establecerEstado((actual) => ({
        ...actual,
        servicios: actual.servicios.filter((servicio) => servicio.codigo !== codigo),
      }));
    });
  };

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

import { ErrorApi, leerRespuestaApi } from './clienteApi';

const API_ORDENES = 'http://localhost:8084/api/ordenes';

export interface ItemOrden {
  codigoProducto: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Orden {
  id: number;
  clienteId: number;
  emailCliente: string;
  fechaCreacion: string;
  estado: string;
  total: number;
  items: ItemOrden[];
}

function esOrden(value: unknown): value is Orden {
  if (typeof value !== 'object' || value === null) return false;
  const orden = value as Record<string, unknown>;
  if (
    typeof orden.id !== 'number'
    || typeof orden.clienteId !== 'number'
    || typeof orden.emailCliente !== 'string'
    || typeof orden.fechaCreacion !== 'string'
    || typeof orden.estado !== 'string'
    || typeof orden.total !== 'number'
    || !Array.isArray(orden.items)
  ) {
    return false;
  }

  return orden.items.every((valueItem) => {
    if (typeof valueItem !== 'object' || valueItem === null) return false;
    const item = valueItem as Record<string, unknown>;
    return typeof item.codigoProducto === 'string'
      && typeof item.nombreProducto === 'string'
      && typeof item.cantidad === 'number'
      && typeof item.precioUnitario === 'number'
      && typeof item.subtotal === 'number';
  });
}

export async function crearOrden(
  token: string,
  items: Array<{ codigo: string; cantidad: number }>,
): Promise<Orden> {
  const respuesta = await fetch(API_ORDENES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });
  const orden = await leerRespuestaApi<unknown>(respuesta);
  if (!esOrden(orden)) {
    throw new ErrorApi('El servidor devolvió una orden con formato inválido.');
  }
  return orden;
}

export async function obtenerMisOrdenes(token: string): Promise<Orden[]> {
  const respuesta = await fetch(`${API_ORDENES}/mis-ordenes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const ordenes = await leerRespuestaApi<unknown>(respuesta);
  if (!Array.isArray(ordenes) || !ordenes.every(esOrden)) {
    throw new ErrorApi('El servidor devolvió un historial de órdenes con formato inválido.');
  }
  return ordenes;
}

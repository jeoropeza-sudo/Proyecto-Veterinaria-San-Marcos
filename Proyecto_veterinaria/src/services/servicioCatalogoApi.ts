import type { Producto, Servicio } from '../types';
import { ejecutarApi, solicitarApi } from './clienteApi';

export interface DatosCatalogoApi {
  productos: Producto[];
  servicios: Servicio[];
}

function obtenerImagenServicio(categoria: string): string {
  if (categoria === 'Vacunación') return '/imagenes/vacunas.webp';
  if (categoria === 'Cirugía' || categoria === 'Exámenes') return '/imagenes/veterinaria.webp';
  if (categoria === 'Desparasitación') return '/imagenes/Antiparasitario.jpeg';
  return '/imagenes/consulta.webp';
}

export async function obtenerCatalogoApi(): Promise<DatosCatalogoApi> {
  const [productos, servicios] = await Promise.all([
    solicitarApi<Producto[]>('/api/productos'),
    solicitarApi<Servicio[]>('/api/servicios'),
  ]);

  return {
    productos,
    servicios: servicios.map((servicio) => ({
      ...servicio,
      imagen: servicio.imagen || obtenerImagenServicio(servicio.categoria),
      detalle: servicio.detalle || '',
    })),
  };
}

export function crearProductoApi(producto: Producto): Promise<Producto> {
  return solicitarApi<Producto>('/api/productos', {
    method: 'POST',
    body: JSON.stringify(producto),
  });
}

export function actualizarProductoApi(codigo: string, producto: Producto): Promise<Producto> {
  return solicitarApi<Producto>(`/api/productos/${encodeURIComponent(codigo)}`, {
    method: 'PUT',
    body: JSON.stringify(producto),
  });
}

export function eliminarProductoApi(codigo: string): Promise<void> {
  return ejecutarApi(`/api/productos/${encodeURIComponent(codigo)}`, { method: 'DELETE' });
}

export function crearServicioApi(servicio: Servicio): Promise<Servicio> {
  return solicitarApi<Servicio>('/api/servicios', {
    method: 'POST',
    body: JSON.stringify(servicio),
  });
}

export function actualizarServicioApi(codigo: string, servicio: Servicio): Promise<Servicio> {
  return solicitarApi<Servicio>(`/api/servicios/${encodeURIComponent(codigo)}`, {
    method: 'PUT',
    body: JSON.stringify(servicio),
  });
}

export function eliminarServicioApi(codigo: string): Promise<void> {
  return ejecutarApi(`/api/servicios/${encodeURIComponent(codigo)}`, { method: 'DELETE' });
}

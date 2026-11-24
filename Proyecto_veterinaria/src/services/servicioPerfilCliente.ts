import { ejecutarApi, solicitarApi } from './clienteApi';

export interface PerfilCliente {
  id: number;
  idAuth: number | null;
  email: string;
  rol: string;
  run: string | null;
  nombre: string | null;
  apellidos: string | null;
  fechaNacimiento: string | null;
  region: string | null;
  comuna: string | null;
  direccion: string | null;
  fechaActualizacion: string | null;
}

export interface DatosActualizacionPerfil {
  run: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string | null;
  region: string;
  comuna: string;
  direccion: string;
}

export interface DetalleOrdenCliente {
  codigoProducto: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface OrdenCliente {
  id: number;
  clienteId: number;
  emailCliente: string;
  fechaCreacion: string;
  estado: string;
  total: number;
  items: DetalleOrdenCliente[];
}

export interface ItemNuevaOrden {
  codigo: string;
  cantidad: number;
}

export function obtenerMiPerfil(): Promise<PerfilCliente> {
  return solicitarApi<PerfilCliente>('/api/usuarios/mi-perfil');
}

export function actualizarMiPerfil(datos: DatosActualizacionPerfil): Promise<PerfilCliente> {
  return solicitarApi<PerfilCliente>('/api/usuarios/mi-perfil', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export function obtenerMisOrdenes(): Promise<OrdenCliente[]> {
  return solicitarApi<OrdenCliente[]>('/api/ordenes/mis-ordenes');
}

export function crearOrden(items: ItemNuevaOrden[]): Promise<OrdenCliente> {
  return solicitarApi<OrdenCliente>('/api/ordenes', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

export function obtenerUsuariosAdmin(): Promise<PerfilCliente[]> {
  return solicitarApi<PerfilCliente[]>('/api/usuarios/admin/todos');
}

export function actualizarEstadoConsultaApi(id: number): Promise<void> {
  return ejecutarApi(`/api/consultas/${id}/responder`, { method: 'PUT' });
}

export function eliminarConsultaApi(id: number): Promise<void> {
  return ejecutarApi(`/api/consultas/${id}`, { method: 'DELETE' });
}

export interface ConsultaAdmin {
  id: number;
  nombre: string;
  correo: string;
  telefono?: string | null;
  asunto: string;
  mensaje: string;
  respondida: boolean;
  fechaCreacion?: string;
}

export function obtenerConsultasAdmin(): Promise<ConsultaAdmin[]> {
  return solicitarApi<ConsultaAdmin[]>('/api/consultas');
}

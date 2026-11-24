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

export interface DatosCrearUsuarioAdmin extends DatosActualizacionPerfil {
  email: string;
  password: string;
  rol: 'ADMIN' | 'CLIENTE';
}

export interface DetalleOrdenCliente {
  codigoProducto: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface ComprobantePruebaCliente {
  id: number;
  ordenId: number;
  codigoPrueba: string;
  tipoDocumento: string;
  estadoEmision: string;
  fechaEmision: string;
  emisorRazonSocial: string;
  emisorRut: string;
  emailCliente: string;
  neto: number;
  tasaIva: number;
  iva: number;
  total: number;
  validez: string;
}

export interface OrdenCliente {
  id: number;
  clienteId: number;
  emailCliente: string;
  fechaCreacion: string;
  estado: string;
  total: number;
  items: DetalleOrdenCliente[];
  comprobante?: ComprobantePruebaCliente | null;
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

export function crearUsuarioAdmin(datos: DatosCrearUsuarioAdmin): Promise<{ id: number; email: string; rol: string }> {
  return solicitarApi<{ id: number; email: string; rol: string }>('/api/aute/admin/usuarios', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export function actualizarUsuarioAdmin(
  idAuth: number,
  datos: DatosActualizacionPerfil,
): Promise<PerfilCliente> {
  return solicitarApi<PerfilCliente>(`/api/usuarios/admin/${idAuth}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export function eliminarUsuarioAdmin(idAuth: number): Promise<void> {
  return ejecutarApi(`/api/aute/admin/usuarios/${idAuth}`, { method: 'DELETE' });
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

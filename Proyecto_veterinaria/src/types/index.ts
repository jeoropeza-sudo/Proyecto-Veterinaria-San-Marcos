export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
  principio?: string;
  presentacion?: string;
  especie?: string;
  stock: number;
  precio: number;
  imagen: string;
  detalle?: string;
}

export interface Servicio {
  codigo: string;
  categoria: string;
  nombre: string;
  especie: string;
  duracion: string;
  precio: number;
  detalle: string;
  imagen?: string;
}

export type ItemCarrito =
  | { tipo: 'producto'; producto: Producto; cantidad: number }
  | { tipo: 'servicio'; producto: Servicio; cantidad: number };

export interface Usuario {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  contrasena?: string;
  fechaNacimiento?: string;
  rol: 'Administrador' | 'Cliente';
  region: string;
  comuna: string;
  direccion: string;
}
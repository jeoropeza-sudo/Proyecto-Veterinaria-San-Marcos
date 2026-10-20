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
}

export interface ItemCarrito {
  producto: Producto | Servicio;
  cantidad: number;
}

export interface Usuario {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  password?: string;
  fechaNacimiento?: string;
  rol: 'Administrador' | 'Cliente';
  region: string;
  comuna: string;
  direccion: string;
}
import type { Usuario } from './index';

export interface UsuarioSesion {
  id: number;
  token: string;
  correo: string;
  rol: Usuario['rol'];
  run?: string;
  nombre?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  region?: string;
  comuna?: string;
  direccion?: string;
}

import type { Usuario } from './index';

export type UsuarioSesion = Omit<Usuario, 'contrasena'>;

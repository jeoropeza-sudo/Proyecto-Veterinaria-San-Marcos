import type { Usuario } from './index';

export type SessionUser = Omit<Usuario, 'password'>;

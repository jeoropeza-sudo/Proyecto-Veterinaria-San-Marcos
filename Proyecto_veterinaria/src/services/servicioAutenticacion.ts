import type { UsuarioSesion } from '../types/sesion';

const CLAVE_ALMACENAMIENTO_SESION = 'veterinaria.session';

const cuentasDemostracion: Array<{ correo: string; contrasena: string; usuario: UsuarioSesion }> = [
  {
    correo: 'admin@sanmarcos.cl',
    contrasena: 'admin1234',
    usuario: {
      run: '11.111.111-1',
      nombre: 'Alexis',
      apellidos: 'Administrador',
      correo: 'admin@sanmarcos.cl',
      rol: 'Administrador',
      region: 'O’Higgins',
      comuna: 'Rancagua',
      direccion: '',
    },
  },
  {
    correo: 'cliente@sanmarcos.cl',
    contrasena: 'cliente1234',
    usuario: {
      run: '22.222.222-2',
      nombre: 'Cliente',
      apellidos: 'Demostración',
      correo: 'cliente@sanmarcos.cl',
      rol: 'Cliente',
      region: 'O’Higgins',
      comuna: 'Rancagua',
      direccion: '',
    },
  },
];

function esUsuarioSesion(value: unknown): value is UsuarioSesion {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const usuario = value as Record<string, unknown>;

  return (
    typeof usuario.run === 'string' &&
    typeof usuario.nombre === 'string' &&
    typeof usuario.apellidos === 'string' &&
    typeof usuario.correo === 'string' &&
    (usuario.rol === 'Administrador' || usuario.rol === 'Cliente') &&
    typeof usuario.region === 'string' &&
    typeof usuario.comuna === 'string' &&
    typeof usuario.direccion === 'string' &&
    !('contrasena' in usuario)
  );
}

export function obtenerSesionGuardada(): UsuarioSesion | null {
  const sesionGuardada = window.localStorage.getItem(CLAVE_ALMACENAMIENTO_SESION);
  if (sesionGuardada === null) {
    return null;
  }

  let sesionAnalizada: unknown;
  try {
    sesionAnalizada = JSON.parse(sesionGuardada);
  } catch {
    throw new Error('La sesión guardada está dañada. Limpia los datos del sitio e inténtalo nuevamente.');
  }

  if (!esUsuarioSesion(sesionAnalizada)) {
    throw new Error('La sesión guardada no tiene un formato válido. Limpia los datos del sitio e inténtalo nuevamente.');
  }

  return sesionAnalizada;
}

export function autenticar(correo: string, contrasena: string): UsuarioSesion | null {
  const correoNormalizado = correo.trim().toLocaleLowerCase();
  const cuenta = cuentasDemostracion.find(
    (candidato) =>
      candidato.correo === correoNormalizado &&
      candidato.contrasena === contrasena,
  );

  return cuenta?.usuario ?? null;
}

export function guardarSesion(usuario: UsuarioSesion): void {
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO_SESION, JSON.stringify(usuario));
}

export function limpiarSesion(): void {
  window.localStorage.removeItem(CLAVE_ALMACENAMIENTO_SESION);
}

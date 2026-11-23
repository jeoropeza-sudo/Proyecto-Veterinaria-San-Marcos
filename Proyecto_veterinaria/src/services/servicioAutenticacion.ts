import type { UsuarioSesion } from '../types/sesion';
import { leerRespuestaApi } from './clienteApi';

const CLAVE_ALMACENAMIENTO_SESION = 'veterinaria.session';
const API_AUTENTICACION = 'http://localhost:8083/api/aute';

interface RespuestaLogin {
  token: string;
  id: number;
  email: string;
  rol: string;
}

interface RespuestaRegistro {
  mensaje: string;
  id: number;
  email: string;
  rol: string;
}

function mapearRol(rol: string): UsuarioSesion['rol'] {
  switch (rol.trim().toLocaleUpperCase()) {
    case 'ADMIN':
    case 'ADMINISTRADOR':
      return 'Administrador';
    case 'CLIENTE':
      return 'Cliente';
    default:
      throw new Error('El servidor devolvió un rol de usuario desconocido.');
  }
}

function crearSesion(respuesta: RespuestaLogin): UsuarioSesion {
  if (
    typeof respuesta.token !== 'string'
    || !respuesta.token
    || typeof respuesta.id !== 'number'
    || typeof respuesta.email !== 'string'
    || typeof respuesta.rol !== 'string'
  ) {
    throw new Error('El servidor devolvió datos de sesión incompletos.');
  }

  return {
    id: respuesta.id,
    token: respuesta.token,
    correo: respuesta.email,
    rol: mapearRol(respuesta.rol),
  };
}

function esUsuarioSesion(value: unknown): value is UsuarioSesion {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const usuario = value as Record<string, unknown>;

  return (
    typeof usuario.id === 'number' &&
    typeof usuario.token === 'string' &&
    typeof usuario.correo === 'string' &&
    (usuario.rol === 'Administrador' || usuario.rol === 'Cliente') &&
    !('contrasena' in usuario) &&
    ['run', 'nombre', 'apellidos', 'fechaNacimiento', 'region', 'comuna', 'direccion']
      .every((campo) => usuario[campo] === undefined || typeof usuario[campo] === 'string')
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

export async function autenticar(correo: string, contrasena: string): Promise<UsuarioSesion> {
  const respuesta = await fetch(`${API_AUTENTICACION}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: correo.trim(), password: contrasena }),
  });
  return crearSesion(await leerRespuestaApi<RespuestaLogin>(respuesta));
}

export async function registrar(correo: string, contrasena: string): Promise<RespuestaRegistro> {
  const respuesta = await fetch(`${API_AUTENTICACION}/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: correo.trim(), password: contrasena }),
  });
  const resultado = await leerRespuestaApi<RespuestaRegistro>(respuesta);
  if (
    typeof resultado.mensaje !== 'string'
    || typeof resultado.id !== 'number'
    || typeof resultado.email !== 'string'
    || typeof resultado.rol !== 'string'
  ) {
    throw new Error('El servidor devolvió una respuesta de registro incompleta.');
  }
  return resultado;
}

export function guardarSesion(usuario: UsuarioSesion): void {
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO_SESION, JSON.stringify(usuario));
}

export function limpiarSesion(): void {
  window.localStorage.removeItem(CLAVE_ALMACENAMIENTO_SESION);
}

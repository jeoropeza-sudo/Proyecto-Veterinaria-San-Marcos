import type { UsuarioSesion } from '../types/sesion';

const API_URL = 'http://localhost:8090/api/aute';
const CLAVE_ALMACENAMIENTO_SESION = 'veterinaria.session';
const CLAVE_ALMACENAMIENTO_TOKEN = 'veterinaria.token';

interface RespuestaAutenticacion {
  usuario: UsuarioSesion;
  token: string;
}

function esObjeto(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function solicitar(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No pudimos completar tu solicitud. Inténtalo nuevamente más tarde.', { cause: error });
    }
    throw error;
  }
}

async function obtenerMensajeError(response: Response): Promise<string> {
  const cuerpo = await response.text();
  if (cuerpo) {
    let datos: unknown;
    try {
      datos = JSON.parse(cuerpo);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }

    if (typeof datos === 'string' && datos.trim()) return datos;
    if (esObjeto(datos)) {
      for (const clave of ['message', 'mensaje', 'error', 'detail']) {
        const mensaje = datos[clave];
        if (typeof mensaje === 'string' && mensaje.trim()) return mensaje;
      }
    }
  }

  return 'No pudimos completar tu solicitud. Inténtalo nuevamente más tarde.';
}

async function exigirRespuestaExitosa(response: Response): Promise<void> {
  if (!response.ok) {
    throw new Error(await obtenerMensajeError(response));
  }
}

function obtenerToken(respuesta: unknown): string {
  if (typeof respuesta === 'string' && respuesta.trim()) return respuesta;
  if (!esObjeto(respuesta)) {
    throw new Error('No pudimos completar el inicio de sesión. Inténtalo nuevamente.');
  }

  for (const clave of ['token', 'accessToken', 'jwt']) {
    const token = respuesta[clave];
    if (typeof token === 'string' && token.trim()) return token;
  }

  if (esObjeto(respuesta.data)) return obtenerToken(respuesta.data);
  throw new Error('No pudimos completar el inicio de sesión. Inténtalo nuevamente.');
}

function obtenerRol(rol: unknown): UsuarioSesion['rol'] {
  if (typeof rol !== 'string') {
    throw new Error('No pudimos validar tu cuenta. Inténtalo nuevamente.');
  }

  const rolNormalizado = rol.toLocaleUpperCase().replace(/^ROLE_/, '');
  if (rolNormalizado === 'ADMIN' || rolNormalizado === 'ADMINISTRADOR') return 'Administrador';
  if (rolNormalizado === 'CLIENT' || rolNormalizado === 'CLIENTE') return 'Cliente';
  throw new Error('No pudimos validar tu cuenta. Inténtalo nuevamente.');
}

function crearUsuarioSesion(datos: unknown): UsuarioSesion {
  if (!esObjeto(datos)) {
    throw new Error('No pudimos validar la información de tu cuenta. Inténtalo nuevamente.');
  }

  const correo = typeof datos.email === 'string'
    ? datos.email
    : typeof datos.correo === 'string'
      ? datos.correo
      : null;
  if (!correo) {
    throw new Error('No pudimos validar la información de tu cuenta. Inténtalo nuevamente.');
  }

  const valorTexto = (clave: string, valorInicial = ''): string => {
    const valor = datos[clave];
    return typeof valor === 'string' ? valor : valorInicial;
  };

  return {
    run: valorTexto('run'),
    nombre: valorTexto('nombre', correo.split('@')[0]),
    apellidos: valorTexto('apellidos'),
    correo,
    rol: obtenerRol(datos.rol ?? datos.role),
    region: valorTexto('region'),
    comuna: valorTexto('comuna'),
    direccion: valorTexto('direccion'),
  };
}

export async function registrarCuenta(correo: string, contrasena: string): Promise<void> {
  const response = await solicitar(`${API_URL}/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: correo.trim().toLocaleLowerCase(), password: contrasena }),
  });
  await exigirRespuestaExitosa(response);
}

export async function autenticar(correo: string, contrasena: string): Promise<RespuestaAutenticacion> {
  const response = await solicitar(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: correo.trim().toLocaleLowerCase(), password: contrasena }),
  });
  await exigirRespuestaExitosa(response);

  const respuestaLogin: unknown = await response.json();
  const token = obtenerToken(respuestaLogin);
  const validacion = await solicitar(`${API_URL}/validar-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  await exigirRespuestaExitosa(validacion);

  const datosValidacion: unknown = await validacion.json();
  return { usuario: crearUsuarioSesion(datosValidacion), token };
}

export function obtenerSesionGuardada(): UsuarioSesion | null {
  const sesionGuardada = window.localStorage.getItem(CLAVE_ALMACENAMIENTO_SESION);
  const token = window.localStorage.getItem(CLAVE_ALMACENAMIENTO_TOKEN);
  if (!sesionGuardada || !token) return null;

  let sesionAnalizada: unknown;
  try {
    sesionAnalizada = JSON.parse(sesionGuardada);
  } catch {
    throw new Error('La sesión guardada está dañada. Inicia sesión nuevamente.');
  }

  if (!esObjeto(sesionAnalizada) || typeof sesionAnalizada.correo !== 'string') {
    throw new Error('La sesión guardada no tiene un formato válido. Inicia sesión nuevamente.');
  }

  return crearUsuarioSesion(sesionAnalizada);
}

export function guardarSesion(usuario: UsuarioSesion, token: string): void {
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO_SESION, JSON.stringify(usuario));
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO_TOKEN, token);
}

export function limpiarSesion(): void {
  window.localStorage.removeItem(CLAVE_ALMACENAMIENTO_SESION);
  window.localStorage.removeItem(CLAVE_ALMACENAMIENTO_TOKEN);
}

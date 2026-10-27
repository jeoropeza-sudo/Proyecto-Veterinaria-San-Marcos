import type { Usuario } from '../types';
import { validarRut } from '../utils/validadorRut';

export type UsuarioAdministrado = Omit<Usuario, 'contrasena'>;

const CLAVE_USUARIOS = 'veterinaria.usuarios';

function esUsuarioAdministrado(value: unknown): value is UsuarioAdministrado {
  if (typeof value !== 'object' || value === null) return false;
  const usuario = value as Record<string, unknown>;

  return (
    typeof usuario.run === 'string' &&
    typeof usuario.nombre === 'string' &&
    typeof usuario.apellidos === 'string' &&
    typeof usuario.correo === 'string' &&
    typeof usuario.region === 'string' &&
    typeof usuario.comuna === 'string' &&
    typeof usuario.direccion === 'string' &&
    (usuario.rol === 'Administrador' || usuario.rol === 'Cliente') &&
    (usuario.fechaNacimiento === undefined || typeof usuario.fechaNacimiento === 'string') &&
    !('contrasena' in usuario)
  );
}

function leerUsuarios(): UsuarioAdministrado[] {
  const guardados = window.localStorage.getItem(CLAVE_USUARIOS);
  if (guardados === null) return [];

  let datos: unknown;
  try {
    datos = JSON.parse(guardados);
  } catch {
    throw new Error('Los usuarios guardados están dañados. Limpia los datos del sitio e inténtalo nuevamente.');
  }

  if (!Array.isArray(datos) || !datos.every(esUsuarioAdministrado)) {
    throw new Error('Los usuarios guardados no tienen un formato válido. Limpia los datos del sitio e inténtalo nuevamente.');
  }

  return datos;
}

function normalizarIdentificador(value: string): string {
  return value.replace(/[.-]/g, '').trim().toLocaleUpperCase();
}

function validarDatos(usuario: UsuarioAdministrado, usuarios: UsuarioAdministrado[], identificadorOriginal?: string): void {
  if (!validarRut(usuario.run)) {
    throw new Error('Ingresa un RUN chileno válido.');
  }
  if (!usuario.nombre.trim() || !usuario.apellidos.trim() || !usuario.correo.trim()) {
    throw new Error('Nombre, apellidos y correo son obligatorios.');
  }

  const runNormalizado = normalizarIdentificador(usuario.run);
  const correoNormalizado = usuario.correo.trim().toLocaleLowerCase();
  const duplicado = usuarios.some((actual) =>
    normalizarIdentificador(actual.run) !== normalizarIdentificador(identificadorOriginal ?? '')
    && (
      normalizarIdentificador(actual.run) === runNormalizado
      || actual.correo.trim().toLocaleLowerCase() === correoNormalizado
    ),
  );
  if (duplicado) {
    throw new Error('Ya existe un usuario con ese RUN o correo electrónico.');
  }
}

export function cargarUsuarios(): UsuarioAdministrado[] {
  return leerUsuarios();
}

export function agregarUsuario(usuario: UsuarioAdministrado): UsuarioAdministrado[] {
  const usuarios = leerUsuarios();
  validarDatos(usuario, usuarios);
  const actualizados = [...usuarios, { ...usuario, run: usuario.run.trim().toLocaleUpperCase(), correo: usuario.correo.trim() }];
  window.localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(actualizados));
  return actualizados;
}

export function actualizarUsuario(runOriginal: string, usuario: UsuarioAdministrado): UsuarioAdministrado[] {
  const usuarios = leerUsuarios();
  const indice = usuarios.findIndex((actual) => normalizarIdentificador(actual.run) === normalizarIdentificador(runOriginal));
  if (indice < 0) throw new Error('No se encontró el usuario que intentas actualizar.');

  validarDatos(usuario, usuarios, runOriginal);
  const actualizados = [...usuarios];
  actualizados[indice] = { ...usuario, run: usuario.run.trim().toLocaleUpperCase(), correo: usuario.correo.trim() };
  window.localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(actualizados));
  return actualizados;
}

export function eliminarUsuario(run: string): UsuarioAdministrado[] {
  const usuarios = leerUsuarios();
  const actualizados = usuarios.filter(
    (usuario) => normalizarIdentificador(usuario.run) !== normalizarIdentificador(run),
  );
  if (actualizados.length === usuarios.length) throw new Error('No se encontró el usuario que intentas eliminar.');
  window.localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(actualizados));
  return actualizados;
}

// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  actualizarUsuario,
  agregarUsuario,
  cargarUsuarios,
  eliminarUsuario,
  type UsuarioAdministrado,
} from '../services/servicioUsuarios';

const usuarioBase: UsuarioAdministrado = {
  run: '20.123.456-5',
  nombre: 'Camila',
  apellidos: 'Pérez Soto',
  correo: 'camila@example.cl',
  fechaNacimiento: '1997-04-15',
  rol: 'Cliente',
  region: "O'Higgins",
  comuna: 'Rancagua',
  direccion: 'Calle Uno 123',
};

describe('Servicio de directorio de usuarios', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('crea y vuelve a cargar un usuario persistido sin credenciales', () => {
    agregarUsuario(usuarioBase);

    expect(cargarUsuarios()).toEqual([usuarioBase]);
    expect(cargarUsuarios()[0]).not.toHaveProperty('contrasena');
  });

  it('actualiza y elimina usuarios por RUN', () => {
    agregarUsuario(usuarioBase);
    actualizarUsuario(usuarioBase.run, { ...usuarioBase, nombre: 'Camila Andrea' });

    expect(cargarUsuarios()[0].nombre).toBe('Camila Andrea');
    expect(eliminarUsuario(usuarioBase.run)).toEqual([]);
    expect(cargarUsuarios()).toEqual([]);
  });

  it('rechaza RUN inválido y duplicados de RUN o correo', () => {
    expect(() => agregarUsuario({ ...usuarioBase, run: '12.345.678-9' })).toThrow(/RUN chileno válido/i);
    agregarUsuario(usuarioBase);
    expect(() => agregarUsuario({ ...usuarioBase, correo: 'otra@example.cl' })).toThrow(/RUN o correo/i);
    expect(() => agregarUsuario({ ...usuarioBase, run: '19.011.022-2', correo: 'CAMILA@example.cl' })).toThrow(/RUN o correo/i);
  });

  it('reporta el almacenamiento dañado sin ocultar el error', () => {
    window.localStorage.setItem('veterinaria.usuarios', '{inválido');

    expect(() => cargarUsuarios()).toThrow(/están dañados/i);
  });
});

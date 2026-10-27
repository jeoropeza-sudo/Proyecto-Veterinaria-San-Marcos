// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

function renderizarComoAdministrador() {
  window.localStorage.setItem('veterinaria.session', JSON.stringify({
    run: '11.111.111-1',
    nombre: 'Alexis',
    apellidos: 'Administrador',
    correo: 'admin@sanmarcos.cl',
    rol: 'Administrador',
    region: "O'Higgins",
    comuna: 'Rancagua',
    direccion: '',
  }));
  return renderAt('/admin');
}

describe('Inicio de administración', () => {
  it('presenta resumen y accesos a las dos áreas de gestión', () => {
    renderizarComoAdministrador();

    expect(screen.getByRole('heading', { name: 'Hola, Alexis.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Administrar usuarios/ })).toHaveAttribute('href', '/admin/usuarios');
    expect(screen.getByRole('link', { name: /Administrar catálogo/ })).toHaveAttribute('href', '/admin/catalogo');
  });

  it('redirige al gestor de usuarios al seleccionar su acceso', () => {
    renderizarComoAdministrador();
    fireEvent.click(screen.getByRole('link', { name: /Administrar usuarios/ }));

    expect(screen.getByRole('heading', { name: 'Gestión de usuarios' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Usuarios registrados' })).toBeInTheDocument();
  });

  it('redirige al catálogo al seleccionar su acceso', () => {
    renderizarComoAdministrador();
    fireEvent.click(screen.getByRole('link', { name: /Administrar catálogo/ }));

    expect(screen.getByRole('heading', { name: 'Gestión del catálogo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Servicios y productos' })).toBeInTheDocument();
  });

});
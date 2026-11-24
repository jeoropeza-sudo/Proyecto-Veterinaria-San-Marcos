// @vitest-environment jsdom
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Menú adaptable', () => {
  it('muestra el acceso de registro a visitantes', () => {
    renderAt('/');

    expect(within(screen.getByRole('navigation')).getByRole('link', { name: 'Crear cuenta' })).toBeTruthy();
  });

  it('oculta el carrito a la cuenta administradora', () => {
    window.localStorage.setItem('veterinaria.session', JSON.stringify({
      run: '11.111.111-1',
      nombre: 'Admin',
      apellidos: 'San Marcos',
      correo: 'admin@sanmarcos.cl',
      rol: 'Administrador',
      region: 'O’Higgins',
      comuna: 'Rancagua',
      direccion: '',
    }));
    window.localStorage.setItem('veterinaria.token', 'token-de-prueba');
    renderAt('/');

    const navigation = within(screen.getByRole('navigation'));
    expect(navigation.queryByRole('link', { name: /mi carrito/i })).toBeNull();
    expect(navigation.getByRole('link', { name: 'Administración' })).toBeTruthy();
  });

  it('abre y cierra el menú de navegación', () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir navegación' }));

    const botonCerrar = screen.getByRole('button', { name: 'Cerrar navegación' });
    expect(botonCerrar.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('navbarSanMarcos')?.className).toContain('show');
    fireEvent.click(botonCerrar);

    expect(screen.getByRole('button', { name: 'Abrir navegación' }).getAttribute('aria-expanded')).toBe('false');
  });
});
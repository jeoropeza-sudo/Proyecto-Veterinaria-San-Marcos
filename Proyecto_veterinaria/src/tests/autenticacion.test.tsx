// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProveedorAutenticacion } from '../context/ContextoAutenticacion';
import { ProveedorCarrito } from '../context/ContextoCarrito';
import { ProveedorCatalogo } from '../context/ContextoCatalogo';
import { EnrutadorAplicacion } from '../router/EnrutadorAplicacion';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProveedorAutenticacion>
        <ProveedorCatalogo>
          <ProveedorCarrito>
            <EnrutadorAplicacion />
          </ProveedorCarrito>
        </ProveedorCatalogo>
      </ProveedorAutenticacion>
    </MemoryRouter>,
  );
}

describe('Autenticación y control de roles', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('redirige al login y permite que un administrador acceda a /admin', () => {
    renderAt('/admin');

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'admin@sanmarcos.cl' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'admin1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(screen.getByText(/panel de administración/i)).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem('veterinaria.session') ?? '{}')).not.toHaveProperty('contrasena');
  });

  it('no permite a un cliente abrir /admin', () => {
    renderAt('/login');

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'cliente@sanmarcos.cl' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'cliente1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    cleanup();
    renderAt('/admin');

    expect(screen.getByRole('heading', { name: /acceso denegado/i })).toBeTruthy();
    expect(screen.queryByText(/panel de administración/i)).toBeNull();
  });

  it('muestra un error ante credenciales incorrectas y no crea una sesión', () => {
    renderAt('/login');

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'admin@sanmarcos.cl' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'incorrecta' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(screen.getByText(/no se pudo iniciar sesión/i)).toBeTruthy();
    expect(window.localStorage.getItem('veterinaria.session')).toBeNull();
  });

  it('cierra la sesión y vuelve a pedir autenticación en una ruta protegida', () => {
    renderAt('/admin');

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'admin@sanmarcos.cl' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'admin1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeTruthy();
    expect(window.localStorage.getItem('veterinaria.session')).toBeNull();
  });

  it('restaura una sesión válida al montar el proveedor', () => {
    window.localStorage.setItem(
      'veterinaria.session',
      JSON.stringify({
        run: '11.111.111-1',
        nombre: 'Alexis',
        apellidos: 'Administrador',
        correo: 'admin@sanmarcos.cl',
        rol: 'Administrador',
        region: 'O’Higgins',
        comuna: 'Rancagua',
        direccion: '',
      }),
    );

    renderAt('/admin');

    expect(screen.getByText(/panel de administración/i)).toBeTruthy();
  });
});

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

describe('Compra y reserva desde el catálogo', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('guarda un producto, solicita login al confirmar y conserva el carrito', () => {
    renderAt('/productos/ME001');

    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }));
    fireEvent.click(screen.getByRole('link', { name: /mi carrito/i }));
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión para confirmar/i }));

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'cliente@sanmarcos.cl' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'cliente1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(screen.getByRole('heading', { name: 'Mi carrito' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Amoxibay 250mg' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /confirmar solicitud/i }));

    expect(screen.getByText(/no se envió a la veterinaria/i)).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem('veterinaria.carrito') ?? 'null')).toEqual([]);
  });

  it('permite iniciar una solicitud de reserva y verla en el carrito', () => {
    renderAt('/servicios/SV001');

    fireEvent.click(screen.getByRole('button', { name: /solicitar reserva/i }));
    fireEvent.click(screen.getByRole('link', { name: /mi carrito/i }));

    expect(screen.getByText('Solicitud de reserva')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Consulta general' })).toBeTruthy();
  });
});

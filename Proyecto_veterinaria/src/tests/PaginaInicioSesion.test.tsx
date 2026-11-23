import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ProveedorAutenticacion } from '../context/ContextoAutenticacion';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe('Inicio de sesión', () => {
  it('muestra errores generales y de campo dentro del formulario', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({
        message: 'Credenciales inválidas.',
        fieldErrors: { email: 'No existe una cuenta con este correo.' },
      }),
    }));

    render(
      <MemoryRouter initialEntries={['/login']}>
        <ProveedorAutenticacion>
          <Routes>
            <Route path="/login" element={<PaginaInicioSesion />} />
          </Routes>
        </ProveedorAutenticacion>
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'noexiste@sanmarcos.cl' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'secreto' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Ingresar' }).closest('form')!);

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas.');
    expect(screen.getByText('No existe una cuenta con este correo.')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('aria-invalid', 'true');
  });
});

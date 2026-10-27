// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { AdminUsers } from '../componentes/organismos/AdminUsers';

function completarUsuario() {
  fireEvent.change(screen.getByLabelText('RUN'), { target: { value: '20.123.456-5' } });
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Camila' } });
  fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez Soto' } });
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'camila@example.cl' } });
  fireEvent.change(screen.getByLabelText('Región'), { target: { value: "O'Higgins" } });
  fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Rancagua' } });
  fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Calle Uno 123' } });
}

describe('Gestión administrativa del directorio', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('registra, edita y elimina usuarios persistiendo el directorio', () => {
    render(<AdminUsers />);
    completarUsuario();
    fireEvent.click(screen.getByRole('button', { name: 'Agregar usuario' }));

    expect(screen.getByText('Camila Pérez Soto')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('veterinaria.usuarios') ?? '[]')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Camila Andrea' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(screen.getByText('Camila Andrea Pérez Soto')).toBeInTheDocument();

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText(/aún no hay usuarios registrados/i)).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('veterinaria.usuarios') ?? '[]')).toEqual([]);
  });

  it('muestra errores para RUN inválido y duplicados', () => {
    render(<AdminUsers />);
    completarUsuario();
    fireEvent.change(screen.getByLabelText('RUN'), { target: { value: '12.345.678-9' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar usuario' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/RUN chileno válido/i);

    fireEvent.change(screen.getByLabelText('RUN'), { target: { value: '20.123.456-5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar usuario' }));
    fireEvent.change(screen.getByLabelText('RUN'), { target: { value: '19.011.022-2' } });
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Camila' } });
    fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez Soto' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'camila@example.cl' } });
    fireEvent.change(screen.getByLabelText('Región'), { target: { value: "O'Higgins" } });
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Rancagua' } });
    fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Calle Dos 456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar usuario' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/ya existe un usuario/i);
  });
});

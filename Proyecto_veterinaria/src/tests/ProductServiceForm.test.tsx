// src/tests/ProductServiceForm.test.tsx
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ProductServiceForm } from '../componentes/organismos/ProductServiceForm';

describe('Test 11: Renderizado y envío de formulario de administración', () => {
  afterEach(() => {
    cleanup();
  });

  it('debe mostrar error de validación si el nombre está vacío', () => {
    const handleSubmit = vi.fn();
    render(<ProductServiceForm onSubmit={handleSubmit} />);

    const submitBtn = screen.getByRole('button', { name: /Registrar Servicio/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/El nombre es obligatorio/i)).toBeDefined();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('debe enviar los datos correctamente cuando el formulario es válido', () => {
    const handleSubmit = vi.fn();
    render(<ProductServiceForm onSubmit={handleSubmit} />);

    // Usamos getAllByLabelText y tomamos el primero para evitar duplicidad
    const inputNombre = screen.getAllByLabelText(/Nombre del servicio\/producto/i)[0];
    const inputPrecio = screen.getAllByLabelText(/Precio/i)[0];
    const submitBtn = screen.getByRole('button', { name: /Registrar Servicio/i });

    fireEvent.change(inputNombre, { target: { value: 'Consulta Veterinaria General' } });
    fireEvent.change(inputPrecio, { target: { value: '25000' } });

    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Consulta Veterinaria General',
        categoria: 'Servicio',
        precio: 25000,
      })
    );
  });
});
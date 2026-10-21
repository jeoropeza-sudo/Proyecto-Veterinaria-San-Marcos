// src/tests/ProductServiceForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductServiceForm } from '../components/organisms/ProductServiceForm';

describe('Test 11: Renderizado y envío de formulario de administración', () => {
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

    const inputNombre = screen.getByLabelText(/Nombre del servicio\/producto/i);
    const inputPrecio = screen.getByLabelText(/Precio/i);
    const submitBtn = screen.getByRole('button', { name: /Registrar Servicio/i });

    fireEvent.change(inputNombre, { target: { value: 'Consulta Veterinaria General' } });
    fireEvent.change(inputPrecio, { target: { value: '25000' } });

    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      nombre: 'Consulta Veterinaria General',
      categoria: 'Servicio',
      precio: 25000,
      descripcion: '',
    });
  });
});
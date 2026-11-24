// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormularioProductoServicio } from '../Componentes/organismos/FormularioProductoServicio';

describe('Validación del formulario de producto o servicio', () => {
  it('explica los errores de nombre, precio y stock antes de guardar', () => {
    const alEnviar = vi.fn();
    render(<FormularioProductoServicio alEnviar={alEnviar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Registrar Servicio' }));
    expect(screen.getByText('Ingresa el nombre del servicio o producto.')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Nombre del servicio/producto'), { target: { value: 'Vacuna' } });
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Producto' } });
    fireEvent.change(screen.getByLabelText('Precio'), { target: { value: '-1' } });
    fireEvent.change(screen.getByLabelText('Stock inicial'), { target: { value: '-2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Producto' }));

    expect(screen.getByText('El precio debe ser un número igual o mayor que cero.')).toBeTruthy();
    expect(screen.getByText('El stock debe ser un número entero igual o mayor que cero.')).toBeTruthy();
    expect(alEnviar).not.toHaveBeenCalled();
  });
});

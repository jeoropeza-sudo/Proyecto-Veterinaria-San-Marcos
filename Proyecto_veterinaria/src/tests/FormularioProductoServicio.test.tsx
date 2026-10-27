// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { FormularioProductoServicio } from '../componentes/organismos/FormularioProductoServicio';

describe('Formulario administrativo de catálogo', () => {
  it('rechaza precios que no sean mayores que cero', () => {
    const alEnviar = vi.fn();
    render(<FormularioProductoServicio alEnviar={alEnviar} />);

    fireEvent.change(screen.getByLabelText('Nombre del servicio/producto'), { target: { value: 'Consulta' } });
    fireEvent.change(screen.getByLabelText('Precio'), { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('button', { name: /registrar servicio/i }).closest('form')!);

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor que 0/i);
    expect(alEnviar).not.toHaveBeenCalled();
  });

  it('rechaza existencias negativas o decimales en productos', () => {
    const alEnviar = vi.fn();
    render(<FormularioProductoServicio alEnviar={alEnviar} />);

    fireEvent.change(screen.getByLabelText('Nombre del servicio/producto'), { target: { value: 'Alimento' } });
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Producto' } });
    fireEvent.change(screen.getByLabelText('Precio'), { target: { value: '1200' } });
    fireEvent.change(screen.getByLabelText('Stock inicial'), { target: { value: '1.5' } });
    fireEvent.submit(screen.getByRole('button', { name: /registrar producto/i }).closest('form')!);

    expect(screen.getByText(/stock debe ser un número entero/i)).toBeInTheDocument();
    expect(alEnviar).not.toHaveBeenCalled();
  });
});

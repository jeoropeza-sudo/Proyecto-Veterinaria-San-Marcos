// src/tests/ProductServiceList.test.tsx
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ProductServiceList } from '../componentes/organismos/ProductServiceList';

describe('Test de Lista de Productos y Servicios (Panel Admin)', () => {
  afterEach(() => {
    cleanup();
  });

  const mockItems = [
    { id: '1', nombre: 'Control Veterinario', categoria: 'Servicio', precio: 15000 },
    { id: '2', nombre: 'Antiparasitario', categoria: 'Producto', precio: 8000 }
  ];

  it('debe renderizar los elementos correctamente en la tabla', () => {
    const handleDelete = vi.fn();
    render(<ProductServiceList items={mockItems} onDelete={handleDelete} />);

    expect(screen.getByText('Control Veterinario')).toBeDefined();
    expect(screen.getByText('Antiparasitario')).toBeDefined();
    expect(screen.getByText('$15000')).toBeDefined();
  });

  it('debe llamar a la función onDelete con el ID correcto al hacer clic en eliminar', () => {
    const handleDelete = vi.fn();
    render(<ProductServiceList items={mockItems} onDelete={handleDelete} />);

    const botonesEliminar = screen.getAllByRole('button', { name: /Eliminar/i });
    fireEvent.click(botonesEliminar[0]);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('1');
  });
});
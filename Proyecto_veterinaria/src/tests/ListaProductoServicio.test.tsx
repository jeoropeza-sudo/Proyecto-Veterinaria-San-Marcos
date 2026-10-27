// src/tests/ListaProductoServicio.test.tsx
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ListaProductoServicio } from '../componentes/organismos/ListaProductoServicio';

describe('Test de Lista de Productos y Servicios (Panel Admin)', () => {
  afterEach(() => {
    cleanup();
  });

  const articulosSimulados = [
    { codigo: '1', nombre: 'Control Veterinario', categoria: 'Servicio', precio: 15000 },
    { codigo: '2', nombre: 'Antiparasitario', categoria: 'Producto', precio: 8000 }
  ];

  it('debe renderizar los elementos correctamente en la tabla', () => {
    const manejarEliminacion = vi.fn();
    render(<ListaProductoServicio articulos={articulosSimulados} alEliminar={manejarEliminacion} />);

    expect(screen.getByText('Control Veterinario')).toBeDefined();
    expect(screen.getByText('Antiparasitario')).toBeDefined();
    expect(screen.getByText('$15000')).toBeDefined();
  });

  it('debe llamar a la función onDelete con el ID correcto al hacer clic en eliminar', () => {
    const manejarEliminacion = vi.fn();
    render(<ListaProductoServicio articulos={articulosSimulados} alEliminar={manejarEliminacion} />);

    const botonesEliminar = screen.getAllByRole('button', { name: /Eliminar/i });
    fireEvent.click(botonesEliminar[0]);

    expect(manejarEliminacion).toHaveBeenCalledTimes(1);
    expect(manejarEliminacion).toHaveBeenCalledWith('1');
  });
});
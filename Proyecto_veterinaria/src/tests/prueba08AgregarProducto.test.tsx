// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Agregar productos', () => {
  it('agrega un producto desde el catálogo y actualiza el indicador del carrito', () => {
    renderAt('/productos');
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0]);

    expect(screen.getByRole('link', { name: /mi carrito 1/i })).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem('veterinaria.carrito') ?? '[]')[0].cantidad).toBe(1);
  });
});
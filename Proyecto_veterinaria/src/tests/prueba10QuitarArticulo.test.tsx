// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { agregarProductoAlCarrito } from '../services/servicioCarrito';
import { cargarCatalogo } from '../services/servicioDatos';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Quitar artículos', () => {
  it('muestra el estado vacío al quitar el último artículo', () => {
    agregarProductoAlCarrito([], cargarCatalogo().productos[0]);
    renderAt('/carrito');
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));

    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Ver productos' })).toBeTruthy();
  });
});
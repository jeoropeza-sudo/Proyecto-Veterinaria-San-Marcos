// @vitest-environment jsdom
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { agregarProductoAlCarrito } from '../services/servicioCarrito';
import { cargarCatalogo } from '../services/servicioDatos';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Totales del carrito', () => {
  it('actualiza subtotal y total al aumentar la cantidad', () => {
    const producto = cargarCatalogo().productos[0];
    agregarProductoAlCarrito([], producto);
    renderAt('/carrito');
    fireEvent.click(screen.getByRole('button', { name: `Aumentar cantidad de ${producto.nombre}` }));

    const subtotal = `$${(producto.precio * 2).toLocaleString('es-CL')}`;
    expect(within(screen.getByRole('article')).getByText(subtotal)).toBeTruthy();
    expect(screen.getByText('Total estimado').parentElement?.textContent).toContain(subtotal);
  });
});
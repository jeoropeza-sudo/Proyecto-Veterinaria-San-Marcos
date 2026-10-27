// @vitest-environment jsdom
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { agregarProductoAlCarrito } from '../services/servicioCarrito';
import { cargarCatalogo } from '../services/servicioDatos';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Límite de stock', () => {
  it('impide aumentar la cantidad por encima del stock disponible', () => {
    const catalogo = cargarCatalogo();
    const producto = { ...catalogo.productos[0], stock: 1 };
    window.localStorage.setItem(
      'veterinaria.productos',
      JSON.stringify([producto, ...catalogo.productos.slice(1)]),
    );
    agregarProductoAlCarrito([], producto);
    renderAt('/carrito');

    expect(screen.getByRole('button', { name: `Aumentar cantidad de ${producto.nombre}` }).hasAttribute('disabled')).toBe(true);
    expect(within(screen.getByRole('article')).getByText('1')).toBeTruthy();
    expect(screen.getByText('Total estimado').parentElement?.textContent).toContain(
      `$${producto.precio.toLocaleString('es-CL')}`,
    );
  });
});
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { cargarCatalogo } from '../services/servicioDatos';
import {
  agregarProductoAlCarrito,
  cargarCarrito,
  solicitarReservaServicio,
  establecerCantidadArticulo,
} from '../services/servicioCarrito';

describe('Persistencia y reglas del carrito', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('guarda productos y solicitudes de reserva, y restaura el carrito', () => {
    const catalogo = cargarCatalogo();
    const withProduct = agregarProductoAlCarrito([], catalogo.productos[0]);
    const withService = solicitarReservaServicio(withProduct, catalogo.servicios[0]);

    expect(cargarCarrito()).toEqual(withService);
    expect(withService.map((entrada) => entrada.tipo)).toEqual(['producto', 'servicio']);
  });

  it('acumula cantidad de producto sin superar el stock', () => {
    const producto = { ...cargarCatalogo().productos[0], stock: 1 };
    const cart = agregarProductoAlCarrito([], producto);

    expect(() => agregarProductoAlCarrito(cart, producto)).toThrow(/no hay más unidades/i);
    expect(() => establecerCantidadArticulo(cart, 'producto', producto.codigo, 2)).toThrow(/supera el stock/i);
  });

  it('muestra error cuando localStorage contiene un carrito inválido', () => {
    window.localStorage.setItem('veterinaria.carrito', '{invalido');

    expect(() => cargarCarrito()).toThrow(/está dañado/i);
  });
});

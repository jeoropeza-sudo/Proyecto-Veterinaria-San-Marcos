import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ItemCarrito } from '../types';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

afterEach(() => {
  vi.unstubAllGlobals();
});

const productosYServicios: ItemCarrito[] = [
  {
    tipo: 'producto',
    cantidad: 2,
    producto: {
      codigo: 'PR001',
      nombre: 'Alimento',
      categoria: 'Alimentos',
      stock: 5,
      precio: 2500,
      imagen: '/alimento.webp',
    },
  },
  {
    tipo: 'servicio',
    cantidad: 1,
    producto: {
      codigo: 'SV001',
      nombre: 'Consulta',
      categoria: 'Consulta',
      especie: 'Perro',
      duracion: '30 min',
      precio: 10000,
      detalle: 'Consulta general',
    },
  },
];

function prepararCarrito(): void {
  window.localStorage.setItem('veterinaria.session', JSON.stringify({
    id: 8,
    token: 'jwt-test',
    correo: 'cliente@sanmarcos.cl',
    rol: 'Cliente',
  }));
  window.localStorage.setItem('veterinaria.carrito', JSON.stringify(productosYServicios));
}

function respuestaJson(datos: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => datos,
    text: async () => JSON.stringify(datos),
  };
}

describe('Confirmación de compras en el carrito', () => {
  it('conserva el carrito y muestra el error cuando ms-órdenes rechaza la compra', async () => {
    prepararCarrito();
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes(':8084/')) {
        return respuestaJson({ message: 'Stock insuficiente.', fieldErrors: {} }, false, 409);
      }
      return respuestaJson([]);
    }));

    renderAt('/carrito');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Stock insuficiente.');
    expect(JSON.parse(window.localStorage.getItem('veterinaria.carrito') ?? '[]')).toEqual(productosYServicios);
  });

  it('retira solo los productos tras confirmar y conserva las reservas pendientes', async () => {
    prepararCarrito();
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes(':8084/')) {
        return respuestaJson({
          id: 42,
          clienteId: 8,
          emailCliente: 'cliente@sanmarcos.cl',
          fechaCreacion: '2026-11-23T12:00:00',
          estado: 'CONFIRMADA',
          total: 5000,
          items: [],
        }, true, 201);
      }
      return respuestaJson([]);
    }));

    renderAt('/carrito');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));

    expect(await screen.findByRole('status')).toHaveTextContent(/orden #42 quedó registrada/i);
    await waitFor(() => {
      const carritoGuardado = JSON.parse(window.localStorage.getItem('veterinaria.carrito') ?? '[]');
      expect(carritoGuardado).toHaveLength(1);
      expect(carritoGuardado[0].tipo).toBe('servicio');
    });
  });
});

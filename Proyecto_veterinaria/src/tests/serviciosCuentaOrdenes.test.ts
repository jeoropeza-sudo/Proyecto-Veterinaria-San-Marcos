import { afterEach, describe, expect, it, vi } from 'vitest';
import { autenticar } from '../services/servicioAutenticacion';
import { ErrorApi } from '../services/clienteApi';
import { vaciarProductosCarrito } from '../services/servicioCarrito';
import { crearOrden } from '../services/servicioOrdenes';
import type { ItemCarrito } from '../types';

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe('servicios de cuenta y órdenes', () => {
  it('inicia sesión contra ms-auth y traduce el rol devuelto por el backend', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({
        token: 'jwt-test',
        tipo: 'Bearer',
        id: 8,
        email: 'cliente@sanmarcos.cl',
        rol: 'CLIENTE',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const sesion = await autenticar(' cliente@sanmarcos.cl ', 'secreto');

    expect(sesion).toMatchObject({
      id: 8,
      token: 'jwt-test',
      correo: 'cliente@sanmarcos.cl',
      rol: 'Cliente',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8083/api/aute/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'cliente@sanmarcos.cl', password: 'secreto' }),
      }),
    );
  });

  it('preserva los errores de campo entregados por el API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({
        message: 'Revisa los campos indicados.',
        fieldErrors: { email: 'El formato del correo no es válido.' },
      }),
    }));

    await expect(autenticar('correo', 'secreto')).rejects.toMatchObject<Partial<ErrorApi>>({
      message: 'Revisa los campos indicados.',
      fieldErrors: { email: 'El formato del correo no es válido.' },
    });
  });

  it('registra una orden con token y artículos del carrito', async () => {
    const orden = {
      id: 42,
      clienteId: 8,
      emailCliente: 'cliente@sanmarcos.cl',
      fechaCreacion: '2026-11-23T12:00:00',
      estado: 'CONFIRMADA',
      total: 2500,
      items: [],
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(orden),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(crearOrden('jwt-test', [{ codigo: 'PR001', cantidad: 1 }])).resolves.toEqual(orden);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8084/api/ordenes',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer jwt-test' }),
        body: JSON.stringify({ items: [{ codigo: 'PR001', cantidad: 1 }] }),
      }),
    );
  });

  it('retira solo productos confirmados y conserva solicitudes de reserva', () => {
    const articulos: ItemCarrito[] = [
      {
        tipo: 'producto',
        cantidad: 1,
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

    const resultado = vaciarProductosCarrito(articulos);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].tipo).toBe('servicio');
    expect(JSON.parse(window.localStorage.getItem('veterinaria.carrito') ?? '[]')).toEqual(resultado);
  });
});

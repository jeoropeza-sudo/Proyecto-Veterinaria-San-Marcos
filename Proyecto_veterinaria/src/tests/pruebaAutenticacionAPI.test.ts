// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { autenticar, registrarCuenta } from '../services/servicioAutenticacion';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Servicio de autenticación', () => {
  it('registra una cuenta a través del microservicio', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await registrarCuenta(' NUEVO@correo.cl ', 'secreto123');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8090/api/aute/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nuevo@correo.cl', password: 'secreto123' }),
    });
  });

  it('valida el token y obtiene el rol antes de iniciar sesión', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'token-de-prueba' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 8,
        email: 'admin@sanmarcos.cl',
        rol: 'ADMIN',
      }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const sesion = await autenticar('admin@sanmarcos.cl', 'clave123');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:8090/api/aute/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'admin@sanmarcos.cl', password: 'clave123' }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:8090/api/aute/validar-token',
      { headers: { Authorization: 'Bearer token-de-prueba' } },
    );
    expect(sesion.usuario.rol).toBe('Administrador');
    expect(sesion.usuario.correo).toBe('admin@sanmarcos.cl');
    expect(sesion.token).toBe('token-de-prueba');
  });

  it('muestra el error del servicio cuando el correo ya está registrado', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'El correo ya está registrado.' }), { status: 409 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(registrarCuenta('cliente@correo.cl', 'secreto123'))
      .rejects.toThrow('El correo ya está registrado.');
  });

  it('muestra un mensaje claro cuando no se puede completar la solicitud', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(registrarCuenta('cliente@correo.cl', 'secreto123'))
      .rejects.toThrow('No pudimos completar tu solicitud. Inténtalo nuevamente más tarde.');
  });
});

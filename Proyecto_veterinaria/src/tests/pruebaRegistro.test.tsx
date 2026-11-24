// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Registro de cuentas', () => {
  it('permite abrir la página de registro desde el inicio de sesión', async () => {
    renderAt('/login');
    fireEvent.click(within(screen.getByRole('main')).getByRole('link', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('heading', { name: 'Crear cuenta' })).toBeTruthy();
  });

  it('registra la cuenta y vuelve al inicio de sesión', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    renderAt('/registro');

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'cliente@correo.cl' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto123' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'secreto123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

    expect(await screen.findByText('Tu cuenta se creó correctamente. Ya puedes iniciar sesión.')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('muestra los errores de correo y contraseña sin enviar el formulario', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderAt('/registro');

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'correo-invalido' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: '456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

    expect(screen.getByText('Ingresa un correo electrónico válido.')).toBeTruthy();
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeTruthy();
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

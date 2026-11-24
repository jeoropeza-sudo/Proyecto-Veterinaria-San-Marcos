// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Formulario de contacto', () => {
  it('envía la consulta y confirma el resultado', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    renderAt('/contacto');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@correo.cl' } });
    fireEvent.change(screen.getByLabelText('Motivo de contacto'), { target: { value: 'servicios' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Quisiera conocer los horarios.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect((await screen.findByRole('status')).textContent).toContain('Tu consulta fue enviada correctamente.');
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8090/api/consultas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Ana Pérez',
        correo: 'ana@correo.cl',
        asunto: 'servicios',
        mensaje: 'Quisiera conocer los horarios.',
      }),
    });
  });

  it('mantiene los datos y muestra un mensaje claro cuando no se envía', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    renderAt('/contacto');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@correo.cl' } });
    fireEvent.change(screen.getByLabelText('Motivo de contacto'), { target: { value: 'servicios' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Quisiera conocer los horarios.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect((await screen.findByRole('alert')).textContent).toContain('No pudimos enviar tu consulta.');
    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('Ana Pérez');
    expect(screen.queryByText(/versión académica|backend|microservicio/i)).toBeNull();
  });

  it('muestra el error junto al correo y no envía datos inválidos', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderAt('/contacto');

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'correo-invalido' } });
    fireEvent.change(screen.getByLabelText('Motivo de contacto'), { target: { value: 'servicios' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Quisiera conocer los horarios.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect(screen.getByText('Ingresa un correo electrónico válido.')).toBeTruthy();
    expect(screen.getByLabelText('Correo electrónico').getAttribute('aria-invalid')).toBe('true');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

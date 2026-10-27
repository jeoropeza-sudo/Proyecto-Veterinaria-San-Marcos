// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProveedorAutenticacion } from '../context/ContextoAutenticacion';
import { ProveedorCarrito } from '../context/ContextoCarrito';
import { ProveedorCatalogo } from '../context/ContextoCatalogo';
import { EnrutadorAplicacion } from '../router/EnrutadorAplicacion';

function renderizarRuta(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <ProveedorAutenticacion>
        <ProveedorCatalogo>
          <ProveedorCarrito>
            <EnrutadorAplicacion />
          </ProveedorCarrito>
        </ProveedorCatalogo>
      </ProveedorAutenticacion>
    </MemoryRouter>,
  );
}

describe('Páginas institucionales y novedades', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('muestra la página institucional con historia y misión', () => {
    renderizarRuta('/nosotros');

    expect(screen.getByRole('heading', { name: /sobre nosotros/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /nuestra misión/i })).toBeTruthy();
  });

  it('presenta novedades con enlaces a sus páginas de detalle', () => {
    renderizarRuta('/novedades');

    expect(screen.getByRole('heading', { name: /novedades/i })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /leer más/i })).toHaveLength(4);
    expect(screen.getAllByRole('link', { name: /leer más/i })[0].getAttribute('href')).toBe('/novedades/atencion-domicilio');
  });

  it('abre el detalle de una novedad y conecta con una sección relacionada', () => {
    renderizarRuta('/novedades/antiparasitarios');

    expect(screen.getByRole('heading', { name: /cuida a tu mascota de los parásitos/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /ver productos/i }).getAttribute('href')).toBe('/productos');
  });

  it('muestra una alternativa para un detalle de novedad inexistente', () => {
    renderizarRuta('/novedades/no-existe');

    expect(screen.getByRole('heading', { name: /no encontramos esta novedad/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /volver a novedades/i }).getAttribute('href')).toBe('/novedades');
  });

  it('valida el formulario de contacto e informa que es una demostración', () => {
    renderizarRuta('/contacto');

    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: 'Alexis' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'alexis@example.cl' } });
    fireEvent.change(screen.getByLabelText(/motivo de contacto/i), { target: { value: 'consulta' } });
    fireEvent.change(screen.getByLabelText(/^mensaje$/i), { target: { value: 'Necesito información.' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(screen.getByRole('status').textContent).toMatch(/no envía mensajes a la clínica/i);
  });
});

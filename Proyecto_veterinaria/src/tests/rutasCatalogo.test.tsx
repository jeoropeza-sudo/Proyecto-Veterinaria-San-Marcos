// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProveedorAutenticacion } from '../context/ContextoAutenticacion';
import { ProveedorCarrito } from '../context/ContextoCarrito';
import { ProveedorCatalogo } from '../context/ContextoCatalogo';
import { EnrutadorAplicacion } from '../router/EnrutadorAplicacion';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
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

describe('Catálogo y rutas de detalle', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renderiza una sola barra de navegación en el inicio', () => {
    renderAt('/');

    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(screen.getByRole('img', { name: /logo veterinaria san marcos/i })).toBeTruthy();
    expect(screen.getByText(/ubicación y horario/i)).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'Servicios' })).toHaveLength(2);
  });

  it('muestra productos iniciales y abre el detalle por código', () => {
    renderAt('/productos/ME001');

    expect(screen.getByRole('heading', { name: 'Amoxibay 250mg' })).toBeTruthy();
    expect(screen.getByText('Código ME001')).toBeTruthy();
  });

  it('muestra el detalle de servicio por código', () => {
    renderAt('/servicios/SV001');

    expect(screen.getByRole('heading', { name: 'Consulta general' })).toBeTruthy();
    expect(screen.getByText('Código SV001')).toBeTruthy();
  });

  it('muestra una salida clara para códigos que no existen', () => {
    renderAt('/productos/NO-EXISTE');

    expect(screen.getByRole('heading', { name: /no encontramos ese artículo/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /volver al catálogo/i }).getAttribute('href')).toBe('/productos');
  });

  it('permite registrar y editar productos desde administración', () => {
    renderAt('/admin');

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'admin@sanmarcos.cl' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'admin1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    fireEvent.change(screen.getByLabelText(/nombre del servicio\/producto/i), {
      target: { value: 'Producto nuevo de prueba' },
    });
    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: 'Producto' },
    });
    fireEvent.change(screen.getByLabelText(/precio/i), {
      target: { value: '5000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /registrar producto/i }));

    const filaProducto = screen.getByRole('row', { name: /Producto nuevo de prueba/ });
    fireEvent.click(within(filaProducto).getByRole('button', { name: /editar/i }));
    fireEvent.change(screen.getByLabelText(/nombre del servicio\/producto/i), {
      target: { value: 'Producto editado de prueba' },
    });
    fireEvent.change(screen.getByLabelText(/precio/i), {
      target: { value: '6000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    fireEvent.click(screen.getAllByRole('link', { name: 'Productos' })[0]);

    expect(screen.getByRole('heading', { name: 'Producto editado de prueba' })).toBeTruthy();
  }, 10000);
});

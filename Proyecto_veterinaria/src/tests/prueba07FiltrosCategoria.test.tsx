// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Filtros por categoría', () => {
  it('filtra productos y servicios según la categoría seleccionada', () => {
    const productos = renderAt('/productos');
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Antiparasitarios' } });
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'Nexgard' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Amoxibay 250mg' })).toBeNull();

    productos.unmount();
    renderAt('/servicios');
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Vacunación' } });
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByRole('heading', { name: 'Vacuna antirrábica canina' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Consulta general' })).toBeNull();
  });
});
// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Estado vacío del catálogo', () => {
  it('muestra el mensaje vacío cuando la búsqueda no encuentra productos', () => {
    renderAt('/productos');
    fireEvent.change(screen.getByLabelText('Buscar producto'), { target: { value: 'producto-inexistente' } });

    expect(screen.getByText('No hay productos que coincidan con la búsqueda.')).toBeTruthy();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
});
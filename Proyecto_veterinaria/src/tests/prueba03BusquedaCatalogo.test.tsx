// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Búsqueda del catálogo', () => {
  it('actualiza inmediatamente el catálogo al escribir una búsqueda', () => {
    renderAt('/productos');
    fireEvent.change(screen.getByLabelText('Buscar producto'), { target: { value: 'Nexgard' } });

    expect(screen.getByRole('heading', { name: 'Nexgard' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Amoxibay 250mg' })).toBeNull();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Búsqueda por código', () => {
  it('encuentra productos por código sin distinguir mayúsculas', () => {
    renderAt('/productos');
    fireEvent.change(screen.getByLabelText('Buscar producto'), { target: { value: 'me001' } });

    expect(screen.getByRole('heading', { name: 'Amoxibay 250mg' })).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
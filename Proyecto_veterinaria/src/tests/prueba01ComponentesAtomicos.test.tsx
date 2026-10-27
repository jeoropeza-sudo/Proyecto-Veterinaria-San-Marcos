// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Badge from '../Componentes/atomos/Badge';
import Button from '../Componentes/atomos/Button';

describe('Componentes atómicos', () => {
  it('renderiza Button y Badge con texto y clases según sus props', () => {
    render(
      <>
        <Button variant="success" size="sm" className="me-2">Comprar</Button>
        <Badge text="Nuevo" variant="warning" className="text-dark" />
      </>,
    );

    const button = screen.getByRole('button', { name: 'Comprar' });
    const badge = screen.getByText('Nuevo');

    expect(button.className).toContain('btn-success');
    expect(button.className).toContain('btn-sm');
    expect(button.className).toContain('me-2');
    expect(badge.className).toContain('bg-warning');
    expect(badge.className).toContain('text-dark');
  });
});
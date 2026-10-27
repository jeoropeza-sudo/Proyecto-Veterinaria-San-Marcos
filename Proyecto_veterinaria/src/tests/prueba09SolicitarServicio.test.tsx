// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Solicitar servicios', () => {
  it('permite solicitar un servicio y verlo en el carrito', () => {
    renderAt('/servicios');
    fireEvent.click(screen.getAllByRole('button', { name: 'Solicitar reserva' })[0]);
    fireEvent.click(screen.getByRole('link', { name: /mi carrito 1/i }));

    expect(screen.getByRole('heading', { name: 'Consulta general' })).toBeTruthy();
    expect(screen.getByText('Solicitud de reserva')).toBeTruthy();
  });
});
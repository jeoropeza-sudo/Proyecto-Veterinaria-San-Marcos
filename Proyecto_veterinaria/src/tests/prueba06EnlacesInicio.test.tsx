// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Inicio público', () => {
  it('muestra enlaces a los catálogos de productos y servicios', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: 'Ver Servicios Médicos' }).getAttribute('href')).toBe('/servicios');
    expect(screen.getByRole('link', { name: 'Farmacia y Productos' }).getAttribute('href')).toBe('/productos');
  });
});
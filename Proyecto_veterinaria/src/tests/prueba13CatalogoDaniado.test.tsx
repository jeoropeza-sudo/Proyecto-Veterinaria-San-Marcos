// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Errores de catálogo', () => {
  it('informa si los datos guardados del catálogo están dañados', () => {
    window.localStorage.setItem('veterinaria.productos', '{invalido');
    renderAt('/');

    expect(screen.getByRole('alert').textContent).toMatch(/datos guardados.*dañados/i);
  });
});
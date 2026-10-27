// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { cargarCatalogo } from '../services/servicioDatos';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Catálogo público', () => {
  it('renderiza una tarjeta por cada producto disponible en el catálogo', () => {
    const cantidadEsperada = cargarCatalogo().productos.length;
    renderAt('/productos');

    expect(screen.getAllByRole('article')).toHaveLength(cantidadEsperada);
  });
});
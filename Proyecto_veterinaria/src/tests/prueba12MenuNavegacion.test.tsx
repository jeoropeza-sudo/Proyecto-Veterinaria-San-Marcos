// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararEntornoInterfaz, renderAt } from './helpersInterfaz';

prepararEntornoInterfaz();

describe('Menú adaptable', () => {
  it('abre y cierra el menú de navegación', () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir navegación' }));

    const botonCerrar = screen.getByRole('button', { name: 'Cerrar navegación' });
    expect(botonCerrar.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('navbarSanMarcos')?.className).toContain('show');
    fireEvent.click(botonCerrar);

    expect(screen.getByRole('button', { name: 'Abrir navegación' }).getAttribute('aria-expanded')).toBe('false');
  });
});
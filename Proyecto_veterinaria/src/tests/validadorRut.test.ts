import { describe, it, expect } from 'vitest';
import { validarRut } from '../utils/validadorRut';

describe('Test 12: Algoritmo RUN Chileno (Módulo 11)', () => {
  it('debe validar correctamente un RUN chileno válido', () => {
    // 19.011.022-3 es un RUN matemáticamente válido
    // 12.345.678-5 es un RUN matemáticamente válido
    expect(validarRut('19.011.022-3')).toBe(true);
    expect(validarRut('190110223')).toBe(true);
    expect(validarRut('12.345.678-5')).toBe(true);
  });

  it('debe rechazar un RUN con dígito verificador incorrecto', () => {
    expect(validarRut('19.011.022-K')).toBe(false);
    expect(validarRut('12.345.678-9')).toBe(false);
  });
});
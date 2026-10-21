import { describe, it, expect } from 'vitest';
import { validarRut } from '../utils/validadorRut';

describe('Test 12: Algoritmo RUN Chileno (Módulo 11)', () => {
  it('debe validar correctamente un RUN chileno válido', () => {
   
    expect(validarRut('20.123.456-5')).toBe(true); 
    expect(validarRut('19.011.022-2')).toBe(true);
  });

  it('debe rechazar un RUN con dígito verificador incorrecto', () => {
    expect(validarRut('19.011.022-3')).toBe(false);
    expect(validarRut('12.345.678-9')).toBe(false);
  });
});
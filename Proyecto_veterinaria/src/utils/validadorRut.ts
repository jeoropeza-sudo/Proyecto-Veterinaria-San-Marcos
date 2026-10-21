export const validarRut = (rutCompleto: string): boolean => {
  if (!rutCompleto || typeof rutCompleto !== 'string') return false;

  const valor = rutCompleto.replace(/^0+/, '').replace(/\./g, '').replace(/-/g, '');
  if (valor.length < 2) return false;

  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1).toUpperCase();

  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = '';

  if (dvEsperado === 11) {
    dvCalculado = '0';
  } else if (dvEsperado === 10) {
    dvCalculado = 'K';
  } else {
    dvCalculado = dvEsperado.toString();
  }

  return dvCalculado === dv;
};
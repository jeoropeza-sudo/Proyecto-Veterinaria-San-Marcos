export const validarRut = (rutCompleto: string): boolean => {
  if (!rutCompleto || typeof rutCompleto !== 'string') return false;

 
  const valor = rutCompleto.replace(/^0+/, '').replace(/[^0-9kK]/g, '');
  if (valor.length < 2) return false;

  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1).toUpperCase();


  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplicador = 2;


  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvEsperadoNum = 11 - resto;

  let dvEsperado = '';
  if (dvEsperadoNum === 11) {
    dvEsperado = '0';
  } else if (dvEsperadoNum === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = dvEsperadoNum.toString();
  }

  return dv === dvEsperado;
};
export class ErrorApi extends Error {
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ErrorApi';
    this.fieldErrors = fieldErrors;
  }
}

function esObjeto(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function obtenerErroresCampo(value: unknown): Record<string, string> {
  if (!esObjeto(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

export async function leerRespuestaApi<T>(respuesta: Response): Promise<T> {
  const cuerpo = await respuesta.text();
  let datos: unknown;

  if (cuerpo) {
    try {
      datos = JSON.parse(cuerpo);
    } catch {
      if (respuesta.ok) {
        throw new ErrorApi('El servidor devolvió una respuesta inválida.');
      }
      datos = { message: cuerpo };
    }
  }

  if (!respuesta.ok) {
    const detalle = esObjeto(datos) ? datos : {};
    const mensaje = typeof detalle.message === 'string'
      ? detalle.message
      : typeof detalle.mensaje === 'string'
        ? detalle.mensaje
        : `La solicitud falló (${respuesta.status}).`;
    throw new ErrorApi(mensaje, obtenerErroresCampo(detalle.fieldErrors));
  }

  if (datos === undefined) {
    throw new ErrorApi('El servidor devolvió una respuesta vacía.');
  }

  return datos as T;
}

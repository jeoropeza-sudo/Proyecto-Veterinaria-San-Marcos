export interface DatosConsulta {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

const API_URL = 'http://localhost:8090/api/consultas';

export async function enviarConsulta(datos: DatosConsulta): Promise<void> {
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No pudimos enviar tu consulta. Inténtalo nuevamente más tarde.', { cause: error });
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error('No pudimos enviar tu consulta. Inténtalo nuevamente más tarde.');
  }
}

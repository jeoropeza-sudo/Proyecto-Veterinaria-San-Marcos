const API_BASE_URL = 'http://localhost:8090';

async function enviarSolicitud(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = window.localStorage.getItem('veterinaria.token');

  if (path.startsWith('/api/ordenes') && !token) {
    throw new Error('Tu sesión no tiene un token válido. Inicia sesión nuevamente para consultar tus compras.');
  }

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No se pudo completar la solicitud. Inténtalo nuevamente más tarde.', { cause: error });
    }
    throw error;
  }

  if (!response.ok) {
    if (response.status === 401 && path.startsWith('/api/ordenes')) {
      throw new Error('Tu sesión expiró o el token no es válido. Inicia sesión nuevamente para consultar tus compras.');
    }

    const cuerpo = await response.text();
    let mensaje: string | null = null;
    try {
      const datos: unknown = JSON.parse(cuerpo);
      if (typeof datos === 'string' && datos.trim()) {
        mensaje = datos;
      } else if (typeof datos === 'object' && datos !== null) {
        const objeto = datos as Record<string, unknown>;
        for (const clave of ['message', 'mensaje', 'error', 'detail']) {
          const valor = objeto[clave];
          if (typeof valor === 'string' && valor.trim()) {
            mensaje = valor;
            break;
          }
        }
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
    throw new Error(mensaje ?? `La solicitud no pudo completarse (HTTP ${response.status}).`);
  }

  return response;
}

export async function solicitarApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await enviarSolicitud(path, init);
  const cuerpo = await response.text();
  if (!cuerpo.trim()) {
    throw new Error('La respuesta recibida no contiene datos.');
  }

  try {
    return JSON.parse(cuerpo) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('La respuesta recibida tiene un formato inválido.', { cause: error });
    }
    throw error;
  }
}

export async function ejecutarApi(path: string, init?: RequestInit): Promise<void> {
  await enviarSolicitud(path, init);
}

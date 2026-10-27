import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../context/useAutenticacion';

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

function obtenerRutaRedireccion(estado: unknown): string {
  if (typeof estado !== 'object' || estado === null || !('from' in estado)) {
    return '/';
  }

  const from = (estado as LoginLocationState).from?.pathname;
  return from?.startsWith('/') && !from.startsWith('//') ? from : '/';
}

export function PaginaInicioSesion() {
  const { usuario, iniciarSesion } = useAutenticacion();
  const location = useLocation();
  const [correo, establecerCorreo] = useState('');
  const [contrasena, establecerContrasena] = useState('');
  const [error, establecerError] = useState<string | null>(null);

  if (usuario) {
    return <Navigate to={obtenerRutaRedireccion(location.state)} replace />;
  }

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    establecerError(null);
    if (!iniciarSesion(correo, contrasena)) {
      establecerError('No se pudo iniciar sesión. Revisa las credenciales e inténtalo nuevamente.');
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="h3 mb-2">Iniciar sesión</h1>
              <p className="text-secondary mb-4">Ingresa para continuar en Veterinaria San Marcos.</p>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}

              <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label htmlFor="login-correo" className="form-label">Correo electrónico</label>
                  <input
                    id="login-correo"
                    className="form-control"
                    type="email"
                    autoComplete="username"
                    value={correo}
                    onChange={(event) => establecerCorreo(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="login-contrasena" className="form-label">Contraseña</label>
                  <input
                    id="login-contrasena"
                    className="form-control"
                    type="password"
                    autoComplete="current-password"
                    value={contrasena}
                    onChange={(event) => establecerContrasena(event.target.value)}
                    required
                  />
                </div>
                <button className="btn text-white fw-bold w-100" style={{ backgroundColor: '#153259' }} type="submit">
                  Ingresar
                </button>
              </form>

              <Link className="d-inline-block mt-3" to="/">Volver al inicio</Link>
            </div>
          </section>
          <p className="small text-secondary mt-3">
            Autenticación de demostración para el proyecto académico; no protege datos reales ni sustituye un backend.
          </p>
        </div>
      </div>
    </main>
  );
}

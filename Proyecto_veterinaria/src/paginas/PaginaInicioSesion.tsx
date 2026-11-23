import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../context/useAutenticacion';
import { ErrorApi } from '../services/clienteApi';

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
  const [erroresCampo, establecerErroresCampo] = useState<Record<string, string>>({});

  if (usuario) {
    return <Navigate to={obtenerRutaRedireccion(location.state)} replace />;
  }

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    establecerError(null);
    establecerErroresCampo({});
    try {
      await iniciarSesion(correo, contrasena);
    } catch (errorInicioSesion) {
      if (errorInicioSesion instanceof ErrorApi) {
        establecerError(errorInicioSesion.message);
        establecerErroresCampo(errorInicioSesion.fieldErrors);
      } else {
        establecerError(errorInicioSesion instanceof Error
          ? errorInicioSesion.message
          : 'No se pudo iniciar sesión. Inténtalo nuevamente.');
      }
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

              <form onSubmit={manejarEnvio}>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <div className="mb-3">
                  <label htmlFor="login-correo" className="form-label">Correo electrónico</label>
                  <input
                    id="login-correo"
                    className={`form-control${erroresCampo.email ? ' is-invalid' : ''}`}
                    type="email"
                    autoComplete="username"
                    value={correo}
                    onChange={(event) => {
                      establecerCorreo(event.target.value);
                      establecerErroresCampo((actuales) => ({ ...actuales, email: '' }));
                    }}
                    aria-invalid={Boolean(erroresCampo.email)}
                    aria-describedby={erroresCampo.email ? 'login-correo-error' : undefined}
                    required
                  />
                  {erroresCampo.email && <div id="login-correo-error" className="invalid-feedback">{erroresCampo.email}</div>}
                </div>
                <div className="mb-4">
                  <label htmlFor="login-contrasena" className="form-label">Contraseña</label>
                  <input
                    id="login-contrasena"
                    className={`form-control${erroresCampo.password ? ' is-invalid' : ''}`}
                    type="password"
                    autoComplete="current-password"
                    value={contrasena}
                    onChange={(event) => {
                      establecerContrasena(event.target.value);
                      establecerErroresCampo((actuales) => ({ ...actuales, password: '' }));
                    }}
                    aria-invalid={Boolean(erroresCampo.password)}
                    aria-describedby={erroresCampo.password ? 'login-contrasena-error' : undefined}
                    required
                  />
                  {erroresCampo.password && <div id="login-contrasena-error" className="invalid-feedback">{erroresCampo.password}</div>}
                </div>
                <button className="btn text-white fw-bold w-100" style={{ backgroundColor: '#153259' }} type="submit">
                  Ingresar
                </button>
              </form>

              <p className="mt-3 mb-0 text-secondary">
                ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
              </p>
              <Link className="d-inline-block mt-3" to="/">Volver al inicio</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

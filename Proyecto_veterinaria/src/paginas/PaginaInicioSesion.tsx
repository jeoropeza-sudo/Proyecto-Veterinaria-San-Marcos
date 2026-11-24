import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../context/useAutenticacion';
import { validarCorreo } from '../utils/validadorCorreo';

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
  success?: string;
}

type CampoInicioSesion = 'correo' | 'contrasena';
type ErroresInicioSesion = Partial<Record<CampoInicioSesion, string>>;

function obtenerRutaRedireccion(estado: unknown): string {
  if (typeof estado !== 'object' || estado === null || !('from' in estado)) {
    return '/';
  }

  const from = (estado as LoginLocationState).from?.pathname;
  return from?.startsWith('/') && !from.startsWith('//') ? from : '/';
}

function obtenerMensajeRegistro(estado: unknown): string | null {
  if (typeof estado !== 'object' || estado === null || !('success' in estado)) {
    return null;
  }

  return typeof estado.success === 'string' ? estado.success : null;
}

export function PaginaInicioSesion() {
  const { usuario, iniciarSesion } = useAutenticacion();
  const location = useLocation();
  const [correo, establecerCorreo] = useState('');
  const [contrasena, establecerContrasena] = useState('');
  const [erroresCampos, establecerErroresCampos] = useState<ErroresInicioSesion>({});
  const [error, establecerError] = useState<string | null>(null);
  const [estaEnviando, establecerEstaEnviando] = useState(false);
  const mensajeRegistro = obtenerMensajeRegistro(location.state);

  if (usuario) {
    return <Navigate to={obtenerRutaRedireccion(location.state)} replace />;
  }

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errores: ErroresInicioSesion = {};
    if (!correo.trim()) {
      errores.correo = 'Ingresa tu correo electrónico.';
    } else if (!validarCorreo(correo)) {
      errores.correo = 'Ingresa un correo electrónico válido.';
    }
    if (!contrasena) errores.contrasena = 'Ingresa tu contraseña.';
    establecerErroresCampos(errores);
    if (Object.keys(errores).length > 0) return;

    establecerError(null);
    establecerEstaEnviando(true);
    try {
      await iniciarSesion(correo, contrasena);
    } catch (error) {
      establecerError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      establecerEstaEnviando(false);
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

              {mensajeRegistro && <div className="alert alert-success" role="status">{mensajeRegistro}</div>}
              {error && <div className="alert alert-danger" role="alert">{error}</div>}

              <form onSubmit={manejarEnvio} noValidate>
                <div className="mb-3">
                  <label htmlFor="login-correo" className="form-label">Correo electrónico</label>
                  <input
                    id="login-correo"
                    className={`form-control${erroresCampos.correo ? ' is-invalid' : ''}`}
                    type="email"
                    autoComplete="username"
                    value={correo}
                    aria-invalid={Boolean(erroresCampos.correo)}
                    aria-describedby={erroresCampos.correo ? 'login-correo-error' : undefined}
                    onChange={(event) => {
                      establecerCorreo(event.target.value);
                      establecerErroresCampos((actuales) => ({ ...actuales, correo: undefined }));
                    }}
                    required
                  />
                  {erroresCampos.correo && (
                    <div className="invalid-feedback" id="login-correo-error">{erroresCampos.correo}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="login-contrasena" className="form-label">Contraseña</label>
                  <input
                    id="login-contrasena"
                    className={`form-control${erroresCampos.contrasena ? ' is-invalid' : ''}`}
                    type="password"
                    autoComplete="current-password"
                    value={contrasena}
                    aria-invalid={Boolean(erroresCampos.contrasena)}
                    aria-describedby={erroresCampos.contrasena ? 'login-contrasena-error' : undefined}
                    onChange={(event) => {
                      establecerContrasena(event.target.value);
                      establecerErroresCampos((actuales) => ({ ...actuales, contrasena: undefined }));
                    }}
                    required
                  />
                  {erroresCampos.contrasena && (
                    <div className="invalid-feedback" id="login-contrasena-error">{erroresCampos.contrasena}</div>
                  )}
                </div>
                <button
                  className="btn text-white fw-bold w-100"
                  style={{ backgroundColor: '#153259' }}
                  type="submit"
                  disabled={estaEnviando}
                >
                  {estaEnviando ? 'Ingresando...' : 'Ingresar'}
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-2">¿No tienes una cuenta?</p>
              <Link className="btn btn-outline-primary fw-bold w-100" to="/registro">
                Crear cuenta
              </Link>
              <Link className="d-inline-block mt-3" to="/">Volver al inicio</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

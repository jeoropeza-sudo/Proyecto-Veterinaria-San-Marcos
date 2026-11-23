import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ErrorApi } from '../services/clienteApi';
import { registrar } from '../services/servicioAutenticacion';

export function PaginaRegistro() {
  const [correo, establecerCorreo] = useState('');
  const [contrasena, establecerContrasena] = useState('');
  const [confirmacionContrasena, establecerConfirmacionContrasena] = useState('');
  const [erroresCampo, establecerErroresCampo] = useState<Record<string, string>>({});
  const [error, establecerError] = useState<string | null>(null);
  const [registroCompletado, establecerRegistroCompletado] = useState(false);
  const [enviando, establecerEnviando] = useState(false);

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    establecerError(null);
    establecerErroresCampo({});

    if (contrasena !== confirmacionContrasena) {
      establecerErroresCampo({ passwordConfirmacion: 'Las contraseñas no coinciden.' });
      return;
    }

    establecerEnviando(true);
    try {
      await registrar(correo, contrasena);
      establecerRegistroCompletado(true);
    } catch (errorRegistro) {
      if (errorRegistro instanceof ErrorApi) {
        establecerError(errorRegistro.message);
        establecerErroresCampo(errorRegistro.fieldErrors);
      } else {
        establecerError(errorRegistro instanceof Error
          ? errorRegistro.message
          : 'No se pudo crear la cuenta. Inténtalo nuevamente.');
      }
    } finally {
      establecerEnviando(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="h3 mb-2">Crear cuenta</h1>
              <p className="text-secondary mb-4">Regístrate para comprar productos y consultar tus órdenes.</p>
              {registroCompletado ? (
                <div className="alert alert-success" role="status">
                  Cuenta creada. Ya puedes <Link to="/login" className="alert-link">iniciar sesión</Link>.
                </div>
              ) : (
                <form onSubmit={manejarEnvio}>
                  {error && <div className="alert alert-danger" role="alert">{error}</div>}
                  <div className="mb-3">
                    <label htmlFor="registro-correo" className="form-label">Correo electrónico</label>
                    <input
                      id="registro-correo"
                      className={`form-control${erroresCampo.email ? ' is-invalid' : ''}`}
                      type="email"
                      autoComplete="email"
                      value={correo}
                      onChange={(event) => {
                        establecerCorreo(event.target.value);
                        establecerErroresCampo((actuales) => ({ ...actuales, email: '' }));
                      }}
                      aria-invalid={Boolean(erroresCampo.email)}
                      aria-describedby={erroresCampo.email ? 'registro-correo-error' : undefined}
                      required
                    />
                    {erroresCampo.email && <div id="registro-correo-error" className="invalid-feedback">{erroresCampo.email}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="registro-contrasena" className="form-label">Contraseña</label>
                    <input
                      id="registro-contrasena"
                      className={`form-control${erroresCampo.password ? ' is-invalid' : ''}`}
                      type="password"
                      autoComplete="new-password"
                      minLength={6}
                      value={contrasena}
                      onChange={(event) => {
                        establecerContrasena(event.target.value);
                        establecerErroresCampo((actuales) => ({ ...actuales, password: '' }));
                      }}
                      aria-invalid={Boolean(erroresCampo.password)}
                      aria-describedby={erroresCampo.password ? 'registro-contrasena-error' : undefined}
                      required
                    />
                    {erroresCampo.password && <div id="registro-contrasena-error" className="invalid-feedback">{erroresCampo.password}</div>}
                    <div className="form-text">Debe tener al menos 6 caracteres.</div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="registro-confirmacion" className="form-label">Confirmar contraseña</label>
                    <input
                      id="registro-confirmacion"
                      className={`form-control${erroresCampo.passwordConfirmacion ? ' is-invalid' : ''}`}
                      type="password"
                      autoComplete="new-password"
                      value={confirmacionContrasena}
                      onChange={(event) => {
                        establecerConfirmacionContrasena(event.target.value);
                        establecerErroresCampo((actuales) => ({ ...actuales, passwordConfirmacion: '' }));
                      }}
                      aria-invalid={Boolean(erroresCampo.passwordConfirmacion)}
                      aria-describedby={erroresCampo.passwordConfirmacion ? 'registro-confirmacion-error' : undefined}
                      required
                    />
                    {erroresCampo.passwordConfirmacion && <div id="registro-confirmacion-error" className="invalid-feedback">{erroresCampo.passwordConfirmacion}</div>}
                  </div>
                  <button
                    className="btn text-white fw-bold w-100"
                    style={{ backgroundColor: '#153259' }}
                    type="submit"
                    disabled={enviando}
                  >
                    {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
                  </button>
                </form>
              )}
              <p className="mt-3 mb-0 text-secondary">
                ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

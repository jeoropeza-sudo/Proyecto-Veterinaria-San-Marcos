import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarCuenta } from '../services/servicioAutenticacion';
import { validarCorreo } from '../utils/validadorCorreo';

type CampoRegistro = 'correo' | 'contrasena' | 'confirmacionContrasena';
type ErroresRegistro = Partial<Record<CampoRegistro, string>>;

export function PaginaRegistro() {
  const navigate = useNavigate();
  const [correo, establecerCorreo] = useState('');
  const [contrasena, establecerContrasena] = useState('');
  const [confirmacionContrasena, establecerConfirmacionContrasena] = useState('');
  const [erroresCampos, establecerErroresCampos] = useState<ErroresRegistro>({});
  const [error, establecerError] = useState<string | null>(null);
  const [estaEnviando, establecerEstaEnviando] = useState(false);

  const manejarEnvio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    establecerError(null);
    const errores: ErroresRegistro = {};
    if (!correo.trim()) {
      errores.correo = 'Ingresa tu correo electrónico.';
    } else if (!validarCorreo(correo)) {
      errores.correo = 'Ingresa un correo electrónico válido.';
    }
    if (!contrasena) {
      errores.contrasena = 'Ingresa una contraseña.';
    } else if (contrasena.length < 6) {
      errores.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (!confirmacionContrasena) {
      errores.confirmacionContrasena = 'Confirma tu contraseña.';
    } else if (contrasena !== confirmacionContrasena) {
      errores.confirmacionContrasena = 'Las contraseñas no coinciden.';
    }
    establecerErroresCampos(errores);
    if (Object.keys(errores).length > 0) return;

    establecerEstaEnviando(true);
    try {
      await registrarCuenta(correo, contrasena);
      navigate('/login', {
        replace: true,
        state: { success: 'Tu cuenta se creó correctamente. Ya puedes iniciar sesión.' },
      });
    } catch (error) {
      establecerError(error instanceof Error ? error.message : 'No se pudo crear la cuenta.');
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
              <h1 className="h3 mb-2">Crear cuenta</h1>
              <p className="text-secondary mb-4">Regístrate para continuar en Veterinaria San Marcos.</p>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}

              <form onSubmit={manejarEnvio} noValidate>
                <div className="mb-3">
                  <label htmlFor="registro-correo" className="form-label">Correo electrónico</label>
                  <input
                    id="registro-correo"
                    className={`form-control${erroresCampos.correo ? ' is-invalid' : ''}`}
                    type="email"
                    autoComplete="email"
                    value={correo}
                    aria-invalid={Boolean(erroresCampos.correo)}
                    aria-describedby={erroresCampos.correo ? 'registro-correo-error' : undefined}
                    onChange={(event) => {
                      establecerCorreo(event.target.value);
                      establecerErroresCampos((actuales) => ({ ...actuales, correo: undefined }));
                    }}
                    required
                  />
                  {erroresCampos.correo && (
                    <div className="invalid-feedback" id="registro-correo-error">{erroresCampos.correo}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="registro-contrasena" className="form-label">Contraseña</label>
                  <input
                    id="registro-contrasena"
                    className={`form-control${erroresCampos.contrasena ? ' is-invalid' : ''}`}
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={contrasena}
                    aria-invalid={Boolean(erroresCampos.contrasena)}
                    aria-describedby={erroresCampos.contrasena ? 'registro-contrasena-error' : undefined}
                    onChange={(event) => {
                      establecerContrasena(event.target.value);
                      establecerErroresCampos((actuales) => ({ ...actuales, contrasena: undefined }));
                    }}
                    required
                  />
                  {erroresCampos.contrasena && (
                    <div className="invalid-feedback" id="registro-contrasena-error">{erroresCampos.contrasena}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="registro-confirmar-contrasena" className="form-label">Confirmar contraseña</label>
                  <input
                    id="registro-confirmar-contrasena"
                    className={`form-control${erroresCampos.confirmacionContrasena ? ' is-invalid' : ''}`}
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={confirmacionContrasena}
                    aria-invalid={Boolean(erroresCampos.confirmacionContrasena)}
                    aria-describedby={erroresCampos.confirmacionContrasena ? 'registro-confirmar-error' : undefined}
                    onChange={(event) => {
                      establecerConfirmacionContrasena(event.target.value);
                      establecerErroresCampos((actuales) => ({ ...actuales, confirmacionContrasena: undefined }));
                    }}
                    required
                  />
                  {erroresCampos.confirmacionContrasena && (
                    <div className="invalid-feedback" id="registro-confirmar-error">
                      {erroresCampos.confirmacionContrasena}
                    </div>
                  )}
                </div>
                <button
                  className="btn text-white fw-bold w-100"
                  style={{ backgroundColor: '#04BFAD' }}
                  type="submit"
                  disabled={estaEnviando}
                >
                  {estaEnviando ? 'Creando cuenta...' : 'Registrarme'}
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-2">¿Ya tienes una cuenta?</p>
              <Link className="btn btn-outline-primary fw-bold w-100" to="/login">
                Iniciar sesión
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { enviarConsulta, type DatosConsulta } from '../services/servicioConsultas';
import { validarCorreo } from '../utils/validadorCorreo';

type CampoConsulta = keyof DatosConsulta;
type ErroresConsulta = Partial<Record<CampoConsulta, string>>;

export function PaginaContacto() {
  const [mensajeEnviado, establecerMensajeEnviado] = useState(false);
  const [erroresCampos, establecerErroresCampos] = useState<ErroresConsulta>({});
  const [error, establecerError] = useState<string | null>(null);
  const [estaEnviando, establecerEstaEnviando] = useState(false);

  const limpiarErrorCampo = (campo: CampoConsulta) => {
    establecerErroresCampos((actuales) => ({ ...actuales, [campo]: undefined }));
    establecerMensajeEnviado(false);
  };

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    establecerError(null);
    establecerMensajeEnviado(false);
    const formulario = evento.currentTarget;
    const formularioDatos = new FormData(formulario);
    const obtenerValor = (campo: CampoConsulta): string => {
      const valor = formularioDatos.get(campo);
      return typeof valor === 'string' ? valor : '';
    };
    const datos: DatosConsulta = {
      nombre: obtenerValor('nombre').trim(),
      correo: obtenerValor('correo').trim(),
      asunto: obtenerValor('asunto').trim(),
      mensaje: obtenerValor('mensaje').trim(),
    };
    const errores: ErroresConsulta = {};
    if (!datos.nombre) errores.nombre = 'Ingresa tu nombre.';
    if (!datos.correo) {
      errores.correo = 'Ingresa tu correo electrónico.';
    } else if (!validarCorreo(datos.correo)) {
      errores.correo = 'Ingresa un correo electrónico válido.';
    }
    if (!datos.asunto) errores.asunto = 'Selecciona el motivo de contacto.';
    if (!datos.mensaje) errores.mensaje = 'Escribe tu consulta.';
    establecerErroresCampos(errores);
    if (Object.keys(errores).length > 0) return;

    establecerEstaEnviando(true);
    try {
      await enviarConsulta(datos);
      establecerMensajeEnviado(true);
      establecerErroresCampos({});
      formulario.reset();
    } catch (error) {
      establecerError(error instanceof Error ? error.message : 'No pudimos enviar tu consulta. Inténtalo nuevamente más tarde.');
    } finally {
      establecerEstaEnviando(false);
    }
  };

  return (
    <main>
      <header className="py-5 text-white" style={{ background: 'linear-gradient(120deg, #153259, #36BBD9)' }}>
        <div className="container-fluid px-4 px-lg-5 py-lg-3">
          <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#04BFAD', color: '#153259' }}>
            Estamos para ayudarte
          </span>
          <h1 className="display-5 fw-bold">Contáctanos</h1>
          <p className="lead mb-0">Escríbenos tus dudas sobre atención y servicios veterinarios.</p>
        </div>
      </header>

      <section className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-lg-5">
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h4 fw-bold mb-4" style={{ color: '#153259' }}>Información de contacto</h2>
                <address className="text-secondary">
                  Av. San Marcos #123<br />
                  Rancagua, Región de O'Higgins<br />
                  Chile
                </address>
                <p className="text-secondary mb-2"><strong>Horario:</strong> lunes a viernes, 09:00 a 19:00</p>
                <p className="text-secondary"><strong>Sábados:</strong> 09:00 a 14:00</p>
                <p className="small text-secondary">Para urgencias o confirmar disponibilidad, comunícate directamente con la clínica.</p>
                <Link to="/servicios" className="btn btn-outline-primary fw-bold">Revisar servicios</Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h4 fw-bold mb-4" style={{ color: '#153259' }}>Envíanos una consulta</h2>
                {mensajeEnviado && (
                  <div className="alert alert-success" role="status">
                    Tu consulta fue enviada correctamente.
                  </div>
                )}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={manejarEnvio} noValidate>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="contacto-nombre">Nombre</label>
                    <input
                      className={`form-control${erroresCampos.nombre ? ' is-invalid' : ''}`}
                      id="contacto-nombre"
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      aria-invalid={Boolean(erroresCampos.nombre)}
                      aria-describedby={erroresCampos.nombre ? 'contacto-nombre-error' : undefined}
                      onChange={() => limpiarErrorCampo('nombre')}
                      required
                    />
                    {erroresCampos.nombre && (
                      <div className="invalid-feedback" id="contacto-nombre-error">{erroresCampos.nombre}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="contacto-correo">Correo electrónico</label>
                    <input
                      className={`form-control${erroresCampos.correo ? ' is-invalid' : ''}`}
                      id="contacto-correo"
                      name="correo"
                      type="email"
                      autoComplete="email"
                      aria-invalid={Boolean(erroresCampos.correo)}
                      aria-describedby={erroresCampos.correo ? 'contacto-correo-error' : undefined}
                      onChange={() => limpiarErrorCampo('correo')}
                      required
                    />
                    {erroresCampos.correo && (
                      <div className="invalid-feedback" id="contacto-correo-error">{erroresCampos.correo}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="contacto-asunto">Motivo de contacto</label>
                    <select
                      className={`form-select${erroresCampos.asunto ? ' is-invalid' : ''}`}
                      id="contacto-asunto"
                      name="asunto"
                      defaultValue=""
                      aria-invalid={Boolean(erroresCampos.asunto)}
                      aria-describedby={erroresCampos.asunto ? 'contacto-asunto-error' : undefined}
                      onChange={() => limpiarErrorCampo('asunto')}
                      required
                    >
                      <option value="" disabled>Selecciona una opción</option>
                      <option value="consulta">Consulta general</option>
                      <option value="servicios">Servicios y precios</option>
                      <option value="urgencia">Información sobre urgencias</option>
                      <option value="sugerencia">Sugerencia</option>
                    </select>
                    {erroresCampos.asunto && (
                      <div className="invalid-feedback" id="contacto-asunto-error">{erroresCampos.asunto}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" htmlFor="contacto-mensaje">Mensaje</label>
                    <textarea
                      className={`form-control${erroresCampos.mensaje ? ' is-invalid' : ''}`}
                      id="contacto-mensaje"
                      name="mensaje"
                      rows={5}
                      aria-invalid={Boolean(erroresCampos.mensaje)}
                      aria-describedby={erroresCampos.mensaje ? 'contacto-mensaje-error' : undefined}
                      onChange={() => limpiarErrorCampo('mensaje')}
                      required
                    />
                    {erroresCampos.mensaje && (
                      <div className="invalid-feedback" id="contacto-mensaje-error">{erroresCampos.mensaje}</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn text-white fw-bold w-100"
                    style={{ backgroundColor: '#153259' }}
                    disabled={estaEnviando}
                  >
                    {estaEnviando ? 'Enviando...' : 'Enviar consulta'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

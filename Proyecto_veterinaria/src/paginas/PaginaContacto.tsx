import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export function PaginaContacto() {
  const [mensajeEnviado, establecerMensajeEnviado] = useState(false);
  const [errorEnvio, establecerErrorEnvio] = useState<string | null>(null);
  const [enviando, establecerEnviando] = useState(false);

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (enviando) return;

    const formulario = evento.currentTarget;
    const datosFormulario = new FormData(formulario);

    const nuevaConsulta = {
      nombre: String(datosFormulario.get('nombre') || '').trim(),
      correo: String(datosFormulario.get('correo') || '').trim(),
      asunto: String(datosFormulario.get('asunto') || '').trim(),
      mensaje: String(datosFormulario.get('mensaje') || '').trim(),
    };

    establecerEnviando(true);
    establecerMensajeEnviado(false);
    establecerErrorEnvio(null);

    try {
      const respuesta = await fetch('http://localhost:8080/api/consultas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaConsulta),
      });

      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      establecerMensajeEnviado(true);
      formulario.reset();
    } catch (error) {
      console.error('Error al enviar la consulta:', error);
      establecerErrorEnvio('No se pudo enviar la consulta. Verifica que el servidor backend esté encendido.');
    } finally {
      establecerEnviando(false);
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
                    ¡Consulta enviada y registrada correctamente! Nuestro equipo la revisará a la brevedad.
                  </div>
                )}

                {errorEnvio && (
                  <div className="alert alert-danger" role="alert">
                    {errorEnvio}
                  </div>
                )}

                <form onSubmit={manejarEnvio}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="contacto-nombre">Nombre</label>
                    <input className="form-control" id="contacto-nombre" name="nombre" type="text" autoComplete="name" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="contacto-correo">Correo electrónico</label>
                    <input className="form-control" id="contacto-correo" name="correo" type="email" autoComplete="email" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="contacto-asunto">Motivo de contacto</label>
                    <select className="form-select" id="contacto-asunto" name="asunto" defaultValue="" required>
                      <option value="" disabled>Selecciona una opción</option>
                      <option value="Consulta general">Consulta general</option>
                      <option value="Servicios y precios">Servicios y precios</option>
                      <option value="Información sobre urgencias">Información sobre urgencias</option>
                      <option value="Sugerencia">Sugerencia</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" htmlFor="contacto-mensaje">Mensaje</label>
                    <textarea className="form-control" id="contacto-mensaje" name="mensaje" rows={5} maxLength={500} required />
                  </div>
                  <button
                    type="submit"
                    className="btn text-white fw-bold w-100"
                    style={{ backgroundColor: '#153259' }}
                    disabled={enviando}
                  >
                    {enviando ? 'Enviando consulta...' : 'Enviar consulta'}
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
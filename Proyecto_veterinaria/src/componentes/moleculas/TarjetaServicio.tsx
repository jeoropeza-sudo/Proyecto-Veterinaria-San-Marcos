import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Servicio } from '../../types';
import { useAutenticacion } from '../../context/useAutenticacion';
import { crearReserva } from '../../services/servicioReservas';

export function TarjetaServicio({ servicio }: { servicio: Servicio }) {
  const { usuario } = useAutenticacion();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreCliente, setNombreCliente] = useState(
    usuario ? `${usuario.nombre} ${usuario.apellidos}` : ''
  );
  const [emailCliente, setEmailCliente] = useState(usuario?.correo || '');
  const [nombreMascota, setNombreMascota] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [solicitudRealizada, setSolicitudRealizada] = useState(false);

  const manejarReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await crearReserva({
        nombreCliente,
        emailCliente,
        nombreMascota,
        servicio: servicio.nombre,
        fecha,
        hora,
      });
      setSolicitudRealizada(true);
      setMostrarModal(false);
      alert(`¡Reserva confirmada para ${servicio.nombre}!`);
    } catch (error) {
      console.error(error);
      alert('No se pudo conectar con el servidor de reservas (puerto 8084).');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <article className="card h-100 border-0 shadow-sm overflow-hidden">
        {servicio.imagen && (
          <img
            src={servicio.imagen}
            className="card-img-top"
            alt={servicio.nombre}
            loading="lazy"
            style={{ height: '190px', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80';
            }}
          />
        )}
        <div className="card-body d-flex flex-column p-4">
          <span className="badge rounded-pill text-bg-light align-self-start mb-3">
            {servicio.categoria}
          </span>
          <h2 className="h5 card-title fw-bold">{servicio.nombre}</h2>
          <p className="text-secondary small mb-3">
            {servicio.especie} · {servicio.duracion}
          </p>
          <p className="card-text flex-grow-1">{servicio.detalle}</p>
          <p className="fw-bold fs-4 mb-3" style={{ color: '#153259' }}>
            Desde ${servicio.precio.toLocaleString('es-CL')}
          </p>
          <div className="d-grid gap-2 mt-auto">
            <Link
              className="btn btn-outline-primary"
              style={{ borderColor: '#153259', color: '#153259' }}
              to={`/servicios/${servicio.codigo}`}
            >
              Ver detalle
            </Link>
            <button
              type="button"
              className="btn text-white fw-semibold"
              style={{ backgroundColor: '#04BFAD' }}
              onClick={() => setMostrarModal(true)}
            >
              {solicitudRealizada ? 'Agendar otra hora' : 'Solicitar reserva'}
            </button>
          </div>
        </div>
      </article>

      {mostrarModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header" style={{ backgroundColor: '#153259', color: 'white' }}>
                <h5 className="modal-title">Reservar: {servicio.nombre}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMostrarModal(false)}
                />
              </div>
              <form onSubmit={manejarReserva}>
                <div className="modal-body d-grid gap-3">
                  <div>
                    <label className="form-label fw-semibold">Nombre del dueño</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      value={emailCliente}
                      onChange={(e) => setEmailCliente(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Nombre de la mascota</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: Firulais"
                      value={nombreMascota}
                      onChange={(e) => setNombreMascota(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Fecha</label>
                      <input
                        type="date"
                        className="form-control"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Hora</label>
                      <input
                        type="time"
                        className="form-control"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn text-white fw-semibold"
                    style={{ backgroundColor: '#04BFAD' }}
                    disabled={enviando}
                  >
                    {enviando ? 'Guardando...' : 'Confirmar Reserva'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Reserva } from '../types';
import {
  obtenerReservas,
  cambiarEstadoReserva,
  eliminarReserva,
} from '../services/servicioReservas';
import '../admin.css';

interface Consulta {
  id: number;
  nombre: string;
  correo: string;
  telefono?: string | null;
  asunto: string;
  mensaje: string;
  respondida: boolean;
  fechaCreacion?: string;
}

export function PaginaConsultasAdmin() {
  const [vistaActiva, setVistaActiva] = useState<'reservas' | 'consultas'>('reservas');

  // Estados para Reservas (puerto 8084)
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargandoReservas, setCargandoReservas] = useState(true);
  const [errorReservas, setErrorReservas] = useState<string | null>(null);

  // Estados para Consultas (puerto 8080)
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [cargandoConsultas, setCargandoConsultas] = useState(true);
  const [errorConsultas, setErrorConsultas] = useState<string | null>(null);

  const cargarReservas = async () => {
    setCargandoReservas(true);
    setErrorReservas(null);
    try {
      const datos = await obtenerReservas();
      setReservas(datos);
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setErrorReservas(
        'No se pudieron cargar las reservas. Verifica que el microservicio ms-reserva esté corriendo en el puerto 8084.'
      );
    } finally {
      setCargandoReservas(false);
    }
  };

  const cargarConsultas = async () => {
    setCargandoConsultas(true);
    setErrorConsultas(null);
    try {
      const respuesta = await fetch('http://localhost:8080/api/consultas');
      if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
      const datos: Consulta[] = await respuesta.json();
      setConsultas(datos);
    } catch (err) {
      console.error('Error al cargar consultas:', err);
      setErrorConsultas(
        'No se pudieron cargar las consultas. Verifica que el backend esté corriendo en el puerto 8080.'
      );
    } finally {
      setCargandoConsultas(false);
    }
  };

  useEffect(() => {
    cargarReservas();
    cargarConsultas();
  }, []);

  const actualizarEstadoReserva = async (id: number, nuevoEstado: string) => {
    try {
      await cambiarEstadoReserva(id, nuevoEstado);
      await cargarReservas();
    } catch (err) {
      console.error('Error al cambiar estado de reserva:', err);
      alert('No se pudo actualizar el estado de la reserva.');
    }
  };

  const borrarReserva = async (id: number, cliente: string) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar la reserva de "${cliente}"?`);
    if (!confirmar) return;
    try {
      await eliminarReserva(id);
      await cargarReservas();
    } catch (err) {
      console.error('Error al eliminar reserva:', err);
      alert('No se pudo eliminar la reserva.');
    }
  };

  const marcarComoGestionada = async (id: number) => {
    try {
      const respuesta = await fetch(`http://localhost:8080/api/consultas/${id}/responder`, {
        method: 'PUT',
      });
      if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
      await cargarConsultas();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('No se pudo actualizar el estado de la consulta.');
    }
  };

  const eliminarConsulta = async (id: number, nombre: string) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar la consulta de "${nombre}"?`);
    if (!confirmar) return;
    try {
      const respuesta = await fetch(`http://localhost:8080/api/consultas/${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
      await cargarConsultas();
    } catch (err) {
      console.error('Error al eliminar consulta:', err);
      alert('No se pudo eliminar la consulta.');
    }
  };

  const formatearFecha = (fechaIso?: string) => {
    if (!fechaIso) return 'Sin fecha';
    return new Date(fechaIso).toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const badgeEstadoReserva = (estado?: string) => {
    if (estado === 'CONFIRMADA') return 'bg-success';
    if (estado === 'CANCELADA') return 'bg-danger';
    return 'bg-warning text-dark';
  };

  return (
    <main className="admin-page">
      <div className="container admin-page__container py-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <p className="admin-eyebrow mb-1">VETERINARIA SAN MARCOS · ADMINISTRACIÓN</p>
            <h1 className="h2 fw-bold mb-0" style={{ color: '#153259' }}>
              Gestión de reservas/consultas
            </h1>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary fw-semibold"
              onClick={vistaActiva === 'reservas' ? cargarReservas : cargarConsultas}
              disabled={vistaActiva === 'reservas' ? cargandoReservas : cargandoConsultas}
            >
              Actualizar listado
            </button>
            <Link to="/admin" className="btn btn-secondary fw-semibold">
              ← Volver al panel
            </Link>
          </div>
        </div>

        {/* Pestañas para alternar entre Reservas y Consultas */}
        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className={`btn fw-semibold ${
              vistaActiva === 'reservas' ? 'text-white' : 'btn-outline-secondary'
            }`}
            style={vistaActiva === 'reservas' ? { backgroundColor: '#04BFAD' } : undefined}
            onClick={() => setVistaActiva('reservas')}
          >
            Reservas de Servicios ({reservas.length})
          </button>
          <button
            type="button"
            className={`btn fw-semibold ${
              vistaActiva === 'consultas' ? 'text-white' : 'btn-outline-secondary'
            }`}
            style={vistaActiva === 'consultas' ? { backgroundColor: '#153259' } : undefined}
            onClick={() => setVistaActiva('consultas')}
          >
            Consultas de Contacto ({consultas.length})
          </button>
        </div>

        {/* VISTA DE RESERVAS (ms-reserva en puerto 8084) */}
        {vistaActiva === 'reservas' && (
          <>
            {errorReservas && (
              <div className="alert alert-danger" role="alert">
                {errorReservas}
              </div>
            )}

            {cargandoReservas ? (
              <div className="text-center py-5 text-secondary">Cargando reservas agendadas...</div>
            ) : reservas.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                <h2 className="h5 fw-bold" style={{ color: '#153259' }}>
                  No hay reservas registradas
                </h2>
                <p className="text-secondary mb-0">
                  Cuando un cliente solicite una hora desde Servicios, aparecerá aquí.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {reservas.map((reserva) => (
                  <div className="col-12" key={reserva.id}>
                    <div className="card border-0 shadow-sm rounded-4">
                      <div className="card-body p-4">
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <span
                              className={`badge rounded-pill me-2 ${badgeEstadoReserva(
                                reserva.estado
                              )}`}
                            >
                              {reserva.estado || 'PENDIENTE'}
                            </span>
                            <span className="badge rounded-pill bg-light text-dark border">
                              {reserva.servicio}
                            </span>
                            <h2 className="h5 fw-bold mt-2 mb-1" style={{ color: '#153259' }}>
                              {reserva.nombreCliente} · Mascota: {reserva.nombreMascota}
                            </h2>
                            <p className="small text-secondary mb-0">
                              {reserva.emailCliente} · Fecha: <strong>{reserva.fecha}</strong> a las{' '}
                              <strong>{reserva.hora}</strong>
                            </p>
                          </div>

                          <div className="d-flex flex-wrap gap-2">
                            {reserva.id && reserva.estado !== 'CONFIRMADA' && (
                              <button
                                type="button"
                                className="btn btn-sm btn-success fw-semibold"
                                onClick={() => actualizarEstadoReserva(reserva.id!, 'CONFIRMADA')}
                              >
                                Confirmar
                              </button>
                            )}
                            {reserva.id && reserva.estado !== 'CANCELADA' && (
                              <button
                                type="button"
                                className="btn btn-sm btn-warning fw-semibold"
                                onClick={() => actualizarEstadoReserva(reserva.id!, 'CANCELADA')}
                              >
                                Cancelar
                              </button>
                            )}
                            {reserva.id && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger fw-semibold"
                                onClick={() => borrarReserva(reserva.id!, reserva.nombreCliente)}
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* VISTA DE CONSULTAS (puerto 8080) */}
        {vistaActiva === 'consultas' && (
          <>
            {errorConsultas && (
              <div className="alert alert-danger" role="alert">
                {errorConsultas}
              </div>
            )}

            {cargandoConsultas ? (
              <div className="text-center py-5 text-secondary">Cargando mensajes recibidos...</div>
            ) : consultas.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                <h2 className="h5 fw-bold" style={{ color: '#153259' }}>
                  No hay consultas registradas
                </h2>
                <p className="text-secondary mb-0">
                  Cuando un cliente envíe un mensaje desde Contacto, aparecerá aquí.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {consultas.map((consulta) => (
                  <div className="col-12" key={consulta.id}>
                    <div className="card border-0 shadow-sm rounded-4">
                      <div className="card-body p-4">
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <span
                              className={`badge rounded-pill me-2 ${
                                consulta.respondida ? 'bg-success' : 'bg-warning text-dark'
                              }`}
                            >
                              {consulta.respondida ? 'Leída / Gestionada' : 'Pendiente'}
                            </span>
                            <span className="badge rounded-pill bg-light text-dark border">
                              {consulta.asunto}
                            </span>
                            <h2 className="h5 fw-bold mt-2 mb-1" style={{ color: '#153259' }}>
                              {consulta.nombre}
                            </h2>
                            <p className="small text-secondary mb-0">
                              {consulta.correo} · Recibido: {formatearFecha(consulta.fechaCreacion)}
                            </p>
                          </div>

                          <div className="d-flex flex-wrap gap-2">
                            {!consulta.respondida && (
                              <button
                                type="button"
                                className="btn btn-sm btn-success fw-semibold"
                                onClick={() => marcarComoGestionada(consulta.id)}
                              >
                                Marcar como leída
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger fw-semibold"
                              onClick={() => eliminarConsulta(consulta.id, consulta.nombre)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>

                        <hr className="my-3" />
                        <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-line' }}>
                          {consulta.mensaje}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
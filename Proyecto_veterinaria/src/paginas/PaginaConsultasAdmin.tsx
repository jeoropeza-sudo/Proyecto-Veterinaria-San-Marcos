import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarConsultas = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch('http://localhost:8080/api/consultas');
      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }
      const datos: Consulta[] = await respuesta.json();
      setConsultas(datos);
    } catch (err) {
      console.error('Error al cargar consultas:', err);
      setError('No se pudieron cargar las consultas. Verifica que el backend esté corriendo en el puerto 8080.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  const marcarComoGestionada = async (id: number) => {
    try {
      const respuesta = await fetch(`http://localhost:8080/api/consultas/${id}/responder`, {
        method: 'PUT',
      });
      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }
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
      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }
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

  return (
    <main className="admin-page">
      <div className="container admin-page__container py-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <p className="admin-eyebrow mb-1">VETERINARIA SAN MARCOS · ADMINISTRACIÓN</p>
            <h1 className="h2 fw-bold mb-0" style={{ color: '#153259' }}>Gestión de consultas</h1>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary fw-semibold"
              onClick={cargarConsultas}
              disabled={cargando}
            >
              Actualizar listado
            </button>
            <Link to="/admin" className="btn btn-secondary fw-semibold">
              ← Volver al panel
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {cargando ? (
          <div className="text-center py-5 text-secondary">Cargando mensajes recibidos...</div>
        ) : consultas.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
            <h2 className="h5 fw-bold" style={{ color: '#153259' }}>No hay consultas registradas</h2>
            <p className="text-secondary mb-0">Cuando un cliente envíe un mensaje desde Contacto, aparecerá aquí.</p>
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
      </div>
    </main>
  );
}
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerUsuariosAdmin, type PerfilCliente } from '../services/servicioPerfilCliente';

function mostrarFecha(fecha: string | null): string {
  if (!fecha) return '—';
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime()) ? '—' : valor.toLocaleDateString('es-CL');
}

export function PaginaUsuariosAdmin() {
  const [usuarios, establecerUsuarios] = useState<PerfilCliente[]>([]);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState<string | null>(null);

  const cargarUsuarios = useCallback(async () => {
    establecerCargando(true);
    establecerError(null);
    try {
      establecerUsuarios(await obtenerUsuariosAdmin());
    } catch (errorCarga) {
      establecerError(errorCarga instanceof Error ? errorCarga.message : 'No se pudo cargar la lista de usuarios.');
    } finally {
      establecerCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  return (
    <main className="container py-4 py-lg-5">
      <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-uppercase small fw-semibold text-secondary mb-1">Administración</p>
          <h1 className="h2 mb-0" style={{ color: '#153259' }}>Usuarios registrados</h1>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-primary" onClick={() => void cargarUsuarios()} disabled={cargando}>
            Actualizar
          </button>
          <Link to="/admin" className="btn btn-secondary">← Volver al panel</Link>
        </div>
      </header>

      <p className="text-secondary">Consulta perfiles registrados y sus datos de contacto.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {cargando ? (
        <p className="text-secondary py-4" role="status">Cargando usuarios…</p>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>RUT</th>
                  <th>Rol</th>
                  <th>Comuna / región</th>
                  <th>Actualización</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-secondary py-4">No hay usuarios registrados.</td></tr>
                ) : usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{[usuario.nombre, usuario.apellidos].filter(Boolean).join(' ') || '—'}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.run || '—'}</td>
                    <td><span className="badge text-bg-light">{usuario.rol}</span></td>
                    <td>{[usuario.comuna, usuario.region].filter(Boolean).join(', ') || '—'}</td>
                    <td>{mostrarFecha(usuario.fechaActualizacion)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAutenticacion } from '../context/useAutenticacion';
import {
  actualizarUsuarioAdmin,
  crearUsuarioAdmin,
  eliminarUsuarioAdmin,
  obtenerUsuariosAdmin,
  type DatosActualizacionPerfil,
  type PerfilCliente,
} from '../services/servicioPerfilCliente';

const FORMULARIO_VACIO: DatosActualizacionPerfil = {
  run: '',
  nombre: '',
  apellidos: '',
  fechaNacimiento: null,
  region: '',
  comuna: '',
  direccion: '',
};

function mostrarFecha(fecha: string | null): string {
  if (!fecha) return '—';
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime()) ? '—' : valor.toLocaleDateString('es-CL');
}

function mostrarError(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar la solicitud.';
}

export function PaginaUsuariosAdmin() {
  const { usuario: usuarioActual } = useAutenticacion();
  const [usuarios, establecerUsuarios] = useState<PerfilCliente[]>([]);
  const [cargando, establecerCargando] = useState(true);
  const [guardando, establecerGuardando] = useState(false);
  const [error, establecerError] = useState<string | null>(null);
  const [mensaje, establecerMensaje] = useState<string | null>(null);
  const [usuarioEditando, establecerUsuarioEditando] = useState<PerfilCliente | null>(null);
  const [formulario, establecerFormulario] = useState<DatosActualizacionPerfil>(FORMULARIO_VACIO);
  const [email, establecerEmail] = useState('');
  const [password, establecerPassword] = useState('');
  const [rol, establecerRol] = useState<'ADMIN' | 'CLIENTE'>('CLIENTE');

  const cargarUsuarios = useCallback(async () => {
    establecerCargando(true);
    establecerError(null);
    try {
      establecerUsuarios(await obtenerUsuariosAdmin());
    } catch (errorCarga) {
      establecerError(mostrarError(errorCarga));
    } finally {
      establecerCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  const limpiarFormulario = () => {
    establecerUsuarioEditando(null);
    establecerFormulario(FORMULARIO_VACIO);
    establecerEmail('');
    establecerPassword('');
    establecerRol('CLIENTE');
    establecerError(null);
    establecerMensaje(null);
  };

  const iniciarEdicion = (usuario: PerfilCliente) => {
    establecerUsuarioEditando(usuario);
    establecerFormulario({
      run: usuario.run ?? '',
      nombre: usuario.nombre ?? '',
      apellidos: usuario.apellidos ?? '',
      fechaNacimiento: usuario.fechaNacimiento,
      region: usuario.region ?? '',
      comuna: usuario.comuna ?? '',
      direccion: usuario.direccion ?? '',
    });
    establecerError(null);
    establecerMensaje(null);
    document.getElementById('usuario-formulario')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const guardarUsuario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    establecerError(null);
    establecerMensaje(null);

    if (!formulario.nombre.trim() || !formulario.apellidos.trim()) {
      establecerError('Ingresa el nombre y los apellidos del usuario.');
      return;
    }
    if (usuarioEditando && usuarioEditando.idAuth === null) {
      establecerError('Este perfil no está vinculado a una cuenta y no se puede editar desde aquí.');
      return;
    }
    if (!usuarioEditando && (!email.trim() || password.length < 6)) {
      establecerError('Ingresa un correo y una contraseña de al menos 6 caracteres.');
      return;
    }

    establecerGuardando(true);
    try {
      if (usuarioEditando) {
        if (usuarioEditando.idAuth === null) {
          establecerError('Este perfil no está vinculado a una cuenta y no se puede editar desde aquí.');
          return;
        }
        await actualizarUsuarioAdmin(usuarioEditando.idAuth, formulario);
        establecerMensaje('Los datos del usuario se actualizaron.');
      } else {
        await crearUsuarioAdmin({
          ...formulario,
          email: email.trim().toLocaleLowerCase(),
          password,
          rol,
        });
        establecerMensaje('La cuenta y el perfil se crearon correctamente.');
      }
      establecerUsuarioEditando(null);
      establecerFormulario(FORMULARIO_VACIO);
      establecerEmail('');
      establecerPassword('');
      establecerRol('CLIENTE');
      await cargarUsuarios();
    } catch (errorAccion) {
      establecerError(mostrarError(errorAccion));
    } finally {
      establecerGuardando(false);
    }
  };

  const eliminarUsuario = async (usuario: PerfilCliente) => {
    if (usuario.idAuth === null) {
      establecerError('Este perfil no está vinculado a una cuenta y no se puede eliminar desde aquí.');
      return;
    }
    if (usuario.email.toLocaleLowerCase() === usuarioActual?.correo.toLocaleLowerCase()) {
      establecerError('No puedes eliminar tu propia cuenta.');
      return;
    }
    if (!window.confirm(`¿Eliminar la cuenta de ${usuario.email}? Esta acción no se puede deshacer.`)) return;

    establecerError(null);
    establecerMensaje(null);
    try {
      await eliminarUsuarioAdmin(usuario.idAuth);
      establecerMensaje(`Se eliminó la cuenta de ${usuario.email}.`);
      if (usuarioEditando?.idAuth === usuario.idAuth) limpiarFormulario();
      await cargarUsuarios();
    } catch (errorAccion) {
      establecerError(mostrarError(errorAccion));
    }
  };

  const cambiarCampo = <K extends keyof DatosActualizacionPerfil>(
    campo: K,
    valor: DatosActualizacionPerfil[K],
  ) => establecerFormulario((actual) => ({ ...actual, [campo]: valor }));

  return (
    <main className="container py-4 py-lg-5">
      <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-uppercase small fw-semibold text-secondary mb-1">Administración</p>
          <h1 className="h2 mb-0" style={{ color: '#153259' }}>Gestión de usuarios</h1>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-primary" onClick={() => void cargarUsuarios()} disabled={cargando}>
            Actualizar
          </button>
          <Link to="/admin" className="btn text-white" style={{ backgroundColor: '#153259' }}>← Volver al panel</Link>
        </div>
      </header>

      <p className="text-secondary">Crea cuentas, actualiza perfiles y elimina usuarios. El correo y el rol no se modifican al editar.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section id="usuario-formulario" className="card border-0 shadow-sm mb-4" aria-labelledby="usuario-formulario-titulo">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
            <div>
              <h2 id="usuario-formulario-titulo" className="h4 mb-1" style={{ color: '#153259' }}>
                {usuarioEditando ? 'Editar perfil' : 'Crear usuario'}
              </h2>
              <p className="small text-secondary mb-0">
                {usuarioEditando ? `Cuenta: ${usuarioEditando.email}` : 'La cuenta y su perfil se guardan juntos.'}
              </p>
            </div>
            {usuarioEditando && (
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </div>

          <form onSubmit={guardarUsuario}>
            <div className="row g-3">
              {!usuarioEditando && (
                <>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="usuario-email">Correo electrónico</label>
                    <input
                      id="usuario-email"
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(evento) => establecerEmail(evento.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="usuario-password">Contraseña inicial</label>
                    <input
                      id="usuario-password"
                      type="password"
                      minLength={6}
                      className="form-control"
                      value={password}
                      onChange={(evento) => establecerPassword(evento.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="usuario-rol">Rol</label>
                    <select id="usuario-rol" className="form-select" value={rol} onChange={(evento) => establecerRol(evento.target.value as 'ADMIN' | 'CLIENTE')}>
                      <option value="CLIENTE">Cliente</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </>
              )}
              <div className="col-md-6">
                <label className="form-label" htmlFor="usuario-run">RUT</label>
                <input id="usuario-run" className="form-control" value={formulario.run} onChange={(evento) => cambiarCampo('run', evento.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="usuario-nombre">Nombre</label>
                <input id="usuario-nombre" className="form-control" value={formulario.nombre} onChange={(evento) => cambiarCampo('nombre', evento.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="usuario-apellidos">Apellidos</label>
                <input id="usuario-apellidos" className="form-control" value={formulario.apellidos} onChange={(evento) => cambiarCampo('apellidos', evento.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="usuario-fecha">Fecha de nacimiento</label>
                <input id="usuario-fecha" type="date" className="form-control" value={formulario.fechaNacimiento ?? ''} onChange={(evento) => cambiarCampo('fechaNacimiento', evento.target.value || null)} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="usuario-region">Región</label>
                <input id="usuario-region" className="form-control" value={formulario.region} onChange={(evento) => cambiarCampo('region', evento.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="usuario-comuna">Comuna</label>
                <input id="usuario-comuna" className="form-control" value={formulario.comuna} onChange={(evento) => cambiarCampo('comuna', evento.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="usuario-direccion">Dirección</label>
                <input id="usuario-direccion" className="form-control" value={formulario.direccion} onChange={(evento) => cambiarCampo('direccion', evento.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn text-white fw-semibold mt-4" style={{ backgroundColor: '#04a99a' }} disabled={guardando}>
              {guardando ? 'Guardando…' : usuarioEditando ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </form>
        </div>
      </section>

      <section aria-labelledby="usuarios-lista-titulo">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 id="usuarios-lista-titulo" className="h4 mb-0" style={{ color: '#153259' }}>Usuarios registrados</h2>
          <span className="badge rounded-pill" style={{ backgroundColor: '#e5f8f6', color: '#153259' }}>{usuarios.length} usuarios</span>
        </div>
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
                    <th><span className="visually-hidden">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-secondary py-4">No hay usuarios registrados.</td></tr>
                  ) : usuarios.map((usuario) => {
                    const esUsuarioActual = usuario.email.toLocaleLowerCase() === usuarioActual?.correo.toLocaleLowerCase();
                    return (
                      <tr key={usuario.id}>
                        <td>{[usuario.nombre, usuario.apellidos].filter(Boolean).join(' ') || '—'}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.run || '—'}</td>
                        <td><span className="badge text-bg-light">{usuario.rol}</span></td>
                        <td>{[usuario.comuna, usuario.region].filter(Boolean).join(', ') || '—'}</td>
                        <td>{mostrarFecha(usuario.fechaActualizacion)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => iniciarEdicion(usuario)}
                              disabled={usuario.idAuth === null}
                            >Editar</button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => void eliminarUsuario(usuario)}
                              disabled={usuario.idAuth === null || esUsuarioActual}
                              aria-label={`Eliminar ${usuario.email}`}
                              title={esUsuarioActual ? 'No puedes eliminar tu propia cuenta' : undefined}
                            >Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

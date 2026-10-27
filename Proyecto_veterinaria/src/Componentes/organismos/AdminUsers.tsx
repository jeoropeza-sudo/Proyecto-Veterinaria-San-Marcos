import { useMemo, useState, type FormEvent } from 'react';
import {
  actualizarUsuario,
  agregarUsuario,
  cargarUsuarios,
  eliminarUsuario,
  type UsuarioAdministrado,
} from '../../services/servicioUsuarios';
import type { Usuario } from '../../types';

type RolUsuario = Usuario['rol'];

const formularioVacio: UsuarioAdministrado = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  fechaNacimiento: '',
  rol: 'Cliente',
  region: '',
  comuna: '',
  direccion: '',
};

function cargarEstadoInicial(): { usuarios: UsuarioAdministrado[]; error: string | null } {
  try {
    return { usuarios: cargarUsuarios(), error: null };
  } catch (error) {
    return {
      usuarios: [],
      error: error instanceof Error ? error.message : 'No se pudieron cargar los usuarios.',
    };
  }
}

export function AdminUsers() {
  const [estadoInicial] = useState(cargarEstadoInicial);
  const [usuarios, setUsuarios] = useState(estadoInicial.usuarios);
  const [error, establecerError] = useState(estadoInicial.error);
  const [mensaje, establecerMensaje] = useState('');
  const [formulario, establecerFormulario] = useState<UsuarioAdministrado>(formularioVacio);
  const [runEditando, establecerRunEditando] = useState<string | null>(null);
  const [busqueda, establecerBusqueda] = useState('');
  const [filtroRol, establecerFiltroRol] = useState<'Todos' | RolUsuario>('Todos');

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase();
    return usuarios.filter((usuario) => {
      const coincideTexto = !texto
        || [usuario.run, usuario.nombre, usuario.apellidos, usuario.correo, usuario.comuna]
          .some((valor) => valor.toLocaleLowerCase().includes(texto));
      return coincideTexto && (filtroRol === 'Todos' || usuario.rol === filtroRol);
    });
  }, [busqueda, filtroRol, usuarios]);

  const actualizarCampo = <K extends keyof UsuarioAdministrado>(campo: K, valor: UsuarioAdministrado[K]) => {
    establecerFormulario((actual) => ({ ...actual, [campo]: valor }));
  };

  const limpiarFormulario = () => {
    establecerFormulario(formularioVacio);
    establecerRunEditando(null);
    establecerError(null);
  };

  const guardar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    establecerError(null);
    establecerMensaje('');

    try {
      const datos: UsuarioAdministrado = {
        ...formulario,
        run: formulario.run.trim(),
        nombre: formulario.nombre.trim(),
        apellidos: formulario.apellidos.trim(),
        correo: formulario.correo.trim(),
        region: formulario.region.trim(),
        comuna: formulario.comuna.trim(),
        direccion: formulario.direccion.trim(),
      };
      const actualizados = runEditando
        ? actualizarUsuario(runEditando, datos)
        : agregarUsuario(datos);
      setUsuarios(actualizados);
      establecerMensaje(runEditando ? 'Los datos del usuario se actualizaron.' : 'El usuario se agregó correctamente.');
      limpiarFormulario();
    } catch (guardarError) {
      establecerError(guardarError instanceof Error ? guardarError.message : 'No se pudo guardar el usuario.');
    }
  };

  const editar = (usuario: UsuarioAdministrado) => {
    establecerFormulario({ ...usuario });
    establecerRunEditando(usuario.run);
    establecerError(null);
    establecerMensaje('');
    document.getElementById('admin-user-run')?.focus();
  };

  const eliminar = (usuario: UsuarioAdministrado) => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellidos}?`)) return;
    try {
      setUsuarios(eliminarUsuario(usuario.run));
      if (runEditando === usuario.run) limpiarFormulario();
      establecerError(null);
      establecerMensaje('El usuario se eliminó correctamente.');
    } catch (eliminarError) {
      establecerError(eliminarError instanceof Error ? eliminarError.message : 'No se pudo eliminar el usuario.');
    }
  };

  return (
    <div className="admin-users">
      <form className="admin-users__form" onSubmit={guardar}>
        <div className="admin-users__form-heading">
          <div>
            <p className="admin-eyebrow">{runEditando ? 'ACTUALIZAR REGISTRO' : 'NUEVO REGISTRO'}</p>
            <h2 className="admin-section-title">{runEditando ? 'Editar usuario' : 'Registrar usuario'}</h2>
            <p>Completa los datos de identificación y contacto.</p>
          </div>
          {runEditando && (
            <button type="button" className="btn btn-outline-secondary" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label htmlFor="admin-user-run" className="form-label">RUN</label>
            <input id="admin-user-run" className="form-control" value={formulario.run} onChange={(event) => actualizarCampo('run', event.target.value)} placeholder="12.345.678-5" required />
            <div className="form-text">Se valida el dígito verificador chileno.</div>
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="admin-user-name" className="form-label">Nombre</label>
            <input id="admin-user-name" className="form-control" value={formulario.nombre} onChange={(event) => actualizarCampo('nombre', event.target.value)} maxLength={50} required />
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="admin-user-lastname" className="form-label">Apellidos</label>
            <input id="admin-user-lastname" className="form-control" value={formulario.apellidos} onChange={(event) => actualizarCampo('apellidos', event.target.value)} maxLength={100} required />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="admin-user-email" className="form-label">Correo electrónico</label>
            <input id="admin-user-email" type="email" className="form-control" value={formulario.correo} onChange={(event) => actualizarCampo('correo', event.target.value)} maxLength={100} required />
          </div>
          <div className="col-12 col-md-3">
            <label htmlFor="admin-user-birth" className="form-label">Fecha de nacimiento</label>
            <input id="admin-user-birth" type="date" className="form-control" value={formulario.fechaNacimiento ?? ''} onChange={(event) => actualizarCampo('fechaNacimiento', event.target.value)} />
          </div>
          <div className="col-12 col-md-3">
            <label htmlFor="admin-user-role" className="form-label">Rol</label>
            <select id="admin-user-role" className="form-select" value={formulario.rol} onChange={(event) => actualizarCampo('rol', event.target.value as RolUsuario)}>
              <option value="Cliente">Cliente</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="admin-user-region" className="form-label">Región</label>
            <input id="admin-user-region" className="form-control" value={formulario.region} onChange={(event) => actualizarCampo('region', event.target.value)} required />
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="admin-user-commune" className="form-label">Comuna</label>
            <input id="admin-user-commune" className="form-control" value={formulario.comuna} onChange={(event) => actualizarCampo('comuna', event.target.value)} required />
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="admin-user-address" className="form-label">Dirección</label>
            <input id="admin-user-address" className="form-control" value={formulario.direccion} onChange={(event) => actualizarCampo('direccion', event.target.value)} maxLength={300} required />
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
        {mensaje && <div className="alert alert-success mt-3 mb-0" role="status">{mensaje}</div>}
        <div className="admin-users__form-actions">
          <button type="submit" className="btn btn-primary">{runEditando ? 'Guardar cambios' : 'Agregar usuario'}</button>
          {!runEditando && <button type="reset" className="btn btn-outline-secondary" onClick={limpiarFormulario}>Limpiar</button>}
        </div>
      </form>

      <section className="admin-users__table-wrap" aria-labelledby="tabla-usuarios-title">
        <div className="admin-users__table-heading">
          <div>
            <p className="admin-eyebrow">DIRECTORIO</p>
            <h2 id="tabla-usuarios-title" className="admin-section-title">Usuarios registrados</h2>
            <p>Busca, revisa y administra los usuarios registrados.</p>
          </div>
          <span className="admin-users__total">{usuarios.length} {usuarios.length === 1 ? 'registro' : 'registros'}</span>
        </div>

        <div className="admin-users__filters">
          <div>
            <label className="form-label" htmlFor="admin-users-search">Buscar usuario</label>
            <input id="admin-users-search" className="form-control" type="search" value={busqueda} onChange={(event) => establecerBusqueda(event.target.value)} placeholder="Nombre, RUN, correo o comuna" />
          </div>
          <div>
            <label className="form-label" htmlFor="admin-users-role-filter">Filtrar por rol</label>
            <select id="admin-users-role-filter" className="form-select" value={filtroRol} onChange={(event) => establecerFiltroRol(event.target.value as 'Todos' | RolUsuario)}>
              <option value="Todos">Todos los roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table admin-users__table">
            <thead>
              <tr>
                <th scope="col">Usuario</th>
                <th scope="col">RUN</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Ubicación</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-users__empty">
                    {usuarios.length === 0 ? 'Aún no hay usuarios registrados. Usa el formulario para agregar el primero.' : 'No hay registros que coincidan con la búsqueda.'}
                  </td>
                </tr>
              ) : usuariosFiltrados.map((usuario) => (
                <tr key={usuario.run}>
                  <td><strong>{usuario.nombre} {usuario.apellidos}</strong><span>{usuario.fechaNacimiento || 'Sin fecha de nacimiento'}</span></td>
                  <td>{usuario.run}</td>
                  <td>{usuario.correo}</td>
                  <td><span className={`admin-users__role admin-users__role--${usuario.rol === 'Administrador' ? 'admin' : 'client'}`}>{usuario.rol}</span></td>
                  <td><strong>{usuario.comuna}</strong><span>{usuario.region}</span></td>
                  <td className="text-end">
                    <div className="admin-users__actions">
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editar(usuario)}>Editar</button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(usuario)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

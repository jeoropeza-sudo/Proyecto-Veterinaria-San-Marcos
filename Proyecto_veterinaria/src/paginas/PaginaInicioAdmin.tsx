import { Link } from 'react-router-dom';
import { useAutenticacion } from '../context/useAutenticacion';
import { useCatalogo } from '../context/useCatalogo';
import '../admin.css';

export function PaginaInicioAdmin() {
  const { usuario } = useAutenticacion();
  const { productos, servicios } = useCatalogo();
  const modulos = [
    {
      numero: '01',
      titulo: 'Gestión de usuarios',
      descripcion: 'Revisa cuentas, roles y datos de acceso de tus usuarios.',
      destino: '/admin/usuarios',
      accion: 'Administrar usuarios',
      clase: 'admin-home__module--users',
    },
    {
      numero: '02',
      titulo: 'Gestión del catálogo',
      descripcion: 'Actualiza los productos, servicios, precios y existencias.',
      destino: '/admin/catalogo',
      accion: 'Administrar catálogo',
      clase: 'admin-home__module--catalog',
    },
  ];

  return (
    <main className="admin-page admin-home">
      <div className="container admin-page__container">
        <section className="admin-home__intro" aria-labelledby="admin-home-title">
          <p className="admin-eyebrow">VETERINARIA SAN MARCOS · ADMINISTRACIÓN</p>
          <h1 id="admin-home-title" className="admin-home__title">Hola, {usuario?.nombre ?? 'administrador'}.</h1>
          <p className="admin-home__summary">¿Qué necesitas gestionar hoy?</p>
        </section>

        <section className="admin-home__metrics" aria-label="Resumen del catálogo">
          <div className="admin-home__metric">
            <span>Productos activos</span>
            <strong>{productos.length}</strong>
          </div>
          <div className="admin-home__metric">
            <span>Servicios disponibles</span>
            <strong>{servicios.length}</strong>
          </div>
          <div className="admin-home__metric admin-home__metric--status">
            <span className="admin-status-dot" aria-hidden="true" />
            <span>Sesión de administrador activa</span>
          </div>
        </section>

        <section className="admin-home__modules" aria-labelledby="admin-modules-title">
          <div className="admin-home__section-heading">
            <div>
              <p className="admin-eyebrow">ACCESOS DIRECTOS</p>
              <h2 id="admin-modules-title">Áreas de trabajo</h2>
            </div>
            <span>Selecciona una sección para continuar</span>
          </div>

          <div className="admin-home__module-grid">
            {modulos.map((modulo) => (
              <Link
                className={`admin-home__module ${modulo.clase}`}
                key={modulo.destino}
                to={modulo.destino}
              >
                <span className="admin-home__module-number">{modulo.numero}</span>
                <h3>{modulo.titulo}</h3>
                <p>{modulo.descripcion}</p>
                <span className="admin-home__module-action">
                  {modulo.accion}<span aria-hidden="true"> →</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
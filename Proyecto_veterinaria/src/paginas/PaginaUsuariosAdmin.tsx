import { Link } from 'react-router-dom';
import { AdminUsers } from '../componentes/organismos/AdminUsers';
import '../admin.css';

export function PaginaUsuariosAdmin() {
  return (
    <main className="admin-page">
      <div className="container admin-page__container">
        <div className="admin-page__heading">
          <div>
            <Link className="admin-back-link" to="/admin">← Panel de administración</Link>
            <p className="admin-eyebrow">CUENTAS Y PERMISOS</p>
            <h1 className="admin-page__title">Gestión de usuarios</h1>
            <p className="admin-page__description">Administra las cuentas registradas en la plataforma.</p>
          </div>
          <div className="admin-page__heading-mark" aria-hidden="true">USUARIOS</div>
        </div>
        <AdminUsers />
      </div>
    </main>
  );
}
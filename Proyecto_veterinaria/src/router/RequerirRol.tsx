import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../context/useAutenticacion';
import type { Usuario } from '../types';

interface PropiedadesRequerirRol {
  rolesPermitidos: Usuario['rol'][];
  children: ReactNode;
}

export function RequerirRol({ rolesPermitidos, children }: PropiedadesRequerirRol) {
  const { usuario } = useAutenticacion();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h1 className="h4">Acceso denegado</h1>
          <p>Tu cuenta no tiene permisos para acceder a esta sección.</p>
          <Link className="alert-link" to="/">Volver al inicio</Link>
        </div>
      </main>
    );
  }

  return children;
}

import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { Usuario } from '../types';

interface RequireRoleProps {
  allowedRoles: Usuario['rol'][];
  children: ReactNode;
}

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
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

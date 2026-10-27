import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

function getRedirectPath(state: unknown): string {
  if (typeof state !== 'object' || state === null || !('from' in state)) {
    return '/';
  }

  const from = (state as LoginLocationState).from?.pathname;
  return from?.startsWith('/') && !from.startsWith('//') ? from : '/';
}

export function LoginPage() {
  const { user, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to={getRedirectPath(location.state)} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!signIn(email, password)) {
      setError('No se pudo iniciar sesión. Revisa las credenciales e inténtalo nuevamente.');
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="h3 mb-2">Iniciar sesión</h1>
              <p className="text-secondary mb-4">Ingresa para continuar en Veterinaria San Marcos.</p>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label">Correo electrónico</label>
                  <input
                    id="login-email"
                    className="form-control"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="login-password" className="form-label">Contraseña</label>
                  <input
                    id="login-password"
                    className="form-control"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">Ingresar</button>
              </form>

              <div className="mt-4 small text-secondary">
                <p className="fw-semibold mb-2">Cuentas de demostración</p>
                <p className="mb-1">Administrador: admin@sanmarcos.cl / admin1234</p>
                <p className="mb-0">Cliente: cliente@sanmarcos.cl / cliente1234</p>
              </div>
              <Link className="d-inline-block mt-3" to="/">Volver al inicio</Link>
            </div>
          </section>
          <p className="small text-secondary mt-3">
            Autenticación de demostración para el proyecto académico; no protege datos reales ni sustituye un backend.
          </p>
        </div>
      </div>
    </main>
  );
}

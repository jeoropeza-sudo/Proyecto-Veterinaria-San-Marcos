import { Route, Routes } from 'react-router-dom';
import Navbar from '../componentes/organismos/Navbar';
import { useAuth } from '../context/useAuth';
import { AdminPage } from '../paginas/AdminPage';
import { Home } from '../paginas/Home';
import { LoginPage } from '../paginas/LoginPage';
import { RequireRole } from './RequireRole';

export function AppRouter() {
  const { error } = useAuth();

  return (
    <>
      <Navbar />
      {error && <div className="alert alert-danger m-3" role="alert">{error}</div>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireRole allowedRoles={['Administrador']}>
              <AdminPage />
            </RequireRole>
          }
        />
        <Route path="*" element={<main className="container py-5"><h1 className="h3">Página no encontrada</h1></main>} />
      </Routes>
    </>
  );
}

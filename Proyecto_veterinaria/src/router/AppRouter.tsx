import { Route, Routes } from 'react-router-dom';
import Navbar from '../componentes/organismos/Navbar';
import { useAuth } from '../context/useAuth';
import { AdminPage } from '../paginas/AdminPage';
import { DetailViewPage } from '../paginas/DetailViewPage';
import { Home } from '../paginas/Home';
import { LoginPage } from '../paginas/LoginPage';
import { ProductsPage } from '../paginas/ProductsPage';
import { ServicesPage } from '../paginas/ServicesPage';
import { useCatalog } from '../context/useCatalog';
import { RequireRole } from './RequireRole';

export function AppRouter() {
  const { error: authError } = useAuth();
  const { error: catalogError } = useCatalog();

  return (
    <>
      <Navbar />
      {authError && <div className="alert alert-danger m-3" role="alert">{authError}</div>}
      {catalogError && <div className="alert alert-danger m-3" role="alert">{catalogError}</div>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:codigo" element={<DetailViewPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/servicios/:codigo" element={<DetailViewPage />} />
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

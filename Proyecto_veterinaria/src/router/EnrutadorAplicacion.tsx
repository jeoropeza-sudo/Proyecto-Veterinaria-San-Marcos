import { Route, Routes } from 'react-router-dom';
import BarraNavegacion from '../componentes/organismos/BarraNavegacion';
import { PiePagina } from '../componentes/PiePagina';
import { useAutenticacion } from '../context/useAutenticacion';
import { PaginaAdministracion } from '../paginas/PaginaAdministracion';
import { PaginaContacto } from '../paginas/PaginaContacto';
import { PaginaDetalle } from '../paginas/PaginaDetalle';
import { PaginaDetalleNovedad } from '../paginas/PaginaDetalleNovedad';
import { PaginaCarrito } from '../paginas/PaginaCarrito';
import { PaginaInicio } from '../paginas/PaginaInicio';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';
import { PaginaNosotros } from '../paginas/PaginaNosotros';
import { PaginaNovedades } from '../paginas/PaginaNovedades';
import { PaginaProductos } from '../paginas/PaginaProductos';
import { PaginaServicios } from '../paginas/PaginaServicios';
import { useCatalogo } from '../context/useCatalogo';
import { useCarrito } from '../context/useCarrito';
import { RequerirRol } from './RequerirRol';

export function EnrutadorAplicacion() {
  const { error: errorAutenticacion } = useAutenticacion();
  const { error: errorCatalogo } = useCatalogo();
  const { error: errorCarrito } = useCarrito();

  return (
    <>
      <BarraNavegacion />
      {errorAutenticacion && <div className="alert alert-danger m-3" role="alert">{errorAutenticacion}</div>}
      {errorCatalogo && <div className="alert alert-danger m-3" role="alert">{errorCatalogo}</div>}
      {errorCarrito && <div className="alert alert-danger m-3" role="alert">{errorCarrito}</div>}
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/nosotros" element={<PaginaNosotros />} />
          <Route path="/novedades" element={<PaginaNovedades />} />
          <Route path="/novedades/:codigo" element={<PaginaDetalleNovedad />} />
          <Route path="/contacto" element={<PaginaContacto />} />
          <Route path="/login" element={<PaginaInicioSesion />} />
          <Route path="/productos" element={<PaginaProductos />} />
          <Route path="/productos/:codigo" element={<PaginaDetalle />} />
          <Route path="/carrito" element={<PaginaCarrito />} />
          <Route path="/servicios" element={<PaginaServicios />} />
          <Route path="/servicios/:codigo" element={<PaginaDetalle />} />
          <Route
            path="/admin"
            element={
              <RequerirRol rolesPermitidos={['Administrador']}>
                <PaginaAdministracion />
              </RequerirRol>
            }
          />
          <Route path="*" element={<main className="container py-5"><h1 className="h3">Página no encontrada</h1></main>} />
        </Routes>
      </div>
      <PiePagina />
    </>
  );
}

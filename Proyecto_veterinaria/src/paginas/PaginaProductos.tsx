import { useMemo, useState } from 'react';
import { TarjetaProducto } from '../componentes/moleculas/TarjetaProducto';
import { useCatalogo } from '../context/useCatalogo';

export function PaginaProductos() {
  const { productos } = useCatalogo();
  const [busqueda, establecerBusqueda] = useState('');
  const [categoria, establecerCategoria] = useState('Todas');
  const categorias = [...new Set(productos.map((producto) => producto.categoria))];
  const productosFiltrados = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLocaleLowerCase();
    return productos.filter((producto) => {
      const coincideCategoria = categoria === 'Todas' || producto.categoria === categoria;
      const coincideBusqueda = !busquedaNormalizada
        || [producto.nombre, producto.categoria, producto.codigo, producto.especie ?? '']
          .some((value) => value.toLocaleLowerCase().includes(busquedaNormalizada));
      return coincideCategoria && coincideBusqueda;
    });
  }, [categoria, productos, busqueda]);

  return (
    <main>
      <header className="py-5 text-white" style={{ background: 'linear-gradient(120deg, #153259, #36BBD9)' }}>
        <div className="container-fluid px-4 px-lg-5">
          <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#36BBD9', color: '#153259' }}>Farmacia San Marcos</span>
          <h1 className="display-5 fw-bold mb-2">Productos para su bienestar</h1>
          <p className="lead mb-0 text-white-50">Medicamentos, antiparasitarios y suplementos para tu mascota.</p>
        </div>
      </header>
      <section className="container-fluid px-4 px-lg-5 py-5">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <label className="form-label fw-semibold" htmlFor="producto-search">Buscar producto</label>
                <input
                  id="producto-search"
                  className="form-control form-control-lg"
                  type="search"
                  value={busqueda}
                  onChange={(event) => establecerBusqueda(event.target.value)}
                  placeholder="Nombre, categoría o código"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold" htmlFor="producto-categoria">Categoría</label>
                <select
                  id="producto-categoria"
                  className="form-select form-select-lg"
                  value={categoria}
                  onChange={(event) => establecerCategoria(event.target.value)}
                >
                  <option value="Todas">Todas las categorías</option>
                  {categorias.map((articulo) => <option key={articulo} value={articulo}>{articulo}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h5 mb-0">Catálogo</h2>
          <span className="small text-secondary">{productosFiltrados.length} productos encontrados</span>
        </div>
        {productosFiltrados.length === 0 ? (
          <p className="alert alert-info">No hay productos que coincidan con la búsqueda.</p>
        ) : (
          <div className="row g-4">
            {productosFiltrados.map((producto) => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={producto.codigo}>
                <TarjetaProducto producto={producto} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
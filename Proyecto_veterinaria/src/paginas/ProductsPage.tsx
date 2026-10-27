import { useMemo, useState } from 'react';
import { CardProduct } from '../componentes/moleculas/CardProduct';
import { useCatalog } from '../context/useCatalog';

export function ProductsPage() {
  const { productos } = useCatalog();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const categories = [...new Set(productos.map((product) => product.categoria))];
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return productos.filter((product) => {
      const matchesCategory = category === 'Todas' || product.categoria === category;
      const matchesQuery = !normalizedQuery
        || [product.nombre, product.categoria, product.codigo, product.especie ?? '']
          .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [category, productos, query]);

  return (
    <main className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-6 fw-bold">Farmacia veterinaria</h1>
        <p className="text-secondary">Medicamentos, antiparasitarios y suplementos para tu mascota.</p>
      </header>
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <label className="form-label" htmlFor="product-search">Buscar producto</label>
          <input
            id="product-search"
            className="form-control"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre, categoría o código"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="product-category">Categoría</label>
          <select
            id="product-category"
            className="form-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <p className="alert alert-info">No hay productos que coincidan con la búsqueda.</p>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div className="col-sm-6 col-lg-4" key={product.codigo}>
              <CardProduct product={product} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
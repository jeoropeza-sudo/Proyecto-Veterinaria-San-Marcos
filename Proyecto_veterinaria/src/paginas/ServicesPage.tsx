import { useMemo, useState } from 'react';
import { CardService } from '../componentes/moleculas/CardService';
import { useCatalog } from '../context/useCatalog';

export function ServicesPage() {
  const { servicios } = useCatalog();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const categories = [...new Set(servicios.map((service) => service.categoria))];
  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return servicios.filter((service) => {
      const matchesCategory = category === 'Todas' || service.categoria === category;
      const matchesQuery = !normalizedQuery
        || [service.nombre, service.categoria, service.codigo, service.especie]
          .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [category, query, servicios]);

  return (
    <main className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-6 fw-bold">Servicios médicos y prestaciones</h1>
        <p className="text-secondary">Explora consultas, cirugías, exámenes y vacunas para tu mascota.</p>
      </header>
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <label className="form-label" htmlFor="service-search">Buscar servicio</label>
          <input
            id="service-search"
            className="form-control"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre, categoría o código"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="service-category">Categoría</label>
          <select
            id="service-category"
            className="form-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      {filteredServices.length === 0 ? (
        <p className="alert alert-info">No hay servicios que coincidan con la búsqueda.</p>
      ) : (
        <div className="row g-4">
          {filteredServices.map((service) => (
            <div className="col-sm-6 col-lg-4" key={service.codigo}>
              <CardService service={service} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
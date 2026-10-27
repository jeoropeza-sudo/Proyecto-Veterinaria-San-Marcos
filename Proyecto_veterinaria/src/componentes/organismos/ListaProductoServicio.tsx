import React from 'react';

export interface ElementoAdministracion {
  codigo: string;
  nombre: string;
  tipo: 'Producto' | 'Servicio';
  categoria: string;
  precio: number;
  stock?: number;
}

interface PropiedadesListaProductoServicio {
  articulos: ElementoAdministracion[];
  alEditar: (codigo: string) => void;
  alEliminar: (codigo: string) => void;
}

export const ListaProductoServicio: React.FC<PropiedadesListaProductoServicio> = ({
  articulos,
  alEditar,
  alEliminar,
}) => {
  return (
    <div className="table-responsive">
      <table className="table admin-catalog__table">
        <thead>
          <tr>
            <th scope="col">Artículo</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio</th>
            <th scope="col">Stock</th>
            <th scope="col" className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.length === 0 ? (
            <tr>
              <td colSpan={5} className="admin-catalog__empty">
                No hay artículos que coincidan. Prueba otra búsqueda o registra un nuevo artículo.
              </td>
            </tr>
          ) : (
            articulos.map((articulo) => (
              <tr key={articulo.codigo}>
                <td>
                  <div className="admin-catalog__item">
                    <span className={`admin-catalog__type admin-catalog__type--${articulo.tipo.toLocaleLowerCase()}`}>
                      {articulo.tipo}
                    </span>
                    <strong>{articulo.nombre}</strong>
                    <small>{articulo.codigo}</small>
                  </div>
                </td>
                <td>{articulo.categoria}</td>
                <td className="admin-catalog__price">${articulo.precio.toLocaleString('es-CL')}</td>
                <td>
                  {articulo.tipo === 'Producto'
                    ? <span className={`admin-catalog__stock${(articulo.stock ?? 0) === 0 ? ' admin-catalog__stock--empty' : ''}`}>{articulo.stock ?? 0} unidades</span>
                    : <span className="text-secondary">No aplica</span>}
                </td>
                <td className="text-end">
                  <div className="admin-catalog__actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      aria-label={`Editar ${articulo.nombre}`}
                      onClick={() => alEditar(articulo.codigo)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      aria-label={`Eliminar ${articulo.nombre}`}
                      onClick={() => alEliminar(articulo.codigo)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
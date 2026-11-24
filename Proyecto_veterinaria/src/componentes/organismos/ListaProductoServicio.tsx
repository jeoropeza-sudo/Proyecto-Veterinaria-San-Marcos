import React from 'react';

export interface ElementoAdministracion {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number | null;
}

interface PropiedadesListaProductoServicio {
  articulos: ElementoAdministracion[];
  alEditar: (codigo: string) => void;
  alEliminar: (codigo: string) => void | Promise<void>;
}

export const ListaProductoServicio: React.FC<PropiedadesListaProductoServicio> = ({
  articulos,
  alEditar,
  alEliminar,
}) => {
  if (articulos.length === 0) {
    return (
      <div className="catalog-admin-empty">
        <span className="catalog-admin-empty-icon">0</span>
        <h3>No hay coincidencias</h3>
        <p>Prueba con otro filtro o registra un nuevo artículo.</p>
      </div>
    );
  }

  return (
    <div className="catalog-admin-table table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo) => {
            const esProducto = articulo.categoria.startsWith('Producto');
            return (
              <tr key={articulo.codigo}>
                <td><span className="catalog-code">{articulo.codigo}</span></td>
                <td><strong className="catalog-name">{articulo.nombre}</strong></td>
                <td>
                  <span className={esProducto ? 'catalog-type-badge product' : 'catalog-type-badge service'}>
                    {esProducto ? 'Producto' : 'Servicio'}
                  </span>
                  <small className="catalog-category">{articulo.categoria.replace(/^(Producto|Servicio)\s*·\s*/, '')}</small>
                </td>
                <td><strong className="catalog-price">${articulo.precio.toLocaleString('es-CL')}</strong></td>
                <td>
                  {articulo.stock === null
                    ? <span className="catalog-stock na">No aplica</span>
                    : <span className={articulo.stock > 0 ? 'catalog-stock in' : 'catalog-stock out'}>{articulo.stock} unidades</span>}
                </td>
                <td>
                  <div className="catalog-actions">
                    <button type="button" className="catalog-action edit" onClick={() => alEditar(articulo.codigo)}>Editar</button>
                    <button type="button" className="catalog-action delete" onClick={() => { void alEliminar(articulo.codigo); }}>Eliminar</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
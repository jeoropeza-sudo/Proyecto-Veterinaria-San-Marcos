import React from 'react';

export interface ElementoAdministracion {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
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
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No hay productos o servicios registrados.
              </td>
            </tr>
          ) : (
            articulos.map((articulo) => (
              <tr key={articulo.codigo}>
                <td>{articulo.nombre}</td>
                <td>{articulo.categoria}</td>
                <td>${articulo.precio}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => alEditar(articulo.codigo)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => alEliminar(articulo.codigo)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
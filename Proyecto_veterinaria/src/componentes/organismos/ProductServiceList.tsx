// src/componentes/organismos/ProductServiceList.tsx
import React from 'react';

export interface ItemAdmin {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
}

interface ProductServiceListProps {
  items: ItemAdmin[];
  onDelete: (id: string) => void;
}

export const ProductServiceList: React.FC<ProductServiceListProps> = ({ items, onDelete }) => {
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
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No hay productos o servicios registrados.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.categoria}</td>
                <td>${item.precio}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(item.id)}
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
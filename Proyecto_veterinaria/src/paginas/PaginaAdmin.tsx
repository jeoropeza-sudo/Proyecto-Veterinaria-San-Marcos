import React, { useState } from 'react';
import { FormularioProductoServicio } from '../componentes/organismos/FormularioProductoServicio';
import { ListaProductoServicio } from '../componentes/organismos/ListaProductoServicio';

export interface DatosFormularioProductoServicio {
  nombre: string;
  categoria: 'Servicio' | 'Producto' | 'Consulta' | 'Vacunacion';
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
}

export interface ElementoAdministracion {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
}

export const PaginaAdmin: React.FC = () => {
  const [lista, setLista] = useState<ElementoAdministracion[]>([]);

  const handleEnviar = (nuevo: DatosFormularioProductoServicio) => {
    const itemConCodigo: ElementoAdministracion = {
      codigo: String(Date.now()),
      nombre: nuevo.nombre,
      categoria: nuevo.categoria,
      precio: nuevo.precio,
    };
    setLista((prev) => [...prev, itemConCodigo]);
  };

  const handleEditar = (codigo: string) => {
    console.log('Editar elemento con código:', codigo);
  };

  const handleEliminar = (codigo: string) => {
    setLista((prev) => prev.filter((item) => item.codigo !== codigo));
  };

  return (
    <div className="container mt-4">
      <h2>Panel de Administración - Veterinaria San Marcos</h2>
      <hr />
      <div className="row">
        <div className="col-md-5">
          <FormularioProductoServicio alEnviar={handleEnviar} />
        </div>
        <div className="col-md-7">
          <ListaProductoServicio 
            articulos={lista} 
            alEditar={handleEditar}
            alEliminar={handleEliminar} 
          />
        </div>
      </div>
    </div>
  );
};

export default PaginaAdmin;
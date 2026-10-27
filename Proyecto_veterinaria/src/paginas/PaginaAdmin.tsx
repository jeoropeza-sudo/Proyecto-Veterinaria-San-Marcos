import React, { useState } from 'react';
import { FormularioProductoServicio } from '../componentes/organismos/FormularioProductoServicio';
import { ListaProductoServicio } from '../componentes/organismos/ListaProductoServicio';

export const PaginaAdmin: React.FC = () => {
  const [lista, setLista] = useState<any[]>([]);

  const handleEnviar = (nuevo: any) => {
    const itemConId = {
      ...nuevo,
      id: Date.now(),
    };
    setLista((prev) => [...prev, itemConId]);
  };

  const handleEliminar = (id: number) => {
    setLista((prev) => prev.filter((item: any) => item.id !== id));
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
            productos={lista} 
            onEliminar={handleEliminar} 
          />
        </div>
      </div>
    </div>
  );
};

export default PaginaAdmin;
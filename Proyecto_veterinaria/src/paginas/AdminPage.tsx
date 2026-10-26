// src/paginas/AdminPage.tsx
import { useState } from 'react';
import { ProductServiceForm, type ProductFormData } from '../componentes/organismos/ProductServiceForm';
import { ProductServiceList, type ItemAdmin } from '../componentes/organismos/ProductServiceList';

export const AdminPage = () => {
  const [items, setItems] = useState<ItemAdmin[]>([
    { id: '1', nombre: 'Control Veterinario General', categoria: 'Servicio', precio: 25000 },
    { id: '2', nombre: 'Antiparasitario Externo', categoria: 'Producto', precio: 12000 }
  ]);

  const handleAddProductService = (data: ProductFormData) => {
    const newItem: ItemAdmin = {
      id: Date.now().toString(),
      nombre: data.nombre,
      categoria: data.categoria,
      precio: data.precio,
    };

    setItems((prevItems) => [newItem, ...prevItems]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Panel de Administración - Veterinaria San Marcos</h2>
      
      <div className="row">
        <div className="col-md-5 mb-4">
          <ProductServiceForm onSubmit={handleAddProductService} />
        </div>

        <div className="col-md-7">
          <h4 className="mb-3">Lista de Servicios y Productos</h4>
          <ProductServiceList items={items} onDelete={handleDeleteItem} />
        </div>
      </div>
    </div>
  );
};
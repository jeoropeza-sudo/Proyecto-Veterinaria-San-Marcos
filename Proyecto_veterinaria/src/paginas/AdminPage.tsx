import { ProductServiceForm, type ProductFormData } from '../componentes/organismos/ProductServiceForm';
import { ProductServiceList, type ItemAdmin } from '../componentes/organismos/ProductServiceList';
import { useCatalog } from '../context/useCatalog';

export const AdminPage = () => {
  const { productos, servicios, addProducto, addServicio, deleteProducto, deleteServicio } = useCatalog();
  const items: ItemAdmin[] = [
    ...servicios.map((service) => ({
      id: service.codigo,
      nombre: service.nombre,
      categoria: `Servicio · ${service.categoria}`,
      precio: service.precio,
    })),
    ...productos.map((product) => ({
      id: product.codigo,
      nombre: product.nombre,
      categoria: `Producto · ${product.categoria}`,
      precio: product.precio,
    })),
  ];

  const handleAddProductService = (data: ProductFormData) => {
    if (data.categoria === 'Producto') {
      addProducto({
        nombre: data.nombre.trim(),
        categoria: 'Otros',
        stock: data.stock,
        precio: data.precio,
        imagen: data.imagen.trim() || '/imagenes/condro.png',
        detalle: data.descripcion.trim(),
      });
      return;
    }

    const categoryByForm = {
      Servicio: 'Otros',
      Consulta: 'Consultas',
      Vacunacion: 'Vacunación',
    };
    addServicio({
      nombre: data.nombre.trim(),
      categoria: categoryByForm[data.categoria] ?? 'Otros',
      especie: 'Perro / Gato',
      duracion: '30 min',
      precio: data.precio,
      detalle: data.descripcion.trim() || 'Servicio veterinario de Veterinaria San Marcos.',
    });
  };

  const handleDeleteItem = (codigo: string) => {
    if (servicios.some((service) => service.codigo === codigo)) {
      deleteServicio(codigo);
    } else {
      deleteProducto(codigo);
    }
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
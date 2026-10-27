import { FormularioProductoServicio, type DatosFormularioProductoServicio } from '../componentes/organismos/FormularioProductoServicio';
import { ListaProductoServicio, type ElementoAdministracion } from '../componentes/organismos/ListaProductoServicio';
import { useCatalogo } from '../context/useCatalogo';

export const PaginaAdministracion = () => {
  const { productos, servicios, agregarProducto, agregarServicio, eliminarProducto, eliminarServicio } = useCatalogo();
  const articulos: ElementoAdministracion[] = [
    ...servicios.map((servicio) => ({
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      categoria: `Servicio · ${servicio.categoria}`,
      precio: servicio.precio,
    })),
    ...productos.map((producto) => ({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: `Producto · ${producto.categoria}`,
      precio: producto.precio,
    })),
  ];

  const manejarRegistroProductoServicio = (datos: DatosFormularioProductoServicio) => {
    if (datos.categoria === 'Producto') {
      agregarProducto({
        nombre: datos.nombre.trim(),
        categoria: 'Otros',
        stock: datos.stock,
        precio: datos.precio,
        imagen: datos.imagen.trim() || '/imagenes/condro.png',
        detalle: datos.descripcion.trim(),
      });
      return;
    }

    const categoriaPorFormulario = {
      Servicio: 'Otros',
      Consulta: 'Consultas',
      Vacunacion: 'Vacunación',
    };
    agregarServicio({
      nombre: datos.nombre.trim(),
      categoria: categoriaPorFormulario[datos.categoria] ?? 'Otros',
      especie: 'Perro / Gato',
      duracion: '30 min',
      precio: datos.precio,
      detalle: datos.descripcion.trim() || 'Servicio veterinario de Veterinaria San Marcos.',
    });
  };

  const manejarEliminacionArticulo = (codigo: string) => {
    if (servicios.some((servicio) => servicio.codigo === codigo)) {
      eliminarServicio(codigo);
    } else {
      eliminarProducto(codigo);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Panel de Administración - Veterinaria San Marcos</h2>
      
      <div className="row">
        <div className="col-md-5 mb-4">
          <FormularioProductoServicio alEnviar={manejarRegistroProductoServicio} />
        </div>

        <div className="col-md-7">
          <h4 className="mb-3">Lista de Servicios y Productos</h4>
          <ListaProductoServicio articulos={articulos} alEliminar={manejarEliminacionArticulo} />
        </div>
      </div>
    </div>
  );
};
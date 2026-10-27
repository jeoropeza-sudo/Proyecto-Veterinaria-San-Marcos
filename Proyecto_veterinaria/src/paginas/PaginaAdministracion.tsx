import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormularioProductoServicio, type DatosFormularioProductoServicio } from '../componentes/organismos/FormularioProductoServicio';
import { ListaProductoServicio, type ElementoAdministracion } from '../componentes/organismos/ListaProductoServicio';
import { useCatalogo } from '../context/useCatalogo';
import type { Producto, Servicio } from '../types';
import '../admin.css';

export const PaginaAdministracion = () => {
  const {
    productos,
    servicios,
    agregarProducto,
    agregarServicio,
    actualizarProducto,
    actualizarServicio,
    eliminarProducto,
    eliminarServicio,
  } = useCatalogo();
  const [articuloEditando, establecerArticuloEditando] = useState<Producto | Servicio | null>(null);
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
    if (articuloEditando && 'stock' in articuloEditando) {
      actualizarProducto(articuloEditando.codigo, {
        nombre: datos.nombre.trim(),
        stock: datos.stock,
        precio: datos.precio,
        imagen: datos.imagen.trim() || articuloEditando.imagen,
        detalle: datos.descripcion.trim(),
      });
      establecerArticuloEditando(null);
      return;
    }

    if (articuloEditando) {
      const categoriaOriginal = articuloEditando.categoria === 'Vacunación'
        ? 'Vacunacion'
        : articuloEditando.categoria === 'Consultas'
          ? 'Consulta'
          : 'Servicio';
      const categoria = datos.categoria === 'Vacunacion'
        ? 'Vacunación'
        : datos.categoria === 'Consulta'
          ? 'Consultas'
          : datos.categoria === categoriaOriginal
            ? articuloEditando.categoria
            : 'Otros';
      actualizarServicio(articuloEditando.codigo, {
        nombre: datos.nombre.trim(),
        categoria,
        precio: datos.precio,
        detalle: datos.descripcion.trim(),
      });
      establecerArticuloEditando(null);
      return;
    }

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

  const manejarEdicionArticulo = (codigo: string) => {
    const producto = productos.find((articulo) => articulo.codigo === codigo);
    const servicio = servicios.find((articulo) => articulo.codigo === codigo);
    establecerArticuloEditando(producto ?? servicio ?? null);
  };

  const valoresFormulario: DatosFormularioProductoServicio | undefined = articuloEditando
    ? 'stock' in articuloEditando
      ? {
          nombre: articuloEditando.nombre,
          categoria: 'Producto',
          precio: articuloEditando.precio,
          descripcion: articuloEditando.detalle ?? '',
          stock: articuloEditando.stock,
          imagen: articuloEditando.imagen,
        }
      : {
          nombre: articuloEditando.nombre,
          categoria: articuloEditando.categoria === 'Vacunación'
            ? 'Vacunacion'
            : articuloEditando.categoria === 'Consultas'
              ? 'Consulta'
              : 'Servicio',
          precio: articuloEditando.precio,
          descripcion: articuloEditando.detalle,
          stock: 0,
          imagen: articuloEditando.imagen ?? '/imagenes/consulta.webp',
        }
    : undefined;

  return (
    <main className="admin-page">
      <div className="container admin-page__container">
        <div className="admin-page__heading">
          <div>
            <Link className="admin-back-link" to="/admin">← Panel de administración</Link>
            <p className="admin-eyebrow">INVENTARIO Y SERVICIOS</p>
            <h1 className="admin-page__title">Gestión del catálogo</h1>
            <p className="admin-page__description">Mantén actualizados los productos y servicios disponibles.</p>
          </div>
          <div className="admin-page__count" aria-label={`${articulos.length} artículos en el catálogo`}>
            <strong>{articulos.length}</strong>
            <span>artículos</span>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-lg-5">
          <FormularioProductoServicio
            key={articuloEditando?.codigo ?? 'nuevo'}
            valoresIniciales={valoresFormulario}
            estaEditando={articuloEditando !== null}
            alEnviar={manejarRegistroProductoServicio}
            alCancelar={() => establecerArticuloEditando(null)}
          />
        </div>

          <section className="col-lg-7" aria-labelledby="lista-catalogo">
          <h2 id="lista-catalogo" className="admin-section-title">Servicios y productos</h2>
          <ListaProductoServicio
            articulos={articulos}
            alEditar={manejarEdicionArticulo}
            alEliminar={manejarEliminacionArticulo}
          />
          </section>
        </div>
      </div>
    </main>
  );
};
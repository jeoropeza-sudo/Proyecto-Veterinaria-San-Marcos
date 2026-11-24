import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormularioProductoServicio, type DatosFormularioProductoServicio } from '../Componentes/organismos/FormularioProductoServicio';
import { ListaProductoServicio, type ElementoAdministracion } from '../Componentes/organismos/ListaProductoServicio';
import { useCatalogo } from '../context/useCatalogo';
import type { Producto, Servicio } from '../types';

type Articulo = Producto | Servicio;

function mostrarError(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar la operación.';
}

export function PaginaAdministracion() {
  const {
    productos,
    servicios,
    cargando,
    agregarProducto,
    agregarServicio,
    actualizarProducto,
    actualizarServicio,
    eliminarProducto,
    eliminarServicio,
  } = useCatalogo();
  const [articuloEditando, establecerArticuloEditando] = useState<Articulo | null>(null);
  const [errorOperacion, establecerErrorOperacion] = useState<string | null>(null);
  const [mensajeExito, establecerMensajeExito] = useState<string | null>(null);

  const articulos: ElementoAdministracion[] = [
    ...productos.map((producto) => ({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: `Producto · ${producto.categoria}`,
      precio: producto.precio,
      stock: producto.stock,
    })),
    ...servicios.map((servicio) => ({
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      categoria: `Servicio · ${servicio.categoria}`,
      precio: servicio.precio,
      stock: null,
    })),
  ];

  const manejarRegistroArticulo = async (datos: DatosFormularioProductoServicio): Promise<void> => {
    establecerErrorOperacion(null);
    establecerMensajeExito(null);

    if (articuloEditando && 'stock' in articuloEditando) {
      await actualizarProducto(articuloEditando.codigo, {
        nombre: datos.nombre,
        categoria: datos.categoria,
        stock: datos.stock,
        precio: datos.precio,
        imagen: datos.imagen,
        detalle: datos.descripcion,
        principio: datos.principio || undefined,
        presentacion: datos.presentacion || undefined,
        especie: datos.especie || undefined,
      });
      establecerArticuloEditando(null);
      establecerMensajeExito('Producto actualizado.');
      return;
    }

    if (articuloEditando) {
      await actualizarServicio(articuloEditando.codigo, {
        nombre: datos.nombre,
        categoria: datos.categoria,
        especie: datos.especie,
        duracion: datos.duracion,
        precio: datos.precio,
        imagen: datos.imagen || undefined,
        detalle: datos.descripcion,
      });
      establecerArticuloEditando(null);
      establecerMensajeExito('Servicio actualizado.');
      return;
    }

    if (datos.tipo === 'Producto') {
      await agregarProducto({
        nombre: datos.nombre,
        categoria: datos.categoria,
        stock: datos.stock,
        precio: datos.precio,
        imagen: datos.imagen,
        detalle: datos.descripcion,
        principio: datos.principio || undefined,
        presentacion: datos.presentacion || undefined,
        especie: datos.especie || undefined,
      });
      establecerMensajeExito('Producto registrado.');
      return;
    }

    await agregarServicio({
      nombre: datos.nombre,
      categoria: datos.categoria,
      especie: datos.especie,
      duracion: datos.duracion,
      precio: datos.precio,
      detalle: datos.descripcion,
      imagen: datos.imagen || undefined,
    });
    establecerMensajeExito('Servicio registrado.');
  };

  const manejarEliminacionArticulo = async (codigo: string): Promise<void> => {
    const articulo = [...productos, ...servicios].find((item) => item.codigo === codigo);
    if (!articulo || !window.confirm(`¿Eliminar "${articulo.nombre}" del catálogo?`)) return;

    establecerErrorOperacion(null);
    establecerMensajeExito(null);
    try {
      if (productos.some((producto) => producto.codigo === codigo)) {
        await eliminarProducto(codigo);
      } else {
        await eliminarServicio(codigo);
      }
      if (articuloEditando?.codigo === codigo) establecerArticuloEditando(null);
      establecerMensajeExito('Artículo eliminado.');
    } catch (error) {
      establecerErrorOperacion(mostrarError(error));
    }
  };

  const manejarEdicionArticulo = (codigo: string) => {
    const producto = productos.find((articulo) => articulo.codigo === codigo);
    const servicio = servicios.find((articulo) => articulo.codigo === codigo);
    establecerArticuloEditando(producto ?? servicio ?? null);
    establecerErrorOperacion(null);
    establecerMensajeExito(null);
  };

  const valoresFormulario: DatosFormularioProductoServicio | undefined = articuloEditando
    ? 'stock' in articuloEditando
      ? {
          tipo: 'Producto',
          nombre: articuloEditando.nombre,
          categoria: articuloEditando.categoria,
          precio: articuloEditando.precio,
          descripcion: articuloEditando.detalle ?? '',
          stock: articuloEditando.stock,
          imagen: articuloEditando.imagen,
          principio: articuloEditando.principio ?? '',
          presentacion: articuloEditando.presentacion ?? '',
          especie: articuloEditando.especie ?? '',
          duracion: '',
        }
      : {
          tipo: 'Servicio',
          nombre: articuloEditando.nombre,
          categoria: articuloEditando.categoria,
          precio: articuloEditando.precio,
          descripcion: articuloEditando.detalle,
          stock: 0,
          imagen: articuloEditando.imagen ?? '',
          principio: '',
          presentacion: '',
          especie: articuloEditando.especie,
          duracion: articuloEditando.duracion,
        }
    : undefined;

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-uppercase small fw-semibold text-secondary mb-1">Administración</p>
          <h1 className="h2 mb-0" style={{ color: '#153259' }}>Gestión de productos y servicios</h1>
        </div>
        <Link to="/admin" className="btn btn-outline-primary">← Volver al panel</Link>
      </div>

      {errorOperacion && <div className="alert alert-danger" role="alert">{errorOperacion}</div>}
      {mensajeExito && <div className="alert alert-success" role="status">{mensajeExito}</div>}

      {cargando ? (
        <div className="text-center py-5" role="status">Cargando catálogo…</div>
      ) : (
        <div className="row g-4 align-items-start">
          <div className="col-lg-5">
            <FormularioProductoServicio
              key={articuloEditando?.codigo ?? 'nuevo'}
              valoresIniciales={valoresFormulario}
              estaEditando={articuloEditando !== null}
              alEnviar={manejarRegistroArticulo}
              alCancelar={() => establecerArticuloEditando(null)}
            />
          </div>
          <div className="col-lg-7">
            <section className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h4 mb-3">Catálogo conectado</h2>
                <p className="text-secondary">Los cambios se guardan en los servicios de productos y servicios.</p>
                <ListaProductoServicio
                  articulos={articulos}
                  alEditar={manejarEdicionArticulo}
                  alEliminar={manejarEliminacionArticulo}
                />
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}

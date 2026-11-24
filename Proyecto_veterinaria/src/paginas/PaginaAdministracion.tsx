import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormularioProductoServicio, type DatosFormularioProductoServicio } from '../Componentes/organismos/FormularioProductoServicio';
import { ListaProductoServicio, type ElementoAdministracion } from '../Componentes/organismos/ListaProductoServicio';
import { useCatalogo } from '../context/useCatalogo';
import type { Producto, Servicio } from '../types';
import '../admin.css';

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
  const [vistaActiva, establecerVistaActiva] = useState<'Todos' | 'Producto' | 'Servicio'>('Todos');
  const [busqueda, establecerBusqueda] = useState('');

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

  const articulosVisibles = articulos.filter((articulo) => {
    const coincideTipo = vistaActiva === 'Todos'
      || (vistaActiva === 'Producto' && articulo.categoria.startsWith('Producto'))
      || (vistaActiva === 'Servicio' && articulo.categoria.startsWith('Servicio'));
    const texto = `${articulo.codigo} ${articulo.nombre} ${articulo.categoria}`.toLowerCase();
    return coincideTipo && texto.includes(busqueda.trim().toLowerCase());
  });

  return (
    <main className="admin-page catalog-admin-page">
      <div className="container admin-page__container">
        <header className="catalog-admin-header">
          <div>
            <p className="admin-eyebrow mb-1">VETERINARIA SAN MARCOS · ADMINISTRACIÓN</p>
            <h1>Gestión de productos y servicios</h1>
            <p>Administra el catálogo desde un solo lugar.</p>
          </div>
          <Link to="/admin" className="btn catalog-admin-back">← Volver al panel</Link>
        </header>

        {errorOperacion && <div className="alert alert-danger" role="alert">{errorOperacion}</div>}
        {mensajeExito && <div className="alert alert-success" role="status">{mensajeExito}</div>}

        {cargando ? (
          <div className="catalog-admin-loading" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            Cargando catálogo…
          </div>
        ) : (
          <>
            <section className="catalog-admin-summary" aria-label="Resumen del catálogo">
              <button type="button" className={vistaActiva === 'Todos' ? 'catalog-summary-card active' : 'catalog-summary-card'} onClick={() => establecerVistaActiva('Todos')}>
                <span className="catalog-summary-icon">CAT</span>
                <span><strong>{articulos.length}</strong><small>Todos los registros</small></span>
              </button>
              <button type="button" className={vistaActiva === 'Producto' ? 'catalog-summary-card active' : 'catalog-summary-card'} onClick={() => establecerVistaActiva('Producto')}>
                <span className="catalog-summary-icon">PRO</span>
                <span><strong>{productos.length}</strong><small>Productos</small></span>
              </button>
              <button type="button" className={vistaActiva === 'Servicio' ? 'catalog-summary-card active' : 'catalog-summary-card'} onClick={() => establecerVistaActiva('Servicio')}>
                <span className="catalog-summary-icon">SER</span>
                <span><strong>{servicios.length}</strong><small>Servicios</small></span>
              </button>
            </section>

            <div className="catalog-admin-grid">
              <aside className="catalog-admin-form-column">
                <FormularioProductoServicio
                  key={articuloEditando?.codigo ?? 'nuevo'}
                  valoresIniciales={valoresFormulario}
                  estaEditando={articuloEditando !== null}
                  alEnviar={manejarRegistroArticulo}
                  alCancelar={() => establecerArticuloEditando(null)}
                />
              </aside>

              <section className="catalog-admin-list-card" aria-labelledby="catalog-list-title">
                <div className="catalog-admin-list-header">
                  <div>
                    <p className="admin-eyebrow mb-1">CATÁLOGO CONECTADO</p>
                    <h2 id="catalog-list-title">Artículos registrados</h2>
                  </div>
                  <label className="catalog-admin-search">
                    <span className="visually-hidden">Buscar en el catálogo</span>
                    <input
                      type="search"
                      value={busqueda}
                      onChange={(evento) => establecerBusqueda(evento.target.value)}
                      placeholder="Buscar nombre o código"
                    />
                  </label>
                </div>

                <ListaProductoServicio
                  articulos={articulosVisibles}
                  alEditar={manejarEdicionArticulo}
                  alEliminar={manejarEliminacionArticulo}
                />
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

import { useMemo, useState } from 'react';
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
  const [busqueda, establecerBusqueda] = useState('');
  const [tipoFiltro, establecerTipoFiltro] = useState<'Todos' | 'Producto' | 'Servicio'>('Todos');
  const articulos: ElementoAdministracion[] = useMemo(() => [
    ...servicios.map((servicio) => ({
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      tipo: 'Servicio' as const,
      categoria: servicio.categoria,
      precio: servicio.precio,
    })),
    ...productos.map((producto) => ({
      codigo: producto.codigo,
      nombre: producto.nombre,
      tipo: 'Producto' as const,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    })),
  ], [productos, servicios]);
  const articulosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase();
    return articulos.filter((articulo) => {
      const coincideTipo = tipoFiltro === 'Todos' || articulo.tipo === tipoFiltro;
      const coincideTexto = !texto
        || [articulo.codigo, articulo.nombre, articulo.categoria, articulo.tipo]
          .some((valor) => valor.toLocaleLowerCase().includes(texto));
      return coincideTipo && coincideTexto;
    });
  }, [articulos, busqueda, tipoFiltro]);

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
          <Link className="admin-catalog__back" to="/admin">Volver al panel <span aria-hidden="true">↗</span></Link>
        </div>

        <section className="admin-catalog__metrics" aria-label="Resumen del catálogo">
          <div className="admin-catalog__metric">
            <span>Productos</span>
            <strong>{productos.length}</strong>
          </div>
          <div className="admin-catalog__metric">
            <span>Servicios</span>
            <strong>{servicios.length}</strong>
          </div>
          <div className="admin-catalog__metric admin-catalog__metric--total">
            <span>Total de artículos</span>
            <strong>{articulos.length}</strong>
          </div>
        </section>

        <div className="admin-catalog__workspace">
          <section className="admin-catalog__form-panel" aria-labelledby="formulario-catalogo">
            <div className="admin-catalog__panel-heading">
              <span className="admin-catalog__panel-icon" aria-hidden="true">{articuloEditando ? '✎' : '+'}</span>
              <div>
                <p className="admin-eyebrow">{articuloEditando ? 'EDICIÓN' : 'CATÁLOGO'}</p>
                <h2 id="formulario-catalogo">{articuloEditando ? 'Editar artículo' : 'Agregar artículo'}</h2>
              </div>
            </div>
          <FormularioProductoServicio
            key={articuloEditando?.codigo ?? 'nuevo'}
            valoresIniciales={valoresFormulario}
            estaEditando={articuloEditando !== null}
            alEnviar={manejarRegistroProductoServicio}
            alCancelar={() => establecerArticuloEditando(null)}
          />
          </section>

          <section className="admin-catalog__list-panel" aria-labelledby="lista-catalogo">
            <div className="admin-catalog__list-heading">
              <div>
                <p className="admin-eyebrow">INVENTARIO</p>
                <h2 id="lista-catalogo">Productos y servicios</h2>
                <p>Busca, filtra y administra los artículos publicados.</p>
              </div>
              <span className="admin-catalog__result-count">{articulosFiltrados.length} de {articulos.length}</span>
            </div>
            <div className="admin-catalog__filters">
              <div>
                <label className="form-label" htmlFor="admin-catalog-search">Buscar</label>
                <input
                  id="admin-catalog-search"
                  className="form-control"
                  type="search"
                  value={busqueda}
                  onChange={(event) => establecerBusqueda(event.target.value)}
                  placeholder="Nombre, código o categoría"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="admin-catalog-type">Tipo de artículo</label>
                <select
                  id="admin-catalog-type"
                  className="form-select"
                  value={tipoFiltro}
                  onChange={(event) => establecerTipoFiltro(event.target.value as 'Todos' | 'Producto' | 'Servicio')}
                >
                  <option value="Todos">Todos</option>
                  <option value="Producto">Productos</option>
                  <option value="Servicio">Servicios</option>
                </select>
              </div>
            </div>
            <ListaProductoServicio
              articulos={articulosFiltrados}
              alEditar={manejarEdicionArticulo}
              alEliminar={manejarEliminacionArticulo}
            />
          </section>
        </div>
      </div>
    </main>
  );
};
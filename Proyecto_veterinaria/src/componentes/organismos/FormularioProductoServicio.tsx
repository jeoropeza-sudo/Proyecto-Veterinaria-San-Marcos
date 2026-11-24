import { useState, type FormEvent } from 'react';

export interface DatosFormularioProductoServicio {
  tipo: 'Producto' | 'Servicio';
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  principio: string;
  presentacion: string;
  especie: string;
  duracion: string;
}

type CampoFormulario = keyof Omit<DatosFormularioProductoServicio, 'tipo' | 'precio' | 'stock'> | 'precio' | 'stock';
type ErroresFormulario = Partial<Record<CampoFormulario, string>>;

const valoresPredeterminados: DatosFormularioProductoServicio = {
  tipo: 'Servicio',
  nombre: '',
  categoria: 'Otros',
  precio: 0,
  descripcion: '',
  stock: 0,
  imagen: '',
  principio: '',
  presentacion: '',
  especie: 'Perro / Gato',
  duracion: '30 min',
};

interface PropiedadesFormulario {
  valoresIniciales?: DatosFormularioProductoServicio;
  estaEditando?: boolean;
  alEnviar: (datos: DatosFormularioProductoServicio) => Promise<void>;
  alCancelar?: () => void;
}

function mostrarError(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron guardar los cambios.';
}

export function FormularioProductoServicio({
  valoresIniciales = valoresPredeterminados,
  estaEditando = false,
  alEnviar,
  alCancelar,
}: PropiedadesFormulario) {
  const [tipo, establecerTipo] = useState(valoresIniciales.tipo);
  const [nombre, establecerNombre] = useState(valoresIniciales.nombre);
  const [categoria, establecerCategoria] = useState(valoresIniciales.categoria);
  const [precio, establecerPrecio] = useState(String(valoresIniciales.precio));
  const [descripcion, establecerDescripcion] = useState(valoresIniciales.descripcion);
  const [stock, establecerStock] = useState(String(valoresIniciales.stock));
  const [imagen, establecerImagen] = useState(valoresIniciales.imagen);
  const [principio, establecerPrincipio] = useState(valoresIniciales.principio);
  const [presentacion, establecerPresentacion] = useState(valoresIniciales.presentacion);
  const [especie, establecerEspecie] = useState(valoresIniciales.especie);
  const [duracion, establecerDuracion] = useState(valoresIniciales.duracion);
  const [errores, establecerErrores] = useState<ErroresFormulario>({});
  const [errorEnvio, establecerErrorEnvio] = useState<string | null>(null);
  const [enviando, establecerEnviando] = useState(false);

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const nuevosErrores: ErroresFormulario = {};
    const precioNumerico = Number(precio);
    const stockNumerico = Number(stock);

    if (!nombre.trim()) nuevosErrores.nombre = 'Ingresa el nombre.';
    if (!categoria.trim()) nuevosErrores.categoria = 'Ingresa la categoría.';
    if (precio.trim() === '') {
      nuevosErrores.precio = 'Ingresa un precio.';
    } else if (!Number.isInteger(precioNumerico) || precioNumerico < 0) {
      nuevosErrores.precio = 'El precio debe ser un número entero igual o mayor que cero.';
    }

    if (tipo === 'Producto') {
      if (stock.trim() === '') {
        nuevosErrores.stock = 'Ingresa el stock.';
      } else if (!Number.isInteger(stockNumerico) || stockNumerico < 0) {
        nuevosErrores.stock = 'El stock debe ser un número entero igual o mayor que cero.';
      }
      if (!imagen.trim()) nuevosErrores.imagen = 'Ingresa la ruta de una imagen.';
    } else {
      if (!especie.trim()) nuevosErrores.especie = 'Ingresa la especie atendida.';
      if (!duracion.trim()) nuevosErrores.duracion = 'Ingresa la duración estimada.';
    }

    establecerErrores(nuevosErrores);
    establecerErrorEnvio(null);
    if (Object.keys(nuevosErrores).length > 0) return;

    establecerEnviando(true);
    try {
      await alEnviar({
        tipo,
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: precioNumerico,
        descripcion: descripcion.trim(),
        stock: stockNumerico,
        imagen: imagen.trim(),
        principio: principio.trim(),
        presentacion: presentacion.trim(),
        especie: especie.trim(),
        duracion: duracion.trim(),
      });

      if (!estaEditando) {
        establecerTipo('Servicio');
        establecerNombre('');
        establecerCategoria('Otros');
        establecerPrecio('');
        establecerDescripcion('');
        establecerStock('0');
        establecerImagen('');
        establecerPrincipio('');
        establecerPresentacion('');
        establecerEspecie('Perro / Gato');
        establecerDuracion('30 min');
      }
    } catch (error) {
      establecerErrorEnvio(mostrarError(error));
    } finally {
      establecerEnviando(false);
    }
  };

  const cambiarCampo = (campo: CampoFormulario) => {
    establecerErrores((actuales) => ({ ...actuales, [campo]: undefined }));
  };

  return (
    <form onSubmit={manejarEnvio} className="p-4 border rounded shadow-sm bg-light" noValidate>
      <h2 className="h4 mb-3">{estaEditando ? 'Editar artículo' : 'Registrar artículo'}</h2>
      {errorEnvio && <div className="alert alert-danger" role="alert">{errorEnvio}</div>}

      {!estaEditando && (
        <div className="mb-3">
          <label htmlFor="tipo-articulo" className="form-label">Tipo de artículo</label>
          <select
            id="tipo-articulo"
            className="form-select"
            value={tipo}
            onChange={(evento) => establecerTipo(evento.target.value === 'Producto' ? 'Producto' : 'Servicio')}
          >
            <option value="Servicio">Servicio</option>
            <option value="Producto">Producto</option>
          </select>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="nombre-articulo" className="form-label">Nombre</label>
        <input
          id="nombre-articulo"
          className={`form-control${errores.nombre ? ' is-invalid' : ''}`}
          value={nombre}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? 'nombre-articulo-error' : undefined}
          onChange={(evento) => {
            establecerNombre(evento.target.value);
            cambiarCampo('nombre');
          }}
        />
        {errores.nombre && <div className="invalid-feedback" id="nombre-articulo-error">{errores.nombre}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="categoria-articulo" className="form-label">Categoría</label>
        <input
          id="categoria-articulo"
          className={`form-control${errores.categoria ? ' is-invalid' : ''}`}
          value={categoria}
          aria-invalid={Boolean(errores.categoria)}
          aria-describedby={errores.categoria ? 'categoria-articulo-error' : undefined}
          onChange={(evento) => {
            establecerCategoria(evento.target.value);
            cambiarCampo('categoria');
          }}
        />
        {errores.categoria && <div className="invalid-feedback" id="categoria-articulo-error">{errores.categoria}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="precio-articulo" className="form-label">Precio (CLP)</label>
        <input
          id="precio-articulo"
          type="number"
          min="0"
          step="1"
          className={`form-control${errores.precio ? ' is-invalid' : ''}`}
          value={precio}
          aria-invalid={Boolean(errores.precio)}
          aria-describedby={errores.precio ? 'precio-articulo-error' : undefined}
          onChange={(evento) => {
            establecerPrecio(evento.target.value);
            cambiarCampo('precio');
          }}
        />
        {errores.precio && <div className="invalid-feedback" id="precio-articulo-error">{errores.precio}</div>}
      </div>

      {tipo === 'Producto' ? (
        <>
          <div className="mb-3">
            <label htmlFor="stock-articulo" className="form-label">Stock</label>
            <input
              id="stock-articulo"
              type="number"
              min="0"
              step="1"
              className={`form-control${errores.stock ? ' is-invalid' : ''}`}
              value={stock}
              aria-invalid={Boolean(errores.stock)}
              aria-describedby={errores.stock ? 'stock-articulo-error' : undefined}
              onChange={(evento) => {
                establecerStock(evento.target.value);
                cambiarCampo('stock');
              }}
            />
            {errores.stock && <div className="invalid-feedback" id="stock-articulo-error">{errores.stock}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="principio-articulo" className="form-label">Principio activo</label>
            <input
              id="principio-articulo"
              className="form-control"
              value={principio}
              onChange={(evento) => establecerPrincipio(evento.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="presentacion-articulo" className="form-label">Presentación</label>
            <input
              id="presentacion-articulo"
              className="form-control"
              value={presentacion}
              onChange={(evento) => establecerPresentacion(evento.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imagen-articulo" className="form-label">Ruta de imagen</label>
            <input
              id="imagen-articulo"
              className={`form-control${errores.imagen ? ' is-invalid' : ''}`}
              value={imagen}
              aria-invalid={Boolean(errores.imagen)}
              aria-describedby={errores.imagen ? 'imagen-articulo-error' : undefined}
              onChange={(evento) => {
                establecerImagen(evento.target.value);
                cambiarCampo('imagen');
              }}
            />
            {errores.imagen && <div className="invalid-feedback" id="imagen-articulo-error">{errores.imagen}</div>}
          </div>
        </>
      ) : (
        <div className="mb-3">
          <label htmlFor="duracion-articulo" className="form-label">Duración estimada</label>
          <input
            id="duracion-articulo"
            className={`form-control${errores.duracion ? ' is-invalid' : ''}`}
            value={duracion}
            aria-invalid={Boolean(errores.duracion)}
            aria-describedby={errores.duracion ? 'duracion-articulo-error' : undefined}
            onChange={(evento) => {
              establecerDuracion(evento.target.value);
              cambiarCampo('duracion');
            }}
          />
          {errores.duracion && <div className="invalid-feedback" id="duracion-articulo-error">{errores.duracion}</div>}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="especie-articulo" className="form-label">Especie atendida</label>
        <input
          id="especie-articulo"
          className={`form-control${errores.especie ? ' is-invalid' : ''}`}
          value={especie}
          aria-invalid={Boolean(errores.especie)}
          aria-describedby={errores.especie ? 'especie-articulo-error' : undefined}
          onChange={(evento) => {
            establecerEspecie(evento.target.value);
            cambiarCampo('especie');
          }}
        />
        {errores.especie && <div className="invalid-feedback" id="especie-articulo-error">{errores.especie}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion-articulo" className="form-label">Descripción</label>
        <textarea
          id="descripcion-articulo"
          className="form-control"
          rows={3}
          value={descripcion}
          onChange={(evento) => establecerDescripcion(evento.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
        {enviando ? 'Guardando…' : estaEditando ? 'Guardar cambios' : `Registrar ${tipo.toLowerCase()}`}
      </button>
      {estaEditando && alCancelar && (
        <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={alCancelar} disabled={enviando}>
          Cancelar edición
        </button>
      )}
    </form>
  );
}

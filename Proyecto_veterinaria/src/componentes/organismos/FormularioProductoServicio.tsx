import React, { useState } from 'react';

export interface DatosFormularioProductoServicio {
  nombre: string;
  categoria: CategoriaFormularioProductoServicio;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
}

export type CategoriaFormularioProductoServicio = 'Servicio' | 'Producto' | 'Consulta' | 'Vacunacion';

type CampoFormularioProductoServicio = 'nombre' | 'precio' | 'stock';
type ErroresFormularioProductoServicio = Partial<Record<CampoFormularioProductoServicio, string>>;

const valoresPredeterminados: DatosFormularioProductoServicio = {
  nombre: '',
  categoria: 'Servicio',
  precio: 0,
  descripcion: '',
  stock: 0,
  imagen: '/imagenes/condro.png',
};

function esCategoriaFormulario(value: string): value is CategoriaFormularioProductoServicio {
  return ['Servicio', 'Producto', 'Consulta', 'Vacunacion'].includes(value);
}

interface PropiedadesFormularioProductoServicio {
  valoresIniciales?: DatosFormularioProductoServicio;
  estaEditando?: boolean;
  alEnviar: (datos: DatosFormularioProductoServicio) => void;
  alCancelar?: () => void;
}

export const FormularioProductoServicio: React.FC<PropiedadesFormularioProductoServicio> = ({
  valoresIniciales = valoresPredeterminados,
  estaEditando = false,
  alEnviar,
  alCancelar,
}) => {
  const [nombre, establecerNombre] = useState(valoresIniciales.nombre);
  const [categoria, establecerCategoria] = useState<CategoriaFormularioProductoServicio>(valoresIniciales.categoria);
  const [precio, establecerPrecio] = useState<string | number>(valoresIniciales.precio);
  const [descripcion, establecerDescripcion] = useState(valoresIniciales.descripcion);
  const [stock, establecerStock] = useState(String(valoresIniciales.stock));
  const [imagen, establecerImagen] = useState(valoresIniciales.imagen);
  const [erroresCampos, establecerErroresCampos] = useState<ErroresFormularioProductoServicio>({});

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    const errores: ErroresFormularioProductoServicio = {};
    if (!nombre.trim()) {
      errores.nombre = 'Ingresa el nombre del servicio o producto.';
    }

    const precioNumerico = Number(precio);
    if (String(precio).trim() === '') {
      errores.precio = 'Ingresa un precio.';
    } else if (!Number.isFinite(precioNumerico) || precioNumerico < 0) {
      errores.precio = 'El precio debe ser un número igual o mayor que cero.';
    }

    if (categoria === 'Producto') {
      const stockNumerico = Number(stock);
      if (stock.trim() === '') {
        errores.stock = 'Ingresa el stock inicial.';
      } else if (!Number.isInteger(stockNumerico) || stockNumerico < 0) {
        errores.stock = 'El stock debe ser un número entero igual o mayor que cero.';
      }
    }

    establecerErroresCampos(errores);
    if (Object.keys(errores).length > 0) return;

    alEnviar({
      nombre: nombre.trim(),
      categoria,
      precio: precioNumerico,
      descripcion,
      stock: Number(stock),
      imagen,
    });

    if (!estaEditando) {
      establecerNombre('');
      establecerCategoria('Servicio');
      establecerPrecio('');
      establecerDescripcion('');
      establecerStock('0');
      establecerImagen('/imagenes/condro.png');
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="p-4 border rounded shadow-sm bg-light" noValidate>
      <h3 className="mb-3">Registrar Servicio o Producto</h3>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre del servicio/producto
        </label>
        <input
          type="text"
          id="nombre"
          className={`form-control${erroresCampos.nombre ? ' is-invalid' : ''}`}
          value={nombre}
          aria-invalid={Boolean(erroresCampos.nombre)}
          aria-describedby={erroresCampos.nombre ? 'nombre-error' : undefined}
          onChange={(e) => {
            establecerNombre(e.target.value);
            establecerErroresCampos((actuales) => ({ ...actuales, nombre: undefined }));
          }}
        />
        {erroresCampos.nombre && (
          <div className="invalid-feedback" id="nombre-error">{erroresCampos.nombre}</div>
        )}
      </div>

      {categoria === 'Producto' && (
        <>
          <div className="mb-3">
            <label htmlFor="stock" className="form-label">Stock inicial</label>
            <input
              type="number"
              id="stock"
              className={`form-control${erroresCampos.stock ? ' is-invalid' : ''}`}
              min="0"
              step="1"
              value={stock}
              aria-invalid={Boolean(erroresCampos.stock)}
              aria-describedby={erroresCampos.stock ? 'stock-error' : undefined}
              onChange={(e) => {
                establecerStock(e.target.value);
                establecerErroresCampos((actuales) => ({ ...actuales, stock: undefined }));
              }}
            />
            {erroresCampos.stock && (
              <div className="invalid-feedback" id="stock-error">{erroresCampos.stock}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="imagen" className="form-label">Ruta de imagen (desde public)</label>
            <input
              type="text"
              id="imagen"
              className="form-control"
              value={imagen}
              onChange={(e) => establecerImagen(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="mb-3">
        <label htmlFor="categoria" className="form-label">
          Categoría
        </label>
        <select
          id="categoria"
          className="form-select"
          value={categoria}
          onChange={(e) => {
            if (esCategoriaFormulario(e.target.value)) establecerCategoria(e.target.value);
          }}
        >
          <option value="Servicio">Servicio</option>
          <option value="Consulta">Consulta Médica</option>
          <option value="Vacunacion">Vacunación</option>
          <option value="Producto">Producto</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="precio" className="form-label">
          Precio
        </label>
        <input
          type="number"
          id="precio"
          className={`form-control${erroresCampos.precio ? ' is-invalid' : ''}`}
          min="0"
          step="any"
          value={precio}
          aria-invalid={Boolean(erroresCampos.precio)}
          aria-describedby={erroresCampos.precio ? 'precio-error' : undefined}
          onChange={(e) => {
            establecerPrecio(e.target.value);
            establecerErroresCampos((actuales) => ({ ...actuales, precio: undefined }));
          }}
        />
        {erroresCampos.precio && (
          <div className="invalid-feedback" id="precio-error">{erroresCampos.precio}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">
          Descripción
        </label>
        <textarea
          id="descripcion"
          className="form-control"
          rows={3}
          value={descripcion}
          onChange={(e) => establecerDescripcion(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        {estaEditando ? 'Guardar cambios' : `Registrar ${categoria === 'Producto' ? 'Producto' : 'Servicio'}`}
      </button>
      {estaEditando && alCancelar && (
        <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={alCancelar}>
          Cancelar edición
        </button>
      )}
    </form>
  );
};
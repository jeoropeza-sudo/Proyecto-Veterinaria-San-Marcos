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

function esCategoriaFormulario(value: string): value is CategoriaFormularioProductoServicio {
  return ['Servicio', 'Producto', 'Consulta', 'Vacunacion'].includes(value);
}

interface PropiedadesFormularioProductoServicio {
  alEnviar: (datos: DatosFormularioProductoServicio) => void;
}

export const FormularioProductoServicio: React.FC<PropiedadesFormularioProductoServicio> = ({ alEnviar }) => {
  const [nombre, establecerNombre] = useState('');
  const [categoria, establecerCategoria] = useState<CategoriaFormularioProductoServicio>('Servicio');
  const [precio, establecerPrecio] = useState<string | number>('');
  const [descripcion, establecerDescripcion] = useState('');
  const [stock, establecerStock] = useState('0');
  const [imagen, establecerImagen] = useState('/imagenes/condro.png');
  const [errorNombre, establecerErrorNombre] = useState('');

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      establecerErrorNombre('El nombre es obligatorio');
      return;
    }

    establecerErrorNombre('');

    alEnviar({
      nombre,
      categoria,
      precio: Number(precio) || 0,
      descripcion,
      stock: Number(stock) || 0,
      imagen,
    });

  
    establecerNombre('');
    establecerCategoria('Servicio');
    establecerPrecio('');
    establecerDescripcion('');
    establecerStock('0');
    establecerImagen('/imagenes/condro.png');
  };

  return (
    <form onSubmit={manejarEnvio} className="p-4 border rounded shadow-sm bg-light">
      <h3 className="mb-3">Registrar Servicio o Producto</h3>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre del servicio/producto
        </label>
        <input
          type="text"
          id="nombre"
          className={`form-control ${errorNombre ? 'is-invalid' : ''}`}
          value={nombre}
          onChange={(e) => {
            establecerNombre(e.target.value);
            if (e.target.value.trim()) establecerErrorNombre('');
          }}
        />
        {errorNombre && <div className="invalid-mensajeAccion">{errorNombre}</div>}
      </div>

      {categoria === 'Producto' && (
        <>
          <div className="mb-3">
            <label htmlFor="stock" className="form-label">Stock inicial</label>
            <input
              type="number"
              id="stock"
              className="form-control"
              min="0"
              value={stock}
              onChange={(e) => establecerStock(e.target.value)}
            />
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
          className="form-control"
          value={precio}
          onChange={(e) => establecerPrecio(e.target.value)}
        />
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
        Registrar {categoria === 'Producto' ? 'Producto' : 'Servicio'}
      </button>
    </form>
  );
};
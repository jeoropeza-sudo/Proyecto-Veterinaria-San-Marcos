import React, { useState } from 'react';

export interface ProductFormData {
  nombre: string;
  categoria: ProductFormCategory;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
}

export type ProductFormCategory = 'Servicio' | 'Producto' | 'Consulta' | 'Vacunacion';

function isProductFormCategory(value: string): value is ProductFormCategory {
  return ['Servicio', 'Producto', 'Consulta', 'Vacunacion'].includes(value);
}

interface ProductServiceFormProps {
  onSubmit: (data: ProductFormData) => void;
}

export const ProductServiceForm: React.FC<ProductServiceFormProps> = ({ onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<ProductFormCategory>('Servicio');
  const [precio, setPrecio] = useState<string | number>('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('0');
  const [imagen, setImagen] = useState('/imagenes/condro.png');
  const [errorNombre, setErrorNombre] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setErrorNombre('El nombre es obligatorio');
      return;
    }

    setErrorNombre('');

    onSubmit({
      nombre,
      categoria,
      precio: Number(precio) || 0,
      descripcion,
      stock: Number(stock) || 0,
      imagen,
    });

  
    setNombre('');
    setCategoria('Servicio');
    setPrecio('');
    setDescripcion('');
    setStock('0');
    setImagen('/imagenes/condro.png');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
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
            setNombre(e.target.value);
            if (e.target.value.trim()) setErrorNombre('');
          }}
        />
        {errorNombre && <div className="invalid-feedback">{errorNombre}</div>}
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
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imagen" className="form-label">Ruta de imagen (desde public)</label>
            <input
              type="text"
              id="imagen"
              className="form-control"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
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
            if (isProductFormCategory(e.target.value)) setCategoria(e.target.value);
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
          onChange={(e) => setPrecio(e.target.value)}
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
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Registrar {categoria === 'Producto' ? 'Producto' : 'Servicio'}
      </button>
    </form>
  );
};
// src/componentes/organismos/ProductServiceForm.tsx
import React, { useState } from 'react';

export interface ProductFormData {
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
}

interface ProductServiceFormProps {
  onSubmit: (data: ProductFormData) => void;
}

export const ProductServiceForm: React.FC<ProductServiceFormProps> = ({ onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Servicio');
  const [precio, setPrecio] = useState<string | number>('');
  const [descripcion, setDescripcion] = useState('');
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
    });

    // Limpiar el formulario
    setNombre('');
    setCategoria('Servicio');
    setPrecio('');
    setDescripcion('');
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

      <div className="mb-3">
        <label htmlFor="categoria" className="form-label">
          Categoría
        </label>
        <select
          id="categoria"
          className="form-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="Servicio">Servicio</option>
          <option value="Producto">Producto</option>
          <option value="Consulta">Consulta Médica</option>
          <option value="Vacunacion">Vacunación</option>
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
        Registrar Servicio
      </button>
    </form>
  );
};
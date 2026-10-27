
import React, { useState } from 'react';
import { validarRut } from '../../utils/validadorRut';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  run: string;
  rol: 'Administrador' | 'Cliente';
}

export const AdminUsers: React.FC = () => {
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: 'Alexis Core', email: 'alexio@sanmarcos.cl', run: '12345678-5', rol: 'Administrador' },
    { id: 2, nombre: 'Vicente Admin', email: 'admin@sanmarcos.cl', run: '18765432-1', rol: 'Administrador' },
  ]);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [run, setRun] = useState('');
  const [rol, setRol] = useState<'Administrador' | 'Cliente'>('Cliente');
  const [errorRun, setErrorRun] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarRut(run)) {
      setErrorRun('El RUN ingresado no es válido (dígito verificador incorrecto).');
      return;
    }
    setErrorRun('');

    const nuevoUsuario: Usuario = {
      id: Date.now(),
      nombre,
      email,
      run,
      rol,
    };

    setUsuarios([...usuarios, nuevoUsuario]);
    setNombre('');
    setEmail('');
    setRun('');
  };

  const eliminarUsuario = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  return (
    <div className="admin-users">
      <form onSubmit={handleSubmit} className="admin-users__form">
        <h2 className="admin-section-title">Registrar usuario</h2>
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="admin-user-name" className="form-label">Nombre</label>
            <input 
              id="admin-user-name"
              type="text" 
              className="form-control" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="admin-user-email" className="form-label">Correo electrónico</label>
            <input 
              id="admin-user-email"
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="admin-user-run" className="form-label">RUN</label>
            <input 
              id="admin-user-run"
              type="text" 
              className="form-control" 
              value={run} 
              onChange={(e) => setRun(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="admin-user-role" className="form-label">Rol</label>
            <select 
              id="admin-user-role"
              className="form-select" 
              value={rol} 
              onChange={(e) => setRol(e.target.value as 'Administrador' | 'Cliente')}
            >
              <option value="Cliente">Cliente</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">Agregar</button>
          </div>
        </div>
        {errorRun && <div className="admin-users__error" role="alert">{errorRun}</div>}
      </form>

      <section className="admin-users__table-wrap" aria-labelledby="tabla-usuarios-title">
          <div className="admin-users__table-heading">
            <div>
              <p className="admin-eyebrow">CUENTAS</p>
              <h2 id="tabla-usuarios-title" className="admin-section-title">Usuarios registrados</h2>
            </div>
            <span className="admin-users__total">{usuarios.length} total</span>
          </div>
          <table className="table admin-users__table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">RUN</th>
                <th scope="col">Rol</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.run}</td>
                  <td>
                    <span className={`badge bg-${u.rol === 'Administrador' ? 'danger' : 'secondary'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger" 
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </section>
    </div>
  );
};
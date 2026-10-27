import React from 'react';
import { Link } from 'react-router-dom';

export const PaginaInicio: React.FC = () => {
  return (
    <div className="home-page" style={{ backgroundColor: '#EBF3F5', minHeight: '100vh' }}>
      <section className="py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
          
              <span 
                className="badge rounded-pill px-3 py-2 mb-3" 
                style={{ backgroundColor: '#00C9A7', color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}
              >
                Más de 15 años de experiencia en Rancagua
              </span>

             
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#102A43', lineHeight: 1.1 }}>
                Salud y bienestar para tu mejor amigo
              </h1>

              
              <p className="lead mb-4" style={{ color: '#627D98', fontSize: '1.05rem' }}>
                En Veterinaria San Marcos cuidamos de tus mascotas con atención profesional integral, pabellón quirúrgico, laboratorio clínico y servicios de urgencia.
              </p>

             
              <div className="d-flex flex-wrap gap-3">
                <Link to="/servicios" className="btn btn-lg px-4 text-white" style={{ backgroundColor: '#102A43', fontWeight: 600, borderRadius: '8px' }}>
                  Ver Servicios Médicos
                </Link>
                <Link to="/productos" className="btn btn-lg px-4 text-white" style={{ backgroundColor: '#00C9A7', fontWeight: 600, borderRadius: '8px' }}>
                  Farmacia y Productos
                </Link>
                <Link to="/novedades" className="btn btn-lg px-4 fw-semibold" style={{ color: '#153259', border: '2px solid #153259', borderRadius: '8px' }}>
                  Ver novedades
                </Link>
              </div>
            </div>

           
            <div className="col-12 col-lg-6 text-center">
              <img
                src="/imagenes/clinica-veterinaria-san marcos.jpg" 
                alt="Clínica Veterinaria San Marcos"
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: '380px', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaginaInicio;
import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../Componentes/atomos/Badge';

export const PaginaInicio: React.FC = () => {
  return (
    <div className="home-page w-100 overflow-hidden" style={{ backgroundColor: '#EBF3F5', minHeight: '100vh' }}>
      {/* 1. HERO PRINCIPAL */}
      <section className="py-5 w-100">
        <div className="container-fluid px-4 px-md-5 py-4">
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
                <Link to="/servicios" className="btn btn-lg px-4 text-white shadow-sm" style={{ backgroundColor: '#102A43', fontWeight: 600, borderRadius: '8px' }}>
                  Ver Servicios Médicos
                </Link>
                <Link to="/productos" className="btn btn-lg px-4 text-white shadow-sm" style={{ backgroundColor: '#00C9A7', fontWeight: 600, borderRadius: '8px' }}>
                  Farmacia y Productos
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

      {/* 2. NOVEDADES Y BENEFICIOS */}
      <section className="py-5 bg-white w-100">
        <div className="container-fluid px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: '#102A43' }}>
              Novedades y Beneficios
            </h2>
            <p className="text-muted">
              Descubre las nuevas ventajas y prestaciones diseñadas para ti y tus mascotas
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                <img
                  src="/imagenes/camion-domicilio.jpeg"
                  className="card-img-top"
                  style={{ height: '160px', objectFit: 'cover' }}
                  alt="Atención a Domicilio"
                />
                <div className="card-body d-flex flex-column p-4">
                  <Badge text="¡Nuevo!" variant="success" className="align-self-start mb-2" />
                  <h5 className="card-title fw-bold text-dark fs-6">Atención a Domicilio</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    Agenda consultas y controles preventivos directamente en la comodidad de tu hogar.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                <img
                  src="/imagenes/Antiparasitario.jpeg"
                  className="card-img-top"
                  style={{ height: '160px', objectFit: 'cover' }}
                  alt="Antiparasitarios"
                />
                <div className="card-body d-flex flex-column p-4">
                  <Badge text="Promoción" variant="primary" className="align-self-start mb-2" />
                  <h5 className="card-title fw-bold text-dark fs-6">20% en Antiparasitarios</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    Aprovecha precios especiales en toda nuestra línea de pipetas y comprimidos este mes.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop"
                  className="card-img-top"
                  style={{ height: '160px', objectFit: 'cover' }}
                  alt="Spa y Peluquería"
                />
                <div className="card-body d-flex flex-column p-4">
                  <Badge text="Especializado" variant="success" className="align-self-start mb-2" />
                  <h5 className="card-title fw-bold text-dark fs-6">Spa y Peluquería Low-Stress</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    Técnicas de manejo especializadas y exclusivas para el cuidado del pelaje de perros y gatos.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                <img
                  src="/imagenes/premios de perros.jpeg"
                  className="card-img-top"
                  style={{ height: '160px', objectFit: 'cover', objectPosition: 'top center' }}
                  alt="Comunidad San Marcos"
                />
                <div className="card-body d-flex flex-column p-4">
                  <Badge text="Comunidad" variant="warning" className="text-dark align-self-start mb-2" />
                  <h5 className="card-title fw-bold text-dark fs-6">Comunidad San Marcos</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    Acumula puntos por cada compra o reserva y cámbialos por accesorios o servicios gratuitos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUESTROS SERVICIOS PRINCIPALES */}
      <section className="py-5 w-100" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="container-fluid px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: '#102A43' }}>
              Nuestros Servicios Principales
            </h2>
            <p className="text-muted">
              Conoce algunas de las atenciones especializadas que ofrecemos en nuestra clínica de Rancagua
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                <img
                  src="/imagenes/consulta.webp"
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                  alt="Consulta General"
                />
                <div className="card-body text-center p-4">
                  <h5 className="card-title fw-bold" style={{ color: '#3B6D8C' }}>
                    Consulta General
                  </h5>
                  <p className="card-text text-muted">
                    Evaluación física completa y diagnóstico temprano para asegurar la salud de tu regalón.
                  </p>
                  <span
                    className="badge fs-6 fw-bold text-white mb-3 px-3 py-2"
                    style={{ backgroundColor: '#00C9A7' }}
                  >
                    Desde $15.000
                  </span>
                  <div>
                    <Link to="/servicios" className="btn btn-sm btn-outline-primary fw-bold">
                      Ver Categorías
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                <img
                  src="/imagenes/vacunas.webp"
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                  alt="Vacunación y Prevención"
                />
                <div className="card-body text-center p-4">
                  <h5 className="card-title fw-bold" style={{ color: '#3B6D8C' }}>
                    Vacunación y Prevención
                  </h5>
                  <p className="card-text text-muted">
                    Protección completa contra enfermedades infecciosas con planes de inmunización al día.
                  </p>
                  <span
                    className="badge fs-6 fw-bold text-white mb-3 px-3 py-2"
                    style={{ backgroundColor: '#00C9A7' }}
                  >
                    Desde $12.000
                  </span>
                  <div>
                    <Link to="/servicios" className="btn btn-sm btn-outline-primary fw-bold">
                      Ver Categorías
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                <img
                  src="/imagenes/veterinaria.webp"
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                  alt="Laboratorio y Cirugía"
                />
                <div className="card-body text-center p-4">
                  <h5 className="card-title fw-bold" style={{ color: '#3B6D8C' }}>
                    Laboratorio y Cirugía
                  </h5>
                  <p className="card-text text-muted">
                    Exámenes de sangre, perfil bioquímico y procedimientos quirúrgicos en pabellón equipado.
                  </p>
                  <span
                    className="badge fs-6 fw-bold text-white mb-3 px-3 py-2"
                    style={{ backgroundColor: '#00C9A7' }}
                  >
                    Desde $18.000
                  </span>
                  <div>
                    <Link to="/servicios" className="btn btn-sm btn-outline-primary fw-bold">
                      Ver Categorías
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FINAL */}
      <section className="py-5 w-100" style={{ backgroundColor: '#EBF3F5' }}>
        <div className="container-fluid px-4 px-md-5 text-center">
          <h3 className="fw-bold mb-3" style={{ color: '#102A43' }}>
            ¿Listo para cuidar la salud de tu mascota?
          </h3>
          <p className="text-muted mb-4 lead fs-6">
            Regístrate en nuestra plataforma para gestionar tus solicitudes o comunícate con nuestro equipo médico.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <Link
              to="/contacto"
              className="btn btn-lg text-white fw-bold px-4 shadow-sm"
              style={{ backgroundColor: '#36BBD9', borderRadius: '8px' }}
            >
              Contactar Clínica
            </Link>
            <Link
              to="/registro"
              className="btn btn-lg text-white fw-bold px-4 shadow-sm"
              style={{ backgroundColor: '#00C9A7', borderRadius: '8px' }}
            >
              Crear una Cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaginaInicio;
import type { Producto, Servicio } from '../types';

const API_PRODUCTOS = 'http://localhost:8081/api/productos';
const CLAVE_SERVICIOS = 'veterinaria.servicios';

function obtenerImagenServicio(categoria: string): string {
  if (categoria === 'Vacunación') return '/imagenes/vacunas.webp';
  if (categoria === 'Cirugía' || categoria === 'Exámenes') return '/imagenes/veterinaria.webp';
  if (categoria === 'Desparasitación') return '/imagenes/Antiparasitario.jpeg';
  return '/imagenes/consulta.webp';
}

const serviciosIniciales: Servicio[] = [
  { codigo: 'SV001', categoria: 'Consultas', nombre: 'Consulta general', especie: 'Perro / Gato', duracion: '30 min', precio: 15000, detalle: 'Evaluación clínica general y control de signos vitales.' },
  { codigo: 'SV002', categoria: 'Consultas', nombre: 'Consulta urgencia', especie: 'Perro / Gato', duracion: '30 min', precio: 25000, detalle: 'Atención prioritaria fuera de horario o malestar agudo.' },
  { codigo: 'SV003', categoria: 'Consultas', nombre: 'Control postoperatorio', especie: 'Perro / Gato', duracion: '20 min', precio: 10000, detalle: 'Revisión de heridas y evolución quirúrgica.' },
  { codigo: 'SV004', categoria: 'Consultas', nombre: 'Consulta ave / conejo', especie: 'Ave / Conejo', duracion: '30 min', precio: 18000, detalle: 'Medicina especializada para mascotas exóticas.' },
  { codigo: 'SV005', categoria: 'Consultas', nombre: 'Segunda opinión médica', especie: 'Todas', duracion: '40 min', precio: 20000, detalle: 'Evaluación integral de diagnósticos complejos previos.' },
  { codigo: 'VA001', categoria: 'Vacunación', nombre: 'Vacuna antirrábica canina', especie: 'Perro', duracion: '10 min', precio: 12000, detalle: 'Inmunización preventiva para perros.' },
  { codigo: 'VA002', categoria: 'Vacunación', nombre: 'Vacuna séxtuple canina', especie: 'Perro', duracion: '10 min', precio: 18000, detalle: 'Protección frente a múltiples enfermedades víricas.' },
  { codigo: 'VA003', categoria: 'Vacunación', nombre: 'Vacuna bivalente felina', especie: 'Gato', duracion: '10 min', precio: 15000, detalle: 'Inmunización preventiva para gatos.' },
  { codigo: 'VA004', categoria: 'Vacunación', nombre: 'Vacuna triple felina', especie: 'Gato', duracion: '10 min', precio: 17000, detalle: 'Refuerzo anual preventivo felino.' },
  { codigo: 'VA005', categoria: 'Vacunación', nombre: 'Vacuna Bordetella canina', especie: 'Perro', duracion: '10 min', precio: 14000, detalle: 'Prevención de tos de las perreras.' },
  { codigo: 'CI001', categoria: 'Cirugía', nombre: 'Esterilización hembra canina', especie: 'Perra', duracion: '90 min', precio: 80000, detalle: 'Incluye anestesia y hospitalización 24 h.' },
  { codigo: 'CI002', categoria: 'Cirugía', nombre: 'Esterilización macho canino', especie: 'Perro', duracion: '60 min', precio: 60000, detalle: 'Control reproductivo con anestesia incluida.' },
  { codigo: 'CI003', categoria: 'Cirugía', nombre: 'Esterilización hembra felina', especie: 'Gata', duracion: '60 min', precio: 65000, detalle: 'Incluye anestesia y hospitalización 12 h.' },
  { codigo: 'CI004', categoria: 'Cirugía', nombre: 'Esterilización macho felino', especie: 'Gato', duracion: '45 min', precio: 50000, detalle: 'Control reproductivo felino.' },
  { codigo: 'CI005', categoria: 'Cirugía', nombre: 'Extirpación de tumor cutáneo', especie: 'Perro / Gato', duracion: '60 min', precio: 120000, detalle: 'Precio referencial; varía según tamaño.' },
  { codigo: 'CI006', categoria: 'Cirugía', nombre: 'Cesárea de urgencia', especie: 'Perra / Gata', duracion: '120 min', precio: 180000, detalle: 'Intervención quirúrgica de emergencia.' },
  { codigo: 'DE001', categoria: 'Desparasitación', nombre: 'Desparasitación interna pequeños (<10 kg)', especie: 'Perro', duracion: '5 min', precio: 8000, detalle: 'Tratamiento contra parásitos internos.' },
  { codigo: 'DE002', categoria: 'Desparasitación', nombre: 'Desparasitación interna medianos (10-25 kg)', especie: 'Perro', duracion: '5 min', precio: 9500, detalle: 'Tratamiento en comprimido.' },
  { codigo: 'DE003', categoria: 'Desparasitación', nombre: 'Desparasitación interna grandes (>25 kg)', especie: 'Perro', duracion: '5 min', precio: 11000, detalle: 'Tratamiento antiparasitario especializado.' },
  { codigo: 'DE004', categoria: 'Desparasitación', nombre: 'Desparasitación interna felina', especie: 'Gato', duracion: '5 min', precio: 8000, detalle: 'Control de parásitos para gatos.' },
  { codigo: 'DE005', categoria: 'Desparasitación', nombre: 'Antiparasitario externo (pipeta)', especie: 'Perro / Gato', duracion: '5 min', precio: 7500, detalle: 'Aplicación contra pulgas y garrapatas.' },
  { codigo: 'EX001', categoria: 'Exámenes', nombre: 'Hemograma completo', especie: 'Perro / Gato', duracion: '30 min', precio: 22000, detalle: 'Resultado estimado en 24-48 h.' },
  { codigo: 'EX002', categoria: 'Exámenes', nombre: 'Perfil bioquímico completo', especie: 'Perro / Gato', duracion: '30 min', precio: 35000, detalle: 'Análisis de función orgánica.' },
  { codigo: 'EX003', categoria: 'Exámenes', nombre: 'Radiografía (1 proyección)', especie: 'Perro / Gato', duracion: '20 min', precio: 28000, detalle: 'Estudio imagenológico.' },
  { codigo: 'EX004', categoria: 'Exámenes', nombre: 'Ecografía abdominal', especie: 'Perro / Gato', duracion: '30 min', precio: 45000, detalle: 'Evaluación de órganos internos.' },
  { codigo: 'OT001', categoria: 'Otros', nombre: 'Corte de uñas', especie: 'Perro / Gato', duracion: '15 min', precio: 5000, detalle: 'Higiene y mantención estética.' },
  { codigo: 'OT002', categoria: 'Otros', nombre: 'Limpieza dental', especie: 'Perro / Gato', duracion: '45 min', precio: 55000, detalle: 'Limpieza dental con ultrasonido; requiere anestesia.' },
  { codigo: 'OT003', categoria: 'Otros', nombre: 'Microchip identificación', especie: 'Perro / Gato', duracion: '10 min', precio: 15000, detalle: 'Incluye registro de identificación.' },
  { codigo: 'OT004', categoria: 'Otros', nombre: 'Hospitalización (por día)', especie: 'Perro / Gato', duracion: '24 h', precio: 30000, detalle: 'Incluye monitoreo y alimentación básica.' },
].map((servicio) => ({
  ...servicio,
  imagen: obtenerImagenServicio(servicio.categoria),
}));

export interface DatosCatalogo {
  productos: Producto[];
  servicios: Servicio[];
}

function esServicio(value: unknown): value is Servicio {
  if (typeof value !== 'object' || value === null) return false;
  const servicio = value as Record<string, unknown>;
  return typeof servicio.codigo === 'string'
    && typeof servicio.categoria === 'string'
    && typeof servicio.nombre === 'string'
    && typeof servicio.especie === 'string'
    && typeof servicio.duracion === 'string'
    && typeof servicio.precio === 'number'
    && typeof servicio.detalle === 'string'
    && (servicio.imagen === undefined || typeof servicio.imagen === 'string');
}

function leerServiciosLocal(): Servicio[] {
  if (window.localStorage.getItem(CLAVE_SERVICIOS) === null) {
    window.localStorage.setItem(CLAVE_SERVICIOS, JSON.stringify(serviciosIniciales));
  }
  const contenidoBruto = window.localStorage.getItem(CLAVE_SERVICIOS)!;
  const analizado: unknown = JSON.parse(contenidoBruto);
  if (!Array.isArray(analizado) || !analizado.every(esServicio)) {
    throw new Error('Los datos guardados para servicios tienen un formato inválido.');
  }
  return analizado.map((servicio) => ({
    ...servicio,
    imagen: servicio.imagen || obtenerImagenServicio(servicio.categoria),
  }));
}

function guardarServiciosLocal(coleccion: Servicio[]): void {
  window.localStorage.setItem(CLAVE_SERVICIOS, JSON.stringify(coleccion));
}

function crearCodigo(prefix: string, existingCodes: string[]): string {
  const highestNumber = existingCodes.reduce((highest, code) => {
    const match = new RegExp(`^${prefix}(\\d+)$`).exec(code);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `${prefix}${String(highestNumber + 1).padStart(3, '0')}`;
}

async function obtenerProductosApi(): Promise<Producto[]> {
  const respuesta = await fetch(API_PRODUCTOS);
  if (!respuesta.ok) {
    throw new Error(`Error al conectar con ms-productos (${respuesta.status})`);
  }
  return respuesta.json();
}

export async function cargarCatalogo(): Promise<DatosCatalogo> {
  const productos = await obtenerProductosApi();
  const servicios = leerServiciosLocal();
  return { productos, servicios };
}

export async function agregarProducto(producto: Omit<Producto, 'codigo'>): Promise<DatosCatalogo> {
  const actuales = await obtenerProductosApi();
  const nuevoProducto: Producto = {
    ...producto,
    codigo: crearCodigo('PR', actuales.map((articulo) => articulo.codigo)),
  };

  const respuesta = await fetch(API_PRODUCTOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoProducto),
  });

  if (!respuesta.ok) {
    const detalleError = await respuesta.text();
    throw new Error(detalleError || 'No se pudo crear el producto en el microservicio.');
  }

  return cargarCatalogo();
}

export async function actualizarProducto(
  codigo: string,
  cambios: Partial<Omit<Producto, 'codigo'>>,
): Promise<DatosCatalogo> {
  const actuales = await obtenerProductosApi();
  const existente = actuales.find((p) => p.codigo === codigo);
  if (!existente) {
    throw new Error(`No se encontró el producto ${codigo}.`);
  }

  const productoActualizado: Producto = { ...existente, ...cambios, codigo };

  const respuesta = await fetch(`${API_PRODUCTOS}/${encodeURIComponent(codigo)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productoActualizado),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo actualizar el producto ${codigo}.`);
  }

  return cargarCatalogo();
}

export async function eliminarProducto(codigo: string): Promise<DatosCatalogo> {
  const respuesta = await fetch(`${API_PRODUCTOS}/${encodeURIComponent(codigo)}`, {
    method: 'DELETE',
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo eliminar el producto ${codigo}.`);
  }

  return cargarCatalogo();
}

export async function agregarServicio(servicio: Omit<Servicio, 'codigo'>): Promise<DatosCatalogo> {
  const actual = await cargarCatalogo();
  const nuevoServicio: Servicio = {
    ...servicio,
    imagen: servicio.imagen || obtenerImagenServicio(servicio.categoria),
    codigo: crearCodigo('SV', actual.servicios.map((articulo) => articulo.codigo)),
  };
  const servicios = [...actual.servicios, nuevoServicio];
  guardarServiciosLocal(servicios);
  return { ...actual, servicios };
}

export async function actualizarServicio(
  codigo: string,
  cambios: Partial<Omit<Servicio, 'codigo'>>,
): Promise<DatosCatalogo> {
  const actual = await cargarCatalogo();
  const indice = actual.servicios.findIndex((servicio) => servicio.codigo === codigo);
  if (indice === -1) {
    throw new Error(`No se encontró el servicio ${codigo}.`);
  }

  const servicios = [...actual.servicios];
  const servicioActualizado = { ...servicios[indice], ...cambios, codigo };
  const categoriaCambio = cambios.categoria !== undefined
    && cambios.categoria !== servicios[indice].categoria;
  servicios[indice] = {
    ...servicioActualizado,
    imagen: cambios.imagen
      || (categoriaCambio ? obtenerImagenServicio(servicioActualizado.categoria) : servicioActualizado.imagen)
      || obtenerImagenServicio(servicioActualizado.categoria),
  };
  guardarServiciosLocal(servicios);
  return { ...actual, servicios };
}

export async function eliminarServicio(codigo: string): Promise<DatosCatalogo> {
  const actual = await cargarCatalogo();
  const servicios = actual.servicios.filter((articulo) => articulo.codigo !== codigo);
  if (servicios.length === actual.servicios.length) {
    throw new Error(`No se encontró el servicio ${codigo}.`);
  }
  guardarServiciosLocal(servicios);
  return { ...actual, servicios };
}
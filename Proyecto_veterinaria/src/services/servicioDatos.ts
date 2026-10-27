import type { Producto, Servicio } from '../types';

const CLAVE_PRODUCTOS = 'veterinaria.productos';
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

const productosIniciales: Producto[] = [
  { codigo: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg', principio: 'Amoxicilina', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 45, precio: 4200, imagen: '/imagenes/amoxibay.webp', detalle: 'Presentación: blíster de 10 comprimidos.' },
  { codigo: 'ME002', categoria: 'Antibióticos', nombre: 'Enrox 50mg', principio: 'Enrofloxacino', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 30, precio: 6800, imagen: '/imagenes/en.jpg', detalle: 'Presentación: blíster de 10 comprimidos.' },
  { codigo: 'ME004', categoria: 'Antiparasitarios', nombre: 'Nexgard', principio: 'Afoxolaner', presentacion: 'Masticable 1 unid.', especie: 'Perro', stock: 60, precio: 9500, imagen: '/imagenes/nex.webp', detalle: 'Presentación: comprimido masticable unitario.' },
  { codigo: 'ME005', categoria: 'Antiparasitarios', nombre: 'Bravecto', principio: 'Fluralaner', presentacion: 'Masticable 1 unid.', especie: 'Perro', stock: 40, precio: 18900, imagen: '/imagenes/bra.jpg', detalle: 'Presentación: comprimido masticable unitario.' },
  { codigo: 'ME006', categoria: 'Antiparasitarios', nombre: 'Revolution Plus', principio: 'Selamectina + Sarolaner', presentacion: 'Pipeta 1 unid.', especie: 'Gato', stock: 35, precio: 14500, imagen: '/imagenes/rev.jpg', detalle: 'Presentación: pipeta unitaria.' },
  { codigo: 'ME009', categoria: 'Antiinflamatorios', nombre: 'Meloxicam 1mg', principio: 'Meloxicam', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 55, precio: 4500, imagen: '/imagenes/melo.jpg', detalle: 'Presentación: blíster de 10 comprimidos.' },
  { codigo: 'ME013', categoria: 'Dermatología', nombre: 'Apoquel 16mg', principio: 'Oclacitinib', presentacion: 'Blíster 10 comp.', especie: 'Perro', stock: 18, precio: 22000, imagen: '/imagenes/apoquel.webp', detalle: 'Presentación: blíster de 10 comprimidos.' },
  { codigo: 'ME018', categoria: 'Vacunas', nombre: 'Nobivac DHPPi', principio: 'Vacuna polivalente', presentacion: 'Vial 1 dosis', especie: 'Perro', stock: 48, precio: 8500, imagen: '/imagenes/dhpp.jpeg', detalle: 'Presentación: vial de una dosis.' },
  { codigo: 'ME022', categoria: 'Suplementos', nombre: 'Condrovet forte', principio: 'Condroitín + Glucosamina', presentacion: 'Blíster 30 comp.', especie: 'Perro', stock: 25, precio: 14500, imagen: '/imagenes/condro.png', detalle: 'Presentación: blíster de 30 comprimidos.' },
];

export interface DatosCatalogo {
  productos: Producto[];
  servicios: Servicio[];
}

function esProducto(value: unknown): value is Producto {
  if (typeof value !== 'object' || value === null) return false;
  const producto = value as Record<string, unknown>;
  return typeof producto.codigo === 'string'
    && typeof producto.categoria === 'string'
    && typeof producto.nombre === 'string'
    && typeof producto.stock === 'number'
    && typeof producto.precio === 'number'
    && typeof producto.imagen === 'string';
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

function leerColeccion<T>(
  key: string,
  validator: (articulo: unknown) => articulo is T,
): T[] {
  const contenidoBruto = window.localStorage.getItem(key);
  if (contenidoBruto === null) {
    throw new Error(`No se encontraron datos inicializados para ${key}.`);
  }

  let analizado: unknown;
  try {
    analizado = JSON.parse(contenidoBruto);
  } catch {
    throw new Error(`Los datos guardados para ${key} están dañados.`);
  }

  if (!Array.isArray(analizado) || !analizado.every(validator)) {
    throw new Error(`Los datos guardados para ${key} tienen un formato inválido.`);
  }

  return analizado;
}

function guardarColeccion<T>(key: string, coleccion: T[]): void {
  window.localStorage.setItem(key, JSON.stringify(coleccion));
}

function crearCodigo(prefix: string, existingCodes: string[]): string {
  const highestNumber = existingCodes.reduce((highest, code) => {
    const match = new RegExp(`^${prefix}(\\d+)$`).exec(code);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `${prefix}${String(highestNumber + 1).padStart(3, '0')}`;
}

export function cargarCatalogo(): DatosCatalogo {
  if (window.localStorage.getItem(CLAVE_PRODUCTOS) === null) {
    guardarColeccion(CLAVE_PRODUCTOS, productosIniciales);
  }
  if (window.localStorage.getItem(CLAVE_SERVICIOS) === null) {
    guardarColeccion(CLAVE_SERVICIOS, serviciosIniciales);
  }

  const storedServices = leerColeccion(CLAVE_SERVICIOS, esServicio);
  const servicios = storedServices.map((servicio) => ({
    ...servicio,
    imagen: servicio.imagen || obtenerImagenServicio(servicio.categoria),
  }));
  if (servicios.some((servicio, index) => servicio.imagen !== storedServices[index].imagen)) {
    guardarColeccion(CLAVE_SERVICIOS, servicios);
  }

  return {
    productos: leerColeccion(CLAVE_PRODUCTOS, esProducto),
    servicios,
  };
}

export function agregarProducto(producto: Omit<Producto, 'codigo'>): DatosCatalogo {
  const actual = cargarCatalogo();
  const nuevoProducto = { ...producto, codigo: crearCodigo('PR', actual.productos.map((articulo) => articulo.codigo)) };
  const productos = [...actual.productos, nuevoProducto];
  guardarColeccion(CLAVE_PRODUCTOS, productos);
  return { ...actual, productos };
}

export function agregarServicio(servicio: Omit<Servicio, 'codigo'>): DatosCatalogo {
  const actual = cargarCatalogo();
  const nuevoServicio = {
    ...servicio,
    imagen: servicio.imagen || obtenerImagenServicio(servicio.categoria),
    codigo: crearCodigo('SV', actual.servicios.map((articulo) => articulo.codigo)),
  };
  const servicios = [...actual.servicios, nuevoServicio];
  guardarColeccion(CLAVE_SERVICIOS, servicios);
  return { ...actual, servicios };
}

export function actualizarProducto(
  codigo: string,
  cambios: Partial<Omit<Producto, 'codigo'>>,
): DatosCatalogo {
  const actual = cargarCatalogo();
  const indice = actual.productos.findIndex((producto) => producto.codigo === codigo);
  if (indice === -1) {
    throw new Error(`No se encontró el producto ${codigo}.`);
  }

  const productos = [...actual.productos];
  productos[indice] = { ...productos[indice], ...cambios, codigo };
  guardarColeccion(CLAVE_PRODUCTOS, productos);
  return { ...actual, productos };
}

export function actualizarServicio(
  codigo: string,
  cambios: Partial<Omit<Servicio, 'codigo'>>,
): DatosCatalogo {
  const actual = cargarCatalogo();
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
  guardarColeccion(CLAVE_SERVICIOS, servicios);
  return { ...actual, servicios };
}

export function eliminarProducto(codigo: string): DatosCatalogo {
  const actual = cargarCatalogo();
  const productos = actual.productos.filter((articulo) => articulo.codigo !== codigo);
  if (productos.length === actual.productos.length) {
    throw new Error(`No se encontró el producto ${codigo}.`);
  }
  guardarColeccion(CLAVE_PRODUCTOS, productos);
  return { ...actual, productos };
}

export function eliminarServicio(codigo: string): DatosCatalogo {
  const actual = cargarCatalogo();
  const servicios = actual.servicios.filter((articulo) => articulo.codigo !== codigo);
  if (servicios.length === actual.servicios.length) {
    throw new Error(`No se encontró el servicio ${codigo}.`);
  }
  guardarColeccion(CLAVE_SERVICIOS, servicios);
  return { ...actual, servicios };
}

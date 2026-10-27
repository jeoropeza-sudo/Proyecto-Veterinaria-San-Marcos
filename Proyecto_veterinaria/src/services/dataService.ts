import type { Producto, Servicio } from '../types';

const PRODUCTS_KEY = 'veterinaria.productos';
const SERVICES_KEY = 'veterinaria.servicios';

const initialServices: Servicio[] = [
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
];

const initialProducts: Producto[] = [
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

export interface CatalogData {
  productos: Producto[];
  servicios: Servicio[];
}

function isProducto(value: unknown): value is Producto {
  if (typeof value !== 'object' || value === null) return false;
  const product = value as Record<string, unknown>;
  return typeof product.codigo === 'string'
    && typeof product.categoria === 'string'
    && typeof product.nombre === 'string'
    && typeof product.stock === 'number'
    && typeof product.precio === 'number'
    && typeof product.imagen === 'string';
}

function isServicio(value: unknown): value is Servicio {
  if (typeof value !== 'object' || value === null) return false;
  const service = value as Record<string, unknown>;
  return typeof service.codigo === 'string'
    && typeof service.categoria === 'string'
    && typeof service.nombre === 'string'
    && typeof service.especie === 'string'
    && typeof service.duracion === 'string'
    && typeof service.precio === 'number'
    && typeof service.detalle === 'string';
}

function readCollection<T>(
  key: string,
  validator: (item: unknown) => item is T,
): T[] {
  const raw = window.localStorage.getItem(key);
  if (raw === null) {
    throw new Error(`No se encontraron datos inicializados para ${key}.`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Los datos guardados para ${key} están dañados.`);
  }

  if (!Array.isArray(parsed) || !parsed.every(validator)) {
    throw new Error(`Los datos guardados para ${key} tienen un formato inválido.`);
  }

  return parsed;
}

function writeCollection<T>(key: string, collection: T[]): void {
  window.localStorage.setItem(key, JSON.stringify(collection));
}

function createCode(prefix: string, existingCodes: string[]): string {
  const highestNumber = existingCodes.reduce((highest, code) => {
    const match = new RegExp(`^${prefix}(\\d+)$`).exec(code);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `${prefix}${String(highestNumber + 1).padStart(3, '0')}`;
}

export function loadCatalog(): CatalogData {
  if (window.localStorage.getItem(PRODUCTS_KEY) === null) {
    writeCollection(PRODUCTS_KEY, initialProducts);
  }
  if (window.localStorage.getItem(SERVICES_KEY) === null) {
    writeCollection(SERVICES_KEY, initialServices);
  }

  return {
    productos: readCollection(PRODUCTS_KEY, isProducto),
    servicios: readCollection(SERVICES_KEY, isServicio),
  };
}

export function addProducto(product: Omit<Producto, 'codigo'>): CatalogData {
  const current = loadCatalog();
  const created = { ...product, codigo: createCode('PR', current.productos.map((item) => item.codigo)) };
  const productos = [...current.productos, created];
  writeCollection(PRODUCTS_KEY, productos);
  return { ...current, productos };
}

export function addServicio(service: Omit<Servicio, 'codigo'>): CatalogData {
  const current = loadCatalog();
  const created = { ...service, codigo: createCode('SV', current.servicios.map((item) => item.codigo)) };
  const servicios = [...current.servicios, created];
  writeCollection(SERVICES_KEY, servicios);
  return { ...current, servicios };
}

export function deleteProducto(codigo: string): CatalogData {
  const current = loadCatalog();
  const productos = current.productos.filter((item) => item.codigo !== codigo);
  if (productos.length === current.productos.length) {
    throw new Error(`No se encontró el producto ${codigo}.`);
  }
  writeCollection(PRODUCTS_KEY, productos);
  return { ...current, productos };
}

export function deleteServicio(codigo: string): CatalogData {
  const current = loadCatalog();
  const servicios = current.servicios.filter((item) => item.codigo !== codigo);
  if (servicios.length === current.servicios.length) {
    throw new Error(`No se encontró el servicio ${codigo}.`);
  }
  writeCollection(SERVICES_KEY, servicios);
  return { ...current, servicios };
}

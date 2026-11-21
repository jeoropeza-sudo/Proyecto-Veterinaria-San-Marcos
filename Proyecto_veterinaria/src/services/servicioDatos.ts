import type { Producto, Servicio } from '../types';

const API_PRODUCTOS = 'http://localhost:8081/api/productos';
const API_SERVICIOS = 'http://localhost:8082/api/servicios';

function obtenerImagenServicio(categoria: string): string {
  if (categoria === 'Vacunación') return '/imagenes/vacunas.webp';
  if (categoria === 'Cirugía' || categoria === 'Exámenes') return '/imagenes/veterinaria.webp';
  if (categoria === 'Desparasitación') return '/imagenes/Antiparasitario.jpeg';
  return '/imagenes/consulta.webp';
}

export interface DatosCatalogo {
  productos: Producto[];
  servicios: Servicio[];
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

async function obtenerServiciosApi(): Promise<Servicio[]> {
  const respuesta = await fetch(API_SERVICIOS);
  if (!respuesta.ok) {
    throw new Error(`Error al conectar con ms-servicios (${respuesta.status})`);
  }
  const lista: Servicio[] = await respuesta.json();
  return lista.map((servicio) => ({
    ...servicio,
    imagen: servicio.imagen || obtenerImagenServicio(servicio.categoria),
  }));
}

export async function cargarCatalogo(): Promise<DatosCatalogo> {
  const [productos, servicios] = await Promise.all([
    obtenerProductosApi(),
    obtenerServiciosApi(),
  ]);
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
  const actuales = await obtenerServiciosApi();
  const nuevoServicio: Servicio = {
    ...servicio,
    imagen: servicio.imagen || obtenerImagenServicio(servicio.categoria),
    codigo: crearCodigo('SV', actuales.map((articulo) => articulo.codigo)),
  };

  const respuesta = await fetch(API_SERVICIOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoServicio),
  });

  if (!respuesta.ok) {
    const detalleError = await respuesta.text();
    throw new Error(detalleError || 'No se pudo crear el servicio en el microservicio.');
  }

  return cargarCatalogo();
}

export async function actualizarServicio(
  codigo: string,
  cambios: Partial<Omit<Servicio, 'codigo'>>,
): Promise<DatosCatalogo> {
  const actuales = await obtenerServiciosApi();
  const existente = actuales.find((servicio) => servicio.codigo === codigo);
  if (!existente) {
    throw new Error(`No se encontró el servicio ${codigo}.`);
  }

  const servicioActualizado = { ...existente, ...cambios, codigo };
  const categoriaCambio = cambios.categoria !== undefined
    && cambios.categoria !== existente.categoria;

  const payload: Servicio = {
    ...servicioActualizado,
    imagen: cambios.imagen
      || (categoriaCambio ? obtenerImagenServicio(servicioActualizado.categoria) : servicioActualizado.imagen)
      || obtenerImagenServicio(servicioActualizado.categoria),
  };

  const respuesta = await fetch(`${API_SERVICIOS}/${encodeURIComponent(codigo)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo actualizar el servicio ${codigo}.`);
  }

  return cargarCatalogo();
}

export async function eliminarServicio(codigo: string): Promise<DatosCatalogo> {
  const respuesta = await fetch(`${API_SERVICIOS}/${encodeURIComponent(codigo)}`, {
    method: 'DELETE',
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo eliminar el servicio ${codigo}.`);
  }

  return cargarCatalogo();
}
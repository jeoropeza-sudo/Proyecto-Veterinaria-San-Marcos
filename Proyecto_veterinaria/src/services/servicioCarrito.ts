import type { ItemCarrito, Producto, Servicio } from '../types';

const CLAVE_ALMACENAMIENTO_CARRITO = 'veterinaria.carrito';

function esArticuloCarrito(value: unknown): value is ItemCarrito {
  if (typeof value !== 'object' || value === null) return false;
  const entrada = value as Record<string, unknown>;
  if ((entrada.tipo !== 'producto' && entrada.tipo !== 'servicio') || typeof entrada.cantidad !== 'number' || entrada.cantidad < 1) {
    return false;
  }

  const articulo = entrada.producto;
  if (typeof articulo !== 'object' || articulo === null) return false;
  const elementoCatalogo = articulo as Record<string, unknown>;
  const camposComunesValidos = typeof elementoCatalogo.codigo === 'string'
    && typeof elementoCatalogo.nombre === 'string'
    && typeof elementoCatalogo.categoria === 'string'
    && typeof elementoCatalogo.precio === 'number';
  return camposComunesValidos && (entrada.tipo === 'producto'
    ? typeof elementoCatalogo.stock === 'number' && typeof elementoCatalogo.imagen === 'string'
    : typeof elementoCatalogo.duracion === 'string'
      && typeof elementoCatalogo.especie === 'string'
      && typeof elementoCatalogo.detalle === 'string');
}

export function cargarCarrito(): ItemCarrito[] {
  const carritoGuardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO_CARRITO);
  if (carritoGuardado === null) return [];

  let carritoAnalizado: unknown;
  try {
    carritoAnalizado = JSON.parse(carritoGuardado);
  } catch {
    throw new Error('El carrito guardado está dañado. Limpia los datos del sitio e inténtalo nuevamente.');
  }

  if (!Array.isArray(carritoAnalizado) || !carritoAnalizado.every(esArticuloCarrito)) {
    throw new Error('El carrito guardado tiene un formato inválido. Limpia los datos del sitio e inténtalo nuevamente.');
  }
  return carritoAnalizado;
}

function guardarCarrito(articulos: ItemCarrito[]): ItemCarrito[] {
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO_CARRITO, JSON.stringify(articulos));
  return articulos;
}

function agregarProductoAlCarritoInterno(articulos: ItemCarrito[], producto: Producto): ItemCarrito[] {
  const existente = articulos.find((entrada) => entrada.tipo === 'producto' && entrada.producto.codigo === producto.codigo);
  const cantidad = (existente?.cantidad ?? 0) + 1;
  if (cantidad > producto.stock) {
    throw new Error(`No hay más unidades disponibles de ${producto.nombre}.`);
  }
  if (existente) {
    return articulos.map((entrada) =>
      entrada.tipo === 'producto' && entrada.producto.codigo === producto.codigo
        ? { ...entrada, cantidad: cantidad }
        : entrada,
    );
  }
  return [...articulos, { tipo: 'producto', producto: producto, cantidad: 1 }];
}

function agregarServicioAlCarritoInterno(articulos: ItemCarrito[], servicio: Servicio): ItemCarrito[] {
  const existente = articulos.find((entrada) => entrada.tipo === 'servicio' && entrada.producto.codigo === servicio.codigo);
  if (existente) {
    return articulos.map((entrada) =>
      entrada.tipo === 'servicio' && entrada.producto.codigo === servicio.codigo
        ? { ...entrada, cantidad: entrada.cantidad + 1 }
        : entrada,
    );
  }
  return [...articulos, { tipo: 'servicio', producto: servicio, cantidad: 1 }];
}

export function agregarProductoAlCarrito(articulos: ItemCarrito[], producto: Producto): ItemCarrito[] {
  if (producto.stock < 1) {
    throw new Error(`${producto.nombre} no tiene unidades disponibles.`);
  }
  return guardarCarrito(agregarProductoAlCarritoInterno(articulos, producto));
}

export function solicitarReservaServicio(articulos: ItemCarrito[], servicio: Servicio): ItemCarrito[] {
  return guardarCarrito(agregarServicioAlCarritoInterno(articulos, servicio));
}

export function establecerCantidadArticulo(
  articulos: ItemCarrito[],
  tipo: ItemCarrito['tipo'],
  codigo: string,
  cantidad: number,
): ItemCarrito[] {
  const entrada = articulos.find((articulo) => articulo.tipo === tipo && articulo.producto.codigo === codigo);
  if (!entrada) throw new Error(`No se encontró ${tipo} ${codigo} en el carrito.`);
  if (!Number.isInteger(cantidad) || cantidad < 1) throw new Error('La cantidad debe ser un entero positivo.');
  if (entrada.tipo === 'producto' && cantidad > entrada.producto.stock) {
    throw new Error(`La cantidad supera el stock disponible de ${entrada.producto.nombre}.`);
  }

  return guardarCarrito(articulos.map((articulo) => {
    if (articulo.tipo !== tipo || articulo.producto.codigo !== codigo) return articulo;
    return articulo.tipo === 'producto'
      ? { ...articulo, cantidad }
      : { ...articulo, cantidad };
  }));
}

export function quitarArticuloCarrito(articulos: ItemCarrito[], tipo: ItemCarrito['tipo'], codigo: string): ItemCarrito[] {
  return guardarCarrito(articulos.filter((articulo) => !(articulo.tipo === tipo && articulo.producto.codigo === codigo)));
}

export function vaciarCarrito(): ItemCarrito[] {
  return guardarCarrito([]);
}

import type { ItemCarrito, Producto, Servicio } from '../types';

const CLAVE_ALMACENAMIENTO_CARRITO = 'veterinaria.carrito';

function guardarLocal(articulos: ItemCarrito[]): ItemCarrito[] {
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO_CARRITO, JSON.stringify(articulos));
  return articulos;
}

export function cargarCarrito(): ItemCarrito[] {
  const carritoGuardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO_CARRITO);
  if (carritoGuardado === null) return [];
  try {
    const parsed = JSON.parse(carritoGuardado);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function agregarProductoAlCarrito(articulos: ItemCarrito[], producto: Producto): ItemCarrito[] {
  if (producto.stock < 1) {
    throw new Error(`${producto.nombre} no tiene unidades disponibles.`);
  }
  const existente = articulos.find((entrada) => entrada.tipo === 'producto' && entrada.producto.codigo === producto.codigo);
  const cantidad = (existente?.cantidad ?? 0) + 1;
  if (cantidad > producto.stock) {
    throw new Error(`No hay más unidades disponibles de ${producto.nombre}.`);
  }

  const nuevosArticulos = existente
    ? articulos.map((entrada) =>
        entrada.tipo === 'producto' && entrada.producto.codigo === producto.codigo
          ? { ...entrada, cantidad }
          : entrada,
      )
    : [...articulos, { tipo: 'producto' as const, producto, cantidad: 1 }];

  return guardarLocal(nuevosArticulos);
}

export function solicitarReservaServicio(articulos: ItemCarrito[], servicio: Servicio): ItemCarrito[] {
  const existente = articulos.find((entrada) => entrada.tipo === 'servicio' && entrada.producto.codigo === servicio.codigo);
  if (existente) return articulos;

  const nuevosArticulos = [...articulos, { tipo: 'servicio' as const, producto: servicio, cantidad: 1 }];
  return guardarLocal(nuevosArticulos);
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

  const nuevosArticulos = articulos.map((articulo) =>
    articulo.tipo === tipo && articulo.producto.codigo === codigo
      ? { ...articulo, cantidad }
      : articulo,
  );

  return guardarLocal(nuevosArticulos);
}

export function quitarArticuloCarrito(articulos: ItemCarrito[], tipo: ItemCarrito['tipo'], codigo: string): ItemCarrito[] {
  const nuevosArticulos = articulos.filter((articulo) => !(articulo.tipo === tipo && articulo.producto.codigo === codigo));
  return guardarLocal(nuevosArticulos);
}

export function quitarArticulosCarrito(
  articulos: ItemCarrito[],
  tipo: ItemCarrito['tipo'],
  codigos: string[],
): ItemCarrito[] {
  const codigosQuitados = new Set(codigos);
  return guardarLocal(
    articulos.filter((articulo) => !(articulo.tipo === tipo && codigosQuitados.has(articulo.producto.codigo))),
  );
}

export function vaciarCarrito(): ItemCarrito[] {
  return guardarLocal([]);
}
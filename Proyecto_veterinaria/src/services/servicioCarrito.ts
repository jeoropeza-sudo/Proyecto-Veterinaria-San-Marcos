import type { ItemCarrito, Producto, Servicio } from '../types';

const API_URL = 'http://localhost:8085/api/v1/carrito';
const CLAVE_ALMACENAMIENTO_CARRITO = 'veterinaria.carrito';

// Obtiene el ID del usuario activo (por defecto 1 si aún no inicia sesión)
function obtenerUsuarioId(): number {
  const sesion = window.localStorage.getItem('veterinaria.sesion');
  if (sesion) {
    try {
      const parsed = JSON.parse(sesion);
      if (typeof parsed.id === 'number') return parsed.id;
    } catch {
      // ignorar si no es JSON válido
    }
  }
  return 1;
}

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

// Trae el carrito desde el microservicio Spring Boot y sincroniza el estado local
export async function cargarCarritoDesdeApi(): Promise<ItemCarrito[]> {
  const usuarioId = obtenerUsuarioId();
  const response = await fetch(`${API_URL}/${usuarioId}`);
  if (!response.ok) {
    throw new Error('No se pudo conectar con el microservicio de carrito.');
  }
  const data = await response.json();
  const itemsBackend = Array.isArray(data.items) ? data.items : [];

  const articulosMapeados: ItemCarrito[] = itemsBackend.map((item: {
    tipo: 'producto' | 'servicio';
    codigo: string;
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
    detalleJson?: string;
  }) => {
    const objetoOriginal = item.detalleJson
      ? JSON.parse(item.detalleJson)
      : {
          codigo: item.codigo,
          nombre: item.nombreProducto,
          precio: item.precioUnitario,
          categoria: 'General',
          stock: 99,
          imagen: '',
        };

    return {
      tipo: item.tipo,
      producto: objetoOriginal,
      cantidad: item.cantidad,
    } as ItemCarrito;
  });

  return guardarLocal(articulosMapeados);
}

// Sincronización en segundo plano hacia Spring Boot
async function sincronizarAgregarApi(tipo: 'producto' | 'servicio', item: Producto | Servicio) {
  const usuarioId = obtenerUsuarioId();
  await fetch(`${API_URL}/${usuarioId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo,
      codigo: item.codigo,
      nombreProducto: item.nombre,
      precioUnitario: item.precio,
      cantidad: 1,
      detalleJson: JSON.stringify(item),
    }),
  });
}

async function sincronizarCantidadApi(tipo: 'producto' | 'servicio', codigo: string, cantidad: number) {
  const usuarioId = obtenerUsuarioId();
  await fetch(`${API_URL}/${usuarioId}/items/${tipo}/${codigo}?cantidad=${cantidad}`, {
    method: 'PUT',
  });
}

async function sincronizarEliminarApi(tipo: 'producto' | 'servicio', codigo: string) {
  const usuarioId = obtenerUsuarioId();
  await fetch(`${API_URL}/${usuarioId}/items/${tipo}/${codigo}`, {
    method: 'DELETE',
  });
}

async function sincronizarVaciarApi() {
  const usuarioId = obtenerUsuarioId();
  await fetch(`${API_URL}/${usuarioId}`, {
    method: 'DELETE',
  });
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

  void sincronizarAgregarApi('producto', producto);
  return guardarLocal(nuevosArticulos);
}

export function solicitarReservaServicio(articulos: ItemCarrito[], servicio: Servicio): ItemCarrito[] {
  const existente = articulos.find((entrada) => entrada.tipo === 'servicio' && entrada.producto.codigo === servicio.codigo);
  const nuevosArticulos = existente
    ? articulos.map((entrada) =>
        entrada.tipo === 'servicio' && entrada.producto.codigo === servicio.codigo
          ? { ...entrada, cantidad: entrada.cantidad + 1 }
          : entrada,
      )
    : [...articulos, { tipo: 'servicio' as const, producto: servicio, cantidad: 1 }];

  void sincronizarAgregarApi('servicio', servicio);
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

  void sincronizarCantidadApi(tipo, codigo, cantidad);
  return guardarLocal(nuevosArticulos);
}

export function quitarArticuloCarrito(articulos: ItemCarrito[], tipo: ItemCarrito['tipo'], codigo: string): ItemCarrito[] {
  const nuevosArticulos = articulos.filter((articulo) => !(articulo.tipo === tipo && articulo.producto.codigo === codigo));
  void sincronizarEliminarApi(tipo, codigo);
  return guardarLocal(nuevosArticulos);
}

export function vaciarCarrito(): ItemCarrito[] {
  void sincronizarVaciarApi();
  return guardarLocal([]);
}
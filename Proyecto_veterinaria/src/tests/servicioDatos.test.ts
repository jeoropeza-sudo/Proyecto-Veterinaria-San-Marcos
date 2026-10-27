// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  agregarProducto,
  agregarServicio,
  eliminarProducto,
  eliminarServicio,
  cargarCatalogo,
} from '../services/servicioDatos';

describe('Servicio de datos del catálogo', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('siembra el catálogo inicial de servicios y productos en localStorage', () => {
    const catalogo = cargarCatalogo();

    expect(catalogo.productos).toHaveLength(9);
    expect(catalogo.servicios.length).toBeGreaterThan(20);
    expect(catalogo.servicios.every((servicio) => servicio.imagen)).toBe(true);
    expect(window.localStorage.getItem('veterinaria.productos')).not.toBeNull();
    expect(window.localStorage.getItem('veterinaria.servicios')).not.toBeNull();
  });

  it('crea y elimina registros conservando el catálogo', () => {
    const productoCreado = agregarProducto({
      categoria: 'Accesorios',
      nombre: 'Producto de prueba',
      stock: 3,
      precio: 1200,
      imagen: '/imagenes/condro.png',
      detalle: 'Registro de prueba',
    });
    const servicioCreado = agregarServicio({
      categoria: 'Otros',
      nombre: 'Servicio de prueba',
      especie: 'Perro',
      duracion: '15 min',
      precio: 7000,
      detalle: 'Registro de prueba',
    });

    expect(productoCreado.productos.at(-1)?.codigo).toBe('PR001');
    expect(servicioCreado.servicios.at(-1)?.codigo).toBe('SV006');
    expect(servicioCreado.servicios.at(-1)?.imagen).toBe('/imagenes/consulta.webp');
    expect(eliminarProducto('PR001').productos.some((articulo) => articulo.codigo === 'PR001')).toBe(false);
    expect(eliminarServicio('SV006').servicios.some((articulo) => articulo.codigo === 'SV006')).toBe(false);
  });

  it('reporta un error si el almacenamiento contiene una colección inválida', () => {
    window.localStorage.setItem('veterinaria.productos', '{invalido');

    expect(() => cargarCatalogo()).toThrow(/están dañados/i);
  });
});

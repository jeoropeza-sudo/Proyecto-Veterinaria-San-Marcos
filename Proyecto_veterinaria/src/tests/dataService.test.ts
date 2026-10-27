// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  addProducto,
  addServicio,
  deleteProducto,
  deleteServicio,
  loadCatalog,
} from '../services/dataService';

describe('Servicio de datos del catálogo', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('siembra el catálogo inicial de servicios y productos en localStorage', () => {
    const catalog = loadCatalog();

    expect(catalog.productos).toHaveLength(9);
    expect(catalog.servicios.length).toBeGreaterThan(20);
    expect(window.localStorage.getItem('veterinaria.productos')).not.toBeNull();
    expect(window.localStorage.getItem('veterinaria.servicios')).not.toBeNull();
  });

  it('crea y elimina registros conservando el catálogo', () => {
    const createdProduct = addProducto({
      categoria: 'Accesorios',
      nombre: 'Producto de prueba',
      stock: 3,
      precio: 1200,
      imagen: '/imagenes/condro.png',
      detalle: 'Registro de prueba',
    });
    const createdService = addServicio({
      categoria: 'Otros',
      nombre: 'Servicio de prueba',
      especie: 'Perro',
      duracion: '15 min',
      precio: 7000,
      detalle: 'Registro de prueba',
    });

    expect(createdProduct.productos.at(-1)?.codigo).toBe('PR001');
    expect(createdService.servicios.at(-1)?.codigo).toBe('SV006');
    expect(deleteProducto('PR001').productos.some((item) => item.codigo === 'PR001')).toBe(false);
    expect(deleteServicio('SV006').servicios.some((item) => item.codigo === 'SV006')).toBe(false);
  });

  it('reporta un error si el almacenamiento contiene una colección inválida', () => {
    window.localStorage.setItem('veterinaria.productos', '{invalido');

    expect(() => loadCatalog()).toThrow(/están dañados/i);
  });
});

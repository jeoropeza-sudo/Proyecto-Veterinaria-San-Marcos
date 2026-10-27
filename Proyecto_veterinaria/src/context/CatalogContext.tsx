import { useState, type ReactNode } from 'react';
import {
  addProducto as saveProducto,
  addServicio as saveServicio,
  deleteProducto as removeProducto,
  deleteServicio as removeServicio,
  loadCatalog,
  type CatalogData,
} from '../services/dataService';
import type { Producto, Servicio } from '../types';
import { CatalogContext } from './catalogContextDefinition';

interface CatalogState extends CatalogData {
  error: string | null;
}

function getInitialState(): CatalogState {
  try {
    return { ...loadCatalog(), error: null };
  } catch (error) {
    return {
      productos: [],
      servicios: [],
      error: error instanceof Error ? error.message : 'No se pudo cargar el catálogo.',
    };
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(getInitialState);

  const updateCatalog = (operation: () => CatalogData) => {
    try {
      setState({ ...operation(), error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el catálogo.';
      setState((current) => ({ ...current, error: message }));
      throw error;
    }
  };

  const addProducto = (product: Omit<Producto, 'codigo'>) => updateCatalog(() => saveProducto(product));
  const addServicio = (service: Omit<Servicio, 'codigo'>) => updateCatalog(() => saveServicio(service));
  const deleteProducto = (codigo: string) => updateCatalog(() => removeProducto(codigo));
  const deleteServicio = (codigo: string) => updateCatalog(() => removeServicio(codigo));

  return (
    <CatalogContext.Provider
      value={{
        ...state,
        addProducto,
        addServicio,
        deleteProducto,
        deleteServicio,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

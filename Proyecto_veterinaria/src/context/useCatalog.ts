import { useContext } from 'react';
import { CatalogContext } from './catalogContextDefinition';

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog debe utilizarse dentro de CatalogProvider.');
  }
  return context;
}

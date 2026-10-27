import { BrowserRouter } from 'react-router-dom';
import { ProveedorAutenticacion } from './context/ContextoAutenticacion';
import { ProveedorCatalogo } from './context/ContextoCatalogo';
import { ProveedorCarrito } from './context/ContextoCarrito';
import { EnrutadorAplicacion } from './router/EnrutadorAplicacion';

function App() {
  return (
    <BrowserRouter>
      <ProveedorAutenticacion>
        <ProveedorCatalogo>
          <ProveedorCarrito>
            <EnrutadorAplicacion />
          </ProveedorCarrito>
        </ProveedorCatalogo>
      </ProveedorAutenticacion>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CatalogProvider>
          <AppRouter />
        </CatalogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
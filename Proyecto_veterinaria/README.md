# Veterinaria San Marcos

## Autenticación

El registro y el inicio de sesión se validan mediante el API de autenticación disponible en el gateway local (`http://localhost:8090/api/aute`). El token y los datos de sesión se conservan en `localStorage`; la contraseña no se almacena en el navegador.

## Consultas de contacto

El formulario de contacto envía nombre, correo, motivo y mensaje al API de consultas (`POST http://localhost:8090/api/consultas`).

## Catálogo

Los servicios y productos se inicializan desde `src/services/servicioDatos.ts` y se guardan en `localStorage` bajo `veterinaria.servicios` y `veterinaria.productos`. El panel de administración y las páginas de catálogo comparten estos datos; permite agregar, editar y eliminar registros, y los cambios permanecen en el mismo navegador. Para volver a los datos iniciales, elimina esas dos claves del almacenamiento local del sitio.

El carrito se guarda en `localStorage` bajo `veterinaria.carrito`. Se pueden agregar productos dentro del stock y servicios como solicitudes de reserva; para confirmar se requiere una sesión. La confirmación actual no procesa pagos ni crea una orden de compra.

Los nombres de páginas, componentes, métodos y tipos propios del proyecto están en español. Se conservan en su idioma original las APIs de React y de las bibliotecas, además de los archivos que pertenecen a la plantilla base.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

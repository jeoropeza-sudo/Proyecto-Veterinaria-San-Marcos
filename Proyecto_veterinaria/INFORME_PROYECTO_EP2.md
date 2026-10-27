# Informe de evaluación y preparación de defensa — Veterinaria San Marcos

**Curso:** DSY1104 · Desarrollo Fullstack II  
**Evaluación:** EP2 · Implementación frontend y pruebas unitarias  
**Fecha de revisión:** octubre de 2026  
**Alcance:** revisión estática del repositorio, comparación con la rúbrica adjunta y ejecución de build, pruebas y lint.

> Este informe es una evaluación de evidencia técnica, no una calificación oficial. La nota depende del ERS actualizado, de la presentación y de lo que confirme el docente como patrón obligatorio. No se encontró un ERS actualizado ni un reporte de cobertura en los archivos revisados.

## 1. Resumen ejecutivo

La aplicación React está funcionalmente avanzada: usa React, Vite y TypeScript; tiene catálogo local persistente de productos y servicios; permite crear, leer, actualizar y eliminar registros desde Administración; ofrece filtros, detalles por código, control de sesión y rol, carrito, nuevas páginas institucionales y pruebas. El build de producción concluyó correctamente y, en una ejecución reproducible con dos workers, las **32 pruebas de las 9 suites** pasaron.

La principal brecha no es la ausencia de funciones centrales, sino la **evidencia incompleta frente a la rúbrica**:

1. Los filtros de búsqueda y categoría existen, pero no se identificaron pruebas que comprueben sus resultados.
2. No hay un comando de cobertura configurado ni un reporte generado y documentado.
3. En el proyecto HTML anterior existen una página de registro y un mantenedor de usuarios; no se encontraron vistas equivalentes en la app React.
4. Hay una organización inicial compatible con Atomic Design, pero los átomos y `SearchBar` del directorio `Componentes` no aparecen integrados en las páginas actuales. La carpeta mezcla `Componentes` y `componentes`.
5. Se usan contextos/proveedores y servicios, pero el patrón requerido por la asignatura no está nombrado ni justificado en la documentación.
6. La ejecución de todas las pruebas sin limitar workers tuvo intermitencia por timeouts; con `--maxWorkers=2` pasaron todas.
7. El lint completo continúa fallando en una asignación sin uso en `src/utils/validadorRut.ts:26`; el lint focalizado del resto del proyecto pasó.

**Conclusión:** el núcleo técnico está listo para demostración, pero para maximizar el cumplimiento conviene cerrar las brechas de registro/usuarios si el ERS las exige, probar los filtros y las cuatro operaciones CRUD de forma persistente, entregar cobertura y documentar explícitamente el diseño.

## 2. Qué contiene el sistema

### 2.1 Tecnologías y ejecución

- **React** organiza la interfaz como componentes.
- **Vite** sirve el entorno de desarrollo y crea el bundle de producción.
- **TypeScript** tipa las entidades, propiedades de componentes y operaciones.
- **React Router** resuelve rutas de página y parámetros dinámicos.
- **Bootstrap** aporta la grilla, formularios, tarjetas, navegación y clases adaptables a distintos tamaños.
- **Vitest**, **React Testing Library** y **jsdom** ejecutan las pruebas automatizadas.

Comandos, ejecutados desde `Proyecto_veterinaria`:

```bash
npm run dev
npm run build
npm run test -- --maxWorkers=2
npm run lint
```

Resultados observados durante esta revisión:

| Comando | Resultado | Observación |
|---|---|---|
| `npm run build` | Aprobado | TypeScript y bundle de Vite compilaron. |
| `npm run test -- --maxWorkers=2` | Aprobado: 9 archivos, 32 pruebas | Ejecución reproducible de esta revisión. |
| `npm run test` | Intermitente en una ejecución | Dos pruebas excedieron el timeout de 5 s; luego las 32 pasaron limitando workers. |
| `npm run lint` | Falla en 1 regla | `src/utils/validadorRut.ts:26`, asignación inicial de `dvEsperado` que ESLint marca como no utilizada. |
| ESLint focalizado | Aprobado | Los módulos funcionales y páginas revisados no mostraron errores. |

El proyecto tiene un script `test`; anteriormente Vitest estaba instalado, pero faltaba el script. Se corrigió para ejecutar Vitest con `jsdom`.

### 2.2 Organización y responsabilidades

- `src/main.tsx`: punto de entrada, React Strict Mode, CSS global y Bootstrap.
- `src/App.tsx`: compone Router y proveedores de autenticación, catálogo y carrito.
- `src/router/EnrutadorAplicacion.tsx`: mapa de rutas, navegación común y visualización de errores globales.
- `src/router/RequerirRol.tsx`: guardia que redirige a autenticación y limita `/admin` al rol Administrador.
- `src/context/`: contextos, proveedores y hooks para estado compartido.
- `src/services/`: persistencia y reglas de catálogo, sesión y carrito.
- `src/types/`: tipos de producto, servicio, usuario y artículo de carrito.
- `src/paginas/`: vistas de Inicio, Productos, Servicios, detalle, Inicio de sesión, Carrito, Administración, Nosotros, Novedades, detalle de novedad y Contacto.
- `src/componentes/`: tarjetas de productos/servicios, barra de navegación, formularios, listas y pie de página.
- `src/datos/novedades.ts`: contenido demostrativo usado por las vistas de novedades.
- `src/tests/`: pruebas de servicios, rutas, autenticación, carrito, componentes y páginas institucionales.

### 2.3 Tipos y estado

`Producto` y `Servicio` se mantienen como entidades diferenciadas. `ItemCarrito` es una unión discriminada con `tipo: 'producto' | 'servicio'`; esto permite que TypeScript distinga artículos de compra de solicitudes de reserva. `Usuario` contempla roles `Administrador` y `Cliente`.

Los proveedores de Context permiten compartir sesión, catálogo y carrito sin pasar todos los datos manualmente por cada nivel del árbol. `useState` maneja además estados locales, como campos de formulario, filtros, apertura del menú y mensajes de confirmación.

### 2.4 Servicios y datos

El catálogo simulado está en `localStorage`:

- `veterinaria.productos`
- `veterinaria.servicios`
- `veterinaria.session`
- `veterinaria.carrito`

`servicioDatos.ts` siembra productos y servicios iniciales si las claves aún no existen, valida los datos leídos y expone carga, creación, actualización y eliminación. Los cambios se comparten entre el catálogo y Administración en el navegador actual. No existe una API ni base de datos remota.

`servicioAutenticacion.ts` utiliza cuentas de demostración en frontend. `servicioCarrito.ts` valida el formato persistido, limita cantidades de productos por stock y administra artículos y solicitudes de reserva. La compra/reserva no se transmite a la clínica: la confirmación es local y demostrativa.

### 2.5 Navegación y pantallas

Rutas funcionales principales:

| Ruta | Comportamiento |
|---|---|
| `/` | Inicio y accesos al catálogo y novedades. |
| `/productos` | Catálogo de productos, búsqueda y categoría. |
| `/productos/:codigo` | Detalle de producto usando `useParams()`. |
| `/servicios` | Catálogo de servicios, búsqueda y categoría. |
| `/servicios/:codigo` | Detalle de servicio usando `useParams()`. |
| `/carrito` | Productos, solicitudes, cantidades y confirmación de demostración. |
| `/login` | Acceso simulado y mensajes de validación. |
| `/admin` | Administración protegida por rol. |
| `/nosotros` | Historia, misión, visión y valores. |
| `/novedades` | Listado de cuatro novedades. |
| `/novedades/:codigo` | Detalle de novedad y enlace a una sección relacionada. |
| `/contacto` | Datos de contacto y formulario de demostración. |

La navegación y el pie de página enlazan las páginas institucionales nuevas. Las vistas usan grillas y utilidades Bootstrap adaptables.

## 3. Revisión contra los requisitos y la rúbrica

### Requisitos del proyecto

| Requisito | Estado | Evidencia y brecha |
|---|---|---|
| React + Vite + TypeScript y funcionamiento | **Mayormente cumplido** | El build pasa y la aplicación usa las tecnologías solicitadas. El sitio HTML migró gran parte de sus flujos. No se encontró un ERS actualizado para confirmar paridad completa. |
| Migración de vistas y funcionalidades previas | **Parcial** | Se implementaron Inicio, catálogo, detalle, carrito, login y catálogo administrativo, además de Nosotros, Novedades y Contacto. El sitio HTML contiene `registro.html` y un módulo Admin de usuarios (`Admin/usuarios.html`) sin vistas equivalentes encontradas. El catálogo Admin se concentra en una sola página React. Confirmar con el ERS si esos módulos son obligatorios. |
| Atomic Design | **Parcial** | Se reconocen niveles de átomos, moléculas y organismos; tarjetas y formularios/listas son componentes reutilizables. Los archivos previos bajo `src/Componentes/atomos` y `src/Componentes/moleculas/SearchBar` no aparecen integrados en las vistas actuales. Conviene unificar casing y demostrar composición real. |
| Patrón de diseño seleccionado | **Parcial / por justificar** | El código presenta un enfoque de proveedores de Context para estado global y servicios para persistencia/reglas. No se identificó documentación que lo denomine y lo relacione con el patrón exacto trabajado en clases. No confundir este patrón con Atomic Design: son criterios distintos. |
| Estado, formularios y validaciones | **Parcialmente cumplido** | Login y formulario de catálogo usan estado controlado y validaciones. El formulario de Contacto usa validación nativa del navegador y solo muestra un aviso demostrativo. Conviene validar explícitamente valores numéricos positivos, límites y errores de persistencia. |
| Fuente independiente y CRUD completo | **Funcionalidad cumplida; pruebas parciales** | Servicios tipados para leer/crear/actualizar/eliminar y persistencia local. La interfaz permite agregar, editar y eliminar desde Admin. Algunas pruebas no vuelven a cargar el catálogo después de crear/eliminar para comprobar persistencia en esos dos casos. |
| Vistas, detalle y navegación | **Cumplido para rutas implementadas** | React Router tiene rutas dinámicas de productos/servicios y novedades, detalle compartido y Admin protegido. El detalle de catálogo lee `codigo` con `useParams()`. |
| Filtros de búsqueda | **Funcionalidad implementada; cobertura pendiente** | Productos y servicios filtran por texto y categoría. No se identificaron pruebas que demuestren resultados filtrados, coincidencia parcial, combinación de filtros o estado vacío. |
| Diseño adaptable | **Implementado; validación visual pendiente** | Navbar adaptable y clases Bootstrap `container-fluid`, `row`, `col-*`, `flex-*` y breakpoints. La suite jsdom no demuestra visualmente la adaptación real en móvil/tablet/escritorio; falta revisión manual o evidencia de navegador en esos tamaños. |
| Pruebas unitarias | **Cantidad y ejecución cumplidas; casos requeridos incompletos** | 32 pruebas en 9 archivos pasaron con dos workers. Cubren carga, eventos, autenticación, carrito, rutas, edición y páginas institucionales. Faltan pruebas específicas de filtros y robustecer persistencia de alta/baja. |
| Proceso de pruebas y cobertura | **Parcial** | El entorno y el comando de pruebas son reproducibles. No se encontró configuración/comando de cobertura ni reporte de Vitest; la rúbrica pide entregar reporte y analizar casos pendientes, aunque no exige porcentaje mínimo. |
| Git/GitHub y aportes | **Evidencia parcial** | El historial incluye commits de distintos integrantes y existen ramas remotas `feature/martin-ui` y `feature/vicente-admin`; la rama local observada es `main`. Preparar una explicación individual anclada en commits propios y archivos trabajados. Un historial por sí solo no prueba que cada integrante domine el código. |
| Entregables académicos | **Pendiente de confirmar** | No se encontró ERS actualizado, documento formal de testing/cobertura ni archivo comprimido entre los documentos identificados en el espacio revisado. Verificar publicación/enlace y formato de entrega requeridos por AVA. |

### Indicadores de evaluación grupal

La rúbrica asigna el 40 % grupal a IE2.1.1 (10 %), IE2.1.2 (10 %), IE2.2.1 (12 %) e IE2.3.1 (8 %). La evidencia actual es más sólida para funcionamiento, tipos, navegación y cantidad de pruebas que para el patrón documentado, pruebas de filtros y cobertura.

| Indicador | Lectura actual |
|---|---|
| IE2.1.1 — React/Vite/TypeScript, Atomic Design y patrón | **Parcial a favorable**: la aplicación compila, tiene vistas y CRUD, pero el uso de Atomic Design es incompleto/no demostrado en todos sus niveles y el patrón no está justificado formalmente. |
| IE2.1.2 — componentes, estado, formularios, CRUD, filtros, navegación y responsive | **Parcial a favorable**: la mayoría funciona; faltan validaciones de borde, pruebas de filtros y evidencia responsive visual. |
| IE2.2.1 — pruebas efectivas | **Parcial a favorable**: excede 15 pruebas y la ejecución controlada pasa; la rúbrica exige explícitamente CRUD y filtros, estos últimos no están probados. |
| IE2.3.1 — proceso y cobertura | **Parcial**: entorno y comando existen, pero falta reporte de cobertura y análisis documentado de pendientes. |

### Indicadores individuales

La presentación individual equivale al 60 %: IE2.1.3 (15 %), IE2.1.4 (20 %), IE2.2.2 (15 %) e IE2.3.2 (10 %). La nota individual no se puede inferir únicamente del código. Cada integrante debe explicar sus aportes y demostrar que entiende las pruebas, el estado, el CRUD, las rutas y las limitaciones.

| Indicador | Preparación recomendada |
|---|---|
| IE2.1.3 — diseño, Atomic Design, patrón y aportes Git | Relacionar cada decisión con un archivo/commit propio; distinguir patrón de organización visual; justificar Context + servicios y la composición de componentes. |
| IE2.1.4 — demostración de funcionalidades | Demostrar una ruta dinámica, los filtros, el CRUD completo, validaciones, acceso por rol y layout responsive. |
| IE2.2.2 — ejecución e interpretación de pruebas | Ejecutar Vitest y explicar preparación, acción y expectativa de un caso de cada dominio; reconocer que no hay aún pruebas de filtros. |
| IE2.3.2 — proceso y cobertura | Explicar Vitest, Testing Library y jsdom. No declarar un porcentaje ni afirmar cobertura entregada hasta generar el reporte real. |

## 4. Qué está bien resuelto

1. **Separación de responsabilidades:** servicios de datos no dependen de la interfaz; páginas usan Context; componentes reciben props.
2. **Tipado de dominio:** Producto, Servicio, Usuario e ItemCarrito tienen estructuras explícitas.
3. **Estado compartido:** Context evita duplicar el catálogo y sincroniza Administración con las páginas públicas.
4. **Persistencia y errores visibles:** los datos sobreviven recargas locales y los proveedores mantienen errores para mostrarlos.
5. **Autorización de interfaz:** el administrador requiere rol Administrador y el cliente no entra al panel.
6. **Rutas con parámetros:** las fichas se encuentran mediante código sin duplicar la ruta por cada producto.
7. **Reglas del carrito:** se conserva la selección al solicitar login y se valida el stock al incrementar productos.
8. **Pruebas funcionales:** las suites ejercitan navegación, formularios, datos, autenticación y carrito.
9. **Diseño consistente:** identidad visual azul/turquesa, barra compartida, tarjetas, imágenes y pie de página común.
10. **Transparencia sobre demos:** el carrito y Contacto indican que no hay backend y no envían solicitudes reales.

## 5. Qué mejorar, por prioridad

### Prioridad 1 — completar evidencia requerida

1. Añadir pruebas de filtro por texto y categoría para Productos y Servicios; incluir cero resultados y combinación de filtros.
2. En pruebas CRUD, después de agregar/eliminar, volver a llamar a `cargarCatalogo()` y comprobar el contenido de `localStorage`.
3. Generar un reporte real de cobertura de Vitest, guardarlo como entregable reproducible y documentar los archivos/casos excluidos y pendientes. El porcentaje no es una meta impuesta por la rúbrica.
4. Ejecutar nuevamente la suite con el comando estable de dos workers antes de presentar y conservar la salida.
5. Corregir el lint de `validadorRut.ts:26` con una refactorización de la expresión del dígito verificador y volver a probar sus casos.

### Prioridad 2 — validar alcance de migración

6. Comparar formalmente todas las páginas y operaciones del HTML y del ERS con las rutas React. Confirmar si `/registro`, administración de usuarios y las páginas Admin separadas se deben migrar. Si están en el alcance, implementarlas y probarlas; si no, justificar su exclusión en el ERS.
7. Revisar la fidelidad del formulario de Contacto: el HTML previo incluye RUN y teléfono; la vista React actual no. Acordar qué campos exige el ERS.
8. Revisar que textos de novedades/promociones no se interpreten como oferta vigente si no existe respaldo operativo. El catálogo de noticias actual es estático y demostrativo.

### Prioridad 3 — arquitectura y calidad de interfaz

9. Consolidar `src/Componentes` y `src/componentes` en un único casing (idealmente minúsculas) y evitar duplicar átomos/componentes. El casing mixto puede dar confusión y problemas al mover/importar en otros sistemas operativos.
10. Integrar de verdad átomos reutilizables (`Button`, `Input`, `Badge`) en moléculas/organismos o retirar componentes no usados que no formen parte del diseño elegido.
11. Documentar el patrón exacto exigido por el curso. Una explicación posible si coincide con lo visto en clases es: **Context Provider para estado compartido + capa de servicios**, mientras Atomic Design estructura los elementos visuales.
12. Mejorar la validación del formulario Admin: precio no negativo, stock entero, obligatoriedad y límites; definir qué campos del servicio se pueden editar (duración, especie, imagen y categoría).
13. Comprobar el flujo visual en anchos móvil, tablet y escritorio con navegador; revisar teclado, foco, contraste y mensajes accesibles.
14. Separar una autenticación real del demo antes de cualquier uso real. `localStorage`, credenciales frontend y control de rol del cliente no constituyen seguridad de servidor.

## 6. Preguntas y respuestas para demostrar conocimientos

### React, componentes y diseño

**1. ¿Por qué se migró a React?**  
Para representar las vistas como componentes reutilizables y actualizar la interfaz en función del estado. Vite aporta el servidor de desarrollo y el proceso de build; TypeScript ayuda a detectar incompatibilidades en entidades y propiedades.

**2. ¿Qué significa que una página sea un componente?**  
Es una función que devuelve interfaz JSX. Por ejemplo, `PaginaProductos` lee el catálogo y estado de filtros, mientras `TarjetaProducto` presenta una unidad con propiedades tipadas.

**3. ¿Qué es Atomic Design en este repositorio?**  
Una forma de organizar UI desde piezas pequeñas hacia composiciones: átomos, moléculas y organismos. No es el patrón de gestión de datos. Para evidenciarlo bien, hay que mostrar una composición real y resolver los átomos no integrados/casing mixto.

**4. ¿Qué patrón de diseño usa el proyecto?**  
La aplicación usa proveedores de React Context para compartir autenticación, catálogo y carrito, y servicios separados para reglas/persistencia. Debe nombrarse como el patrón que corresponda a lo enseñado y justificarse con el docente; no presentarlo como Atomic Design.

**5. ¿Qué ventajas dan las props tipadas?**  
Definen qué datos/acciones requiere un componente, detectan llamadas incorrectas al compilar y documentan el contrato, por ejemplo el producto que recibe una tarjeta.

### Datos, estado y navegación

**6. ¿Qué hace `useState`?**  
Mantiene estado local del componente y solicita un nuevo render cuando cambia. Se usa para campos, búsqueda, filtro, menú y feedback.

**7. ¿Por qué Context para el catálogo?**  
Varias vistas consumen y modifican los mismos productos/servicios. Context comparte un estado único sin pasar props manualmente por muchas capas.

**8. ¿Qué significa CRUD?**  
Create: agregar; Read: cargar; Update: editar; Delete: eliminar. Aquí las funciones de datos guardan cambios en `localStorage`, y el contexto propaga el catálogo actualizado a la interfaz.

**9. ¿Qué es `localStorage` y cuál es su límite?**  
Almacenamiento clave/valor persistente en el navegador. Sirve como fuente de datos simulada para esta entrega, pero solo existe en ese navegador y puede ser modificada por el usuario; no reemplaza una API o base de datos.

**10. ¿Cómo funciona una ruta dinámica?**  
React Router compara la URL con `/productos/:codigo`; `useParams()` obtiene el código y la vista busca el registro en el catálogo. Si no existe, muestra una alternativa para volver.

**11. ¿Cómo se protege `/admin`?**  
`RequerirRol` verifica el usuario y el rol. Sin sesión redirige a login; con rol distinto de Administrador muestra acceso denegado. En producción, el servidor también debe autorizar; ocultar una página frontend no es seguridad suficiente.

**12. ¿Qué ocurre si falla la lectura del catálogo?**  
El proveedor captura el error para mantener un estado visible; la aplicación muestra el mensaje en una alerta global en vez de asumir que la carga salió bien.

### Formularios, filtros y limitaciones

**13. ¿Qué diferencia hay entre un formulario controlado y uno nativo?**  
En uno controlado, React guarda cada valor en estado y lo actualiza con `onChange`; en uno nativo, el DOM mantiene el valor y las reglas HTML como `required`/`type=email` pueden validar. Login y Admin usan estado controlado; Contacto usa validación nativa y solo simula el envío.

**14. ¿Los mensajes de Contacto llegan a la veterinaria?**  
No. El formulario demuestra validación/interacción, muestra aviso y limpia campos, pero no hace una petición. Hace falta backend o proveedor autorizado para enviar y almacenar mensajes.

**15. ¿Cómo filtra el catálogo?**  
Normaliza texto, compara nombre/categoría/código y aplica la categoría seleccionada. `useMemo` calcula la lista según cambian búsqueda, categoría o catálogo. Falta una prueba automatizada directa de esta regla.

**16. ¿La compra y la reserva son reales?**  
No. Se guardan temporalmente en el carrito local; al confirmar con sesión se muestra un mensaje y se limpia el carrito. No hay pago, envío a clínica ni registro central.

**17. ¿Qué seguridad tiene el login?**  
Es solo demostrativo: las cuentas de prueba no se muestran en la pantalla, pero la autenticación está implementada en frontend y la sesión queda en `localStorage`. No usar datos reales. Un sistema real requiere autenticación y autorización del lado servidor.

### Testing y trabajo colaborativo

**18. ¿Qué hace Vitest y qué hace Testing Library?**  
Vitest ejecuta las pruebas; React Testing Library renderiza componentes y consulta la interfaz como lo haría una persona, además de disparar eventos. jsdom proporciona un DOM simulado.

**19. ¿Qué comprueba una buena prueba CRUD?**  
Prepara datos, ejecuta una acción y verifica resultado visible y persistido. Para crear/eliminar no basta con comprobar el arreglo devuelto: conviene volver a leer la fuente.

**20. ¿Tener 32 pruebas garantiza calidad completa?**  
No. La cantidad importa, pero la rúbrica exige casos concretos. Hoy faltan pruebas específicas de filtros y un reporte de cobertura; la cobertura tampoco prueba por sí sola que las expectativas sean correctas.

**21. ¿Qué evidencia de colaboración Git se puede mostrar?**  
El historial tiene commits atribuidos a integrantes del equipo y ramas remotas `feature/martin-ui` y `feature/vicente-admin`. Cada persona debe seleccionar sus propios commits y explicar cambios concretos; no atribuirse trabajo de otras personas.

## 7. Guion de demostración en vivo

Propuesta para una exposición de diez minutos; dejar preguntas para el bloque individual:

1. **0:00–0:45 — Arranque:** mostrar `npm run dev`, explicar React/Vite/TypeScript y ubicar `main.tsx`, `App.tsx`.
2. **0:45–1:45 — Arquitectura:** enseñar carpetas `paginas`, `componentes`, `context`, `services`, `types`; explicar Atomic Design frente al patrón de proveedores/servicios.
3. **1:45–3:00 — Catálogo y filtros:** abrir Productos, buscar por palabra, seleccionar categoría, borrar búsqueda y mostrar estado vacío; repetir una acción en Servicios.
4. **3:00–4:00 — Detalle dinámico:** abrir un producto y servicio por código; explicar `useParams()`; probar un código inexistente.
5. **4:00–5:30 — CRUD:** iniciar sesión como Administrador, crear un producto/servicio, editar nombre/precio, verificar que cambia en el catálogo, eliminarlo. Explicar que localStorage simula la persistencia.
6. **5:30–6:30 — Roles y autenticación:** salir, probar acceso protegido; entrar como Cliente y mostrar que `/admin` es denegado; probar contraseña incorrecta.
7. **6:30–7:15 — Carrito:** agregar un artículo/reserva, cambiar cantidad, explicar requisito de login al confirmar y advertir que no es compra real.
8. **7:15–8:00 — Páginas:** mostrar Nosotros, Contacto, Novedades y abrir un detalle con enlace relacionado.
9. **8:00–9:15 — Pruebas:** ejecutar `npm run test -- --maxWorkers=2`; explicar una prueba CRUD, una de autenticación y una ruta. Reconocer explícitamente la cobertura de filtros pendiente.
10. **9:15–10:00 — Responsive y cierre:** redimensionar a móvil/tablet, abrir menú colapsable y mencionar trabajo pendiente/limitaciones.

**Preparación:** usar datos de prueba fáciles de borrar; iniciar con sesión cerrada; comprobar acceso a `/admin`; tener terminal con la carpeta de la app; cerrar otros procesos que consuman recursos para evitar timeouts.

## 8. Ejercicios de cambios de código en vivo

En esta sección, “cambio en vivo” significa que el profesor pide **editar el código durante la presentación**, no solo hacer clic en una función existente. Los ejercicios están ordenados de menor a mayor alcance. Conviene elegir uno que se pueda terminar en el tiempo disponible, ejecutar su prueba y explicar qué archivos y capas se modificaron.

| Pedido de código que podría hacer el profesor | Cambio concreto y archivos probables | Cómo implementarlo y explicarlo |
|---|---|---|
| “Agrega una prueba para verificar que la búsqueda filtre productos por nombre” | Crear o ampliar una prueba de página/catálogo bajo `src/tests/`; usar la vista `src/paginas/PaginaProductos.tsx`. | Renderizar la página con el proveedor de catálogo, escribir en el campo de búsqueda y comprobar que aparece el producto coincidente y no aparece otro. Explicar Arrange–Act–Assert y ejecutar solo el archivo de prueba. |
| “Haz que también se pueda filtrar servicios por especie” | Actualizar el estado/selector y el cálculo de resultados en `src/paginas/PaginaServicios.tsx`; añadir la prueba correspondiente bajo `src/tests/`. | Agregar un criterio que use el campo `especie` de `Servicio`, combinarlo con la búsqueda/categoría existentes y verificar ambas especies en una prueba. Evitar duplicar la regla en varios componentes. |
| “No permitas guardar un producto con precio negativo o stock decimal” | Validar en el formulario de Administración (`src/paginas/PaginaAdministracion.tsx`) y proteger también la operación en `src/services/servicioDatos.ts`; agregar casos en `src/tests/`. | Rechazar precio menor que cero y stock que no sea entero no negativo. Probar datos válidos e inválidos. Explicar que la validación del formulario mejora UX, pero el servicio debe proteger la regla aunque otra pantalla lo invoque. |
| “Después de crear y borrar, comprueba que realmente persistió” | Fortalecer `src/tests/servicioDatos.test.ts`. | Después de cada operación, volver a llamar a `cargarCatalogo()` y comprobar el contenido actualizado. Explicar que verificar el valor retornado por la operación no basta para demostrar lectura posterior de la persistencia. |
| “Si el filtro no encuentra resultados, muestra un mensaje y un botón para limpiar” | Modificar la vista de catálogo afectada, por ejemplo `src/paginas/PaginaProductos.tsx`, y su prueba en `src/tests/`. | Mostrar un estado vacío cuando el resultado filtrado tenga longitud cero; el botón debe limpiar búsqueda y categoría mediante el estado React existente. Probar tanto el mensaje como la recuperación al limpiar. |
| “Añade un enlace de regreso desde el detalle de una novedad a Novedades” | Actualizar `src/paginas/PaginaDetalleNovedad.tsx` y su prueba en `src/tests/paginasInstitucionales.test.tsx`. | Usar navegación declarativa de React Router, no una recarga manual con `window.location`; comprobar que el enlace apunta a `/novedades`. |
| “Haz una prueba para el acceso de un Cliente a `/admin`” | Ampliar `src/tests/autenticacion.test.tsx` o la suite que prueba el guardia; verificar `src/router/RequerirRol.tsx`. | Renderizar la ruta con usuario autenticado de rol Cliente y esperar el estado de acceso denegado; añadir también el caso Administrador permitido si falta. Aclarar que se prueba el guard de interfaz, no seguridad backend. |
| “Haz que el formulario de Contacto no confirme si falta el correo” | Actualizar `src/paginas/PaginaContacto.tsx` y la prueba de páginas institucionales. | Añadir validación controlada o nativa coherente con el formulario, mostrar un error claro y evitar el mensaje de éxito. No simular un envío real: todavía no hay backend. |
| “Agrega pruebas de cobertura” | Configurar el script/dependencias de cobertura en `Proyecto_veterinaria/package.json` según el entorno Vitest instalado y documentar el comando. | Confirmar primero si el provider requerido está disponible; ejecutar el reporte, revisar su salida y no inventar porcentajes. El resultado debe generarse de verdad y no confundirse con el conteo de pruebas. |

### Método para resolver el cambio frente al profesor

1. **Aclarar el resultado esperado:** repetir el requisito en una frase y confirmar límites/valores de borde.
2. **Localizar la capa correcta:** interfaz para interacción/feedback; servicio para reglas de datos; prueba para dejar el comportamiento verificable.
3. **Implementar el caso mínimo completo:** cubrir el escenario feliz y el borde principal, sin modificar archivos ajenos al pedido.
4. **Ejecutar la prueba focalizada:** usar el comando de Vitest indicando el archivo pertinente; si queda tiempo, correr `npm run test -- --maxWorkers=2`.
5. **Explicar el recorrido:** entrada del usuario → componente/contexto → servicio cuando aplique → estado/persistencia → expectativa de prueba.
6. **Declarar límites honestamente:** no asegurar que el cambio funciona en producción si solo está validado en frontend/localStorage.

**Ejemplo de explicación oral:** “Voy a agregar validación para que el stock sea un entero no negativo. La interfaz mostrará el error, pero también protegeré el servicio porque la regla de dominio no debe depender solo del formulario. Agregaré pruebas para stock válido, negativo y decimal; luego ejecutaré esa suite.”
| “Agregue validación de precio” | Comprobar obligatoriedad, número y límite mínimo tanto en la interfaz como en el servicio para evitar confiar solo en HTML. |
| “¿Dónde están los átomos?” | Ubicar átomos previos, explicar los que sí se usan y reconocer la integración parcial/casing a ordenar. |

## 9. Plan de cierre recomendado

**Antes de entregar:**

1. Confirmar el alcance con el ERS/docente: registro, usuarios y mantenedor Admin legado.
2. Añadir cobertura de pruebas para los filtros de Productos y Servicios.
3. Fortalecer pruebas de persistencia CRUD después de recargar datos.
4. Configurar y generar el reporte de cobertura; adjuntarlo al documento de testing.
5. Corregir el lint global y dejar un único resultado limpio de build, test y lint.
6. Justificar por escrito patrón, Atomic Design y responsabilidades por integrante.
7. Unificar casing/rutas y revisar componentes no utilizados.
8. Probar responsive y formularios en navegador real, no solo jsdom.
9. Preparar ERS actualizado, enlace GitHub, ZIP y documento de testing solicitado.
10. Ensayar el guion individual y acordar quién explica cada módulo sin atribuirse trabajo ajeno.

## 10. Checklist final de defensa

- [ ] Puedo explicar tipos y unión discriminada `ItemCarrito`.
- [ ] Puedo trazar una operación CRUD desde el formulario hasta localStorage.
- [ ] Puedo explicar Context/Provider y distinguirlo de Atomic Design.
- [ ] Puedo demostrar las rutas dinámicas y la guardia por rol.
- [ ] Puedo demostrar búsqueda y filtros sin confundir función implementada con prueba automatizada.
- [ ] Sé explicar qué comprueban las pruebas y qué casos faltan.
- [ ] No afirmo que Contacto, compra, reserva o autenticación sean servicios reales.
- [ ] Puedo mostrar mis commits y describir mi aporte individual.
- [ ] Tengo el ERS, ZIP y reporte de cobertura si son exigidos por AVA/docente.
- [ ] Tengo una ejecución reproducible de build y tests antes de la presentación.

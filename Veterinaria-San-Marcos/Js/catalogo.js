// Js/catalogo.js

// 1. Renderiza la vista general de categorías con imagen superior
function renderizarCategoriasServicios(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    listaCategoriasServicios.forEach(cat => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 overflow-hidden">
                <img src="${cat.imagen}" class="card-img-top" alt="${cat.nombre}" style="height: 180px; object-fit: cover;">
                <div class="card-body d-flex flex-column p-4">
                    <h4 class="card-title fw-bold text-dark">${cat.nombre}</h4>
                    <p class="card-text text-muted small flex-grow-1">${cat.desc}</p>
                    <div class="my-3 border-top pt-3">
                        <span class="text-muted small d-block">Valores de referencia</span>
                        <span class="fw-bold fs-5 text-primary">Desde $${cat.desde.toLocaleString('es-CL')}</span>
                    </div>
                    <button class="btn btn-outline-dark mt-auto btn-ver-categoria w-100" data-categoria="${cat.id}">
                        Ver Especialidades
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });

    document.querySelectorAll(".btn-ver-categoria").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const categoriaSeleccionada = e.target.getAttribute("data-categoria");
            mostrarDetalleCategoria(categoriaSeleccionada);
        });
    });
}

// 2. Renderiza el catálogo detallado de servicios por categoría
function mostrarDetalleCategoria(nombreCategoria) {
    const contenedor = document.getElementById("contenedor-servicios");
    if (!contenedor) return;

    const filtrados = listaServiciosOficial.filter(s => s.categoria === nombreCategoria);

    contenedor.innerHTML = `
        <div class="col-12 mb-4">
            <button class="btn btn-sm btn-outline-secondary mb-3" id="btn-volver-categorias">← Volver a Categorías</button>
            <h2 class="fw-bold text-dark">Especialidad: ${nombreCategoria}</h2>
            <hr class="text-muted">
        </div>
    `;

    if (filtrados.length === 0) {
        contenedor.innerHTML += `<div class="col-12 text-center py-4 text-muted">No hay prestaciones registradas en esta categoría actualmente.</div>`;
        return;
    }

    filtrados.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary">${item.categoria}</span>
                        <small class="text-muted font-monospace">${item.codigo}</small>
                    </div>
                    <h5 class="card-title fw-bold text-dark">${item.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${item.detalle}</p>
                    <div class="mb-3">
                        <span class="badge bg-light text-secondary border">Especie: ${item.especie}</span>
                        <span class="badge bg-light text-secondary border">Duración: ${item.duracion}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                        <span class="fw-bold fs-5 text-dark">$${item.precio.toLocaleString('es-CL')}</span>
                        <button class="btn btn-sm btn-primary btn-agregar" data-codigo="${item.codigo}">Agregar a Reserva</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });

    document.getElementById("btn-volver-categorias").addEventListener("click", () => {
        renderizarCategoriasServicios("contenedor-servicios");
    });

    activarBotonesAgregar(filtrados);
}

// 3. Renderiza el catálogo completo de productos/farmacia (limpio, sin imágenes)
function renderizarTarjetasProductos(productos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center py-4 text-muted">No hay productos disponibles.</div>`;
        return;
    }

    productos.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary">${item.categoria}</span>
                        <small class="text-muted font-monospace">${item.codigo}</small>
                    </div>
                    <h5 class="card-title fw-bold text-dark">${item.nombre}</h5>
                    <p class="card-text text-muted small mb-2"><strong>Principio:</strong> ${item.principio || 'N/A'}</p>
                    <p class="card-text text-muted small flex-grow-1">${item.presentacion}</p>
                    <div class="mb-3">
                        <span class="badge bg-light text-secondary border">Especie: ${item.especie}</span>
                        <span class="badge bg-light text-secondary border">Stock: ${item.stock}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                        <span class="fw-bold fs-5 text-dark">$${item.precio.toLocaleString('es-CL')}</span>
                        <button class="btn btn-sm btn-primary btn-agregar" data-codigo="${item.codigo}">Agregar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });

    activarBotonesAgregar(productos);
}

function activarBotonesAgregar(fuenteDatos) {
    document.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const codigo = e.target.getAttribute("data-codigo");
            const itemEncontrado = fuenteDatos.find(i => i.codigo === codigo);
            if (itemEncontrado) {
                agregarAlStorage(itemEncontrado);
            }
        });
    });
}
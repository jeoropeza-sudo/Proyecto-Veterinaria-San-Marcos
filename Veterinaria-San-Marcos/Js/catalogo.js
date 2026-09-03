// Js/catalogo.js

function renderizarTarjetasServicios(servicios, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    servicios.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${item.categoria}</span>
                        <small class="text-muted font-monospace">${item.codigo}</small>
                    </div>
                    <h5 class="card-title fw-bold">🩺 ${item.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${item.detalle}</p>
                    <div class="mb-3">
                        <span class="badge bg-light text-dark border">Especie: ${item.especie}</span>
                        <span class="badge bg-secondary">Duración: ${item.duracion}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="fw-bold fs-5 text-success">$${item.precio.toLocaleString('es-CL')}</span>
                        <button class="btn btn-sm btn-primary btn-agregar" data-codigo="${item.codigo}">Agregar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });

    activarBotonesAgregar(servicios);
}

function renderizarTarjetasProductos(productos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    productos.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-success">${item.categoria}</span>
                        <small class="text-muted font-monospace">${item.codigo}</small>
                    </div>
                    <h5 class="card-title fw-bold">💊 ${item.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">Principio activo: <strong>${item.principio}</strong><br>${item.presentacion}</p>
                    <div class="mb-3">
                        <span class="badge bg-light text-dark border">Especie: ${item.especie}</span>
                        <span class="badge bg-warning text-dark">Stock: ${item.stock}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="fw-bold fs-5 text-success">$${item.precio.toLocaleString('es-CL')}</span>
                        <button class="btn btn-sm btn-success btn-agregar" data-codigo="${item.codigo}">Comprar</button>
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
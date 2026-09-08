const STORAGE_KEY_PRODUCTOS = "sanmarcos_productos_v1";

function obtenerProductos() {
    const almacenados = localStorage.getItem(STORAGE_KEY_PRODUCTOS);
    if (almacenados) {
        return JSON.parse(almacenados);
    } else {
        const base = typeof listaProductosOficial !== "undefined" ? listaProductosOficial : [];
        localStorage.setItem(STORAGE_KEY_PRODUCTOS, JSON.stringify(base));
        return base;
    }
}

function guardarProductos(productos) {
    localStorage.setItem(STORAGE_KEY_PRODUCTOS, JSON.stringify(productos));
    actualizarVistasProductos();
}

function renderizarTarjetasProductos(productos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (!productos || productos.length === 0) {
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
                        <span class="fw-bold fs-5 text-dark">$${Number(item.precio).toLocaleString('es-CL')}</span>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary btn-detalle" data-codigo="${item.codigo}">Ver Detalle</button>
                            <button class="btn btn-sm text-white fw-bold btn-agregar-rapido" style="background-color: #04BFAD;" data-codigo="${item.codigo}">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });

    activarBotonesDetalleProductos(productos);
    activarBotonesAgregarRapido(productos);
}

function renderizarTablaAdmin() {
    const tbody = document.getElementById("tabla-crud-productos");
    if (!tbody) return;

    const productos = obtenerProductos();
    tbody.innerHTML = "";

    productos.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="font-monospace fw-bold">${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td><span class="badge bg-secondary">${prod.categoria}</span></td>
            <td>${prod.stock}</td>
            <td>$${Number(prod.precio).toLocaleString('es-CL')}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="cargarParaEditar('${prod.codigo}')">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${prod.codigo}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form-producto-crud")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const esEdicion = document.getElementById("crud-es-edicion").value === "true";
        const codigo = document.getElementById("crud-codigo").value.trim().toUpperCase();
        const nombre = document.getElementById("crud-nombre").value.trim();
        const categoria = document.getElementById("crud-categoria").value.trim();
        const principio = document.getElementById("crud-principio").value.trim();
        const presentacion = document.getElementById("crud-presentacion").value.trim();
        const especie = document.getElementById("crud-especie").value;
        const stock = parseInt(document.getElementById("crud-stock").value);
        const precio = parseInt(document.getElementById("crud-precio").value);

        let productos = obtenerProductos();

        if (esEdicion) {
            productos = productos.map(p => p.codigo === codigo ? { codigo, nombre, categoria, principio, presentacion, especie, stock, precio } : p);
        } else {
            if (productos.some(p => p.codigo === codigo)) {
                alert("El código ingresado ya existe. Utiliza un código diferente.");
                return;
            }
            productos.push({ codigo, nombre, categoria, principio, presentacion, especie, stock, precio });
        }

        guardarProductos(productos);
        limpiarFormularioCRUD();
    });
});

function cargarParaEditar(codigo) {
    const productos = obtenerProductos();
    const prod = productos.find(p => p.codigo === codigo);
    if (!prod) return;

    document.getElementById("crud-es-edicion").value = "true";
    document.getElementById("crud-codigo").value = prod.codigo;
    document.getElementById("crud-codigo").readOnly = true;
    document.getElementById("crud-nombre").value = prod.nombre;
    document.getElementById("crud-categoria").value = prod.categoria;
    document.getElementById("crud-principio").value = prod.principio || "";
    document.getElementById("crud-presentacion").value = prod.presentacion;
    document.getElementById("crud-especie").value = prod.especie;
    document.getElementById("crud-stock").value = prod.stock;
    document.getElementById("crud-precio").value = prod.precio;

    document.getElementById("btn-guardar-crud").textContent = "Actualizar Producto";
}

function eliminarProducto(codigo) {
    if (confirm(`¿Seguro que deseas eliminar el producto ${codigo}?`)) {
        let productos = obtenerProductos();
        productos = productos.filter(p => p.codigo !== codigo);
        guardarProductos(productos);
    }
}

function limpiarFormularioCRUD() {
    document.getElementById("form-producto-crud")?.reset();
    document.getElementById("crud-es-edicion").value = "false";
    document.getElementById("crud-codigo").readOnly = false;
    document.getElementById("btn-guardar-crud").textContent = "Guardar Producto";
}

function prepararFormularioCrear() {
    limpiarFormularioCRUD();
    renderizarTablaAdmin();
}

function actualizarVistasProductos() {
    const productos = obtenerProductos();
    renderizarTarjetasProductos(productos, "contenedor-productos");
    renderizarTablaAdmin();
}

function activarBotonesDetalleProductos(productos) {
    document.querySelectorAll(".btn-detalle").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const codigo = e.target.getAttribute("data-codigo");
            const itemEncontrado = productos.find(i => i.codigo === codigo);
            
            if (itemEncontrado) {
                const itemParaDetalle = {
                    ...itemEncontrado,
                    imagen: itemEncontrado.imagen || "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop",
                    descripcion: itemEncontrado.detalle || itemEncontrado.presentacion || "Sin descripción detallada."
                };

                localStorage.setItem("producto", JSON.stringify(itemParaDetalle));
                window.location.href = "detalle-producto.html";
            }
        });
    });
}

function activarBotonesAgregarRapido(productos) {
    document.querySelectorAll(".btn-agregar-rapido").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const codigo = e.target.getAttribute("data-codigo");
            const itemEncontrado = productos.find(i => i.codigo === codigo);
            
            if (itemEncontrado) {
                if (typeof agregarItemCarrito === "function") {
                    agregarItemCarrito(itemEncontrado);
                }
                if (typeof mostrarNotificacion === "function") {
                    mostrarNotificacion(`¡${itemEncontrado.nombre} agregado a la solicitud!`);
                }
                if (typeof actualizarVistaReservaGlobal === "function") {
                    actualizarVistaReservaGlobal();
                }
                localStorage.setItem("carrito_sanmarcos", JSON.stringify(carrito));
                mostrarNotificacion(`¡${itemEncontrado.nombre} agregado al carrito!`);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("contenedor-productos")) {
        actualizarVistasProductos();
    }
});

function renderizarCategoriasServicios(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (typeof listaCategoriasServicios === "undefined") return;

    listaCategoriasServicios.forEach(cat => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img src="${cat.imagen}" class="card-img-top object-fit-cover" style="height: 200px;" alt="${cat.nombre}">
                <div class="card-body d-flex flex-column p-4">
                    <h5 class="card-title fw-bold text-dark">${cat.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${cat.desc}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                        <span class="text-muted small">Desde $${cat.desde.toLocaleString('es-CL')}</span>
                        <button class="btn btn-sm text-white fw-bold btn-ver-servicio" style="background-color: #153259;" data-id="${cat.id}">Ver Servicios</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });

    document.querySelectorAll(".btn-ver-servicio").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const catId = e.target.getAttribute("data-id");
            const catEncontrada = listaCategoriasServicios.find(c => c.id === catId);
            
            if (catEncontrada) {
                localStorage.setItem("categoriaSeleccionada", JSON.stringify(catEncontrada));
                window.location.href = "detalle-servicio.html";
            }
        });
    });
}

// Inicializador para renderizar los servicios automáticamente
document.addEventListener("DOMContentLoaded", () => {
    const contenedorServiciosCat = document.getElementById("contenedor-servicios-categorias");
    if (contenedorServiciosCat) {
        renderizarCategoriasServicios("contenedor-servicios-categorias");
    }
});

function mostrarNotificacion(mensaje) {
    const alertaExistente = document.getElementById("alerta-flotante");
    if (alertaExistente) alertaExistente.remove();

    const alerta = document.createElement("div");
    alerta.id = "alerta-flotante";
    alerta.className = "alert alert-success position-fixed bottom-0 end-0 m-4 shadow-sm border-0 text-white fw-bold";
    alerta.style.backgroundColor = "#04BFAD";
    alerta.style.zIndex = "1050";
    alerta.textContent = mensaje;

    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 2500);
}
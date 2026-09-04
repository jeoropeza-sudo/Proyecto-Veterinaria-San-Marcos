// Js/catalogo.js

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
                agregarItemCarrito({
                    codigo: itemEncontrado.codigo,
                    nombre: itemEncontrado.nombre,
                    precio: itemEncontrado.precio,
                    imagen: itemEncontrado.imagen || "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop"
                });
                mostrarNotificacion(`¡${itemEncontrado.nombre} agregado al carrito!`);
            }
        });
    });
}

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

document.addEventListener("DOMContentLoaded", () => {
    if (typeof renderizarTarjetasProductos === "function" && typeof listaProductosOficial !== "undefined") {
        const contenedorProd = document.getElementById("contenedor-productos");
        if (contenedorProd) {
            renderizarTarjetasProductos(listaProductosOficial, "contenedor-productos");
        }
    }

    const contenedorServiciosCat = document.getElementById("contenedor-servicios-categorias");
    if (contenedorServiciosCat && typeof renderizarCategoriasServicios === "function") {
        renderizarCategoriasServicios("contenedor-servicios-categorias");
    }
});
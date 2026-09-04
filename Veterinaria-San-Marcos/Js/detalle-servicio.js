document.addEventListener("DOMContentLoaded", () => {
    const categoriaGuardada = JSON.parse(localStorage.getItem("categoriaSeleccionada")) || JSON.parse(localStorage.getItem("servicio"));
    const contenedor = document.getElementById("contenedor-servicios-categoria");
    const tituloEl = document.getElementById("titulo-categoria");

    console.log("Categoría recuperada de localStorage:", categoriaGuardada);
    console.log("Lista de servicios oficial disponible:", typeof listaServiciosOficial !== "undefined" ? listaServiciosOficial : "NO CARGADA");

    if (!categoriaGuardada || !contenedor) {
        console.warn("Falta la categoría guardada o el contenedor HTML.");
        if (contenedor) {
            contenedor.innerHTML = `<div class="col-12 text-center py-4 text-muted">No se seleccionó ninguna categoría válida.</div>`;
        }
        return;
    }

    if (tituloEl) {
        tituloEl.textContent = `Servicios de: ${categoriaGuardada.nombre}`;
    }

    if (typeof listaServiciosOficial === "undefined") {
        contenedor.innerHTML = `<div class="col-12 text-center py-4 text-muted">Error: No se encontró la lista oficial de servicios (catalogo-datos.js).</div>`;
        return;
    }

    const idBuscado = (categoriaGuardada.id || categoriaGuardada.nombre || "").trim().toLowerCase();
    
    const serviciosFiltrados = listaServiciosOficial.filter(s => {
        const catServicio = (s.categoria || "").trim().toLowerCase();
        return catServicio === idBuscado;
    });

    console.log("Servicios filtrados encontrados:", serviciosFiltrados);

    if (serviciosFiltrados.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center py-4 text-muted">No hay servicios disponibles en esta categoría (ID buscado: "${idBuscado}").</div>`;
        return;
    }

    contenedor.innerHTML = "";
    serviciosFiltrados.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary">${item.especie || 'General'}</span>
                        <small class="text-muted font-monospace">${item.codigo}</small>
                    </div>
                    <h5 class="card-title fw-bold text-dark">${item.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${item.detalle || item.descripcion || 'Sin descripción'}</p>
                    <div class="mb-3">
                        <span class="badge bg-light text-secondary border">Duración: ${item.duracion || 'N/A'}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                        <span class="fw-bold fs-5 text-dark">$${item.precio.toLocaleString('es-CL')}</span>
                        <button class="btn btn-sm text-white fw-bold btn-agregar-servicio" style="background-color: #04BFAD;" data-codigo="${item.codigo}">Agregar Reserva</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });

    document.querySelectorAll(".btn-agregar-servicio").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const codigo = e.target.getAttribute("data-codigo");
            const servicioEncontrado = listaServiciosOficial.find(s => s.codigo === codigo);
            if (servicioEncontrado) {
                agregarItemCarrito({
                    codigo: servicioEncontrado.codigo,
                    nombre: servicioEncontrado.nombre,
                    precio: servicioEncontrado.precio,
                    imagen: servicioEncontrado.imagen || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop"
                });
                mostrarNotificacion(`¡${servicioEncontrado.nombre} agregado al carrito!`);
            }
        });
    });
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
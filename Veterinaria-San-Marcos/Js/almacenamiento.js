"este js se encarga de guardar los productos en la memoria del navegador para que no se borren si el usuario recarga la pagina"
"suma las cantidades , calcula el precio total y evita que se dupliquen los items en la lista(deberia hacer eso xddd)"
"muestra una lista en la pantalla y hace aparecer un cartel flotante"

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito_veterinaria")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito_veterinaria", JSON.stringify(carrito));
}

function agregarItemCarrito(item) {
    const carrito = obtenerCarrito();
    const index = carrito.findIndex(i => i.codigo === item.codigo);
    
    if (index > -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({
            codigo: item.codigo,
            nombre: item.nombre,
            precio: item.precio,
            imagen: item.imagen || "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop",
            cantidad: 1
        });
    }
    
    guardarCarrito(carrito);
}

function eliminarItemCarrito(codigo) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(i => i.codigo !== codigo);
    guardarCarrito(carrito);
}

function calcularTotalCarrito() {
    const carrito = obtenerCarrito();
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
}

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

function cambiarCantidadItem(codigo, cambio) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(i => i.codigo === codigo);
    
    if (index > -1) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito = carrito.filter(i => i.codigo !== codigo);
        }
    }
    guardarCarrito(carrito);
}

function actualizarCantidadDirecta(codigo, nuevaCantidad) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(i => i.codigo === codigo);
    const cantidad = parseInt(nuevaCantidad);
    
    if (index > -1) {
        if (isNaN(cantidad) || cantidad <= 0) {
            carrito = carrito.filter(i => i.codigo !== codigo);
        } else {
            carrito[index].cantidad = cantidad;
        }
    }
    guardarCarrito(carrito);
}

function actualizarVistaReservaGlobal() {
    const listaUI = document.getElementById("lista-reserva");
    const totalUI = document.getElementById("total-reserva");
    if (!listaUI || !totalUI) return;

    const carrito = obtenerCarrito();
    listaUI.innerHTML = "";

    if (carrito.length === 0) {
        listaUI.innerHTML = `<li class="list-group-item text-muted">No hay ítems seleccionados.</li>`;
        totalUI.textContent = "Total: $0";
        return;
    }

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div>
                <strong class="text-dark">${item.nombre}</strong> 
                <span class="badge bg-secondary ms-2">x${item.cantidad}</span>
            </div>
            <div>
                <span class="fw-bold me-3">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="quitarYRefrescar('${item.codigo}')">❌</button>
            </div>
        `;
        listaUI.appendChild(li);
    });

    const total = calcularTotalCarrito();
    totalUI.textContent = `Total: $${total.toLocaleString('es-CL')}`;
}

function quitarYRefrescar(codigo) {
    eliminarItemCarrito(codigo);
    actualizarVistaReservaGlobal();
}

function vaciarStorage() {
    guardarCarrito([]);
    actualizarVistaReservaGlobal();
    if (typeof mostrarNotificacion === "function") {
        mostrarNotificacion("Solicitud vaciada correctamente.");
    }
}
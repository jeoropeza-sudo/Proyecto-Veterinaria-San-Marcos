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
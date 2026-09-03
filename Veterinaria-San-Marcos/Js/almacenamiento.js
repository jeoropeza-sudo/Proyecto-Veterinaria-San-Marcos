// Js/almacenamiento.js

const CLAVE_STORAGE = "reserva_veterinaria_san_marcos";

function obtenerReserva() {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
}

function guardarReserva(reserva) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(reserva));
    actualizarVistaReservaGlobal();
}

function agregarAlStorage(item) {
    let reserva = obtenerReserva();
    reserva.push(item);
    guardarReserva(reserva);
}

function eliminarDelStorage(index) {
    let reserva = obtenerReserva();
    reserva.splice(index, 1);
    guardarReserva(reserva);
}

function vaciarStorage() {
    localStorage.removeItem(CLAVE_STORAGE);
    actualizarVistaReservaGlobal();
}

// Actualiza dinámicamente la interfaz del resumen en la página en la que estés
function actualizarVistaReservaGlobal() {
    const listaReserva = document.getElementById("lista-reserva") || document.getElementById("lista-carrito");
    const totalReserva = document.getElementById("total-reserva") || document.getElementById("total-carrito");
    
    if (!listaReserva || !totalReserva) return;

    const reserva = obtenerReserva();
    listaReserva.innerHTML = "";

    if (reserva.length === 0) {
        listaReserva.innerHTML = `<li class="list-group-item text-muted">No hay elementos seleccionados.</li>`;
        totalReserva.textContent = "Total: $0";
        return;
    }

    let total = 0;
    reserva.forEach((item, index) => {
        total += item.precio;
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span>${item.nombre} - <strong>$${item.precio.toLocaleString('es-CL')}</strong></span>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarItemStorage(${index})">❌</button>
        `;
        listaReserva.appendChild(li);
    });

    totalReserva.textContent = `Total: $${total.toLocaleString('es-CL')}`;
}

// Función global para que los botones de eliminar de la lista funcionen
window.eliminarItemStorage = function(index) {
    eliminarDelStorage(index);
}
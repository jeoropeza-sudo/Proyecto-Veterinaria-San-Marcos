document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();
});

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito_sanmarcos")) || [];
}

function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const tablaBody = document.getElementById("tabla-carrito");
    const subtotalEl = document.getElementById("resumen-subtotal");
    const totalEl = document.getElementById("resumen-total");

    if (!tablaBody) return;

    tablaBody.innerHTML = "";

    if (carrito.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    Tu carrito está vacío. <a href="productos.html" class="fw-bold text-decoration-none">Ver productos disponibles</a>
                </td>
            </tr>
        `;
        if (subtotalEl) subtotalEl.textContent = "$0";
        if (totalEl) totalEl.textContent = "$0";
        return;
    }

    let totalGeneral = 0;

    carrito.forEach((item, index) => {
        const cantidad = item.cantidad || 1;
        const precio = item.precio || 0;
        const subtotal = precio * cantidad;
        totalGeneral += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded me-3">
                    <div>
                        <span class="fw-bold text-dark d-block">${item.nombre}</span>
                        <small class="text-muted font-monospace">${item.codigo}</small>
                    </div>
                </div>
            </td>
            <td>$${precio.toLocaleString("es-CL")}</td>
            <td class="text-center fw-bold">${cantidad}</td>
            <td class="fw-bold">$${subtotal.toLocaleString("es-CL")}</td>
            <td class="text-center">
                <button onclick="eliminarDelCarrito(${index})" class="btn btn-outline-danger btn-sm" title="Quitar producto">
                    &times;
                </button>
            </td>
        `;
        tablaBody.appendChild(row);
    });

    if (subtotalEl) subtotalEl.textContent = `$${totalGeneral.toLocaleString("es-CL")}`;
    if (totalEl) totalEl.textContent = `$${totalGeneral.toLocaleString("es-CL")}`;
}

function eliminarDelCarrito(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1);
    localStorage.setItem("carrito_sanmarcos", JSON.stringify(carrito));
    renderizarCarrito();
}

function procesarFinalizacionCompra() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Añade productos antes de realizar la compra.");
        return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const numeroOrden = "VSM-" + Math.floor(100000 + Math.random() * 900000);

    const ordenIdEl = document.getElementById("orden-id");
    const ordenTotalEl = document.getElementById("orden-total");

    if (ordenIdEl) ordenIdEl.textContent = numeroOrden;
    if (ordenTotalEl) ordenTotalEl.textContent = `$${total.toLocaleString("es-CL")}`;

    localStorage.removeItem("carrito_sanmarcos");

    const modalElement = document.getElementById("modalCompraExitosa");
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        alert(`¡Compra realizada con éxito!\nN° Orden: ${numeroOrden}\nTotal: $${total.toLocaleString("es-CL")}`);
        window.location.href = "productos.html";
    }
}

function cerrarModalYRedirigir() {
    window.location.href = "productos.html";
}
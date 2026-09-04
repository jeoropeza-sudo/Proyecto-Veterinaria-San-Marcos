function renderizarCarrito() {
    const contenedor = document.getElementById("contenedor-carrito");
    if (!contenedor) return;
    
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-5 bg-white rounded shadow-sm d-flex flex-column justify-content-center align-items-center" style="min-height: 350px;">
                <h4 class="text-muted">Tu carrito está vacío.</h4>
                <a href="productos.html" class="btn text-white fw-bold mt-3" style="background-color: #153259;">Ir al Catálogo de Productos</a>
            </div>
        `;
        return;
    }

    let htmlTabla = `
        <div class="card shadow-sm border-0 p-4 bg-white">
            <div class="table-responsive">
                <table class="table align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Imagen</th>
                            <th>Ítem / Código</th>
                            <th>Precio</th>
                            <th style="width: 150px;">Cantidad</th>
                            <th>Subtotal</th>
                            <th class="text-end">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        htmlTabla += `
            <tr>
                <td>
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded">
                </td>
                <td>
                    <h6 class="fw-bold text-dark mb-0">${item.nombre}</h6>
                    <small class="text-muted font-monospace">${item.codigo}</small>
                </td>
                <td class="text-muted">$${item.precio.toLocaleString('es-CL')}</td>
                <td>
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary btn-disminuir" data-codigo="${item.codigo}">-</button>
                        <input type="number" class="form-control text-center input-cantidad" value="${item.cantidad}" min="1" data-codigo="${item.codigo}">
                        <button class="btn btn-outline-secondary btn-aumentar" data-codigo="${item.codigo}">+</button>
                    </div>
                </td>
                <td class="fw-bold text-dark">$${subtotal.toLocaleString('es-CL')}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger btn-eliminar" data-codigo="${item.codigo}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    const totalGeneral = calcularTotalCarrito();

    htmlTabla += `
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <a href="productos.html" class="btn btn-outline-secondary">← Seguir Comprando</a>
                <div class="text-end">
                    <h3 class="fw-bold text-dark mb-3">Total: <span class="text-primary">$${totalGeneral.toLocaleString('es-CL')}</span></h3>
                    <button class="btn text-white btn-lg px-5 fw-bold" style="background-color: #04BFAD;" onclick="alert('¡Compra/Reserva procesada con éxito! Nos pondremos en contacto.')">Confirmar Carrito</button>
                </div>
            </div>
        </div>
    `;

    contenedor.innerHTML = htmlTabla;

    document.querySelectorAll(".btn-disminuir").forEach(btn => {
        btn.addEventListener("click", (e) => {
            cambiarCantidadItem(e.target.getAttribute("data-codigo"), -1);
            renderizarCarrito();
        });
    });

    document.querySelectorAll(".btn-aumentar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            cambiarCantidadItem(e.target.getAttribute("data-codigo"), 1);
            renderizarCarrito();
        });
    });

    document.querySelectorAll(".input-cantidad").forEach(input => {
        input.addEventListener("change", (e) => {
            actualizarCantidadDirecta(e.target.getAttribute("data-codigo"), e.target.value);
            renderizarCarrito();
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            eliminarItemCarrito(e.target.getAttribute("data-codigo"));
            renderizarCarrito();
        });
    });
}

document.addEventListener("DOMContentLoaded", renderizarCarrito);
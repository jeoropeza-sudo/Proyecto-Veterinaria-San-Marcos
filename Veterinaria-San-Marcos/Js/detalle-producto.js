document.addEventListener("DOMContentLoaded", () => {
    const productoGuardado = JSON.parse(localStorage.getItem("producto"));

    if (productoGuardado) {
        const imgEl = document.getElementById("imagen");
        const nombreEl = document.getElementById("nombre");
        const precioEl = document.getElementById("precio");
        const descEl = document.getElementById("descripcion");

        if (imgEl) imgEl.src = productoGuardado.imagen;
        if (nombreEl) nombreEl.textContent = productoGuardado.nombre;
        if (precioEl) precioEl.textContent = `$${productoGuardado.precio.toLocaleString('es-CL')}`;
        if (descEl) descEl.textContent = productoGuardado.descripcion;

        const btnReservar = document.getElementById("btn-agregar-reserva");
        if (btnReservar) {
            btnReservar.addEventListener("click", () => {
                agregarItemCarrito({
                    codigo: productoGuardado.codigo,
                    nombre: productoGuardado.nombre,
                    precio: productoGuardado.precio,
                    imagen: productoGuardado.imagen
                });
                
                mostrarNotificacion(`¡${productoGuardado.nombre} agregado al carrito!`);
            });
        }
    } else {
        const mainEl = document.querySelector("main");
        if (mainEl) {
            mainEl.innerHTML = `<div class="text-center py-5"><h3>No se encontró información del producto.</h3><a href="productos.html" class="btn btn-primary mt-3">Volver al catálogo</a></div>`;
        }
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
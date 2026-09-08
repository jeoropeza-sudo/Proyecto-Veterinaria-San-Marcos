// Js/gestion-catalogo.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar LocalStorage con datos por defecto si no existen
    if (!localStorage.getItem("servicios_sanmarcos")) {
        localStorage.setItem("servicios_sanmarcos", JSON.stringify(listaServiciosOficial));
    }
    if (!localStorage.getItem("productos_sanmarcos")) {
        localStorage.setItem("productos_sanmarcos", JSON.stringify(listaProductosOficial));
    }

    // Cargar tablas al iniciar
    cargarTablaServicios();
    cargarTablaProductos();

    // Manejadores de Formularios (Submit para Crear/Editar)
    const formServicio = document.getElementById("formServicio");
    if (formServicio) {
        formServicio.addEventListener("submit", guardarServicio);
    }

    const formProducto = document.getElementById("formProducto");
    if (formProducto) {
        formProducto.addEventListener("submit", guardarProducto);
    }
});

/* ==========================================
   SECCIÓN: SERVICIOS
========================================== */

function cargarTablaServicios() {
    const tbody = document.getElementById("tabla-servicios-admin");
    if (!tbody) return;

    const servicios = JSON.parse(localStorage.getItem("servicios_sanmarcos")) || [];
    tbody.innerHTML = "";

    if (servicios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No hay servicios registrados.</td></tr>`;
        return;
    }

    servicios.forEach((srv, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="font-monospace">${srv.codigo}</td>
            <td class="fw-bold">${srv.nombre}</td>
            <td>${srv.categoria}</td>
            <td>$${Number(srv.precio).toLocaleString('es-CL')}</td>
            <td>${srv.duracion || 'N/A'}</td>
            <td><span class="badge bg-success">Activo</span></td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEditarServicio(${index})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarServicio(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function prepararNuevoServicio() {
    document.getElementById("tituloModalServicio").textContent = "Registrar Nuevo Servicio";
    document.getElementById("formServicio").reset();
    document.getElementById("indexServicioEdit").value = "";
}

function prepararEditarServicio(index) {
    document.getElementById("tituloModalServicio").textContent = "Editar Servicio";
    const servicios = JSON.parse(localStorage.getItem("servicios_sanmarcos")) || [];
    const srv = servicios[index];

    if (!srv) return;

    document.getElementById("indexServicioEdit").value = index;
    document.getElementById("codigoServicio").value = srv.codigo;
    document.getElementById("nombreServicio").value = srv.nombre;
    document.getElementById("categoriaServicio").value = srv.categoria;
    document.getElementById("precioServicio").value = srv.precio;
    document.getElementById("duracionServicio").value = srv.duracion || "";
    document.getElementById("descServicio").value = srv.detalle || "";

    const modalEl = document.getElementById("modalServicio");
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
}

function guardarServicio(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const index = document.getElementById("indexServicioEdit").value;
    const codigo = document.getElementById("codigoServicio").value;
    const nombre = document.getElementById("nombreServicio").value;
    const categoria = document.getElementById("categoriaServicio").value;
    const precio = Number(document.getElementById("precioServicio").value);
    const duracion = document.getElementById("duracionServicio").value;
    const detalle = document.getElementById("descServicio").value;

    let servicios = JSON.parse(localStorage.getItem("servicios_sanmarcos")) || [];
    const nuevoObjeto = { codigo, categoria, nombre, especie: "General", duracion, precio, detalle };

    if (index === "") {
        servicios.push(nuevoObjeto);
    } else {
        servicios[index] = nuevoObjeto;
    }

    localStorage.setItem("servicios_sanmarcos", JSON.stringify(servicios));
    cargarTablaServicios();

    const modalEl = document.getElementById("modalServicio");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    form.reset();
    form.classList.remove("was-validated");
}

function eliminarServicio(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
        let servicios = JSON.parse(localStorage.getItem("servicios_sanmarcos")) || [];
        servicios.splice(index, 1);
        localStorage.setItem("servicios_sanmarcos", JSON.stringify(servicios));
        cargarTablaServicios();
    }
}


/* ==========================================
   SECCIÓN: PRODUCTOS (SIN STOCK)
========================================== */

function cargarTablaProductos() {
    const tbody = document.getElementById("tabla-productos-admin");
    if (!tbody) return;

    const productos = JSON.parse(localStorage.getItem("productos_sanmarcos")) || [];
    tbody.innerHTML = "";

    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay productos registrados.</td></tr>`;
        return;
    }

    productos.forEach((prod, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="font-monospace">${prod.codigo}</td>
            <td class="fw-bold">${prod.nombre}</td>
            <td>${prod.categoria}</td>
            <td>$${Number(prod.precio).toLocaleString('es-CL')}</td>
            <td><span class="badge bg-success">Disponible</span></td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEditarProducto(${index})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function prepararNuevoProducto() {
    document.getElementById("tituloModalProducto").textContent = "Registrar Nuevo Producto";
    document.getElementById("formProducto").reset();
    document.getElementById("indexProductoEdit").value = "";
}

function prepararEditarProducto(index) {
    document.getElementById("tituloModalProducto").textContent = "Editar Producto";
    const productos = JSON.parse(localStorage.getItem("productos_sanmarcos")) || [];
    const prod = productos[index];

    if (!prod) return;

    document.getElementById("indexProductoEdit").value = index;
    document.getElementById("codigoProducto").value = prod.codigo;
    document.getElementById("nombreProducto").value = prod.nombre;
    document.getElementById("categoriaProducto").value = prod.categoria;
    document.getElementById("precioProducto").value = prod.precio;
    document.getElementById("imagenProducto").value = prod.imagen || "";

    const modalEl = document.getElementById("modalProducto");
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
}

function guardarProducto(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const index = document.getElementById("indexProductoEdit").value;
    const codigo = document.getElementById("codigoProducto").value;
    const nombre = document.getElementById("nombreProducto").value;
    const categoria = document.getElementById("categoriaProducto").value;
    const precio = Number(document.getElementById("precioProducto").value);
    const imagen = document.getElementById("imagenProducto").value;

    let productos = JSON.parse(localStorage.getItem("productos_sanmarcos")) || [];
    
    let nuevoObjeto;
    if (index !== "" && productos[index]) {
        nuevoObjeto = {
            ...productos[index],
            codigo,
            categoria,
            nombre,
            precio,
            imagen
        };
        productos[index] = nuevoObjeto;
    } else {
        nuevoObjeto = {
            codigo,
            categoria,
            nombre,
            principio: "General",
            presentacion: "Unidad",
            especie: "General",
            precio,
            imagen: imagen || "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop"
        };
        productos.push(nuevoObjeto);
    }

    localStorage.setItem("productos_sanmarcos", JSON.stringify(productos));
    cargarTablaProductos();

    const modalEl = document.getElementById("modalProducto");
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();
    
    form.reset();
    form.classList.remove("was-validated");
}

function eliminarProducto(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        let productos = JSON.parse(localStorage.getItem("productos_sanmarcos")) || [];
        productos.splice(index, 1);
        localStorage.setItem("productos_sanmarcos", JSON.stringify(productos));
        cargarTablaProductos();
    }
}
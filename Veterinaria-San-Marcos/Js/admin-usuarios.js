// Cargar desde LocalStorage o usar datos de prueba iniciales
let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  { run: "19876543K", nombre: "Carlos Mendoza", correo: "carlos@sanmarcos.cl", password: "123", rol: "Administrador", comuna: "Rancagua" },
  { run: "154328765", nombre: "Dra. María Lopez", correo: "mlopez@sanmarcos.cl", password: "123", rol: "Administrador", comuna: "Machalí" }
];

document.addEventListener("DOMContentLoaded", () => {
  renderizarTablaUsuarios();
  
  if (typeof cargarRegiones === "function") {
    cargarRegiones();
  }

  const form = document.getElementById("form-usuario");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validarFormulario()) {
        agregarUsuario();
      }
    });
  }
});

function renderizarTablaUsuarios() {
  const tbody = document.getElementById("tabla-usuarios");
  tbody.innerHTML = "";

  listaUsuarios.forEach((usuario, index) => {
    const fila = document.createElement("tr");
    
    let badgeClass = "bg-secondary";
    if (usuario.rol === "Administrador") badgeClass = "bg-danger";
    if (usuario.rol === "Recepcionista") badgeClass = "bg-info text-dark";
    if (usuario.rol === "Cliente") badgeClass = "bg-success";

    fila.innerHTML = `
      <td>${usuario.run}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td><span class="badge ${badgeClass}">${usuario.rol}</span></td>
      <td>${usuario.comuna}</td>
      <td>
        <button class="btn btn-outline-danger btn-sm" onclick="eliminarUsuario(${index})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

function agregarUsuario() {
  const selectComuna = document.getElementById("select-comuna");
  
  const nuevoUsuario = {
    run: document.getElementById("run").value.trim(),
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    password: document.getElementById("password").value.trim(), 
    rol: document.getElementById("rol").value,
    comuna: selectComuna.options[selectComuna.selectedIndex].text
  };

  listaUsuarios.push(nuevoUsuario);
  
  
  localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

  renderizarTablaUsuarios();
  document.getElementById("form-usuario").reset();
  alert("Usuario agregado con éxito y guardado en el sistema.");
}

function eliminarUsuario(index) {
  if (confirm("¿Desea eliminar este usuario del sistema?")) {
    listaUsuarios.splice(index, 1);
    
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    renderizarTablaUsuarios();
  }
}

function validarFormulario() {
  let esValido = true;

  const run = document.getElementById("run");
  const errorRun = document.getElementById("error-run");
  if (run.value.trim().length < 8) {
    errorRun.textContent = "Ingrese un RUN válido.";
    esValido = false;
  } else {
    errorRun.textContent = "";
  }

  const nombre = document.getElementById("nombre");
  const errorNombre = document.getElementById("error-nombre");
  if (nombre.value.trim().length < 3) {
    errorNombre.textContent = "El nombre debe tener al menos 3 caracteres.";
    esValido = false;
  } else {
    errorNombre.textContent = "";
  }

  
  const password = document.getElementById("password");
  const errorPassword = document.getElementById("error-password");
  if (password && password.value.trim().length < 4) {
    errorPassword.textContent = "La contraseña debe tener al menos 4 caracteres.";
    esValido = false;
  } else if (errorPassword) {
    errorPassword.textContent = "";
  }

  const rol = document.getElementById("rol");
  const errorRol = document.getElementById("error-rol");
  if (rol.value === "") {
    errorRol.textContent = "Seleccione un rol.";
    esValido = false;
  } else {
    errorRol.textContent = "";
  }

  const comuna = document.getElementById("select-comuna");
  const errorComuna = document.getElementById("error-comuna");
  if (comuna.value === "") {
    errorComuna.textContent = "Seleccione una comuna.";
    esValido = false;
  } else {
    errorComuna.textContent = "";
  }

  return esValido;
}
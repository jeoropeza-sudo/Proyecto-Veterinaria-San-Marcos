let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  { run: "19876543K", nombre: "Carlos", apellidos: "Mendoza Silva", correo: "carlos@sanmarcos.cl", password: "123", fechaNacimiento: "1998-05-12", rol: "Administrador", comuna: "Rancagua", direccion: "Los Alerces 456" },
  { run: "15432876-5", nombre: "María", apellidos: "Lopez Soto", correo: "mlopez@sanmarcos.cl", password: "123", fechaNacimiento: "1985-11-20", rol: "Administrador", comuna: "Machalí", direccion: "San Juan 890" }
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
        guardarOModificarUsuario();
      }
    });
  }
});

function renderizarTablaUsuarios() {
  const tbody = document.getElementById("tabla-usuarios");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (listaUsuarios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No hay usuarios registrados.</td></tr>`;
    return;
  }

  listaUsuarios.forEach((usuario, index) => {
    const fila = document.createElement("tr");
    
    let badgeClass = "bg-secondary";
    if (usuario.rol === "Administrador") badgeClass = "bg-danger";
    if (usuario.rol === "Cliente") badgeClass = "bg-success";

    const fechaNac = usuario.fechaNacimiento ? usuario.fechaNacimiento : '<span class="text-muted small font-italic">No registra</span>';

    fila.innerHTML = `
      <td class="ps-4 fw-medium">${usuario.run}</td>
      <td>${usuario.nombre} ${usuario.apellidos || ''}</td>
      <td>${usuario.correo}</td>
      <td>${fechaNac}</td>
      <td><span class="badge ${badgeClass}">${usuario.rol}</span></td>
      <td>
        <div class="text-dark small">${usuario.direccion || 'Sin dirección'}</div>
        <div class="text-muted" style="font-size: 0.75rem;">${usuario.comuna}</div>
      </td>
      <td class="text-center pe-4">
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-outline-primary btn-sm fw-bold px-2 py-1" onclick="prepararEditarUsuario(${index})" title="Editar usuario"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn btn-outline-danger btn-sm fw-bold px-2 py-1" onclick="eliminarUsuario(${index})" title="Eliminar usuario"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

function validarRunChileno(rutCompleto) {
  rutCompleto = rutCompleto.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
  if (rutCompleto.length < 2) return false;

  let cuerpo = rutCompleto.slice(0, -1);
  let dv = rutCompleto.slice(-1);

  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  let dvEsperado = 11 - (suma % 11);
  let dvCalculado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dvCalculado === dv;
}

function guardarOModificarUsuario() {
  const selectComuna = document.getElementById("select-comuna");
  const indexEdit = document.getElementById("indexUsuarioEdit").value;
  
  let passwordAsignada = document.getElementById("password").value.trim();
  if (indexEdit !== "" && !passwordAsignada) {
    passwordAsignada = listaUsuarios[indexEdit].password || "123";
  }

  const datosUsuario = {
    run: document.getElementById("run").value.trim().toUpperCase(),
    nombre: document.getElementById("nombre").value.trim(),
    apellidos: document.getElementById("apellidos").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    password: passwordAsignada,
    fechaNacimiento: document.getElementById("fechaNacimiento").value,
    rol: document.getElementById("rol").value,
    comuna: selectComuna.options[selectComuna.selectedIndex].text,
    direccion: document.getElementById("direccion").value.trim()
  };

  if (indexEdit === "") {
    listaUsuarios.push(datosUsuario);
    mostrarAlertaFlotante("¡Usuario registrado con éxito!");
  } else {
    listaUsuarios[indexEdit] = datosUsuario;
    mostrarAlertaFlotante("¡Usuario actualizado correctamente!");
  }
  
  localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
  renderizarTablaUsuarios();
  prepararNuevoUsuario();
}

function prepararEditarUsuario(index) {
  const usuario = listaUsuarios[index];
  if (!usuario) return;

  document.getElementById("indexUsuarioEdit").value = index;
  document.getElementById("run").value = usuario.run;
  document.getElementById("nombre").value = usuario.nombre;
  document.getElementById("apellidos").value = usuario.apellidos || "";
  document.getElementById("correo").value = usuario.correo;
  document.getElementById("password").value = usuario.password || "";
  document.getElementById("fechaNacimiento").value = usuario.fechaNacimiento || "";
  document.getElementById("rol").value = usuario.rol;
  document.getElementById("direccion").value = usuario.direccion || "";


  const selectComuna = document.getElementById("select-comuna");
  if (selectComuna) {
    setTimeout(() => {
      for (let i = 0; i < selectComuna.options.length; i++) {
        if (selectComuna.options[i].text === usuario.comuna) {
          selectComuna.selectedIndex = i;
          break;
        }
      }
    }, 150);
  }


  const headerForm = document.getElementById("header-form");
  headerForm.style.backgroundColor = "#D97706";
  document.getElementById("tituloModalUsuario").innerHTML = `<i class="fa-solid fa-user-pen me-2"></i>Modificando Usuario: ${usuario.nombre} ${usuario.apellidos || ''}`;
  document.getElementById("btn-cancelar-edicion").classList.remove("d-none");
  document.getElementById("btn-guardar-usuario").textContent = "Actualizar Cambios";
  document.getElementById("btn-guardar-usuario").style.backgroundColor = "#D97706";

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prepararNuevoUsuario() {
  const form = document.getElementById("form-usuario");
  if (form) form.reset();

  document.getElementById("indexUsuarioEdit").value = "";
  

  const headerForm = document.getElementById("header-form");
  headerForm.style.backgroundColor = "#153259";
  document.getElementById("tituloModalUsuario").innerHTML = `<i class="fa-solid fa-user-plus me-2"></i>Registrar Nuevo Usuario`;
  document.getElementById("btn-cancelar-edicion").classList.add("d-none");
  document.getElementById("btn-guardar-usuario").textContent = "Guardar Usuario";
  document.getElementById("btn-guardar-usuario").style.backgroundColor = "#04BFAD";

  ["error-run", "error-nombre", "error-apellidos", "error-correo", "error-password", "error-rol", "error-comuna", "error-direccion"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

function eliminarUsuario(index) {
  if (confirm("¿Desea eliminar este usuario del sistema?")) {
    listaUsuarios.splice(index, 1);
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    renderizarTablaUsuarios();
    prepararNuevoUsuario();
    mostrarAlertaFlotante("Usuario eliminado correctamente.");
  }
}

function validarFormulario() {
  let esValido = true;

  const runInput = document.getElementById("run");
  const errorRun = document.getElementById("error-run");
  const valorRun = runInput.value.trim();
  if (valorRun === "") {
    errorRun.textContent = "El RUN es obligatorio.";
    esValido = false;
  } else if (!validarRunChileno(valorRun)) {
    errorRun.textContent = "RUN inválido o dígito verificador incorrecto (ingrese sin puntos ni guion).";
    esValido = false;
  } else {
    errorRun.textContent = "";
  }

  const nombre = document.getElementById("nombre");
  const errorNombre = document.getElementById("error-nombre");
  if (nombre.value.trim() === "" || nombre.value.length > 50) {
    errorNombre.textContent = "El nombre es obligatorio y máximo 50 caracteres.";
    esValido = false;
  } else {
    errorNombre.textContent = "";
  }

  const apellidos = document.getElementById("apellidos");
  const errorApellidos = document.getElementById("error-apellidos");
  if (apellidos.value.trim() === "" || apellidos.value.length > 100) {
    errorApellidos.textContent = "Los apellidos son obligatorios y máximo 100 caracteres.";
    esValido = false;
  } else {
    errorApellidos.textContent = "";
  }

  const correo = document.getElementById("correo");
  const errorCorreo = document.getElementById("error-correo");
  if (correo.value.trim() === "" || correo.value.length > 100 || !correo.value.includes("@")) {
    errorCorreo.textContent = "Correo obligatorio, formato válido y máx. 100 caracteres.";
    esValido = false;
  } else {
    errorCorreo.textContent = "";
  }


  const password = document.getElementById("password");
  const errorPassword = document.getElementById("error-password");
  if (password.value.trim().length < 4) {
    errorPassword.textContent = "La contraseña debe tener al menos 4 caracteres.";
    esValido = false;
  } else {
    errorPassword.textContent = "";
  }

  const rol = document.getElementById("rol");
  const errorRol = document.getElementById("error-rol");
  if (rol.value === "") {
    errorRol.textContent = "Seleccione un tipo de usuario.";
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

  const direccion = document.getElementById("direccion");
  const errorDireccion = document.getElementById("error-direccion");
  if (direccion.value.trim() === "" || direccion.value.length > 300) {
    errorDireccion.textContent = "La dirección es obligatoria y máximo 300 caracteres.";
    esValido = false;
  } else {
    errorDireccion.textContent = "";
  }

  return esValido;
}

function mostrarAlertaFlotante(mensaje) {
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
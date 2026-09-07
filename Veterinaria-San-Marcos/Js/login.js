document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");

  // Script rápido para crear usuarios de prueba SOLO si no existen
  if (!localStorage.getItem("usuarios")) {
    const usuariosDePrueba = [
      {
        nombre: "Administrador Test",
        correo: "admin@correo.cl",
        password: "123",
        rol: "Administrador"
      },
      {
        nombre: "Cliente Test",
        correo: "cliente@correo.cl",
        password: "123",
        rol: "Cliente"
      }
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuariosDePrueba));
    console.log("¡Usuarios de prueba creados exitosamente!");
  }

  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const correo = document.getElementById("login-correo").value.trim();
      const password = document.getElementById("login-pass").value.trim();
      const errorCorreo = document.getElementById("error-login-correo");
      const errorPass = document.getElementById("error-login-pass");

      // Limpiar errores previos
      errorCorreo.textContent = "";
      errorPass.textContent = "";

      // 1. Obtener usuarios desde LocalStorage
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      // 2. Buscar coincidencia
      const usuarioValido = usuarios.find(
        (u) => u.correo === correo && u.password === password
      );

      if (usuarioValido) {
        // 3. Guardar la sesión activa
        localStorage.setItem("usuarioSesion", JSON.stringify(usuarioValido));
        
        alert(`¡Bienvenido/a, ${usuarioValido.nombre || "Usuario"}!`);

        // Redirigir según el rol o al inicio
        if (usuarioValido.rol === "Administrador") {
          window.location.href = "../Admin/usuarios.html";
        } else {
          window.location.href = "../index.html";
        }
      } else {
        errorCorreo.textContent = "El correo o la contraseña son incorrectos.";
      }
    });
  }
});
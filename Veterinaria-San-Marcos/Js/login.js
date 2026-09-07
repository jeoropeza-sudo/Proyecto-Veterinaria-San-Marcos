document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");

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
          window.location.href = "../admin/index.html";
        } else {
          window.location.href = "../index.html";
        }
      } else {
        errorCorreo.textContent = "El correo o la contraseña son incorrectos.";
      }
    });
  }
});
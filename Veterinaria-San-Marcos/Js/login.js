document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");

  if (!localStorage.getItem("usuarios")) {
    const usuariosDePrueba = [
      {
        nombre: "Administrador Test",
        correo: "admin@correo.cl",
        password: "123",
        contrasena: "123",
        pass: "123",
        rol: "Administrador"
      },
      {
        nombre: "Cliente Test",
        correo: "cliente@correo.cl",
        password: "123",
        contrasena: "123",
        pass: "123",
        rol: "Cliente"
      }
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuariosDePrueba));
  }

  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const correo = document.getElementById("login-correo").value.trim().toLowerCase();
      const password = document.getElementById("login-pass").value.trim();
      const errorCorreo = document.getElementById("error-login-correo");
      const errorPass = document.getElementById("error-login-pass");

      if (errorCorreo) errorCorreo.textContent = "";
      if (errorPass) errorPass.textContent = "";

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const usuarioValido = usuarios.find((u) => {
        const correoCoincide = u.correo.toLowerCase() === correo;
        const passCoincide = u.password === password || u.contrasena === password || u.pass === password;
        return correoCoincide && passCoincide;
      });

      if (usuarioValido) {
        const datosSesion = {
          nombre: usuarioValido.nombre,
          correo: usuarioValido.correo,
          rol: usuarioValido.rol || (usuarioValido.correo === "admin@correo.cl" ? "Administrador" : "Cliente")
        };

        localStorage.setItem("usuarioSesion", JSON.stringify(datosSesion));
        localStorage.setItem("usuarioActivo", JSON.stringify(datosSesion));

        alert(`¡Bienvenido/a, ${usuarioValido.nombre || "Usuario"}!`);

        if (datosSesion.rol === "Administrador") {
          window.location.href = "../Admin/index.html";
        } else {
          window.location.href = "../index.html";
        }
      } else {
        if (errorCorreo) {
          errorCorreo.textContent = "El correo o la contraseña son incorrectos.";
        } else {
          alert("El correo o la contraseña son incorrectos.");
        }
      }
    });
  }
});
window.addEventListener("load", () => {
    const formRegistro = document.getElementById("form-registro");

    if (!formRegistro) return;

    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("registro-nombre")?.value.trim();
        const email = document.getElementById("registro-correo")?.value.trim().toLowerCase();
        const password = document.getElementById("registro-pass")?.value.trim();
        const confirmPassword = document.getElementById("registro-confirm-pass")?.value.trim();

        const errorPass = document.getElementById("error-registro-confirm-pass");
        if (errorPass) errorPass.textContent = "";

        if (password !== confirmPassword) {
            if (errorPass) errorPass.textContent = "Las contraseñas no coinciden.";
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios_sanmarcos")) || [];

        const existe = usuarios.some(u => u.email === email);
        if (existe) {
            alert("Este correo electrónico ya se encuentra registrado.");
            return;
        }

        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombre,
            email: email,
            password: password,
            rol: "cliente"
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios_sanmarcos", JSON.stringify(usuarios));

        alert("¡Registro exitoso! Redirigiendo al inicio de sesión...");
        window.location.href = "login.html";
    });
});
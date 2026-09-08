document.addEventListener('DOMContentLoaded', () => {
  if (typeof cargarRegiones === 'function') {
    cargarRegiones();
  }

  const form = document.getElementById('form-registro');
  const runInput = document.getElementById('registro-run');
  const nombreInput = document.getElementById('registro-nombre');
  const apellidosInput = document.getElementById('registro-apellidos');
  const correoInput = document.getElementById('registro-correo');
  const fechaNacInput = document.getElementById('registro-fecha-nac');
  const regionSelect = document.getElementById('select-region');
  const comunaSelect = document.getElementById('select-comuna');
  const direccionInput = document.getElementById('registro-direccion');
  const passInput = document.getElementById('registro-pass');
  const confirmPassInput = document.getElementById('registro-confirm-pass');

  function validarRut(rut) {
    rut = rut.trim().toUpperCase();
    if (!/^[0-9]+[0-9K]$/.test(rut)) return false;
    if (rut.length < 8) return false;

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvCalc = '';

    if (dvEsperado === 11) dvCalc = '0';
    else if (dvEsperado === 10) dvCalc = 'K';
    else dvCalc = dvEsperado.toString();

    return dv === dvCalc;
  }

  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function limpiarErrores() {
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(msg => msg.textContent = '');
  }

  function mostrarError(idElemento, mensaje) {
    const elem = document.getElementById(idElemento);
    if (elem) elem.textContent = mensaje;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    limpiarErrores();
    let esValido = true;

    if (!validarRut(runInput.value)) {
      mostrarError('error-registro-run', 'RUN inválido. Ingrésalo sin puntos ni guion (ej: 19012345K).');
      esValido = false;
    }

    if (!nombreInput.value.trim() || nombreInput.value.trim().length > 50) {
      mostrarError('error-registro-nombre', 'El nombre es obligatorio y no debe superar 50 caracteres.');
      esValido = false;
    }

    if (!apellidosInput.value.trim() || apellidosInput.value.trim().length > 100) {
      mostrarError('error-registro-apellidos', 'Los apellidos son obligatorios y no deben superar 100 caracteres.');
      esValido = false;
    }

    if (!validarEmail(correoInput.value) || correoInput.value.length > 100) {
      mostrarError('error-registro-correo', 'Correo inválido o supera los 100 caracteres.');
      esValido = false;
    }

    if (regionSelect.value === "") {
      mostrarError('error-registro-region', 'Debe seleccionar una región.');
      esValido = false;
    }

    if (comunaSelect.value === "") {
      mostrarError('error-registro-comuna', 'Debe seleccionar una comuna.');
      esValido = false;
    }

    if (!direccionInput.value.trim() || direccionInput.value.trim().length > 300) {
      mostrarError('error-registro-direccion', 'La dirección es obligatoria y no debe superar 300 caracteres.');
      esValido = false;
    }

    if (passInput.value.length < 4 || passInput.value.length > 10) {
      mostrarError('error-registro-pass', 'La contraseña debe tener entre 4 y 10 caracteres.');
      esValido = false;
    }

    if (confirmPassInput.value !== passInput.value) {
      mostrarError('error-registro-confirm-pass', 'Las contraseñas no coinciden.');
      esValido = false;
    }

    if (esValido) {
      const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];

      const existeUsuario = usuariosGuardados.some(u => u.run === runInput.value.trim().toUpperCase() || u.correo === correoInput.value.trim());

      if (existeUsuario) {
        mostrarError('error-registro-run', 'El RUN o correo ya se encuentra registrado.');
        return;
      }

      const textoRegionSeleccionada = regionSelect.options[regionSelect.selectedIndex].text;

      const nuevoUsuario = {
        run: runInput.value.trim().toUpperCase(),
        nombre: nombreInput.value.trim(),
        apellidos: apellidosInput.value.trim(),
        correo: correoInput.value.trim(),
        fechaNacimiento: fechaNacInput.value,
        region: textoRegionSeleccionada,
        comuna: comunaSelect.value,
        direccion: direccionInput.value.trim(),
        password: passInput.value
      };

      usuariosGuardados.push(nuevoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));

      alert('Registro completado con éxito.');
      form.reset();
      comunaSelect.innerHTML = '<option value="">Seleccione Comuna</option>';
    }
  });
});
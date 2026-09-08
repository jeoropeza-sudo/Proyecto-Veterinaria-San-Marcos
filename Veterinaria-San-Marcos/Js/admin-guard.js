(function () {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo')) || JSON.parse(localStorage.getItem('usuarioSesion'));

  if (!usuario || usuario.rol !== 'Administrador') {
    alert('Acceso no autorizado.');
    window.location.replace('../Paginas/login.html');
  }
})();
document.addEventListener("DOMContentLoaded", () => {
    console.log("=== SCRIPT CARGADO CORRECTAMENTE ===");

    function cargarComponente(id, archivo) {
        console.log(`Intentando buscar: ${archivo} para el ID: ${id}`);
        fetch(archivo)
            .then(respuesta => {
                console.log(`Respuesta de ${archivo}: Status ${respuesta.status}`);
                if (!respuesta.ok) {
                    throw new Error(`No se encontró el archivo ${archivo} (Status ${respuesta.status})`);
                }
                return respuesta.text();
            })
            .then(datos => {
                const contenedor = document.getElementById(id);
                if (contenedor) {
                    contenedor.innerHTML = datos;
                    console.log(`✅ ¡EXITO! Se inyectó ${archivo} en #${id}`);
                } else {
                    console.error(`❌ ERROR: No existe la etiqueta <div id="${id}"></div> en tu HTML.`);
                }
            })
            .catch(error => console.error(`❌ ERROR FETCH:`, error.message));
    }

    cargarComponente('header-contenedor', 'header.html');
    cargarComponente('footer-contenedor', 'footer.html');
});
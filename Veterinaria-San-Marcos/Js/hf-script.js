document.addEventListener("DOMContentLoaded", () => {
    // Lee la ruta exacta directamente desde la etiqueta script en el HTML
    const scriptTag = document.getElementById("script-hf");
    const rutaBase = scriptTag ? scriptTag.getAttribute("data-base") : "./";

    function cargarComponente(id, archivo) {
        fetch(rutaBase + archivo)
            .then(res => {
                if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
                return res.text();
            })
            .then(html => {
                const contenedor = document.getElementById(id);
                if (contenedor) {
                    // Corrige dinámicamente imágenes y enlaces usando la ruta que dictó el HTML
                    contenedor.innerHTML = html
                        .replaceAll('src="Imagenes/', `src="${rutaBase}Imagenes/`)
                        .replaceAll('href="Index.html"', `href="${rutaBase}Index.html"`)
                        .replaceAll('href="Paginas/', `href="${rutaBase}Paginas/`);
                }
            })
            .catch(err => console.error(`Fallo al cargar ${archivo}:`, err));
    }

    cargarComponente('header-contenedor', 'header.html');
    cargarComponente('footer-contenedor', 'footer.html');
});
document.addEventListener("DOMContentLoaded", () => {
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
                    contenedor.innerHTML = html
                        .replaceAll('src="Imagenes/', `src="${rutaBase}Imagenes/`)
                        .replaceAll('href="index.html"', `href="${rutaBase}index.html"`)
                        .replaceAll('href="Paginas/', `href="${rutaBase}Paginas/`);
                }
            })
            .catch(err => console.error(`Fallo al cargar ${archivo}:`, err));
    }

    cargarComponente('header-contenedor', 'header.html');
    cargarComponente('footer-contenedor', 'footer.html');
});
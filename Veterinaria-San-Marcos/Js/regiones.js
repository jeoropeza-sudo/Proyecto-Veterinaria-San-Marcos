const regionesYComunas = [
  {
    region: "Región del Libertador General Bernardo O'Higgins",
    comunas: ["Rancagua", "Machalí", "Graneros", "Rengo", "San Fernando"]
  },
  {
    region: "Región Metropolitana",
    comunas: ["Santiago", "Quilicura", "Maipú", "Providencia", "Las Condes"]
  },
  {
    region: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"]
  }
];

function cargarRegiones() {
  const selectRegion = document.getElementById("select-region");
  const selectComuna = document.getElementById("select-comuna");
  if (!selectRegion || !selectComuna) return;

  // Cargar Regiones
  regionesYComunas.forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = item.region;
    selectRegion.appendChild(opt);
  });

  // Al cambiar Región, cargar las Comunas correspondientes
  selectRegion.addEventListener("change", (e) => {
    selectComuna.innerHTML = '<option value="">Seleccione Comuna</option>';
    const regionIdx = e.target.value;

    if (regionIdx !== "") {
      regionesYComunas[regionIdx].comunas.forEach((comuna) => {
        const opt = document.createElement("option");
        opt.value = comuna;
        opt.textContent = comuna;
        selectComuna.appendChild(opt);
      });
    }
  });
}
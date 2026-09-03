const listaCategoriasServicios = [
    { 
        id: "Consultas", 
        nombre: "Consultas Médicas", 
        desde: 10000, 
        imagen: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop", 
        desc: "Evaluaciones clínicas preventivas, urgencias y controles generales de salud." 
    },
    { 
        id: "Vacunación", 
        nombre: "Vacunación", 
        desde: 12000, 
        imagen: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop", 
        desc: "Programas de inmunización esenciales para perros, gatos y especies exóticas." 
    },
    { 
        id: "Cirugía", 
        nombre: "Cirugías y Pabellón", 
        desde: 50000, 
        imagen: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop", 
        desc: "Esterilizaciones y procedimientos quirúrgicos bajo estrictos protocolos." 
    },
    { 
        id: "Desparasitación", 
        nombre: "Desparasitación", 
        desde: 7500, 
        imagen: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=600&auto=format&fit=crop", 
        desc: "Tratamientos especializados para el control de parásitos internos y externos." 
    },
    { 
        id: "Exámenes", 
        nombre: "Exámenes de Laboratorio", 
        desde: 22000, 
        imagen: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=600&auto=format&fit=crop", 
        desc: "Hemogramas, perfiles bioquímicos e imagenología diagnóstica avanzada." 
    },
    { 
        id: "Otros", 
        nombre: "Otros Servicios", 
        desde: 5000, 
        imagen: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=600&auto=format&fit=crop", 
        desc: "Procedimientos de higiene, mantención estética y microchip de identidad." 
    }
];

const listaServiciosOficial = [

    { codigo: "SV001", categoria: "Consultas", nombre: "Consulta general", especie: "Perro / Gato", duracion: "30 min", precio: 15000, detalle: "Evaluación clínica general y control de signos vitales." },
    { codigo: "SV002", categoria: "Consultas", nombre: "Consulta urgencia", especie: "Perro / Gato", duracion: "30 min", precio: 25000, detalle: "Atención prioritaria fuera de horario o malestar agudo." },
    { codigo: "SV003", categoria: "Consultas", nombre: "Control postoperatorio", especie: "Perro / Gato", duracion: "20 min", precio: 10000, detalle: "Revisión de heridas y evolución quirúrgica." },
    { codigo: "SV004", categoria: "Consultas", nombre: "Consulta ave / conejo", especie: "Ave / Conejo", duracion: "30 min", precio: 18000, detalle: "Medicina especializada para mascotas exóticas." },
    { codigo: "SV005", categoria: "Consultas", nombre: "Segunda opinión médica", especie: "Todas", duracion: "40 min", precio: 20000, detalle: "Evaluación integral de diagnósticos complejos previos." },
    
    { codigo: "VA001", categoria: "Vacunación", nombre: "Vacuna antirrábica canina", especie: "Perro", duracion: "10 min", precio: 12000, detalle: "Inmunización obligatoria por ley." },
    { codigo: "VA002", categoria: "Vacunación", nombre: "Vacuna sextuple canina", especie: "Perro", duracion: "10 min", precio: 18000, detalle: "Protección frente a múltiples enfermedades víricas." },
    { codigo: "VA003", categoria: "Vacunación", nombre: "Vacuna bivalente felina", especie: "Gato", duracion: "10 min", precio: 15000, detalle: "Inmunización preventiva para gatos." },
    { codigo: "VA004", categoria: "Vacunación", nombre: "Vacuna triple felina", especie: "Gato", duracion: "10 min", precio: 17000, detalle: "Refuerzo anual obligatorio felino." },
    { codigo: "VA005", categoria: "Vacunación", nombre: "Vacuna Bordetella canina", especie: "Perro", duracion: "10 min", precio: 14000, detalle: "Prevención de tos de las perreras." },

    { codigo: "CI001", categoria: "Cirugía", nombre: "Esterilización hembra canina", especie: "Perra", duracion: "90 min", precio: 80000, detalle: "Incluye anestesia y hospitalización 24h." },
    { codigo: "CI002", categoria: "Cirugía", nombre: "Esterilización macho canino", especie: "Perro", duracion: "60 min", precio: 60000, detalle: "Control reproductivo con anestesia incluida." },
    { codigo: "CI003", categoria: "Cirugía", nombre: "Esterilización hembra felina", especie: "Gata", duracion: "60 min", precio: 65000, detalle: "Incluye anestesia y hospitalización 12h." },
    { codigo: "CI004", categoria: "Cirugía", nombre: "Esterilización macho felino", especie: "Gato", duracion: "45 min", precio: 50000, detalle: "Control reproductivo felino seguro." },
    { codigo: "CI005", categoria: "Cirugía", nombre: "Extirpación de tumor cutáneo", especie: "Perro / Gato", duracion: "60 min", precio: 120000, detalle: "Precio referencial; varía según tamaño." },
    { codigo: "CI006", categoria: "Cirugía", nombre: "Cesárea de urgencia", especie: "Perra / Gata", duracion: "120 min", precio: 180000, detalle: "Intervención quirúrgica de emergencia." },

    { codigo: "DE001", categoria: "Desparasitación", nombre: "Desparasitación interna pequeños (<10 kg)", especie: "Perro", duracion: "5 min", precio: 8000, detalle: "Tratamiento contra parásitos internos." },
    { codigo: "DE002", categoria: "Desparasitación", nombre: "Desparasitación interna medianos (10-25 kg)", especie: "Perro", duracion: "5 min", precio: 9500, detalle: "Tratamiento en comprimido." },
    { codigo: "DE003", categoria: "Desparasitación", nombre: "Desparasitación interna grandes (>25 kg)", especie: "Perro", duracion: "5 min", precio: 11000, detalle: "Tratamiento especializado." },
    { codigo: "DE004", categoria: "Desparasitación", nombre: "Desparasitación interna felina", especie: "Gato", duracion: "5 min", precio: 8000, detalle: "Control de parásitos para gatos." },
    { codigo: "DE005", categoria: "Desparasitación", nombre: "Antiparasitario externo (pipeta)", especie: "Perro / Gato", duracion: "5 min", precio: 7500, detalle: "Incluye aplicación contra pulgas y garrapatas." },

    { codigo: "EX001", categoria: "Exámenes", nombre: "Hemograma completo", especie: "Perro / Gato", duracion: "30 min", precio: 22000, detalle: "Resultado en 24-48 h." },
    { codigo: "EX002", categoria: "Exámenes", nombre: "Perfil bioquímico completo", especie: "Perro / Gato", duracion: "30 min", precio: 35000, detalle: "Análisis de función orgánica." },
    { codigo: "EX003", categoria: "Exámenes", nombre: "Radiografía (1 proyección)", especie: "Perro / Gato", duracion: "20 min", precio: 28000, detalle: "Estudio imagenológico directo." },
    { codigo: "EX004", categoria: "Exámenes", nombre: "Ecografía abdominal", especie: "Perro / Gato", duracion: "30 min", precio: 45000, detalle: "Evaluación de órganos internos." },

    { codigo: "OT001", categoria: "Otros", nombre: "Corte de uñas", especie: "Perro / Gato", duracion: "15 min", precio: 5000, detalle: "Higiene y mantención estética." },
    { codigo: "OT002", categoria: "Otros", nombre: "Limpieza dental", especie: "Perro / Gato", duracion: "45 min", precio: 55000, detalle: "Requiere anestesia (ultrasonido)." },
    { codigo: "OT003", categoria: "Otros", nombre: "Microchip identificación", especie: "Perro / Gato", duracion: "10 min", precio: 15000, detalle: "Incluye registro oficial." },
    { codigo: "OT004", categoria: "Otros", nombre: "Hospitalización (por día)", especie: "Perro / Gato", duracion: "24 h", precio: 30000, detalle: "Incluye monitoreo y alimentación básica." }
];

const listaProductosOficial = [
    { codigo: "ME001", categoria: "Antibióticos", nombre: "Amoxibay 250mg", principio: "Amoxicilina", presentacion: "Blíster 10 comp.", especie: "Perro / Gato", stock: 45, precio: 4200 },
    { codigo: "ME002", categoria: "Antibióticos", nombre: "Enrox 50mg", principio: "Enrofloxacino", presentacion: "Blíster 10 comp.", especie: "Perro / Gato", stock: 30, precio: 6800 },
    { codigo: "ME004", categoria: "Antiparasitarios", nombre: "Nexgard", principio: "Afoxolaner", presentacion: "Masticable 1 unid.", especie: "Perro", stock: 60, precio: 9500 },
    { codigo: "ME005", categoria: "Antiparasitarios", nombre: "Bravecto", principio: "Fluralaner", presentacion: "Masticable 1 unid.", especie: "Perro", stock: 40, precio: 18900 },
    { codigo: "ME006", categoria: "Antiparasitarios", nombre: "Revolution Plus", principio: "Selamectina+Sarolaner", presentacion: "Pipeta 1 unid.", especie: "Gato", stock: 35, precio: 14500 },
    { codigo: "ME009", categoria: "Antiinflamatorios", nombre: "Meloxicam 1mg", principio: "Meloxicam", presentacion: "Blíster 10 comp.", especie: "Perro / Gato", stock: 55, precio: 4500 },
    { codigo: "ME013", categoria: "Dermatología", nombre: "Apoquel 16mg", principio: "Oclacitinib", presentacion: "Blíster 10 comp.", especie: "Perro", stock: 18, precio: 22000 },
    { codigo: "ME018", categoria: "Vacunas", nombre: "Nobivac DHPPi", principio: "Vacuna polivalente", presentacion: "Vial 1 dosis", especie: "Perro", stock: 48, precio: 8500 },
    { codigo: "ME022", categoria: "Suplementos", nombre: "Condrovet forte", principio: "Condroitín+Glucosamina", presentacion: "Blíster 30 comp.", especie: "Perro", stock: 25, precio: 14500 }
];
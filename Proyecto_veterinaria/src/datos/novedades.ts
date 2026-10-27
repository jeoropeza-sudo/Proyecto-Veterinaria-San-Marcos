export interface Novedad {
  codigo: string;
  etiqueta: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string;
  textoAlternativo: string;
  rutaRelacionada: string;
  textoEnlace: string;
}

export const novedades: Novedad[] = [
  {
    codigo: 'atencion-domicilio',
    etiqueta: 'Nuevo servicio',
    titulo: 'Atención veterinaria a domicilio',
    resumen: 'Consultas y controles preventivos para tu mascota, en la comodidad de tu hogar.',
    contenido: 'Acercamos la atención veterinaria a las familias que necesitan evitar traslados o prefieren que su mascota reciba una primera evaluación en casa. La visita puede incluir examen clínico, orientación preventiva y revisión de vacunas. La disponibilidad y cobertura deben confirmarse previamente con la clínica.',
    imagen: '/imagenes/camion-domicilio.jpeg',
    textoAlternativo: 'Vehículo de atención veterinaria a domicilio',
    rutaRelacionada: '/contacto',
    textoEnlace: 'Consultar disponibilidad',
  },
  {
    codigo: 'antiparasitarios',
    etiqueta: 'Beneficio',
    titulo: 'Cuida a tu mascota de los parásitos',
    resumen: 'Conoce las alternativas de protección antiparasitaria disponibles en nuestro catálogo.',
    contenido: 'La protección frente a parásitos debe elegirse considerando la especie, el peso y las necesidades de cada mascota. Nuestro equipo puede orientarte sobre las alternativas disponibles. Consulta en la clínica las marcas, existencias y vigencia de cualquier promoción antes de realizar tu compra.',
    imagen: '/imagenes/Antiparasitario.jpeg',
    textoAlternativo: 'Producto antiparasitario para mascotas',
    rutaRelacionada: '/productos',
    textoEnlace: 'Ver productos',
  },
  {
    codigo: 'peluqueria-respetuosa',
    etiqueta: 'Bienestar',
    titulo: 'Cuidado estético con manejo respetuoso',
    resumen: 'El bienestar y la tranquilidad de cada paciente también importan durante su cuidado.',
    contenido: 'Estamos incorporando prácticas de manejo respetuoso para que las rutinas de higiene y cuidado del pelaje sean una experiencia más tranquila. Cada mascota tiene necesidades distintas; consulta con el equipo qué alternativas están disponibles y si son adecuadas para tu compañero.',
    imagen: '/imagenes/consulta.webp',
    textoAlternativo: 'Atención veterinaria enfocada en el bienestar de las mascotas',
    rutaRelacionada: '/servicios',
    textoEnlace: 'Conocer los servicios',
  },
  {
    codigo: 'comunidad-san-marcos',
    etiqueta: 'Comunidad',
    titulo: 'Comunidad San Marcos',
    resumen: 'Estamos preparando beneficios y actividades para acompañar a las familias y sus mascotas.',
    contenido: 'La comunidad de Veterinaria San Marcos busca acercar información de cuidado responsable y actividades para tutores de mascotas. Consulta en la clínica por las iniciativas vigentes, sus condiciones y las próximas actividades.',
    imagen: '/imagenes/premios de perros.jpeg',
    textoAlternativo: 'Premios para perros',
    rutaRelacionada: '/contacto',
    textoEnlace: 'Consultar en la clínica',
  },
];

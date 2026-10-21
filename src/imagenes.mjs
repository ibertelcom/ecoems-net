// Registro único de imágenes del sitio. Cada imagen tiene ya su nombre de archivo, alt, title y descripción
// definitivos. Mientras el archivo no exista en src/img/, se muestra un marcador del mismo tamaño
// (así el diseño no se mueve cuando llegue la imagen real). Reglas: sin año en la imagen ni en el nombre,
// identidad de cada escuela, formato .webp.
import { existsSync } from "node:fs";

export const IMAGENES = {
  "portada-papa-e-hija-revisan-aciertos": {
    archivo: "portada-papa-e-hija-revisan-aciertos.webp",
    ancho: 1200, alto: 1350,
    alt: "Papá y su hija de secundaria revisan en el celular cuántos aciertos pide la prepa que quieren en el ECOEMS",
    title: "Papá e hija revisando los aciertos del ECOEMS",
    descripcion: "Escena cálida en una sala de casa en la Ciudad de México: un papá y su hija de tercero de secundaria, con uniforme, miran juntos un celular con una tabla de aciertos. Luz de tarde, ambiente de confianza, sin logotipos.",
    prompt: "Fotografía realista, formato vertical 4:5. Sala de una casa de clase media en la Ciudad de México, luz cálida de tarde por la ventana. Un papá mexicano de unos 45 años y su hija de 14 años con uniforme de secundaria (suéter azul marino) están sentados juntos en un sillón mirando la pantalla de un celular; ella señala la pantalla y sonríe, él la escucha atento. Sobre la mesa, cuadernos y una guía de estudio. Sin texto legible, sin logotipos, sin fechas ni años. Paleta natural con toques de azul y verde.",
    uso: "Portada · encabezado",
  },
  "ruta-del-proceso-ecoems": {
    archivo: "ruta-del-proceso-ecoems.webp",
    ancho: 1600, alto: 900,
    alt: "Estudiantes de secundaria camino al examen ECOEMS en la Ciudad de México",
    title: "Camino al examen ECOEMS",
    descripcion: "Grupo de aspirantes con mochila caminando por una calle arbolada de la ciudad hacia una escuela, mañana temprano.",
    prompt: "Fotografía realista panorámica 16:9. Mañana temprano en una calle arbolada de la Ciudad de México; tres adolescentes de 15 años con mochila caminan hacia la entrada de una escuela de bachillerato pública genérica (sin nombre ni escudo visible). Cielo despejado, luz dorada suave. Sin texto legible, sin logotipos, sin fechas.",
    uso: "Portada · sección ¿Qué es el ECOEMS?",
  },
  "herramienta-calculadora-aciertos": {
    archivo: "herramienta-calculadora-aciertos.webp",
    ancho: 800, alto: 600,
    alt: "Calculadora de aciertos del ECOEMS: escribe los aciertos de un simulacro y ve qué escuelas le alcanzan",
    title: "Calculadora de aciertos ECOEMS",
    descripcion: "Ilustración plana de un celular con una barra de aciertos y tres escuelas marcadas como alcanzables.",
    prompt: "Ilustración plana y limpia, formato 4:3, fondo blanco grisáceo. Un celular muestra una barra horizontal de progreso y debajo tres tarjetas de escuela con una palomita verde, una con signo de igual ámbar y una con flecha. Colores: verde #0B7A60, azul #2457C5, ámbar #E2A400, vino #8C1D40. Sin texto legible, sin años.",
    uso: "Portada · herramientas",
  },
  "herramienta-mapa-escuelas": {
    archivo: "herramienta-mapa-escuelas.webp",
    ancho: 800, alto: 600,
    alt: "Mapa de preparatorias de la UNAM y vocacionales del IPN en la Ciudad de México y el Estado de México",
    title: "Mapa de escuelas del ECOEMS",
    descripcion: "Ilustración de un mapa urbano estilizado con marcadores de colores por tipo de escuela.",
    prompt: "Ilustración plana estilo mapa urbano estilizado, formato 4:3. Calles grises claras, un área verde y un cuerpo de agua; marcadores redondos en azul, ámbar y vino distribuidos por la ciudad; un marcador central más grande con una casa. Sin nombres de calles, sin texto, sin años.",
    uso: "Portada · herramientas",
  },
  "herramienta-comparador-escuelas": {
    archivo: "herramienta-comparador-escuelas.webp",
    ancho: 800, alto: 600,
    alt: "Comparador de escuelas del ECOEMS: aciertos y ubicación de dos o tres planteles lado a lado",
    title: "Comparador de escuelas ECOEMS",
    descripcion: "Ilustración de dos columnas de datos lado a lado con barras de distinta altura.",
    prompt: "Ilustración plana, formato 4:3. Dos tarjetas verticales lado a lado, cada una con un ícono de edificio escolar arriba y barras de distinta altura en azul y vino; una balanza sutil entre ambas. Fondo claro. Sin texto legible, sin años.",
    uso: "Portada · herramientas",
  },
  "herramienta-armar-opciones": {
    archivo: "herramienta-armar-opciones.webp",
    ancho: 800, alto: 600,
    alt: "Lista para ordenar las opciones de escuela del registro Mi Derecho, Mi Lugar",
    title: "Armar la lista de opciones",
    descripcion: "Ilustración de una lista ordenada de escuelas con flechas para subir y bajar.",
    prompt: "Ilustración plana, formato 4:3. Una hoja con cinco renglones de tarjetas apiladas, cada una con un punto de color (azul, ámbar, vino, verde) y flechas pequeñas de subir y bajar; una mano señala el primer renglón. Fondo claro. Sin texto legible, sin años.",
    uso: "Portada · herramientas",
  },
  "estudiar-simulador-examenes-lat": {
    archivo: "estudiar-simulador-examenes-lat.webp",
    ancho: 960, alto: 640,
    alt: "Aspirante practica con un examen simulador del ECOEMS en su computadora",
    title: "Practicar con el simulador del ECOEMS",
    descripcion: "Adolescente en su escritorio respondiendo preguntas en una laptop, con cuaderno y calculadora.",
    prompt: "Fotografía realista 3:2. Adolescente mexicano de 15 años en su escritorio de casa, concentrado, respondiendo un examen de opción múltiple en una laptop; al lado un cuaderno con operaciones y una calculadora. Luz de lámpara cálida. Pantalla sin texto legible, sin logotipos, sin años.",
    uso: "Portada · ¿qué estudiar?",
  },
};

export function imagen(id, { clase = "", prioridad = false, tamanos = "100vw" } = {}) {
  const im = IMAGENES[id];
  if (!im) throw new Error(`Imagen no registrada: ${id}`);
  const ratio = `${im.ancho} / ${im.alto}`;
  const real = existsSync(new URL(`./img/${im.archivo}`, import.meta.url));
  if (real) {
    const chica = im.archivo.replace(/\.webp$/, "-600.webp");
    const srcset = existsSync(new URL(`./img/${chica}`, import.meta.url)) ? ` srcset="/img/${chica} 600w, /img/${im.archivo} ${im.ancho}w"` : "";
    return `<img class="img ${clase}" src="/img/${im.archivo}"${srcset} width="${im.ancho}" height="${im.alto}" alt="${im.alt}" title="${im.title}" ${prioridad ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" sizes="${tamanos}">`;
  }
  return `<div class="img img-pendiente ${clase}" style="aspect-ratio:${ratio}" role="img" aria-label="${im.alt}" title="${im.title}" data-archivo="${im.archivo}"><span>${im.archivo}<small>${im.ancho}×${im.alto}</small></span></div>`;
}

// Registro de imágenes generadas por página (escuelas y hubs). Mismas reglas que el registro fijo.
export function registrar(id, datos) {
  if (!IMAGENES[id]) IMAGENES[id] = datos;
  return id;
}

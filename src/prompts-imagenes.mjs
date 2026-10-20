// Prompts para generar las imágenes de ecoems.net en ChatGPT, uno por imagen, listos para copiar y pegar.
// Reglas: texto en español escrito exacto, sin años ni fechas ni números de aciertos (cambian cada año),
// escudos oficiales permitidos donde ilustran (Victor tiene cubierto su uso).
import { ESCUELAS } from "./datos.mjs";

const PALETA = "Paleta de marca: verde #0B7A60, azul #2457C5, ámbar #E2A400, vino #8C1D40 y amarillo sol #F4B400 sobre blancos cálidos.";
const TEXTO = "Todo texto debe ir en español, escrito exactamente como se indica entre comillas, con acentos correctos y tipografía sans serif limpia y legible; no agregues ningún otro texto, ni años, ni fechas, ni números de aciertos.";
const FOTO = "Fotografía realista y natural, estilo editorial, personas mexicanas con rasgos y ropa auténticos, sin aspecto de banco de imágenes.";
const ILUS = "Ilustración vectorial plana y moderna, formas redondeadas, sombras suaves, mucho aire, estilo de app educativa premium.";

const fin = (formato, extra = "") => `${formato} ${extra} ${PALETA} ${TEXTO}`.replace(/\s+/g, " ").trim();

const FIJOS = {
  "portada-papa-e-hija-revisan-aciertos": `${FOTO} Sala de una casa de clase media en la Ciudad de México con luz cálida de tarde por la ventana. Un papá mexicano de unos 45 años y su hija de 14 años con suéter azul marino de secundaria están sentados juntos en un sillón mirando un celular; ella señala la pantalla y sonríe, él la escucha atento. En la pantalla del celular se lee arriba "Aciertos por escuela" y debajo una lista de tarjetas con los textos "Prepa 6", "CCH Sur" y "Voca 9", cada una con una barra de color. Sobre la mesa, cuadernos y una guía de estudio. ${fin("Formato vertical 4:5, sujeto a la derecha para dejar aire a la izquierda.")}`,

  "ruta-del-proceso-ecoems": `${ILUS} Mapa estilo línea del metro de la Ciudad de México que cruza la imagen de izquierda a derecha con una línea gruesa verde y seis estaciones circulares blancas con borde verde, numeradas del 1 al 6. Debajo de cada estación una etiqueta corta: "Llave MX y registro", "Elegir opciones", "Concluir registro", "Examen en línea", "Resultados", "Inscripción". La sexta estación es más grande, en amarillo sol, con una pequeña bandera. Arriba, título grande: "La ruta del ECOEMS". Al fondo, siluetas suaves de edificios de la ciudad y un pequeño grupo de estudiantes con mochila caminando sobre la línea. ${fin("Formato horizontal 16:9, fondo blanco cálido.")}`,

  "herramienta-calculadora-aciertos": `${ILUS} Un celular grande al centro muestra una barra de progreso horizontal verde y debajo tres tarjetas de escuela: la primera con palomita verde y la etiqueta "Te alcanza", la segunda con un círculo ámbar y la etiqueta "Reto", la tercera con una flecha vino y la etiqueta "Lejos". Junto al celular, una calculadora estilizada y destellos. Título arriba: "Calculadora de aciertos". ${fin("Formato horizontal 4:3, fondo gris muy claro.")}`,

  "herramienta-mapa-escuelas": `${ILUS} Mapa urbano estilizado de la Ciudad de México y el Estado de México visto desde arriba: calles gris claro, un parque verde y un lago. Marcadores redondos en azul (prepas), ámbar (CCH) y vino (vocacionales) repartidos por la ciudad, y al centro un marcador más grande con el ícono de una casa y un círculo de distancia punteado. Leyenda pequeña abajo con tres puntos de color y los textos "Prepas UNAM", "CCH UNAM" y "Vocacionales IPN". Título arriba: "Mapa de escuelas". Sin nombres de calles. ${fin("Formato horizontal 4:3.")}`,

  "herramienta-comparador-escuelas": `${ILUS} Dos tarjetas verticales lado a lado, cada una con un ícono de edificio escolar arriba; la izquierda con encabezado azul y la etiqueta "Escuela A", la derecha con encabezado vino y la etiqueta "Escuela B". Dentro de cada tarjeta tres barras horizontales de distinto largo y pequeños íconos de ubicación y de libro. Entre ambas tarjetas, una balanza dorada sutil y el símbolo "VS" en un círculo verde. Título arriba: "Comparador de escuelas". ${fin("Formato horizontal 4:3, fondo claro.")}`,

  "herramienta-armar-opciones": `${ILUS} Una hoja o pantalla con cinco tarjetas apiladas en orden, numeradas "1", "2", "3", "4" y "5", cada una con un punto de color (azul, ámbar, vino, verde, azul) y pequeñas flechas para subir y bajar a la derecha. Una mano estilizada arrastra la tarjeta número 2 hacia arriba. En la esquina, un botón verde con el texto "Copiar mi lista". Título arriba: "Arma tus opciones". ${fin("Formato horizontal 4:3, fondo claro.")}`,

  "estudiar-simulador-examenes-lat": `${FOTO} Adolescente mexicano de 15 años en su escritorio de casa, concentrado, respondiendo un examen de opción múltiple en una laptop; al lado un cuaderno con operaciones de matemáticas y una calculadora. Luz cálida de lámpara al atardecer. En la pantalla se lee arriba "Examen simulacro ECOEMS" y debajo una pregunta con cuatro opciones "A", "B", "C" y "D", con la opción "B" marcada en verde. ${fin("Formato horizontal 3:2.")}`,

  "que-es-ecoems-aspirante": `${FOTO} Una adolescente de tercero de secundaria con suéter de uniforme lee con atención en una laptop sobre la mesa del comedor; su mamá, sentada a un lado, mira la pantalla con una taza de café. En la pantalla se lee el título "¿Qué es el ECOEMS?" y debajo tres íconos sencillos: un libro, un reloj y un edificio escolar. Ambiente cálido de casa en la Ciudad de México, luz natural de mañana. ${fin("Formato horizontal 3:2.")}`,

  "mi-derecho-mi-lugar-familia": `${FOTO} Mamá, papá e hijo de secundaria sentados frente a una computadora de escritorio en casa, revisando juntos una lista de escuelas; el hijo señala la pantalla y los papás asienten. En la pantalla se ve una lista con tarjetas de colores azul, ámbar y vino con los textos "Prepa", "CCH" y "Voca". Junto al teclado, una libreta con una lista numerada escrita a mano. Ambiente cálido, luz de tarde. ${fin("Formato horizontal 3:2.")}`,

  "llave-mx-celular": `${FOTO} Una mamá mexicana de unos 40 años y su hijo de 14 años sentados juntos en la mesa de la cocina; ella sostiene un celular y él tiene en la mano una hoja impresa con su CURP. En la pantalla del celular se lee "Llave MX" sobre un formulario sencillo con un candado verde. Expresión de concentración y calma, luz natural. ${fin("Formato horizontal 3:2.")}`,

  "registro-comprobante": `${FOTO} Un papá de unos 45 años revisa una hoja impresa titulada "Comprobante de registro" con una lista ordenada de escuelas numeradas, mientras su hija de 14 años señala uno de los renglones con el dedo. Están de pie junto a una impresora en casa; sobre la mesa, un fólder azul y una pluma. Luz natural de mañana. ${fin("Formato horizontal 3:2.")}`,

  "elegir-opciones-lista": `${FOTO} Un adolescente de 15 años escribe en una libreta una lista numerada del 1 al 5 mientras mira en la computadora un mapa de la ciudad con marcadores de colores azul, ámbar y vino. En la parte superior de la libreta se lee, escrito a mano, "Mis opciones". Escritorio ordenado, luz cálida de lámpara. ${fin("Formato horizontal 3:2.")}`,

  "examen-en-linea-casa": `${FOTO} Una adolescente de 15 años sentada frente a una laptop con la cámara encendida en un escritorio despejado, en un cuarto bien iluminado y sin otras personas; solo hay una botella de agua y su identificación sobre la mesa. En la pantalla se lee "Examen en línea" y un reloj de cuenta regresiva sin números visibles. Expresión de concentración tranquila. ${fin("Formato horizontal 3:2.")}`,

  "resultados-familia-celebra": `${FOTO} Una familia mexicana frente a la computadora de casa celebra: la hija de 15 años sonríe con los brazos arriba y el papá le pone la mano en el hombro; la mamá aplaude. En la pantalla se lee "¡Resultados!" con un escudo genérico de escuela y confeti de colores. Luz cálida, emoción auténtica. ${fin("Formato horizontal 3:2.")}`,

  "no-quede-apoyo": `${FOTO} Un papá y su hijo adolescente sentados en una banca de un parque de la Ciudad de México, conversando con calma; el papá le habla con una mano en la espalda y el hijo escucha con expresión serena. Al fondo, árboles y luz dorada de tarde. En la parte superior, con buen contraste y tipografía elegante, el texto "Hay más caminos". ${fin("Formato horizontal 3:2, deja espacio limpio arriba para el texto.")}`,

  "prepas-unam-estudiantes": `${FOTO} Estudiantes de bachillerato de 15 a 17 años conversando y riendo en el patio de un plantel de la Escuela Nacional Preparatoria, con arquitectura de concreto y jardineras, luz de mañana. En la esquina superior izquierda coloca el escudo oficial de la UNAM y junto a él, en letras blancas con sombra suave, el texto "Prepas UNAM" y debajo, más pequeño, "Escuela Nacional Preparatoria". ${fin("Formato horizontal 16:9, deja la esquina superior izquierda despejada para el escudo y el texto.")}`,

  "cch-unam-estudiantes": `${FOTO} Estudiantes de bachillerato de 15 a 17 años trabajando en equipo sobre una mesa en una explanada con jardineras y edificios bajos, ambiente relajado de mañana. En la esquina superior izquierda coloca el escudo oficial del Colegio de Ciencias y Humanidades de la UNAM y junto a él, en letras blancas con sombra suave, el texto "CCH UNAM" y debajo, más pequeño, "Colegio de Ciencias y Humanidades". ${fin("Formato horizontal 16:9, deja la esquina superior izquierda despejada para el escudo y el texto.")}`,

  "vocacionales-ipn-taller": `${FOTO} Estudiantes de bachillerato tecnológico de 15 a 17 años con bata blanca trabajando en un taller o laboratorio: uno ajusta un circuito, otra observa un instrumento de medición. Detalles en color guinda. En la esquina superior izquierda coloca el escudo oficial del Instituto Politécnico Nacional y junto a él, en letras blancas con sombra suave, el texto "Vocacionales IPN" y debajo, más pequeño, "Centros de Estudios Científicos y Tecnológicos". ${fin("Formato horizontal 16:9, deja la esquina superior izquierda despejada para el escudo y el texto.")}`,
};

// Elementos visuales por área o carrera de cada vocacional.
function elementosVoca(e) {
  const c = (e.carreras || []).join(" ").toLowerCase();
  const el = [];
  if (c.includes("aeron")) el.push("un pequeño avión");
  if (c.includes("programación") || c.includes("computación") || c.includes("informática") || c.includes("digital")) el.push("una laptop con código");
  if (c.includes("eléctric") || c.includes("control")) el.push("un circuito eléctrico");
  if (c.includes("construc")) el.push("un casco de obra y planos");
  if (c.includes("mecatr") || c.includes("mecánic") || c.includes("mantenimiento")) el.push("un engrane");
  if (c.includes("laboratorista") || c.includes("alimentos") || c.includes("plásticos")) el.push("un matraz de laboratorio");
  if (c.includes("ecolog") || c.includes("sustentab") || c.includes("ambiental") || c.includes("energía")) el.push("una hoja verde y un panel solar");
  if (c.includes("contadur") || c.includes("administración") || c.includes("comercio") || c.includes("mercadotecnia")) el.push("una gráfica de barras y una calculadora");
  if (c.includes("telecom")) el.push("una antena");
  if (c.includes("turíst")) el.push("una maleta de viaje");
  if (c.includes("gráfico")) el.push("una tableta de dibujo");
  return [...new Set(el)].slice(0, 3);
}

function promptEscuela(e) {
  const nombre = e.honorifico?.match(/"([^"]+)"/)?.[1];
  const lugar = e.alcaldia ?? "Ciudad de México";
  const sub = [nombre, lugar].filter(Boolean).join(" · ");
  let escudo, color, ambiente;
  if (e.linea === "enp") {
    escudo = "el escudo oficial de la UNAM y, a su lado, el escudo de la Escuela Nacional Preparatoria";
    color = "azul #2457C5 y dorado";
    ambiente = "un edificio de bachillerato universitario con fachada de concreto y ventanales, escalinata de entrada, árboles y estudiantes con mochila llegando por la mañana";
  } else if (e.linea === "cch") {
    escudo = "el escudo oficial de la UNAM y, a su lado, el escudo del Colegio de Ciencias y Humanidades";
    color = "ámbar #E2A400 y azul";
    ambiente = "edificios bajos de bachillerato con jardineras, una explanada amplia y estudiantes conversando en grupos";
  } else {
    escudo = "el escudo oficial del Instituto Politécnico Nacional";
    color = "vino #8C1D40 y blanco";
    const el = elementosVoca(e);
    ambiente = `un edificio de bachillerato tecnológico con detalles guinda, estudiantes con bata o mochila entrando${el.length ? `, y flotando de forma sutil alrededor íconos de sus carreras técnicas: ${el.join(", ")}` : ""}`;
  }
  return `${ILUS} Portada ilustrada (no fotografía) de ${e.doble}: escena de ${ambiente}, en ${lugar}, con cielo despejado y luz de mañana. Franja de color ${color} en la parte inferior. En la esquina superior izquierda coloca ${escudo}. Título grande en la parte superior: "${e.comun}" y debajo, más pequeño: "${sub}". ${fin("Formato horizontal 3:2, deja la parte superior despejada para escudos y textos.")}`;
}

export function promptsImagenes(IMAGENES) {
  const porSlug = Object.fromEntries(ESCUELAS.map((e) => [e.slug, e]));
  return Object.entries(IMAGENES).map(([id, im]) => {
    const esc = id.startsWith("fachada-") ? porSlug[id.slice(8)] : null;
    return { id, archivo: im.archivo, ancho: im.ancho, alto: im.alto, uso: im.uso, alt: im.alt, prompt: esc ? promptEscuela(esc) : FIJOS[id] ?? im.prompt };
  });
}

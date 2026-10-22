// Enlazado interno contextual: cada página enlaza a las que más le aportan, con el anchor de su palabra clave.
// Volúmenes de referencia (Ubersuggest MX, oct-2026): prepas cerca de mí 6.6K, CCH UNAM 2.4K,
// cuántos aciertos pide la UNAM 1.9K, prepas UNAM 1.6K, cuántos aciertos pide la prepa 6 1.3K,
// examen ECOEMS 1.3K, vocacionales IPN 1K, registro Mi Derecho Mi Lugar 1K, resultados ECOEMS 880, prepas sin examen 720.
import { ESCUELAS, GRUPOS } from "./datos.mjs";
import { SISTEMAS, PLANTELES } from "./sinexamen.mjs";

const HUB = { enp: "/escuelas/prepas-unam/", cch: "/escuelas/cch-unam/", voca: "/escuelas/vocacionales-ipn/" };

const MAPA = {
  "/que-es-ecoems/": [
    ["/mi-derecho-mi-lugar/", "cómo funciona Mi Derecho, Mi Lugar", "el proceso de asignación que usa el examen."],
    ["/fechas/", "cuándo es el examen ECOEMS", "registro, examen y resultados en orden."],
    ["/examen/", "cómo es el examen ECOEMS en línea", "preguntas, materias y navegador seguro."],
    ["/aciertos/", "cuántos aciertos pide la UNAM y el IPN", "las 31 escuelas con sus aciertos de tres años."],
    ["/preguntas-frecuentes/", "preguntas frecuentes del ECOEMS", "todas las dudas del proceso en un lugar."],
  ],
  "/mi-derecho-mi-lugar/": [
    ["/registro/", "registro de Mi Derecho, Mi Lugar", "qué datos y documentos piden."],
    ["/modalidades/", "modalidades con examen y sin examen", "cuál conviene según sus aciertos."],
    ["/escuelas/sin-examen/", "prepas sin examen", "las opciones que no piden ECOEMS."],
    ["/resultados/", "resultados del ECOEMS", "cuándo salen y cómo se leen."],
    ["/preguntas-frecuentes/", "preguntas frecuentes de Mi Derecho, Mi Lugar", "respuestas cortas a las dudas más comunes."],
  ],
  "/fechas/": [
    ["/registro/", "registro de Mi Derecho, Mi Lugar", "el primer paso del calendario."],
    ["/examen/", "examen ECOEMS en línea", "qué pasa el día del examen."],
    ["/resultados/", "resultados del ECOEMS", "la última fecha del proceso."],
    ["/preguntas-frecuentes/", "preguntas frecuentes del ECOEMS", "dudas sobre plazos y prórrogas."],
  ],
  "/llave-mx/": [
    ["/registro/", "registro de Mi Derecho, Mi Lugar paso a paso", "lo que sigue después de crear la Llave MX."],
    ["/correo/", "correo de Mi Derecho, Mi Lugar", "el correo que conviene usar en el registro."],
    ["/fechas/", "fechas del ECOEMS", "hasta cuándo hay para registrarse."],
  ],
  "/registro/": [
    ["/llave-mx/", "Llave MX para Mi Derecho, Mi Lugar", "la cuenta que se necesita antes de registrarse."],
    ["/correo/", "correo del registro", "los avisos que no hay que perder."],
    ["/modalidades/", "modalidades del registro", "con examen, sin examen o ambas."],
    ["/como-elegir-opciones/", "cómo elegir y ordenar las opciones del ECOEMS", "el orden decide tanto como los aciertos."],
  ],
  "/correo/": [
    ["/registro/", "registro de Mi Derecho, Mi Lugar", "dónde se escribe ese correo."],
    ["/llave-mx/", "Llave MX", "la otra cuenta del proceso."],
    ["/resultados/", "resultados del ECOEMS", "el aviso más esperado del correo."],
  ],
  "/examen/": [
    ["/fechas/", "cuándo es el examen ECOEMS", "las fechas del registro y del examen."],
    ["/aciertos/", "cuántos aciertos pide cada escuela", "para saber a qué puntaje apuntar."],
    ["/calculadora/", "calculadora de aciertos del ECOEMS", "qué escuelas le alcanzan con sus aciertos de hoy."],
    ["/resultados/", "resultados del ECOEMS", "cuándo y cómo se publican."],
  ],
  "/modalidades/": [
    ["/escuelas/sin-examen/", "prepas sin examen de admisión", "las opciones de la modalidad 1."],
    ["/como-elegir-opciones/", "cómo ordenar las opciones del ECOEMS", "retadoras, alcanzables y seguras."],
    ["/aciertos/", "aciertos que pide cada escuela", "para la modalidad con examen."],
  ],
  "/como-elegir-opciones/": [
    ["/aciertos/", "cuántos aciertos pide la UNAM y el IPN", "los aciertos de las 31 escuelas."],
    ["/comparador/", "comparador de escuelas", "dos o tres escuelas lado a lado."],
    ["/modalidades/", "modalidad con examen, sin examen o ambas", "qué combinación conviene."],
    ["/mapa/", "mapa de prepas UNAM y vocacionales IPN", "cuáles le quedan cerca."],
  ],
  "/resultados/": [
    ["/no-quede/", "qué hacer si no quedó en el ECOEMS", "segunda vuelta y lugares disponibles."],
    ["/aciertos/", "aciertos que pidió cada escuela", "el último puntaje de asignación."],
    ["/correo/", "correo de Mi Derecho, Mi Lugar", "donde llegan los avisos."],
  ],
  "/no-quede/": [
    ["/escuelas/sin-examen/", "escuelas sin examen", "opciones que asignan lugar sin ECOEMS."],
    ["/resultados/", "resultados del ECOEMS", "cómo leer la asignación."],
    ["/prepas-cerca-de-mi/", "prepas cerca de mí", "buscar opciones por cercanía."],
  ],
  "/preguntas-frecuentes/": [
    ["/que-es-ecoems/", "qué es el ECOEMS", "el examen y para qué escuelas cuenta."],
    ["/fechas/", "fechas del ECOEMS", "el calendario completo."],
    ["/aciertos/", "cuántos aciertos pide la UNAM", "y el IPN, escuela por escuela."],
    ["/registro/", "registro de Mi Derecho, Mi Lugar", "paso a paso."],
  ],
  "/aciertos/": [
    ["/escuelas/prepas-unam/", "prepas UNAM", "las 9 de la Escuela Nacional Preparatoria."],
    ["/escuelas/cch-unam/", "CCH UNAM", "los 5 planteles del Colegio de Ciencias y Humanidades."],
    ["/escuelas/vocacionales-ipn/", "vocacionales IPN", "las 16 vocas y el CET 1."],
    ["/calculadora/", "calculadora de aciertos", "qué escuelas le alcanzan con sus aciertos."],
    ["/comparador/", "comparador de escuelas", "compara aciertos y ubicación."],
  ],
  "/escuelas/": [
    ["/aciertos/", "cuántos aciertos pide cada escuela", "la tabla de 2024 a 2026."],
    ["/mapa/", "mapa de prepas, CCH y vocacionales", "todas las escuelas en el mapa."],
    ["/prepas-cerca-de-mi/", "prepas cerca de mí", "las que le convienen por cercanía y aciertos."],
    ["/escuelas/sin-examen/", "prepas sin examen", "las opciones de la modalidad 1."],
  ],
  "/escuelas/prepas-unam/": [
    ["/escuelas/cch-unam/", "CCH UNAM", "el otro bachillerato de la UNAM."],
    ["/escuelas/vocacionales-ipn/", "vocacionales IPN", "bachillerato con carrera técnica."],
    ["/aciertos/", "cuántos aciertos pide la UNAM", "comparado con el IPN."],
    ["/prepas-cerca-de-mi/", "prepas UNAM cerca de mí", "las que le quedan cerca."],
  ],
  "/escuelas/cch-unam/": [
    ["/escuelas/prepas-unam/", "prepas UNAM", "la Escuela Nacional Preparatoria."],
    ["/escuelas/vocacionales-ipn/", "vocacionales IPN", "bachillerato con carrera técnica."],
    ["/aciertos/", "cuántos aciertos pide la UNAM", "todas las escuelas en una tabla."],
    ["/mapa/", "mapa de prepas y CCH", "dónde está cada plantel."],
  ],
  "/escuelas/vocacionales-ipn/": [
    ["/escuelas/prepas-unam/", "prepas UNAM", "bachillerato general con pase reglamentado."],
    ["/escuelas/cch-unam/", "CCH UNAM", "el bachillerato semestral de la UNAM."],
    ["/aciertos/", "cuántos aciertos pide el IPN", "y la UNAM, escuela por escuela."],
    ["/prepas-cerca-de-mi/", "vocacionales cerca de mí", "filtradas por el área que quiere estudiar."],
  ],
  "/escuelas/sin-examen/": [
    ["/escuelas/conalep/", "CONALEP CDMX y Edomex", "planteles y carreras de profesional técnico."],
    ["/escuelas/colegio-de-bachilleres/", "Colegio de Bachilleres", "los 20 planteles con dirección y mapa."],
    ["/escuelas/cetis-cbtis/", "CETIS y CBTIS", "bachillerato tecnológico de la DGETI."],
    ["/modalidades/", "modalidad 1 y modalidad 3", "cómo combinar opciones con y sin examen."],
    ["/no-quede/", "qué hacer si no quedó", "lugares disponibles después de los resultados."],
    ["/prepas-cerca-de-mi/", "prepas cerca de mí", "las de la UNAM y el IPN cerca de tu casa."],
  ],
  "/calculadora/": [
    ["/prepas-cerca-de-mi/", "prepas cerca de mí", "suma la distancia y lo que quiere estudiar."],
    ["/armar-opciones/", "arma y ordena tus opciones", "pasa las escuelas a tu lista."],
    ["/aciertos/", "tabla de aciertos del ECOEMS", "los tres años de cada escuela."],
  ],
  "/comparador/": [
    ["/aciertos/", "cuántos aciertos pide cada escuela", "todas en una tabla."],
    ["/mapa/", "mapa de escuelas", "dónde queda cada una."],
    ["/armar-opciones/", "arma y ordena tus opciones", "decide el orden del registro."],
  ],
  "/armar-opciones/": [
    ["/como-elegir-opciones/", "cómo elegir y ordenar las opciones", "la regla de retadoras, alcanzables y seguras."],
    ["/prepas-cerca-de-mi/", "prepas cerca de mí", "te armamos la lista por cercanía y aciertos."],
    ["/comparador/", "comparador de escuelas", "para decidir entre dos o tres."],
    ["/calculadora/", "calculadora de aciertos", "qué escuelas le alcanzan hoy."],
  ],
  "/mapa/": [
    ["/prepas-cerca-de-mi/", "prepas cerca de mí", "cuáles le convienen según sus aciertos."],
    ["/escuelas/", "listado de escuelas del ECOEMS", "búscalas por nombre o alcaldía."],
    ["/comparador/", "comparador de escuelas", "compara las que te quedan cerca."],
  ],
  "/prepas-cerca-de-mi/": [
    ["/mapa/", "mapa de prepas UNAM y vocacionales IPN", "todas las escuelas en el mapa."],
    ["/escuelas/sin-examen/", "prepas sin examen", "opciones para la modalidad 3."],
    ["/comparador/", "comparador de escuelas", "compara las que te sugerimos."],
    ["/calculadora/", "calculadora de aciertos", "cuántos aciertos le faltan para cada escuela."],
  ],
};

function deEscuela(ruta) {
  const e = ESCUELAS.find((x) => `/escuelas/${x.slug}/` === ruta);
  if (!e) return null;
  const g = GRUPOS.find((x) => x.clave === e.linea);
  const hub = { enp: "prepas UNAM", cch: "CCH UNAM", voca: "vocacionales IPN" }[e.linea];
  return [
    [HUB[e.linea], hub, `las ${g.escuelas.length} escuelas de esta línea y sus aciertos.`],
    ["/aciertos/", `cuántos aciertos pide ${e.institucion === "UNAM" ? "la UNAM" : "el IPN"}`, "todas las escuelas en una tabla de tres años."],
    ["/prepas-cerca-de-mi/", "prepas cerca de mí", `para ver si ${e.comun} le conviene por cercanía.`],
    ["/comparador/", `compara ${e.comun} con otras escuelas`, "aciertos y ubicación lado a lado."],
  ];
}

// Escuelas sin examen: página de la institución y fichas de plantel.
function deSinExamen(ruta) {
  const sis = Object.entries(SISTEMAS).find(([k, s]) => s.ruta === ruta && k !== "uaemex");
  if (sis) {
    return [
      ["/escuelas/sin-examen/", "prepas sin examen en CDMX y Edomex", "las 13 instituciones que no piden examen."],
      ["/prepas-cerca-de-mi/", "prepas cerca de mí", "con y sin examen, según tu código postal."],
      ["/modalidades/", "modalidad 1 y modalidad 3", "cómo elegir escuelas sin examen en el registro."],
      ["/mapa/", "mapa de escuelas", "todas las escuelas del proceso en un mapa."],
    ];
  }
  const p = PLANTELES.find((x) => x.ficha && x.url === ruta);
  if (!p) return null;
  const s = SISTEMAS[p.sis];
  return [
    [s.ruta, `${s.corto} en CDMX y Edomex`, `todos los planteles${p.esp.length ? " y sus carreras" : ""}.`],
    ["/escuelas/sin-examen/", "prepas sin examen", "las demás instituciones que no piden examen."],
    ["/prepas-cerca-de-mi/", "prepas cerca de mí", `otras escuelas cerca de ${p.comun}.`],
    ["/modalidades/", "modalidades con examen y sin examen", "cómo combinarla con la UNAM y el IPN."],
  ];
}

export function relacionadas(ruta) {
  const lista = MAPA[ruta] ?? deEscuela(ruta) ?? deSinExamen(ruta);
  if (!lista) return "";
  return `
<section class="seccion seccion-relacionadas" aria-labelledby="t-relacionadas">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-relacionadas">También te puede servir</h2>
    <ul class="relacionadas">${lista.map(([href, a, d]) => `<li><a href="${href}">${a.charAt(0).toUpperCase() + a.slice(1)}</a><span>${d.charAt(0).toUpperCase() + d.slice(1)}</span></li>`).join("")}</ul>
  </div>
</section>`;
}

// Enlaces hacia examenes.lat (estudiar, convocatoria, becas) y ecoems.app (diagnóstico y curso).
// Cada página enlaza a la página PROFUNDA que responde su siguiente paso, con el anchor de la palabra clave
// de la página destino. Sin nofollow: son sitios del mismo dueño y queremos pasar autoridad.
// 21-oct-2026: examenes.lat/mx/comipems/mi-derecho-mi-lugar/ redirige (301) a ecoems.net y
// examenes.lat/mx/comipems/aciertos/ se reenfocó a "Puntaje ECOEMS: percentil y cómo subir tus aciertos".
// ecoems.net se queda con "cuántos aciertos pide cada escuela"; examenes.lat, con el percentil y el estudio.
import { SITIO, utm } from "./plantilla.mjs";
import { icono } from "./iconos.mjs";

const L = SITIO.lat;
export const DESTINOS = {
  diag: [SITIO.app, "diagnostico", "Diagnóstico ECOEMS gratis", "ecoems.app", "64 preguntas, la mitad exacta del examen. Al terminar ves sus aciertos estimados y cuántos le faltan."],
  simulador: [`${L}/mx/comipems/`, "libro", "Examen simulacro ECOEMS gratis", "examenes.lat", "Simuladores por materia con preguntas tipo examen para practicar en casa."],
  guia: [`${L}/mx/guias/comipems-ecoems/`, "libro", "Guía ECOEMS con el temario oficial", "examenes.lat", "La guía de estudio en PDF con todos los temas que vienen en el examen."],
  convocatoria: [`${L}/noticias/mx/convocatorias/convocatoria-ecoems/`, "calendario", "Convocatoria ECOEMS 2027", "examenes.lat", "Te avisamos en cuanto se publique: fechas, requisitos y registro oficiales."],
  resultados: [`${L}/noticias/mx/resultados/ecoems/`, "resultados", "Resultados ECOEMS: noticias del día", "examenes.lat", "Cuándo se publican, cómo consultarlos y qué hacer después."],
  beca: [`${L}/mx/becas/benito-juarez/`, "apoyo", "Beca Benito Juárez para bachillerato", "examenes.lat", "El apoyo para todos los alumnos de prepa pública: monto, requisitos y pagos."],
  percentil: [`${L}/mx/comipems/aciertos/`, "resultados", "Percentil ECOEMS: qué tan bueno es tu puntaje", "examenes.lat", "Qué porcentaje de aspirantes superas con tus aciertos y cómo subirlos."],
  habmat: [`${L}/mx/comipems/habilidad-matematica/`, "calculadora", "Simulador de habilidad matemática ECOEMS", "examenes.lat", "Series, problemas razonados y figuras, como vienen en el examen."],
  habverbal: [`${L}/mx/comipems/habilidad-verbal/`, "libro", "Simulador de habilidad verbal ECOEMS", "examenes.lat", "Comprensión de lectura, sinónimos y analogías como en el examen."],
  mate: [`${L}/mx/comipems/matematicas/`, "calculadora", "Simulador de matemáticas ECOEMS", "examenes.lat", "Aritmética, álgebra y geometría con el temario oficial."],
};

// Qué destinos lleva cada página (en orden de importancia).
export const POR_PAGINA = {
  "/": ["diag", "simulador", "guia"],
  "/que-es-ecoems/": ["guia", "simulador"],
  "/preguntas-frecuentes/": ["convocatoria", "simulador", "diag"],
  "/mi-derecho-mi-lugar/": ["convocatoria", "diag"],
  "/fechas/": ["convocatoria", "simulador"],
  "/llave-mx/": ["convocatoria", "diag"],
  "/registro/": ["convocatoria", "diag"],
  "/modalidades/": ["diag", "simulador"],
  "/como-elegir-opciones/": ["diag", "simulador"],
  "/correo/": ["convocatoria", "simulador"],
  "/examen/": ["simulador", "habmat", "habverbal", "guia"],
  "/resultados/": ["resultados", "percentil", "beca"],
  "/no-quede/": ["beca", "simulador"],
  "/aciertos/": ["diag", "percentil", "simulador"],
  "/escuelas/prepas-unam/": ["diag", "simulador", "guia"],
  "/escuelas/cch-unam/": ["diag", "simulador", "guia"],
  "/escuelas/vocacionales-ipn/": ["diag", "simulador", "habmat"],
  "/escuelas/sin-examen/": ["beca", "convocatoria"],
  ...Object.fromEntries(["conalep", "colegio-de-bachilleres", "cetis-cbtis", "iems", "cecytem", "cobaem", "preparatorias-oficiales-edomex", "cbt-edomex", "telebachillerato-comunitario", "ceb-dgb", "cbta"].map((s) => [`/escuelas/${s}/`, ["beca", "convocatoria"]])),
  "/calculadora/": ["diag", "percentil", "simulador"],
  "/prepas-cerca-de-mi/": ["diag", "simulador"],
  "/comparador/": ["diag", "simulador"],
  "/armar-opciones/": ["diag", "simulador"],
};
const DEFECTO = ["diag", "simulador"];

// Descripciones propias por página cuando conviene (por ejemplo, la ficha de una escuela).
export function caminosExternos(ruta, campana, desc = {}) {
  const claves = POR_PAGINA[ruta] ?? DEFECTO;
  return `<div class="caminos">${claves
    .map((k) => {
      const [url, ic, titulo, sitio, d] = DESTINOS[k];
      return `<a class="camino" href="${utm(url, campana)}">${icono(ic, "ico camino-ico")}<span><b>${titulo}</b><span>${desc[k] ?? d}</span><small class="camino-sitio">${sitio}</small></span>${icono("externo", "ico camino-ext")}</a>`;
    })
    .join("")}</div>`;
}

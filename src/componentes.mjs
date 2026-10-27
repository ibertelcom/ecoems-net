import { imagen } from "./imagenes.mjs";
import { icono } from "./iconos.mjs";
import { SITIO } from "./plantilla.mjs";

export const ACTUALIZADO = { iso: "2026-10-15", texto: "15 de octubre de 2026" };

// Equipo detrás de ecoems.net (E-E-A-T). Fuente única: la usan /contacto/, la línea "Revisado por" y el JSON-LD.
// Equipo completo y biografías: https://examenes.lat/nosotros/
export const EQUIPO = [
  { nombre: "Ing. Victor Gutiérrez", ld: "Victor Gutiérrez", puesto: "Fundador de ecoems.net", formacion: "Ingeniero Civil por la UNAM", escuela: "Universidad Nacional Autónoma de México",
    texto: "Papá que vivió el proceso ECOEMS 2026 con su hijo. Reúne y verifica contra las fuentes oficiales los aciertos, las fechas y los pasos del proceso." },
  { nombre: "Lic. Karina Manzano Alarcón", ld: "Karina Manzano Alarcón", puesto: "Coordinadora académica", formacion: "Licenciada en Matemáticas Aplicadas y Computación por la UNAM", escuela: "Universidad Nacional Autónoma de México",
    texto: "Docente de matemáticas con más de seis años de experiencia en secundaria. Revisa los datos de aciertos y los consejos de estudio." },
  { nombre: "Lic. Antonio Silva", ld: "Antonio Silva", puesto: "Asesor institucional IPN", formacion: "Docente del Instituto Politécnico Nacional", escuela: "Instituto Politécnico Nacional",
    texto: "Imparte diplomados y posgrados en la Escuela Superior de Turismo del IPN. Revisa la información de las vocacionales (CECyT) y del IPN." },
];
export const REVISORES = EQUIPO.slice(0, 2);
export const REVISADO = `Revisado por <a href="/contacto/#t-quienes">${REVISORES.map((p) => p.nombre).join(" y ")}</a>.`;
export const personaLd = (p) => ({
  "@type": "Person", name: p.ld, jobTitle: p.puesto, description: p.texto,
  alumniOf: { "@type": "CollegeOrUniversity", name: p.escuela },
  worksFor: { "@type": "Organization", name: "ecoems.net", url: `${SITIO.dominio}/` },
});

// Migas de pan visibles + JSON-LD BreadcrumbList.
export function migas(items) {
  const html = `<nav class="migas" aria-label="Estás en"><ol>${items
    .map(([t, href], i) => (i < items.length - 1 ? `<li><a href="${href}">${t}</a></li>` : `<li aria-current="page">${t}</li>`))
    .join("")}</ol></nav>`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([t, href], i) => ({ "@type": "ListItem", position: i + 1, name: t, item: `${SITIO.dominio}${href}` })),
  };
  return { html, ld };
}

export function cabeceraPagina({ migasHtml, h1, lead, linea = "", extra = "", img = null }) {
  const texto = `${migasHtml}
    <h1>${h1}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
    ${extra}`;
  if (!img) {
    return `
<section class="cabecera-pagina"${linea ? ` data-linea="${linea}"` : ""}>
  <div class="contenedor">
    ${texto}
  </div>
</section>`;
  }
  // Imagen principal de la página: a la izquierda en escritorio, debajo del texto en el celular.
  return `
<section class="cabecera-pagina cabecera-con-img"${linea ? ` data-linea="${linea}"` : ""}>
  <div class="contenedor cabecera-rejilla">
    <div class="cabecera-texto">
    ${texto}
    </div>
    <figure class="cabecera-fig">${imagen(img, { prioridad: true, tamanos: "(min-width: 960px) 40vw, 100vw" })}</figure>
  </div>
</section>`;
}

export function faqBloque(preguntas, titulo, id = "t-faq") {
  return `
<section class="seccion seccion-faq" aria-labelledby="${id}">
  <div class="contenedor contenedor-angosto">
    <h2 id="${id}">${titulo}</h2>
    <div class="faq">
      ${preguntas.map(([p, r]) => `<details class="faq-item"><summary>${p}${icono("abajo", "ico")}</summary><p>${r}</p></details>`).join("")}
    </div>
    <p class="actualizado">Actualizado el <time datetime="${ACTUALIZADO.iso}">${ACTUALIZADO.texto}</time>. Aciertos tomados de los resultados oficiales publicados por el proceso de asignación (COMIPEMS hasta 2024 y Mi Derecho, Mi Lugar desde 2025). ${REVISADO} ecoems.net no es un sitio oficial.</p>
  </div>
</section>`;
}

export function faqLd(preguntas) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })),
  };
}

export function paginaLd({ titulo, ruta, descripcion, tipo = "WebPage", imagen = null }) {
  return {
    "@context": "https://schema.org",
    "@type": tipo,
    name: titulo,
    url: `${SITIO.dominio}${ruta}`,
    description: descripcion,
    inLanguage: "es-MX",
    dateModified: ACTUALIZADO.iso,
    reviewedBy: REVISORES.map((p) => ({ "@type": "Person", name: p.ld })),
    publisher: { "@type": "Organization", name: "ecoems.net", url: `${SITIO.dominio}/` },
    isPartOf: { "@type": "WebSite", name: "ecoems.net", url: `${SITIO.dominio}/` },
    ...(imagen ? { primaryImageOfPage: { "@type": "ImageObject", url: `${SITIO.dominio}/img/${imagen.archivo}`, width: imagen.ancho, height: imagen.alto, caption: imagen.alt } } : {}),
  };
}

// Variación entre dos años, en palabras.
export function cambio(a, b) {
  const d = b - a;
  if (d === 0) return { d, texto: "igual", signo: "=" };
  return { d, texto: d > 0 ? `${d} más` : `${-d} menos`, signo: d > 0 ? `+${d}` : `${d}` };
}

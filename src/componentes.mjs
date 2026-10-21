import { icono } from "./iconos.mjs";
import { SITIO } from "./plantilla.mjs";

export const ACTUALIZADO = { iso: "2026-10-15", texto: "15 de octubre de 2026" };

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

export function cabeceraPagina({ migasHtml, h1, lead, linea = "", extra = "" }) {
  return `
<section class="cabecera-pagina"${linea ? ` data-linea="${linea}"` : ""}>
  <div class="contenedor">
    ${migasHtml}
    <h1>${h1}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
    ${extra}
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
    <p class="actualizado">Actualizado el <time datetime="${ACTUALIZADO.iso}">${ACTUALIZADO.texto}</time>. Aciertos tomados de los resultados oficiales publicados por el proceso de asignación (COMIPEMS hasta 2024 y Mi Derecho, Mi Lugar desde 2025). ecoems.net no es un sitio oficial.</p>
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

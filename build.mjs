// Genera el sitio estático de ecoems.net en dist/ y una vista previa autocontenida en vista-previa/.
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, cpSync } from "node:fs";
import { documento, SITIO } from "./src/plantilla.mjs";
import { IMAGENES } from "./src/imagenes.mjs";
import * as inicio from "./src/paginas/inicio.mjs";
import * as aciertos from "./src/paginas/aciertos.mjs";
import * as escuela from "./src/paginas/escuela.mjs";

const PAGINAS = [inicio, aciertos, escuela].flatMap((m) => m.paginas());
const css = readFileSync(new URL("./src/estilos.css", import.meta.url), "utf8");
const js = readFileSync(new URL("./src/app.js", import.meta.url), "utf8");
const min = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s+/g, "\n").replace(/\n{2,}/g, "\n");

rmSync("dist", { recursive: true, force: true });
rmSync("vista-previa", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
mkdirSync("vista-previa", { recursive: true });

writeFileSync("dist/estilos.css", min(css));
writeFileSync("dist/app.js", js);
if (existsSync("src/img")) cpSync("src/img", "dist/img", { recursive: true });

for (const p of PAGINAS) {
  const comun = { titulo: p.META.titulo, descripcion: p.META.descripcion, ruta: p.META.ruta, cuerpo: p.cuerpo(), jsonld: p.jsonld(), seccion: p.seccion };
  const destino = p.META.ruta === "/" ? "dist/index.html" : `dist${p.META.ruta}index.html`;
  mkdirSync(destino.replace(/index\.html$/, ""), { recursive: true });
  writeFileSync(destino, documento({ ...comun, css: { href: "/estilos.css" }, js: { src: "/app.js" } }));
  const nombre = p.META.ruta === "/" ? "inicio" : p.META.ruta.replace(/\//g, "-").replace(/^-|-$/g, "");
  writeFileSync(`vista-previa/${nombre}.html`, documento({ ...comun, css: { inline: css }, js: { inline: js }, fragmento: true, nombreCorto: p.nombreCorto }));
}

writeFileSync("dist/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="11" fill="#0B7A60"/><path d="M9 26h22" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="13" cy="26" r="3.6" fill="#fff"/><circle cx="20" cy="26" r="3.6" fill="#F4B400" stroke="#fff" stroke-width="2"/><circle cx="27" cy="26" r="3.6" fill="#fff"/><path d="M13 15h14" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/></svg>`);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITIO.dominio}/sitemap.xml\n`);
writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGINAS.map((p) => `  <url><loc>${SITIO.dominio}${p.META.ruta}</loc><lastmod>${p.ACTUALIZADO?.iso ?? new Date().toISOString().slice(0, 10)}</lastmod></url>`).join("\n")}\n</urlset>\n`,
);

// Listado de imágenes para que Victor las genere.
const md = [
  "# Imágenes de ecoems.net",
  "",
  "Formato .webp, sin año ni fecha en la imagen ni en el nombre. Guardar en `src/img/` con el nombre exacto.",
  "",
  ...Object.values(IMAGENES).flatMap((im) => [
    `## ${im.archivo}`,
    `- Tamaño: ${im.ancho} × ${im.alto} px`,
    `- Dónde va: ${im.uso}`,
    `- Title: ${im.title}`,
    `- Alt: ${im.alt}`,
    `- Descripción: ${im.descripcion}`,
    `- Prompt: ${im.prompt}`,
    "",
  ]),
].join("\n");
writeFileSync("imagenes-pendientes.md", md);

console.log(`Listo: ${PAGINAS.length} página(s), ${Object.keys(IMAGENES).length} imágenes registradas.`);

// Genera el sitio estático de ecoems.net en dist/ y una vista previa autocontenida en vista-previa/.
import { compartir } from "./src/compartir.mjs";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, cpSync } from "node:fs";
import { createHash } from "node:crypto";
import { documento, SITIO } from "./src/plantilla.mjs";
import { IMAGENES } from "./src/imagenes.mjs";
import { promptsImagenes } from "./src/prompts-imagenes.mjs";
import { relacionadas } from "./src/relacionadas.mjs";
import * as inicio from "./src/paginas/inicio.mjs";
import * as aciertos from "./src/paginas/aciertos.mjs";
import * as escuela from "./src/paginas/escuela.mjs";
import * as proceso from "./src/paginas/proceso.mjs";
import * as herramientas from "./src/paginas/herramientas.mjs";
import * as sinexamen from "./src/paginas/sinexamen.mjs";
import { datosMapaSin } from "./src/sinexamen.mjs";

const PAGINAS = [inicio, proceso, aciertos, escuela, herramientas, sinexamen].flatMap((m) => m.paginas());
const css = readFileSync(new URL("./src/estilos.css", import.meta.url), "utf8");
const js = readFileSync(new URL("./src/app.js", import.meta.url), "utf8");
const ver = createHash("sha1").update(css + js).digest("hex").slice(0, 8);
const min = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s+/g, "\n").replace(/\n{2,}/g, "\n");

rmSync("dist", { recursive: true, force: true });
rmSync("vista-previa", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
mkdirSync("vista-previa", { recursive: true });

writeFileSync("dist/estilos.css", min(css));
writeFileSync("dist/app.js", js);
if (existsSync("src/img")) cpSync("src/img", "dist/img", { recursive: true });
if (existsSync("src/vendor")) cpSync("src/vendor", "dist/vendor", { recursive: true });
// Códigos postales de la ZMVM con coordenadas aproximadas (GeoNames, CC BY 4.0) para "Prepas cerca de mí".
{
  const filas = ["parte1", "parte2", "parte3"].map((f) => readFileSync(`src/datos/cp/${f}.txt`, "utf8").trim()).join(";");
  const municipios = readFileSync("src/datos/cp/municipios.txt", "utf8").trim().split(";").map((x) => { const [e, n] = x.split("|"); return `${n}, ${e === "09" ? "CDMX" : "Edomex"}`; });
  mkdirSync("dist/datos", { recursive: true });
  writeFileSync("dist/datos/sin-examen.json", JSON.stringify(datosMapaSin()));
  writeFileSync("dist/datos/cp-zmvm.json", JSON.stringify({ fuente: "GeoNames (CC BY 4.0), coordenadas aproximadas", m: municipios, c: filas }));
}

const imgsDePagina = {};
for (const p of PAGINAS) {
  // Enlaces relacionados con anchor de palabra clave, antes de las preguntas frecuentes (o al final).
  const rel = relacionadas(p.META.ruta);
  const crudo = p.cuerpo();
  const iFaq = crudo.indexOf('<section class="seccion seccion-faq"');
  const extra = compartir(p.META.ruta, p.META.titulo) + (rel || "");
  const cuerpoHtml = !extra ? crudo : iFaq >= 0 ? crudo.slice(0, iFaq) + extra + "\n" + crudo.slice(iFaq) : crudo + extra;
  // Imagen para compartir (Open Graph): la del hero de la página si ya existe su versión JPG.
  const heroM = /class="cabecera-fig"><img [^>]*src="\/img\/([^"]+)\.webp"/.exec(cuerpoHtml) ?? (p.META.ruta === "/" ? [null, "portada-papa-e-hija-revisan-aciertos"] : null);
  const og = heroM && existsSync(`src/img/og/${heroM[1]}.jpg`) ? `/img/og/${heroM[1]}.jpg` : undefined;
  const comun = { titulo: p.META.titulo, descripcion: p.META.descripcion, ruta: p.META.ruta, cuerpo: cuerpoHtml, jsonld: p.jsonld(), seccion: p.seccion, og };
  const destino = p.META.ruta === "/" ? "dist/index.html" : `dist${p.META.ruta}index.html`;
  mkdirSync(destino.replace(/index\.html$/, ""), { recursive: true });
  const html = documento({ ...comun, css: { href: `/estilos.css?v=${ver}` }, js: { src: `/app.js?v=${ver}` } });
  writeFileSync(destino, html);
  imgsDePagina[p.META.ruta] = [...new Set([...html.matchAll(/<img [^>]*src="\/img\/([^"]+\.webp)"/g)].map((m) => m[1]))];
  const nombre = p.META.ruta === "/" ? "inicio" : p.META.ruta.replace(/\//g, "-").replace(/^-|-$/g, "");
  writeFileSync(`vista-previa/${nombre}.html`, documento({ ...comun, css: { inline: css }, js: { inline: js }, fragmento: true, nombreCorto: p.nombreCorto }));
}

// Favicons para Google (múltiplo de 48 px), navegadores e iOS.
cpSync("src/favicon", "dist", { recursive: true });
writeFileSync("dist/site.webmanifest", JSON.stringify({ name: "ecoems.net", short_name: "ecoems.net", icons: [{ src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" }, { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" }], theme_color: "#0B7A60", background_color: "#ffffff", display: "browser" }));
writeFileSync("dist/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="11" fill="#0B7A60"/><path d="M9 26h22" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="13" cy="26" r="3.6" fill="#fff"/><circle cx="20" cy="26" r="3.6" fill="#F4B400" stroke="#fff" stroke-width="2"/><circle cx="27" cy="26" r="3.6" fill="#fff"/><path d="M13 15h14" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/></svg>`);
writeFileSync("dist/.htaccess", readFileSync("src/htaccess.txt", "utf8"));
if (existsSync("src/og-ecoems-net.png")) { mkdirSync("dist/img", { recursive: true }); cpSync("src/og-ecoems-net.png", "dist/img/og-ecoems-net.png"); }
writeFileSync(
  "dist/404.html",
  documento({
    titulo: "Página no encontrada | ecoems.net", descripcion: "Esta página no existe.", ruta: "/404.html", jsonld: [], seccion: "",
    css: { href: `/estilos.css?v=${ver}` }, js: { src: `/app.js?v=${ver}` },
    cuerpo: `<section class="cabecera-pagina"><div class="contenedor"><h1>No encontramos esta página</h1><p class="lead">Puede que la dirección haya cambiado. Prueba con la <a href="/">portada</a>, la <a href="/aciertos/">tabla de aciertos</a> o la <a href="/escuelas/">lista de escuelas</a>.</p></div></section>`,
  }).replace('content="index, follow, max-image-preview:large"', 'content="noindex"'),
);
// IndexNow (Bing, Yandex, Seznam…): archivo de clave en la raíz.
export const INDEXNOW_KEY = "6573ccf8a71e37569db6b94154a2a6e4";
writeFileSync(`dist/${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITIO.dominio}/sitemap.xml\n`);
writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${PAGINAS.map((p) => `  <url><loc>${SITIO.dominio}${p.META.ruta}</loc><lastmod>${p.ACTUALIZADO?.iso ?? new Date().toISOString().slice(0, 10)}</lastmod>${(imgsDePagina[p.META.ruta] ?? []).map((f) => `<image:image><image:loc>${SITIO.dominio}/img/${f}</image:loc></image:image>`).join("")}</url>`).join("\n")}\n</urlset>\n`,
);

// Listado de imágenes para que Victor las genere.
const md = [
  "# Imágenes de ecoems.net",
  "",
  "Formato .webp, sin año ni fecha en la imagen ni en el nombre. Guardar en `src/img/` con el nombre exacto.",
  "",
  ...promptsImagenes(IMAGENES).map((x) => ({ ...IMAGENES[x.id], prompt: x.prompt })).flatMap((im) => [
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
writeFileSync("prompts-imagenes.json", JSON.stringify(promptsImagenes(IMAGENES), null, 1));

console.log(`Listo: ${PAGINAS.length} página(s), ${Object.keys(IMAGENES).length} imágenes registradas.`);

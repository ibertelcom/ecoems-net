// Escuelas sin examen: una página por institución (hub) y una ficha por plantel donde hay búsquedas por plantel.
// Datos del buscador oficial de Mi Derecho, Mi Lugar (src/sinexamen.mjs).
import { existsSync } from "node:fs";
import { SISTEMAS, POR_SISTEMA, PLANTELES, FUENTE_SIN, cercanas } from "../sinexamen.mjs";
import { caminosExternos } from "../externos.mjs";
import { icono } from "../iconos.mjs";
import { registrar, IMAGENES } from "../imagenes.mjs";
import { SITIO } from "../plantilla.mjs";
import { migas, cabeceraPagina, faqLd, paginaLd, ACTUALIZADO } from "../componentes.mjs";

const ORDEN = ["conalep", "bachilleres", "dgeti", "iems", "cecytem", "cobaem", "epo", "cbt", "tbc", "ceb", "cbta"];
const pl = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const lugar = (p) => `${p.municipio}, ${p.entidad === "CDMX" ? "Ciudad de México" : "Estado de México"}`;
const comoLlegar = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.coord[0]},${p.coord[1]}`;
const TIPO = { general: "bachillerato general", tecnologico: "bachillerato tecnológico", tecnico: "bachillerato con carrera de profesional técnico" };

// Imagen del encabezado: la propia del sistema cuando exista; mientras, la genérica de escuelas sin examen.
const PROMPTS = {
  conalep: "Fachada estilizada de un plantel técnico con talleres visibles por las ventanas (un brazo robótico, un motor, una computadora). Estudiantes con bata y casco de seguridad caminan a la entrada. En una lona sobre la entrada se lee \"CONALEP\" y debajo \"Profesional técnico bachiller\".",
  bachilleres: "Edificio escolar de varios pisos con jardines, estudiantes de 15 años platicando en la explanada con mochilas. Sobre la entrada se lee \"Colegio de Bachilleres\".",
  dgeti: "Laboratorio de un bachillerato tecnológico: estudiantes con bata trabajando en computadoras, un tablero eléctrico y una impresora 3D. En la pared un letrero con los textos \"CETIS\" y \"CBTIS\".",
  iems: "Preparatoria pública de la Ciudad de México con murales coloridos, un grupo pequeño de estudiantes con su tutora en un salón luminoso. En la pared se lee \"IEMS\".",
  cecytem: "Estudiantes de bachillerato tecnológico del Estado de México programando y armando un circuito en un taller. En un letrero se lee \"CECyTEM\".",
  cobaem: "Explanada de un bachillerato del Estado de México con árboles y estudiantes saliendo de clase. Sobre la entrada se lee \"COBAEM\".",
  epo: "Preparatoria pública del Estado de México: edificio de dos pisos, cancha y estudiantes con uniforme. Sobre la entrada se lee \"Escuela Preparatoria Oficial\".",
  cbt: "Taller de un Centro de Bachillerato Tecnológico del Estado de México con estudiantes en mesas de dibujo y computadoras. En un letrero se lee \"CBT\".",
  tbc: "Escuela pequeña en una colonia del Estado de México, un salón con pocos alumnos viendo una clase en pantalla con su maestra. En la pared se lee \"Telebachillerato Comunitario\".",
  ceb: "Bachillerato público con salones alrededor de un patio, estudiantes leyendo en bancas. Sobre la entrada se lee \"Centro de Estudios de Bachillerato\".",
  cbta: "Bachillerato agropecuario: estudiantes con overol en un invernadero y junto a colmenas, al fondo un edificio escolar. En un letrero se lee \"CBTA\".",
};
function imgSistema(k) {
  const s = SISTEMAS[k];
  const id = registrar(`sin-${k}`, {
    archivo: `${s.ruta.split("/")[2]}-sin-examen-ecoems.webp`,
    ancho: 1200, alto: 800,
    alt: `${s.nombre}: planteles sin examen en Mi Derecho, Mi Lugar`,
    title: `${s.nombre} sin examen`,
    descripcion: `Imagen de portada de ${s.nombre} en ecoems.net.`,
    prompt: `Fotografía realista y natural, estilo editorial, personas mexicanas con rasgos y ropa auténticos, sin aspecto de banco de imágenes. ${PROMPTS[k] ?? ""} Formato horizontal 3:2. Paleta de marca: verde #0B7A60, azul #2457C5, ámbar #E2A400, vino #8C1D40 y amarillo sol #F4B400 sobre blancos cálidos. Todo texto debe ir en español, escrito exactamente como se indica entre comillas; no agregues ningún otro texto, ni años, ni fechas.`,
    uso: `Sin examen · ${s.nombre}`,
  });
  return existsSync(new URL(`../img/${IMAGENES[id].archivo}`, import.meta.url)) ? id : "escuelas-sin-examen-bachillerato";
}

// Mapa pequeño (Leaflet, carga diferida). Puntos: [lat, lng, nombre, url, tipo, principal, línea].
export function miniMapa(puntos, etiqueta) {
  const json = JSON.stringify(puntos).replace(/&/g, "&amp;").replace(/'/g, "&#39;");
  return `<div class="mini-mapa" data-puntos='${json}' role="region" aria-label="${esc(etiqueta)}"><p class="mp-cargando">Cargando el mapa…</p></div>`;
}
const punto = (p, principal = 0) => [p.coord[0], p.coord[1], p.nombre, p.url, SISTEMAS[p.sis].corto, principal, "sin"];

function chips(esp, n = 99) {
  if (!esp.length) return "";
  const v = esp.slice(0, n);
  return `<ul class="chips">${v.map((e) => `<li>${typeof e === "string" ? e : e.nombre}</li>`).join("")}${esp.length > n ? `<li class="chip-mas">+${esp.length - n}</li>` : ""}</ul>`;
}

// ---------- Ficha de plantel ----------
function ficha(p) {
  const s = SISTEMAS[p.sis];
  const ruta = p.url;
  const img = imgSistema(p.sis);
  const tecnica = p.esp.length > 0;
  const cerca = cercanas(p.coord, p.url, 6);
  const mismos = PLANTELES.filter((x) => x.sis === p.sis && x !== p && x.ficha).map((x) => x.url);
  const hermanos = cercanas(p.coord, p.url, 4, (x) => mismos.includes(x.url));
  const cercaSin = cercanas(p.coord, p.url, 3, (x) => !x.examen && !mismos.includes(x.url));
  const cercaExamen = cercanas(p.coord, p.url, 3, (x) => x.examen);
  const nombre = p.nombre;
  const quien = p.comun;
  const titulo = `${nombre}: ${tecnica ? "carreras, " : ""}dirección y cómo entrar sin examen | ecoems.net`;
  const descripcion = `${nombre} en ${p.municipio}: ${tecnica ? `${pl(p.esp.length, "carrera técnica", "carreras técnicas")} (${p.esp.slice(0, 3).map((e) => e.nombre).join(", ")})` : TIPO[s.tipo]}, dirección, mapa y cómo elegirlo sin examen en Mi Derecho, Mi Lugar.`;
  const m = migas([["Inicio", "/"], ["Escuelas", "/escuelas/"], [s.corto, s.ruta], [quien, ruta]]);
  const faq = [
    [`¿${quien} pide examen?`, `No. ${quien} asigna lugar sin examen dentro de Mi Derecho, Mi Lugar. Se puede elegir en la modalidad 1 (solo escuelas sin examen) o en la modalidad 3 (junto con escuelas de la UNAM o el IPN). El lugar se asigna según el orden de tus opciones y los lugares disponibles.`],
  ];
  if (tecnica) faq.push([`¿Qué carreras técnicas tiene ${quien}?`, `En el proceso 2026 ofreció ${pl(p.esp.length, "carrera", "carreras")}: ${p.esp.map((e) => e.nombre).join(", ")}.`]);
  faq.push([`¿Dónde está ${quien}?`, `En ${p.dirLimpia}, ${lugar(p)}.${p.turno ? ` Solo opera el turno ${p.turno}.` : ""}`]);
  if (tecnica) faq.push([`¿Qué clave tiene ${quien} en el registro?`, `En Mi Derecho, Mi Lugar cada carrera es una opción con su propia clave. En 2026: ${p.esp.map((e) => `${e.nombre} (${e.clave})`).join(", ")}. Las claves pueden cambiar: confírmalas en el buscador oficial antes de registrarte.`]);
  else if (p.clave) faq.push([`¿Qué clave tiene ${quien} en el registro?`, `En el proceso 2026 su clave de opción fue ${p.clave}. Puede cambiar: confírmala en el buscador oficial antes de registrarte.`]);
  faq.push([`¿Qué escuelas hay cerca de ${quien}?`, `${cerca.slice(0, 4).map((x) => `${x.nombre} (${x.d.toFixed(1)} km${x.examen ? ", con examen" : ""})`).join(", ")}.`]);
  if (p.acc) faq.push([`¿${quien} tiene atención a personas con discapacidad?`, `Sí. En el buscador oficial de Mi Derecho, Mi Lugar aparece marcado con atención a personas con discapacidad.`]);

  const cuerpo = `
${cabeceraPagina({
  img,
  migasHtml: m.html,
  linea: "sin",
  h1: `${nombre}: ${tecnica ? "carreras, " : ""}dirección y cómo entrar`,
  lead: `${p.hon ? `${p.hon}. ` : ""}${TIPO[s.tipo].charAt(0).toUpperCase() + TIPO[s.tipo].slice(1)} ${s.largo ? `del ${s.largo}` : `de ${s.nombre}`} en ${p.municipio}. No pide examen: se elige en el registro de Mi Derecho, Mi Lugar.`,
  extra: `
    <div class="ficha">
      <div class="ficha-cifra ficha-meta"><span>Examen</span><b class="ficha-texto">No pide</b><small>Modalidad 1 o 3</small></div>
      <div class="ficha-cifra"><span>${tecnica ? "Carreras técnicas" : "Tipo"}</span><b${tecnica ? "" : ' class="ficha-texto"'}>${tecnica ? p.esp.length : "General"}</b><small>${tecnica ? "en 2026" : "bachillerato"}</small></div>
      <div class="ficha-cifra"><span>Ubicación</span><b class="ficha-texto">${p.municipio}</b><small>${p.entidad === "CDMX" ? "Ciudad de México" : "Estado de México"}</small></div>
      <div class="ficha-cifra"><span>Accesibilidad</span><b class="ficha-texto">${p.acc ? "Sí" : "No indicada"}</b><small>personas con discapacidad</small></div>
    </div>`,
})}

<section class="seccion seccion-blanca" aria-labelledby="t-como-es">
  <div class="contenedor contenedor-angosto prosa">
    <h2 id="t-como-es">Cómo es ${quien}</h2>
    <p>${s.desc}</p>
    ${tecnica ? `<h3>Carreras técnicas de ${quien}</h3>${chips(p.esp)}<p>Cada carrera es una opción distinta en el registro, con su propia clave. Si le interesan dos carreras del mismo plantel, puede poner las dos en su lista.</p>` : `<p>En ${quien} todos los alumnos llevan el mismo plan de bachillerato general, que prepara para seguir a cualquier licenciatura.</p>`}
  </div>
</section>

<section class="seccion" aria-labelledby="t-donde">
  <div class="contenedor rejilla-media">
    <div class="prosa">
      <h2 id="t-donde">Dónde está ${quien}</h2>
      <p class="direccion">${icono("mapa", "ico")}<span>${p.dirLimpia}, ${lugar(p)}.</span></p>
      ${p.turno ? `<p>Según el buscador oficial, este plantel solo opera el turno ${p.turno}.</p>` : ""}
      <p class="acciones-escuela"><a class="boton boton-secundario" href="${comoLlegar(p)}" rel="noopener" target="_blank">${icono("mapa", "ico")}Cómo llegar</a><a class="boton boton-secundario" href="/prepas-cerca-de-mi/">${icono("mapa", "ico")}Prepas cerca de mí</a></p>
    </div>
    ${miniMapa([punto(p, 1), ...cerca.map((x) => [x.coord[0], x.coord[1], x.nombre, x.url, x.tipo, 0, x.linea])], `Mapa de ${quien} y escuelas cercanas`)}
  </div>
</section>

<section class="seccion seccion-blanca" aria-labelledby="t-registro">
  <div class="contenedor contenedor-angosto prosa">
    <h2 id="t-registro">Cómo elegir ${quien} en Mi Derecho, Mi Lugar</h2>
    <p>${quien} no pide examen: asigna lugar por el orden de las opciones de tu registro y los lugares disponibles. Tienes dos caminos:</p>
    <ul>
      <li><b>Modalidad 1:</b> solo escuelas sin examen. Pones ${quien} y otras opciones sin examen en el orden que prefieras.</li>
      <li><b>Modalidad 3:</b> combinas escuelas de la UNAM o el IPN (con examen) con escuelas sin examen como ${quien}. Si no alcanza lugar en las de examen, sigue en las sin examen de su lista.</li>
    </ul>
    <p>Revisa las <a href="/modalidades/">modalidades con examen y sin examen</a> y <a href="/como-elegir-opciones/">cómo elegir y ordenar las opciones del ECOEMS</a> antes de llenar el registro.</p>
    ${tecnica ? `<div class="tabla-envoltura"><table class="tabla-simple"><caption>Claves de opción de ${quien} en 2026</caption><thead><tr><th scope="col">Carrera técnica</th><th scope="col">Clave</th></tr></thead><tbody>${p.esp.map((e) => `<tr><td>${e.nombre}</td><td><code>${e.clave}</code></td></tr>`).join("")}</tbody></table></div>` : p.clave ? `<p>Clave de opción en 2026: <code>${p.clave}</code>.</p>` : ""}
    <p class="nota-tabla">${icono("aviso", "ico")}<span>Datos del ${FUENTE_SIN}. Las claves y carreras pueden cambiar para 2027: confírmalas en <a href="https://www.miderechomilugar.gob.mx/buscador-escuelas" rel="noopener" target="_blank">miderechomilugar.gob.mx</a>.</span></p>
  </div>
</section>

<section class="seccion" aria-labelledby="t-hermanos">
  <div class="contenedor">
    <div class="encabezado-seccion">
      <h2 id="t-hermanos">Otros planteles de ${s.corto} cerca</h2>
      <p>Los planteles de ${s.corto} más cercanos a ${quien}. Puedes poner varios en tu registro.</p>
    </div>
    <ul class="tarjetas-escuela">${hermanos.map((x) => `
      <li><div class="tarjeta-escuela tarjeta-enlace" data-linea="sin">
        <span class="te-linea">${s.corto} · a ${x.d.toFixed(1)} km</span>
        <b><a class="te-enlace" href="${x.url}">${x.nombre}</a></b>
      </div></li>`).join("")}
    </ul>
    <p><a href="${s.ruta}">Ver todos los planteles de ${s.corto}</a></p>
  </div>
</section>

<section class="seccion seccion-blanca" aria-labelledby="t-cerca">
  <div class="contenedor">
    <div class="encabezado-seccion">
      <h2 id="t-cerca">Escuelas cerca de ${quien}</h2>
      <p>Para armar la lista del registro conviene tener varias opciones cercanas. Estas son las más próximas, con y sin examen.</p>
    </div>
    <ul class="tarjetas-escuela">${[...cercaSin, ...cercaExamen].map((x) => `
      <li><div class="tarjeta-escuela tarjeta-enlace" data-linea="${x.linea}">
        <span class="te-linea">${x.tipo}${x.examen ? " · con examen" : " · sin examen"}</span>
        <b><a class="te-enlace" href="${x.url}">${x.nombre}</a></b>
        <span class="te-lugar">A ${x.d.toFixed(1)} km</span>
      </div></li>`).join("")}
    </ul>
  </div>
</section>

<section class="seccion seccion-estudiar" aria-labelledby="t-externos">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-externos">Antes de inscribirse en ${quien}</h2>
    ${caminosExternos(s.ruta, `sin-${p.slug}`)}
  </div>
</section>
${faqSin(faq, `Preguntas sobre ${quien}`)}`;

  const school = {
    "@context": "https://schema.org", "@type": "HighSchool", name: nombre, alternateName: [quien, p.crudo].filter((x, i, a) => a.indexOf(x) === i && x !== nombre),
    parentOrganization: { "@type": "EducationalOrganization", name: s.largo ?? s.nombre },
    address: { "@type": "PostalAddress", streetAddress: p.dirLimpia, addressLocality: p.municipio, addressRegion: p.entidad === "CDMX" ? "Ciudad de México" : "Estado de México", addressCountry: "MX", ...(/C\.P\. (\d{5})/.test(p.dir) ? { postalCode: /C\.P\. (\d{5})/.exec(p.dir)[1] } : {}) },
    geo: { "@type": "GeoCoordinates", latitude: p.coord[0], longitude: p.coord[1] },
    ...(tecnica ? { hasOfferCatalog: { "@type": "OfferCatalog", name: "Carreras técnicas", itemListElement: p.esp.map((e) => ({ "@type": "Offer", itemOffered: { "@type": "EducationalOccupationalProgram", name: e.nombre, programType: "Carrera técnica", educationalCredentialAwarded: "Bachillerato" } })) } } : {}),
    image: `${SITIO.dominio}/img/${IMAGENES[img].archivo}`,
  };
  return {
    META: { ruta, titulo, descripcion }, ACTUALIZADO, nombreCorto: quien, seccion: "escuelas",
    cuerpo: () => cuerpo,
    jsonld: () => [paginaLd({ titulo, ruta, descripcion, imagen: IMAGENES[img] }), m.ld, school, faqLd(faq)],
  };
}

// Preguntas frecuentes con la fuente de los datos sin examen.
function faqSin(preguntas, titulo) {
  return `
<section class="seccion seccion-faq" aria-labelledby="t-faq">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-faq">${titulo}</h2>
    <div class="faq">
      ${preguntas.map(([q, r]) => `<details class="faq-item"><summary>${q}${icono("abajo", "ico")}</summary><p>${r}</p></details>`).join("")}
    </div>
    <p class="actualizado">Actualizado el <time datetime="${ACTUALIZADO_SIN.iso}">${ACTUALIZADO_SIN.texto}</time>. Datos del ${FUENTE_SIN}. ecoems.net no es un sitio oficial.</p>
  </div>
</section>`;
}
const ACTUALIZADO_SIN = { iso: "2026-10-22", texto: "22 de octubre de 2026" };

// ---------- Página de cada institución ----------
const TITULOS = {
  conalep: ["CONALEP CDMX y Edomex: planteles, carreras y cómo entrar", "CONALEP en la Ciudad de México y el Estado de México"],
  bachilleres: ["Colegio de Bachilleres: los 20 planteles y cómo entrar", "Colegio de Bachilleres: los 20 planteles y cómo entrar"],
  dgeti: ["CETIS y CBTIS en CDMX y Edomex: planteles y carreras", "CETIS y CBTIS en la Ciudad de México y el Estado de México"],
  iems: ["IEMS: las prepas del Gobierno de la CDMX y cómo entrar", "IEMS: las preparatorias del Gobierno de la Ciudad de México"],
  cecytem: ["CECyTEM: planteles y carreras en el Valle de México", "CECyTEM: planteles y carreras técnicas en el Valle de México"],
  cobaem: ["COBAEM: planteles del Colegio de Bachilleres del Edomex", "COBAEM: Colegio de Bachilleres del Estado de México"],
  epo: ["Preparatorias Oficiales del Edomex (EPO) sin examen", "Preparatorias Oficiales del Estado de México sin examen"],
  cbt: ["CBT Estado de México: planteles y carreras técnicas", "CBT del Estado de México: planteles y carreras técnicas"],
  tbc: ["Telebachillerato Comunitario en el Valle de México", "Telebachillerato Comunitario en el Valle de México"],
  ceb: ["CEB: Centros de Estudios de Bachillerato (DGB)", "Centros de Estudios de Bachillerato (CEB) de la DGB"],
  cbta: ["CBTA y Centro del Mar: bachillerato agropecuario", "CBTA y Centro del Mar: bachillerato tecnológico agropecuario"],
};

function hub(k) {
  const s = SISTEMAS[k];
  const lista = POR_SISTEMA[k];
  const ruta = s.ruta;
  const img = imgSistema(k);
  const cdmx = lista.filter((p) => p.entidad === "CDMX").length;
  const edomex = lista.length - cdmx;
  const carreras = [...new Set(lista.flatMap((p) => p.esp.map((e) => e.nombre)))].sort((a, b) => a.localeCompare(b, "es"));
  const zonas = [...new Set(lista.map((p) => p.municipio))].sort((a, b) => a.localeCompare(b, "es"));
  const [tCorto, h1] = TITULOS[k];
  const titulo = `${tCorto} | ecoems.net`;
  const donde = cdmx && edomex ? `${pl(cdmx, "en la Ciudad de México", "en la Ciudad de México")} y ${edomex} en el Estado de México` : cdmx ? "todos en la Ciudad de México" : "todos en el Estado de México";
  const descripcion = `Los ${lista.length} planteles de ${s.nombre} en Mi Derecho, Mi Lugar (${donde}): dirección, mapa${carreras.length ? ", carreras técnicas" : ""} y cómo entrar sin examen.`;
  const m = migas([["Inicio", "/"], ["Escuelas", "/escuelas/"], ["Sin examen", "/escuelas/sin-examen/"], [s.corto, ruta]]);
  const ejemplo = lista[0];
  const faq = [
    [`¿Cuántos planteles de ${s.corto} hay en Mi Derecho, Mi Lugar?`, `En el proceso 2026 participaron ${lista.length} planteles de ${s.nombre}: ${donde}.`],
    [`¿${s.corto} pide examen?`, `No. ${s.nombre} asigna lugar sin examen: se elige en la modalidad 1 o en la modalidad 3 de Mi Derecho, Mi Lugar, y el lugar depende del orden de tus opciones y de los lugares disponibles.`],
    [`¿Qué tipo de bachillerato da ${s.corto}?`, s.desc],
  ];
  if (carreras.length) faq.push([`¿Qué carreras técnicas tiene ${s.corto}?`, `Entre todos sus planteles ofrecieron ${carreras.length} carreras en 2026, entre ellas ${carreras.slice(0, 8).join(", ")}. Cada plantel tiene las suyas; revísalas en la lista.`]);
  faq.push([`¿Cómo encuentro el ${s.corto} más cercano a mi casa?`, `Usa el mapa de esta página o la herramienta <a href="/prepas-cerca-de-mi/">Prepas cerca de mí</a>: escribe tu código postal y te muestra las escuelas con y sin examen más cercanas.`]);

  const tarjeta = (p) => `
        <li id="${p.slug}"><div class="tarjeta-escuela tarjeta-zona" data-linea="sin">
          <span class="te-linea">${p.municipio}</span>
          ${p.ficha ? `<a href="${p.url}"><b>${p.nombre}</b></a>` : `<b>${p.nombre}</b>`}
          ${p.hon ? `<span class="te-hon">${p.hon}</span>` : ""}
          <span class="te-dir">${p.dirLimpia}</span>
          ${chips(p.esp, 4)}
          ${!p.esp.length && p.clave ? `<span class="te-clave">Clave 2026: <code>${p.clave}</code></span>` : ""}
          <span class="te-acciones">${p.ficha ? `<a class="te-ficha" href="${p.url}">Ver ficha →</a>` : ""}<a class="te-ruta" href="${comoLlegar(p)}" rel="noopener" target="_blank">${icono("mapa", "ico")}Cómo llegar</a></span>
        </div></li>`;

  const cuerpo = `
${cabeceraPagina({
  img,
  migasHtml: m.html,
  linea: "sin",
  h1,
  lead: `Los ${lista.length} planteles de ${s.nombre} que participan en Mi Derecho, Mi Lugar, con su dirección${carreras.length ? ", sus carreras técnicas" : ""} y cómo elegirlos sin examen.`,
  extra: `
    <div class="ficha">
      <div class="ficha-cifra ficha-meta"><span>Planteles</span><b>${lista.length}</b><small>en el proceso 2026</small></div>
      <div class="ficha-cifra"><span>CDMX</span><b>${cdmx}</b><small>planteles</small></div>
      <div class="ficha-cifra"><span>Edomex</span><b>${edomex}</b><small>planteles</small></div>
      <div class="ficha-cifra"><span>${carreras.length ? "Carreras técnicas" : "Examen"}</span><b${carreras.length ? "" : ' class="ficha-texto"'}>${carreras.length || "No pide"}</b><small>${carreras.length ? "distintas" : "modalidad 1 o 3"}</small></div>
    </div>`,
})}

<section class="seccion seccion-blanca" aria-labelledby="t-que-es">
  <div class="contenedor contenedor-angosto prosa">
    <h2 id="t-que-es">Qué es ${s.nombre}</h2>
    <p>${s.desc}</p>
    <h3>Cómo entrar sin examen</h3>
    <p>${s.nombre} no pide el examen ECOEMS. En el registro de Mi Derecho, Mi Lugar se elige en la <b>modalidad 1</b> (solo escuelas sin examen) o en la <b>modalidad 3</b>, que combina escuelas de la UNAM y el IPN con escuelas sin examen. El lugar se asigna por el orden de las opciones y los lugares disponibles, así que conviene poner primero la que más le interesa. Revisa <a href="/modalidades/">las modalidades del registro</a> y <a href="/como-elegir-opciones/">cómo ordenar las opciones</a>.</p>
    ${carreras.length ? `<h3>Carreras técnicas de ${s.corto}</h3>${chips(carreras)}` : ""}
  </div>
</section>

<section class="seccion" aria-labelledby="t-mapa-sis">
  <div class="contenedor">
    <div class="encabezado-seccion">
      <h2 id="t-mapa-sis">Mapa de los planteles de ${s.corto}</h2>
      <p>Toca un punto para ver el plantel. Para ver también las prepas de la UNAM y las vocacionales del IPN, abre el <a href="/mapa/">mapa de escuelas</a>.</p>
    </div>
    ${miniMapa(lista.map((p) => punto(p, 0)), `Mapa de los planteles de ${s.nombre}`)}
  </div>
</section>

<section class="seccion seccion-blanca" aria-labelledby="t-planteles">
  <div class="contenedor">
    <div class="encabezado-seccion">
      <h2 id="t-planteles">Planteles de ${s.corto} por alcaldía o municipio</h2>
      <div class="buscador-escuelas"><label for="zona">Alcaldía o municipio</label><select id="zona" class="select-grande"><option value="">Todas (${zonas.length})</option>${zonas.map((z) => `<option>${z}</option>`).join("")}</select></div>
    </div>
    ${zonas.map((z) => {
      const es = lista.filter((p) => p.municipio === z);
      return `
    <div class="grupo-escuelas" data-zona="${z}">
      <div class="grupo-cabeza" data-linea="sin"><h3>${s.corto} en ${z}</h3><span>${pl(es.length, "plantel", "planteles")} · ${es[0].entidad === "CDMX" ? "Ciudad de México" : "Estado de México"}</span></div>
      <ul class="tarjetas-escuela">${es.map(tarjeta).join("")}
      </ul>
    </div>`;
    }).join("")}
    <p class="nota-tabla">${icono("aviso", "ico")}<span>Datos del ${FUENTE_SIN}. Confirma claves, carreras y lugares en <a href="https://www.miderechomilugar.gob.mx/buscador-escuelas" rel="noopener" target="_blank">miderechomilugar.gob.mx</a>.</span></p>
  </div>
</section>

<section class="seccion seccion-estudiar" aria-labelledby="t-externos">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-externos">Antes de inscribirse en ${s.corto}</h2>
    ${caminosExternos(ruta, `sin-${k}`)}
  </div>
</section>
${faqSin(faq, `Preguntas sobre ${s.corto}`)}`;

  const ldLista = {
    "@context": "https://schema.org", "@type": "ItemList", name: `Planteles de ${s.nombre} en Mi Derecho, Mi Lugar`, numberOfItems: lista.length,
    itemListElement: lista.map((p, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "HighSchool", name: p.nombre, url: `${SITIO.dominio}${p.url}`, geo: { "@type": "GeoCoordinates", latitude: p.coord[0], longitude: p.coord[1] }, address: { "@type": "PostalAddress", streetAddress: p.dirLimpia, addressLocality: p.municipio, addressRegion: p.entidad === "CDMX" ? "Ciudad de México" : "Estado de México", addressCountry: "MX" } },
    })),
  };
  return {
    META: { ruta, titulo, descripcion }, ACTUALIZADO, nombreCorto: s.corto, seccion: "escuelas",
    cuerpo: () => cuerpo,
    jsonld: () => [paginaLd({ titulo, ruta, descripcion, tipo: "CollectionPage", imagen: IMAGENES[img] }), m.ld, ldLista, faqLd(faq)],
  };
}

export const SISTEMAS_ORDEN = ORDEN;
export function paginas() {
  return [...ORDEN.map(hub), ...PLANTELES.filter((p) => p.ficha).map(ficha)];
}

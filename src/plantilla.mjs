import { icono } from "./iconos.mjs";

export const GA_ID = "G-NWDQM8PQJ6";

export const SITIO = {
  dominio: "https://ecoems.net",
  nombre: "ecoems.net",
  app: "https://ecoems.app/",
  lat: "https://examenes.lat",
};

// UTM solo en enlaces hacia otros sitios del mismo dueño, para medir en su analítica.
export function utm(url, campana) {
  const u = new URL(url);
  u.searchParams.set("utm_source", "ecoems.net");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", campana);
  return u.toString();
}

export const MENU = [
  {
    id: "proceso",
    titulo: "El proceso",
    intro: "Cada paso de Mi Derecho, Mi Lugar explicado en orden, de la Llave MX a la inscripción.",
    columnas: [
      [
        ["ruta", "/que-es-ecoems/", "Qué es el ECOEMS", "El examen y para qué escuelas cuenta"],
        ["ruta", "/mi-derecho-mi-lugar/", "Mi Derecho, Mi Lugar", "Cómo funciona la asignación"],
        ["calendario", "/fechas/", "Fechas y calendario", "Registro, examen y resultados"],
        ["registro", "/registro/", "Registro paso a paso", "Qué datos y documentos piden"],
        ["llave", "/llave-mx/", "Llave MX", "Crear la cuenta sin errores"],
        ["correo", "/correo/", "Correo del registro", "Avisos que no debes perder"],
      ],
      [
        ["examen", "/examen/", "El día del examen", "En línea, navegador seguro y foto"],
        ["opciones", "/modalidades/", "Modalidades", "Con examen, sin examen o ambas"],
        ["opciones", "/como-elegir-opciones/", "Cómo elegir opciones", "El orden que más conviene"],
        ["resultados", "/resultados/", "Resultados", "Cuándo salen y cómo leerlos"],
        ["apoyo", "/no-quede/", "Si no quedó", "Segunda vuelta y lugares libres"],
      ],
    ],
  },
  {
    id: "escuelas",
    titulo: "Aciertos y escuelas",
    intro: "Los aciertos 2024, 2025 y 2026 de cada prepa, CCH y vocacional, con su meta para 2027.",
    columnas: [
      [
        ["aciertos", "/aciertos/", "Aciertos por escuela", "Tabla completa de la UNAM y el IPN"],
        ["escuela", "/escuelas/", "Todas las escuelas", "Buscador y listado"],
        ["sin_examen", "/escuelas/sin-examen/", "Escuelas sin examen", "Opciones de la modalidad 1"],
      ],
      [
        ["escuela", "/escuelas/prepas-unam/", "Prepas UNAM", "Las 9 de la ENP"],
        ["escuela", "/escuelas/cch-unam/", "CCH UNAM", "Los 5 planteles"],
        ["escuela", "/escuelas/vocacionales-ipn/", "Vocacionales IPN", "CECyT y CET 1"],
      ],
    ],
  },
  {
    id: "herramientas",
    titulo: "Herramientas",
    intro: "Calcula, ubica y compara antes de llenar el registro.",
    columnas: [
      [
        ["mapa", "/prepas-cerca-de-mi/", "Prepas cerca de mí", "¿Qué escuela le conviene?"],
        ["calculadora", "/calculadora/", "Calculadora de aciertos", "¿Qué escuelas le alcanzan?"],
        ["escuela", "/mapa/", "Escuelas por alcaldía", "Prepas, CCH y vocas por zona"],
      ],
      [
        ["comparar", "/comparador/", "Comparador", "Dos o tres escuelas lado a lado"],
        ["opciones", "/armar-opciones/", "Armar mis opciones", "Ordena y descarga tu lista"],
      ],
    ],
  },
];

function megaPanel(m) {
  const cols = m.columnas
    .map(
      (col) =>
        `<ul class="mega-col">${col
          .map(
            ([ic, href, t, d]) =>
              `<li><a class="mega-link" href="${href}">${icono(ic, "ico mega-ico")}<span><b>${t}</b><small>${d}</small></span></a></li>`,
          )
          .join("")}</ul>`,
    )
    .join("");
  return `<div class="mega" id="mega-${m.id}" hidden><div class="mega-in"><p class="mega-intro">${m.intro}</p>${cols}</div></div>`;
}

export function encabezado(actual = "") {
  const items = MENU.map(
    (m) =>
      `<li class="nav-item"><button class="nav-btn" type="button" aria-expanded="false" aria-controls="mega-${m.id}"${actual === m.id ? ' aria-current="true"' : ""}>${m.titulo}${icono("abajo", "ico nav-flecha")}</button>${megaPanel(m)}</li>`,
  ).join("");
  return `
<a class="saltar" href="#contenido">Saltar al contenido</a>
<header class="cabecera">
  <div class="cabecera-in">
    <a class="logo" href="/" aria-label="ecoems.net, inicio">
      <svg class="logo-marca" viewBox="0 0 40 40" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="11" fill="var(--verde)"/><path d="M9 26h22" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="13" cy="26" r="3.6" fill="#fff"/><circle cx="20" cy="26" r="3.6" fill="var(--sol)" stroke="#fff" stroke-width="2"/><circle cx="27" cy="26" r="3.6" fill="#fff"/><path d="M13 15h14" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/></svg>
      <span class="logo-texto">ecoems<span>.net</span></span>
    </a>
    <nav class="nav" aria-label="Principal">
      <ul class="nav-lista">${items}<li class="nav-item"><a class="nav-btn" href="/preguntas-frecuentes/">Preguntas</a></li></ul>
    </nav>
    <a class="boton boton-cabecera" href="${utm(SITIO.app, "cabecera")}">Diagnóstico gratis</a>
    <button class="menu-movil" type="button" aria-expanded="false" aria-controls="cajon" aria-label="Abrir menú">${icono("menu")}</button>
  </div>
  <div class="cajon" id="cajon" hidden>
    <div class="cajon-in">
      ${MENU.map(
        (m) =>
          `<details class="cajon-grupo"><summary>${m.titulo}${icono("abajo", "ico")}</summary><ul>${m.columnas
            .flat()
            .map(([ic, href, t]) => `<li><a href="${href}">${icono(ic)}<span>${t}</span></a></li>`)
            .join("")}</ul></details>`,
      ).join("")}
      <a class="cajon-suelto" href="/preguntas-frecuentes/">${icono("pregunta")}<span>Preguntas frecuentes</span></a>
      <a class="boton boton-bloque" href="${utm(SITIO.app, "menu-movil")}">Diagnóstico gratis en ecoems.app</a>
    </div>
  </div>
</header>`;
}

export function pie() {
  const anio = new Date().getFullYear();
  const col = (t, links) => `<div class="pie-col"><p class="pie-titulo">${t}</p><ul>${links.map(([h, x]) => `<li><a href="${h}">${x}</a></li>`).join("")}</ul></div>`;
  return `
<footer class="pie">
  <div class="pie-in">
    <div class="pie-marca">
      <a class="logo logo-pie" href="/"><span class="logo-texto">ecoems<span>.net</span></span></a>
      <p>Guía independiente del proceso ECOEMS y Mi Derecho, Mi Lugar para familias de la Ciudad de México y el Estado de México.</p>
      <p class="pie-aviso">${icono("aviso")}<span><b>No somos un sitio oficial.</b> El registro, las fechas y la asignación se hacen solo en <a href="https://www.miderechomilugar.gob.mx/" rel="noopener" target="_blank">miderechomilugar.gob.mx</a>.</span></p>
    </div>
    ${col("El proceso", [["/que-es-ecoems/", "Qué es el ECOEMS"], ["/mi-derecho-mi-lugar/", "Mi Derecho, Mi Lugar"], ["/fechas/", "Fechas"], ["/registro/", "Registro"], ["/examen/", "El examen"], ["/resultados/", "Resultados"]])}
    ${col("Escuelas", [["/aciertos/", "Aciertos por escuela"], ["/escuelas/prepas-unam/", "Prepas UNAM"], ["/escuelas/cch-unam/", "CCH UNAM"], ["/escuelas/vocacionales-ipn/", "Vocacionales IPN"], ["/escuelas/sin-examen/", "Sin examen"]])}
    ${col("Para estudiar", [[utm(`${SITIO.lat}/mx/comipems/`, "pie"), "Examen simulacro ECOEMS gratis"], [utm(`${SITIO.lat}/mx/guias/comipems-ecoems/`, "pie"), "Guía ECOEMS con temario"], [utm(SITIO.app, "pie"), "Diagnóstico ECOEMS gratis"], [utm(`${SITIO.lat}/noticias/mx/convocatorias/convocatoria-ecoems/`, "pie"), "Convocatoria ECOEMS 2027"]])}
  </div>
  <div class="pie-legal">
    <p>© ${anio} ecoems.net · Ibertelcom Digital</p>
    <p><a href="/contacto/">Contacto</a><a href="/aviso-de-privacidad/">Aviso de privacidad</a><a href="/preguntas-frecuentes/">Preguntas frecuentes</a></p>
  </div>
</footer>`;
}

export function documento({ titulo, descripcion, ruta, cuerpo, jsonld = [], og = "/img/og-ecoems-net.png", seccion = "", css, js, fragmento = false, nombreCorto = "" }) {
  const canonica = `${SITIO.dominio}${ruta}`;
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  const estilos = css.inline ? `<style>${css.inline}</style>` : `<link rel="stylesheet" href="${css.href}">`;
  const script = js.inline ? `<script>${js.inline}</script>` : `<script src="${js.src}" defer></script>`;
  if (fragmento) {
    // Vista previa para publicar como artifact: sin doctype/html/body (el visor pone el esqueleto).
    return `<title>${nombreCorto}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap">
<script>document.documentElement.classList.add("js")</script>
${estilos}
${ld}
${encabezado(seccion)}
<main id="contenido">
${cuerpo}
</main>
${pie()}
${script}`;
  }
  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add("js")</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<meta name="description" content="${descripcion}">
<link rel="canonical" href="${canonica}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0B7A60">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_MX">
<meta property="og:site_name" content="ecoems.net">
<meta property="og:title" content="${titulo}">
<meta property="og:description" content="${descripcion}">
<meta property="og:url" content="${canonica}">
<meta property="og:image" content="${SITIO.dominio}${og}">
<meta name="twitter:card" content="summary_large_image">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GA_ID}");</script>
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap">
${estilos}
${ld}
</head>
<body>
${encabezado(seccion)}
<main id="contenido">
${cuerpo}
</main>
${pie()}
${script}
</body>
</html>`;
}

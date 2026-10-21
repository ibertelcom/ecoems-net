// Una página por escuela: /escuelas/<slug>/
import { ESCUELAS, PREGUNTAS_EXAMEN, MARGEN_TEPO, grupoDe, parecidas } from "../datos.mjs";
import { caminosExternos } from "../externos.mjs";
import { icono } from "../iconos.mjs";
import { imagen, registrar, IMAGENES } from "../imagenes.mjs";
import { SITIO, utm } from "../plantilla.mjs";
import { migas, cabeceraPagina, faqBloque, faqLd, paginaLd, cambio, ACTUALIZADO } from "../componentes.mjs";

const HUB = { enp: "/escuelas/prepas-unam/", cch: "/escuelas/cch-unam/", voca: "/escuelas/vocacionales-ipn/" };

// Qué es cada tipo de bachillerato, en palabras para papás.
const LINEA_TEXTO = {
  enp: (e) => `La ${e.comun} es uno de los nueve planteles de la Escuela Nacional Preparatoria de la UNAM. El bachillerato dura tres años, con un plan anual, y en el último año el alumno elige un área de estudio según la carrera que le interesa. Al terminar, puede seguir a una licenciatura de la UNAM por pase reglamentado si cumple los requisitos de promedio y tiempo.`,
  cch: (e) => `El ${e.comun} es uno de los cinco planteles del Colegio de Ciencias y Humanidades de la UNAM. El bachillerato dura tres años en seis semestres, con un modelo que da mucho peso a la investigación y al trabajo propio del alumno. Al terminar, puede seguir a una licenciatura de la UNAM por pase reglamentado si cumple los requisitos de promedio y tiempo.`,
  voca: (e) =>
    `La ${e.comun} es ${e.subsistema === "CET" ? "el Centro de Estudios Tecnológicos" : "un Centro de Estudios Científicos y Tecnológicos"} del Instituto Politécnico Nacional. Es un bachillerato bivalente de tres años: al terminar, el alumno recibe el certificado de bachillerato y además una carrera técnica.${e.area ? ` Pertenece al área de ${e.area}, que orienta hacia las licenciaturas del IPN de esa misma área.` : ""}`,
};

function articulo(e) { return /^(CCH|CET)/.test(e.comun) ? "el" : "la"; }
function Art(e) { return articulo(e) === "el" ? "El" : "La"; }
function del(e) { return articulo(e) === "el" ? `del ${e.comun}` : `de la ${e.comun}`; }

function grafica(e) {
  const anios = [["2024", e.a2024], ["2025", e.a2025], ["2026", e.a2026], ["Meta 2027", e.meta]];
  const min = Math.min(e.a2024, e.a2025, e.a2026) - 12;
  const max = e.meta + 4;
  const y = (v) => 150 - ((v - min) / (max - min)) * 130;
  const ancho = 74;
  const barras = anios
    .map(([t, v], i) => {
      const x = 22 + i * 96;
      const meta = i === 3;
      return `<g class="g-barra${meta ? " g-meta" : ""}"><rect x="${x}" y="${y(v).toFixed(1)}" width="${ancho}" height="${(160 - y(v)).toFixed(1)}" rx="8"/><text class="g-valor" x="${x + ancho / 2}" y="${(y(v) - 9).toFixed(1)}" text-anchor="middle">${v}</text><text class="g-anio" x="${x + ancho / 2}" y="182" text-anchor="middle">${t}</text></g>`;
    })
    .join("");
  return `<svg class="grafica" viewBox="0 0 400 192" role="img" aria-label="Aciertos ${del(e)}: ${e.a2024} en 2024, ${e.a2025} en 2025, ${e.a2026} en 2026 y meta Tepo de ${e.meta} para 2027"><line class="g-base" x1="10" y1="160" x2="390" y2="160"/>${barras}</svg>`;
}

function preguntas(e, g) {
  const c = cambio(e.a2025, e.a2026);
  const p = [
    [`¿Cuántos aciertos pide ${articulo(e)} ${e.comun} en el ECOEMS?`,
      `En 2026 ${articulo(e)} ${e.doble} pidió ${e.a2026} aciertos de ${PREGUNTAS_EXAMEN}. Fueron los aciertos del último alumno que alcanzó lugar ese año; en 2025 fueron ${e.a2025} y en 2024, ${e.a2024}.`],
    [`¿Cuántos aciertos conviene sacar para entrar a ${articulo(e)} ${e.comun} en 2027?`,
      `Sugerimos una meta de ${e.meta} aciertos: los ${e.a2026} de 2026 más ${MARGEN_TEPO}. Los aciertos cambian un poco cada año (de 2025 a 2026 ${c.d === 0 ? "se quedaron igual" : `fueron ${c.texto}`}), y llegar arriba del último dato da margen.`],
  ];
  if (e.alcaldia) {
    p.push([`¿Dónde está ${articulo(e)} ${e.comun}?`,
      `${Art(e)} ${e.comun} está en ${e.alcaldia}, ${e.entidad === "CDMX" ? "Ciudad de México" : e.entidad}${e.direccion ? `: ${e.direccion}` : ""}.${e.direccionVerificada ? "" : " Confirma la dirección exacta en el sitio oficial del plantel."}`]);
  }
  if (e.linea === "voca" && e.carreras.length) {
    p.push([`¿Qué carreras técnicas tiene ${articulo(e)} ${e.comun}?`, `${e.carreras.join(", ")}.`]);
  }
  p.push([`¿Se puede entrar a ${articulo(e)} ${e.comun} sin examen?`,
    `No. ${Art(e)} ${e.comun} es de ${e.institucion === "UNAM" ? "la UNAM" : "el IPN"}, y estas escuelas asignan lugar solo por aciertos en el examen ECOEMS. Para elegirla hay que registrarse en la modalidad 2 o 3 de Mi Derecho, Mi Lugar.`]);
  return p;
}

function pagina(e) {
  const g = grupoDe(e);
  const ruta = `/escuelas/${e.slug}/`;
  const c25 = cambio(e.a2024, e.a2025);
  const c26 = cambio(e.a2025, e.a2026);
  const vecinas = parecidas(e, 4);
  const img = registrar(`fachada-${e.slug}`, {
    archivo: `${e.slug}-${e.institucion === "UNAM" ? "unam" : "ipn"}-ecoems.webp`,
    ancho: 1200, alto: 800,
    alt: `Ilustración ${del(e)} (${e.oficial}) ${e.institucion === "UNAM" ? "de la UNAM" : "del IPN"} con su escudo${e.alcaldia ? `, en ${e.alcaldia}` : ""}`,
    title: `${e.doble}${e.alcaldia ? `, ${e.alcaldia}` : ""}`,
    descripcion: `Portada ilustrada ${del(e)} con su escudo, su nombre y estudiantes llegando por la mañana.`,
    prompt: "",
    uso: `Escuela · ${e.doble}`,
  });
  const titulo = `${e.doble}: cuántos aciertos pide en el ECOEMS 2027 | ecoems.net`;
  const descripcion = `${Art(e)} ${e.doble} pidió ${e.a2026} aciertos en 2026 (${e.a2025} en 2025). Meta Tepo 2027: ${e.meta}. Ubicación${e.linea === "voca" ? ", carreras técnicas" : ""} y escuelas con aciertos parecidos.`;
  const m = migas([["Inicio", "/"], ["Escuelas", "/escuelas/"], [g.titulo, HUB[e.linea]], [e.comun, ruta]]);
  const preg = preguntas(e, g);
  const mapa = e.direccion && e.direccionVerificada
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.honorifico ?? e.doble}, ${e.direccion}, ${e.alcaldia}`)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.honorifico ?? e.doble}, ${e.alcaldia ?? ""}`)}`;

  const cuerpo = `
${cabeceraPagina({
  img,
  migasHtml: m.html,
  linea: e.linea,
  h1: `¿Cuántos aciertos pide ${articulo(e)} ${e.doble}?`,
  lead: `${e.honorifico ? `${e.honorifico}. ` : ""}Aciertos del ECOEMS 2024, 2025 y 2026, la meta para 2027 y lo que necesitas saber antes de ponerla en el registro de Mi Derecho, Mi Lugar.`,
  extra: `
    <div class="ficha">
      <div class="ficha-cifra"><span>Aciertos 2026</span><b>${e.a2026}</b><small>de ${PREGUNTAS_EXAMEN}</small></div>
      <div class="ficha-cifra ficha-meta"><span>Meta Tepo 2027</span><b>${e.meta}</b><small>2026 + ${MARGEN_TEPO}</small></div>
      <div class="ficha-cifra"><span>Lugar en ${g.titulo}</span><b>${e.lugarLinea}<i>/${e.totalLinea}</i></b><small>por aciertos 2026</small></div>
      <div class="ficha-cifra"><span>Ubicación</span><b class="ficha-texto">${e.alcaldia ?? "Por confirmar"}</b><small>${e.entidad === "CDMX" ? "Ciudad de México" : (e.entidad ?? "")}</small></div>
    </div>`,
})}

<section class="seccion" aria-labelledby="t-aciertos-escuela">
  <div class="contenedor rejilla-media">
    <div class="prosa">
      <h2 id="t-aciertos-escuela">Aciertos ${del(e)} en los últimos tres años</h2>
      <p>${Art(e)} ${e.doble} pidió <b>${e.a2026} aciertos en 2026</b>. Es el puntaje con el que entró el último alumno asignado; cualquiera con más aciertos que eligió esta escuela antes que otra también alcanzó lugar.</p>
      <p>De 2024 a 2025 los aciertos ${c25.d === 0 ? "no cambiaron" : `fueron ${c25.texto} (${e.a2024} → ${e.a2025})`}, y de 2025 a 2026 ${c26.d === 0 ? "se quedaron igual" : `fueron ${c26.texto} (${e.a2025} → ${e.a2026})`}. Por eso conviene apuntar a la <b>meta Tepo de ${e.meta} aciertos</b> para el ECOEMS 2027, y no al número exacto del año pasado.</p>
      <p>En todo el proceso, ${articulo(e)} ${e.comun} quedó en el <b>lugar ${e.lugar} de ${ESCUELAS.length}</b> escuelas de la UNAM y el IPN por aciertos pedidos. Revisa <a href="/aciertos/">cuántos aciertos pide cada escuela del ECOEMS</a>.</p>
    </div>
    <figure class="figura figura-grafica" data-linea="${e.linea}">${grafica(e)}<figcaption>Aciertos mínimos de asignación por año y meta sugerida para 2027.</figcaption></figure>
  </div>
</section>

<section class="seccion seccion-blanca" aria-labelledby="t-escuela">
  <div class="contenedor contenedor-angosto">
    <div class="prosa">
      <h2 id="t-escuela">Cómo es ${articulo(e)} ${e.comun} y dónde está</h2>
      <p>${LINEA_TEXTO[e.linea](e)}</p>
      ${e.linea === "voca" && e.carreras.length ? `<h3>Carreras técnicas</h3><ul class="chips">${e.carreras.map((c) => `<li>${c.replace(/^Técnico (en )?/, "")}</li>`).join("")}</ul>` : ""}
      <h3>Ubicación</h3>
      <p class="direccion">${icono("mapa", "ico")}<span>${e.direccion ? `${e.direccion}, ` : ""}${e.alcaldia ?? ""}${e.entidad ? `, ${e.entidad === "CDMX" ? "Ciudad de México" : e.entidad}` : ""}.${e.direccionVerificada ? "" : " Confirma el número exacto en el sitio oficial del plantel."}</span></p>
      <p class="acciones-escuela"><a class="boton boton-secundario" href="${mapa}" rel="noopener" target="_blank">${icono("mapa", "ico")}Cómo llegar</a>${e.sitio ? `<a class="boton boton-secundario" href="${e.sitio}" rel="noopener" target="_blank">${icono("externo", "ico")}Sitio oficial</a>` : ""}</p>
    </div>
  </div>
</section>

<section class="seccion" aria-labelledby="t-parecidas">
  <div class="contenedor">
    <div class="encabezado-seccion">
      <h2 id="t-parecidas">Escuelas con aciertos parecidos ${articulo(e) === "el" ? "al" : "a la"} ${e.comun}</h2>
      <p>Si los aciertos de tu hijo o hija andan cerca de los ${e.a2026}, estas escuelas pidieron un puntaje similar en 2026. Sirven para armar opciones alcanzables en el registro.</p>
    </div>
    <ul class="tarjetas-escuela">
      ${vecinas.map((v) => `
      <li><div class="tarjeta-escuela tarjeta-enlace" data-linea="${v.linea}">
        <span class="te-linea">${grupoDe(v).titulo}</span>
        <b><a class="te-enlace" href="/escuelas/${v.slug}/">${v.doble}</a></b>
        <span class="te-cifras"><span><i>2026</i>${v.a2026}</span><span class="te-meta"><i>Meta</i>${v.meta}</span></span>
        <span class="te-lugar">${v.alcaldia ?? ""}</span>
      </div></li>`).join("")}
    </ul>
  </div>
</section>

<section class="seccion seccion-estudiar" aria-labelledby="t-alcanza">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-alcanza">¿Le alcanza para ${articulo(e)} ${e.comun}?</h2>
    <p>Para saberlo hay que comparar sus aciertos de hoy con los ${e.meta} de la meta. Puedes empezar gratis por cualquiera de estos dos caminos:</p>
    ${caminosExternos(ruta, `escuela-${e.slug}`, { diag: `Al terminar ves sus aciertos estimados contra ${articulo(e)} ${e.comun} y cuántos le faltan para la meta de ${e.meta}.`, simulador: `Simuladores por materia para subir los aciertos que pide ${articulo(e)} ${e.comun}.` })}
  </div>
</section>

<div class="anuncio" data-anuncio="escuela-1" hidden></div>
${faqBloque(preg, `Preguntas sobre ${articulo(e)} ${e.comun}`)}`;

  const school = {
    "@context": "https://schema.org",
    "@type": "HighSchool",
    name: e.honorifico ?? e.doble,
    alternateName: [e.comun, e.oficial],
    parentOrganization: { "@type": "CollegeOrUniversity", name: e.institucion === "UNAM" ? "Universidad Nacional Autónoma de México" : "Instituto Politécnico Nacional" },
    ...(e.direccionVerificada && e.direccion ? { address: { "@type": "PostalAddress", streetAddress: e.direccion, addressLocality: e.alcaldia, addressRegion: e.entidad === "CDMX" ? "Ciudad de México" : e.entidad, addressCountry: "MX" } } : {}),
    ...(e.sitio ? { sameAs: [e.sitio] } : {}),
    image: `${SITIO.dominio}/img/${IMAGENES[img].archivo}`,
  };

  return {
    META: { ruta, titulo, descripcion },
    ACTUALIZADO,
    nombreCorto: `Aciertos ${e.comun}`,
    seccion: "escuelas",
    cuerpo: () => cuerpo,
    jsonld: () => [paginaLd({ titulo, ruta, descripcion, imagen: IMAGENES[img] }), m.ld, school, faqLd(preg)],
  };
}

export function paginas() {
  return ESCUELAS.map(pagina);
}

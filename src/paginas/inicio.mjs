import { ESCUELAS, GRUPOS, RESUMEN, PREGUNTAS_EXAMEN, MARGEN_TEPO } from "../datos.mjs";
import { caminosExternos } from "../externos.mjs";
import { icono } from "../iconos.mjs";
import { imagen } from "../imagenes.mjs";
import { SITIO, utm } from "../plantilla.mjs";

export const ACTUALIZADO = { iso: "2026-10-15", texto: "15 de octubre de 2026" };

export const META = {
  ruta: "/",
  titulo: "ECOEMS 2027: aciertos por escuela, fechas y proceso | ecoems.net",
  descripcion:
    "Guía del ECOEMS 2027 para papás: cómo funciona Mi Derecho, Mi Lugar, cuántos aciertos pidió cada prepa, CCH y vocacional en 2026 y la meta para entrar.",
};

// Paradas del proceso. Fechas de 2026 como referencia (convocatoria 2026); 2027 aún no se publica.
const RUTA = [
  { ic: "llave", t: "Llave MX y registro", d: "Se crea la Llave MX y se llena el registro en miderechomilugar.gob.mx.", ref: "2026: del 17 de marzo al 14 de abril", href: "/registro/" },
  { ic: "opciones", t: "Elegir opciones", d: "Se elige la modalidad y se ordenan las escuelas, de la más deseada a la menos.", ref: "Durante el registro", href: "/como-elegir-opciones/" },
  { ic: "registro", t: "Concluir registro y pagar", d: "Quien va por UNAM o IPN termina su registro para examen y paga el derecho.", ref: "2026: del 18 al 22 de mayo", href: "/registro/" },
  { ic: "examen", t: "Examen en línea", d: "128 preguntas. Antes hay un simulador oficial para probar el equipo.", ref: "2026: del 20 al 28 de junio", href: "/examen/" },
  { ic: "resultados", t: "Resultados", d: "Se publica la escuela asignada a cada aspirante y sus aciertos.", ref: "2026: 18 de agosto", href: "/resultados/" },
  { ic: "apoyo", t: "Inscripción o plan B", d: "Inscribirse en la escuela asignada o buscar lugares libres.", ref: "2026: finales de agosto", href: "/no-quede/" },
];

export const PREGUNTAS = [
  ["¿Qué es el ECOEMS?",
    "Es el examen de admisión que aplican la UNAM y el IPN para asignar lugar en sus prepas, CCH y vocacionales de la Ciudad de México y el Estado de México. Forma parte del proceso Mi Derecho, Mi Lugar, que desde 2025 sustituye al antiguo concurso COMIPEMS."],
  ["¿Cuándo es el examen ECOEMS 2027?",
    "La convocatoria 2027 todavía no se publica. Como referencia, en 2026 el registro fue del 17 de marzo al 14 de abril y el examen en línea del 20 al 28 de junio. En cuanto salga la convocatoria oficial actualizamos el calendario."],
  ["¿Cuántas preguntas tiene el examen ECOEMS?",
    `${PREGUNTAS_EXAMEN} preguntas de opción múltiple. Los aciertos de cada aspirante se comparan con los de los demás para asignar los lugares de cada escuela.`],
  ["¿Cuántos aciertos pide la UNAM?",
    `Depende de la escuela. En 2026 la ${RESUMEN.mayor.doble} pidió ${RESUMEN.mayor.a2026} aciertos, la más alta, y los CCH entre 85 y 97. No es un número fijo: es el puntaje del último alumno que alcanzó lugar ese año.`],
  ["¿Todas las escuelas piden examen?",
    "No. Solo las escuelas de la UNAM y del IPN asignan por examen. El resto de las opciones del proceso (COLBACH, CONALEP, DGETI, IEMS y otras) asignan sin examen, por el orden de opciones y los lugares disponibles."],
  ["¿Qué es la meta Tepo?",
    `Es la meta que sugerimos para 2027: los aciertos de 2026 de cada escuela más ${MARGEN_TEPO}. Los aciertos cambian un poco cada año; ir por arriba del último dato da más margen para quedar en las primeras opciones.`],
  ["¿ecoems.net es la página oficial?",
    "No. Es una guía independiente para familias. El registro, las fechas y la asignación se hacen solo en miderechomilugar.gob.mx."],
];

function buscador() {
  const opciones = GRUPOS.map(
    (g) => `<optgroup label="${g.titulo}">${g.escuelas.map((e) => `<option value="${e.slug}">${e.doble}</option>`).join("")}</optgroup>`,
  ).join("");
  return `
<form class="consulta" id="consulta" action="/aciertos/" method="get">
  <label class="consulta-label" for="consulta-escuela">¿Cuántos aciertos pide la escuela que quieren?</label>
  <div class="consulta-fila">
    <span class="consulta-campo">${icono("buscar", "ico consulta-ico")}
      <select id="consulta-escuela" name="escuela">
        <option value="">Elige una prepa, CCH o vocacional</option>
        ${opciones}
      </select>
    </span>
    <button class="boton" type="submit">Ver aciertos</button>
  </div>
  <div class="consulta-resultado" id="consulta-resultado" aria-live="polite" hidden></div>
</form>`;
}

function ruta() {
  const paradas = RUTA.map(
    (p, i) => `
    <li class="parada" style="--i:${i}">
      <a class="parada-link" href="${p.href}">
        <span class="parada-punto" aria-hidden="true"><span>${i + 1}</span></span>
        <span class="parada-cuerpo">
          ${icono(p.ic, "ico parada-ico")}
          <b class="parada-titulo">${p.t}</b>
          <span class="parada-texto">${p.d}</span>
          <span class="parada-ref">${p.ref}</span>
        </span>
      </a>
    </li>`,
  ).join("");
  return `
<section class="seccion seccion-ruta" aria-labelledby="t-ruta">
  <div class="contenedor">
    <div class="encabezado-seccion">
      <h2 id="t-ruta">La ruta del proceso ECOEMS, parada por parada</h2>
      <p>Así avanza Mi Derecho, Mi Lugar desde que creas la Llave MX hasta que tu hijo o hija se inscribe. Toca cada parada para ver el paso completo.</p>
    </div>
    <ol class="ruta" id="ruta">${paradas}</ol>
    <p class="nota-ruta">${icono("calendario", "ico")}<span>Las fechas del ECOEMS 2027 aún no se publican. Mostramos las de 2026 como referencia y actualizamos el calendario en cuanto salga la convocatoria oficial. <a href="/fechas/">Ver el calendario completo</a>.</span></p>
  </div>
</section>`;
}

function tablaAciertos() {
  const pestanas = GRUPOS.map(
    (g, i) =>
      `<button class="pestana" type="button" role="tab" id="tab-${g.clave}" aria-controls="panel-${g.clave}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-linea="${g.clave}">${g.titulo}<small>${g.escuelas.length}</small></button>`,
  ).join("");
  const paneles = GRUPOS.map(
    (g, i) => `
    <div class="panel" role="tabpanel" id="panel-${g.clave}" aria-labelledby="tab-${g.clave}" data-linea="${g.clave}"${i === 0 ? "" : " hidden"}>
      <p class="panel-sub">${g.sub}</p>
      <ul class="barras">
        ${g.escuelas
          .map(
            (e) => `
        <li class="barra">
          <a class="barra-nombre" href="/escuelas/${e.slug}/">${e.comun}${e.comun !== e.oficial ? ` <small>${e.oficial}</small>` : ""}</a>
          <span class="barra-pista" aria-hidden="true"><span class="barra-relleno" style="--v:${((e.a2026 / PREGUNTAS_EXAMEN) * 100).toFixed(1)}%"></span><span class="barra-meta" style="--m:${((e.meta / PREGUNTAS_EXAMEN) * 100).toFixed(1)}%"></span></span>
          <span class="barra-cifra"><b>${e.a2026}</b><span class="barra-tepo" title="Meta Tepo 2027">meta ${e.meta}</span></span>
        </li>`,
          )
          .join("")}
      </ul>
    </div>`,
  ).join("");
  return `
<section class="seccion seccion-aciertos" aria-labelledby="t-aciertos">
  <div class="contenedor rejilla-aciertos">
    <div class="aciertos-texto">
      <h2 id="t-aciertos">Cuántos aciertos pidió cada escuela en el ECOEMS 2026</h2>
      <p>Estos son los aciertos con los que entró el último alumno asignado a cada escuela de la UNAM y del IPN en 2026, de ${PREGUNTAS_EXAMEN} posibles. Es la mejor referencia para saber cuántos aciertos pide la prepa, el CCH o la vocacional que quiere tu hijo o hija.</p>
      <p>La escuela más pedida fue la <a href="/escuelas/${RESUMEN.mayor.slug}/">${RESUMEN.mayor.doble}</a>, con ${RESUMEN.mayor.a2026} aciertos. La línea punteada marca la <b>meta Tepo 2027</b>: los aciertos de 2026 más ${MARGEN_TEPO}, para llegar con margen.</p>
      <a class="enlace-fuerte" href="/aciertos/">Ver la tabla 2024, 2025 y 2026 de las ${ESCUELAS.length} escuelas ${icono("flecha", "ico")}</a>
    </div>
    <div class="aciertos-tabla">
      <div class="pestanas" role="tablist" aria-label="Tipo de escuela">${pestanas}</div>
      ${paneles}
      <p class="leyenda"><span class="leyenda-barra"></span>Aciertos 2026 <span class="leyenda-meta"></span>Meta Tepo 2027</p>
    </div>
  </div>
</section>`;
}

function queEs() {
  return `
<section class="seccion seccion-que-es" aria-labelledby="t-que-es">
  <div class="contenedor rejilla-media">
    <div class="prosa">
      <h2 id="t-que-es">¿Qué es el ECOEMS y cómo se relaciona con Mi Derecho, Mi Lugar?</h2>
      <p>El <b>ECOEMS</b> es el examen de admisión con el que la UNAM y el IPN asignan lugar en sus escuelas de bachillerato de la Zona Metropolitana del Valle de México. Mucha gente lo sigue llamando examen COMIPEMS, porque así se llamó el concurso hasta 2024.</p>
      <p>Desde 2025 todo el proceso de admisión a la prepa en la Ciudad de México y el Estado de México se hace en <b>Mi Derecho, Mi Lugar</b>: ahí se registra el aspirante, elige sus opciones y consulta su resultado. El examen ECOEMS solo cuenta para las escuelas de la UNAM y del IPN; las demás opciones asignan lugar sin examen.</p>
      <h3>Las tres modalidades de registro</h3>
      <ul class="modalidades">
        <li><b>Modalidad 1, sin examen.</b> De 5 a 10 opciones de escuelas que asignan por orden de opciones y lugares disponibles.</li>
        <li><b>Modalidad 2, con examen.</b> Hasta 5 escuelas del IPN y 5 de la UNAM, asignadas por aciertos.</li>
        <li><b>Modalidad 3, ambas.</b> Escuelas con y sin examen, hasta 20 opciones; si no alcanza lugar en UNAM o IPN, entra a una opción sin examen.</li>
      </ul>
      <p>Para la UNAM y el IPN se pide además un promedio mínimo de 7.0 en secundaria. <a href="/modalidades/">Cómo elegir la modalidad que le conviene</a>.</p>
    </div>
    <figure class="figura">${imagen("ruta-del-proceso-ecoems", { tamanos: "(min-width: 960px) 45vw, 100vw" })}<figcaption>El examen ECOEMS es la puerta a las prepas y CCH de la UNAM y a las vocacionales del IPN.</figcaption></figure>
  </div>
</section>`;
}

function herramientas() {
  const h = [
    ["calculadora", "herramienta-calculadora-aciertos", "/calculadora/", "Calculadora de aciertos", "Escribe los aciertos de su último simulacro y ve qué escuelas le alcanzan, cuáles están en la orilla y cuáles necesitan más estudio."],
    ["mapa", "herramienta-mapa-escuelas", "/mapa/", "Mapa de escuelas", "Ubica las prepas, CCH y vocacionales cerca de tu casa y calcula cuánto tardaría en llegar."],
    ["comparar", "herramienta-comparador-escuelas", "/comparador/", "Comparador de escuelas", "Pon dos o tres escuelas lado a lado: aciertos de tres años, ubicación y tipo de bachillerato."],
    ["opciones", "herramienta-armar-opciones", "/armar-opciones/", "Armar mis opciones", "Ordena las escuelas en retadoras, alcanzables y seguras, y descarga la lista para el registro."],
  ];
  return `
<section class="seccion seccion-herramientas" aria-labelledby="t-herr">
  <div class="contenedor">
    <div class="encabezado-seccion">
      <h2 id="t-herr">Herramientas para decidir antes del registro</h2>
      <p>Lo que ninguna tabla en PDF te dice: si le alcanza, qué le queda cerca y en qué orden poner las escuelas.</p>
    </div>
    <a class="herramienta-destacada" href="/prepas-cerca-de-mi/">${icono("mapa", "ico")}<span><b>Prepas cerca de mí: ¿cuál le conviene?</b><span>Con sus aciertos, tu código postal y lo que quiere estudiar, te armamos la lista ordenada para el registro.</span></span><em>Probar ahora →</em></a>
    <ul class="herramientas">
      ${h
        .map(
          ([ic, img, href, t, d]) => `
      <li class="herramienta">
        <a href="${href}">
          ${imagen(img, { clase: "herramienta-img", tamanos: "(min-width: 960px) 25vw, (min-width: 600px) 50vw, 100vw" })}
          <span class="herramienta-cuerpo">${icono(ic, "ico herramienta-ico")}<b>${t}</b><span>${d}</span></span>
        </a>
      </li>`,
        )
        .join("")}
    </ul>
  </div>
</section>`;
}

function estudiar() {
  return `
<section class="seccion seccion-estudiar" aria-labelledby="t-estudiar">
  <div class="contenedor rejilla-media rejilla-invertida">
    <figure class="figura">${imagen("estudiar-simulador-examenes-lat", { tamanos: "(min-width: 960px) 45vw, 100vw" })}</figure>
    <div class="prosa">
      <h2 id="t-estudiar">¿Le alcanza? ¿Qué le falta estudiar?</h2>
      <p>Saber los aciertos de la escuela es la mitad. La otra mitad es saber dónde está tu hijo o hija hoy. Para eso hay dos caminos, los dos gratis para empezar:</p>
      ${caminosExternos("/", "portada-estudiar")}
    </div>
  </div>
</section>`;
}

function faq() {
  return `
<section class="seccion seccion-faq" aria-labelledby="t-faq">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-faq">Preguntas frecuentes sobre el ECOEMS 2027</h2>
    <div class="faq">
      ${PREGUNTAS.map(([p, r]) => `<details class="faq-item"><summary>${p}${icono("abajo", "ico")}</summary><p>${r}</p></details>`).join("")}
    </div>
    <p class="actualizado">Actualizado el <time datetime="${ACTUALIZADO.iso}">${ACTUALIZADO.texto}</time>. Aciertos tomados de los resultados oficiales publicados por el proceso de asignación (COMIPEMS hasta 2024 y Mi Derecho, Mi Lugar desde 2025). ecoems.net no es un sitio oficial.</p>
  </div>
</section>`;
}

export function cuerpo() {
  return `
<section class="portada" aria-labelledby="t-portada">
  <div class="contenedor rejilla-portada">
    <div class="portada-texto">
      <p class="portada-insignia">Guía para familias de la CDMX y el Estado de México</p>
      <h1 id="t-portada">ECOEMS 2027: el proceso, los aciertos y las escuelas, explicados para papás</h1>
      <p class="portada-lead">Tu hijo o hija va a presentar el examen para entrar a la prepa. Aquí ves, sin tecnicismos, cómo funciona Mi Derecho, Mi Lugar, cuántos aciertos pidió cada escuela de la UNAM y del IPN y qué meta conviene para 2027.</p>
      ${buscador()}
      <ul class="datos-portada">
        <li><b>${PREGUNTAS_EXAMEN}</b><span>preguntas tiene el examen</span></li>
        <li><b>${ESCUELAS.length}</b><span>escuelas de la UNAM y el IPN con examen</span></li>
        <li><b>3 años</b><span>de aciertos oficiales por escuela</span></li>
      </ul>
    </div>
    <figure class="portada-figura">${imagen("portada-papa-e-hija-revisan-aciertos", { prioridad: true, tamanos: "(min-width: 960px) 40vw, 100vw" })}</figure>
  </div>
</section>
${ruta()}
${tablaAciertos()}
<div class="anuncio" data-anuncio="portada-1" hidden></div>
${queEs()}
${herramientas()}
${estudiar()}
<div class="anuncio" data-anuncio="portada-2" hidden></div>
${faq()}
<script type="application/json" id="datos-escuelas">${JSON.stringify(ESCUELAS.map((e) => ({ s: e.slug, n: e.doble, l: e.linea, a: [e.a2024, e.a2025, e.a2026], m: e.meta })))}</script>`;
}

export function jsonld() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ecoems.net",
      url: `${SITIO.dominio}/`,
      inLanguage: "es-MX",
      description: META.descripcion,
      publisher: { "@type": "Organization", name: "Ibertelcom Digital", url: "https://ibertelcom.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: META.titulo,
      url: `${SITIO.dominio}/`,
      inLanguage: "es-MX",
      dateModified: ACTUALIZADO.iso,
      about: [{ "@type": "Thing", name: "ECOEMS" }, { "@type": "Thing", name: "Mi Derecho, Mi Lugar" }],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: PREGUNTAS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
}

export function paginas() {
  return [{ META, ACTUALIZADO, nombreCorto: "Portada ecoems.net", seccion: "", cuerpo, jsonld }];
}

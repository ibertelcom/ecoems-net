// Pilar /aciertos/ (tabla completa) + hubs por línea + índice /escuelas/
import { ESCUELAS, GRUPOS, RESUMEN, PREGUNTAS_EXAMEN, MARGEN_TEPO } from "../datos.mjs";
import { icono } from "../iconos.mjs";
import { imagen, registrar } from "../imagenes.mjs";
import { SITIO, utm } from "../plantilla.mjs";
import { migas, cabeceraPagina, faqBloque, faqLd, paginaLd, ACTUALIZADO } from "../componentes.mjs";

const HUB = { enp: "/escuelas/prepas-unam/", cch: "/escuelas/cch-unam/", voca: "/escuelas/vocacionales-ipn/" };

function filaTabla(e) {
  const d = e.a2026 - e.a2025;
  return `<tr data-linea="${e.linea}">
    <th scope="row"><a href="/escuelas/${e.slug}/">${e.comun}</a>${e.comun !== e.oficial ? `<small>${e.oficial}</small>` : ""}</th>
    <td data-v="${e.a2024}">${e.a2024}</td>
    <td data-v="${e.a2025}">${e.a2025}</td>
    <td data-v="${e.a2026}"><b>${e.a2026}</b></td>
    <td data-v="${d}" class="t-cambio ${d > 0 ? "sube" : d < 0 ? "baja" : ""}">${d > 0 ? `+${d}` : d === 0 ? "=" : d}</td>
    <td data-v="${e.meta}" class="t-meta">${e.meta}</td>
    <td class="t-lugar">${e.alcaldia ?? ""}</td>
  </tr>`;
}

function tabla(escuelas, conFiltro) {
  const filtro = conFiltro
    ? `<div class="filtros" role="group" aria-label="Filtrar por tipo de escuela">
        <button type="button" class="filtro" aria-pressed="true" data-filtro="todas">Todas <small>${ESCUELAS.length}</small></button>
        ${GRUPOS.map((g) => `<button type="button" class="filtro" aria-pressed="false" data-filtro="${g.clave}" data-linea="${g.clave}">${g.titulo} <small>${g.escuelas.length}</small></button>`).join("")}
      </div>`
    : "";
  return `${filtro}
  <div class="tabla-envoltura">
    <table class="tabla-aciertos" data-ordenable>
      <caption>Aciertos mínimos de asignación por escuela, de ${PREGUNTAS_EXAMEN} posibles. Toca un encabezado para ordenar.</caption>
      <thead><tr>
        <th scope="col"><button type="button" data-col="0">Escuela</button></th>
        <th scope="col"><button type="button" data-col="1">2024</button></th>
        <th scope="col"><button type="button" data-col="2">2025</button></th>
        <th scope="col" aria-sort="descending"><button type="button" data-col="3">2026</button></th>
        <th scope="col"><button type="button" data-col="4">Cambio</button></th>
        <th scope="col"><button type="button" data-col="5">Meta Tepo 2027</button></th>
        <th scope="col">Alcaldía o municipio</th>
      </tr></thead>
      <tbody>${[...escuelas].sort((a, b) => b.a2026 - a.a2026).map(filaTabla).join("")}</tbody>
    </table>
  </div>`;
}

function dataset(ruta, nombre, descripcion) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: nombre,
    description: descripcion,
    url: `${SITIO.dominio}${ruta}`,
    inLanguage: "es-MX",
    dateModified: ACTUALIZADO.iso,
    temporalCoverage: "2024/2026",
    spatialCoverage: "Zona Metropolitana del Valle de México",
    creator: { "@type": "Organization", name: "ecoems.net" },
    isAccessibleForFree: true,
    variableMeasured: ["Aciertos mínimos de asignación 2024", "Aciertos mínimos de asignación 2025", "Aciertos mínimos de asignación 2026", "Meta Tepo 2027"],
  };
}

function caminos(campana) {
  return `
    <div class="caminos">
      <a class="camino" href="${utm(SITIO.app, campana)}">
        ${icono("diagnostico", "ico camino-ico")}
        <span><b>Diagnóstico de 64 preguntas en ecoems.app</b><span>Ve sus aciertos estimados contra la escuela que eligieron y cuántos le faltan.</span></span>
        ${icono("externo", "ico camino-ext")}
      </a>
      <a class="camino" href="${utm(`${SITIO.lat}/mx/comipems/`, campana)}">
        ${icono("libro", "ico camino-ico")}
        <span><b>Simulador y guía ECOEMS en examenes.lat</b><span>Exámenes simulacro gratis por materia para practicar en casa.</span></span>
        ${icono("externo", "ico camino-ext")}
      </a>
    </div>`;
}

// ---------- /aciertos/ ----------
function paginaAciertos() {
  const ruta = "/aciertos/";
  const titulo = "Aciertos ECOEMS 2026 por escuela: UNAM e IPN | ecoems.net";
  const descripcion = "Cuántos aciertos pide cada prepa, CCH y vocacional en el ECOEMS: tabla 2024, 2025 y 2026 de las 31 escuelas de la UNAM y el IPN, con la meta para 2027.";
  const m = migas([["Inicio", "/"], ["Aciertos por escuela", ruta]]);
  const cch = GRUPOS[1].escuelas.map((e) => e.a2026);
  const voca = GRUPOS[2].escuelas.map((e) => e.a2026);
  const enp = GRUPOS[0].escuelas.map((e) => e.a2026);
  const rango = (a) => `${Math.min(...a)} a ${Math.max(...a)}`;
  const preg = [
    ["¿Cuántos aciertos pide la UNAM en el ECOEMS?",
      `Depende de la escuela. En 2026 las prepas de la UNAM pidieron de ${rango(enp)} aciertos y los CCH de ${rango(cch)}. La más alta fue la ${RESUMEN.mayor.doble}, con ${RESUMEN.mayor.a2026}.`],
    ["¿Cuántos aciertos pide el IPN en el ECOEMS?",
      `En 2026 las vocacionales del IPN pidieron de ${rango(voca)} aciertos. La más alta fue la Voca 9 (CECyT 9), con ${ESCUELAS.find((e) => e.oficial === "CECyT 9").a2026}.`],
    ["¿Qué significan los aciertos de cada escuela?",
      "Son los aciertos del último alumno que alcanzó lugar en esa escuela. No es una calificación mínima fija: depende de cuántos aspirantes la eligieron y de cuántos lugares había ese año."],
    ["¿Cuántos aciertos piden las prepas en 2027?",
      `Todavía no se sabe: se conocen hasta los resultados de agosto de 2027. Como referencia sugerimos la meta Tepo, que son los aciertos de 2026 más ${MARGEN_TEPO}.`],
    ["¿De dónde salen estos datos?",
      "De los resultados oficiales del proceso de asignación: COMIPEMS hasta 2024 y Mi Derecho, Mi Lugar desde 2025. Los revisamos cada año cuando se publican."],
  ];
  const cuerpo = `
${cabeceraPagina({
  migasHtml: m.html,
  h1: "Cuántos aciertos pide cada escuela en el ECOEMS",
  lead: `Tabla con los aciertos de 2024, 2025 y 2026 de las ${ESCUELAS.length} prepas, CCH y vocacionales de la UNAM y el IPN, y la meta Tepo sugerida para el ECOEMS 2027. Ordénala por año o filtra por tipo de escuela.`,
})}
<section class="seccion seccion-tabla" aria-labelledby="t-tabla">
  <div class="contenedor">
    <h2 id="t-tabla" class="visualmente-oculto">Tabla de aciertos por escuela</h2>
    ${tabla(ESCUELAS, true)}
    <p class="nota-tabla">${icono("aviso", "ico")}<span>Los aciertos no son una calificación mínima fija: son los del último alumno asignado a cada escuela. Cambian cada año según cuántos aspirantes la eligen.</span></p>
  </div>
</section>
<section class="seccion seccion-blanca" aria-labelledby="t-leer">
  <div class="contenedor rejilla-media">
    <div class="prosa">
      <h2 id="t-leer">Cómo leer los aciertos del ECOEMS</h2>
      <p>El examen ECOEMS tiene ${PREGUNTAS_EXAMEN} preguntas. Con los aciertos de cada aspirante se arma una lista de mayor a menor, y los lugares de cada escuela se asignan en ese orden, respetando las opciones que cada uno puso en su registro.</p>
      <p>Por eso los <b>puntajes del ECOEMS</b> de cada escuela son el resultado de la demanda de ese año. Una prepa muy pedida, como la ${RESUMEN.mayor.doble}, sube; una con más lugares o menos demanda, baja.</p>
      <h3>Qué meta conviene para 2027</h3>
      <p>Sugerimos la <b>meta Tepo</b>: los aciertos de 2026 más ${MARGEN_TEPO}. De un año a otro casi todas las escuelas se movieron entre 0 y 6 aciertos; ir un poco arriba del último dato reduce el riesgo de quedar fuera por poco.</p>
      <p>Si quieres ver cuántos aciertos lleva tu hijo o hija hoy, usa la <a href="/calculadora/">calculadora de aciertos</a> o empieza por uno de los caminos de abajo.</p>
    </div>
    <div class="resumen-lineas">
      ${GRUPOS.map((g) => {
        const v = g.escuelas.map((e) => e.a2026);
        return `<a class="resumen-linea" href="${HUB[g.clave]}" data-linea="${g.clave}"><span>${g.titulo}</span><b>${Math.min(...v)}–${Math.max(...v)}</b><small>aciertos en 2026 · ${g.escuelas.length} escuelas</small></a>`;
      }).join("")}
    </div>
  </div>
</section>
<section class="seccion seccion-estudiar" aria-labelledby="t-alcanza">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-alcanza">¿Cuántos aciertos lleva tu hijo o hija hoy?</h2>
    <p>La tabla te dice a dónde hay que llegar. Para saber dónde está ahora, empieza gratis:</p>
    ${caminos("aciertos")}
  </div>
</section>
<div class="anuncio" data-anuncio="aciertos-1" hidden></div>
${faqBloque(preg, "Preguntas sobre los aciertos del ECOEMS")}`;
  return {
    META: { ruta, titulo, descripcion }, ACTUALIZADO, nombreCorto: "Aciertos por escuela", seccion: "escuelas",
    cuerpo: () => cuerpo,
    jsonld: () => [paginaLd({ titulo, ruta, descripcion }), m.ld, dataset(ruta, "Aciertos mínimos de asignación ECOEMS por escuela, 2024–2026", descripcion), faqLd(preg)],
  };
}

// ---------- Hubs por línea ----------
const HUBS = {
  enp: {
    titulo: "Prepas UNAM: aciertos y planteles de la ENP | ecoems.net",
    h1: "Prepas de la UNAM: los 9 planteles de la ENP y sus aciertos",
    lead: "Cuántos aciertos pidió cada prepa de la UNAM en el ECOEMS, dónde está cada plantel de la Escuela Nacional Preparatoria y qué meta conviene para 2027.",
    intro: "La Escuela Nacional Preparatoria (ENP) es el bachillerato más antiguo de la UNAM. Tiene nueve planteles en la Ciudad de México, que todos conocen como Prepa 1 a Prepa 9. El plan es anual, dura tres años y en sexto año el alumno elige el área de la carrera que le interesa. Quien termina con buen promedio puede seguir a una licenciatura de la UNAM por pase reglamentado.",
    img: ["prepas-unam-estudiantes", "Estudiantes de una prepa de la UNAM en el patio del plantel", "Prepas de la UNAM", "Estudiantes de bachillerato conversando en el patio de un plantel de la Escuela Nacional Preparatoria."],
  },
  cch: {
    titulo: "CCH UNAM: aciertos de los 5 planteles | ecoems.net",
    h1: "CCH de la UNAM: los 5 planteles y sus aciertos",
    lead: "Cuántos aciertos pidió cada CCH en el ECOEMS (Azcapotzalco, Naucalpan, Oriente, Sur y Vallejo), dónde está cada uno y qué meta conviene para 2027.",
    intro: "El Colegio de Ciencias y Humanidades (CCH) es el otro bachillerato de la UNAM. Tiene cinco planteles: cuatro en la Ciudad de México y uno en Naucalpan, Estado de México. Dura seis semestres y su modelo da mucho peso a investigar, leer y escribir. Igual que en la Prepa, quien termina con buen promedio puede seguir a una licenciatura de la UNAM por pase reglamentado.",
    img: ["cch-unam-estudiantes", "Estudiantes de un CCH de la UNAM trabajando en equipo", "CCH de la UNAM", "Estudiantes de bachillerato trabajando en equipo en una explanada con jardineras."],
  },
  voca: {
    titulo: "Vocacionales IPN: aciertos de los CECyT | ecoems.net",
    h1: "Vocacionales del IPN: aciertos de cada CECyT y del CET 1",
    lead: "Cuántos aciertos pidió cada vocacional del IPN en el ECOEMS, su área de conocimiento, sus carreras técnicas y la meta que conviene para 2027.",
    intro: "Las vocacionales del Instituto Politécnico Nacional son los CECyT (Centros de Estudios Científicos y Tecnológicos) y el CET 1. Son bachilleratos bivalentes de tres años: al terminar, el alumno tiene su certificado de bachillerato y además una carrera técnica. Cada una pertenece a un área (Físico-Matemáticas, Médico-Biológicas o Sociales y Administrativas) que orienta hacia las licenciaturas del IPN.",
    img: ["vocacionales-ipn-taller", "Estudiantes de una vocacional del IPN en un taller técnico", "Vocacionales del IPN", "Estudiantes de bachillerato tecnológico con bata en un laboratorio o taller."],
  },
};

function paginaHub(g) {
  const h = HUBS[g.clave];
  const ruta = HUB[g.clave];
  const m = migas([["Inicio", "/"], ["Escuelas", "/escuelas/"], [g.titulo, ruta]]);
  const v = g.escuelas.map((e) => e.a2026);
  const mayor = g.escuelas.reduce((a, b) => (b.a2026 > a.a2026 ? b : a));
  const menor = g.escuelas.reduce((a, b) => (b.a2026 < a.a2026 ? b : a));
  const descripcion = `${g.titulo}: aciertos 2024–2026 de ${g.escuelas.length} planteles (de ${Math.min(...v)} a ${Math.max(...v)} en 2026), ubicación y meta Tepo para el ECOEMS 2027.`;
  const img = registrar(h.img[0], {
    archivo: `${h.img[0]}.webp`, ancho: 1600, alto: 900, alt: h.img[1], title: h.img[2], descripcion: h.img[3],
    prompt: `Fotografía realista panorámica 16:9. ${h.img[3]} Ciudad de México, luz de mañana. Sin texto legible, sin escudos ni logotipos, sin fechas ni años.`,
    uso: `Hub · ${g.titulo}`,
  });
  const preg = [
    [`¿Cuántos aciertos piden ${g.clave === "voca" ? "las vocacionales del IPN" : g.clave === "cch" ? "los CCH" : "las prepas de la UNAM"}?`,
      `En 2026 pidieron de ${Math.min(...v)} a ${Math.max(...v)} aciertos. La más alta fue ${mayor.doble}, con ${mayor.a2026}, y la más baja ${menor.doble}, con ${menor.a2026}.`],
    [`¿Cuál es ${g.clave === "cch" ? "el CCH" : "la escuela"} más ${g.clave === "voca" ? "pedida del IPN" : "pedida"}?`,
      `Por aciertos, ${mayor.doble}: en 2026 pidió ${mayor.a2026} de ${PREGUNTAS_EXAMEN}. Su meta Tepo para 2027 es ${mayor.meta}.`],
    ["¿Se puede entrar sin examen?",
      `No. Las escuelas ${g.clave === "voca" ? "del IPN" : "de la UNAM"} asignan lugar solo por aciertos en el ECOEMS. Hay que registrarse en la modalidad 2 o 3 de Mi Derecho, Mi Lugar.`],
  ];
  const cuerpo = `
${cabeceraPagina({ migasHtml: m.html, linea: g.clave, h1: h.h1, lead: h.lead })}
<section class="seccion" aria-labelledby="t-planteles">
  <div class="contenedor">
    <div class="encabezado-seccion">
      <h2 id="t-planteles">Aciertos de ${g.titulo.toLowerCase().startsWith("prepas") ? "las prepas" : g.clave === "cch" ? "los CCH" : "las vocacionales"} en el ECOEMS 2026</h2>
      <p>Ordenadas de mayor a menor. Toca una escuela para ver sus tres años de aciertos, su ubicación y escuelas con un puntaje parecido.</p>
    </div>
    <ul class="tarjetas-escuela tarjetas-hub">
      ${[...g.escuelas].sort((a, b) => b.a2026 - a.a2026).map((e) => `
      <li><a class="tarjeta-escuela" href="/escuelas/${e.slug}/" data-linea="${e.linea}">
        <span class="te-linea">${e.alcaldia ?? ""}</span>
        <b>${e.doble}</b>
        ${e.honorifico ? `<span class="te-hon">${e.honorifico.replace(/^[^"]*"/, "“").replace(/"$/, "”")}</span>` : ""}
        <span class="te-cifras"><span><i>2024</i>${e.a2024}</span><span><i>2025</i>${e.a2025}</span><span><i>2026</i>${e.a2026}</span><span class="te-meta"><i>Meta</i>${e.meta}</span></span>
        ${e.area ? `<span class="te-lugar">${e.area}</span>` : ""}
      </a></li>`).join("")}
    </ul>
  </div>
</section>
<section class="seccion seccion-blanca" aria-labelledby="t-que-es-linea">
  <div class="contenedor rejilla-media">
    <div class="prosa">
      <h2 id="t-que-es-linea">Qué son ${g.clave === "cch" ? "los CCH" : g.clave === "enp" ? "las prepas de la UNAM" : "las vocacionales del IPN"}</h2>
      <p>${h.intro}</p>
      <p>Compara con <a href="${g.clave === "voca" ? HUB.enp : HUB.voca}">${g.clave === "voca" ? "las prepas de la UNAM" : "las vocacionales del IPN"}</a> o revisa la <a href="/aciertos/">tabla de aciertos de las ${ESCUELAS.length} escuelas</a>.</p>
    </div>
    <figure class="figura">${imagen(img, { tamanos: "(min-width: 960px) 45vw, 100vw" })}</figure>
  </div>
</section>
<section class="seccion seccion-estudiar" aria-labelledby="t-alcanza">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-alcanza">¿Le alcanza para ${g.clave === "cch" ? "un CCH" : g.clave === "enp" ? "una prepa de la UNAM" : "una vocacional"}?</h2>
    ${caminos(`hub-${g.clave}`)}
  </div>
</section>
${faqBloque(preg, `Preguntas sobre ${g.titulo}`)}`;
  return {
    META: { ruta, titulo: h.titulo, descripcion }, ACTUALIZADO, nombreCorto: g.titulo, seccion: "escuelas",
    cuerpo: () => cuerpo,
    jsonld: () => [paginaLd({ titulo: h.titulo, ruta, descripcion, tipo: "CollectionPage" }), m.ld, faqLd(preg)],
  };
}

// ---------- /escuelas/ ----------
function paginaEscuelas() {
  const ruta = "/escuelas/";
  const titulo = "Escuelas del ECOEMS: prepas, CCH y vocacionales | ecoems.net";
  const descripcion = `Listado de las ${ESCUELAS.length} escuelas de la UNAM y el IPN que asignan lugar con el examen ECOEMS: prepas, CCH y vocacionales, con sus aciertos y ubicación.`;
  const m = migas([["Inicio", "/"], ["Escuelas", ruta]]);
  const cuerpo = `
${cabeceraPagina({
  migasHtml: m.html,
  h1: "Escuelas del ECOEMS: prepas, CCH y vocacionales",
  lead: `Las ${ESCUELAS.length} escuelas de la UNAM y del IPN que asignan lugar por aciertos en el examen. Busca por nombre, número o alcaldía.`,
  extra: `<div class="buscador-escuelas"><label for="buscar-escuela">Buscar escuela</label><span class="consulta-campo">${icono("buscar", "ico consulta-ico")}<input id="buscar-escuela" type="search" placeholder="Prepa 6, CCH Sur, Voca 9, Coyoacán…" autocomplete="off"></span></div>`,
})}
<section class="seccion" aria-label="Listado de escuelas">
  <div class="contenedor">
    ${GRUPOS.map((g) => `
    <div class="grupo-escuelas" data-grupo>
      <div class="grupo-cabeza" data-linea="${g.clave}"><h2>${g.titulo}</h2><a href="${HUB[g.clave]}">Ver ${g.titulo}</a></div>
      <ul class="tarjetas-escuela">
        ${g.escuelas.map((e) => `
        <li data-buscar="${[e.comun, e.oficial, e.honorifico ?? "", e.alcaldia ?? ""].join(" ").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()}"><a class="tarjeta-escuela" href="/escuelas/${e.slug}/" data-linea="${e.linea}">
          <span class="te-linea">${e.alcaldia ?? ""}</span>
          <b>${e.doble}</b>
          <span class="te-cifras"><span><i>2026</i>${e.a2026}</span><span class="te-meta"><i>Meta</i>${e.meta}</span></span>
        </a></li>`).join("")}
      </ul>
    </div>`).join("")}
    <p class="sin-resultados" id="sin-resultados" hidden>No encontramos esa escuela entre las de la UNAM y el IPN. Revisa el nombre o busca por alcaldía.</p>
    <p class="nota-ruta">${icono("sin_examen", "ico")}<span>¿Buscas opciones sin examen (COLBACH, CONALEP, DGETI, IEMS y otras)? Esas escuelas asignan por orden de opciones; las sumaremos al <a href="/mapa/">mapa de escuelas</a>.</span></p>
  </div>
</section>`;
  return {
    META: { ruta, titulo, descripcion }, ACTUALIZADO, nombreCorto: "Escuelas del ECOEMS", seccion: "escuelas",
    cuerpo: () => cuerpo,
    jsonld: () => [
      paginaLd({ titulo, ruta, descripcion, tipo: "CollectionPage" }), m.ld,
      { "@context": "https://schema.org", "@type": "ItemList", itemListElement: ESCUELAS.map((e, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITIO.dominio}/escuelas/${e.slug}/`, name: e.doble })) },
    ],
  };
}

export function paginas() {
  return [paginaAciertos(), paginaEscuelas(), ...GRUPOS.map(paginaHub)];
}

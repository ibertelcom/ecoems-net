// Herramientas (calculadora, comparador, armar opciones, escuelas por zona), escuelas sin examen y aviso de privacidad.
import { ESCUELAS, GRUPOS, PREGUNTAS_EXAMEN, MARGEN_TEPO } from "../datos.mjs";
import { icono } from "../iconos.mjs";
import { SITIO, utm } from "../plantilla.mjs";
import { migas, cabeceraPagina, faqBloque, faqLd, paginaLd, ACTUALIZADO } from "../componentes.mjs";

const datosJson = () =>
  `<script type="application/json" id="datos-escuelas">${JSON.stringify(
    ESCUELAS.map((e) => ({ s: e.slug, n: e.doble, c: e.comun, l: e.linea, i: e.institucion, a: [e.a2024, e.a2025, e.a2026], m: e.meta, z: e.alcaldia, ent: e.entidad, ar: e.area, d: e.direccion })),
  )}</script>`;

const opcionesSelect = (sel = "") =>
  GRUPOS.map((g) => `<optgroup label="${g.titulo}">${g.escuelas.map((e) => `<option value="${e.slug}"${e.slug === sel ? " selected" : ""}>${e.doble}</option>`).join("")}</optgroup>`).join("");

function app(campana) {
  return `
<section class="seccion seccion-estudiar" aria-labelledby="t-app-${campana}">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-app-${campana}">¿No sabes cuántos aciertos lleva?</h2>
    <div class="caminos">
      <a class="camino" href="${utm(SITIO.app, campana)}">${icono("diagnostico", "ico camino-ico")}<span><b>Diagnóstico de 64 preguntas en ecoems.app</b><span>La mitad exacta del examen, con la misma proporción por materia. Te da sus aciertos estimados en una sola sesión.</span></span>${icono("externo", "ico camino-ext")}</a>
      <a class="camino" href="${utm(`${SITIO.lat}/mx/comipems/`, campana)}">${icono("libro", "ico camino-ico")}<span><b>Simulador ECOEMS gratis en examenes.lat</b><span>Exámenes simulacro por materia para practicar en casa.</span></span>${icono("externo", "ico camino-ext")}</a>
    </div>
  </div>
</section>`;
}

function hecha(ruta, d, cuerpo, faq, extraLd = []) {
  return {
    META: { ruta, titulo: d.titulo, descripcion: d.descripcion }, ACTUALIZADO, nombreCorto: d.nombreCorto, seccion: d.seccion ?? "herramientas",
    cuerpo: () => cuerpo,
    jsonld: () => [paginaLd({ titulo: d.titulo, ruta, descripcion: d.descripcion }), d.migas.ld, ...(faq?.length ? [faqLd(faq)] : []), ...extraLd],
  };
}

const herramientaLd = (nombre, ruta, desc) => ({
  "@context": "https://schema.org", "@type": "WebApplication", name: nombre, url: `${SITIO.dominio}${ruta}`, description: desc,
  applicationCategory: "EducationalApplication", operatingSystem: "Cualquiera (navegador)", inLanguage: "es-MX", offers: { "@type": "Offer", price: "0", priceCurrency: "MXN" },
});

// ---------- Calculadora ----------
function calculadora() {
  const ruta = "/calculadora/";
  const d = {
    titulo: "Calculadora de aciertos ECOEMS: ¿qué escuelas le alcanzan? | ecoems.net",
    descripcion: "Escribe los aciertos de su último simulacro y ve qué prepas, CCH y vocacionales le alcanzan, cuáles están en la orilla y cuáles necesitan más estudio. Gratis.",
    nombreCorto: "Calculadora de aciertos",
    migas: migas([["Inicio", "/"], ["Herramientas", "/calculadora/"], ["Calculadora de aciertos", ruta]].filter((_, i) => i !== 1)),
  };
  const faq = [
    ["¿Cómo funciona la calculadora de aciertos?", `Compara los aciertos que escribes con los aciertos 2026 de cada escuela y con la meta Tepo (2026 + ${MARGEN_TEPO}). Si llega a la meta, la escuela le alcanza con margen; si queda entre los aciertos 2026 y la meta, está en la orilla; si queda abajo, es retadora.`],
    ["¿Es una garantía de lugar?", "No. Los aciertos de cada escuela cambian cada año y el examen real puede salir distinto a un simulacro. Úsala como referencia para estudiar y ordenar opciones."],
    ["¿De dónde saco sus aciertos?", "De un simulacro completo reciente. Si el simulacro tiene menos de 128 preguntas, la calculadora puede convertir el resultado a la escala de 128."],
  ];
  const cuerpo = `
${cabeceraPagina({ migasHtml: d.migas.html, h1: "Calculadora de aciertos del ECOEMS", lead: "Escribe cuántos aciertos sacó tu hijo o hija en su último simulacro y mira, escuela por escuela, si le alcanza para la UNAM y el IPN." })}
<section class="seccion herramienta-seccion" aria-label="Calculadora">
  <div class="contenedor">
    <form class="calc" id="calc" novalidate>
      <div class="calc-entrada">
        <label for="calc-aciertos">Aciertos en su último simulacro</label>
        <div class="calc-fila">
          <input id="calc-aciertos" type="number" inputmode="numeric" min="0" max="128" value="98">
          <span class="calc-de">de <input id="calc-total" type="number" inputmode="numeric" min="10" max="200" value="128" aria-label="Total de preguntas del simulacro"> preguntas</span>
        </div>
        <input id="calc-rango" type="range" min="40" max="128" value="98" aria-label="Aciertos (deslizador)">
        <p class="calc-escala" id="calc-escala" hidden></p>
        <p class="calc-ayuda">Ejemplo cargado: 98 aciertos. Cambia el número o mueve la barra.</p>
      </div>
      <div class="calc-resumen" id="calc-resumen" aria-live="polite"></div>
    </form>
    <div class="calc-grupos">
      <div class="calc-grupo" data-tipo="alcanza"><h2>${icono("sin_examen", "ico")}Le alcanza con margen</h2><p>Llega a la meta Tepo 2027 o más.</p><ul id="lista-alcanza"></ul></div>
      <div class="calc-grupo" data-tipo="orilla"><h2>${icono("aviso", "ico")}En la orilla</h2><p>Llega a los aciertos de 2026, pero no a la meta.</p><ul id="lista-orilla"></ul></div>
      <div class="calc-grupo" data-tipo="reto"><h2>${icono("aciertos", "ico")}Retadoras</h2><p>Todavía le faltan aciertos.</p><ul id="lista-reto"></ul></div>
    </div>
    <p class="nota-tabla">${icono("aviso", "ico")}<span>Es una referencia, no una garantía. Los aciertos de cada escuela cambian cada año. Datos: aciertos mínimos de asignación 2026; <a href="/aciertos/">ver tabla completa</a>.</span></p>
  </div>
</section>
${app("calculadora")}
${faqBloque(faq, "Preguntas sobre la calculadora")}
${datosJson()}`;
  return hecha(ruta, d, cuerpo, faq, [herramientaLd("Calculadora de aciertos ECOEMS", ruta, d.descripcion)]);
}

// ---------- Comparador ----------
function comparador() {
  const ruta = "/comparador/";
  const d = {
    titulo: "Comparador de escuelas ECOEMS: prepas, CCH y vocacionales | ecoems.net",
    descripcion: "Compara dos o tres escuelas del ECOEMS lado a lado: aciertos 2024, 2025 y 2026, meta 2027, tipo de bachillerato y ubicación.",
    nombreCorto: "Comparador de escuelas",
    migas: migas([["Inicio", "/"], ["Comparador de escuelas", ruta]]),
  };
  const sel = (i, v) => `<label class="comp-sel"><span>Escuela ${i}</span><select id="comp-${i}" data-comp><option value="">Elige una escuela</option>${opcionesSelect(v)}</select></label>`;
  const cuerpo = `
${cabeceraPagina({ migasHtml: d.migas.html, h1: "Comparador de escuelas del ECOEMS", lead: "Pon hasta tres escuelas lado a lado para decidir el orden de las opciones. Empezamos con un ejemplo; cámbialo por las que te interesan." })}
<section class="seccion herramienta-seccion" aria-label="Comparador">
  <div class="contenedor">
    <div class="comp-selects">${sel(1, "prepa-6")}${sel(2, "cch-sur")}${sel(3, "voca-9")}</div>
    <div class="tabla-envoltura"><table class="tabla-comp" id="tabla-comp" aria-live="polite"></table></div>
  </div>
</section>
${app("comparador")}
${datosJson()}`;
  return hecha(ruta, d, cuerpo, [], [herramientaLd("Comparador de escuelas ECOEMS", ruta, d.descripcion)]);
}

// ---------- Armar opciones ----------
function armar() {
  const ruta = "/armar-opciones/";
  const d = {
    titulo: "Armar mis opciones del ECOEMS: ordena tu lista | ecoems.net",
    descripcion: "Arma y ordena la lista de escuelas de la UNAM y el IPN para el registro de Mi Derecho, Mi Lugar, con sus aciertos y una etiqueta de retadora, alcanzable o segura.",
    nombreCorto: "Armar mis opciones",
    migas: migas([["Inicio", "/"], ["Armar mis opciones", ruta]]),
  };
  const cuerpo = `
${cabeceraPagina({ migasHtml: d.migas.html, h1: "Arma y ordena tus opciones del ECOEMS", lead: "Agrega hasta 5 escuelas de la UNAM y 5 del IPN, ordénalas de la que más quiere a la que menos y revisa si la lista tiene escuelas seguras." })}
<section class="seccion herramienta-seccion" aria-label="Armar opciones">
  <div class="contenedor armar">
    <div class="armar-panel">
      <label for="armar-escuela">Agregar escuela</label>
      <div class="calc-fila"><select id="armar-escuela"><option value="">Elige una escuela</option>${opcionesSelect()}</select><button class="boton" type="button" id="armar-agregar">Agregar</button></div>
      <label for="armar-aciertos">Sus aciertos de referencia (opcional)</label>
      <input id="armar-aciertos" type="number" inputmode="numeric" min="0" max="128" value="98">
      <p class="calc-ayuda" id="armar-aviso" aria-live="polite">Ejemplo cargado. Usa las flechas para cambiar el orden.</p>
    </div>
    <div class="armar-lista">
      <ol id="armar-lista" class="lista-opciones"></ol>
      <p class="armar-diagnostico" id="armar-diagnostico" aria-live="polite"></p>
      <div class="acciones-escuela"><button class="boton boton-secundario" type="button" id="armar-copiar">${icono("registro", "ico")}Copiar lista</button><button class="boton boton-secundario" type="button" id="armar-limpiar">Empezar de nuevo</button></div>
    </div>
  </div>
  <div class="contenedor"><p class="nota-tabla">${icono("aviso", "ico")}<span>Esta lista es para planear. El registro oficial se hace solo en <a href="https://www.miderechomilugar.gob.mx/" rel="noopener" target="_blank">miderechomilugar.gob.mx</a>. Lee <a href="/como-elegir-opciones/">cómo elegir opciones</a> y <a href="/modalidades/">qué modalidad conviene</a>.</span></p></div>
</section>
${app("armar-opciones")}
${datosJson()}`;
  return hecha(ruta, d, cuerpo, [], [herramientaLd("Armar opciones ECOEMS", ruta, d.descripcion)]);
}

// ---------- Escuelas por zona (mapa) ----------
function mapa() {
  const ruta = "/mapa/";
  const d = {
    titulo: "Mapa de prepas UNAM y vocacionales IPN por alcaldía | ecoems.net",
    descripcion: "Encuentra las prepas, CCH y vocacionales del ECOEMS cerca de tu casa: escuelas de la UNAM y el IPN por alcaldía o municipio, con dirección y cómo llegar.",
    nombreCorto: "Escuelas por zona",
    migas: migas([["Inicio", "/"], ["Mapa de escuelas", ruta]]),
  };
  const zonas = [...new Set(ESCUELAS.map((e) => e.alcaldia).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const porZona = zonas.map((z) => [z, ESCUELAS.filter((e) => e.alcaldia === z)]);
  const faq = [
    ["¿Qué prepas de la UNAM hay cerca de mí?", "Usa el filtro por alcaldía o municipio: verás las prepas, CCH y vocacionales de esa zona con sus aciertos y el botón para trazar la ruta desde tu casa."],
    ["¿Qué escuelas del ECOEMS hay en el Estado de México?", `${ESCUELAS.filter((e) => e.entidad === "Estado de México").map((e) => `${e.doble} (${e.alcaldia})`).join(", ")}. El resto de las escuelas de la UNAM y el IPN están en la Ciudad de México.`],
  ];
  const cuerpo = `
${cabeceraPagina({
  migasHtml: d.migas.html,
  h1: "Prepas, CCH y vocacionales cerca de tu casa",
  lead: `Las ${ESCUELAS.length} escuelas de la UNAM y el IPN agrupadas por alcaldía o municipio. Elige tu zona y traza la ruta desde tu casa.`,
  extra: `<div class="buscador-escuelas"><label for="zona">Alcaldía o municipio</label><select id="zona" class="select-grande"><option value="">Todas las zonas</option>${zonas.map((z) => `<option>${z}</option>`).join("")}</select></div>`,
})}
<section class="seccion" aria-label="Escuelas por zona">
  <div class="contenedor">
    ${porZona.map(([z, es]) => `
    <div class="grupo-escuelas" data-zona="${z}">
      <div class="grupo-cabeza"><h2>${z}</h2><span>${es.length} ${es.length === 1 ? "escuela" : "escuelas"} · ${es[0].entidad === "CDMX" ? "Ciudad de México" : es[0].entidad}</span></div>
      <ul class="tarjetas-escuela">${es.map((e) => `
        <li><div class="tarjeta-escuela tarjeta-zona" data-linea="${e.linea}">
          <span class="te-linea">${GRUPOS.find((g) => g.clave === e.linea).titulo}</span>
          <a href="/escuelas/${e.slug}/"><b>${e.doble}</b></a>
          ${e.direccion ? `<span class="te-hon">${e.direccion}</span>` : ""}
          <span class="te-cifras"><span><i>2026</i>${e.a2026}</span><span class="te-meta"><i>Meta</i>${e.meta}</span></span>
          <a class="te-ruta" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${e.honorifico ?? e.doble}, ${e.direccionVerificada && e.direccion ? e.direccion + ", " : ""}${e.alcaldia}`)}" rel="noopener" target="_blank">${icono("mapa", "ico")}Cómo llegar</a>
        </div></li>`).join("")}
      </ul>
    </div>`).join("")}
    <p class="nota-ruta">${icono("mapa", "ico")}<span>Estamos preparando el mapa interactivo con todas las escuelas del proceso, incluidas las opciones sin examen. Mientras tanto, usa “Cómo llegar” para ver la ruta desde tu casa.</span></p>
  </div>
</section>
${faqBloque(faq, "Preguntas sobre las escuelas por zona")}`;
  return hecha(ruta, d, cuerpo, faq);
}

// ---------- Escuelas sin examen ----------
function sinExamen() {
  const ruta = "/escuelas/sin-examen/";
  const d = {
    titulo: "Escuelas sin examen en Mi Derecho, Mi Lugar (modalidad 1) | ecoems.net",
    descripcion: "Qué prepas no piden examen en Mi Derecho, Mi Lugar: COLBACH, CONALEP, DGB, DGETAyCM, DGETI, IEMS, SECTI y UAEMéx Texcoco. Cómo se asigna el lugar sin examen.",
    nombreCorto: "Escuelas sin examen",
    seccion: "escuelas",
    migas: migas([["Inicio", "/"], ["Escuelas", "/escuelas/"], ["Sin examen", ruta]]),
  };
  const subs = [
    ["COLBACH", "Colegio de Bachilleres", "Bachillerato general con capacitación para el trabajo."],
    ["CONALEP", "Colegio Nacional de Educación Profesional Técnica", "Bachillerato con carrera de profesional técnico."],
    ["DGB", "Dirección General de Bachillerato", "Planteles de bachillerato general de la SEP."],
    ["DGETAyCM", "Educación Tecnológica Agropecuaria y Ciencias del Mar", "Bachilleratos tecnológicos agropecuarios."],
    ["DGETI", "Educación Tecnológica Industrial y de Servicios", "CETIS y CBTIS: bachillerato tecnológico con carrera técnica."],
    ["IEMS", "Instituto de Educación Media Superior de la CDMX", "Preparatorias del gobierno de la Ciudad de México."],
    ["SECTI", "Secretaría de Educación, Ciencia, Tecnología e Innovación de la CDMX", "Opciones de bachillerato de la Ciudad de México."],
    ["UAEMéx", "Plantel Texcoco de la Universidad Autónoma del Estado de México", "Lugares asignados dentro del proceso."],
  ];
  const faq = [
    ["¿Qué prepas no piden examen?", "En Mi Derecho, Mi Lugar asignan sin examen COLBACH, CONALEP, DGB, DGETAyCM, DGETI, IEMS, SECTI y los lugares del plantel Texcoco de la UAEMéx."],
    ["¿Cómo se asigna el lugar sin examen?", "Por el orden de las opciones en el comprobante de registro y los lugares disponibles de cada escuela."],
    ["¿Puedo combinar escuelas sin examen con la UNAM?", "Sí, en la modalidad 3: de 5 a 10 opciones sin examen más hasta 5 de la UNAM y 5 del IPN."],
  ];
  const cuerpo = `
${cabeceraPagina({ migasHtml: d.migas.html, h1: "Escuelas sin examen en Mi Derecho, Mi Lugar", lead: "Las opciones de bachillerato que asignan lugar sin presentar el ECOEMS, y cómo combinarlas con la UNAM y el IPN." })}
<section class="seccion"><div class="contenedor">
  <div class="encabezado-seccion"><h2>Instituciones que asignan sin examen</h2><p>Según la convocatoria 2026, estas instituciones asignan por el orden de tus opciones y los lugares disponibles. Se eligen en la <a href="/modalidades/">modalidad 1 o la 3</a>.</p></div>
  <ul class="tarjetas-escuela">${subs.map(([s, n, t]) => `<li><div class="tarjeta-escuela" data-linea="sin"><span class="te-linea">${n}</span><b>${s}</b><span class="te-hon">${t}</span></div></li>`).join("")}</ul>
  <p class="nota-ruta">${icono("mapa", "ico")}<span>Estamos reuniendo el catálogo de planteles sin examen para sumarlos al <a href="/mapa/">mapa de escuelas</a>. El catálogo oficial está en <a href="https://www.miderechomilugar.gob.mx/" rel="noopener" target="_blank">miderechomilugar.gob.mx</a>.</span></p>
</div></section>
${faqBloque(faq, "Preguntas sobre escuelas sin examen")}`;
  return hecha(ruta, d, cuerpo, faq);
}

// ---------- Aviso de privacidad ----------
function aviso() {
  const ruta = "/aviso-de-privacidad/";
  const d = {
    titulo: "Aviso de privacidad | ecoems.net",
    descripcion: "Aviso de privacidad de ecoems.net: qué datos se usan, cookies y cómo contactarnos.",
    nombreCorto: "Aviso de privacidad ecoems.net",
    seccion: "",
    migas: migas([["Inicio", "/"], ["Aviso de privacidad", ruta]]),
  };
  const cuerpo = `
${cabeceraPagina({ migasHtml: d.migas.html, h1: "Aviso de privacidad", lead: "Versión del 15 de octubre de 2026." })}
<section class="seccion"><div class="contenedor contenedor-angosto prosa">
  <h2>Responsable</h2>
  <p>Ibertelcom Digital (Victor Hugo Gutierrez Silva, persona física con actividad empresarial), con domicilio en Arrayanes 7, Col. San Francisco, Coacalco de Berriozábal, Estado de México, C.P. 55712. Contacto: contacto@ecoems.app.</p>
  <h2>Qué datos usamos</h2>
  <p>ecoems.net es un sitio informativo. No te pedimos registro ni datos personales. Las herramientas (calculadora, comparador, armar opciones) funcionan en tu navegador; lo que escribes en ellas no se envía a nuestros servidores. "Armar mis opciones" guarda tu lista solo en tu propio navegador para que no la pierdas.</p>
  <h2>Cookies y servicios de terceros</h2>
  <p>El servidor registra datos técnicos de cada visita (dirección IP, navegador, página) para seguridad y estadísticas. Si en el futuro mostramos anuncios de Google AdSense o usamos Google Analytics, esos servicios pueden usar cookies; lo indicaremos aquí y podrás administrarlas desde tu navegador o en la configuración de anuncios de Google.</p>
  <h2>Enlaces a otros sitios</h2>
  <p>Enlazamos a sitios oficiales (miderechomilugar.gob.mx, llave.gob.mx, sitios de la UNAM y el IPN) y a ecoems.app y examenes.lat, que tienen sus propios avisos de privacidad.</p>
  <h2>Derechos ARCO y cambios</h2>
  <p>Para ejercer tus derechos de acceso, rectificación, cancelación u oposición, escribe a contacto@ecoems.app. Si cambiamos este aviso, publicaremos aquí la nueva versión con su fecha.</p>
</div></section>`;
  return hecha(ruta, d, cuerpo, []);
}

export function paginas() {
  return [calculadora(), comparador(), armar(), mapa(), sinExamen(), aviso()];
}

// Herramientas (calculadora, comparador, armar opciones, escuelas por zona), escuelas sin examen y aviso de privacidad.
import { ESCUELAS, GRUPOS, PREGUNTAS_EXAMEN, MARGEN_TEPO } from "../datos.mjs";
import { icono } from "../iconos.mjs";
import { SITIO, utm } from "../plantilla.mjs";
import { migas, cabeceraPagina, faqBloque, faqLd, paginaLd, ACTUALIZADO } from "../componentes.mjs";

const datosJson = () =>
  `<script type="application/json" id="datos-escuelas">${JSON.stringify(
    ESCUELAS.map((e) => ({ s: e.slug, n: e.doble, c: e.comun, l: e.linea, i: e.institucion, a: [e.a2024, e.a2025, e.a2026], m: e.meta, z: e.alcaldia, ent: e.entidad, ar: e.area, d: e.direccion, g: e.coord, ca: e.carreras.slice(0, 4) })),
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
    <p class="nota-tabla">${icono("aviso", "ico")}<span>Es una referencia, no una garantía. Los aciertos de cada escuela cambian cada año. Datos: aciertos mínimos de asignación 2026; <a href="/aciertos/">ver tabla completa</a>. ¿Quieres filtrar por cercanía y por lo que quiere estudiar? Usa <a href="/prepas-cerca-de-mi/">Prepas cerca de mí</a>.</span></p>
  </div>
</section>
${app("calculadora")}
${faqBloque(faq, "Preguntas sobre la calculadora")}
${datosJson()}`;
  return hecha(ruta, d, cuerpo, faq, [herramientaLd("Calculadora de aciertos ECOEMS", ruta, d.descripcion)]);
}

// ---------- Prepas cerca de mí: ¿qué escuela te conviene? ----------
function cercaDeMi() {
  const ruta = "/prepas-cerca-de-mi/";
  const d = {
    titulo: "Prepas cerca de mí: ¿qué escuela te conviene en el ECOEMS? | ecoems.net",
    descripcion: "Encuentra las prepas, CCH y vocacionales públicas cerca de tu ubicación que le convienen a tu hijo según sus aciertos y lo que quiere estudiar. Te damos la lista ordenada para el registro.",
    nombreCorto: "Prepas cerca de mí",
    migas: migas([["Inicio", "/"], ["Prepas cerca de mí", ruta]]),
  };
  const faq = [
    ["¿Cómo encuentro prepas públicas cerca de mi ubicación?", "Escribe tu código postal o toca «Usar mi ubicación» y elige cuántos kilómetros puede viajar. La herramienta mide la distancia en línea recta a las 31 escuelas de la UNAM y el IPN que asignan lugar con el examen ECOEMS y te muestra solo las que quedan dentro de ese rango."],
    ["Si quiero estudiar medicina, ¿qué prepa me conviene?", "En la UNAM puede ser cualquier prepa o CCH: la carrera se decide al final del bachillerato y el pase reglamentado depende del promedio. En el IPN conviene una vocacional del área Médico-Biológica, como la Voca 6 o la Voca 15, porque su plan de estudios y su carrera técnica van hacia la salud. Medicina es de las carreras más pedidas, así que el promedio pesa mucho."],
    ["¿Las vocacionales del IPN tienen pase directo a la universidad?", "No. En el IPN no existe el pase directo: quien termina una vocacional presenta el examen de admisión de nivel superior como cualquier aspirante, eligiendo un área y dos carreras de esa misma área. Elegir una voca del área que le interesa sí ayuda, porque estudia los temas y la carrera técnica de esa área."],
    ["¿Cómo funciona el pase reglamentado de la UNAM?", "Quien termina la prepa o el CCH de la UNAM en cuatro años o menos con promedio mínimo de 7 tiene derecho al pase reglamentado; con promedio de 9 o más en tres años tiene además preferencia en carrera y plantel. No es automático: la UNAM asigna según promedio, cupo y demanda de cada carrera."],
    ["¿En qué orden pongo las escuelas en el registro?", "De la que más quiere a la que menos. El sistema asigna la primera opción de la lista a la que le alcanzan sus aciertos y ya no revisa las de abajo. Por eso la lista que te damos empieza con las retadoras, sigue con las alcanzables y termina con las seguras."],
    ["¿La distancia es exacta?", "Es aproximada: se mide en línea recta desde el centro de tu código postal (o desde tu ubicación si la compartes) hasta el plantel. El tiempo real depende del transporte; en cada escuela tienes un botón «Cómo llegar» que abre la ruta en Google Maps."],
  ];
  const radio = (name, v, t, checked, sub = "") => `<label class="cm-op"><input type="radio" name="${name}" value="${v}"${checked ? " checked" : ""}><span><b>${t}</b>${sub ? `<small>${sub}</small>` : ""}</span></label>`;
  const cuerpo = `
${cabeceraPagina({ migasHtml: d.migas.html, h1: "Prepas cerca de mí: ¿qué escuela le conviene?", lead: "Contesta cuatro preguntas y te armamos la lista de prepas, CCH y vocacionales públicas cerca de tu casa, en el orden en que conviene registrarlas en Mi Derecho, Mi Lugar." })}
<section class="seccion herramienta-seccion" aria-label="Buscador de escuelas">
  <div class="contenedor cm">
    <form class="cm-form" id="cm-form" novalidate>
      <fieldset class="cm-paso">
        <legend><span class="cm-n">1</span>¿Cuántos aciertos saca hoy?</legend>
        <div class="calc-fila"><input id="cm-aciertos" type="number" inputmode="numeric" min="0" max="128" value="95" aria-describedby="cm-ac-ayuda"><span class="calc-de">de 128</span></div>
        <label class="cm-check"><input type="checkbox" id="cm-nosabe"> Aún no sé sus aciertos</label>
        <select id="cm-nivel" class="select-grande" hidden aria-label="Nivel aproximado">
          <option value="65">Le cuesta trabajo (menos de 70)</option>
          <option value="80" selected>Regular (entre 70 y 90)</option>
          <option value="95">Bien (entre 90 y 100)</option>
          <option value="108">Muy bien (más de 100)</option>
        </select>
        <p class="calc-ayuda" id="cm-ac-ayuda">Usa su último simulacro completo. ¿No tiene uno? Haz el <a href="${utm(SITIO.app, "prepas-cerca")}">diagnóstico gratis de ecoems.app</a>.</p>
      </fieldset>
      <fieldset class="cm-paso">
        <legend><span class="cm-n">2</span>¿Qué le gustaría estudiar después?</legend>
        <div class="cm-ops">
          ${radio("cm-area", "ing", "Ingeniería y tecnología", false, "Físico-Matemáticas")}
          ${radio("cm-area", "salud", "Salud y biología", false, "Médico-Biológicas")}
          ${radio("cm-area", "soc", "Negocios y administración", false, "Sociales y Administrativas")}
          ${radio("cm-area", "hum", "Humanidades, arte o derecho", false)}
          ${radio("cm-area", "nose", "Aún no lo sabe", true)}
        </div>
      </fieldset>
      <fieldset class="cm-paso">
        <legend><span class="cm-n">3</span>¿Dónde viven?</legend>
        <div class="calc-fila"><input id="cm-cp" class="cm-cp" type="text" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" value="07300" aria-label="Código postal" autocomplete="postal-code"><button class="boton boton-secundario" type="button" id="cm-gps">${icono("mapa", "ico")}Usar mi ubicación</button></div>
        <p class="calc-ayuda" id="cm-donde" aria-live="polite">Ejemplo: 07300, Gustavo A. Madero.</p>
        <label for="cm-dist">¿Hasta qué distancia puede viajar?</label>
        <select id="cm-dist" class="select-grande">
          <option value="5">Hasta 5 km</option><option value="10">Hasta 10 km</option><option value="15" selected>Hasta 15 km</option><option value="20">Hasta 20 km</option><option value="30">Hasta 30 km</option><option value="0">Sin límite</option>
        </select>
      </fieldset>
      <fieldset class="cm-paso">
        <legend><span class="cm-n">4</span>¿Qué tan seguro quiere ir?</legend>
        <div class="cm-ops cm-ops-3">
          ${radio("cm-estilo", "arriesgado", "Arriesgado", false, "Más escuelas reto")}
          ${radio("cm-estilo", "equilibrado", "Equilibrado", true, "Reto, alcanzables y seguras")}
          ${radio("cm-estilo", "seguro", "Seguro", false, "Más escuelas seguras")}
        </div>
        <div class="cm-inst"><label class="cm-check"><input type="checkbox" id="cm-unam" checked> UNAM</label><label class="cm-check"><input type="checkbox" id="cm-ipn" checked> IPN</label></div>
      </fieldset>
    </form>
    <div class="cm-res" id="cm-res" aria-live="polite">
      <div class="cm-resumen" id="cm-resumen"></div>
      <ol class="cm-lista" id="cm-lista"></ol>
      <div class="cm-avisos" id="cm-avisos"></div>
      <div class="acciones-escuela cm-acciones">
        <a class="boton" id="cm-armar" href="/armar-opciones/">${icono("opciones", "ico")}Pasar a Armar mis opciones</a>
        <a class="boton boton-secundario" id="cm-wa" href="https://wa.me/" target="_blank" rel="noopener">Compartir por WhatsApp</a>
        <button class="boton boton-secundario" type="button" id="cm-copiar">${icono("registro", "ico")}Copiar lista</button>
      </div>
      <p class="calc-ayuda" id="cm-aviso-accion" aria-live="polite"></p>
    </div>
  </div>
  <div class="contenedor"><p class="nota-tabla">${icono("aviso", "ico")}<span>Es una guía para planear, no una garantía de lugar. Usa los aciertos mínimos de asignación 2026 y la meta Tepo (2026 + ${MARGEN_TEPO}). Distancias aproximadas en línea recta; códigos postales con datos de <a href="https://www.geonames.org/" rel="noopener" target="_blank">GeoNames</a> y ubicación de planteles de <a href="https://www.openstreetmap.org/" rel="noopener" target="_blank">OpenStreetMap</a>. El registro oficial se hace solo en <a href="https://www.miderechomilugar.gob.mx/" rel="noopener" target="_blank">miderechomilugar.gob.mx</a>.</span></p></div>
</section>

<section class="seccion" aria-labelledby="t-unam-ipn">
  <div class="contenedor contenedor-angosto prosa">
    <h2 id="t-unam-ipn">UNAM o IPN: qué cambia según lo que quiere estudiar</h2>
    <p>Elegir entre una prepa o CCH de la UNAM y una vocacional del IPN no es solo cuestión de aciertos o de cercanía. Cada institución define en un momento distinto el camino hacia la carrera.</p>
    <h3>En la UNAM la carrera se decide al final</h3>
    <p>En las prepas (ENP) y los CCH todos llevan el mismo bachillerato general. En la prepa, el alumno elige un área en sexto año; en el CCH, sus materias optativas en quinto y sexto semestre. Al terminar puede pedir cualquier licenciatura de la UNAM con el <b>pase reglamentado</b>: necesita terminar en cuatro años o menos con promedio mínimo de 7, y con 9 o más en tres años tiene preferencia. No es automático: la UNAM asigna según promedio y cupo, así que las carreras más pedidas, como Medicina, exigen promedios altos.</p>
    <p>Por eso, si tu hijo <b>aún no sabe qué estudiar</b>, la UNAM le da más tiempo para decidir.</p>
    <h3>En el IPN el área se elige desde la vocacional</h3>
    <p>Cada vocacional pertenece a un área: <b>Físico-Matemáticas</b> (ingenierías y tecnología), <b>Médico-Biológicas</b> (salud, química y biología) o <b>Sociales y Administrativas</b> (contaduría, administración, comercio). Además del bachillerato, el alumno sale con una <b>carrera técnica</b> de esa área.</p>
    <p>En el IPN <b>no hay pase directo</b>: al terminar la voca presenta el examen de nivel superior como cualquier aspirante, eligiendo un área y dos carreras de esa misma área. Elegir una voca del área que le interesa le da ventaja, porque llega preparado en esos temas y con experiencia técnica. Por eso la herramienta solo te sugiere vocacionales del área que elegiste.</p>
    <h3>Cómo arma la lista esta herramienta</h3>
    <ul>
      <li><b>Reto:</b> le faltan hasta 8 aciertos para lo que pidió la escuela en 2026.</li>
      <li><b>Alcanzable:</b> llega a los aciertos de 2026, pero todavía no a la meta Tepo.</li>
      <li><b>Segura:</b> llega a la meta Tepo (aciertos 2026 + ${MARGEN_TEPO}) o más.</li>
    </ul>
    <p>Respeta el límite de hasta 5 escuelas de la UNAM y 5 del IPN, descarta las que quedan fuera de la distancia que elegiste y ordena la lista de la más pedida a la menos pedida, que es como conviene registrarla. Luego puedes moverla a tu gusto en <a href="/armar-opciones/">Armar mis opciones</a> o revisar cada escuela en la <a href="/aciertos/">tabla de aciertos</a>.</p>
  </div>
</section>
${app("prepas-cerca")}
${faqBloque(faq, "Preguntas sobre las prepas cerca de mí")}
${datosJson()}`;
  return hecha(ruta, d, cuerpo, faq, [herramientaLd("Prepas cerca de mí: ¿qué escuela te conviene?", ruta, d.descripcion)]);
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
    descripcion: "Las prepas, CCH y vocacionales del ECOEMS agrupadas por alcaldía o municipio, con dirección y cómo llegar. Para ver cuáles te convienen según distancia y aciertos, usa Prepas cerca de mí.",
    nombreCorto: "Escuelas por zona",
    migas: migas([["Inicio", "/"], ["Mapa de escuelas", ruta]]),
  };
  const zonas = [...new Set(ESCUELAS.map((e) => e.alcaldia).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const porZona = zonas.map((z) => [z, ESCUELAS.filter((e) => e.alcaldia === z)]);
  const faq = [
    ["¿Qué prepas de la UNAM hay cerca de mí?", "Usa el filtro por alcaldía o municipio para ver las escuelas de tu zona. Si quieres que te digamos cuáles te convienen según tu código postal, sus aciertos y lo que quiere estudiar, usa la herramienta Prepas cerca de mí."],
    ["¿Qué escuelas del ECOEMS hay en el Estado de México?", `${ESCUELAS.filter((e) => e.entidad === "Estado de México").map((e) => `${e.doble} (${e.alcaldia})`).join(", ")}. El resto de las escuelas de la UNAM y el IPN están en la Ciudad de México.`],
  ];
  const cuerpo = `
${cabeceraPagina({
  migasHtml: d.migas.html,
  h1: "Prepas, CCH y vocacionales por alcaldía",
  lead: `Las ${ESCUELAS.length} escuelas de la UNAM y el IPN agrupadas por alcaldía o municipio. Elige tu zona y traza la ruta desde tu casa. ¿Quieres saber cuáles te convienen? Prueba <a href="/prepas-cerca-de-mi/">Prepas cerca de mí</a>.`,
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
${cabeceraPagina({ migasHtml: d.migas.html, h1: "Aviso de privacidad", lead: "Versión del 17 de octubre de 2026." })}
<section class="seccion"><div class="contenedor contenedor-angosto prosa">
  <h2>Responsable</h2>
  <p>Ibertelcom Digital (Victor Hugo Gutierrez Silva, persona física con actividad empresarial), con domicilio en Arrayanes 7, Col. San Francisco, Coacalco de Berriozábal, Estado de México, C.P. 55712. Contacto: contacto@ecoems.net.</p>
  <h2>Qué datos usamos</h2>
  <p>ecoems.net es un sitio informativo. No te pedimos registro ni datos personales. Las herramientas (calculadora, comparador, armar opciones) funcionan en tu navegador; lo que escribes en ellas no se envía a nuestros servidores. "Armar mis opciones" guarda tu lista solo en tu propio navegador para que no la pierdas.</p>
  <h2>Cookies y servicios de terceros</h2>
  <p>El servidor registra datos técnicos de cada visita (dirección IP, navegador, página) para seguridad y estadísticas. Usamos Google Analytics para saber cuántas personas visitan el sitio y qué páginas les sirven; usa cookies y datos de navegación anónimos o agregados, y no lo usamos para identificarte. Puedes bloquear sus cookies desde tu navegador o con el complemento de inhabilitación de Google Analytics. Si en el futuro mostramos anuncios de Google AdSense, lo indicaremos aquí.</p>
  <h2>Enlaces a otros sitios</h2>
  <p>Enlazamos a sitios oficiales (miderechomilugar.gob.mx, llave.gob.mx, sitios de la UNAM y el IPN) y a ecoems.app y examenes.lat, que tienen sus propios avisos de privacidad.</p>
  <h2>Derechos ARCO y cambios</h2>
  <p>Para ejercer tus derechos de acceso, rectificación, cancelación u oposición, escribe a contacto@ecoems.net. Si cambiamos este aviso, publicaremos aquí la nueva versión con su fecha.</p>
</div></section>`;
  return hecha(ruta, d, cuerpo, []);
}


// ---------- Contacto (con quiénes somos, para confianza y AdSense) ----------
function contacto() {
  const ruta = "/contacto/";
  const d = {
    titulo: "Contacto y quiénes somos | ecoems.net",
    descripcion: "Quién hace ecoems.net, cómo contactarnos y dónde resolver dudas oficiales del registro de Mi Derecho, Mi Lugar y el examen ECOEMS.",
    nombreCorto: "Contacto ecoems.net",
    seccion: "",
    migas: migas([["Inicio", "/"], ["Contacto", ruta]]),
  };
  const faq = [
    ["¿ecoems.net puede hacer mi registro o cambiar mis opciones?", "No. ecoems.net es una guía independiente. El registro, los cambios y los resultados solo se hacen en miderechomilugar.gob.mx."],
    ["¿Dónde pregunto por un problema con mi registro o mi folio?", "En Educatel, de lunes a viernes de 8:00 a 20:00 h: 55 3601 7599 y 800 288 6688 (sin costo), o al correo contacto.miderechomilugar@sems.gob.mx."],
    ["Encontré un dato equivocado en ecoems.net, ¿cómo lo reporto?", "Escríbenos a contacto@ecoems.net con la página y el dato. Revisamos contra la fuente oficial y, si corresponde, lo corregimos y actualizamos la fecha de la página."],
  ];
  const cuerpo = `
${cabeceraPagina({ migasHtml: d.migas.html, h1: "Contacto", lead: "Escríbenos si encontraste un error, tienes una sugerencia o quieres colaborar. Para trámites del registro, abajo te decimos a dónde acudir." })}
<section class="seccion"><div class="contenedor rejilla-media contacto">
  <div class="prosa">
    <h2>Escríbenos</h2>
    <div class="tarjeta-contacto">
      ${icono("correo", "ico camino-ico")}
      <div>
        <span>Correo de ecoems.net</span>
        <b id="correo-contacto">contacto@ecoems.net</b>
        <div class="acciones-escuela">
          <a class="boton" href="mailto:contacto@ecoems.net?subject=Contacto%20desde%20ecoems.net">Escribir correo</a>
          <button class="boton boton-secundario" type="button" id="copiar-correo">Copiar correo</button>
        </div>
        <small id="copiar-aviso" aria-live="polite"></small>
      </div>
    </div>
    <p>Respondemos en un plazo de 2 a 3 días hábiles. Nos ayuda mucho que nos digas la página y el dato del que hablas.</p>
    <h3>Para qué sí podemos ayudarte</h3>
    <ul class="modalidades">
      <li><b>Reportar un error</b> en aciertos, fechas o direcciones de escuelas.</li>
      <li><b>Sugerencias</b> de herramientas o temas que te gustaría ver en el sitio.</li>
      <li><b>Colaboraciones</b> con escuelas, orientadores o medios.</li>
    </ul>
  </div>
  <div class="prosa">
    <h2>Dudas del trámite oficial</h2>
    <p class="pie-aviso aviso-claro">${icono("aviso")}<span><b>ecoems.net no es un sitio oficial</b> y no tiene acceso a tu registro, folio ni resultados.</span></p>
    <p>Para cualquier problema con el registro, la Llave MX, el pago, la toma de fotografía o tus resultados, contacta directamente a Mi Derecho, Mi Lugar:</p>
    <ul class="modalidades">
      <li><b>Sitio oficial:</b> <a href="https://www.miderechomilugar.gob.mx/" rel="noopener" target="_blank">miderechomilugar.gob.mx</a></li>
      <li><b>Educatel:</b> 55 3601 7599 y 800 288 6688 (sin costo), de lunes a viernes de 8:00 a 20:00 h.</li>
      <li><b>Correo:</b> contacto.miderechomilugar@sems.gob.mx</li>
    </ul>
    <p>Antes de escribir, revisa si tu duda ya está en las <a href="/preguntas-frecuentes/">preguntas frecuentes</a>.</p>
  </div>
</div></section>
<section class="seccion seccion-blanca" aria-labelledby="t-quienes"><div class="contenedor contenedor-angosto prosa">
  <h2 id="t-quienes">Quiénes hacemos ecoems.net</h2>
  <p>ecoems.net es un proyecto de <b>Ibertelcom Digital</b>, de Coacalco de Berriozábal, Estado de México. Nació de la experiencia de un papá que acompañó a su hijo en el proceso ECOEMS 2026 y se dio cuenta de lo difícil que era entender el proceso y encontrar los aciertos de cada escuela en un solo lugar.</p>
  <p>Por eso este sitio reúne, en lenguaje sencillo, cómo funciona Mi Derecho, Mi Lugar, los aciertos oficiales de cada prepa, CCH y vocacional, y herramientas para decidir. Todos los datos los tomamos de fuentes oficiales y en cada página indicamos la fecha de actualización.</p>
  <p>Somos el mismo equipo detrás de <a href="${utm(`${SITIO.lat}/`, "contacto")}">examenes.lat</a>, el portal de exámenes simuladores y guías de estudio para exámenes de admisión, y de <a href="${utm(SITIO.app, "contacto")}">ecoems.app</a>, la app para que papás y mamás sigan el avance de sus hijos rumbo al ECOEMS.</p>
  <h3>Cómo cuidamos la información</h3>
  <ul class="modalidades">
    <li><b>Fuentes oficiales:</b> convocatoria e instructivo de Mi Derecho, Mi Lugar y resultados publicados del proceso de asignación.</li>
    <li><b>Fechas verificadas:</b> si una fecha del año en curso no se ha publicado, lo decimos y mostramos la del año anterior como referencia.</li>
    <li><b>Correcciones:</b> si nos reportas un error, lo revisamos y actualizamos la página.</li>
  </ul>
  <p class="actualizado">Responsable: Ibertelcom Digital (Victor Hugo Gutierrez Silva), Arrayanes 7, Col. San Francisco, Coacalco de Berriozábal, Estado de México, C.P. 55712. Consulta nuestro <a href="/aviso-de-privacidad/">aviso de privacidad</a>.</p>
</div></section>
${faqBloque(faq, "Preguntas sobre el contacto")}`;
  const org = {
    "@context": "https://schema.org", "@type": "Organization", name: "ecoems.net", url: `${SITIO.dominio}/`,
    email: "contacto@ecoems.net", logo: `${SITIO.dominio}/favicon.svg`,
    parentOrganization: { "@type": "Organization", name: "Ibertelcom Digital", url: "https://ibertelcom.com" },
    address: { "@type": "PostalAddress", streetAddress: "Arrayanes 7, Col. San Francisco", addressLocality: "Coacalco de Berriozábal", addressRegion: "Estado de México", postalCode: "55712", addressCountry: "MX" },
    sameAs: [`${SITIO.lat}/`, SITIO.app],
  };
  const r = hecha(ruta, d, cuerpo, faq, [org]);
  const base = r.jsonld;
  r.jsonld = () => base().map((o) => (o["@type"] === "WebPage" ? { ...o, "@type": "ContactPage" } : o));
  return r;
}

export function paginas() {
  return [cercaDeMi(), calculadora(), comparador(), armar(), mapa(), sinExamen(), aviso(), contacto()];
}

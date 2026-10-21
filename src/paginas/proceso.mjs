// Páginas del proceso ECOEMS / Mi Derecho, Mi Lugar. Cada una es una "parada" de la ruta.
// Fuentes: Convocatoria Mi Derecho, Mi Lugar 2026 (miderechomilugar.gob.mx) e instructivo IPN-UNAM 2026.
// Las fechas 2027 no se han publicado: se muestran las de 2026 como referencia.
import { ESCUELAS, GRUPOS, RESUMEN, PREGUNTAS_EXAMEN, MARGEN_TEPO } from "../datos.mjs";
import { caminosExternos } from "../externos.mjs";
import { icono } from "../iconos.mjs";
import { imagen, registrar } from "../imagenes.mjs";
import { SITIO, utm } from "../plantilla.mjs";
import { migas, cabeceraPagina, faqBloque, faqLd, paginaLd, ACTUALIZADO } from "../componentes.mjs";

const OFICIAL = "https://www.miderechomilugar.gob.mx/";
const CONVOCATORIA_LAT = `${SITIO.lat}/noticias/mx/convocatorias/convocatoria-ecoems/`;
const of = (t = "miderechomilugar.gob.mx") => `<a href="${OFICIAL}" rel="noopener" target="_blank">${t}</a>`;
// Bloque de botones hacia las herramientas que ayudan con el paso.
const HERR = {
  armar: ["/armar-opciones/", "opciones", "Arma y ordena tus opciones", "Agrega hasta 5 escuelas de la UNAM y 5 del IPN, ordénalas y revisa si tu lista tiene retadoras, alcanzables y seguras."],
  cerca: ["/prepas-cerca-de-mi/", "mapa", "Prepas cerca de mí", "Con sus aciertos, tu código postal y lo que quiere estudiar, te armamos la lista ya ordenada."],
  calc: ["/calculadora/", "calculadora", "Calculadora de aciertos", "Escribe sus aciertos y ve qué escuelas le alcanzan con margen, cuáles están en la orilla y cuáles son reto."],
};
function ctaHerramientas([titulo, claves]) {
  return `
<section class="seccion seccion-estudiar" aria-labelledby="t-cta-herr">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-cta-herr">${titulo}</h2>
    <div class="caminos">${claves.map((k) => { const [href, ic, t, d] = HERR[k]; return `<a class="camino" href="${href}">${icono(ic, "ico camino-ico")}<span><b>${t}</b><span>${d}</span></span>${icono("flecha", "ico camino-ext")}</a>`; }).join("")}</div>
  </div>
</section>`;
}

const aviso2027 = `<p class="nota-ruta">${icono("calendario", "ico")}<span>La convocatoria 2027 aún no se publica. Las fechas de esta página son las de <b>2026</b>, como referencia; las actualizamos en cuanto salga la oficial.</span></p>`;

// Orden de la ruta (para la mini ruta y los botones anterior/siguiente)
// [slug, etiqueta corta de la mini ruta, nombre completo con la palabra clave (para títulos y anterior/siguiente)]
const RUTA = [
  ["que-es-ecoems", "Qué es", "Qué es el ECOEMS"],
  ["mi-derecho-mi-lugar", "Mi Derecho, Mi Lugar", "Mi Derecho, Mi Lugar"],
  ["fechas", "Fechas", "Fechas del ECOEMS"],
  ["llave-mx", "Llave MX", "Llave MX para Mi Derecho, Mi Lugar"],
  ["registro", "Registro", "Registro de Mi Derecho, Mi Lugar"],
  ["modalidades", "Modalidades", "Modalidades con y sin examen"],
  ["como-elegir-opciones", "Elegir opciones", "Cómo elegir y ordenar las opciones"],
  ["correo", "Correo", "Correo de Mi Derecho, Mi Lugar"],
  ["examen", "Examen", "Examen ECOEMS en línea"],
  ["resultados", "Resultados", "Resultados del ECOEMS"],
  ["no-quede", "Si no quedó", "Qué hacer si no quedó en el ECOEMS"],
];

function miniRuta(slug) {
  const i = RUTA.findIndex(([s]) => s === slug);
  if (i < 0) return "";
  return `<ol class="mini-ruta">${RUTA.map(
    ([s, t, k], j) => `<li${j === i ? ' aria-current="step"' : j < i ? ' class="pasada"' : ""}><a href="/${s}/" title="${k}"><span class="mr-punto"></span><span class="mr-texto">${t}</span></a></li>`,
  ).join("")}</ol>`;
}

function anteriorSiguiente(slug) {
  const i = RUTA.findIndex(([s]) => s === slug);
  if (i < 0) return "";
  const a = RUTA[i - 1];
  const s = RUTA[i + 1];
  return `
<nav class="paradas-nav contenedor" aria-label="Siguiente paso">
  ${a ? `<a class="pn pn-ant" href="/${a[0]}/"><small>Parada anterior</small><b>${a[2]}</b></a>` : "<span></span>"}
  ${s ? `<a class="pn pn-sig" href="/${s[0]}/"><small>Siguiente parada</small><b>${s[2]}</b></a>` : `<a class="pn pn-sig" href="/aciertos/"><small>Ahora revisa</small><b>Cuántos aciertos pide cada escuela</b></a>`}
</nav>`;
}

function caminos(slug) {
  const titulos = { "preguntas-frecuentes": "Para estudiar y estar al día", "mi-derecho-mi-lugar": "Para estar al día con el proceso", fechas: "Para no perder ninguna fecha", "llave-mx": "Para estar al día con el proceso", registro: "Antes y después del registro", correo: "Para no perder ningún aviso", examen: "Para practicar el examen", resultados: "Después de los resultados", "no-quede": "Para el siguiente paso", "que-es-ecoems": "Para empezar a estudiar" };
  return `
<section class="seccion seccion-estudiar" aria-labelledby="t-estudiar-${slug}">
  <div class="contenedor contenedor-angosto">
    <h2 id="t-estudiar-${slug}">${titulos[slug] ?? "Mientras tanto: ¿cómo va con el estudio?"}</h2>
    ${caminosExternos(`/${slug}/`, `proceso-${slug}`)}
  </div>
</section>`;
}

function pagina(d) {
  const ruta = `/${d.slug}/`;
  const m = migas([["Inicio", "/"], ["Mi Derecho, Mi Lugar", "/mi-derecho-mi-lugar/"], [d.miga, ruta]].filter((x, i, arr) => !(d.slug === "mi-derecho-mi-lugar" && i === 1)));
  const img = d.img
    ? registrar(d.img.id, {
        archivo: `${d.img.id}.webp`, ancho: 1200, alto: 800, alt: d.img.alt, title: d.img.title, descripcion: d.img.desc,
        prompt: `Fotografía realista 3:2. ${d.img.desc} Ciudad de México, ambiente cálido y natural. Sin texto legible, sin logotipos ni escudos oficiales, sin fechas ni años.`,
        uso: `Proceso · ${d.miga}`,
      })
    : null;
  const secciones = d.secciones
    .map(
      ([h2, html], i) => `
<section class="seccion${i % 2 ? " seccion-blanca" : ""}" aria-labelledby="t-${d.slug}-${i}">
  <div class="contenedor contenedor-angosto">
    <div class="prosa">
      <h2 id="t-${d.slug}-${i}">${h2}</h2>
      ${html}
    </div>
  </div>
</section>`,
    )
    .join("");
  const cuerpo = `
${cabeceraPagina({ migasHtml: m.html, h1: d.h1, lead: d.lead, img })}
<nav class="ruta-banda" aria-label="Paradas del proceso Mi Derecho, Mi Lugar"><div class="contenedor">${miniRuta(d.slug)}</div></nav>
${secciones}
${d.cta ? ctaHerramientas(d.cta) : ""}
${anteriorSiguiente(d.slug)}
${d.sinCaminos ? "" : caminos(d.slug)}
<div class="anuncio" data-anuncio="proceso-${d.slug}" hidden></div>
${d.faq?.length ? faqBloque(d.faq, d.faqTitulo ?? "Preguntas frecuentes") : ""}`;
  return {
    META: { ruta, titulo: d.titulo, descripcion: d.descripcion }, ACTUALIZADO, nombreCorto: d.nombreCorto, seccion: "proceso",
    cuerpo: () => cuerpo,
    jsonld: () => [paginaLd({ titulo: d.titulo, ruta, descripcion: d.descripcion, tipo: d.tipo ?? "WebPage" }), m.ld, ...(d.faq?.length ? [faqLd(d.faq)] : []), ...(d.ldExtra ?? [])],
  };
}

const enp = GRUPOS[0].escuelas.map((e) => e.a2026);
const cch = GRUPOS[1].escuelas.map((e) => e.a2026);
const voca = GRUPOS[2].escuelas.map((e) => e.a2026);
const rango = (a) => `${Math.min(...a)} a ${Math.max(...a)}`;

const CALENDARIO_2026 = [
  ["17 de marzo – 14 de abril", "Registro en línea en Mi Derecho, Mi Lugar, con Llave MX", "/registro/"],
  ["Durante el registro", "Elección de modalidad y orden de opciones", "/como-elegir-opciones/"],
  ["Según la cita del Documento A", "Toma de fotografía presencial (solo quien va por UNAM o IPN)", "/examen/"],
  ["18 – 22 de mayo", "Conclusión del registro para examen y pago del derecho", "/registro/"],
  ["16 – 19 de junio", "Simulador oficial para probar el equipo", "/examen/"],
  ["20 – 28 de junio", "Examen ECOEMS en línea", "/examen/"],
  ["18 de agosto", "Gaceta Electrónica de Resultados", "/resultados/"],
  ["19 – 26 de agosto", "Registro extemporáneo para opciones sin examen", "/no-quede/"],
  ["Desde el 26 de agosto", "Lugares disponibles por procedimiento de cada institución", "/no-quede/"],
  ["28 de agosto", "Cierre del proceso", "/resultados/"],
];

const PAGINAS = [
  {
    slug: "que-es-ecoems", miga: "Qué es el ECOEMS", nombreCorto: "Qué es el ECOEMS",
    titulo: "¿Qué es el ECOEMS? Significado y cómo funciona el examen | ecoems.net",
    descripcion: "Qué es el ECOEMS, qué significa, para qué escuelas cuenta y en qué se diferencia del antiguo examen COMIPEMS. Explicado para papás y aspirantes.",
    h1: "¿Qué es el ECOEMS y para qué sirve?",
    lead: "El examen con el que la UNAM y el IPN asignan lugar en sus prepas, CCH y vocacionales de la Ciudad de México y el Estado de México, explicado sin tecnicismos.",
    img: { id: "que-es-ecoems-aspirante", alt: "Aspirante de secundaria leyendo sobre el examen ECOEMS en su computadora", title: "Qué es el ECOEMS", desc: "Una adolescente de tercero de secundaria lee con atención en una laptop en la mesa del comedor, con su mamá a un lado." },
    secciones: [
      ["El ECOEMS, en una frase", `<p>El <b>ECOEMS</b> es el examen de admisión que aplican juntas la <b>UNAM</b> y el <b>IPN</b> para repartir los lugares de sus escuelas de bachillerato en la Zona Metropolitana del Valle de México: las ${GRUPOS[0].escuelas.length} <a href="/escuelas/prepas-unam/">prepas de la UNAM</a>, los ${GRUPOS[1].escuelas.length} <a href="/escuelas/cch-unam/">CCH</a> y las ${GRUPOS[2].escuelas.length} <a href="/escuelas/vocacionales-ipn/">vocacionales del IPN</a>.</p>
        <p>Tiene <b>${PREGUNTAS_EXAMEN} preguntas</b> de opción múltiple y se presenta en línea. Con los aciertos de cada aspirante se arma una lista de mayor a menor, y los lugares se asignan en ese orden, respetando las escuelas que cada quien eligió en su registro.</p>
        <p>Mucha gente lo sigue llamando <b>examen COMIPEMS</b>, porque así se llamó el concurso hasta 2024. Si escuchas cualquiera de los dos nombres, hablan de lo mismo para fines prácticos: el examen para entrar a la prepa de la UNAM o del IPN.</p>`],
      ["ECOEMS y Mi Derecho, Mi Lugar: no son lo mismo", `<p>Desde 2025 todo el proceso de ingreso al bachillerato público en la CDMX y el Estado de México se hace en <a href="/mi-derecho-mi-lugar/">Mi Derecho, Mi Lugar</a>: ahí se registra el aspirante, elige su modalidad y sus escuelas y consulta su resultado.</p>
        <p>El examen ECOEMS es solo una parte de ese proceso y <b>solo cuenta para la UNAM y el IPN</b>. Las demás opciones (COLBACH, CONALEP, DGB, DGETAyCM, DGETI, IEMS, SECTI y el plantel Texcoco de la UAEMéx) asignan lugar <b>sin examen</b>, por el orden de opciones y los lugares disponibles.</p>
        <ul class="modalidades"><li><b>Con examen ECOEMS:</b> prepas y CCH de la UNAM, vocacionales del IPN.</li><li><b>Sin examen:</b> el resto de las opciones de Mi Derecho, Mi Lugar.</li></ul>`],
      ["¿Qué tan difícil es entrar?", `<p>Depende de la escuela. En 2026 las prepas de la UNAM pidieron de ${rango(enp)} aciertos, los CCH de ${rango(cch)} y las vocacionales de ${rango(voca)}. La más pedida fue la <a href="/escuelas/${RESUMEN.mayor.slug}/">${RESUMEN.mayor.doble}</a>, con ${RESUMEN.mayor.a2026} de ${PREGUNTAS_EXAMEN}.</p>
        <p>Además, para la UNAM y el IPN se pide un <b>promedio mínimo de 7.0</b> en secundaria. <a href="/aciertos/">Ver los aciertos de cada escuela</a>.</p>`],
    ],
    faq: [
      ["¿Qué significa ECOEMS?", "Es el nombre con el que se conoce el examen de ingreso al bachillerato de la UNAM y el IPN en la Zona Metropolitana del Valle de México, dentro del proceso Mi Derecho, Mi Lugar."],
      ["¿El ECOEMS es lo mismo que el COMIPEMS?", "Cumplen la misma función: el examen para entrar a la prepa de la UNAM o del IPN. COMIPEMS fue el concurso hasta 2024; desde 2025 el proceso se llama Mi Derecho, Mi Lugar y el examen se conoce como ECOEMS."],
      ["¿Quién tiene que presentar el ECOEMS?", "Solo quien quiere una escuela de la UNAM o del IPN (modalidad 2 o 3 del registro). Quien elige solo escuelas sin examen (modalidad 1) no lo presenta."],
      ["¿Cuántas preguntas tiene el ECOEMS?", `${PREGUNTAS_EXAMEN} preguntas de opción múltiple.`],
    ],
  },
  {
    slug: "mi-derecho-mi-lugar", miga: "Mi Derecho, Mi Lugar", nombreCorto: "Mi Derecho, Mi Lugar",
    titulo: "Mi Derecho, Mi Lugar 2027: qué es y cómo funciona el ECOEMS | ecoems.net",
    descripcion: "Qué es Mi Derecho, Mi Lugar, quién puede registrarse, qué escuelas participan con y sin examen y cómo se asigna el lugar en la prepa. Guía para papás 2027.",
    h1: "Mi Derecho, Mi Lugar: cómo funciona el proceso para entrar a la prepa",
    lead: "El sistema de registro y asignación del bachillerato público en la Ciudad de México y el Estado de México, paso por paso y en palabras sencillas.",
    img: { id: "mi-derecho-mi-lugar-familia", alt: "Familia revisando en la computadora el registro de Mi Derecho, Mi Lugar", title: "Mi Derecho, Mi Lugar", desc: "Mamá, papá e hijo de secundaria frente a una computadora en casa, revisando juntos una lista de escuelas." },
    secciones: [
      ["¿Qué es Mi Derecho, Mi Lugar?", `<p><b>Mi Derecho, Mi Lugar</b> es el proceso oficial para conseguir lugar en el bachillerato público de la Zona Metropolitana del Valle de México. Sustituyó al concurso COMIPEMS desde 2025 y se hace en el sitio ${of()}.</p>
        <p>En un solo registro el aspirante elige entre escuelas <b>sin examen</b> (COLBACH, CONALEP, DGB, DGETAyCM, DGETI, IEMS, SECTI y el plantel Texcoco de la UAEMéx) y escuelas <b>con examen</b>, que son las de la UNAM y el IPN. Para estas últimas presenta el <a href="/que-es-ecoems/">examen ECOEMS</a>.</p>`],
      ["Quién puede registrarse", `<ul class="modalidades">
        <li><b>Aspirante local:</b> cursa tercero de secundaria en la Zona Metropolitana.</li>
        <li><b>Egresado:</b> ya tiene su certificado de secundaria al momento de registrarse.</li>
        <li><b>Foráneo:</b> cursa tercero de secundaria fuera de la Zona Metropolitana.</li>
        <li><b>INEA:</b> está acreditando la secundaria en el INEA.</li></ul>
        <p>Para quedar asignado se necesita el certificado de secundaria y cumplir los requisitos de cada institución; en la UNAM y el IPN, además, promedio mínimo de 7.0.</p>`],
      ["Cómo se asigna el lugar", `<p><b>En las escuelas sin examen</b> cuenta el orden en que pusiste las opciones en tu comprobante de registro y los lugares que tiene cada escuela.</p>
        <p><b>En la UNAM y el IPN</b> cuentan los aciertos del examen, el orden de tus opciones y los lugares disponibles. Por eso el orden importa tanto: si alcanzas tu primera opción, ahí quedas; si no, se revisa la segunda, y así. <a href="/como-elegir-opciones/">Cómo ordenar las opciones</a> o arma tu lista con <a href="/prepas-cerca-de-mi/">Prepas cerca de mí</a>.</p>
        <p>El resultado se publica en la Gaceta Electrónica de Resultados. En 2026 salió el 18 de agosto.</p>`],
      ["Los pasos, en orden", `<ol class="pasos-lista">
        <li><a href="/llave-mx/">Crear la Llave MX</a> del aspirante.</li>
        <li><a href="/registro/">Hacer el registro</a> en miderechomilugar.gob.mx y validar CURP, domicilio, teléfono y correo.</li>
        <li><a href="/modalidades/">Elegir la modalidad</a> y <a href="/como-elegir-opciones/">ordenar las escuelas</a>.</li>
        <li>Si va por UNAM o IPN: toma de fotografía, conclusión del registro y pago, y <a href="/examen/">examen en línea</a>.</li>
        <li><a href="/resultados/">Consultar el resultado</a> e inscribirse, o <a href="/no-quede/">buscar plan B</a>.</li></ol>
        <p>Las fechas de cada paso están en el <a href="/fechas/">calendario</a>.</p>`],
    ],
    faq: [
      ["¿Mi Derecho, Mi Lugar es lo mismo que el ECOEMS?", "No. Mi Derecho, Mi Lugar es todo el proceso de registro y asignación. El ECOEMS es el examen que forma parte de ese proceso y solo cuenta para la UNAM y el IPN."],
      ["¿Cuál es la página oficial de Mi Derecho, Mi Lugar?", "miderechomilugar.gob.mx. Desconfía de cualquier otro sitio que te pida datos o pagos para registrarte."],
      ["¿Mi Derecho, Mi Lugar tiene costo?", "El registro es gratuito. Quien va por la UNAM o el IPN paga el derecho a examen al concluir su registro; en 2026 el procedimiento fue del 18 al 22 de mayo."],
      ["¿Dónde pido ayuda oficial?", "En Educatel, de lunes a viernes de 8:00 a 20:00 h: 55 3601 7599 y 800 288 6688 (sin costo), o al correo contacto.miderechomilugar@sems.gob.mx."],
    ],
  },
  {
    slug: "fechas", miga: "Fechas y calendario", nombreCorto: "Fechas ECOEMS",
    img: { id: "fechas-calendario-ecoems", alt: "Mamá e hijo marcan en un calendario las fechas del registro, el examen ECOEMS y los resultados", title: "Fechas y calendario del ECOEMS", desc: "Mamá e hijo de secundaria frente a un calendario de pared marcando con plumón las etapas del proceso." },
    titulo: "Fechas ECOEMS 2027: registro, examen y resultados | ecoems.net",
    descripcion: "Calendario del ECOEMS y Mi Derecho, Mi Lugar: cuándo es el registro, el examen y los resultados. Fechas 2026 como referencia mientras sale la convocatoria 2027.",
    h1: "Fechas del ECOEMS: cuándo es el registro, el examen y los resultados",
    lead: "El calendario completo del proceso, parada por parada. Te avisamos aquí en cuanto salga la convocatoria oficial 2027.",
    secciones: [
      ["Calendario del proceso (referencia 2026)", `${aviso2027}
        <div class="tabla-envoltura"><table class="tabla-fechas"><caption>Calendario Mi Derecho, Mi Lugar y examen ECOEMS 2026</caption><thead><tr><th scope="col">Fecha 2026</th><th scope="col">Qué pasa</th></tr></thead><tbody>
        ${CALENDARIO_2026.map(([f, q, h]) => `<tr><th scope="row">${f}</th><td><a href="${h}">${q}</a></td></tr>`).join("")}
        </tbody></table></div>
        <p class="fuente">Fuente: Convocatoria Mi Derecho, Mi Lugar 2026 e instructivo IPN-UNAM 2026, publicados en ${of()}.</p>`],
      ["¿Cuándo sale la convocatoria 2027?", `<p>Todavía no hay fecha oficial. En 2026 los materiales informativos y el registro abrieron el <b>17 de marzo</b>, así que es razonable esperar la convocatoria 2027 a inicios de año. En cuanto salga publicamos la <a href="${utm(CONVOCATORIA_LAT, "fechas")}">convocatoria ECOEMS 2027</a> en examenes.lat.</p>
        <p>Si tu hijo o hija está en tercero de secundaria, el mejor uso de los meses antes del registro es estudiar y decidir qué escuelas quiere: revisa los <a href="/aciertos/">aciertos de cada escuela</a> y prueba la <a href="/calculadora/">calculadora</a>.</p>`],
      ["Las fechas que no se pueden pasar", `<ul class="modalidades">
        <li><b>Cierre del registro.</b> Sin registro no hay lugar en el proceso ordinario.</li>
        <li><b>Toma de fotografía y conclusión del registro para examen.</b> Sin ellas no se puede entrar al examen de la UNAM o el IPN.</li>
        <li><b>Días del examen.</b> Cada aspirante tiene asignado su día y horario.</li>
        <li><b>Inscripción después de resultados.</b> Si no te inscribes en las fechas que marca la Gaceta, pierdes el lugar.</li></ul>`],
    ],
    faq: [
      ["¿Cuándo es el examen ECOEMS 2027?", "Aún no se publica. En 2026 el examen en línea fue del 20 al 28 de junio, con un simulador oficial del 16 al 19 de junio."],
      ["¿Cuándo es el registro de Mi Derecho, Mi Lugar 2027?", "Aún no se publica. En 2026 el registro fue del 17 de marzo al 14 de abril."],
      ["¿Cuándo salen los resultados del ECOEMS?", "En 2026 la Gaceta Electrónica de Resultados se publicó el martes 18 de agosto en miderechomilugar.gob.mx."],
      ["¿Cuándo son las preinscripciones para la prepa?", "En la CDMX y el Estado de México no hay preinscripción aparte: el registro de Mi Derecho, Mi Lugar es la preinscripción. La inscripción a la escuela asignada se hace después de los resultados, en las fechas que marca la Gaceta."],
    ],
  },
  {
    slug: "llave-mx", miga: "Llave MX", nombreCorto: "Llave MX",
    titulo: "Llave MX para Mi Derecho, Mi Lugar: qué es y cómo crearla | ecoems.net",
    descripcion: "Para registrarse en Mi Derecho, Mi Lugar (ECOEMS) se necesita Llave MX. Qué es, qué datos pide, a nombre de quién se crea y errores comunes.",
    h1: "Llave MX para el registro de Mi Derecho, Mi Lugar",
    lead: "La cuenta del gobierno con la que se entra al registro del ECOEMS. Qué es, qué necesitas tener a la mano y cómo evitar los errores más comunes.",
    img: { id: "llave-mx-celular", alt: "Mamá crea en el celular la Llave MX de su hijo para el registro del ECOEMS", title: "Llave MX para el ECOEMS", desc: "Mamá y su hijo adolescente sentados juntos; ella sostiene un celular y él tiene en la mano su comprobante de CURP impreso." },
    secciones: [
      ["¿Qué es la Llave MX?", `<p>La <b>Llave MX</b> es la cuenta única del gobierno de México para hacer trámites en línea. En Mi Derecho, Mi Lugar se usa para entrar al registro: el aspirante genera su Llave MX y con ella valida su <b>CURP, domicilio, teléfono y correo electrónico</b>.</p>
        <p>Se crea en el sitio oficial <a href="https://www.llave.gob.mx/" rel="noopener" target="_blank">llave.gob.mx</a>. Es gratuita: nadie te debe cobrar por crearla.</p>`],
      ["Qué tener a la mano", `<ul class="modalidades">
        <li><b>CURP del aspirante</b>, revisada letra por letra.</li>
        <li><b>Un correo electrónico</b> que la familia revise seguido. Ahí llegan avisos importantes; lee <a href="/correo/">qué correo conviene usar</a>.</li>
        <li><b>Un número de celular</b> que reciba mensajes durante todo el proceso.</li>
        <li><b>Contraseña anotada</b> en un lugar seguro. La van a necesitar varias veces, de marzo a agosto.</li></ul>`],
      ["Errores comunes", `<ul class="modalidades">
        <li><b>Crearla con datos del papá o la mamá.</b> El registro es del aspirante: usa su CURP.</li>
        <li><b>Usar un correo que nadie revisa</b> o que comparten varios hijos.</li>
        <li><b>Dejarla para el último día.</b> Los primeros y últimos días del registro el sistema suele estar saturado.</li>
        <li><b>Registrarse en sitios que no son oficiales.</b> El único sitio de registro es ${of()}.</li></ul>
        <p>Con la Llave MX lista, sigue el <a href="/registro/">registro paso a paso</a>.</p>`],
    ],
    faq: [
      ["¿Es obligatoria la Llave MX para el ECOEMS?", "Sí. La convocatoria 2026 pide generar la Llave MX para hacer el registro en Mi Derecho, Mi Lugar."],
      ["¿Dónde se crea la Llave MX?", "En llave.gob.mx, el sitio oficial del gobierno de México. Es gratuita."],
      ["¿La Llave MX va a nombre del papá o del aspirante?", "Del aspirante, con su CURP. El papá o la mamá pueden ayudar a crearla, pero los datos son los del alumno."],
    ],
  },
  {
    slug: "registro", miga: "Registro paso a paso", nombreCorto: "Registro ECOEMS",
    titulo: "Registro Mi Derecho, Mi Lugar 2027 paso a paso (ECOEMS) | ecoems.net",
    descripcion: "Cómo hacer el registro de Mi Derecho, Mi Lugar para el ECOEMS: requisitos, documentos, pasos, comprobante de registro, toma de fotografía y pago del examen.",
    h1: "Registro de Mi Derecho, Mi Lugar paso a paso",
    lead: "Qué se necesita, qué se llena y qué documento te tienes que llevar al final. Con las fechas de 2026 como referencia.",
    img: { id: "registro-comprobante", alt: "Papá revisa el comprobante de registro de Mi Derecho, Mi Lugar de su hija", title: "Registro de Mi Derecho, Mi Lugar", desc: "Papá revisando una hoja impresa con una lista ordenada de escuelas mientras su hija señala una de ellas." },
    secciones: [
      ["Antes de empezar", `${aviso2027}
        <p>En 2026 el registro fue <b>del 17 de marzo al 14 de abril</b> en ${of()}. Ten lista la <a href="/llave-mx/">Llave MX</a> del aspirante y, si ya terminó la secundaria y su certificado no aparece en la base de datos, el <b>archivo electrónico del certificado</b> para subirlo.</p>`],
      ["Los pasos del registro", `<ol class="pasos-lista">
        <li><b>Entrar con Llave MX</b> y validar CURP, domicilio, teléfono y correo.</li>
        <li><b>Subir el certificado de secundaria</b>, solo si es egresado y no aparece en el sistema.</li>
        <li><b>Contestar la encuesta</b> de datos generales.</li>
        <li><b>Elegir la modalidad</b> (<a href="/modalidades/">1, 2 o 3</a>) y <b>ordenar las escuelas</b> de la que más quiere a la que menos.</li>
        <li><b>Informar si tiene alguna discapacidad</b>, para recibir apoyo en el proceso.</li>
        <li><b>Descargar el Comprobante de Registro</b>: es el documento que muestra el orden de tus opciones. Guárdalo.</li></ol>`],
      ["Si va por la UNAM o el IPN: dos pasos más", `<p><b>Toma de fotografía.</b> Quien eligió modalidad 2 o 3 acude en persona a tomarse la foto, en el lugar, fecha y hora que indica su Solicitud de Registro (Documento A). Esa foto se usa para verificar su identidad el día del examen.</p>
        <p><b>Conclusión del registro para examen y pago.</b> En 2026 fue del 18 al 22 de mayo. Sin este paso no se puede presentar el examen.</p>
        <p>Después viene el <a href="/examen/">examen en línea</a>.</p>`],
    ],
    cta: ["Antes de registrarte, arma tu lista", ["armar", "cerca"]],
    faq: [
      ["¿Qué documentos necesito para el registro?", "Llave MX del aspirante, CURP, domicilio, teléfono y correo. Si ya terminó la secundaria y su certificado no aparece en el sistema, el archivo electrónico del certificado."],
      ["¿Qué es el comprobante de registro?", "El documento que descargas al final del registro con el orden de tus opciones. Es la base para la asignación en las escuelas sin examen."],
      ["¿Puedo cambiar mis opciones después?", "Solo mientras el registro esté abierto y según lo que permita la plataforma. Revisa bien el orden antes de descargar el comprobante."],
      ["¿Cuánto cuesta el examen ECOEMS?", "El registro es gratuito. Quien va por la UNAM o el IPN paga el derecho a examen al concluir su registro; consulta el monto vigente en el instructivo oficial."],
    ],
  },
  {
    slug: "modalidades", miga: "Modalidades", nombreCorto: "Modalidades ECOEMS",
    img: { id: "modalidades-ecoems-con-sin-examen", alt: "Tres caminos para elegir modalidad en Mi Derecho, Mi Lugar: sin examen, con examen o ambas", title: "Modalidades de Mi Derecho, Mi Lugar", desc: "Ilustración de tres caminos que salen de una misma estación hacia tres tipos de bachillerato." },
    titulo: "Modalidades ECOEMS: modalidad 1, 2 y 3 de Mi Derecho, Mi Lugar | ecoems.net",
    descripcion: "Diferencias entre la modalidad 1, 2 y 3 de Mi Derecho, Mi Lugar: cuántas opciones se eligen, quién presenta el examen ECOEMS y qué pasa si no alcanza lugar.",
    h1: "Modalidades de Mi Derecho, Mi Lugar: ¿1, 2 o 3?",
    lead: "La decisión más importante del registro. Qué permite cada modalidad, cuántas escuelas se eligen y qué pasa si no alcanza lugar.",
    secciones: [
      ["Las tres modalidades", `<div class="tres-modalidades">
        <div class="tm" data-linea="sin"><b>Modalidad 1</b><span>Solo escuelas sin examen</span><p>De 5 a 10 opciones. No presenta el ECOEMS. Se asigna por el orden de opciones y los lugares disponibles.</p></div>
        <div class="tm" data-linea="con"><b>Modalidad 2</b><span>Solo UNAM y/o IPN</span><p>Hasta 5 escuelas del IPN y hasta 5 de la UNAM. Presenta el ECOEMS. Se asigna por aciertos.</p></div>
        <div class="tm" data-linea="mix"><b>Modalidad 3</b><span>Con y sin examen</span><p>De 5 a 10 sin examen más hasta 5 del IPN y 5 de la UNAM, hasta 20 opciones. Presenta el ECOEMS.</p></div>
      </div>`],
      ["Qué pasa si no alcanza lugar en la UNAM o el IPN", `<p><b>En la modalidad 3</b>, si no alcanza lugar en ninguna de sus escuelas con examen, se le asigna una de las opciones sin examen de su comprobante. Es la red de seguridad.</p>
        <p><b>En la modalidad 2</b> no hay red: si no alcanza lugar, tiene que registrarse en el periodo extemporáneo y buscar una opción sin examen con lugares disponibles. En 2026 ese periodo fue del 19 al 26 de agosto. <a href="/no-quede/">Qué hacer si no quedó</a>.</p>`],
      ["¿Cuál conviene?", `<p>Si tu hijo o hija quiere la UNAM o el IPN, la <b>modalidad 3</b> suele ser la opción más segura, porque combina las escuelas que quiere con un respaldo sin examen. La modalidad 2 tiene sentido solo si están dispuestos a buscar lugar en el periodo extemporáneo.</p>
        <p>Para escoger las escuelas con examen, revisa los <a href="/aciertos/">aciertos de cada una</a> y <a href="/como-elegir-opciones/">cómo ordenarlas</a>.</p>`],
    ],
    cta: ["¿Ya sabes qué escuelas poner?", ["cerca", "armar"]],
    faq: [
      ["¿En qué modalidad se presenta el examen ECOEMS?", "En la modalidad 2 y en la 3. En la modalidad 1 no hay examen."],
      ["¿Cuántas opciones puedo elegir?", "Modalidad 1: de 5 a 10. Modalidad 2: hasta 5 del IPN y 5 de la UNAM. Modalidad 3: de 5 a 10 sin examen más hasta 5 del IPN y 5 de la UNAM, máximo 20."],
      ["¿Qué modalidad conviene para la UNAM?", "La modalidad 3, porque si no alcanza lugar en la UNAM o el IPN, se le asigna una opción sin examen de su lista."],
    ],
  },
  {
    slug: "como-elegir-opciones", miga: "Cómo elegir opciones", nombreCorto: "Elegir opciones ECOEMS",
    titulo: "Cómo elegir opciones en el ECOEMS: el orden que conviene | ecoems.net",
    descripcion: "Cómo ordenar las escuelas en el registro de Mi Derecho, Mi Lugar: opciones retadoras, alcanzables y seguras según los aciertos del ECOEMS de cada escuela.",
    h1: "Cómo elegir y ordenar las opciones del ECOEMS",
    lead: "El orden de las escuelas decide tanto como los aciertos. Una forma sencilla de armar la lista con datos.",
    img: { id: "elegir-opciones-lista", alt: "Aspirante ordena en una lista las escuelas que quiere para el ECOEMS", title: "Cómo elegir opciones", desc: "Un adolescente con una libreta escribe una lista numerada mientras ve un mapa de la ciudad en la computadora." },
    secciones: [
      ["Por qué importa el orden", `<p>Con los aciertos del examen se forma una lista de mayor a menor. Cuando llega el turno de tu hijo o hija, se revisa su <b>primera opción</b>: si hay lugar, ahí queda; si no, se revisa la segunda, y así hasta encontrar lugar.</p>
        <p>Eso significa dos cosas: poner primero la escuela que <b>más quiere</b> (aunque sea difícil) no le quita nada, y poner al final escuelas que <b>no quiere</b> puede dejarlo en una que no le gusta.</p>`],
      ["Una regla sencilla: retadoras, alcanzables y seguras", `<p>Compara sus aciertos de hoy (por ejemplo, de un simulacro) con los <a href="/aciertos/">aciertos 2026 de cada escuela</a>:</p>
        <ul class="modalidades">
          <li><b>Retadoras:</b> piden más aciertos de los que lleva. Van primero, si de verdad las quiere.</li>
          <li><b>Alcanzables:</b> piden más o menos lo que lleva, con la meta Tepo (aciertos 2026 + ${MARGEN_TEPO}) como referencia.</li>
          <li><b>Seguras:</b> piden varios aciertos menos. Van al final de las opciones con examen.</li></ul>
        <p>En la modalidad 3, después van las opciones sin examen, también en orden de preferencia.</p>
        <p><a class="boton" href="/armar-opciones/">Arma y ordena tus opciones</a></p>`],
      ["Más cosas que pesar además de los aciertos", `<ul class="modalidades">
        <li><b>Distancia y transporte.</b> Tres años de trayecto diario pesan. Revisa la ubicación en la página de cada escuela.</li>
        <li><b>Tipo de bachillerato.</b> Prepa y CCH dan pase reglamentado a la UNAM; la vocacional da carrera técnica y orienta al IPN.</li>
        <li><b>Turno</b> y ambiente de la escuela: vale la pena visitarla.</li></ul>
        <p>Compara escuelas en la <a href="/escuelas/">lista de escuelas</a>, prueba la <a href="/calculadora/">calculadora de aciertos</a> o deja que <a href="/prepas-cerca-de-mi/">Prepas cerca de mí</a> te arme la lista ordenada según sus aciertos, tu código postal y lo que quiere estudiar.</p>`],
    ],
    cta: ["Arma tu lista con nuestras herramientas", ["armar", "cerca", "calc"]],
    faq: [
      ["¿Conviene poner primero una escuela muy difícil?", "Sí, si de verdad la quiere. Si no alcanza, se revisa la siguiente opción sin perder nada."],
      ["¿Cuántas escuelas con examen conviene poner?", "Las que de verdad aceptaría, hasta 5 de la UNAM y 5 del IPN. Incluye al menos una o dos seguras para sus aciertos."],
      ["¿Qué pasa si pongo escuelas que no quiero?", "Puede quedar asignado en una de ellas. Pon solo escuelas a las que sí iría."],
    ],
  },
  {
    slug: "correo", miga: "Correo del registro", nombreCorto: "Correo Mi Derecho, Mi Lugar",
    img: { id: "correo-registro-mi-derecho-mi-lugar", alt: "Papá revisa en el celular los correos del registro de Mi Derecho, Mi Lugar de su hija", title: "Correo del registro ECOEMS", desc: "Papá y su hija revisan en el celular la bandeja de entrada con los avisos del registro." },
    titulo: "Correo de Mi Derecho, Mi Lugar: avisos y cómo no perderlos | ecoems.net",
    descripcion: "Qué correo usar en el registro de Mi Derecho, Mi Lugar (ECOEMS), qué avisos llegan, qué hacer si no llegan y el contacto oficial de Educatel.",
    h1: "El correo del registro de Mi Derecho, Mi Lugar",
    lead: "Un correo bien elegido evita sustos. Qué cuenta usar, qué revisar y a quién escribir si algo falla.",
    secciones: [
      ["Qué correo usar", `<p>En el registro se valida un <b>correo electrónico</b> junto con la CURP, el domicilio y el teléfono. Úsalo para todo el proceso, de marzo a agosto:</p>
        <ul class="modalidades">
          <li>Una cuenta que <b>la familia revise seguido</b> (puede ser la del aspirante, si papá o mamá también tienen acceso).</li>
          <li>Una cuenta <b>solo para este aspirante</b>; no la compartas entre hermanos que se registran el mismo año.</li>
          <li>Con la contraseña <b>anotada</b> en un lugar seguro.</li></ul>`],
      ["Si no llega un correo", `<ul class="modalidades">
        <li>Revisa las carpetas de <b>spam, promociones o correo no deseado</b>.</li>
        <li>Entra a ${of()} con la <a href="/llave-mx/">Llave MX</a>: la información de tu registro también está ahí.</li>
        <li>Escribe a <b>contacto.miderechomilugar@sems.gob.mx</b> o llama a Educatel, de lunes a viernes de 8:00 a 20:00 h: <b>55 3601 7599</b> y <b>800 288 6688</b> (sin costo).</li></ul>
        <p>Recuerda que el resultado oficial no llega por correo: se publica en la Gaceta Electrónica de Resultados. <a href="/resultados/">Cómo consultarlo</a>.</p>`],
      ["Cuidado con correos falsos", `<p>Nadie de Mi Derecho, Mi Lugar te va a pedir pagos por transferencia a cuentas personales, contraseñas ni dinero para "asegurar un lugar". Si dudas de un correo, no hagas clic: entra directo al sitio oficial.</p>`],
    ],
    faq: [
      ["¿Cuál es el correo oficial de Mi Derecho, Mi Lugar?", "contacto.miderechomilugar@sems.gob.mx, según la convocatoria 2026."],
      ["¿Los resultados llegan por correo?", "No. Se publican en la Gaceta Electrónica de Resultados en miderechomilugar.gob.mx."],
      ["¿Puedo usar el correo del papá o la mamá?", "Sí, si es una cuenta que revisan seguido y que no usan para el registro de otro hijo."],
    ],
  },
  {
    slug: "examen", miga: "El día del examen", nombreCorto: "Examen ECOEMS en línea",
    titulo: "Examen ECOEMS en línea: navegador seguro, cámara y foto | ecoems.net",
    descripcion: "Cómo es el examen ECOEMS en línea: 128 preguntas, navegador seguro, cámara y micrófono, toma de fotografía, simulador oficial y recomendaciones para el día del examen.",
    h1: "El examen ECOEMS en línea: cómo prepararse para el día",
    lead: `${PREGUNTAS_EXAMEN} preguntas desde casa, con cámara encendida y navegador seguro. Lo que hay que preparar antes para que nada falle.`,
    img: { id: "examen-en-linea-casa", alt: "Aspirante presenta el examen ECOEMS en línea desde su casa con cámara encendida", title: "Examen ECOEMS en línea", desc: "Adolescente en un escritorio ordenado frente a una laptop con cámara, cuarto bien iluminado y sin otras personas." },
    secciones: [
      ["Cómo es el examen", `<p>El examen ECOEMS tiene <b>${PREGUNTAS_EXAMEN} preguntas</b> de opción múltiple y se presenta <b>en línea</b>, desde una computadora de escritorio o laptop. En 2026 se aplicó del <b>20 al 28 de junio</b>, con un día y horario asignado a cada aspirante.</p>
        <p>Durante el examen la <b>cámara y el micrófono</b> deben estar encendidos. La plataforma combina inteligencia artificial con supervisores que revisan en tiempo real: detecta si el aspirante se levanta, si aparece otra persona o si intenta abrir otras ventanas o programas.</p>`],
      ["Antes del examen", `<ol class="pasos-lista">
        <li><b>Toma de fotografía.</b> Se hace en persona, en la fecha que indica el Documento A del registro. Sin esa foto validada no se puede entrar a la plataforma.</li>
        <li><b>Instalar el navegador seguro</b> en la computadora donde presentará, y hacer las pruebas técnicas.</li>
        <li><b>Hacer el simulador oficial.</b> En 2026 estuvo abierto del 16 al 19 de junio. Sirve para probar cámara, micrófono e internet.</li>
        <li><b>Usar la misma computadora</b> el día del examen en la que instaló el navegador y hizo las pruebas.</li></ol>
        ${aviso2027}`],
      ["El día del examen", `<ul class="modalidades">
        <li><b>Cuarto solo, iluminado y en silencio.</b> Nadie más debe aparecer en la cámara.</li>
        <li><b>Computadora conectada a la corriente</b> e internet estable; si se puede, cable en lugar de wifi.</li>
        <li><b>Celular fuera de alcance</b> y otras ventanas cerradas antes de empezar.</li>
        <li><b>Conectarse con tiempo</b>, antes de su horario.</li></ul>`],
      ["¿Cómo practicar el examen?", `<p>Lo que más ayuda es practicar con exámenes del mismo tamaño y tipo. En examenes.lat hay un <a href="${utm(`${SITIO.lat}/mx/comipems/`, "examen")}">examen simulacro ECOEMS gratis</a> por materia, y en ecoems.app el <a href="${utm(SITIO.app, "examen")}">diagnóstico ECOEMS gratis</a>: 64 preguntas, la mitad exacta del examen, que estima sus aciertos.</p>`],
    ],
    faq: [
      ["¿El examen ECOEMS es en línea?", "Sí. En 2026 se presentó en línea desde casa, en computadora de escritorio o laptop, con cámara y micrófono encendidos."],
      ["¿Qué es el navegador seguro del ECOEMS?", "Un programa que se instala en la computadora para presentar el examen y que impide abrir otras ventanas o programas mientras dura la prueba."],
      ["¿Se puede presentar el examen en celular o tableta?", "No. Se pide una computadora de escritorio o laptop con cámara y micrófono."],
      ["¿Para qué es la toma de fotografía?", "Para verificar la identidad del aspirante el día del examen. Sin la foto tomada y validada no se puede entrar a la plataforma."],
    ],
  },
  {
    slug: "resultados", miga: "Resultados", nombreCorto: "Resultados ECOEMS",
    titulo: "Resultados ECOEMS 2027: cuándo salen y cómo consultarlos | ecoems.net",
    descripcion: "Cuándo salen los resultados del ECOEMS y Mi Derecho, Mi Lugar, cómo consultar la Gaceta Electrónica de Resultados, cómo leer los aciertos y qué hacer después.",
    h1: "Resultados del ECOEMS: cuándo salen y cómo leerlos",
    lead: "Dónde se publican, qué dice el resultado individual y qué hacer en los días siguientes.",
    img: { id: "resultados-familia-celebra", alt: "Familia revisa en la computadora los resultados del ECOEMS y celebra", title: "Resultados del ECOEMS", desc: "Una familia frente a la computadora de casa; la hija sonríe y el papá le pone la mano en el hombro." },
    secciones: [
      ["Cuándo salen los resultados", `<p>En 2026 los resultados se publicaron el <b>martes 18 de agosto</b> en la <b>Gaceta Electrónica de Resultados</b>, en ${of()}. Es el único documento oficial de resultados; desconfía de listas en redes sociales.</p>${aviso2027}`],
      ["Qué dice el resultado", `<p>En el resultado individual aparece la <b>escuela asignada</b>, y para quien presentó examen, sus <b>aciertos</b>. También indica las fechas, el lugar y los requisitos para inscribirse.</p>
        <p>Con los resultados de todo el proceso se conocen los <b>aciertos mínimos</b> de cada escuela: los del último alumno que alcanzó lugar. Son los que publicamos en la <a href="/aciertos/">tabla de aciertos</a>.</p>`],
      ["Qué hacer después", `<ul class="modalidades">
        <li><b>Si quedó asignado:</b> inscríbete en las fechas que marca la Gaceta, con el certificado de secundaria original. Si no se inscribe a tiempo, pierde el lugar.</li>
        <li><b>Si no quedó:</b> hay opciones. En 2026 hubo registro extemporáneo del 19 al 26 de agosto y, desde el 26 de agosto, lugares disponibles en algunas instituciones. <a href="/no-quede/">Ver qué hacer</a>.</li></ul>`],
    ],
    faq: [
      ["¿Cuándo salen los resultados del ECOEMS 2027?", "Aún no hay fecha. En 2026 salieron el martes 18 de agosto."],
      ["¿Dónde veo los resultados del ECOEMS?", "En la Gaceta Electrónica de Resultados, en miderechomilugar.gob.mx."],
      ["¿Qué significa 'sin examen' en los resultados?", "Que el aspirante fue asignado a una escuela que no pide examen (modalidad 1, o modalidad 3 cuando no alcanzó lugar en la UNAM o el IPN)."],
    ],
  },
  {
    slug: "no-quede", miga: "Si no quedó", nombreCorto: "No quedé en el ECOEMS",
    titulo: "No quedé en el ECOEMS: extemporáneos y lugares libres | ecoems.net",
    descripcion: "Qué hacer si tu hijo o hija no quedó en el ECOEMS o Mi Derecho, Mi Lugar: registro extemporáneo, lugares disponibles y opciones para no perder el año.",
    h1: "No quedó en el ECOEMS: qué hacer ahora",
    lead: "Respira: hay opciones para no perder el año. Qué dice la convocatoria y en qué orden moverse.",
    img: { id: "no-quede-apoyo", alt: "Papá platica con su hijo después de revisar los resultados del ECOEMS", title: "Qué hacer si no quedó", desc: "Un papá y su hijo adolescente sentados en una banca de un parque conversando con calma." },
    secciones: [
      ["Primero: revisa en qué modalidad se registró", `<p><b>Modalidad 3:</b> si no alcanzó lugar en la UNAM o el IPN, se le asigna una de sus opciones sin examen. Revisa su resultado individual: probablemente sí tiene escuela.</p>
        <p><b>Modalidad 2:</b> si no alcanzó lugar, puede registrarse en el <b>periodo extemporáneo</b> y elegir una escuela sin examen con lugares disponibles. En 2026 fue del <b>19 al 26 de agosto</b>.</p>`],
      ["Lugares disponibles después del proceso", `<p>Según la convocatoria 2026, las instituciones que todavía tengan lugares después del <b>26 de agosto</b> los ofrecen por sus propios procedimientos. Vale la pena revisar los sitios de COLBACH, CONALEP, DGETI, IEMS y las demás opciones sin examen cerca de casa.</p>
        <p>Si no fue asignado por una causa administrativa ajena a él, la Gaceta indica las fechas para resolverlo. El proceso cerró el 28 de agosto de 2026.</p>`],
      ["Para intentarlo de nuevo", `<p>Un egresado puede volver a registrarse al año siguiente. Si esa es la decisión, el año sirve para estudiar con calma: el <a href="${utm(SITIO.app, "no-quede")}">diagnóstico ECOEMS gratis</a> de ecoems.app le dice qué materias reforzar y en <a href="${utm(`${SITIO.lat}/mx/comipems/`, "no-quede")}">examenes.lat</a> hay simuladores gratis.</p>`],
    ],
    faq: [
      ["¿Qué pasa si no quedé en la UNAM ni en el IPN?", "En modalidad 3 se asigna una opción sin examen de tu lista. En modalidad 2 puedes registrarte en el periodo extemporáneo y elegir una escuela sin examen con lugares."],
      ["¿Hay segunda vuelta en el ECOEMS?", "No hay una segunda vuelta de examen. Después de resultados hay registro extemporáneo para escuelas sin examen y lugares disponibles que cada institución ofrece por su cuenta."],
      ["¿Cuándo es el registro extemporáneo?", "En 2026 fue del 19 al 26 de agosto. Consulta las fechas 2027 cuando salga la convocatoria."],
    ],
  },
];

// ---------- Preguntas frecuentes (todas juntas) ----------
function paginaFaq(paginas) {
  const ruta = "/preguntas-frecuentes/";
  const titulo = "Preguntas frecuentes del ECOEMS y Mi Derecho, Mi Lugar | ecoems.net";
  const descripcion = "Respuestas claras a las dudas más comunes del ECOEMS y Mi Derecho, Mi Lugar: registro, Llave MX, modalidades, examen en línea, aciertos y resultados.";
  const m = migas([["Inicio", "/"], ["Preguntas frecuentes", ruta]]);
  const grupos = paginas.map((d) => [d.miga, d.slug, d.faq]);
  const todas = grupos.flatMap(([, , f]) => f);
  const cuerpo = `
${cabeceraPagina({ img: "preguntas-frecuentes-ecoems", migasHtml: m.html, h1: "Preguntas frecuentes del ECOEMS", lead: "Todas las dudas del proceso en un solo lugar, ordenadas por parada. Cada tema tiene su página con más detalle." })}
<section class="seccion"><div class="contenedor contenedor-angosto">
  ${grupos.map(([t, s, f]) => `
  <div class="faq-grupo">
    <h2>${t}</h2>
    <div class="faq">${f.map(([p, r]) => `<details class="faq-item"><summary>${p}${icono("abajo", "ico")}</summary><p>${r}</p></details>`).join("")}</div>
    <p><a class="enlace-fuerte" href="/${s}/">Leer la guía de ${t.toLowerCase()} ${icono("flecha", "ico")}</a></p>
  </div>`).join("")}
  <p class="actualizado">Actualizado el <time datetime="${ACTUALIZADO.iso}">${ACTUALIZADO.texto}</time>. ecoems.net no es un sitio oficial; el registro y los resultados se hacen solo en ${of()}.</p>
</div></section>
${caminos("preguntas-frecuentes")}`;
  return {
    META: { ruta, titulo, descripcion }, ACTUALIZADO, nombreCorto: "Preguntas ECOEMS", seccion: "",
    cuerpo: () => cuerpo,
    jsonld: () => [paginaLd({ titulo, ruta, descripcion }), m.ld, faqLd(todas)],
  };
}

export function paginas() {
  return [...PAGINAS.map(pagina), paginaFaq(PAGINAS)];
}

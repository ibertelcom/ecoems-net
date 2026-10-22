// Escuelas sin examen de Mi Derecho, Mi Lugar (modalidad 1 y 3).
// Fuente: buscador oficial de opciones educativas de miderechomilugar.gob.mx (proceso 2026), consultado el
// 21-oct-2026: nombre, dirección, coordenadas, claves de opción y especialidades. 521 planteles.
import { readFileSync } from "node:fs";
import { ESCUELAS } from "./datos.mjs";

export const FUENTE_SIN = "buscador oficial de opciones educativas de Mi Derecho, Mi Lugar (proceso 2026)";

const ALCALDIAS = new Set(["VENUSTIANO CARRANZA", "IZTAPALAPA", "GUSTAVO A. MADERO", "MIGUEL HIDALGO", "LA MAGDALENA CONTRERAS", "ÁLVARO OBREGÓN", "AZCAPOTZALCO", "IZTACALCO", "CUAUHTÉMOC", "XOCHIMILCO", "TLÁHUAC", "MILPA ALTA", "TLALPAN", "BENITO JUÁREZ", "CUAJIMALPA DE MORELOS", "COYOACÁN"]);

// Cada sistema (institución) con su página. ficha = tiene página por plantel (hay búsquedas por plantel).
export const SISTEMAS = {
  bachilleres: {
    ruta: "/escuelas/colegio-de-bachilleres/", nombre: "Colegio de Bachilleres", corto: "Bachilleres", siglas: "COLBACH", ficha: true, tipo: "general",
    desc: "El Colegio de Bachilleres es un organismo de la SEP que ofrece bachillerato general en tres años (seis semestres). Además de las materias del bachillerato, el alumno cursa una capacitación para el trabajo.",
    kw: "colegio de bachilleres", vol: "40.5K",
  },
  conalep: {
    ruta: "/escuelas/conalep/", nombre: "CONALEP", corto: "CONALEP", siglas: "CONALEP", ficha: true, tipo: "tecnico",
    largo: "Colegio Nacional de Educación Profesional Técnica",
    desc: "El CONALEP (Colegio Nacional de Educación Profesional Técnica) ofrece bachillerato con una carrera de profesional técnico: al terminar, el alumno recibe el certificado de bachillerato y el título de profesional técnico bachiller en su carrera. En la Ciudad de México los planteles son federales; en el Estado de México dependen del CONALEP estatal.",
    kw: "conalep", vol: "246K",
  },
  dgeti: {
    ruta: "/escuelas/cetis-cbtis/", nombre: "CETIS y CBTIS (DGETI)", corto: "CETIS y CBTIS", siglas: "DGETI", ficha: true, tipo: "tecnologico",
    desc: "Los CETIS (Centros de Estudios Tecnológicos Industrial y de Servicios) y los CBTIS (Centros de Bachillerato Tecnológico Industrial y de Servicios) son de la SEP. Ofrecen bachillerato tecnológico: el alumno estudia el bachillerato y una carrera técnica al mismo tiempo, y al terminar puede seguir a la universidad o trabajar como técnico.",
    kw: "cetis y cbtis", vol: "76K",
  },
  iems: {
    ruta: "/escuelas/iems/", nombre: "IEMS", corto: "IEMS", siglas: "IEMS", ficha: true, tipo: "general",
    largo: "Instituto de Educación Media Superior de la Ciudad de México",
    desc: "El IEMS (Instituto de Educación Media Superior) es el sistema de preparatorias del Gobierno de la Ciudad de México. Ofrece bachillerato general gratuito en modalidad escolarizada y, en varios planteles, semiescolarizada y con tutorías.",
    kw: "iems", vol: "40.5K",
  },
  cecytem: {
    ruta: "/escuelas/cecytem/", nombre: "CECyTEM", corto: "CECyTEM", siglas: "CECyTEM", ficha: true, tipo: "tecnologico",
    largo: "Colegio de Estudios Científicos y Tecnológicos del Estado de México",
    desc: "El CECyTEM (Colegio de Estudios Científicos y Tecnológicos del Estado de México) ofrece bachillerato tecnológico del Gobierno del Estado de México: bachillerato más una carrera técnica.",
    kw: "cecytem", vol: "6.6K",
  },
  cobaem: {
    ruta: "/escuelas/cobaem/", nombre: "COBAEM", corto: "COBAEM", siglas: "COBAEM", ficha: true, tipo: "general",
    largo: "Colegio de Bachilleres del Estado de México",
    desc: "El COBAEM (Colegio de Bachilleres del Estado de México) ofrece bachillerato general del Gobierno del Estado de México en tres años.",
    kw: "cobaem", vol: "18.1K",
  },
  epo: {
    ruta: "/escuelas/preparatorias-oficiales-edomex/", nombre: "Preparatorias Oficiales del Estado de México", corto: "Preparatorias Oficiales", siglas: "EPO", ficha: false, tipo: "general",
    desc: "Las Escuelas Preparatorias Oficiales (EPO) son el bachillerato general del Gobierno del Estado de México. Incluyen las preparatorias anexas a escuelas normales y los módulos adscritos a una preparatoria.",
    kw: "preparatoria oficial", vol: "4.4K",
  },
  cbt: {
    ruta: "/escuelas/cbt-edomex/", nombre: "CBT del Estado de México", corto: "CBT Edomex", siglas: "CBT", ficha: false, tipo: "tecnologico",
    largo: "Centros de Bachillerato Tecnológico del Estado de México",
    desc: "Los Centros de Bachillerato Tecnológico (CBT) son del Gobierno del Estado de México. Ofrecen bachillerato tecnológico: el alumno sale con su certificado de bachillerato y una carrera de técnico.",
    kw: "cbt", vol: "",
  },
  tbc: {
    ruta: "/escuelas/telebachillerato-comunitario/", nombre: "Telebachillerato Comunitario", corto: "Telebachillerato", siglas: "TBC", ficha: false, tipo: "general",
    desc: "El Telebachillerato Comunitario (TBC) lleva el bachillerato general a colonias y pueblos donde no hay otra preparatoria cerca. Son escuelas pequeñas, con pocos maestros que se apoyan en materiales impresos y audiovisuales.",
    kw: "telebachillerato comunitario", vol: "",
  },
  ceb: {
    ruta: "/escuelas/ceb-dgb/", nombre: "Centros de Estudios de Bachillerato (DGB)", corto: "CEB", siglas: "DGB", ficha: false, tipo: "general",
    desc: "Los Centros de Estudios de Bachillerato (CEB) dependen de la Dirección General del Bachillerato de la SEP y ofrecen bachillerato general.",
    kw: "centro de estudios de bachillerato", vol: "",
  },
  cbta: {
    ruta: "/escuelas/cbta/", nombre: "CBTA y Centro del Mar (DGETAyCM)", corto: "CBTA", siglas: "DGETAyCM", ficha: false, tipo: "tecnologico",
    desc: "Los Centros de Bachillerato Tecnológico Agropecuario (CBTA) y el Centro Multimodal de Estudios Científicos y Tecnológicos del Mar y Aguas Continentales son de la SEP. Ofrecen bachillerato tecnológico con carreras agropecuarias, de alimentos, de tecnología y del mar.",
    kw: "cbta", vol: "",
  },
  uaemex: {
    ruta: "/escuelas/sin-examen/", nombre: "UAEMéx Plantel Texcoco", corto: "UAEMéx Texcoco", siglas: "UAEMéx", ficha: false, tipo: "general",
    desc: "El Plantel Texcoco de la Escuela Preparatoria de la Universidad Autónoma del Estado de México ofrece lugares dentro de Mi Derecho, Mi Lugar.",
    kw: "", vol: "",
  },
};

const INST = { "COLEGIO DE BACHILLERES": "bachilleres", CONALEP: "conalep", "SECTI CONALEP": "conalep", DGETI: "dgeti", IEMS: "iems", "SECTI CECYTEM": "cecytem", "SECTI COBAEM": "cobaem", "SECTI PO": "epo", "SECTI CBT": "cbt", "SECTI TELEBACHILLERATO": "tbc", DGB: "ceb", DGETAyCM: "cbta", "UAEMéx": "uaemex" };

const SIGLAS = new Set(["CONALEP", "CETIS", "CBTIS", "CBTA", "CBT", "TBC", "CEB", "EPO", "COBAEM", "IEMS", "SECOFI", "CTM", "UAEMÉX", "CECYTEM", "II", "III", "IV", "V", "VI", "VII", "I"]);
const MENORES = new Set(["de", "del", "la", "las", "los", "y", "a", "al", "e", "en"]);
export function bonito(t) {
  return t
    .split(/(\s+|-|\/|\(|\)|")/)
    .map((w, i) => {
      if (!/[A-Za-zÁÉÍÓÚÑÜáéíóúñü]/.test(w)) return w;
      const U = w.toUpperCase();
      if (U === "CECYTEM") return "CECyTEM";
      if (U === "UAEMÉX") return "UAEMéx";
      if (SIGLAS.has(U.replace(/[.,]/g, ""))) return w.toUpperCase();
      if (U === "NÚM." || U === "NO.") return "núm.";
      const l = w.toLowerCase();
      if (i > 0 && MENORES.has(l)) return l;
      return l.charAt(0).toUpperCase() + l.slice(1);
    })
    .join("")
    .replace(/\s+/g, " ")
    .replace(/(, |" )(la|el|los|las) /g, (m, a, b) => `${a}${b.charAt(0).toUpperCase()}${b.slice(1)} `)
    .replace(/\b(la|los) (Paz|Reyes)\b/g, (m, a, b) => `${a.charAt(0).toUpperCase()}${a.slice(1)} ${b}`)
    .trim();
}
export function slug(t) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Nombre para mostrar, nombre corto y slug de cada plantel.
function nombres(sis, n) {
  if (sis === "bachilleres") {
    const num = /PLANTEL (\d+)/.exec(n)[1];
    const resto = n.replace(/^PLANTEL \d+,\s*/, "");
    const comillas = /"([^"]+)"/.exec(resto)?.[1];
    const lugar = resto.replace(/"[^"]*"/, "").trim();
    const zona = bonito(lugar || comillas || "");
    const hon = lugar && comillas ? bonito(comillas) : null;
    return { nombre: `Colegio de Bachilleres Plantel ${num} ${zona}`.trim(), comun: `Bachilleres ${num}`, slug: `colegio-de-bachilleres-plantel-${num}`, hon, num: +num };
  }
  if (sis === "iems") {
    const [base, hon] = n.split(" - ");
    const nombre = `IEMS ${bonito(base)}`;
    return { nombre, comun: nombre, slug: slug(nombre), hon: hon ? bonito(hon) : null };
  }
  if (sis === "cecytem") {
    const nombre = bonito(n);
    return { nombre, comun: nombre.replace(" Plantel ", " "), slug: slug(nombre.replace(" Plantel ", " ")) };
  }
  if (sis === "cobaem") {
    const nombre = bonito(n);
    const num = /PLANTEL (\d+)/.exec(n)[1];
    return { nombre, comun: `COBAEM ${num}`, slug: `cobaem-plantel-${num}`, num: +num };
  }
  if (sis === "conalep") {
    let nombre = bonito(n);
    if (/SECOFI/.test(n)) return { nombre, comun: "CONALEP SECOFI", slug: "conalep-secofi" };
    if (/PADILLA SEGURA III/.test(n)) return { nombre, comun: "CONALEP Ticomán", slug: "conalep-ticoman", hon: "Ing. José Antonio Padilla Segura III" };
    if (/BERNARDO QUINTANA/.test(n)) return { nombre: 'CONALEP "Ing. Bernardo Quintana Arrioja"', comun: "CONALEP Bernardo Quintana Arrioja", slug: "conalep-bernardo-quintana-arrioja" };
    return { nombre, comun: nombre, slug: slug(nombre) };
  }
  if (sis === "dgeti") {
    const nombre = bonito(n);
    return { nombre, comun: nombre, slug: slug(nombre) };
  }
  if (sis === "uaemex") return { nombre: "UAEMéx Plantel Texcoco", comun: "UAEMéx Plantel Texcoco", slug: "uaemex-plantel-texcoco", hon: "Escuela Preparatoria de la UAEMéx" };
  const nombre = bonito(n);
  return { nombre, comun: nombre, slug: slug(nombre) };
}

function leer() {
  const txt = ["parte1", "parte2"].map((p) => readFileSync(new URL(`./datos/sin-examen/${p}.txt`, import.meta.url), "utf8")).join("\n");
  let I = [], M = [];
  const E = {};
  const out = [];
  for (const l of txt.split("\n")) {
    if (!l.trim()) continue;
    if (l.startsWith("#I ")) { I = l.slice(3).split("|"); continue; }
    if (l.startsWith("#M ")) { M = l.slice(3).split("|"); continue; }
    if (l.startsWith("#E ")) { const [, k, ...v] = l.split(" "); E[k] = v.join(" "); continue; }
    const m = l.match(/^(\d+) (.+?) (\d+) (19\.\d+) (-9\d\.\d+) ([01]) ([01]) ([A-Z]\d+)(?: (\d{3}(?:,\d{3})*))? (.*)$/);
    if (!m) throw new Error(`Línea sin formato: ${l}`);
    const [, i, n, mu, la, lo, acc, , base, cod, dir] = m;
    const pre = base.slice(0, 2);
    const sis = INST[I[+i]];
    const mun = M[+mu];
    const esp = (cod ? cod.split(",") : []).map((c) => ({ clave: base + c, nombre: (E[pre + c] || "").replace(/^Técnico (en )?/i, "").replace(/\s*\((s|S)ólo se oferta[^)]*\)/, "") , nota: /turno (matutino|vespertino)/i.exec(E[pre + c] || "")?.[0] ?? null })).filter((x) => x.nombre);
    out.push({
      sis, inst: I[+i], crudo: n, ...nombres(sis, n),
      municipio: bonito(mun), entidad: ALCALDIAS.has(mun) ? "CDMX" : "Estado de México",
      coord: [+la, +lo], acc: acc === "1",
      // Clave de opción cuando el plantel tiene una sola opción (sin especialidades); IEMS tiene una por modalidad.
      clave: !esp.length && sis !== "iems" ? `${base}000` : null,
      esp,
      dir: dir.trim().replace(/\s+,/g, ",").replace(/C\.P\.\s*/g, "C.P. "),
      turno: /\(S[óo]lo opera (en )?el turno (\w+)\)/i.exec(dir)?.[2] ?? null,
    });
  }
  return out;
}

const numDe = (t) => parseInt((/\d+/.exec(t) ?? ["0"])[0]);
export const PLANTELES = leer().sort((a, b) => a.sis.localeCompare(b.sis) || numDe(a.comun) - numDe(b.comun) || a.comun.localeCompare(b.comun, "es"));

// Slugs únicos; URL de cada plantel (ficha propia o ancla en la página de su sistema).
{
  const vistos = new Set(ESCUELAS.map((e) => e.slug));
  for (const p of PLANTELES) {
    let s = p.slug, k = 2;
    while (vistos.has(s)) s = `${p.slug}-${k++}`;
    p.slug = s;
    vistos.add(s);
    p.ficha = SISTEMAS[p.sis].ficha;
    p.url = p.ficha ? `/escuelas/${p.slug}/` : `${SISTEMAS[p.sis].ruta}#${p.slug}`;
    p.dirLimpia = p.dir.replace(/,?\s*\(S[óo]lo opera[^)]*\)/i, "");
  }
}

export const POR_SISTEMA = Object.fromEntries(Object.keys(SISTEMAS).map((k) => [k, PLANTELES.filter((p) => p.sis === k)]));

// Todas las escuelas con coordenadas (UNAM, IPN y sin examen) para "cercanas".
const TODAS = [
  ...ESCUELAS.filter((e) => e.coord).map((e) => ({ nombre: e.doble, corto: e.comun, url: `/escuelas/${e.slug}/`, coord: e.coord, tipo: e.institucion === "UNAM" ? (e.linea === "enp" ? "Prepa UNAM" : "CCH UNAM") : "Vocacional IPN", examen: true, linea: e.linea })),
  ...PLANTELES.map((p) => ({ nombre: p.nombre, corto: p.comun, url: p.url, coord: p.coord, tipo: SISTEMAS[p.sis].corto, examen: false, linea: "sin" })),
];
export function km(a, b) {
  const r = Math.PI / 180, dla = (b[0] - a[0]) * r, dlo = (b[1] - a[1]) * r;
  const h = Math.sin(dla / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dlo / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
export function cercanas(coord, url, n = 6, filtro = () => true) {
  return TODAS.filter((x) => x.url !== url && filtro(x)).map((x) => ({ ...x, d: km(coord, x.coord) })).sort((a, b) => a.d - b.d).slice(0, n);
}

// Datos compactos para el mapa y "Prepas cerca de mí" (se descargan solo cuando se necesitan).
export function datosMapaSin() {
  return {
    fuente: FUENTE_SIN,
    s: Object.fromEntries(Object.entries(SISTEMAS).map(([k, s]) => [k, [s.corto, s.ruta]])),
    p: PLANTELES.map((p) => [p.sis, p.nombre, +p.coord[0].toFixed(5), +p.coord[1].toFixed(5), p.url, p.municipio, p.esp.slice(0, 3).map((e) => e.nombre).join(", ")]),
  };
}

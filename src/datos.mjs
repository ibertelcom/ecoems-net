// Datos de escuelas: misma fuente que ecoems.app (app/src/datos/escuelas-cortes.json).
// Aciertos mínimos con los que entró el último alumno asignado en 2024, 2025 y 2026.
import { readFileSync } from "node:fs";

const crudo = JSON.parse(readFileSync(new URL("./datos/escuelas-cortes.json", import.meta.url), "utf8"));
const COORD = JSON.parse(readFileSync(new URL("./datos/coordenadas.json", import.meta.url), "utf8"));
const info = Object.fromEntries(JSON.parse(readFileSync(new URL("./datos/escuelas-info.json", import.meta.url), "utf8")).map((i) => [i.oficial, i]));

// Dirección que se publica: completa solo si la fuente es oficial (confianza alta); si hay datos en conflicto,
// solo colonia y alcaldía, con la recomendación de confirmar en el sitio del plantel.
function direccionPublica(i) {
  if (!i?.direccion) return null;
  if (i.confianza === "alta") return i.direccion;
  const col = /Col\.[^,]+/.exec(i.direccion);
  return col ? col[0] : null;
}

export const MARGEN_TEPO = 3;
export const PREGUNTAS_EXAMEN = 128;

const LINEAS = {
  ENP: { clave: "enp", grupo: "Prepas UNAM (ENP)", corto: "Prepas", institucion: "UNAM" },
  CCH: { clave: "cch", grupo: "CCH UNAM", corto: "CCH", institucion: "UNAM" },
  CECyT: { clave: "voca", grupo: "Vocacionales IPN (CECyT)", corto: "Vocas", institucion: "IPN" },
  CET: { clave: "voca", grupo: "Vocacionales IPN (CECyT)", corto: "Vocas", institucion: "IPN" },
};

function nombreComun(oficial) {
  const enp = /^ENP\s+(\d+)$/i.exec(oficial);
  if (enp) return `Prepa ${enp[1]}`;
  const cecyt = /^CECyT\s+(\d+)$/i.exec(oficial);
  if (cecyt) return `Voca ${cecyt[1]}`;
  return oficial;
}

function slug(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const ESCUELAS = crudo
  .map((e) => {
    const comun = nombreComun(e.nombre);
    const linea = LINEAS[e.subsistema];
    return {
      id: e.id,
      oficial: e.nombre,
      comun,
      doble: comun !== e.nombre ? `${comun} (${e.nombre})` : e.nombre,
      slug: slug(comun),
      institucion: e.institucion,
      subsistema: e.subsistema,
      linea: linea.clave,
      grupo: linea.grupo,
      a2024: e.c2024,
      a2025: e.c2025,
      a2026: e.c2026,
      meta: e.c2026 + MARGEN_TEPO,
      honorifico: info[e.nombre]?.nombre_honorifico ?? null,
      direccion: direccionPublica(info[e.nombre]),
      direccionVerificada: info[e.nombre]?.confianza === "alta",
      alcaldia: info[e.nombre]?.alcaldia_o_municipio ?? null,
      entidad: info[e.nombre]?.entidad ?? null,
      area: info[e.nombre]?.area_conocimiento ?? null,
      carreras: info[e.nombre]?.carreras_tecnicas ?? [],
      sitio: info[e.nombre]?.sitio_oficial ?? null,
      fuente: info[e.nombre]?.fuente ?? null,
      coord: COORD[slug(comun)] ?? null,
    };
  })
  .sort((a, b) => {
    const orden = { enp: 0, cch: 1, voca: 2 };
    return orden[a.linea] - orden[b.linea] || (parseInt(a.oficial.replace(/\D/g, "")) || 0) - (parseInt(b.oficial.replace(/\D/g, "")) || 0) || a.oficial.localeCompare(b.oficial, "es");
  });

export const GRUPOS = [
  { clave: "enp", titulo: "Prepas UNAM", sub: "Escuela Nacional Preparatoria (ENP)", escuelas: ESCUELAS.filter((e) => e.linea === "enp") },
  { clave: "cch", titulo: "CCH UNAM", sub: "Colegio de Ciencias y Humanidades", escuelas: ESCUELAS.filter((e) => e.linea === "cch") },
  { clave: "voca", titulo: "Vocacionales IPN", sub: "CECyT y CET 1 del Politécnico", escuelas: ESCUELAS.filter((e) => e.linea === "voca") },
];

export const RESUMEN = (() => {
  const mayor = ESCUELAS.reduce((m, e) => (e.a2026 > m.a2026 ? e : m));
  const menor = ESCUELAS.reduce((m, e) => (e.a2026 < m.a2026 ? e : m));
  return { total: ESCUELAS.length, mayor, menor };
})();

// Lugar de cada escuela por aciertos 2026 (1 = la que más pidió), en total y dentro de su línea.
const porAciertos = [...ESCUELAS].sort((a, b) => b.a2026 - a.a2026);
for (const e of ESCUELAS) {
  e.lugar = porAciertos.findIndex((x) => x.a2026 === e.a2026) + 1;
  const linea = porAciertos.filter((x) => x.linea === e.linea);
  e.lugarLinea = linea.findIndex((x) => x.a2026 === e.a2026) + 1;
  e.totalLinea = linea.length;
}
export function grupoDe(e) { return GRUPOS.find((g) => g.clave === e.linea); }
export function parecidas(e, n = 3) {
  return ESCUELAS.filter((x) => x !== e).sort((a, b) => Math.abs(a.a2026 - e.a2026) - Math.abs(b.a2026 - e.a2026) || b.a2026 - a.a2026).slice(0, n);
}

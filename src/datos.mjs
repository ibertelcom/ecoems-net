// Datos de escuelas: misma fuente que ecoems.app (app/src/datos/escuelas-cortes.json).
// Aciertos mínimos con los que entró el último alumno asignado en 2024, 2025 y 2026.
import { readFileSync } from "node:fs";

const crudo = JSON.parse(readFileSync(new URL("./datos/escuelas-cortes.json", import.meta.url), "utf8"));

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

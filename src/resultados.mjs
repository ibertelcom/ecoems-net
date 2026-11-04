// Buscador de resultados por folio (Gaceta Electrónica de Resultados de ECOEMS).
// Los datos salen de scripts/gaceta-resultados.py: src/datos/resultados/<año>/f/*.json y crudo.json.
// La gaceta no trae nombres; aquí solo se traducen las claves a escuelas y se explican los resultados.
import { readFileSync, existsSync } from "node:fs";
import { ESCUELAS } from "./datos.mjs";
import { PLANTELES, bonito } from "./sinexamen.mjs";
import { icono } from "./iconos.mjs";

export const ANIOS_RESULTADOS = [{ anio: "2026", fecha: "martes 18 de agosto de 2026", fechaIso: "2026-08-18" }];

const INST = {
  U: "UNAM", I: "IPN", B: "Colegio de Bachilleres", C: "CONALEP", D: "DGETI (CETIS / CBTIS)", G: "DGB (Centros de Estudios de Bachillerato)",
  A: "DGETAyCM (CBTA)", E: "IEMS de la CDMX", S: "Gobierno del Estado de México (SECTI)", M: "UAEMéx",
};

// Nombre legible a partir del encabezado oficial de la gaceta.
const PREFIJO = { B: "Colegio de Bachilleres", C: "CONALEP", E: "IEMS", M: "UAEMéx" };
const POR_ID = new Map(ESCUELAS.map((e) => [e.id, e]));
function nombreLegible(clave, n) {
  const e = POR_ID.get(clave);
  if (e) return `${e.doble} ${e.institucion ?? (clave[0] === "U" ? "UNAM" : "IPN")}`.replace(/(UNAM|IPN) \1$/, "$1");
  const partes = n.replace(/\s+/g, " ").trim().split(" - ");
  const resto = partes.slice(1).map((x) => bonito(x)).join(" · ") || bonito(partes[0]);
  const pre = PREFIJO[clave[0]];
  return pre && !resto.startsWith(pre) ? `${pre} ${resto}` : resto;
}
const limpiaDir = (d) => d.replace(/\s+/g, " ").split(/,\s*/).filter((x) => !/@|^Tels?\.|^Fax|^\d{2}-\d{2}-\d{2}/i.test(x.trim())).join(", ").trim();

// Ficha de ecoems.net para cada clave (UNAM/IPN por id; sin examen por clave de opción o por plantel).
function urlsPorClave() {
  const m = new Map();
  for (const e of ESCUELAS) m.set(e.id, `/escuelas/${e.slug}/`);
  const porPrefijo = new Map();
  for (const p of PLANTELES) {
    const claves = [p.clave, ...p.esp.map((x) => x.clave)].filter(Boolean);
    for (const c of claves) { m.set(c, p.url); porPrefijo.set(c.slice(0, 4), p.url); }
    if (p.base) porPrefijo.set(p.base.slice(0, 4), p.url);
  }
  return (c) => m.get(c) ?? porPrefijo.get(c.slice(0, 4)) ?? "";
}

export function metaResultados(anio) {
  const ruta = new URL(`./datos/resultados/${anio}/crudo.json`, import.meta.url);
  if (!existsSync(ruta)) return null;
  const d = JSON.parse(readFileSync(ruta, "utf8"));
  const url = urlsPorClave();
  const cat = {};
  for (const [c, v] of Object.entries(d.cat)) {
    cat[c] = [nombreLegible(c, v.n), limpiaDir(v.d), v.e.filter((x) => !/^Inicio /i.test(x)).join(" · "), url(c)];
  }
  // Mismo plantel con otra clave (p. ej. IEMS escolarizada y semiescolarizada): hereda la ficha.
  const porNombre = new Map();
  for (const [c, v] of Object.entries(d.cat)) if (cat[c][3]) porNombre.set(v.n, cat[c][3]);
  for (const [c, v] of Object.entries(d.cat)) if (!cat[c][3]) cat[c][3] = porNombre.get(v.n) ?? "";
  return {
    anio: d.anio, total: d.total, modalidades: d.modalidades, sustentantes: d.sustentantes, mediana: d.mediana,
    p: d.percentil_menor, cat, disp: d.disp, cortes: d.cortes, inst: INST,
  };
}

export function herramientaResultados() {
  const a = ANIOS_RESULTADOS[0];
  const meta = metaResultados(a.anio);
  if (!meta) return "";
  const n = new Intl.NumberFormat("es-MX").format(meta.total);
  return `
<section class="seccion seccion-folio" id="buscar-folio" aria-labelledby="t-folio">
  <div class="contenedor contenedor-angosto">
    <div class="folio-caja">
      <h2 id="t-folio">Busca tu resultado por folio</h2>
      <p class="folio-intro">Escribe el folio de 9 dígitos de tu comprobante de registro y te decimos, en palabras claras, qué dice la Gaceta ${a.anio}: la escuela asignada, tus aciertos y qué sigue. Incluye los ${n} folios publicados el ${a.fecha}.</p>
      <form class="folio-form" id="folio-form" data-anio="${a.anio}" autocomplete="off" novalidate>
        <label for="folio-num" class="visualmente-oculto">Folio de 9 dígitos</label>
        <span class="consulta-campo">${icono("buscar", "ico consulta-ico")}<input id="folio-num" name="folio" inputmode="numeric" pattern="[0-9]{9}" maxlength="9" placeholder="Ejemplo: 261000009" aria-describedby="folio-ayuda"></span>
        <button class="boton" type="submit">Ver mi resultado</button>
      </form>
      <p class="folio-ayuda" id="folio-ayuda">El folio viene en el comprobante de registro de Mi Derecho, Mi Lugar. Solo buscamos el folio exacto que escribes; no guardamos ni enviamos tu folio a ningún lado.</p>
      <div class="folio-resultado" id="folio-resultado" aria-live="polite"></div>
      <p class="folio-fuente">Fuente: Gaceta Electrónica de Resultados ${a.anio} de ECOEMS, publicada el ${a.fecha} en <a href="https://www.miderechomilugar.gob.mx/" target="_blank" rel="noopener">miderechomilugar.gob.mx</a>. ecoems.net no es un sitio oficial: el resultado válido es el de la gaceta y el portal oficial.</p>
    </div>
  </div>
</section>`;
}

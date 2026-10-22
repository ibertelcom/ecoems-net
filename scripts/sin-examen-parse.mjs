// Lee src/datos/sin-examen/parte*.txt (catálogo oficial del buscador de Mi Derecho, Mi Lugar, 21-oct-2026)
import { readFileSync } from "node:fs";
export function leerSinExamen() {
  const txt = ["parte1", "parte2"].map((p) => readFileSync(`src/datos/sin-examen/${p}.txt`, "utf8")).join("\n");
  let I = [], M = []; const E = {}; const out = []; const malas = [];
  for (const l of txt.split("\n")) {
    if (!l.trim()) continue;
    if (l.startsWith("#I ")) { I = l.slice(3).split("|"); continue; }
    if (l.startsWith("#M ")) { M = l.slice(3).split("|"); continue; }
    if (l.startsWith("#E ")) { const [, k, ...v] = l.split(" "); E[k] = v.join(" "); continue; }
    const m = l.match(/^(\d+) (.+?) (\d+) (19\.\d+) (-9\d\.\d+) ([01]) ([01]) ([A-Z]\d+)(?: (\d{3}(?:,\d{3})*))? (.*)$/);
    if (!m) { malas.push(l); continue; }
    const [, i, n, mu, la, lo, acc, , base, cod, dir] = m;
    const pre = base.slice(0, 2);
    out.push({ inst: I[+i], nombre: n, mun: M[+mu], lat: +la, lng: +lo, acc: acc === "1", clave: base, esp: (cod ? cod.split(",") : []).map((c) => E[pre + c] || null).filter(Boolean), dir: dir.trim() });
  }
  return { planteles: out, malas };
}
if (process.argv[1].endsWith("sin-examen-parse.mjs")) {
  const { planteles, malas } = leerSinExamen();
  const c = {}; planteles.forEach((p) => (c[p.inst] = (c[p.inst] || 0) + 1));
  console.log(planteles.length, c, "malas", malas.length, malas.slice(0, 3));
  console.log("sin esp con códigos:", planteles.filter((p) => p.esp.length === 0 && !/^(S[0-9]|E|B|G|M)/.test(p.clave)).map((p) => p.nombre).slice(0, 10));
  console.log("claves dup:", Object.entries(planteles.reduce((a, p) => ((a[p.clave] = (a[p.clave] || 0) + 1), a), {})).filter(([, v]) => v > 1));
}

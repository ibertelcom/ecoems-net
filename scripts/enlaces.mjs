// Auditoría de enlaces internos: solo el contenido (<main>), sin menú ni pie.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const paginas = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f === "index.html") paginas.push(p); } })("dist");
const ruta = (p) => p.replace(/^dist/, "").replace(/index\.html$/, "") || "/";
const limpiar = (t) => t.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const entr = {}, sal = {};
for (const p of paginas) {
  const r = ruta(p);
  const html = readFileSync(p, "utf8");
  const main = (/<main[^>]*>([\s\S]*)<\/main>/.exec(html) || [, ""])[1];
  sal[r] = [];
  for (const m of main.matchAll(/<a\s[^>]*href="(?:https:\/\/ecoems\.net)?(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    let dest = m[1]; if (!dest.endsWith("/") && !/\.[a-z]+$/.test(dest)) dest += "/";
    if (/\.[a-z]+$/.test(dest) || dest === r) continue;
    const a = limpiar(m[2]);
    sal[r].push([dest, a]);
    (entr[dest] ??= []).push([r, a]);
  }
}
const filas = Object.keys(sal).sort().map((r) => {
  const e = entr[r] ?? [];
  const fuentes = new Set(e.map((x) => x[0]));
  const anchors = {}; e.forEach(([, a]) => (anchors[a] = (anchors[a] ?? 0) + 1));
  return { r, entrantes: fuentes.size, salientes: new Set(sal[r].map((x) => x[0])).size, anchors: Object.entries(anchors).sort((x, y) => y[1] - x[1]) };
});
writeFileSync(process.argv[2] ?? "enlaces.json", JSON.stringify({ filas, sal }, null, 1));
for (const f of filas.sort((a, b) => a.entrantes - b.entrantes)) console.log(String(f.entrantes).padStart(3), String(f.salientes).padStart(3), f.r, "|", f.anchors.slice(0, 5).map(([a, n]) => `${a.slice(0, 40)}×${n}`).join(" · "));

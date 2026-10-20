// Genera la página de prompts (artifact) a partir de prompts-imagenes.json.
import { readFileSync, writeFileSync } from "node:fs";
const L = JSON.parse(readFileSync("prompts-imagenes.json", "utf8"));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const grupos = [
  ["Portada", (x) => x.uso.startsWith("Portada")],
  ["Pasos del proceso", (x) => x.uso.startsWith("Proceso")],
  ["Hubs de escuelas", (x) => x.uso.startsWith("Hub")],
  ["Prepas UNAM", (x) => /Escuela · Prepa/.test(x.uso)],
  ["CCH UNAM", (x) => /Escuela · CCH/.test(x.uso)],
  ["Vocacionales IPN", (x) => /Escuela · (Voca|CET)/.test(x.uso)],
];
const logo = (p) => /escudo oficial/.test(p) ? (p.match(/escudo oficial (de la UNAM|del Colegio de Ciencias y Humanidades de la UNAM|del Instituto Politécnico Nacional)/)?.[1] ?? "") : "";
let n = 0;
const secciones = grupos.map(([t, f]) => {
  const items = L.filter(f);
  return `<section class="grupo" aria-labelledby="g-${t.replace(/\W+/g, "")}"><h2 id="g-${t.replace(/\W+/g, "")}">${t} <span>${items.length}</span></h2><ol class="lista">${items.map((x) => {
    n++;
    const l = logo(x.prompt);
    const extra = /Escuela Nacional Preparatoria\./.test(x.prompt) || /escudo de la Escuela Nacional Preparatoria/.test(x.prompt) ? "UNAM + ENP" : /escudo del Colegio/.test(x.prompt) ? "UNAM + CCH" : l ? (l.includes("Politécnico") ? "IPN" : l.includes("Colegio") ? "CCH" : "UNAM") : "";
    return `<li class="item" data-id="${x.id}">
<div class="cab"><span class="num">${String(n).padStart(2, "0")}</span><div class="meta"><button class="archivo" type="button" data-copiar="${esc(x.archivo)}" title="Copiar nombre de archivo">${esc(x.archivo)}</button><small>${x.ancho} × ${x.alto} px · ${esc(x.uso.split(" · ")[1] ?? x.uso)}${extra ? ` · <b class="chip">Adjunta escudo ${extra}</b>` : ""}</small></div><label class="hecha"><input type="checkbox" id="h-${x.id}"> Hecha</label></div>
<p class="prompt" id="p-${x.id}">${esc(x.prompt)}</p>
<button class="copiar" type="button" data-objetivo="p-${x.id}">Copiar prompt</button>
</li>`;
  }).join("")}</ol></section>`;
}).join("");
const html = `<title>Prompts imágenes ecoems.net</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..800&family=Atkinson+Hyperlegible:wght@400;700&display=swap">
<style>
/* Lista de trabajo: columna única, cada imagen una tarjeta con su prompt y botón de copiar. Identidad de ecoems.net. */
:root{--bg:#F6F7F4;--sup:#FFFFFF;--tx:#16201C;--suave:#56635D;--linea:#DCE2DD;--verde:#0B7A60;--verde-tx:#FFFFFF;--sol:#F4B400;--chip:#FFF4D1;--chip-tx:#6B4E00;
--display:"Archivo",system-ui,sans-serif;--cuerpo:"Atkinson Hyperlegible",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0F1513;--sup:#18211E;--tx:#E8EEEA;--suave:#9AA8A1;--linea:#2B3632;--verde:#3DBB94;--verde-tx:#08120E;--chip:#3A2F0A;--chip-tx:#F8D774;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0F1513;--sup:#18211E;--tx:#E8EEEA;--suave:#9AA8A1;--linea:#2B3632;--verde:#3DBB94;--verde-tx:#08120E;--chip:#3A2F0A;--chip-tx:#F8D774;color-scheme:dark}
body{background:var(--bg);color:var(--tx);font:16px/1.55 var(--cuerpo)}
.envoltura{max-width:860px;margin:0 auto;padding-block:32px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:32px}
h1,h2{font-family:var(--display);font-stretch:112%;text-wrap:balance;margin:0;line-height:1.1}
h1{font-size:clamp(28px,5vw,40px);font-weight:800}
h1 span{color:var(--verde)}
.intro{display:grid;gap:12px}
.intro p{margin:0;color:var(--suave);max-width:65ch}
.reglas{background:var(--sup);border:1px solid var(--linea);border-radius:14px;padding:18px 20px;display:grid;gap:8px}
.reglas h2{font-size:17px}
.reglas ol{margin:0;padding-left:20px;display:grid;gap:6px;color:var(--tx)}
.progreso{display:flex;align-items:center;gap:12px;font-variant-numeric:tabular-nums;font-weight:700}
.barra{flex:1;height:8px;background:var(--linea);border-radius:99px;overflow:hidden}
.barra i{display:block;height:100%;width:0;background:var(--verde);transition:width .3s}
.grupo{display:grid;gap:14px}
.grupo h2{font-size:22px;display:flex;align-items:baseline;gap:10px}
.grupo h2 span{font-size:14px;color:var(--suave);font-family:var(--cuerpo);font-stretch:100%}
.lista{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.item{background:var(--sup);border:1px solid var(--linea);border-radius:14px;padding:16px 18px;display:grid;gap:10px;min-width:0}
.item.lista-ok{opacity:.55}
.cab{display:flex;gap:12px;align-items:flex-start}
.num{font-family:var(--display);font-weight:800;font-size:22px;color:var(--verde);font-variant-numeric:tabular-nums;min-width:2ch}
.meta{flex:1;min-width:0;display:grid;gap:2px}
.archivo{all:unset;cursor:pointer;font:700 15px/1.3 ui-monospace,Consolas,monospace;overflow-wrap:anywhere;border-bottom:1px dashed var(--suave)}
.archivo:focus-visible,.copiar:focus-visible,.hecha input:focus-visible{outline:3px solid var(--sol);outline-offset:2px}
.meta small{color:var(--suave);font-size:13.5px}
.chip{display:inline-block;background:var(--chip);color:var(--chip-tx);border-radius:99px;padding:0 8px;font-size:12.5px}
.hecha{display:flex;gap:6px;align-items:center;font-size:14px;color:var(--suave);white-space:nowrap;cursor:pointer}
.hecha input{accent-color:var(--verde);width:18px;height:18px}
.prompt{margin:0;font-size:14.5px;line-height:1.55;background:var(--bg);border-radius:10px;padding:12px 14px;overflow-wrap:anywhere}
.copiar{justify-self:start;background:var(--verde);color:var(--verde-tx);border:0;border-radius:10px;padding:10px 16px;font:700 15px var(--cuerpo);cursor:pointer;transition:transform .15s}
.copiar:hover{transform:translateY(-1px)}
.copiar.ok{background:var(--sol);color:#1A1400}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
<div class="envoltura">
<header class="intro">
<h1>Imágenes de <span>ecoems.net</span></h1>
<p>${L.length} prompts listos para ChatGPT, uno por imagen y en el orden del sitio. Copia el prompt, pégalo en un chat nuevo y guarda la imagen con el nombre de archivo que aparece arriba de cada uno.</p>
<div class="progreso"><span id="cuenta">0 de ${L.length} hechas</span><div class="barra" aria-hidden="true"><i id="avance"></i></div></div>
</header>
<section class="reglas" aria-labelledby="t-reglas">
<h2 id="t-reglas">Antes de empezar</h2>
<ol>
<li>Usa <b>un chat nuevo por imagen</b> para que no se mezclen estilos ni textos.</li>
<li>Donde dice <b>Adjunta escudo</b>, sube el PNG del escudo en el mismo mensaje del prompt. Así ChatGPT lo coloca tal cual y no lo inventa.</li>
<li>Revisa que los textos salgan <b>sin faltas ni acentos de más</b>. Si alguno sale mal, pide: "corrige solo el texto, deja todo igual".</li>
<li>Recorta al tamaño indicado, conviértela a <b>.webp</b> y guárdala con el nombre exacto (toca el nombre para copiarlo).</li>
<li>Cuando tengas un grupo listo, mándamelas y las subo al sitio.</li>
</ol>
</section>
${secciones}
</div>
<script>
(function(){
  var K="ecoems-prompts-hechas",hechas={};
  try{hechas=JSON.parse(localStorage.getItem(K)||"{}")}catch(e){}
  var total=${L.length};
  function pinta(){var n=0;document.querySelectorAll(".hecha input").forEach(function(c){var id=c.id.slice(2);c.checked=!!hechas[id];c.closest(".item").classList.toggle("lista-ok",c.checked);if(c.checked)n++});document.getElementById("cuenta").textContent=n+" de "+total+" hechas";document.getElementById("avance").style.width=(n/total*100)+"%"}
  document.addEventListener("change",function(e){if(!e.target.matches(".hecha input"))return;var id=e.target.id.slice(2);if(e.target.checked)hechas[id]=1;else delete hechas[id];try{localStorage.setItem(K,JSON.stringify(hechas))}catch(_){}pinta()});
  function copia(texto,btn,etiqueta){function ok(){if(!btn.dataset.orig)btn.dataset.orig=btn.textContent;btn.textContent=etiqueta;btn.classList.add("ok");setTimeout(function(){btn.textContent=btn.dataset.orig;btn.classList.remove("ok")},1600)}
    function seleccion(){var el=btn.dataset.objetivo?document.getElementById(btn.dataset.objetivo):btn;var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r)}
    try{navigator.clipboard.writeText(texto).then(ok,seleccion)}catch(e){seleccion()}}
  document.addEventListener("click",function(e){var b=e.target.closest(".copiar");if(b){copia(document.getElementById(b.dataset.objetivo).textContent,b,"Copiado");return}var a=e.target.closest(".archivo");if(a)copia(a.dataset.copiar,a,"Nombre copiado")});
  pinta();
})();
</script>`;
writeFileSync(process.argv[2], html);
console.log("ok", L.length);

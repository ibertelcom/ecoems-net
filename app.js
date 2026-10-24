// ecoems.net · comportamiento del sitio (sin dependencias)
(() => {
  document.documentElement.classList.add("js");

  // ---------- Mega menú (escritorio) ----------
  const botones = [...document.querySelectorAll(".nav-btn[aria-controls]")];
  let abierto = null;

  function cerrar(btn, devolverFoco = false) {
    if (!btn) return;
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", "false");
    panel.classList.remove("abierto");
    setTimeout(() => { if (btn.getAttribute("aria-expanded") === "false") panel.hidden = true; }, 180);
    if (devolverFoco) btn.focus();
    if (abierto === btn) abierto = null;
  }

  function abrir(btn) {
    if (abierto && abierto !== btn) cerrar(abierto);
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    panel.hidden = false;
    panel.style.translate = "";
    const r = panel.getBoundingClientRect();
    const margen = 16;
    let dx = 0;
    if (r.right > innerWidth - margen) dx = innerWidth - margen - r.right;
    if (r.left + dx < margen) dx = margen - r.left;
    if (dx) panel.style.translate = `calc(-50% + ${dx}px) 0`;
    requestAnimationFrame(() => panel.classList.add("abierto"));
    btn.setAttribute("aria-expanded", "true");
    abierto = btn;
  }

  botones.forEach((btn) => {
    btn.addEventListener("click", () => (btn.getAttribute("aria-expanded") === "true" ? cerrar(btn) : abrir(btn)));
    const item = btn.parentElement;
    let t;
    item.addEventListener("mouseenter", () => { if (matchMedia("(hover: hover)").matches) { clearTimeout(t); abrir(btn); } });
    item.addEventListener("mouseleave", () => { if (matchMedia("(hover: hover)").matches) t = setTimeout(() => cerrar(btn), 160); });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && abierto) cerrar(abierto, true); });
  document.addEventListener("click", (e) => { if (abierto && !abierto.parentElement.contains(e.target)) cerrar(abierto); });

  // ---------- Cajón (móvil) ----------
  const hamburguesa = document.querySelector(".menu-movil");
  const cajon = document.getElementById("cajon");
  const fondo = document.querySelector(".cajon-fondo");
  const icoMenu = hamburguesa?.innerHTML;
  const icoCerrar = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  function menu(abrirlo) {
    if (!hamburguesa || !cajon) return;
    hamburguesa.setAttribute("aria-expanded", String(abrirlo));
    hamburguesa.setAttribute("aria-label", abrirlo ? "Cerrar menú" : "Abrir menú");
    hamburguesa.innerHTML = abrirlo ? icoCerrar : icoMenu;
    cajon.hidden = !abrirlo;
    if (fondo) fondo.hidden = !abrirlo;
    document.documentElement.style.overflow = abrirlo ? "hidden" : "";
  }
  hamburguesa?.addEventListener("click", () => menu(hamburguesa.getAttribute("aria-expanded") !== "true"));
  fondo?.addEventListener("click", () => menu(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && hamburguesa?.getAttribute("aria-expanded") === "true") { menu(false); hamburguesa.focus(); } });
  cajon?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu(false)));

  // ---------- Ruta del proceso: se dibuja una vez al entrar en pantalla ----------
  const ruta = document.getElementById("ruta");
  if (ruta) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((ent) => {
        if (ent.some((x) => x.isIntersecting)) { ruta.classList.add("visto"); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(ruta);
    } else ruta.classList.add("visto");
  }

  // ---------- Pestañas de aciertos ----------
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function activar(tab, foco) {
    tabs.forEach((t) => {
      const sel = t === tab;
      t.setAttribute("aria-selected", String(sel));
      t.tabIndex = sel ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !sel;
    });
    if (foco) tab.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => activar(t));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); activar(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  // ---------- Consulta rápida de aciertos ----------
  const form = document.getElementById("consulta");
  const datosEl = document.getElementById("datos-escuelas");
  if (form && datosEl) {
    const datos = JSON.parse(datosEl.textContent);
    const select = form.querySelector("select");
    const salida = document.getElementById("consulta-resultado");
    const app = "https://ecoems.app/?utm_source=ecoems.net&utm_medium=referral&utm_campaign=portada-consulta";
    const art = (n) => (/^(CCH|CET)/.test(n) ? "el" : "la");
    function mostrar() {
      const e = datos.find((x) => x.s === select.value);
      if (!e) { salida.hidden = true; return; }
      const [a24, a25, a26] = e.a;
      const nombre = e.n;
      salida.dataset.linea = e.l;
      salida.innerHTML = `
        <p class="res-titulo">${art(nombre) === "el" ? "El" : "La"} ${nombre} pidió ${a26} aciertos en 2026</p>
        <ul class="res-anios"><li>2024 <b>${a24}</b></li><li>2025 <b>${a25}</b></li><li>2026 <b>${a26}</b></li></ul>
        <p class="res-meta">Meta Tepo 2027 <span class="chip-meta">${e.m}</span> de 128</p>
        <p class="res-acciones"><a href="/escuelas/${e.s}/">Ver la escuela</a><a href="${app}">¿Le alcanza? Haz el diagnóstico gratis</a></p>`;
      salida.hidden = false;
    }
    select.addEventListener("change", mostrar);
    form.addEventListener("submit", (ev) => { if (select.value) { ev.preventDefault(); mostrar(); } });
  }

  // ---------- Anuncios: se activan solo cuando exista el código de AdSense ----------
  if (window.ECOEMS_ADS) document.querySelectorAll(".anuncio").forEach((a) => { a.hidden = false; a.dataset.activo = ""; });
})();

// ---------- Tabla de aciertos: ordenar y filtrar ----------
(() => {
  document.querySelectorAll("table[data-ordenable]").forEach((tabla) => {
    const cuerpo = tabla.tBodies[0];
    const ths = [...tabla.tHead.rows[0].cells];
    tabla.tHead.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-col]");
      if (!b) return;
      const col = +b.dataset.col;
      const th = ths[col];
      const dir = th.getAttribute("aria-sort") === "descending" ? "ascending" : "descending";
      ths.forEach((t) => t.removeAttribute("aria-sort"));
      th.setAttribute("aria-sort", dir);
      const val = (tr) => (col === 0 ? tr.cells[0].textContent.trim() : +tr.cells[col].dataset.v);
      const filas = [...cuerpo.rows].sort((a, z) => {
        const x = val(a), y = val(z);
        const r = typeof x === "string" ? x.localeCompare(y, "es", { numeric: true }) : x - y;
        return dir === "ascending" ? r : -r;
      });
      cuerpo.append(...filas);
    });
  });
  const filtros = [...document.querySelectorAll(".filtro")];
  filtros.forEach((f) =>
    f.addEventListener("click", () => {
      filtros.forEach((x) => x.setAttribute("aria-pressed", String(x === f)));
      document.querySelectorAll(".tabla-aciertos tbody tr").forEach((tr) => {
        tr.hidden = f.dataset.filtro !== "todas" && tr.dataset.linea !== f.dataset.filtro;
      });
    }),
  );

  // ---------- Buscador del índice de escuelas ----------
  const buscar = document.getElementById("buscar-escuela");
  if (buscar) {
    const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
    const sin = document.getElementById("sin-resultados");
    buscar.addEventListener("input", () => {
      const q = norm(buscar.value).replace(/\bvocacional\b/, "voca").replace(/\bpreparatoria\b/, "prepa");
      let total = 0;
      document.querySelectorAll("[data-grupo]").forEach((g) => {
        let n = 0;
        g.querySelectorAll("li[data-buscar]").forEach((li) => {
          const ok = !q || q.split(/\s+/).every((p) => li.dataset.buscar.includes(p));
          li.hidden = !ok;
          if (ok) n++;
        });
        g.hidden = n === 0;
        total += n;
      });
      sin.hidden = total > 0;
    });
  }
})();

// ---------- Herramientas ----------
(() => {
  const el = document.getElementById("datos-escuelas");
  if (!el) return;
  const datos = JSON.parse(el.textContent);
  const por = Object.fromEntries(datos.map((e) => [e.s, e]));
  const LINEA = { enp: "Prepas UNAM", cch: "CCH UNAM", voca: "Vocacionales IPN" };
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const tipo = (ac, e) => (ac >= e.m ? "alcanza" : ac >= e.a[2] ? "orilla" : "reto");
  const ETQ = { alcanza: "Segura", orilla: "Alcanzable", reto: "Retadora" };

  // Calculadora
  const ac = document.getElementById("calc-aciertos");
  if (ac) {
    const total = document.getElementById("calc-total");
    const rango = document.getElementById("calc-rango");
    const escala = document.getElementById("calc-escala");
    const resumen = document.getElementById("calc-resumen");
    const listas = { alcanza: document.getElementById("lista-alcanza"), orilla: document.getElementById("lista-orilla"), reto: document.getElementById("lista-reto") };
    function calcular(desde) {
      const t = Math.max(10, Math.min(200, +total.value || 128));
      let a = Math.max(0, Math.min(t, desde === "rango" ? +rango.value : +ac.value || 0));
      if (desde === "rango") ac.value = a;
      const a128 = Math.round((a / t) * 128);
      if (desde !== "rango") rango.value = a128;
      escala.hidden = t === 128;
      escala.textContent = t === 128 ? "" : `Equivale a ${a128} aciertos en un examen de 128 preguntas.`;
      const g = { alcanza: [], orilla: [], reto: [] };
      [...datos].sort((x, y) => y.a[2] - x.a[2]).forEach((e) => g[tipo(a128, e)].push(e));
      for (const k in g) {
        listas[k].innerHTML = g[k].length
          ? g[k].map((e) => `<li data-linea="${e.l}"><a href="/escuelas/${e.s}/">${esc(e.n)}</a><span>${k === "reto" ? `le faltan ${e.a[2] - a128}` : k === "orilla" ? `faltan ${e.m - a128} para la meta` : `meta ${e.m}`}</span></li>`).join("")
          : `<li class="vacia">Ninguna escuela en este grupo.</li>`;
      }
      resumen.innerHTML = `<b>${a128}</b><span>aciertos de 128</span><p>Le alcanzan <b>${g.alcanza.length}</b> con margen, <b>${g.orilla.length}</b> están en la orilla y <b>${g.reto.length}</b> son retadoras.</p>`;
    }
    ac.addEventListener("input", () => calcular("num"));
    total.addEventListener("input", () => calcular("num"));
    rango.addEventListener("input", () => calcular("rango"));
    calcular("num");
  }

  // Comparador
  const tabla = document.getElementById("tabla-comp");
  if (tabla) {
    const sels = [...document.querySelectorAll("[data-comp]")];
    function comparar() {
      const es = sels.map((s) => por[s.value]).filter(Boolean);
      if (!es.length) { tabla.innerHTML = `<caption>Elige al menos una escuela.</caption>`; return; }
      const max = Math.max(...es.map((e) => e.a[2]));
      const fila = (t, f) => `<tr><th scope="row">${t}</th>${es.map((e) => `<td>${f(e)}</td>`).join("")}</tr>`;
      tabla.innerHTML = `<thead><tr><th scope="col"><span class="visualmente-oculto">Dato</span></th>${es.map((e) => `<th scope="col" data-linea="${e.l}"><a href="/escuelas/${e.s}/">${esc(e.n)}</a><small>${LINEA[e.l]}</small></th>`).join("")}</tr></thead><tbody>
        ${fila("Aciertos 2026", (e) => `<b class="${e.a[2] === max && es.length > 1 ? "comp-max" : ""}">${e.a[2]}</b>`)}
        ${fila("Aciertos 2025", (e) => e.a[1])}
        ${fila("Aciertos 2024", (e) => e.a[0])}
        ${fila("Meta Tepo 2027", (e) => `<span class="chip-meta">${e.m}</span>`)}
        ${fila("Tipo", (e) => (e.l === "voca" ? `Bachillerato bivalente con carrera técnica${e.ar ? `, ${esc(e.ar)}` : ""}` : e.l === "cch" ? "Bachillerato UNAM, plan semestral, pase reglamentado" : "Bachillerato UNAM, plan anual, pase reglamentado"))}
        ${fila("Alcaldía o municipio", (e) => esc(e.z ?? "Por confirmar"))}
        ${fila("Dirección", (e) => esc(e.d ?? "Consulta el sitio oficial"))}
      </tbody>`;
    }
    sels.forEach((s) => s.addEventListener("change", comparar));
    comparar();
  }

  // Armar opciones
  const lista = document.getElementById("armar-lista");
  if (lista) {
    const sel = document.getElementById("armar-escuela");
    const aciertos = document.getElementById("armar-aciertos");
    const aviso = document.getElementById("armar-aviso");
    const diag = document.getElementById("armar-diagnostico");
    let orden = ["prepa-6", "prepa-9", "cch-sur", "voca-9", "voca-7", "cch-oriente"];
    try { const g = JSON.parse(localStorage.getItem("ecoems-opciones") || "null"); if (Array.isArray(g)) orden = g.filter((s) => por[s]); } catch (e) {}
    const guardar = () => { try { localStorage.setItem("ecoems-opciones", JSON.stringify(orden)); } catch (e) {} };
    function pintar() {
      const a = +aciertos.value || 0;
      lista.innerHTML = orden.map((s, i) => {
        const e = por[s]; const t = tipo(a, e);
        return `<li data-linea="${e.l}"><span class="lo-num">${i + 1}</span><span class="lo-nombre"><a href="/escuelas/${e.s}/">${esc(e.n)}</a><small>Aciertos 2026: ${e.a[2]} · meta ${e.m}</small></span><span class="lo-etq" data-tipo="${t}">${ETQ[t]}</span>
          <span class="lo-btns"><button type="button" data-mover="-1" data-i="${i}" aria-label="Subir ${esc(e.c)}"${i === 0 ? " disabled" : ""}>↑</button><button type="button" data-mover="1" data-i="${i}" aria-label="Bajar ${esc(e.c)}"${i === orden.length - 1 ? " disabled" : ""}>↓</button><button type="button" data-quitar="${i}" aria-label="Quitar ${esc(e.c)}">×</button></span></li>`;
      }).join("") || `<li class="vacia">Tu lista está vacía. Agrega escuelas desde el selector.</li>`;
      const tipos = orden.map((s) => tipo(a, por[s]));
      diag.textContent = !orden.length ? "" : !tipos.includes("alcanza")
        ? "Ojo: con esos aciertos ninguna escuela de tu lista es segura. Agrega al menos una o dos con menos aciertos, o considera la modalidad 3 con opciones sin examen."
        : tipos.indexOf("alcanza") < tipos.lastIndexOf("reto")
        ? "Revisa el orden: tienes escuelas retadoras debajo de una segura. Si llega a la segura, ya no se revisan las de abajo."
        : "La lista tiene escuelas seguras para esos aciertos. Revisa que el orden sea de la que más quiere a la que menos.";
      guardar();
    }
    document.getElementById("armar-agregar").addEventListener("click", () => {
      const s = sel.value; if (!s) { aviso.textContent = "Elige una escuela para agregarla."; return; }
      if (orden.includes(s)) { aviso.textContent = "Esa escuela ya está en tu lista."; return; }
      const inst = por[s].i; const n = orden.filter((x) => por[x].i === inst).length;
      if (n >= 5) { aviso.textContent = `Ya tienes 5 escuelas ${inst === "UNAM" ? "de la UNAM" : "del IPN"}, el máximo por institución.`; return; }
      orden.push(s); aviso.textContent = `Agregaste ${por[s].c}.`; pintar();
    });
    lista.addEventListener("click", (ev) => {
      const b = ev.target.closest("button"); if (!b) return;
      if (b.dataset.quitar !== undefined) orden.splice(+b.dataset.quitar, 1);
      else { const i = +b.dataset.i, j = i + +b.dataset.mover; [orden[i], orden[j]] = [orden[j], orden[i]]; }
      pintar();
    });
    aciertos.addEventListener("input", pintar);
    document.getElementById("armar-limpiar").addEventListener("click", () => { orden = []; aviso.textContent = "Lista vacía."; pintar(); });
    document.getElementById("armar-copiar").addEventListener("click", async () => {
      const texto = orden.map((s, i) => `${i + 1}. ${por[s].n}`).join("\n");
      try { await navigator.clipboard.writeText(texto); aviso.textContent = "Lista copiada."; }
      catch (e) { const r = document.createRange(); r.selectNodeContents(lista); getSelection().removeAllRanges(); getSelection().addRange(r); aviso.textContent = "Selecciona y copia la lista con Ctrl+C."; }
    });
    pintar();
  }
})();

// ---------- Prepas cerca de mí: ¿qué escuela te conviene? ----------
(() => {
  const form = document.getElementById("cm-form");
  if (!form) return;
  const datos = JSON.parse(document.getElementById("datos-escuelas").textContent);
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const AREA = { ing: "Ciencias Físico-Matemáticas", salud: "Ciencias Médico-Biológicas", soc: "Ciencias Sociales y Administrativas" };
  const AREA_CORTA = { "Ciencias Físico-Matemáticas": "Físico-Matemáticas", "Ciencias Médico-Biológicas": "Médico-Biológicas", "Ciencias Sociales y Administrativas": "Sociales y Administrativas" };
  const CUPO = { arriesgado: { reto: 4, orilla: 4, alcanza: 2 }, equilibrado: { reto: 2, orilla: 5, alcanza: 3 }, seguro: { reto: 1, orilla: 4, alcanza: 5 } };
  const ETQ = { reto: "Reto", orilla: "Alcanzable", alcanza: "Segura" };
  const RETO_MAX = 8;
  let casa = null; // { lat, lon, texto, aprox }
  let cps = null;
  let lista = [];

  const km = (a, b) => {
    const r = Math.PI / 180, dla = (b[0] - a[0]) * r, dlo = (b[1] - a[1]) * r;
    const h = Math.sin(dla / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dlo / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  };
  const valor = (n) => form.querySelector(`input[name="${n}"]:checked`)?.value;
  const aciertos = () => Math.max(0, Math.min(128, $("cm-nosabe").checked ? +$("cm-nivel").value : Math.round(+$("cm-aciertos").value || 0)));

  async function cargarCps() {
    if (cps) return cps;
    const r = await fetch("/datos/cp-zmvm.json");
    const j = await r.json();
    cps = new Map(j.c.split(";").map((f) => { const [cp, la, lo, m, q] = f.split(","); return [cp, { lat: (+la + 18000) / 1000, lon: (+lo - 101000) / 1000, mun: j.m[+m], aprox: q === "0" }]; }));
    return cps;
  }
  async function buscarCp() {
    const cp = $("cm-cp").value.replace(/\D/g, "");
    const donde = $("cm-donde");
    if (cp.length !== 5) { casa = null; donde.textContent = "Escribe los 5 dígitos de tu código postal."; pintar(); return; }
    try {
      const m = await cargarCps();
      const p = m.get(cp);
      if (!p) { casa = null; donde.textContent = `No encontramos el ${cp} en la Ciudad de México ni en los municipios conurbados. Prueba con «Usar mi ubicación».`; }
      else { casa = { lat: p.lat, lon: p.lon, texto: `${cp}, ${p.mun}`, aprox: p.aprox }; donde.textContent = `Tu zona: ${casa.texto}${p.aprox ? " (ubicación aproximada)" : ""}.`; }
    } catch (e) { casa = null; donde.textContent = "No pudimos cargar los códigos postales. Revisa tu conexión o usa tu ubicación."; }
    pintar();
  }

  function calcular() {
    const A = aciertos();
    const area = valor("cm-area");
    const estilo = valor("cm-estilo");
    const maxKm = +$("cm-dist").value;
    const quiereUnam = $("cm-unam").checked, quiereIpn = $("cm-ipn").checked;
    const avisos = [];
    let fueraDist = 0, fueraArea = 0, lejos = 0;
    const cands = [];
    for (const e of datos) {
      if (e.i === "UNAM" && !quiereUnam) continue;
      if (e.i === "IPN") {
        if (!quiereIpn) continue;
        if (area === "hum") { fueraArea++; continue; }
        if (AREA[area] && e.ar && e.ar !== AREA[area]) { fueraArea++; continue; }
      }
      const dist = casa && e.g ? km([casa.lat, casa.lon], e.g) : null;
      if (maxKm && dist !== null && dist > maxKm) { fueraDist++; continue; }
      const t = A >= e.m ? "alcanza" : A >= e.a[2] ? "orilla" : A >= e.a[2] - RETO_MAX ? "reto" : null;
      if (!t) { lejos++; continue; }
      cands.push({ ...e, t, dist });
    }
    // Más cerca primero dentro de cada grupo; a igual distancia, la más pedida.
    const porCercania = (x, y) => (x.dist ?? 0) - (y.dist ?? 0) || y.a[2] - x.a[2];
    const cupo = { ...CUPO[estilo] };
    const usados = { UNAM: 0, IPN: 0 };
    const elegido = [];
    const tomar = (t, n) => {
      for (const e of cands.filter((c) => c.t === t && !elegido.includes(c)).sort(porCercania)) {
        if (n <= 0 || elegido.length >= 10) break;
        if (usados[e.i] >= 5) continue;
        elegido.push(e); usados[e.i]++; n--;
      }
      return n;
    };
    // Si falta de un grupo, el cupo pasa al grupo más seguro.
    let sobra = tomar("reto", cupo.reto);
    sobra = tomar("orilla", cupo.orilla + sobra);
    sobra = tomar("alcanza", cupo.alcanza + sobra);
    if (sobra > 0) tomar("orilla", sobra);
    const ORDEN = { reto: 0, orilla: 1, alcanza: 2 };
    elegido.sort((x, y) => ORDEN[x.t] - ORDEN[y.t] || y.a[2] - x.a[2]);

    if (!elegido.some((e) => e.t === "alcanza")) avisos.push(`Ninguna escuela de la lista es segura con ${A} aciertos. Agrega opciones con menos demanda, amplía la distancia o considera la <a href="/modalidades/">modalidad 3</a>, que suma escuelas <a href="/escuelas/sin-examen/">sin examen</a>.`);
    if (area === "hum" && quiereIpn) avisos.push("Para humanidades, arte o derecho el IPN no tiene vocacionales de esa área, por eso solo te sugerimos escuelas de la UNAM.");
    else if (AREA[area] && fueraArea) avisos.push(`Dejamos fuera ${fueraArea} vocacionales que no son del área ${AREA_CORTA[AREA[area]]}: en el IPN el área se elige desde la voca.`);
    if (area === "nose" && elegido.some((e) => e.i === "IPN")) avisos.push("Si elige una vocacional, revisa su área: en el IPN define el tipo de carreras para las que se prepara. Si aún no sabe qué estudiar, la UNAM le da más tiempo para decidir.");
    if (fueraDist) avisos.push(`${fueraDist} escuelas quedaron fuera por estar a más de ${maxKm} km${elegido.length < 6 ? ". Si la lista es corta, amplía la distancia" : ""}.`);
    if (lejos && elegido.length < 4) avisos.push(`Hay ${lejos} escuelas a las que hoy le faltan más de ${RETO_MAX} aciertos. Con práctica puede acercarse: <a href="/calculadora/">usa la calculadora</a> para ver cuántos le faltan.`);
    if (!casa) avisos.push("Escribe tu código postal para ordenar por cercanía y descartar las escuelas lejanas.");
    return { A, area, elegido, avisos };
  }

  function razones(e, A, area) {
    const r = [];
    const pl = (n, t) => `${n} ${t}${n === 1 ? "" : "s"}`;
    if (e.t === "alcanza") r.push(A === e.m ? `Llega justo a la meta Tepo (${e.m}).` : `Le sobran ${pl(A - e.m, "acierto")} sobre la meta Tepo (${e.m}).`);
    else if (e.t === "orilla") r.push(`${A === e.a[2] ? "Iguala" : "Pasa"} los ${e.a[2]} aciertos que pidió en 2026; le ${e.m - A === 1 ? "falta" : "faltan"} ${pl(e.m - A, "acierto")} para la meta Tepo.`);
    else r.push(`Le ${e.a[2] - A === 1 ? "falta" : "faltan"} ${pl(e.a[2] - A, "acierto")} para los ${e.a[2]} que pidió en 2026.`);
    if (e.dist !== null) r.push(`A ${e.dist.toFixed(1)} km de tu casa${e.z ? `, en ${esc(e.z)}` : ""}.`);
    else if (e.z) r.push(`En ${esc(e.z)}.`);
    if (e.l === "voca") r.push(`${e.ar ? `Área ${AREA_CORTA[e.ar] ?? esc(e.ar)}` : "Área por confirmar"}${e.ca?.length ? `. Carreras técnicas: ${e.ca.map(esc).join(", ")}` : ""}.`);
    else if (area === "nose" || area === "hum" || AREA[area]) r.push("Bachillerato general UNAM: la carrera se elige al final, con pase reglamentado.");
    if (e.a[2] - e.a[1] >= 3) r.push(`Ojo: subió ${e.a[2] - e.a[1]} aciertos de 2025 a 2026.`);
    return r;
  }

  function pintar() {
    const { A, area, elegido, avisos } = calcular();
    lista = elegido;
    const n = { reto: 0, orilla: 0, alcanza: 0 };
    elegido.forEach((e) => n[e.t]++);
    $("cm-resumen").innerHTML = `<b>${elegido.length}</b><span>escuelas sugeridas${casa ? ` cerca de ${esc(casa.texto)}` : ""}</span><p>Con <b>${A}</b> aciertos: ${n.reto} reto, ${n.orilla} alcanzables y ${n.alcanza} seguras. Regístralas en este orden.</p>`;
    $("cm-lista").innerHTML = elegido.length ? elegido.map((e, i) => {
      const destino = e.g ? `${e.g[0]},${e.g[1]}` : encodeURIComponent(e.n);
      const ruta = `https://www.google.com/maps/dir/?api=1${casa ? `&origin=${casa.lat},${casa.lon}` : ""}&destination=${destino}`;
      return `<li data-linea="${e.l}"><span class="lo-num">${i + 1}</span><div class="cm-item"><div class="cm-item-cab"><a href="/escuelas/${e.s}/">${esc(e.n)}</a><span class="lo-etq" data-tipo="${e.t}">${ETQ[e.t]}</span></div>
        <p class="cm-datos">Aciertos 2024 · 2025 · 2026: <b>${e.a.join(" · ")}</b> · meta Tepo <b>${e.m}</b></p>
        <ul class="cm-razones">${razones(e, A, area).map((t) => `<li>${t}</li>`).join("")}</ul>
        <span class="cm-links"><a class="cm-ficha" href="/escuelas/${e.s}/">Ver ficha de la escuela →</a><a class="te-ruta" href="${ruta}" target="_blank" rel="noopener">Cómo llegar ↗</a></span></div></li>`;
    }).join("") : `<li class="vacia">No encontramos escuelas con esos filtros. Amplía la distancia, activa la UNAM y el IPN o revisa sus aciertos.</li>`;
    $("cm-avisos").innerHTML = avisos.map((a) => `<p>${a}</p>`).join("");
    pintarSin();
    const texto = `Mis opciones ECOEMS (${A} aciertos)\n` + elegido.map((e, i) => `${i + 1}. ${e.n} – ${ETQ[e.t]}`).join("\n") + "\nArmada en https://ecoems.net/prepas-cerca-de-mi/";
    $("cm-wa").href = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    $("cm-copiar").dataset.texto = texto;
    $("cm-armar").toggleAttribute("aria-disabled", !elegido.length);
  }

  // Escuelas sin examen más cercanas (catálogo oficial de Mi Derecho, Mi Lugar), para la modalidad 3.
  let sin = null;
  async function pintarSin() {
    const caja = $("cm-sin");
    if (!caja) return;
    if (!casa) { caja.hidden = true; return; }
    try { if (!sin) { const j = await (await fetch("/datos/sin-examen.json")).json(); sin = j.p.map(([sis, n, la, lo, url, z, ca]) => ({ n, g: [la, lo], url, z, ca, tipo: j.s[sis][0], tec: /conalep|dgeti|cecytem|cbt|cbta/.test(sis) })); } } catch (e) { caja.hidden = true; return; }
    const area = valor("cm-area");
    const maxKm = +$("cm-dist").value || 99;
    let cerca = sin.map((e) => ({ ...e, d: km([casa.lat, casa.lon], e.g) })).filter((e) => e.d <= maxKm).sort((a, b) => a.d - b.d);
    // Si quiere ingeniería, salud o negocios, primero las que dan carrera técnica.
    if (["ing", "salud", "soc"].includes(area)) cerca = [...cerca.filter((e) => e.tec).slice(0, 4), ...cerca.filter((e) => !e.tec).slice(0, 2)].sort((a, b) => a.d - b.d);
    cerca = cerca.slice(0, 6);
    caja.hidden = !cerca.length;
    $("cm-sin-lista").innerHTML = cerca.map((e) => `<li><a href="${esc(e.url)}"><b>${esc(e.n)}</b></a><small>${esc(e.tipo)} · ${e.d.toFixed(1)} km · ${esc(e.z)}</small>${e.ca ? `<small>Carreras: ${esc(e.ca)}</small>` : ""}</li>`).join("");
  }

  let tCp;
  $("cm-cp").addEventListener("input", () => { clearTimeout(tCp); tCp = setTimeout(buscarCp, 350); });
  $("cm-nosabe").addEventListener("change", () => { $("cm-nivel").hidden = !$("cm-nosabe").checked; $("cm-aciertos").disabled = $("cm-nosabe").checked; pintar(); });
  form.addEventListener("input", (ev) => { if (ev.target.id !== "cm-cp") pintar(); });
  form.addEventListener("change", (ev) => { if (ev.target.id !== "cm-cp") pintar(); });
  form.addEventListener("submit", (ev) => ev.preventDefault());
  $("cm-gps").addEventListener("click", () => {
    const donde = $("cm-donde");
    if (!navigator.geolocation) { donde.textContent = "Tu navegador no permite compartir la ubicación. Usa tu código postal."; return; }
    donde.textContent = "Buscando tu ubicación…";
    navigator.geolocation.getCurrentPosition(
      (p) => { casa = { lat: p.coords.latitude, lon: p.coords.longitude, texto: "tu ubicación", gps: true }; donde.textContent = "Usando tu ubicación actual. No la guardamos ni la enviamos a ningún lado."; pintar(); },
      () => { donde.textContent = "No pudimos obtener tu ubicación. Revisa el permiso del navegador o usa tu código postal."; },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  });
  $("cm-armar").addEventListener("click", () => { try { localStorage.setItem("ecoems-opciones", JSON.stringify(lista.map((e) => e.s))); } catch (e) {} });
  $("cm-copiar").addEventListener("click", async () => {
    const aviso = $("cm-aviso-accion");
    try { await navigator.clipboard.writeText($("cm-copiar").dataset.texto); aviso.textContent = "Lista copiada."; }
    catch (e) { const r = document.createRange(); r.selectNodeContents($("cm-lista")); getSelection().removeAllRanges(); getSelection().addRange(r); aviso.textContent = "Selecciona la lista y cópiala con Ctrl+C."; }
  });
  pintar();
  buscarCp();
})();

// ---------- Mapa interactivo (Leaflet propio, se carga solo al acercarse al mapa) ----------
(() => {
  const caja = document.getElementById("mapa");
  if (!caja) return;
  const datos = JSON.parse(document.getElementById("datos-escuelas").textContent).filter((e) => e.g);
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const LINEA = { enp: "Prepa UNAM", cch: "CCH UNAM", voca: "Vocacional IPN", sin: "Sin examen" };
  const AREA = { "Ciencias Físico-Matemáticas": "Físico-Matemáticas", "Ciencias Médico-Biológicas": "Médico-Biológicas", "Ciencias Sociales y Administrativas": "Sociales y Administrativas" };
  const color = (l) => getComputedStyle(document.documentElement).getPropertyValue(`--${l === "sin" ? "verde" : l}`).trim() || "#2457C5";
  const ficha = (e) => e.url ?? `/escuelas/${e.s}/`;
  const km = (a, b) => { const r = Math.PI / 180, x = (b[0] - a[0]) * r, y = (b[1] - a[1]) * r; const h = Math.sin(x / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(y / 2) ** 2; return 2 * 6371 * Math.asin(Math.sqrt(h)); };
  const ruta = (e, casa) => `https://www.google.com/maps/dir/?api=1${casa ? `&origin=${casa[0]},${casa[1]}` : ""}&destination=${e.g[0]},${e.g[1]}`;
  let L, mapa, capas = {}, casa = null, casaCapa = null, cps = null;

  function cargar() {
    return new Promise((ok, mal) => {
      const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "/vendor/leaflet/leaflet.css"; document.head.appendChild(css);
      const js = document.createElement("script"); js.src = "/vendor/leaflet/leaflet.js"; js.onload = ok; js.onerror = mal; document.head.appendChild(js);
    });
  }
  function popup(e) {
    const d = casa ? `<span>A ${km(casa, e.g).toFixed(1)} km de tu casa</span>` : "";
    if (e.l === "sin") return `<div class="mp-pop"><small>${esc(e.tipo)} · sin examen</small><b>${esc(e.n)}</b>${e.ca ? `<span>${esc(e.ca)}</span>` : ""}<span>${esc(e.z ?? "")}</span>${d}<span class="mp-pop-links"><a href="${esc(e.url)}">Ver escuela</a><a href="${ruta(e, casa)}" target="_blank" rel="noopener">Cómo llegar ↗</a></span></div>`;
    return `<div class="mp-pop"><small>${LINEA[e.l]}${e.l === "voca" && e.ar ? ` · ${AREA[e.ar] ?? esc(e.ar)}` : ""}</small><b>${esc(e.n)}</b><span>Aciertos 2026: <strong>${e.a[2]}</strong> · meta Tepo <strong>${e.m}</strong></span><span>${esc(e.z ?? "")}</span>${d}<span class="mp-pop-links"><a href="/escuelas/${e.s}/">Ver ficha</a><a href="${ruta(e, casa)}" target="_blank" rel="noopener">Cómo llegar ↗</a></span></div>`;
  }
  function visibles() {
    const lineas = [...document.querySelectorAll(".mp-filtro input:checked")].map((i) => i.value);
    const area = $("mp-area").value;
    const sis = $("mp-sis") ? $("mp-sis").value : "";
    return datos.filter((e) => lineas.includes(e.l) && (e.l !== "voca" || !area || e.ar === area || !e.ar) && (e.l !== "sin" || !sis || e.sis === sis));
  }
  function filtrar() {
    const v = new Set(visibles().map((e) => e.s));
    for (const e of datos) { const m = capas[e.s]; if (v.has(e.s)) { if (!mapa.hasLayer(m)) m.addTo(mapa); } else if (mapa.hasLayer(m)) mapa.removeLayer(m); }
    encuadrar();
  }
  function cercanas() {
    const lista = $("mp-cerca");
    if (!casa) { lista.innerHTML = ""; return null; }
    const radio = +$("mp-radio").value;
    const cerca = visibles().map((e) => ({ e, d: km(casa, e.g) })).sort((a, b) => a.d - b.d);
    const dentro = cerca.filter((x) => x.d <= radio);
    const mostrar = (dentro.length ? dentro : cerca.slice(0, 3)).slice(0, 8);
    lista.innerHTML = (dentro.length ? "" : `<li class="vacia">No hay escuelas a menos de ${radio} km. Estas son las más cercanas:</li>`) + mostrar.map(({ e, d }) =>
      `<li data-linea="${e.l}"><button type="button" data-ver="${e.s}"><b>${esc(e.c)}</b><span>${d.toFixed(1)} km · ${e.l === "sin" ? `${esc(e.tipo)} · sin examen` : `2026: ${e.a[2]} · meta ${e.m}`}</span></button><a class="mp-ficha" href="${esc(ficha(e))}">${e.l === "sin" ? "Ver escuela" : "Ver ficha"} →</a></li>`).join("");
    if (casaCapa) casaCapa.circulo.setRadius(radio * 1000);
    return { dentro: dentro.length, cerca };
  }
  function encuadrar() {
    const r = cercanas();
    if (!casaCapa || !r) return;
    if (r.dentro) mapa.fitBounds(casaCapa.circulo.getBounds(), { padding: [20, 20] });
    else mapa.fitBounds(L.latLngBounds([casa, ...r.cerca.slice(0, 3).map((x) => x.e.g)]), { padding: [30, 30] });
  }
  function ponerCasa(lat, lon, texto) {
    casa = [lat, lon];
    if (casaCapa) { casaCapa.punto.remove(); casaCapa.circulo.remove(); }
    const radio = +$("mp-radio").value;
    casaCapa = {
      circulo: L.circle(casa, { radius: radio * 1000, color: color("verde"), weight: 1.5, fillOpacity: 0.06, interactive: false }).addTo(mapa),
      punto: L.marker(casa, { icon: L.divIcon({ className: "mp-casa", html: "<span>Casa</span>", iconSize: [46, 24], iconAnchor: [23, 12] }), keyboard: false, title: texto }).addTo(mapa),
    };
    $("mp-donde").textContent = `Escuelas cerca de ${texto}:`;
    for (const e of datos) capas[e.s].setPopupContent(popup(e));
    encuadrar();
  }
  async function buscarCp() {
    const cp = $("mp-cp").value.replace(/\D/g, "");
    if (cp.length !== 5) return;
    try {
      if (!cps) { const j = await (await fetch("/datos/cp-zmvm.json")).json(); cps = new Map(j.c.split(";").map((f) => { const [c, la, lo, m] = f.split(","); return [c, [(+la + 18000) / 1000, (+lo - 101000) / 1000, j.m[+m]]]; })); }
      const p = cps.get(cp);
      if (!p) { $("mp-donde").textContent = `No encontramos el ${cp} en la zona metropolitana. Prueba con «Mi ubicación».`; return; }
      ponerCasa(p[0], p[1], `${cp}, ${p[2]}`);
    } catch (e) { $("mp-donde").textContent = "No pudimos cargar los códigos postales. Revisa tu conexión."; }
  }
  function ver(slug) {
    const m = capas[slug]; if (!m) return;
    if (!mapa.hasLayer(m)) m.addTo(mapa);
    caja.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    mapa.setView(m.getLatLng(), Math.max(mapa.getZoom(), 14));
    m.openPopup();
  }

  async function iniciar() {
    try { await cargar(); } catch (e) { caja.innerHTML = `<p class="mp-cargando">No se pudo cargar el mapa. Abajo tienes todas las escuelas por alcaldía.</p>`; return; }
    L = window.L;
    caja.innerHTML = "";
    const oscuro = matchMedia("(prefers-color-scheme: dark)").matches && document.documentElement.dataset.theme !== "light";
    mapa = L.map(caja, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }).addTo(mapa);
    if (oscuro) caja.classList.add("mp-oscuro");
    // Escuelas sin examen (catálogo oficial de Mi Derecho, Mi Lugar): se agregan como una capa más.
    try {
      const j = await (await fetch("/datos/sin-examen.json")).json();
      j.p.forEach(([sis, n, la, lo, url, z, ca], i) => datos.push({ s: `x${i}`, l: "sin", n, c: n, g: [la, lo], z, url, sis, tipo: j.s[sis][0], ca }));
    } catch (e) {}
    const lienzo = L.canvas({ padding: 0.3 });
    for (const e of datos) {
      if (e.l === "sin") {
        capas[e.s] = L.circleMarker(e.g, { renderer: lienzo, radius: 6, color: "#fff", weight: 1.5, fillColor: color("sin"), fillOpacity: .95 })
          .bindPopup(popup(e), { maxWidth: 260 }).bindTooltip(e.c, { direction: "top", offset: [0, -6] }).addTo(mapa);
        continue;
      }
      capas[e.s] = L.circleMarker(e.g, { radius: 9, color: "#fff", weight: 2.5, fillColor: color(e.l), fillOpacity: 1 })
        .bindPopup(popup(e), { maxWidth: 260 }).bindTooltip(e.c, { direction: "top", offset: [0, -8] }).addTo(mapa);
    }
    mapa.fitBounds(L.latLngBounds(datos.filter((e) => e.l !== "sin").map((e) => e.g)), { padding: [24, 24] });
    for (const e of datos) if (e.l !== "sin") capas[e.s].bringToFront();
    mapa.on("focus", () => mapa.scrollWheelZoom.enable());
    mapa.on("blur", () => mapa.scrollWheelZoom.disable());
    const leyenda = L.control({ position: "bottomleft" });
    leyenda.onAdd = () => { const d = L.DomUtil.create("div", "mp-leyenda"); d.innerHTML = Object.entries(LINEA).map(([k, t]) => `<span><i style="background:${color(k)}"></i>${t}</span>`).join(""); return d; };
    leyenda.addTo(mapa);
    document.querySelectorAll(".mp-filtro input").forEach((i) => i.addEventListener("change", filtrar));
    $("mp-area").addEventListener("change", filtrar);
    if ($("mp-sis")) $("mp-sis").addEventListener("change", filtrar);
    filtrar();
    $("mp-radio").addEventListener("change", encuadrar);
    let t; $("mp-cp").addEventListener("input", () => { clearTimeout(t); t = setTimeout(buscarCp, 350); });
    $("mp-gps").addEventListener("click", () => {
      if (!navigator.geolocation) { $("mp-donde").textContent = "Tu navegador no permite compartir la ubicación. Usa tu código postal."; return; }
      $("mp-donde").textContent = "Buscando tu ubicación…";
      navigator.geolocation.getCurrentPosition((p) => ponerCasa(p.coords.latitude, p.coords.longitude, "tu ubicación"),
        () => { $("mp-donde").textContent = "No pudimos obtener tu ubicación. Usa tu código postal."; }, { timeout: 10000, maximumAge: 600000 });
    });
    document.addEventListener("click", (ev) => { const b = ev.target.closest("[data-ver]"); if (b) ver(b.dataset.ver); });
    try { window.gtag && gtag("event", "mapa_carga"); } catch (e) {}
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); iniciar(); } }, { rootMargin: "300px" });
    io.observe(caja);
  } else iniciar();
})();

// ---------- Mapas pequeños (fichas y páginas de cada institución) ----------
(() => {
  const cajas = document.querySelectorAll(".mini-mapa");
  if (!cajas.length) return;
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const color = (l) => getComputedStyle(document.documentElement).getPropertyValue(`--${l === "sin" ? "verde" : l}`).trim() || "#0B7A60";
  let carga = null;
  const leaflet = () => carga ?? (carga = new Promise((ok, mal) => {
    if (window.L) return ok();
    const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "/vendor/leaflet/leaflet.css"; document.head.appendChild(css);
    const js = document.createElement("script"); js.src = "/vendor/leaflet/leaflet.js"; js.onload = ok; js.onerror = mal; document.head.appendChild(js);
  }));
  async function pintar(caja) {
    try { await leaflet(); } catch (e) { caja.innerHTML = '<p class="mp-cargando">No se pudo cargar el mapa.</p>'; return; }
    const L = window.L;
    const puntos = JSON.parse(caja.dataset.puntos);
    caja.innerHTML = "";
    const mapa = L.map(caja, { scrollWheelZoom: false, preferCanvas: puntos.length > 60 });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(mapa);
    if (matchMedia("(prefers-color-scheme: dark)").matches && document.documentElement.dataset.theme !== "light") caja.classList.add("mp-oscuro");
    const capas = [];
    for (const [la, lo, n, url, tipo, principal, linea] of puntos) {
      const c = L.circleMarker([la, lo], { radius: principal ? 11 : puntos.length > 60 ? 6 : 8, color: "#fff", weight: principal ? 3 : 2, fillColor: color(linea), fillOpacity: 1 })
        .bindPopup(`<div class="mp-pop"><small>${esc(tipo)}</small><b>${esc(n)}</b><span class="mp-pop-links">${principal ? "" : `<a href="${esc(url)}">Ver escuela</a>`}<a href="https://www.google.com/maps/dir/?api=1&destination=${la},${lo}" target="_blank" rel="noopener">Cómo llegar ↗</a></span></div>`, { maxWidth: 260 })
        .addTo(mapa);
      if (!principal) c.bindTooltip(esc(n), { direction: "top", offset: [0, -6] });
      capas.push(c);
    }
    const princ = puntos.find((p) => p[5]);
    if (princ) { mapa.fitBounds(L.latLngBounds(puntos.map((p) => [p[0], p[1]])), { padding: [28, 28], maxZoom: 15 }); capas[puntos.indexOf(princ)].bringToFront(); }
    else mapa.fitBounds(L.latLngBounds(puntos.map((p) => [p[0], p[1]])), { padding: [20, 20], maxZoom: 15 });
    mapa.on("focus", () => mapa.scrollWheelZoom.enable());
    mapa.on("blur", () => mapa.scrollWheelZoom.disable());
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { io.unobserve(x.target); pintar(x.target); } }), { rootMargin: "250px" });
    cajas.forEach((c) => io.observe(c));
  } else cajas.forEach(pintar);
})();

// ---------- Escuelas por zona ----------
(() => {
  const z = document.getElementById("zona");
  if (!z) return;
  z.addEventListener("change", () => document.querySelectorAll("[data-zona]").forEach((g) => { g.hidden = z.value && g.dataset.zona !== z.value; }));
})();

// ---------- Eventos de Analytics: uso de herramientas ----------
(() => {
  const ev = (n, p) => { try { window.gtag && gtag("event", n, p); } catch (e) {} };
  const sel = document.getElementById("consulta-escuela");
  sel?.addEventListener("change", () => ev("consulta_aciertos", { escuela: sel.value }));
  let t; document.getElementById("calc-aciertos")?.addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => ev("calculadora_uso", { aciertos: +e.target.value }), 1500); });
  document.querySelectorAll("[data-comp]").forEach((s) => s.addEventListener("change", () => ev("comparador_uso", { escuela: s.value })));
  document.getElementById("armar-agregar")?.addEventListener("click", () => ev("armar_opciones_agregar"));
  document.getElementById("armar-copiar")?.addEventListener("click", () => ev("armar_opciones_copiar"));
  let tc; document.getElementById("cm-form")?.addEventListener("change", () => { clearTimeout(tc); tc = setTimeout(() => ev("prepas_cerca_uso", { area: document.querySelector('input[name="cm-area"]:checked')?.value, estilo: document.querySelector('input[name="cm-estilo"]:checked')?.value }), 1500); });
  document.getElementById("cm-armar")?.addEventListener("click", () => ev("prepas_cerca_armar"));
  document.getElementById("cm-wa")?.addEventListener("click", () => ev("prepas_cerca_whatsapp"));
})();

// ---------- Contacto: copiar correo ----------
(() => {
  const b = document.getElementById("copiar-correo");
  if (!b) return;
  const aviso = document.getElementById("copiar-aviso");
  b.addEventListener("click", async () => {
    const c = document.getElementById("correo-contacto");
    try { await navigator.clipboard.writeText(c.textContent.trim()); aviso.textContent = "Correo copiado."; }
    catch (e) { const r = document.createRange(); r.selectNodeContents(c); getSelection().removeAllRanges(); getSelection().addRange(r); aviso.textContent = "Selecciona el correo y cópialo con Ctrl+C."; }
  });
})();

// ---------- Mini ruta: en el celular, centrar la parada actual ----------
(() => {
  const r = document.querySelector(".mini-ruta");
  const c = r?.querySelector("[aria-current]");
  if (!r || !c || r.scrollWidth <= r.clientWidth) return;
  r.scrollLeft = c.offsetLeft - r.clientWidth / 2 + c.offsetWidth / 2;
})();

// Compartir: copiar enlace, menú nativo del celular y medición en GA4.
(() => {
  const ev = (red, url) => { try { window.gtag && gtag("event", "share", { method: red, content_type: "pagina", item_id: location.pathname }); } catch (e) {} };
  document.querySelectorAll("[data-compartir]").forEach((caja) => {
    const nativo = caja.querySelector('[data-red="nativo"]');
    if (nativo && navigator.share) {
      nativo.hidden = false;
      nativo.addEventListener("click", () => {
        navigator.share({ title: document.title, text: caja.dataset.texto, url: caja.dataset.url }).then(() => ev("nativo")).catch(() => {});
      });
    }
    caja.querySelectorAll("a[data-red]").forEach((a) => a.addEventListener("click", () => ev(a.dataset.red)));
    const copiar = caja.querySelector("[data-copiar]");
    copiar?.addEventListener("click", async () => {
      const txt = copiar.querySelector("span");
      try {
        await navigator.clipboard.writeText(copiar.dataset.copiar);
      } catch (e) {
        const t = document.createElement("textarea");
        t.value = copiar.dataset.copiar; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (e2) {}
        t.remove();
      }
      ev("copiar");
      copiar.classList.add("ok"); txt.textContent = "¡Enlace copiado!";
      setTimeout(() => { copiar.classList.remove("ok"); txt.textContent = "Copiar enlace"; }, 2500);
    });
  });
})();

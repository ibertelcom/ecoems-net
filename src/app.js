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
  hamburguesa?.addEventListener("click", () => {
    const abrirlo = hamburguesa.getAttribute("aria-expanded") !== "true";
    hamburguesa.setAttribute("aria-expanded", String(abrirlo));
    hamburguesa.setAttribute("aria-label", abrirlo ? "Cerrar menú" : "Abrir menú");
    cajon.hidden = !abrirlo;
  });

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
})();

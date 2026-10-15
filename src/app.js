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

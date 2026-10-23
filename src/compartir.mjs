// Botones para compartir (WhatsApp, Facebook, copiar enlace y el menú del celular).
// Enlaces simples, sin scripts de terceros: no rastrean ni frenan la página.
import { SITIO } from "./plantilla.mjs";

// Páginas donde no tiene sentido compartir.
const SIN_COMPARTIR = new Set(["/contacto/", "/aviso-de-privacidad/", "/404.html"]);

// Mensaje propio para las páginas que más se comparten entre papás.
const TEXTOS = {
  "/": "Guía para papás sobre el examen ECOEMS y Mi Derecho, Mi Lugar, explicada paso a paso",
  "/aciertos/": "Cuántos aciertos pidió cada prepa, CCH y vocacional de la UNAM y el IPN en 2024, 2025 y 2026",
  "/calculadora/": "Calcula cuántos aciertos lleva tu hijo o hija en el ECOEMS y a qué escuelas le alcanza",
  "/prepas-cerca-de-mi/": "Pon tu código postal y ve las prepas más cercanas a tu casa: UNAM, IPN y sin examen",
  "/mapa/": "Mapa de las prepas UNAM, IPN y escuelas sin examen de la CDMX y el Edomex",
  "/escuelas/sin-examen/": "Las escuelas de bachillerato a las que se entra sin examen en la CDMX y el Edomex",
  "/comparador/": "Compara dos escuelas del ECOEMS: aciertos, ubicación y tipo de bachillerato",
  "/armar-opciones/": "Arma la lista de opciones para el registro de Mi Derecho, Mi Lugar sin errores",
};

const SVG = {
  wa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-3-.4-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.7 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3z"/></svg>',
  fb: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21.5v-8h2.7l.4-3.1h-3.1V8.4c0-.9.3-1.5 1.6-1.5h1.6V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.3H7.6v3.1h2.7v8z"/></svg>',
  enlace: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12"/></svg>',
};

const conUtm = (url, fuente) => `${url}?utm_source=${fuente}&utm_medium=social&utm_campaign=compartir`;

export function compartir(ruta, titulo) {
  if (SIN_COMPARTIR.has(ruta)) return "";
  const url = `${SITIO.dominio}${ruta}`;
  const texto = TEXTOS[ruta] ?? titulo.replace(/\s*\|\s*ecoems\.net\s*$/i, "");
  const wa = `https://wa.me/?text=${encodeURIComponent(`${texto} 👇\n${conUtm(url, "whatsapp")}`)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(conUtm(url, "facebook"))}`;
  const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return `
<section class="compartir" aria-label="Compartir esta página" data-compartir data-url="${attr(conUtm(url, "nativo"))}" data-texto="${attr(texto)}">
  <div class="contenedor">
    <p class="compartir-titulo"><b>¿Le sirve a otro papá o mamá?</b> Compártela en tu grupo.</p>
    <div class="compartir-botones">
      <a class="compartir-btn compartir-wa" href="${attr(wa)}" target="_blank" rel="noopener" data-red="whatsapp">${SVG.wa}<span>WhatsApp</span></a>
      <a class="compartir-btn compartir-fb" href="${attr(fb)}" target="_blank" rel="noopener" data-red="facebook">${SVG.fb}<span>Facebook</span></a>
      <button type="button" class="compartir-btn" data-red="copiar" data-copiar="${attr(conUtm(url, "enlace"))}">${SVG.enlace}<span>Copiar enlace</span></button>
      <button type="button" class="compartir-btn" data-red="nativo" hidden>${SVG.mas}<span>Más opciones</span></button>
    </div>
  </div>
</section>`;
}

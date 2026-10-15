// Iconos de trazo (24×24), dibujados para ecoems.net. Se usan inline con currentColor.
const P = {
  ruta: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19h6a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7h6"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M12 14h2M16 14h1M8 17h2M12 17h2"/>',
  registro: '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 3.5V5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3.5"/><path d="M9 11h6M9 15h4"/>',
  llave: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
  correo: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  examen: '<rect x="3" y="4" width="18" height="12.5" rx="2"/><path d="M8 20h8M12 16.5V20"/><path d="M8.5 10.5l2 2 4-4"/>',
  opciones: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11"/><circle cx="5" cy="18" r="1.4"/>',
  resultados: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  apoyo: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  escuela: '<path d="M3 10l9-5 9 5-9 5-9-5z"/><path d="M7 12.5V17c0 1.4 2.2 2.8 5 2.8s5-1.4 5-2.8v-4.5"/><path d="M21 10v5"/>',
  aciertos: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  mapa: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  calculadora: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h3.5"/>',
  comparar: '<path d="M7 4v16M17 4v16"/><path d="M3 8h8M13 16h8"/><path d="M4 12h6M14 12h6"/>',
  pregunta: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><path d="M12 17.2h.01"/>',
  buscar: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>',
  libro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20"/><path d="M8 7.5h8"/>',
  diagnostico: '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  externo: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  abajo: '<path d="M6 9l6 6 6-6"/>',
  aviso: '<path d="M12 3l9.5 17h-19L12 3z"/><path d="M12 10v4.5M12 17.3h.01"/>',
  sin_examen: '<path d="M4 12l5 5L20 6"/>',
  tepo: '<path d="M9 3c-1 2-1 5 0 7M15 3c1 2 1 5 0 7"/><circle cx="12" cy="14" r="6"/><path d="M10 13.5h.01M14 13.5h.01M11 16.5c.6.5 1.4.5 2 0"/>',
};

export function icono(nombre, clase = "ico") {
  const d = P[nombre];
  if (!d) throw new Error(`Icono desconocido: ${nombre}`);
  return `<svg class="${clase}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
}

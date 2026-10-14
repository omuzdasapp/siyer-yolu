// Ders haritası: dersin geçtiği yerleri sade bir harita üzerinde gösterir (konumlar yaklaşıktır).
import { LAND } from './map-land.js';
import { LANG } from './i18n.js';

const NS = 'http://www.w3.org/2000/svg';
const es = LANG === 'es';

// [enlem, boylam, Türkçe ad, İspanyolca ad]
const P = {
  mekke: [21.4225, 39.8262, 'Mekke', 'La Meca'],
  kabe: [21.4225, 39.8262, 'Kâbe (Mekke)', 'La Kaaba (La Meca)'],
  safa: [21.4224, 39.8274, 'Safa tepesi (Mekke)', 'Colina de Safa (La Meca)'],
  medine: [24.4672, 39.6112, 'Medine', 'Medina'],
  yesrib: [24.4672, 39.6112, 'Yesrib (Medine)', 'Yathrib (Medina)'],
  hendek: [24.4672, 39.6112, 'Medine (Hendek)', 'Medina (la Trinchera)'],
  taif: [21.2703, 40.4158, 'Taif', 'Táif'],
  kudus: [31.7781, 35.2354, 'Kudüs (Mescid-i Aksâ)', 'Jerusalén (al-Aqsa)'],
  kudusH: [31.7781, 35.2354, 'Kudüs (Herakleios)', 'Jerusalén (Heraclio)'],
  busra: [32.5186, 36.4815, 'Busra', 'Busra'],
  sam: [33.5138, 36.2765, 'Şam', 'Damasco (Sham)'],
  habes: [14.13, 38.72, 'Habeşistan (Aksum)', 'Abisinia (Aksum)'],
  hira: [21.4575, 39.8611, 'Hira (Nur Dağı)', 'Hira (Yabal an-Nur)'],
  sevr: [21.3774, 39.8497, 'Sevr mağarası', 'Cueva de Thawr'],
  arafat: [21.3549, 39.9841, 'Arafat', 'Arafat'],
  akabe: [21.4206, 39.8733, 'Akabe (Mina)', 'Aqaba (Mina)'],
  ebva: [23.0, 39.0, 'Ebvâ', 'Abwa'],
  kuba: [24.4393, 39.6172, 'Kuba', 'Quba'],
  uhud: [24.504, 39.6131, 'Uhud Dağı', 'Monte Uhud'],
  bedir: [23.78, 38.79, 'Bedir', 'Badr'],
  hudeybiye: [21.45, 39.64, 'Hudeybiye', 'Hudaybiya'],
  hayber: [25.696, 39.29, 'Hayber', 'Jaibar'],
  mute: [31.087, 35.697, 'Mûte', 'Mu\'ta'],
  huneyn: [21.52, 40.03, 'Huneyn', 'Hunain'],
  tebuk: [28.3838, 36.555, 'Tebük', 'Tabuk'],
  necran: [17.4917, 44.1322, 'Necran', 'Nayrán'],
  yemen: [15.3694, 44.191, 'Yemen (San\'a)', 'Yemen (Saná)'],
  kudeyd: [22.36, 39.33, 'Kudeyd (Ümmü Ma\'bed)', 'Qudaid (Umm Mabad)'],
  medain: [33.0936, 44.5808, 'Medâin (İran Kisrâsı)', 'Ctesifonte (Cosroes)'],
  iskenderiye: [31.2001, 29.9187, 'İskenderiye (Mukavkıs)', 'Alejandría (Muqauqis)'],
};

// Ders → yerler (ilki odak). route: yerleri sırayla birleştiren kesikli yol.
const L = {
  1: ['kabe'], 2: ['ebva', 'mekke', 'yesrib'], 21: { p: ['busra', 'mekke'], route: true }, 3: ['kabe'],
  4: { p: ['sam', 'mekke'], route: true }, 5: { p: ['hira', 'mekke'], local: true }, 6: ['mekke'], 22: ['safa'], 7: ['mekke'], 23: ['mekke'],
  8: { p: ['habes', 'mekke'], route: true }, 24: ['kabe'], 9: { p: ['taif', 'mekke'], route: true, local: true },
  10: { p: ['kudus', 'mekke'], route: true }, 11: ['akabe', 'mekke', 'yesrib'],
  12: { p: ['mekke', 'sevr', 'kuba', 'medine'], route: true, focus: 'sevr' },
  25: { p: ['sevr', 'kudeyd', 'medine'], route: true, focus: 'kudeyd' }, 26: { p: ['kuba', 'medine'], route: true, focus: 'medine', local: true },
  13: ['medine'], 27: ['medine'], 28: ['medine'], 31: ['medine'], 29: ['medine', 'kudus', 'mekke'], 30: ['medine', 'bedir'],
  14: ['bedir', 'medine', 'mekke'], 32: ['medine'], 15: { p: ['uhud', 'medine'], local: true }, 16: ['hendek'],
  17: { p: ['medine', 'hudeybiye', 'mekke'], route: true, focus: 'hudeybiye' },
  33: ['medine', 'kudusH', 'medain', 'iskenderiye', 'habes'], 34: { p: ['medine', 'hayber'], route: true, focus: 'hayber' },
  35: { p: ['medine', 'mekke'], route: true, focus: 'mekke' }, 36: { p: ['medine', 'mute'], route: true, focus: 'mute' },
  18: { p: ['medine', 'mekke'], route: true, focus: 'mekke' }, 37: { p: ['huneyn', 'taif', 'mekke'], local: true },
  38: { p: ['medine', 'tebuk'], route: true, focus: 'tebuk' }, 39: ['medine', 'necran', 'yemen'],
  19: ['arafat', 'mekke', 'medine'], 20: ['medine'], 40: ['medine', 'mekke'],
};

const SEAS = [
  [20.3, 38.6, 'Kızıldeniz', 'Mar Rojo'], [33.6, 32.4, 'Akdeniz', 'Mediterráneo'],
  [27.2, 50.6, 'Basra Körfezi', 'Golfo Pérsico'], [23.0, 43.5, 'Arabistan', 'Arabia'], [12.6, 44.5, 'Aden Körfezi', 'Golfo de Adén'],
];

const W = 340; const H = 220;
const el = (tag, attrs = {}, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };
const LANDS = LAND.map((s) => s.split(' ').map((p) => p.split(',').map(Number)));

export const hasMap = (n) => Boolean(L[n]);

/** Dersin haritasını SVG olarak döndürür. */
export function lessonMap(n) {
  const def = Array.isArray(L[n]) ? { p: L[n] } : L[n];
  if (!def) return null;
  const pts = def.p.map((k) => ({ k, lat: P[k][0], lon: P[k][1], name: P[k][es ? 3 : 2] }));
  const focus = def.focus || def.p[0];
  // Görünüm: yerleri kapsayan, en az 0,35° genişliğinde bir pencere
  const lats = pts.map((p) => p.lat); const lons = pts.map((p) => p.lon);
  const cy = (Math.min(...lats) + Math.max(...lats)) / 2; const cx = (Math.min(...lons) + Math.max(...lons)) / 2;
  const kx = Math.cos((cy * Math.PI) / 180);
  let sw = (Math.max(...lons) - Math.min(...lons)) * kx; let sh = Math.max(...lats) - Math.min(...lats);
  const min = def.local ? 0.35 : 3.2;
  sw = Math.max(sw, min); sh = Math.max(sh, min * H / W);
  const scale = Math.min(W / (sw * 1.7), H / (sh * 1.6)); // kenar payı
  const X = (lon) => W / 2 + (lon - cx) * kx * scale;
  const Y = (lat) => H / 2 - (lat - cy) * scale;
  const big = W / scale > 4; // geniş görünüm: deniz adları

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'map', role: 'img', 'aria-label': pts.map((p) => p.name).join(', ') });
  svg.append(el('rect', { x: 0, y: 0, width: W, height: H, class: 'map-sea' }));
  const d = LANDS.map((r) => `M${r.map(([lon, lat]) => `${X(lon).toFixed(1)},${Y(lat).toFixed(1)}`).join('L')}Z`).join('');
  svg.append(el('path', { d, class: 'map-land' }));
  if (def.route) {
    const line = pts.map((p) => `${X(p.lon).toFixed(1)},${Y(p.lat).toFixed(1)}`).join(' ');
    svg.append(el('polyline', { points: line, class: 'map-route' }));
  }
  // Aynı noktaya düşenleri birleştir (örn. Medine/Kuba çok yakınsa)
  const placed = [];
  for (const p of pts) {
    const x = X(p.lon); const y = Y(p.lat);
    const near = placed.find((q) => Math.hypot(q.x - x, q.y - y) < 6);
    if (near) { near.names.push(p.name); near.focus ||= p.k === focus; continue; }
    placed.push({ x, y, names: [p.name], focus: p.k === focus });
  }
  // Etiket yerleşimi: sağa; taşarsa sola; üst üste binerse dikey kaydır
  const boxes = [];
  for (const q of placed.sort((a, b) => b.focus - a.focus)) {
    const label = q.names.join(' · ');
    const w = label.length * 5.6 + 6;
    let right = q.x + 8 + w < W - 4;
    let ly = q.y + 4;
    const hit = () => boxes.some((b) => !(b.x1 < (right ? q.x + 7 : q.x - 7 - w) || b.x0 > (right ? q.x + 7 + w : q.x - 7) || Math.abs(b.y - ly) > 11));
    if (hit()) right = !right;
    for (let k = 0; k < 4 && hit(); k++) ly += (k % 2 ? -1 : 1) * 12 * (k + 1);
    boxes.push({ x0: right ? q.x + 7 : q.x - 7 - w, x1: right ? q.x + 7 + w : q.x - 7, y: ly });
    svg.append(el('circle', { cx: q.x, cy: q.y, r: q.focus ? 6 : 4, class: q.focus ? 'map-dot focus' : 'map-dot' }));
    if (q.focus) svg.append(el('circle', { cx: q.x, cy: q.y, r: 11, class: 'map-pulse' }));
    svg.append(el('text', { x: right ? q.x + 9 : q.x - 9, y: ly, 'text-anchor': right ? 'start' : 'end', class: q.focus ? 'map-label focus' : 'map-label' }, label));
  }
  // Bağlam: derste geçmeyen büyük şehirler soluk gösterilir
  for (const k of ['mekke', 'medine', 'taif']) {
    if (def.p.some((x) => P[x][0] === P[k][0] && P[x][1] === P[k][1])) continue;
    const x = X(P[k][1]); const y = Y(P[k][0]);
    if (x < 10 || x > W - 10 || y < 10 || y > H - 10) continue;
    if (placed.some((q) => Math.hypot(q.x - x, q.y - y) < 14)) continue;
    const w = P[k][es ? 3 : 2].length * 5 + 6;
    const right = x + 8 + w < W - 4;
    if (boxes.some((b) => !(b.x1 < (right ? x + 6 : x - 6 - w) || b.x0 > (right ? x + 6 + w : x - 6) || Math.abs(b.y - (y + 4)) > 11))) continue;
    boxes.push({ x0: right ? x + 6 : x - 6 - w, x1: right ? x + 6 + w : x - 6, y: y + 4 });
    svg.append(el('circle', { cx: x, cy: y, r: 2.5, class: 'map-ctx' }));
    svg.append(el('text', { x: right ? x + 6 : x - 6, y: y + 3.5, 'text-anchor': right ? 'start' : 'end', class: 'map-ctx-label' }, P[k][es ? 3 : 2]));
  }
  if (big) {
    for (const [lat, lon, tr, esn] of SEAS) {
      const x = X(lon); const y = Y(lat); const w = (es ? esn : tr).length * 5.2;
      if (x < 30 || x > W - 30 || y < 14 || y > H - 8) continue;
      if (boxes.some((b) => !(b.x1 < x - w / 2 || b.x0 > x + w / 2) && Math.abs(b.y - y) < 12)) continue;
      if (placed.some((q) => Math.abs(q.x - x) < w / 2 + 4 && Math.abs(q.y - y + 3) < 9)) continue;
      svg.insertBefore(el('text', { x, y, class: 'map-sea-label', 'text-anchor': 'middle' }, es ? esn : tr), svg.querySelector('.map-route, .map-dot'));
    }
  }
  return svg;
}

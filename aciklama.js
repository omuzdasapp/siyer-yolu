// Soru açıklamaları: yalnızca seçili dilin dosyası yüklenir. Dosya yoksa açıklama gösterilmez.
// Türkçe dışındaki dosyalar yalnızca açıklama metnini içerir; kaynak künyeleri aciklama-tr.js'den alınıp
// o dilin yazımına çevrilir.
import { LANG } from './i18n.js';
import { EX as TR, WHY as TR_WHY } from './aciklama-tr.js';
import { localizeSrc } from './kaynak.js';

let ex = {}, why = '';
if (LANG === 'tr') { ex = TR; why = TR_WHY; }
else {
  try {
    const m = await import(`./aciklama-${LANG}.js`);
    why = m.WHY;
    for (const id of Object.keys(m.EX)) ex[id] = [m.EX[id], TR[id] ? localizeSrc(TR[id][1], LANG) : ''];
  } catch { /* açıklama yok */ }
}
export const EX = ex;
export const WHY = why;

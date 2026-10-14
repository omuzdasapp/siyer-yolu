// Günün hikâyesi: seçili dildeki metinler (yalnızca o dilin dosyası yüklenir).
import { LANG } from './i18n.js';
import { HIKAYE_TR, WHO_TR, HIKAYE_SRC_TR } from './hikaye.js';

let list = HIKAYE_TR, who = WHO_TR, src = HIKAYE_SRC_TR;
if (LANG !== 'tr') {
  try {
    const U = LANG.toUpperCase();
    const m = await import(`./hikaye-${LANG}.js`);
    list = HIKAYE_TR.map((b, k) => ({ ...b, t: m[`HIKAYE_${U}`][k][0], x: m[`HIKAYE_${U}`][k][1], h: m[`HIKAYE_${U}`][k][2] }));
    who = m[`WHO_${U}`]; src = m[`SRC_${U}`];
  } catch { /* çeviri yüklenemezse Türkçe kalır */ }
}
export const HIKAYE = list;
export const WHO = who;
export const HIKAYE_SRC = src;

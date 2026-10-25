// Keşfet bölümü: arayüz metinleri, sahabe ve şemâil içerikleri (seçili dilde), zaman çizelgesi yardımcıları.
import { LANG } from './i18n.js';
import { SAHABE_TR } from './sahabe.js';
import { SEMAIL_TR } from './semail.js';
import { localizeSrc } from './kaynak.js';

const UI = {
  tr: {
    tab: 'Keşfet', title: 'Siyeri keşfet', lead: 'Yolun dışında da okuyabileceğin bölümler.',
    tlTitle: 'Zaman çizelgesi', tlLead: '571\'den 632\'ye, Peygamberimizin hayatı yıl yıl.', tlStat: (n) => `63 yıl · ${n} durak · 3 dönem`,
    all: 'Tümü', age: 'Yaşı', toLesson: 'Derse git', locked: 'Bu ders yolda sırası gelince açılır.', done: 'Tamamlandı',
    sbTitle: 'Sahabe portreleri', sbLead: 'Peygamberimizin yakın dostlarından on iki hayat.',
    smTitle: 'Onun ahlakı', smLead: 'Şemâil: görünüşü, günlük hayatı ve ahlakı.',
    stLead: 'Tasavvuf büyüklerinden kısa ve kaynaklı hikâyeler.',
    facts: 'Kısaca', src: 'Kaynak', next: 'Sonraki →', prev: '← Önceki', of: (a, b) => `${a}/${b}`,
    approx: 'Yaşlar kamerî takvime göre yaklaşıktır.',
  },
  es: {
    tab: 'Explorar', title: 'Explora la sira', lead: 'Secciones que puedes leer fuera del camino.',
    tlTitle: 'Línea del tiempo', tlLead: 'De 571 a 632: la vida del Profeta año a año.', tlStat: (n) => `63 años · ${n} etapas · 3 periodos`,
    all: 'Todo', age: 'Edad', toLesson: 'Ir a la lección', locked: 'Esta lección se abre cuando llegues a ella en el camino.', done: 'Completada',
    sbTitle: 'Retratos de compañeros', sbLead: 'Doce vidas de los compañeros cercanos del Profeta.',
    smTitle: 'Su carácter', smLead: 'Shamáil: su aspecto, su vida diaria y su carácter.',
    stLead: 'Relatos breves y con fuentes de los grandes sufíes.',
    facts: 'En breve', src: 'Fuente', next: 'Siguiente →', prev: '← Anterior', of: (a, b) => `${a}/${b}`,
    approx: 'Las edades son aproximadas según el calendario lunar.',
  },
  en: {
    tab: 'Explore', title: 'Explore the Sirah', lead: 'Sections you can read outside the path.',
    tlTitle: 'Timeline', tlLead: 'From 571 to 632: the Prophet\'s life year by year.', tlStat: (n) => `63 years · ${n} stops · 3 periods`,
    all: 'All', age: 'Age', toLesson: 'Go to lesson', locked: 'This lesson opens when you reach it on the path.', done: 'Completed',
    sbTitle: 'Companion portraits', sbLead: 'Twelve lives from the Prophet\'s close companions.',
    smTitle: 'His character', smLead: 'Shama\'il: his appearance, daily life and character.',
    stLead: 'Short, sourced stories from the great Sufis.',
    facts: 'In brief', src: 'Source', next: 'Next →', prev: '← Previous', of: (a, b) => `${a}/${b}`,
    approx: 'Ages are approximate, by the lunar calendar.',
  },
  de: {
    tab: 'Entdecken', title: 'Die Sira entdecken', lead: 'Bereiche, die du auch abseits des Weges lesen kannst.',
    tlTitle: 'Zeitleiste', tlLead: 'Von 571 bis 632: das Leben des Propheten Jahr für Jahr.', tlStat: (n) => `63 Jahre · ${n} Stationen · 3 Abschnitte`,
    all: 'Alle', age: 'Alter', toLesson: 'Zur Lektion', locked: 'Diese Lektion öffnet sich, wenn du sie auf dem Weg erreichst.', done: 'Abgeschlossen',
    sbTitle: 'Gefährtenporträts', sbLead: 'Zwölf Lebenswege enger Gefährten des Propheten.',
    smTitle: 'Sein Charakter', smLead: 'Schamail: sein Aussehen, sein Alltag und sein Charakter.',
    stLead: 'Kurze Geschichten großer Sufis mit Quellenangabe.',
    facts: 'Kurz gesagt', src: 'Quelle', next: 'Weiter →', prev: '← Zurück', of: (a, b) => `${a}/${b}`,
    approx: 'Altersangaben sind ungefähr, nach dem Mondkalender.',
  },
  ru: {
    tab: 'Обзор', title: 'Открой для себя сиру', lead: 'Разделы, которые можно читать вне пути.',
    tlTitle: 'Хронология', tlLead: 'С 571 по 632 год: жизнь Пророка год за годом.', tlStat: (n) => `63 года · ${n} остановок · 3 периода`,
    all: 'Все', age: 'Возраст', toLesson: 'К уроку', locked: 'Этот урок откроется, когда вы дойдёте до него на пути.', done: 'Пройдено',
    sbTitle: 'Портреты сподвижников', sbLead: 'Двенадцать жизней близких сподвижников Пророка.',
    smTitle: 'Его нрав', smLead: 'Шамаиль: облик, повседневная жизнь и нрав.',
    stLead: 'Короткие истории великих суфиев с указанием источников.',
    facts: 'Коротко', src: 'Источник', next: 'Далее →', prev: '← Назад', of: (a, b) => `${a}/${b}`,
    approx: 'Возраст указан приблизительно, по лунному календарю.',
  },
};
export const KU = UI[LANG] || UI.tr;

// Peygamberimizin yaklaşık yaşı (kamerî takvim). Hicret 53 yaş kabul edilir; Medine olayları 53 + hicrî yıl.
export const AGE = {
  1: '0', 2: '0–24', 21: '9–12', 3: '20–35', 4: '25', 5: '40', 6: '40–43', 22: '43', 7: '43–45', 23: '44', 8: '45', 24: '46',
  9: '46–50', 10: '51', 11: '51–53', 12: '53', 25: '53', 26: '53', 13: '53', 27: '53', 28: '54', 31: '53–63', 29: '54', 30: '55',
  14: '55', 32: '55', 15: '56', 16: '58', 17: '59', 33: '59', 34: '60', 35: '60', 36: '61', 18: '61', 37: '61', 38: '62', 39: '62',
  19: '63', 20: '63',
};

let sb = SAHABE_TR.map((x) => ({ ...x }));
let sm = SEMAIL_TR.map((x) => ({ ...x }));
if (LANG !== 'tr') {
  try {
    const m = await import(`./kesfet-${LANG}.js`);
    sb = SAHABE_TR.map((x, k) => ({ ...x, n: m.SAHABE[k][0], s: m.SAHABE[k][1], x: m.SAHABE[k][2], f: m.SAHABE[k][3], src: localizeSrc(x.src, LANG) }));
    sm = SEMAIL_TR.map((x, k) => ({ ...x, n: m.SEMAIL[k][0], x: m.SEMAIL[k][1], q: m.SEMAIL[k][2], src: localizeSrc(x.src, LANG) }));
  } catch { /* çeviri yoksa Türkçe kalır */ }
}
export const SAHABE = sb;
export const SEMAIL = sm;

/** Ders metninin ilk cümlesi (zaman çizelgesindeki kısa özet için). */
export const firstSentence = (s) => {
  // Cümle sonu: nokta/ünlem/soru + boşluk + büyük harf ya da tırnak. "b.", "Hz." gibi kısaltmalarda bölünmez.
  const re = /[.!?](?=\s+[A-ZÇĞİÖŞÜÂÎÛА-ЯЁ"«„“(])/gu;
  let m, cut = s.length;
  while ((m = re.exec(s))) {
    const word = s.slice(0, m.index).split(/\s/).pop();
    if (word.replace(/[^\p{L}]/gu, '').length <= 2) continue;
    cut = m.index + 1; break;
  }
  const out = s.slice(0, cut).trim();
  return out.length > 170 ? out.slice(0, 167).replace(/\s+\S*$/, '') + '…' : out;
};

/** Düz tırnakları dile uygun tırnaklara çevirir. */
export const curly = (s, lang) => s.replace(/"([^"]*)"/g, lang === 'de' ? '„$1“' : lang === 'ru' || lang === 'es' ? '«$1»' : '“$1”');

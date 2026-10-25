// Kaynak künyelerini (Türkçe yazım) seçili dilin yazımına çevirir. Açıklamalar, sahabe ve şemâil bölümleri kullanır.
// Künyelerdeki Türkçe yazımları diğer dillere çevirir.
const BASE = [
  ['Kur\'an', { es: 'Corán', en: 'Qur\'an', de: 'Koran', ru: 'Коран' }],
  ['Buhârî', { es: 'Al-Bujari', en: 'al-Bukhari', de: 'al-Buchari', ru: 'аль-Бухари' }],
  ['Müslim', { es: 'Muslim', en: 'Muslim', de: 'Muslim', ru: 'Муслим' }],
  ['Tirmizî', { es: 'At-Tirmidhi', en: 'al-Tirmidhi', de: 'at-Tirmidhi', ru: 'ат-Тирмизи' }],
  ['Ebû Dâvûd', { es: 'Abu Dawud', en: 'Abu Dawud', de: 'Abu Dawud', ru: 'Абу Дауд' }],
  ['Ahmed b. Hanbel, Müsned', { es: 'Ahmad ibn Hanbal, Musnad', en: 'Ahmad ibn Hanbal, Musnad', de: 'Ahmad ibn Hanbal, Musnad', ru: 'Ахмад ибн Ханбаль, «Муснад»' }],
  ['İbn Hişâm', { es: 'Ibn Hisham', en: 'Ibn Hisham', de: 'Ibn Hischam', ru: 'Ибн Хишам' }],
  ['İbn Sa\'d', { es: 'Ibn Saad', en: 'Ibn Sa\'d', de: 'Ibn Sa\'d', ru: 'Ибн Саад' }],
  ['İbnü\'l-Esîr, Üsdü\'l-gàbe', { es: 'Ibn al-Athir, Usd al-ghaba', en: 'Ibn al-Athir, Usd al-ghaba', de: 'Ibn al-Athir, Usd al-ghaba', ru: 'Ибн аль-Асир, «Усд аль-габа»' }],
  ['Hâkim, el-Müstedrek', { es: 'Al-Hakim, al-Mustadrak', en: 'al-Hakim, al-Mustadrak', de: 'al-Hakim, al-Mustadrak', ru: 'аль-Хаким, «аль-Мустадрак»' }],
  ['Taberî, Câmiu\'l-beyân', { es: 'At-Tabari, Tafsir', en: 'al-Tabari, Tafsir', de: 'at-Tabari, Tafsir', ru: 'ат-Табари, «Тафсир»' }],
  ['Taberî, Târîh', { es: 'At-Tabari, Tarij', en: 'al-Tabari, Tarikh', de: 'at-Tabari, Tarich', ru: 'ат-Табари, «Тарих»' }],
  ['Taberânî', { es: 'At-Tabarani', en: 'al-Tabarani', de: 'at-Tabarani', ru: 'ат-Табарани' }],
  ['Hamîdullah, el-Vesâiku\'s-siyâsiyye', { es: 'Hamidullah, al-Wazaiq as-siyasiyya', en: 'Hamidullah, al-Watha\'iq al-siyasiyya', de: 'Hamidullah, al-Wathaiq as-siyasiyya', ru: 'Хамидуллах, «аль-Васаик ас-сиясия»' }],
  ['Hamîdullah, İslâm Peygamberi', { es: 'Hamidullah, El Profeta del islam', en: 'Hamidullah, The Prophet of Islam', de: 'Hamidullah, Der Prophet des Islam', ru: 'Хамидуллах, «Пророк ислама»' }],
  ['DİA', { es: 'Enciclopedia del Islam TDV', en: 'TDV Encyclopedia of Islam', de: 'TDV-Enzyklopädie des Islam', ru: 'Энциклопедия ислама TDV' }],
  ['vesika metni', { es: 'texto del documento', en: 'text of the document', de: 'Urkundentext', ru: 'текст документа' }],
  ['Ümmü Seleme rivayeti', { es: 'relato de Umm Salama', en: 'narrated by Umm Salama', de: 'Bericht Umm Salamas', ru: 'со слов Умм Салямы' }],
  ['Zührî\'nin değerlendirmesi', { es: 'valoración de az-Zuhri', en: 'assessment of al-Zuhri', de: 'Urteil az-Zuhris', ru: 'оценка аз-Зухри' }],
];

// Sure ve hadis kitabı (bölüm) adları: Latin harfli dillerde ve Rusçada aynı yaygın transliterasyon kullanılır.
const NAMES = [
  ['Menâkıbü\'l-ensâr', 'Manaqib al-Ansar'], ['Fezâilü\'s-sahâbe', 'Fada\'il al-Sahaba'], ['Bed\'ü\'l-vahy', 'Bad\' al-Wahy'],
  ['Bed\'ü\'l-halk', 'Bad\' al-Khalq'], ['Megàzî', 'Maghazi'], ['Menâkıb', 'Manaqib'], ['Fezâil', 'Fada\'il'], ['Tefsîr', 'Tafsir'],
  ['İcâre', 'Ijara'], ['Îmân', 'Iman'], ['Salât', 'Salat'], ['Rikàk', 'Riqaq'], ['İlim', 'Ilm'], ['Ezân', 'Adhan'], ['Zekât', 'Zakat'],
  ['Nafakât', 'Nafaqat'], ['Cihâd', 'Jihad'], ['Libâs', 'Libas'], ['Müzâraa', 'Muzara\'a'], ['Hac', 'Hajj'], ['Edeb', 'Adab'],
  ['Büyû\'', 'Buyu\''], ['Şurût', 'Shurut'], ['Farâiz', 'Fara\'id'], ['Cenâiz', 'Jana\'iz'], ['Selâm', 'Salam'], ['İsti\'zân', 'Isti\'dhan'],
  ['Müsâfirîn', 'Musafirin'], ['Nikâh', 'Nikah'], ['eş-Şemâil', 'al-Shama\'il'], ['Daavât', 'Da\'awat'], ['Et\'ime', 'At\'ima'],
  ['Müsâkàt', 'Musaqat'], ['Teheccüd', 'Tahajjud'], ['Talâk', 'Talaq'],
  ['Âl-i İmrân', 'Al Imran'], ['Ahzâb', 'al-Ahzab'], ['Alak', 'al-Alaq'], ['Bakara', 'al-Baqara'], ['Fetih', 'al-Fath'], ['Fil', 'al-Fil'],
  ['Fussilet', 'Fussilat'], ['Haşr', 'al-Hashr'], ['Kalem', 'al-Qalam'], ['Kâfirûn', 'al-Kafirun'], ['Mesed', 'al-Masad'], ['Nasr', 'an-Nasr'],
  ['Tevbe', 'at-Tawba'], ['Yûsuf', 'Yusuf'], ['İsrâ', 'al-Isra'], ['Şuarâ', 'ash-Shu\'ara'],
];
// Yalnızca "Kitap, Bölüm" ve "Kur'an, Sure" kalıplarındaki adlar çevrilir (DİA madde başlıkları Türkçe kalır).
const names = (s) => s.split('; ').map((part) => {
  if (/^(Kur'an|Buhârî|Müslim|Tirmizî|Ebû Dâvûd), /.test(part)) {
    const [book, rest] = [part.slice(0, part.indexOf(', ')), part.slice(part.indexOf(', ') + 2)];
    const hit = NAMES.find(([k]) => rest === k || rest.startsWith(k + ' '));
    return hit ? `${book}, ${hit[1]}${rest.slice(hit[0].length)}` : part;
  }
  return part;
}).join('; ');
export const localizeSrc = (s, l) => BASE.reduce((acc, [k, v]) => acc.split(k).join(v[l] || k), names(s));


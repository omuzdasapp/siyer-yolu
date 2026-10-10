// Dil seçimi ve arayüz metinleri (Türkçe / Español).
// Dil: önce kullanıcının seçtiği, yoksa cihaz dili (es* → İspanyolca), yoksa Türkçe.
const KEY = 'siyer-yolu-dil';
const saved = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
const device = (navigator.languages?.[0] || navigator.language || 'tr').toLowerCase();
export const LANG = saved === 'es' || saved === 'tr' ? saved : (device.startsWith('es') ? 'es' : 'tr');
document.documentElement.lang = LANG;

export function setLang(l) {
  try { localStorage.setItem(KEY, l); } catch { /* özel pencere */ }
  location.reload();
}

const S = {
  tr: {
    back: 'Geri', settings: 'Ayarlar', dailyStreak: 'Günlük seri',
    tabLessons: 'Dersler', tabRace: 'Yarış', tabBadges: 'Rozetler',
    onbLead: 'Günde 5 dakikada Peygamberimizin (s.a.v.) hayatı. Her gün bir ders, üç soru ve dilersen canlı bir yarış.',
    onbWho: 'Kimin için kullanacaksın?', onbSelf: 'Kendim için', onbKid: 'Çocuğumla birlikte',
    onbKidNote: 'Çocuk modunda metinler sadeleşir, sesli okunur ve yalnızca bot ile yarışılır.',
    todayDone: 'Bugünün hedefi tamam', todayLesson: 'Bugünün dersi', allDone: 'Bütün yolu tamamladın 🤍',
    allDoneNote: 'Dersleri tekrar edebilir ya da yarışabilirsin.', oneMore: 'Bir ders daha', start5: 'Başla · 5 dk',
    streakNote: (n, done) => `🔥 ${n} günlük seri. ${done ? 'Yarın görüşmek üzere!' : 'Bugün de ders yap, seri bozulmasın.'}`,
    nCorrect: (n) => `${n} doğru`, path: 'Yol',
    listen: '🔊 Dinle', stopListen: '■ Durdur', toQuiz: 'Teste geç · 3 soru',
    qOf: (i, n) => `Soru ${i}/${n}`, seeResult: 'Sonucu gör', nextQ: 'Sonraki soru',
    right: 'Doğru! 🌿', rightIs: (x) => `Doğrusu: ${x}`, listenQ: '🔊 Soruyu dinle',
    retryLead: 'Dersi bir kez daha okuyup tekrar deneyelim. Acele yok.', reread: 'Dersi tekrar oku', retryQuiz: 'Testi tekrar çöz',
    perfect: 'Tam isabet!', good: 'Güzel!', scoreLine: (c, t) => `${c}/3 doğru · ${t}`, streakPill: (n) => `🔥 ${n} günlük seri`,
    newBadge: 'Yeni rozet', nextLesson: (t) => `Sıradaki: ${t}`, shareStreak: '📤 Serini paylaş', homeLink: 'Ana sayfa',
    raceTitle: 'Siyer Yarışı', raceIntro: '5 soru, her biri 12 saniye. Doğru ve hızlı cevap daha çok puan getirir.',
    you: 'Sen', botRace: '🤖 Bot ile yarış', kidRaceNote: 'Çocuk modunda canlı yarış kapalıdır; yalnızca bot ile oynanır. Ayarlardan değiştirebilirsin.',
    boardLoading: 'Sıralama yükleniyor…', boardSoon: 'Canlı yarış açılınca sıralama burada görünecek.',
    points: (n) => `Puan ${n}`, wins: (n) => `${n} galibiyet`, boardEmpty: 'Henüz kimse yarışmadı. İlk sen ol!',
    boardErr: 'Sıralama şu an yüklenemedi.', findLive: '⚡ Canlı rakip bul', liveSoon: 'Canlı eşleşme çok yakında açılıyor. Şimdilik bot ile antrenman yapabilirsin.',
    botTrain: '🤖 Bot ile antrenman', boardTitle: 'Sıralama · ilk 20',
    nickPh: 'örn. Medine_Yolcusu', save: 'Kaydet', nickTitle: 'Takma ad', nickQ: 'Rakiplerin seni nasıl görsün?',
    nickNote: '3-16 harf ya da rakam. Gerçek adını yazmana gerek yok; e-posta veya telefon istemiyoruz.',
    sec: (n) => `${n} sn`, playBot: '🤖 Beklemeden bot ile oyna', searching: 'Rakip aranıyor', searchingDots: 'Rakip aranıyor…',
    searchNote: 'Arkadaşına da uygulamayı açıp "Canlı rakip bul"a basmasını söylersen birbirinizle eşleşirsiniz.',
    opp: 'Rakip', oppAnswered: 'Rakip cevapladı', connecting: 'Bağlanıyor…', exit: 'Çık',
    exitConfirm: 'Yarıştan çıkılsın mı? Kalan soruların puanı 0 sayılır.', training: 'Antrenman', liveRace: 'Canlı yarış',
    slow: 'Bağlantı yavaş…', timeUp: 'Süre doldu.', rightPts: (p) => `Doğru! +${p}`, wrong: 'Yanlış',
    youPts: (p) => `Sen +${p}`, youX: 'Sen ✗', youNone: 'Sen cevap vermedin', oppPts: (p) => `Rakip +${p}`, oppX: 'Rakip ✗', oppNone: 'Rakip cevap vermedi',
    startsIn: (n) => `Başlıyor: ${n}`, matchedWith: (n) => `${n} ile eşleştin`, isBot: 'Bu bir bilgisayar rakiptir.',
    done: 'Bitti', nextComing: 'Sıradaki soru geliyor…', results: 'Sonuçlar…',
    won: 'Kazandın!', lost: 'Bu sefer rakip kazandı', draw: 'Berabere', ratingDelta: (d) => `Puanın ${d >= 0 ? '+' : ''}${d}`,
    loseNote: 'Kaybetmek de öğrenmektir. Dersleri tekrar edip yeniden dene.', playAgain: 'Tekrar oyna', newOpp: 'Yeni rakip bul',
    shareResult: '📤 Sonucu paylaş', me: 'Ben', racePage: 'Yarış sayfası',
    statStreak: 'günlük seri', statLessons: 'ders', statWins: 'galibiyet', shareProgress: '📤 İlerlemeni paylaş',
    mode: 'Mod', kidToAdult: 'Çocuk modu → Yetişkin', adultToKid: 'Yetişkin → Çocuk modu',
    sound: 'Ses ve sesli okuma', on: 'Açık', off: 'Kapalı', nickname: 'Takma ad', choose: 'Seç', language: 'Dil · Idioma',
    sourcesLink: '📚 Kaynaklar ve içerik hakkında', privacy: '🔒 Gizlilik politikası', privacyHref: 'gizlilik.html',
    resetLink: '↺ İlerlemeyi sıfırla', resetConfirm: 'Ders ilerlemen, serin ve rozetlerin bu cihazdan silinsin mi?', resetDone: 'İlerleme sıfırlandı.',
    deleteConfirm: 'Takma adın, yarış puanın ve yarış geçmişin sunucudan kalıcı olarak silinsin mi?', deleteDone: 'Yarış hesabın silindi.', deleteLink: '🗑 Yarış hesabımı sil',
    footer: (v) => `Siyer Yolu ${v} · Bir Saadet Evreni projesi`,
    sources: 'Kaynaklar',
    src1: 'Dersler, siyer alanında yaygın kabul gören bilgilerden kısa ve sade bir dille derlenmiştir. Tarihler miladi yıl olarak ve yaklaşık verilmiştir; bazı ayrıntılarda kaynaklar arasında farklı rivayetler bulunabilir.',
    src2: 'Uygulamada Peygamberimizin, ehl-i beytin ve sahabenin resmi ya da tasviri bilerek yer almaz.',
    srcMain: 'Başlıca kaynaklar', srcMail: 'Bir hata ya da eksik görürsen lütfen bize yaz: ', mailSubject: 'Siyer%20Yolu%20d%C3%BCzeltme',
    gateTitle: 'Ebeveyn onayı', gateAns: 'Cevap', gateTry: 'Olmadı, tekrar dene.', gateAsk: 'Bu ayarı değiştirmek için bir yetişkin şu soruyu cevaplasın:',
    gateQ: (a, b) => `${['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'][a]} artı ${['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'][b]} kaç eder?`,
    confirm: 'Onayla',
    // Paylaşım görseli
    tagline: 'Günde 5 dakikada siyer', shareStreakWord: 'günlük seri 🔥', shareLessons: (n) => `${n} ders tamamlandı`,
    shareWin: 'Kazandım! 🏆', shareDraw: 'Berabere 🤝', shareLose: 'Rövanş zamanı!', join: 'Sen de katıl',
    shareStreakText: (n, url) => `Siyer Yolu'nda ${n} günlük serim var! 🔥 ${url}`, shareRaceText: (a, b, url) => `Siyer Yolu siyer yarışında ${a}–${b}! ⚡ ${url}`,
    downloaded: 'Görsel indirildi. Instagram hikâyende paylaşabilirsin.', shareFail: 'Paylaşım açılamadı.',
    // Ağ
    netErr: 'Bağlantı hatası', serverErr: 'Sunucuya ulaşılamadı.', liveOff: 'Canlı yarış henüz açılmadı.',
  },
  es: {
    back: 'Atrás', settings: 'Ajustes', dailyStreak: 'Racha diaria',
    tabLessons: 'Lecciones', tabRace: 'Competir', tabBadges: 'Insignias',
    onbLead: 'La vida del Profeta Muhammad (s.a.w.) en 5 minutos al día. Cada día una lección, tres preguntas y, si quieres, una competencia en vivo.',
    onbWho: '¿Para quién la vas a usar?', onbSelf: 'Para mí', onbKid: 'Con mi hijo o hija',
    onbKidNote: 'En el modo infantil los textos se simplifican, se leen en voz alta y solo se compite contra un bot.',
    todayDone: 'Meta de hoy cumplida', todayLesson: 'Lección de hoy', allDone: 'Completaste todo el camino 🤍',
    allDoneNote: 'Puedes repasar las lecciones o competir.', oneMore: 'Una lección más', start5: 'Empezar · 5 min',
    streakNote: (n, done) => `🔥 Racha de ${n} ${n === 1 ? 'día' : 'días'}. ${done ? '¡Nos vemos mañana!' : 'Haz hoy también tu lección para no perder la racha.'}`,
    nCorrect: (n) => `${n} correctas`, path: 'El camino',
    listen: '🔊 Escuchar', stopListen: '■ Detener', toQuiz: 'Ir al test · 3 preguntas',
    qOf: (i, n) => `Pregunta ${i}/${n}`, seeResult: 'Ver resultado', nextQ: 'Siguiente pregunta',
    right: '¡Correcto! 🌿', rightIs: (x) => `La respuesta correcta: ${x}`, listenQ: '🔊 Escuchar la pregunta',
    retryLead: 'Leamos la lección una vez más y volvamos a intentarlo. Sin prisa.', reread: 'Leer la lección otra vez', retryQuiz: 'Repetir el test',
    perfect: '¡Perfecto!', good: '¡Muy bien!', scoreLine: (c, t) => `${c}/3 correctas · ${t}`, streakPill: (n) => `🔥 Racha de ${n} ${n === 1 ? 'día' : 'días'}`,
    newBadge: 'Nueva insignia', nextLesson: (t) => `Siguiente: ${t}`, shareStreak: '📤 Compartir mi racha', homeLink: 'Inicio',
    raceTitle: 'Competencia de Sira', raceIntro: '5 preguntas, 12 segundos cada una. Las respuestas correctas y rápidas suman más puntos.',
    you: 'Tú', botRace: '🤖 Competir contra el bot', kidRaceNote: 'En el modo infantil la competencia en vivo está desactivada; solo se juega contra el bot. Puedes cambiarlo en Ajustes.',
    boardLoading: 'Cargando la clasificación…', boardSoon: 'Cuando se abra la competencia en vivo, la clasificación aparecerá aquí.',
    points: (n) => `Puntos ${n}`, wins: (n) => `${n} ${n === 1 ? 'victoria' : 'victorias'}`, boardEmpty: 'Todavía nadie ha competido. ¡Sé el primero!',
    boardErr: 'No se pudo cargar la clasificación.', findLive: '⚡ Buscar rival en vivo', liveSoon: 'Las partidas en vivo se abrirán muy pronto. Por ahora puedes practicar contra el bot.',
    botTrain: '🤖 Practicar contra el bot', boardTitle: 'Clasificación · top 20',
    nickPh: 'ej. Viajero_de_Medina', save: 'Guardar', nickTitle: 'Apodo', nickQ: '¿Cómo te verán tus rivales?',
    nickNote: 'De 3 a 16 letras o números. No hace falta tu nombre real; no pedimos correo ni teléfono.',
    sec: (n) => `${n} s`, playBot: '🤖 Jugar ya contra el bot', searching: 'Buscando rival', searchingDots: 'Buscando rival…',
    searchNote: 'Si le dices a un amigo que abra la aplicación y pulse "Buscar rival en vivo", jugarán entre ustedes.',
    opp: 'Rival', oppAnswered: 'El rival respondió', connecting: 'Conectando…', exit: 'Salir',
    exitConfirm: '¿Salir de la competencia? Las preguntas restantes contarán 0 puntos.', training: 'Práctica', liveRace: 'Competencia en vivo',
    slow: 'Conexión lenta…', timeUp: 'Se acabó el tiempo.', rightPts: (p) => `¡Correcto! +${p}`, wrong: 'Incorrecto',
    youPts: (p) => `Tú +${p}`, youX: 'Tú ✗', youNone: 'No respondiste', oppPts: (p) => `Rival +${p}`, oppX: 'Rival ✗', oppNone: 'El rival no respondió',
    startsIn: (n) => `Empieza en ${n}`, matchedWith: (n) => `Juegas contra ${n}`, isBot: 'Este rival es una computadora.',
    done: 'Terminado', nextComing: 'Viene la siguiente pregunta…', results: 'Resultados…',
    won: '¡Ganaste!', lost: 'Esta vez ganó el rival', draw: 'Empate', ratingDelta: (d) => `Tus puntos ${d >= 0 ? '+' : ''}${d}`,
    loseNote: 'Perder también es aprender. Repasa las lecciones y vuelve a intentarlo.', playAgain: 'Jugar de nuevo', newOpp: 'Buscar otro rival',
    shareResult: '📤 Compartir el resultado', me: 'Yo', racePage: 'Página de competencia',
    statStreak: 'días de racha', statLessons: 'lecciones', statWins: 'victorias', shareProgress: '📤 Compartir mi progreso',
    mode: 'Modo', kidToAdult: 'Modo infantil → Adulto', adultToKid: 'Adulto → Modo infantil',
    sound: 'Sonido y lectura en voz alta', on: 'Activado', off: 'Desactivado', nickname: 'Apodo', choose: 'Elegir', language: 'Idioma · Dil',
    sourcesLink: '📚 Fuentes y sobre el contenido', privacy: '🔒 Política de privacidad', privacyHref: 'privacidad.html',
    resetLink: '↺ Reiniciar el progreso', resetConfirm: '¿Borrar de este dispositivo tu progreso, tu racha y tus insignias?', resetDone: 'Progreso reiniciado.',
    deleteConfirm: '¿Borrar para siempre del servidor tu apodo, tus puntos y tu historial de competencias?', deleteDone: 'Tu cuenta de competencia fue eliminada.', deleteLink: '🗑 Eliminar mi cuenta de competencia',
    footer: (v) => `Siyer Yolu ${v} · Un proyecto de Saadet Evreni`,
    sources: 'Fuentes',
    src1: 'Las lecciones resumen, con un lenguaje breve y sencillo, información ampliamente aceptada sobre la Sira (la vida del Profeta). Las fechas se dan en años de la era común y de forma aproximada; en algunos detalles las fuentes recogen narraciones distintas.',
    src2: 'La aplicación no incluye, de forma intencionada, imágenes ni representaciones del Profeta, de su familia ni de sus compañeros.',
    srcMain: 'Fuentes principales', srcMail: 'Si ves un error o algo que falta, escríbenos: ', mailSubject: 'Siyer%20Yolu%20correcci%C3%B3n',
    gateTitle: 'Permiso de un adulto', gateAns: 'Respuesta', gateTry: 'No es correcto, inténtalo de nuevo.', gateAsk: 'Para cambiar este ajuste, una persona adulta debe responder esta pregunta:',
    gateQ: (a, b) => `¿Cuánto es ${['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'][a]} más ${['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'][b]}?`,
    confirm: 'Confirmar',
    tagline: 'La Sira en 5 minutos al día', shareStreakWord: 'días de racha 🔥', shareLessons: (n) => `${n} ${n === 1 ? 'lección completada' : 'lecciones completadas'}`,
    shareWin: '¡Gané! 🏆', shareDraw: 'Empate 🤝', shareLose: '¡Hora de la revancha!', join: 'Únete tú también',
    shareStreakText: (n, url) => `¡Llevo una racha de ${n} ${n === 1 ? 'día' : 'días'} en Siyer Yolu! 🔥 ${url}`, shareRaceText: (a, b, url) => `¡${a}–${b} en la competencia de Sira de Siyer Yolu! ⚡ ${url}`,
    downloaded: 'Imagen descargada. Puedes compartirla en tus historias de Instagram.', shareFail: 'No se pudo abrir el menú para compartir.',
    netErr: 'Error de conexión', serverErr: 'No se pudo conectar con el servidor.', liveOff: 'La competencia en vivo aún no está abierta.',
  },
};

// Sunucudan gelen (Türkçe) hata mesajlarının karşılıkları.
const SERVER_ES = {
  'Oturum yok': 'No hay sesión.',
  'Takma ad 3-16 harf/rakam olmalı.': 'El apodo debe tener de 3 a 16 letras o números.',
  'Bu takma ad kullanılamaz.': 'Este apodo no se puede usar.',
  'Bu takma ad alınmış.': 'Este apodo ya está en uso.',
  'Önce takma ad seç.': 'Primero elige un apodo.',
  'Maç bulunamadı': 'No se encontró la partida.',
  'Geçersiz soru': 'Pregunta no válida.',
  'Maç henüz bitmedi': 'La partida aún no ha terminado.',
};
export const serverMsg = (m) => (LANG === 'es' ? SERVER_ES[m] || m : m);

export function t(key, ...args) {
  const v = S[LANG][key] ?? S.tr[key];
  return typeof v === 'function' ? v(...args) : v;
}

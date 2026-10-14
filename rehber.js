// Siyer Yolu · Hadis rehberi: konu seçilince uygulamadaki sahih hadislerden (hadis.js) uygun olanlar gösterilir.
// Yapay zekâ yok; her konu ve hadis eşleşmesi elle seçilmiştir. k: hadis.js sıra numaraları.
// L: [ad, arama kelimeleri, kısa not] — tr, es, en, de, ru
export const TOPICS = [
  { id: 'kaygi', i: '🌧️', k: [83, 32, 40, 92, 94], L: {
    tr: ['Kaygılıyım', 'kaygı endişe korku stres yarın gelecek sınav panik', 'Kaygı insanın doğasında var. Bu hadisler, işi Allah\'a bırakmayı, dua etmeyi ve her hâlin mü\'min için bir hayır taşıdığını hatırlatır.'],
    es: ['Estoy inquieto', 'ansiedad preocupación miedo estrés futuro examen', 'La inquietud es parte de la naturaleza humana. Estos hadices recuerdan confiar el asunto a Allah, hacer súplica y que cada situación encierra un bien para el creyente.'],
    en: ['I feel anxious', 'anxiety worry fear stress future exam panic', 'Anxiety is part of human nature. These hadiths remind us to leave matters to Allah, to pray, and that every situation holds good for the believer.'],
    de: ['Ich bin besorgt', 'angst sorge furcht stress zukunft prüfung', 'Sorge gehört zum Menschen. Diese Hadithe erinnern daran, die Dinge Allah zu überlassen, zu beten und dass jede Lage für den Gläubigen etwas Gutes birgt.'],
    ru: ['Мне тревожно', 'тревога беспокойство страх стресс будущее экзамен', 'Тревога свойственна человеку. Эти хадисы напоминают: поручать дела Аллаху, обращаться с мольбой и помнить, что в каждом положении для верующего есть благо.'] } },
  { id: 'pisman', i: '🌱', k: [88, 87, 94, 31, 51], L: {
    tr: ['Pişmanım', 'pişman günah hata tövbe tevbe affet bağışla suçluluk', 'Pişmanlık, tövbenin başlangıcıdır. Allah kulunun tövbesine çok sevinir ve rahmeti gazabını geçmiştir; kötülüğün ardından bir iyilik yapmak onu siler.'],
    es: ['Me arrepiento', 'arrepentimiento pecado error perdón culpa', 'El arrepentimiento es el comienzo de la tawba. Allah se alegra mucho del arrepentimiento de Su siervo y Su misericordia supera a Su ira; hacer un bien tras un mal lo borra.'],
    en: ['I regret something', 'regret sin mistake repentance forgive guilt', 'Regret is the beginning of repentance. Allah rejoices greatly at His servant\'s repentance and His mercy outstrips His anger; a good deed after a bad one wipes it out.'],
    de: ['Ich bereue', 'reue sünde fehler vergebung schuld', 'Reue ist der Anfang der Umkehr. Allah freut sich sehr über die Reue Seines Dieners, und Seine Barmherzigkeit übertrifft Seinen Zorn; eine gute Tat nach einer schlechten löscht sie aus.'],
    ru: ['Я сожалею', 'сожаление грех ошибка покаяние прощение вина', 'Сожаление — начало покаяния. Аллах очень радуется покаянию Своего раба, и Его милость опережает Его гнев; доброе дело после дурного стирает его.'] } },
  { id: 'ofke', i: '🔥', k: [37, 5, 44, 43, 42], L: {
    tr: ['Öfkeliyim', 'öfke sinir kızgın kavga bağırmak sabır', 'Peygamberimiz öğüt isteyen birine tekrar tekrar "Öfkelenme!" demiştir. Gerçek güç, öfke anında kendine hâkim olabilmektir.'],
    es: ['Estoy enfadado', 'ira enfado enojo pelea gritar paciencia', 'El Profeta dijo una y otra vez "¡No te enfades!" a quien le pidió consejo. La verdadera fuerza es dominarse en el momento de la ira.'],
    en: ['I am angry', 'anger angry rage fight shout patience', 'The Prophet said again and again "Do not get angry!" to someone who asked for advice. True strength is controlling yourself at the moment of anger.'],
    de: ['Ich bin wütend', 'wut zorn ärger streit schreien geduld', 'Der Prophet sagte einem, der um Rat bat, immer wieder: "Werde nicht zornig!" Wahre Stärke ist, sich im Moment des Zorns zu beherrschen.'],
    ru: ['Я злюсь', 'гнев злость ярость ссора крик терпение', 'Пророк снова и снова говорил просившему совета: "Не гневайся!" Настоящая сила — владеть собой в минуту гнева.'] } },
  { id: 'yalniz', i: '🌙', k: [57, 92, 96, 17, 49], L: {
    tr: ['Yalnızım', 'yalnız yalnızlık kimsesiz arkadaş sevgi dost', 'Allah\'ı anan kalp diridir ve kul secdede Rabbine en yakındır. Selamı yaymak ve mü\'minlerle bir vücut gibi olmak da yalnızlığa iyi gelir.'],
    es: ['Me siento solo', 'soledad solo amigos amor compañía', 'El corazón que recuerda a Allah está vivo, y el siervo está más cerca de su Señor en la postración. Difundir el saludo y ser como un solo cuerpo con los creyentes también alivia la soledad.'],
    en: ['I feel lonely', 'lonely loneliness alone friends love company', 'A heart that remembers Allah is alive, and the servant is closest to his Lord in prostration. Spreading the greeting of peace and being like one body with the believers also eases loneliness.'],
    de: ['Ich fühle mich einsam', 'einsam einsamkeit allein freunde liebe', 'Ein Herz, das Allahs gedenkt, ist lebendig, und in der Niederwerfung ist der Diener seinem Herrn am nächsten. Den Friedensgruß zu verbreiten und mit den Gläubigen wie ein Körper zu sein, lindert ebenfalls die Einsamkeit.'],
    ru: ['Мне одиноко', 'одиночество один друзья любовь', 'Сердце, поминающее Аллаха, живо, а в земном поклоне раб ближе всего к своему Господу. Распространять приветствие и быть с верующими как одно тело — тоже облегчает одиночество.'] } },
  { id: 'huzur', i: '🕊️', k: [57, 55, 86, 97, 83], L: {
    tr: ['Huzur arıyorum', 'huzur sükunet rahat iç sıkıntısı mutluluk kalp', 'Huzur önce kalpte başlar. Allah\'ı anmak, gönül zenginliği ve her hâlde hayır görmek, kalbe sükûnet veren yollardır.'],
    es: ['Busco paz', 'paz calma tranquilidad felicidad corazón', 'La paz empieza en el corazón. Recordar a Allah, la riqueza del alma y ver el bien en cada situación son caminos que dan calma al corazón.'],
    en: ['I am looking for peace', 'peace calm tranquility happiness heart', 'Peace begins in the heart. Remembering Allah, richness of the soul and seeing good in every situation are paths that bring calm to the heart.'],
    de: ['Ich suche Frieden', 'frieden ruhe gelassenheit glück herz', 'Frieden beginnt im Herzen. Allahs zu gedenken, Reichtum der Seele und in jeder Lage das Gute zu sehen, sind Wege, die dem Herzen Ruhe geben.'],
    ru: ['Ищу покоя', 'покой спокойствие умиротворение счастье сердце', 'Покой начинается в сердце. Поминание Аллаха, богатство души и умение видеть благо в любом положении — пути, дающие сердцу умиротворение.'] } },
  { id: 'sukur', i: '🌻', k: [83, 14, 20, 56, 24], L: {
    tr: ['Huzurluyum, şükrediyorum', 'şükür mutlu sevinç teşekkür nimet', 'Nimetin farkına varmak şükrün başlangıcıdır. İnsanlara teşekkür etmek de Allah\'a şükrün bir parçasıdır.'],
    es: ['Estoy en paz, agradezco', 'gratitud feliz alegría gracias bendición', 'Darse cuenta de la bendición es el comienzo de la gratitud. Agradecer a las personas también forma parte de agradecer a Allah.'],
    en: ['I am at peace and grateful', 'gratitude thankful happy joy blessing', 'Noticing a blessing is the beginning of gratitude. Thanking people is also part of thanking Allah.'],
    de: ['Ich bin dankbar', 'dankbarkeit dank glücklich freude segen', 'Den Segen wahrzunehmen ist der Anfang der Dankbarkeit. Auch den Menschen zu danken, gehört zum Dank an Allah.'],
    ru: ['Мне хорошо, я благодарен', 'благодарность счастье радость спасибо милость', 'Заметить милость — начало благодарности. Благодарить людей — тоже часть благодарности Аллаху.'] } },
  { id: 'aile', i: '🏡', k: [72, 73, 47, 48, 98], L: {
    tr: ['Anne baba ve aile', 'anne baba aile ebeveyn akraba çocuk eş', 'İyiliğe en lâyık olan annedir, sonra babadır. Ailesine karşı hayırlı olmak ve akrabalarla bağı korumak, bu hadislerin ortak öğüdüdür.'],
    es: ['Padres y familia', 'madre padre familia padres parientes hijos esposa', 'La más merecedora del buen trato es la madre, luego el padre. Ser bueno con la propia familia y mantener los lazos de parentesco es el consejo común de estos hadices.'],
    en: ['Parents and family', 'mother father family parents relatives children spouse', 'The most deserving of kindness is the mother, then the father. Being good to your family and keeping ties of kinship is the shared advice of these hadiths.'],
    de: ['Eltern und Familie', 'mutter vater familie eltern verwandte kinder', 'Am meisten Güte verdient die Mutter, dann der Vater. Gut zur eigenen Familie zu sein und die Verwandtschaftsbande zu pflegen, ist der gemeinsame Rat dieser Hadithe.'],
    ru: ['Родители и семья', 'мать отец семья родители родственники дети', 'Больше всех доброго отношения заслуживает мать, затем отец. Быть добрым к своей семье и поддерживать родственные связи — общий совет этих хадисов.'] } },
  { id: 'kus', i: '🤝', k: [19, 49, 50, 1, 82], L: {
    tr: ['Biriyle küsüm', 'küs küslük kavga barışmak arkadaş kardeş kin', 'Kin beslememek, sırt çevirmemek ve kardeş olmak emredilmiştir. Selam vermek ve hediyeleşmek kalpleri yeniden yakınlaştırır.'],
    es: ['Estoy peleado con alguien', 'enfadado pelea reconciliar amigo hermano rencor', 'Se nos manda no guardar rencor, no darnos la espalda y ser hermanos. Saludar y hacerse regalos vuelve a acercar los corazones.'],
    en: ['I fell out with someone', 'quarrel fight reconcile friend brother grudge', 'We are told not to hold grudges, not to turn our backs on each other and to be brothers. Greeting and exchanging gifts bring hearts close again.'],
    de: ['Ich habe mich zerstritten', 'streit versöhnen freund bruder groll', 'Es wird geboten, keinen Groll zu hegen, sich nicht den Rücken zuzukehren und Geschwister zu sein. Grüßen und Geschenke bringen die Herzen wieder näher.'],
    ru: ['Я в ссоре', 'ссора поссорился помириться друг брат обида', 'Нам велено не таить злобы, не отворачиваться друг от друга и быть братьями. Приветствие и подарки снова сближают сердца.'] } },
  { id: 'rizik', i: '🪙', k: [97, 25, 62, 21, 98], L: {
    tr: ['Para ve rızık', 'para rızık iş geçim borç zengin fakir maaş', 'Asıl zenginlik gönül zenginliğidir. Alın teriyle kazanmak, vermek ve akrabayı gözetmek rızkın bereketine vesiledir.'],
    es: ['Dinero y sustento', 'dinero sustento trabajo deudas rico pobre sueldo', 'La verdadera riqueza es la riqueza del alma. Ganarse la vida con el propio esfuerzo, dar y cuidar a los parientes traen bendición al sustento.'],
    en: ['Money and provision', 'money provision work job debt rich poor salary', 'True wealth is richness of the soul. Earning by your own effort, giving and caring for relatives bring blessing to your provision.'],
    de: ['Geld und Versorgung', 'geld versorgung arbeit schulden reich arm gehalt', 'Wahrer Reichtum ist der Reichtum der Seele. Mit eigener Arbeit zu verdienen, zu geben und sich um Verwandte zu kümmern, bringt Segen in die Versorgung.'],
    ru: ['Деньги и удел', 'деньги удел работа долг богатый бедный зарплата', 'Истинное богатство — богатство души. Зарабатывать своим трудом, давать и заботиться о родственниках — путь к благодати в уделе.'] } },
  { id: 'haset', i: '🪞', k: [1, 19, 97, 16], L: {
    tr: ['Kıskanıyorum', 'kıskançlık haset imrenmek karşılaştırmak', 'Kardeşin için de kendin için istediğini istemek imanın gereğidir. Allah suretlere ve mallara değil, kalplere ve amellere bakar.'],
    es: ['Siento envidia', 'envidia celos comparar', 'Querer para tu hermano lo que quieres para ti es parte de la fe. Allah no mira las apariencias ni los bienes, sino los corazones y las obras.'],
    en: ['I feel envious', 'envy jealousy jealous compare', 'Wanting for your brother what you want for yourself is part of faith. Allah does not look at appearances or wealth, but at hearts and deeds.'],
    de: ['Ich bin neidisch', 'neid eifersucht vergleichen', 'Für den Bruder zu wünschen, was man sich selbst wünscht, gehört zum Glauben. Allah schaut nicht auf Aussehen oder Besitz, sondern auf Herzen und Taten.'],
    ru: ['Я завидую', 'зависть ревность сравнивать', 'Желать брату того же, чего желаешь себе, — часть веры. Аллах смотрит не на облик и богатство, а на сердца и дела.'] } },
  { id: 'dil', i: '🗣️', k: [2, 65, 66, 67, 3], L: {
    tr: ['Dedikodu ve dil', 'dedikodu gıybet laf yalan söz konuşmak sosyal medya', 'Ya hayır söylemek ya susmak... Zan, laf taşımak ve her duyulanı anlatmak, dilin en çok düştüğü tuzaklardır.'],
    es: ['Chismes y la lengua', 'chisme murmuración mentira palabras hablar redes sociales', 'Decir el bien o callar... La sospecha, llevar chismes y contar todo lo que se oye son las trampas en las que más cae la lengua.'],
    en: ['Gossip and speech', 'gossip backbiting rumor lie words talk social media', 'Speak good or stay silent... Suspicion, carrying tales and repeating everything you hear are the traps the tongue falls into most.'],
    de: ['Klatsch und Sprache', 'klatsch tratsch gerücht lüge worte reden', 'Gutes sagen oder schweigen … Misstrauen, Gerede weitertragen und alles Gehörte erzählen sind die Fallen, in die die Zunge am häufigsten tappt.'],
    ru: ['Сплетни и язык', 'сплетни злословие слухи ложь слова соцсети', 'Говорить благое или молчать… Подозрения, сплетни и пересказ всего услышанного — ловушки, в которые язык попадает чаще всего.'] } },
  { id: 'zor', i: '⛰️', k: [83, 94, 41, 32, 40], L: {
    tr: ['Zor bir dönemdeyim', 'zorluk sıkıntı hastalık dert musibet kayıp yas sabır', 'Mü\'minin her hâli hayırdır: Sevinçte şükreder, sıkıntıda sabreder. Allah\'ın rahmeti gazabını geçmiştir; dua ise ibadetin özüdür.'],
    es: ['Paso por un momento difícil', 'dificultad problema enfermedad pena pérdida duelo paciencia', 'Todo el estado del creyente es un bien: en la alegría agradece, en la dificultad tiene paciencia. La misericordia de Allah supera a Su ira, y la súplica es la esencia de la adoración.'],
    en: ['I am going through a hard time', 'hardship difficulty illness grief loss trouble patience', 'Every state of the believer is good: in joy he is grateful, in hardship he is patient. Allah\'s mercy outstrips His anger, and supplication is the essence of worship.'],
    de: ['Ich habe eine schwere Zeit', 'schwierigkeit not krankheit trauer verlust geduld', 'Jeder Zustand des Gläubigen ist gut: In der Freude ist er dankbar, in der Not geduldig. Allahs Barmherzigkeit übertrifft Seinen Zorn, und das Bittgebet ist der Kern der Anbetung.'],
    ru: ['У меня трудный период', 'трудность беда болезнь горе утрата терпение', 'Любое положение верующего — благо: в радости он благодарит, в беде терпит. Милость Аллаха опережает Его гнев, а мольба — суть поклонения.'] } },
  { id: 'ihlas', i: '💎', k: [0, 16, 86, 11], L: {
    tr: ['Niyet ve samimiyet', 'niyet ihlas samimiyet gösteriş riya kalp', 'Ameller niyetlere göredir. Allah kalbe bakar; az ama devamlı ve samimi olan amel, O\'na en sevimli olandır.'],
    es: ['Intención y sinceridad', 'intención sinceridad ostentación corazón', 'Las obras valen según las intenciones. Allah mira el corazón; la obra poca pero constante y sincera es la más querida para Él.'],
    en: ['Intention and sincerity', 'intention sincerity showing off heart', 'Deeds are judged by intentions. Allah looks at the heart; a small but constant and sincere deed is the most beloved to Him.'],
    de: ['Absicht und Aufrichtigkeit', 'absicht aufrichtigkeit angeben herz', 'Die Taten richten sich nach den Absichten. Allah schaut auf das Herz; eine kleine, aber beständige und aufrichtige Tat ist Ihm am liebsten.'],
    ru: ['Намерение и искренность', 'намерение искренность показуха сердце', 'Дела оцениваются по намерениям. Аллах смотрит на сердце; дело малое, но постоянное и искреннее, — самое любимое Им.'] } },
  { id: 'iyilik', i: '🌷', k: [77, 79, 81, 89, 80, 99], L: {
    tr: ['İyilik yapmak istiyorum', 'iyilik yardım sadaka hayır gönüllü bağış', 'Hiçbir iyiliği küçük görme: Bir gülümseme, yoldan bir taşı kaldırmak, bir fidan dikmek bile sadakadır.'],
    es: ['Quiero hacer el bien', 'bien ayuda caridad sadaqa voluntario donación', 'No desprecies ningún bien: una sonrisa, quitar una piedra del camino o plantar un árbol también son caridad.'],
    en: ['I want to do good', 'good help charity sadaqa volunteer donation', 'Never belittle any good deed: a smile, removing a stone from the road or planting a tree are also charity.'],
    de: ['Ich möchte Gutes tun', 'gutes hilfe spende sadaqa ehrenamt', 'Unterschätze keine gute Tat: Ein Lächeln, einen Stein vom Weg zu räumen oder einen Baum zu pflanzen, ist auch eine Spende.'],
    ru: ['Хочу делать добро', 'добро помощь милостыня садака волонтер пожертвование', 'Не пренебрегай никаким добром: улыбка, убранный с дороги камень или посаженное дерево — тоже милостыня.'] } },
  { id: 'komsu', i: '🏘️', k: [70, 71, 22, 69], L: {
    tr: ['Komşuluk ve misafir', 'komşu misafir ziyaret davet hasta', 'Cebrail komşu hakkını o kadar tavsiye etti ki... Komşuya ve misafire ikram, imanın bir göstergesidir.'],
    es: ['Vecinos e invitados', 'vecino invitado visita invitación enfermo', 'Gabriel recomendó tanto el derecho del vecino que… Honrar al vecino y al invitado es una señal de fe.'],
    en: ['Neighbours and guests', 'neighbour neighbor guest visit invitation sick', 'Gabriel stressed the rights of the neighbour so much that… Honouring your neighbour and guest is a sign of faith.'],
    de: ['Nachbarn und Gäste', 'nachbar gast besuch einladung krank', 'Gabriel legte das Recht des Nachbarn so sehr ans Herz, dass … Nachbarn und Gäste zu ehren, ist ein Zeichen des Glaubens.'],
    ru: ['Соседи и гости', 'сосед гость визит приглашение больной', 'Джибрил так настойчиво завещал право соседа, что… Почитать соседа и гостя — признак веры.'] } },
  { id: 'ibadet', i: '🕌', k: [11, 51, 91, 92, 40, 53], L: {
    tr: ['İbadette gevşedim', 'namaz ibadet tembellik oruç dua cami motivasyon', 'Allah\'a en sevimli amel, az da olsa devamlı olanıdır. Küçük ama düzenli adımlarla başlamak, gevşekliğe en iyi ilaçtır.'],
    es: ['Me cuesta la adoración', 'oración salat adoración pereza ayuno súplica mezquita motivación', 'La obra más querida para Allah es la constante, aunque sea poca. Empezar con pasos pequeños pero regulares es el mejor remedio para la desgana.'],
    en: ['I have slacked in worship', 'prayer salah worship lazy fasting dua mosque motivation', 'The deed most beloved to Allah is the constant one, even if small. Starting with small but regular steps is the best cure for slackness.'],
    de: ['Ich bin im Gebet nachlässig', 'gebet anbetung faul fasten bittgebet moschee motivation', 'Die Tat, die Allah am liebsten ist, ist die beständige, auch wenn sie klein ist. Mit kleinen, aber regelmäßigen Schritten anzufangen, ist das beste Mittel gegen Nachlässigkeit.'],
    ru: ['Я ослаб в поклонении', 'намаз молитва поклонение лень пост дуа мечеть мотивация', 'Самое любимое Аллахом дело — постоянное, пусть и малое. Начать с маленьких, но регулярных шагов — лучшее лекарство от вялости.'] } },
  { id: 'kuran', i: '📖', k: [6, 58, 59, 60], L: {
    tr: ['Kur\'an okumak', 'kuran kur\'an okumak hatim ezber tecvid', 'Kur\'an\'ı öğrenen ve öğreten en hayırlı kişidir. Okunan her harfe bir iyilik yazılır; zorlanarak okuyan da ecirsiz kalmaz.'],
    es: ['Leer el Corán', 'corán leer recitar memorizar', 'El mejor es quien aprende el Corán y lo enseña. Por cada letra leída se escribe un bien.'],
    en: ['Reading the Quran', 'quran koran read recite memorize', 'The best is the one who learns the Quran and teaches it. A good deed is written for every letter read.'],
    de: ['Den Koran lesen', 'koran lesen rezitieren auswendig', 'Der Beste ist, wer den Koran lernt und lehrt. Für jeden gelesenen Buchstaben wird eine gute Tat aufgeschrieben.'],
    ru: ['Чтение Корана', 'коран читать чтение заучивать', 'Лучший — тот, кто изучает Коран и обучает ему. За каждую прочитанную букву записывается доброе дело.'] } },
  { id: 'ilim', i: '🎓', k: [7, 45, 46, 6], L: {
    tr: ['Ders ve ilim', 'ders okul ilim sınav öğrenmek ödev üniversite', 'İlim yoluna giren için Allah cennet yolunu kolaylaştırır. Öğrendiğini paylaşmak da hayra vesile olur.'],
    es: ['Estudios y conocimiento', 'estudios escuela conocimiento examen aprender universidad', 'A quien emprende el camino del conocimiento, Allah le facilita el camino al Paraíso. Compartir lo aprendido también es un bien.'],
    en: ['Studies and knowledge', 'study school knowledge exam learn homework university', 'For whoever sets out on the path of knowledge, Allah makes the path to Paradise easy. Sharing what you learn is also a good deed.'],
    de: ['Lernen und Wissen', 'lernen schule wissen prüfung studium', 'Wer sich auf den Weg des Wissens macht, dem erleichtert Allah den Weg ins Paradies. Gelerntes weiterzugeben, ist ebenfalls etwas Gutes.'],
    ru: ['Учёба и знание', 'учеба школа знание экзамен учиться университет', 'Тому, кто встал на путь знания, Аллах облегчает путь в Рай. Делиться выученным — тоже благое дело.'] } },
  { id: 'dogruluk', i: '⚖️', k: [26, 64, 63, 33, 85], L: {
    tr: ['Doğruluk ve dürüstlük', 'doğruluk dürüst yalan hile aldatmak şüphe helal haram', 'Doğruluk iyiliğe, iyilik cennete götürür. Aldatmak, sözünden dönmek ve emanete hıyanet ise mü\'mine yakışmaz.'],
    es: ['Verdad y honradez', 'verdad honrado mentira engaño duda lícito ilícito', 'La veracidad lleva al bien y el bien al Paraíso. Engañar, faltar a la palabra y traicionar la confianza no son propios del creyente.'],
    en: ['Truth and honesty', 'truth honest lie cheat deceive doubt halal haram', 'Truthfulness leads to goodness and goodness leads to Paradise. Cheating, breaking promises and betraying trust do not suit a believer.'],
    de: ['Wahrheit und Ehrlichkeit', 'wahrheit ehrlich lüge betrug täuschen zweifel', 'Wahrhaftigkeit führt zum Guten und das Gute ins Paradies. Betrügen, Versprechen brechen und Vertrauen verraten passen nicht zu einem Gläubigen.'],
    ru: ['Правдивость и честность', 'правда честный ложь обман сомнение дозволенное запретное', 'Правдивость ведёт к благочестию, а благочестие — в Рай. Обман, нарушение слова и предательство доверия не подобают верующему.'] } },
  { id: 'merhamet', i: '🐾', k: [8, 41, 99, 48], L: {
    tr: ['Merhamet ve hayvanlar', 'merhamet şefkat hayvan doğa ağaç çocuk', 'Merhamet edene Rahmân merhamet eder. Bir fidan dikip ondan bir kuşun beslenmesi bile sadaka olur.'],
    es: ['Misericordia y animales', 'misericordia compasión animal naturaleza árbol niños', 'A quien es misericordioso, el Misericordioso le tiene misericordia. Incluso plantar un árbol del que come un pájaro es caridad.'],
    en: ['Mercy and animals', 'mercy compassion animal nature tree children', 'The Most Merciful has mercy on those who are merciful. Even planting a tree from which a bird eats is charity.'],
    de: ['Barmherzigkeit und Tiere', 'barmherzigkeit mitgefühl tier natur baum kinder', 'Der Allerbarmer erbarmt sich derer, die barmherzig sind. Sogar einen Baum zu pflanzen, von dem ein Vogel frisst, ist eine Spende.'],
    ru: ['Милосердие и животные', 'милосердие сострадание животные природа дерево дети', 'Милостивый милует милосердных. Даже посаженное дерево, плодами которого питается птица, — милостыня.'] } },
  { id: 'zaman', i: '⏳', k: [20, 34, 27, 61], L: {
    tr: ['Zamanımı boşa harcıyorum', 'zaman vakit boş telefon oyun tembellik ölüm ahiret', 'Sağlık ve boş vakit, kıymeti en az bilinen iki nimettir. Kişiyi ilgilendirmeyeni bırakmak, Müslümanlığının güzelliğindendir.'],
    es: ['Pierdo el tiempo', 'tiempo perder móvil juegos pereza muerte', 'La salud y el tiempo libre son dos bendiciones que muchos no valoran. Dejar lo que no le concierne a uno es parte de la belleza de su islam.'],
    en: ['I waste my time', 'time waste phone games lazy death hereafter', 'Health and free time are two blessings many people do not value. Leaving what does not concern you is part of the beauty of your Islam.'],
    de: ['Ich verschwende meine Zeit', 'zeit verschwenden handy spiele faul tod jenseits', 'Gesundheit und freie Zeit sind zwei Gaben, deren Wert viele nicht kennen. Zu lassen, was einen nicht angeht, gehört zur Schönheit des Islams eines Menschen.'],
    ru: ['Я трачу время впустую', 'время тратить телефон игры лень смерть', 'Здоровье и свободное время — две милости, цену которых многие не знают. Оставлять то, что тебя не касается, — часть красоты твоего ислама.'] } },
];

export const REHBER_UI = {
  tr: { title: 'Hadislerle cevap', lead: 'Neyi merak ediyorsun, ne hissediyorsun? Bir konu seç ya da yaz.', search: 'Ara: kaygı, öfke, anne…', none: 'Bu kelimeyle eşleşen konu bulamadım. Aşağıdaki konulardan birini seçebilirsin.', note: 'Bu bölüm, uygulamadaki sahih hadislerden seçilmiş kısa hatırlatmalardır; fetva değildir. Dinî bir sorunuz için bir hocaya ya da müftülüğe danışın.', crisis: 'Kendine zarar vermeyi düşünüyorsan lütfen hemen 112\'yi ara ya da güvendiğin biriyle şimdi konuş. Yalnız değilsin.', tab: 'Hadis', back: 'Konular' },
  es: { title: 'Respuestas con hadices', lead: '¿Qué te preguntas o qué sientes? Elige un tema o escribe.', search: 'Buscar: ansiedad, ira, madre…', none: 'No encontré un tema con esa palabra. Puedes elegir uno de los temas de abajo.', note: 'Esta sección ofrece breves recordatorios tomados de los hadices auténticos de la app; no es una fetua. Para una consulta religiosa, pregunta a un imam o a una persona de conocimiento.', crisis: 'Si estás pensando en hacerte daño, llama ahora al número de emergencias de tu país o habla ya con alguien de confianza. No estás solo.', tab: 'Hadiz', back: 'Temas' },
  en: { title: 'Answers from hadith', lead: 'What are you wondering about or feeling? Pick a topic or type.', search: 'Search: anxiety, anger, mother…', none: 'I could not find a topic for that word. You can pick one of the topics below.', note: 'This section offers short reminders chosen from the authentic hadiths in the app; it is not a fatwa. For a religious question, please ask a qualified scholar or imam.', crisis: 'If you are thinking about hurting yourself, please call your local emergency number now or talk to someone you trust right away. You are not alone.', tab: 'Hadith', back: 'Topics' },
  de: { title: 'Antworten aus Hadithen', lead: 'Was beschäftigt dich, wie fühlst du dich? Wähle ein Thema oder schreib.', search: 'Suche: Sorge, Wut, Mutter…', none: 'Ich habe kein Thema zu diesem Wort gefunden. Du kannst unten ein Thema wählen.', note: 'Dieser Bereich bietet kurze Erinnerungen aus den authentischen Hadithen der App; er ist kein Rechtsgutachten (Fatwa). Bei religiösen Fragen wende dich bitte an einen Imam oder Gelehrten.', crisis: 'Wenn du daran denkst, dir etwas anzutun, ruf bitte sofort den Notruf (112) an oder sprich jetzt mit einem Menschen, dem du vertraust. Du bist nicht allein.', tab: 'Hadith', back: 'Themen' },
  ru: { title: 'Ответы в хадисах', lead: 'Что тебя волнует, что ты чувствуешь? Выбери тему или напиши.', search: 'Поиск: тревога, гнев, мать…', none: 'Не нашёл темы по этому слову. Выбери одну из тем ниже.', note: 'Здесь собраны краткие напоминания из достоверных хадисов приложения; это не фетва. С религиозным вопросом обратись к имаму или знающему человеку.', crisis: 'Если ты думаешь о том, чтобы навредить себе, пожалуйста, сразу позвони в экстренную службу (112) или прямо сейчас поговори с тем, кому доверяешь. Ты не один.', tab: 'Хадисы', back: 'Темы' },
};

// Kendine zarar verme işaretleri: eşleşirse üstte destek mesajı gösterilir.
export const CRISIS = /intihar|kendimi öldür|ölmek istiyorum|yaşamak istemiyorum|kendime zarar|suicid|matarme|quiero morir|kill myself|want to die|self.?harm|hurt myself|selbstmord|suizid|umbringen|sterben will|самоубийств|суицид|убить себя|хочу умереть|навредить себе/i;

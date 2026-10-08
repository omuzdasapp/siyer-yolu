// Siyer Yolu · ders içerikleri
// Her ders: yetişkin metni (text), çocuk modu metni (kid) ve 4 soru.
// Sorularda DOĞRU CEVAP HER ZAMAN İLK SEÇENEKTİR; uygulama ekranda karıştırır.
// Soru kimliği = ders no × 10 + soru sırası (örn. 3. dersin 2. sorusu → 32). Sunucudaki soru tablosu bu kimlikleri kullanır.
// İçerik yaygın kabul gören siyer bilgilerinden derlenmiştir; yayın öncesinde bir ilahiyatçının gözden geçirmesi önerilir.

export const ERAS = { mekke: 'Mekke yılları', hicret: 'Hicret', medine: 'Medine yılları' };

export const LESSONS = [
  {
    n: 1, era: 'mekke', year: '571', icon: '🐘', title: 'Fil Yılı ve doğum',
    text: 'Peygamberimiz Hz. Muhammed (s.a.v.) 571 yılında Mekke\'de dünyaya geldi. Bu yıl, Yemen valisi Ebrehe\'nin fillerden oluşan ordusuyla Kâbe\'yi yıkmak için gelip başaramadığı yıldır; bu yüzden "Fil Yılı" diye anılır ve olay Kur\'an\'da Fil suresinde anlatılır. Babası Abdullah, o doğmadan birkaç ay önce vefat etmişti. Annesi Hz. Âmine, onu dedesi Abdülmuttalib\'e müjdeledi. Dedesi torununa, Araplar arasında pek bilinmeyen bir isim verdi: "çokça övülen" anlamına gelen Muhammed.',
    kid: 'Peygamberimiz Hz. Muhammed (s.a.v.) Mekke şehrinde doğdu. Doğduğu yıla "Fil Yılı" denir, çünkü o yıl fillerle gelen bir ordu Kâbe\'ye zarar veremeden geri döndü. Annesinin adı Âmine\'ydi. Dedesi ona "çok övülen" anlamına gelen Muhammed adını verdi.',
    q: [
      { q: 'Peygamberimiz hangi yıl doğdu?', o: ['571', '610', '622', '632'] },
      { q: 'Doğduğu yıl hangi adla anılır?', o: ['Fil Yılı', 'Hüzün Yılı', 'Hicret Yılı', 'Veda Yılı'] },
      { q: 'Peygamberimizin annesinin adı nedir?', o: ['Hz. Âmine', 'Hz. Halime', 'Hz. Hatice', 'Hz. Fâtıma'] },
      { q: 'Ona "Muhammed" adını kim verdi?', o: ['Dedesi Abdülmuttalib', 'Amcası Ebû Tâlib', 'Sütannesi Halime', 'Varaka b. Nevfel'] },
    ],
  },
  {
    n: 2, era: 'mekke', year: '571–595', icon: '🐑', title: 'Yetim bir çocukluk',
    text: 'Mekkeliler çocuklarını, temiz havada büyüsünler ve düzgün Arapça öğrensinler diye çöldeki sütannelere verirdi. Peygamberimizin sütannesi Benî Sa\'d kabilesinden Hz. Halime oldu. Altı yaşındayken annesi Hz. Âmine, Medine dönüşü Ebvâ denilen yerde vefat etti. Onu iki yıl dedesi Abdülmuttalib büyüttü; dedesi de vefat edince amcası Ebû Tâlib himayesine aldı. Gençliğinde bir süre Mekkelilerin koyunlarını güderek çobanlık yaptı.',
    kid: 'Peygamberimiz küçükken çölde sütannesi Halime\'nin yanında büyüdü. Altı yaşındayken annesini kaybetti. Önce dedesi, sonra amcası Ebû Tâlib ona sevgiyle baktı. Gençken koyun güderek çobanlık yaptı.',
    q: [
      { q: 'Peygamberimizin sütannesi kimdir?', o: ['Hz. Halime', 'Hz. Âmine', 'Hz. Sümeyye', 'Hz. Âişe'] },
      { q: 'Annesi vefat ettiğinde Peygamberimiz kaç yaşındaydı?', o: ['6', '2', '12', '25'] },
      { q: 'Dedesinin vefatından sonra onu kim himaye etti?', o: ['Amcası Ebû Tâlib', 'Amcası Hamza', 'Hz. Ebû Bekir', 'Zeyd b. Hârise'] },
      { q: 'Peygamberimiz gençliğinde hangi işi yaptı?', o: ['Çobanlık', 'Demircilik', 'Balıkçılık', 'Çiftçilik'] },
    ],
  },
  {
    n: 3, era: 'mekke', year: '590–605', icon: '🤝', title: 'Güvenilir insan: el-Emîn',
    text: 'Genç Muhammed, zulme uğrayan kim olursa olsun ona yardım etmek için kurulan Hılfü\'l-Fudûl (Erdemliler Birliği) anlaşmasında yer aldı. Doğruluğu yüzünden Mekkeliler ona "el-Emîn", yani güvenilir kişi dediler. 35 yaşındayken Kâbe onarılırken Hacerülesved\'i yerine kimin koyacağı konusunda kabileler kavgaya tutuştu. Hakem olarak seçilen Peygamberimiz hırkasını yere serdi, taşı üzerine koydu ve her kabilenin reisinin hırkanın bir ucundan tutmasını istedi. Taşı da kendi eliyle yerine yerleştirdi; böylece kan dökülmeden sorun çözüldü.',
    kid: 'Mekkeliler Peygamberimize "el-Emîn" yani "güvenilir" derdi, çünkü hiç yalan söylemezdi. Bir gün kabileler, Kâbe\'deki Hacerülesved denilen taşı kimin yerine koyacağı için kavga ediyordu. Peygamberimiz hırkasını yere serdi, taşı üstüne koydu ve herkes bir ucundan tuttu. Böylece kimse küsmedi.',
    q: [
      { q: 'Mekkeliler Peygamberimize hangi lakabı verdi?', o: ['el-Emîn', 'es-Sıddîk', 'el-Fârûk', 'Seyfullah'] },
      { q: 'Hılfü\'l-Fudûl ne için kuruldu?', o: ['Haksızlığa uğrayana yardım etmek için', 'Ticaret kervanı düzenlemek için', 'Kâbe\'yi onarmak için', 'Şiir yarışması için'] },
      { q: 'Hacerülesved anlaşmazlığını nasıl çözdü?', o: ['Hırkasını serip kabilelerin birlikte taşımasını sağladı', 'Kura çekti', 'En yaşlı reisi seçti', 'Taşı yerinde bıraktı'] },
      { q: 'Kâbe onarılırken Peygamberimiz kaç yaşındaydı?', o: ['35', '25', '40', '53'] },
    ],
  },
  {
    n: 4, era: 'mekke', year: '595', icon: '🐪', title: 'Hz. Hatice ile yuva',
    text: 'Mekke\'nin saygın tüccarlarından Hz. Hatice, Peygamberimizin dürüstlüğünü duyunca ticaret kervanını Şam\'a götürmesini istedi. Yolculuktan bereketle dönülmesi ve onun güzel ahlakı, Hz. Hatice\'yi çok etkiledi. Peygamberimiz 25 yaşındayken, kendisinden yaşça büyük olan Hz. Hatice ile evlendi. Bu evlilikten Kâsım, Zeynep, Rukıyye, Ümmü Gülsüm, Fâtıma ve Abdullah dünyaya geldi. Hz. Hatice hayatı boyunca onun en büyük destekçisi oldu.',
    kid: 'Hz. Hatice çok saygın bir tüccardı. Peygamberimizin dürüstlüğünü görünce onunla evlenmek istedi. Peygamberimiz 25 yaşında Hz. Hatice ile evlendi. Kızlarından biri de Hz. Fâtıma\'dır.',
    q: [
      { q: 'Peygamberimiz Hz. Hatice ile kaç yaşında evlendi?', o: ['25', '20', '35', '40'] },
      { q: 'Hz. Hatice\'nin mesleği neydi?', o: ['Ticaret', 'Öğretmenlik', 'Hekimlik', 'Dokumacılık'] },
      { q: 'Peygamberimiz Hz. Hatice\'nin kervanını nereye götürdü?', o: ['Şam', 'Yemen', 'Mısır', 'Bağdat'] },
      { q: 'Aşağıdakilerden hangisi Peygamberimizin kızıdır?', o: ['Hz. Fâtıma', 'Hz. Âmine', 'Hz. Halime', 'Hz. Sümeyye'] },
    ],
  },
  {
    n: 5, era: 'mekke', year: '610', icon: '⛰️', title: 'Hira\'da ilk vahiy',
    text: 'Peygamberimiz zaman zaman Nur Dağı\'ndaki Hira mağarasına çekilip tefekkür ederdi. 610 yılının Ramazan ayında, 40 yaşındayken vahiy meleği Cebrail geldi ve "Oku!" dedi. Alak suresinin ilk beş ayeti böylece indi: "Yaratan Rabbinin adıyla oku!" Peygamberimiz heyecan içinde eve dönüp "Örtün beni" dedi. Hz. Hatice onu teselli etti: "Allah seni asla utandırmaz; sen akrabanı gözetirsin, yükü olana yardım edersin." Sonra onu kendi amcasının oğlu Varaka b. Nevfel\'e götürdü.',
    kid: 'Peygamberimiz Hira mağarasında düşünürken melek Cebrail geldi ve "Oku!" dedi. Kur\'an\'ın ilk ayetleri böyle indi. O zaman Peygamberimiz 40 yaşındaydı. Eve dönünce Hz. Hatice onu sevgiyle teselli etti.',
    q: [
      { q: 'İlk vahiy hangi mağarada geldi?', o: ['Hira', 'Sevr', 'Uhud', 'Safa'] },
      { q: 'İlk inen ayetler hangi surededir?', o: ['Alak', 'Fâtiha', 'Fil', 'İhlâs'] },
      { q: 'İlk vahiy geldiğinde Peygamberimiz kaç yaşındaydı?', o: ['40', '25', '35', '53'] },
      { q: 'Vahiy meleğinin adı nedir?', o: ['Cebrail', 'Mikail', 'İsrafil', 'Azrail'] },
    ],
  },
  {
    n: 6, era: 'mekke', year: '610–613', icon: '🌱', title: 'İlk Müslümanlar',
    text: 'İlk iman eden Hz. Hatice oldu. Yetişkin erkeklerden ilk Müslüman Hz. Ebû Bekir, çocuklardan Hz. Ali, azatlı kölelerden Zeyd b. Hârise\'dir. Hz. Ebû Bekir\'in davetiyle Hz. Osman, Abdurrahman b. Avf, Talha, Zübeyr ve Sa\'d b. Ebû Vakkâs da Müslüman oldu. İlk üç yıl davet gizli yapıldı; Müslümanlar Safa tepesinin yakınındaki Erkam\'ın evinde (Dârülerkam) toplanıp Kur\'an öğrendi.',
    kid: 'Peygamberimize ilk inanan eşi Hz. Hatice oldu. Arkadaşı Hz. Ebû Bekir ve küçük Hz. Ali de hemen inandı. İlk Müslümanlar, Erkam adlı bir sahabenin evinde gizlice toplanıp Kur\'an öğrendi.',
    q: [
      { q: 'İlk iman eden kişi kimdir?', o: ['Hz. Hatice', 'Hz. Ebû Bekir', 'Hz. Ali', 'Hz. Ömer'] },
      { q: 'Çocuklardan ilk Müslüman olan kimdir?', o: ['Hz. Ali', 'Zeyd b. Hârise', 'Hz. Osman', 'Hz. Hamza'] },
      { q: 'Müslümanların gizlice toplandığı ev kimindi?', o: ['Erkam\'ın', 'Ebû Tâlib\'in', 'Varaka\'nın', 'Ebû Cehil\'in'] },
      { q: 'Hz. Ebû Bekir\'in davetiyle Müslüman olanlardan biri kimdir?', o: ['Hz. Osman', 'Hz. Hamza', 'Hz. Ömer', 'Halid b. Velid'] },
    ],
  },
  {
    n: 7, era: 'mekke', year: '613–615', icon: '🪨', title: 'Sabrın adı: Bilal',
    text: 'Allah\'ın emriyle davet açıktan yapılmaya başlandı; Peygamberimiz Safa tepesine çıkıp Mekkelileri çağırdı. Putperest ileri gelenler bu daveti kendi düzenlerine tehdit gördü ve en çok kimsesiz Müslümanlara eziyet ettiler. Habeşli köle Bilal, kızgın kumlara yatırılıp göğsüne taş konduğunda bile "Ehad, Ehad (Allah birdir)" demekten vazgeçmedi. Hz. Ebû Bekir onu satın alıp azat etti. Ammar\'ın annesi Hz. Sümeyye ise inancından dönmediği için şehit edildi ve İslam\'ın ilk şehidi oldu.',
    kid: 'Bazı Mekkeliler Müslümanlara çok kötü davrandı. Bilal\'i sıcak kumlara yatırdılar ama o "Allah birdir" demeye devam etti. Hz. Ebû Bekir Bilal\'i satın alıp özgür bıraktı. Bilal daha sonra ilk ezanı okuyan kişi oldu.',
    q: [
      { q: 'Hz. Bilal işkence altında ne diyordu?', o: ['Ehad, Ehad', 'Elhamdülillah', 'Bismillah', 'Allahu Ekber'] },
      { q: 'Hz. Bilal\'i satın alıp azat eden kimdir?', o: ['Hz. Ebû Bekir', 'Hz. Osman', 'Hz. Hatice', 'Hz. Ömer'] },
      { q: 'İslam\'ın ilk şehidi kimdir?', o: ['Hz. Sümeyye', 'Hz. Hamza', 'Hz. Mus\'ab', 'Hz. Ammar'] },
      { q: 'Peygamberimiz açık davete nerede başladı?', o: ['Safa tepesinde', 'Hira mağarasında', 'Taif\'te', 'Arafat\'ta'] },
    ],
  },
  {
    n: 8, era: 'mekke', year: '615', icon: '⛵', title: 'Habeşistan\'a hicret',
    text: 'Baskılar artınca Peygamberimiz bir grup Müslümanın, adaletiyle tanınan Necâşî\'nin yönettiği Habeşistan\'a gitmesine izin verdi. Mekkeliler onları geri getirmek için elçi gönderdi. Necâşî iki tarafı dinledi. Müslümanlar adına konuşan Cafer b. Ebû Tâlib, İslam\'ın putlardan, yalandan ve zulümden uzaklaştırıp doğruluğa çağırdığını anlattı ve Meryem suresinden ayetler okudu. Necâşî çok etkilendi ve Müslümanları teslim etmeyip korudu.',
    kid: 'Mekke\'de baskı artınca bazı Müslümanlar gemiyle Habeşistan\'a gitti. Oranın kralı Necâşî çok adaletliydi. Cafer adlı sahabe ona Meryem suresini okudu. Necâşî Müslümanları korudu.',
    q: [
      { q: 'Habeşistan\'ın adaletli hükümdarı kimdi?', o: ['Necâşî', 'Herakleios', 'Kisra', 'Ebrehe'] },
      { q: 'Necâşî\'nin huzurunda Müslümanlar adına kim konuştu?', o: ['Cafer b. Ebû Tâlib', 'Hz. Ömer', 'Hz. Bilal', 'Mus\'ab b. Umeyr'] },
      { q: 'Necâşî\'ye hangi sureden ayetler okundu?', o: ['Meryem', 'Yâsîn', 'Fil', 'Kevser'] },
      { q: 'Müslümanlar Habeşistan\'a neden gitti?', o: ['Mekke\'deki baskıdan korunmak için', 'Ticaret yapmak için', 'Savaşmak için', 'Hacca gitmek için'] },
    ],
  },
  {
    n: 9, era: 'mekke', year: '616–619', icon: '🍂', title: 'Boykot ve hüzün yılı',
    text: 'Mekkeli ileri gelenler, Peygamberimizi korumaktan vazgeçmeyen Hâşimoğulları\'na boykot uyguladı: onlarla alışveriş ve evlilik yasaklandı. Müslümanlar ve onları koruyan akrabaları yaklaşık üç yıl Ebû Tâlib mahallesinde açlık ve sıkıntı çekti. Boykotun bitmesinden kısa süre sonra, nübüvvetin 10. yılında, amcası Ebû Tâlib ve Hz. Hatice kısa aralıklarla vefat etti; bu yıla "Hüzün Yılı" denir. Peygamberimiz yardım umuduyla Taif\'e gitti ama taşlandı. Buna rağmen beddua etmedi, onların soyundan iman edecek insanlar çıkması için dua etti. Yorgun hâlde dinlendiği bağda Addâs adlı genç ona üzüm ikram etti.',
    kid: 'Bir dönem Müslümanlarla kimse alışveriş yapmadı, üç yıl çok zor günler geçti. Sonra Peygamberimiz çok sevdiği eşi Hz. Hatice\'yi ve amcasını kaybetti. Taif\'e gittiğinde ona taş attılar, ama o kızmadı; onlar için dua etti.',
    q: [
      { q: 'Boykot yaklaşık kaç yıl sürdü?', o: ['3', '1', '7', '10'] },
      { q: '"Hüzün Yılı" hangi iki vefatla anılır?', o: ['Hz. Hatice ve Ebû Tâlib', 'Hz. Âmine ve Abdülmuttalib', 'Hz. Hamza ve Hz. Sümeyye', 'Hz. Ebû Bekir ve Hz. Ömer'] },
      { q: 'Taif\'te taşlanan Peygamberimiz ne yaptı?', o: ['Onlar için dua etti', 'Beddua etti', 'Savaş açtı', 'Bir daha konuşmadı'] },
      { q: 'Taif\'te Peygamberimize üzüm ikram eden genç kimdir?', o: ['Addâs', 'Zeyd', 'Bilal', 'Enes'] },
    ],
  },
  {
    n: 10, era: 'mekke', year: '620–621 (tahminî)', icon: '🌙', title: 'İsrâ ve Mi\'râc',
    text: 'Hicretten önce bir gece Peygamberimiz Mescid-i Haram\'dan Kudüs\'teki Mescid-i Aksâ\'ya götürüldü (İsrâ), oradan da göklere yükseltildi (Mi\'râc). İsrâ suresinin ilk ayeti bu yolculuğu anlatır. Mi\'râc\'da Müslümanlara günde beş vakit namaz farz kılındı ve Bakara suresinin son iki ayeti hediye edildi. Mekkeliler olayı alaya alınca Hz. Ebû Bekir "O söylediyse doğrudur" dedi; bu yüzden "Sıddîk" (çok doğrulayan) lakabıyla anıldı.',
    kid: 'Bir gece Peygamberimiz Mekke\'den Kudüs\'e, oradan da göklere yükseltildi. Bu yolculuğa İsrâ ve Mi\'râc denir. Beş vakit namaz o gece hediye edildi. Hz. Ebû Bekir hemen inandı; ona "Sıddîk" dendi.',
    q: [
      { q: 'İsrâ yolculuğu hangi iki mescid arasındaydı?', o: ['Mescid-i Haram – Mescid-i Aksâ', 'Kuba – Mescid-i Nebevî', 'Mescid-i Haram – Kuba', 'Mescid-i Nebevî – Mescid-i Aksâ'] },
      { q: 'Mi\'râc\'da hangi ibadet farz kılındı?', o: ['Beş vakit namaz', 'Oruç', 'Zekât', 'Hac'] },
      { q: 'Hz. Ebû Bekir\'in "çok doğrulayan" anlamındaki lakabı nedir?', o: ['Sıddîk', 'Fârûk', 'Zinnûreyn', 'Emîn'] },
      { q: 'Bu yolculuk hangi surenin ilk ayetinde anlatılır?', o: ['İsrâ', 'Necm', 'Kadr', 'Fil'] },
    ],
  },
  {
    n: 11, era: 'mekke', year: '621–622', icon: '🤲', title: 'Akabe biatları',
    text: 'Hac mevsiminde Yesrib\'den (bugünkü Medine) gelen bazı kişiler Peygamberimizle Mina\'daki Akabe mevkiinde buluşup Müslüman oldu. Ertesi yıl on iki kişi Birinci Akabe Biatı\'nı yaptı. Peygamberimiz onlara Kur\'an ve İslam\'ı öğretmesi için Mus\'ab b. Umeyr\'i gönderdi. Mus\'ab\'ın gayretiyle Medine\'de İslam hızla yayıldı ve bir yıl sonra yetmişi aşkın kişi İkinci Akabe Biatı\'nda Peygamberimizi kendi şehirlerinde koruyacaklarına söz verdi. Böylece hicretin yolu açıldı.',
    kid: 'Medine\'den gelen insanlar Akabe denen yerde Peygamberimizle buluşup Müslüman oldu. Peygamberimiz onlara öğretmen olarak Mus\'ab\'ı gönderdi. Medineliler Peygamberimizi korumaya söz verdi.',
    q: [
      { q: 'Medine\'nin eski adı nedir?', o: ['Yesrib', 'Bekke', 'Taif', 'Hayber'] },
      { q: 'Medine\'ye öğretmen olarak kim gönderildi?', o: ['Mus\'ab b. Umeyr', 'Hz. Ali', 'Hz. Bilal', 'Cafer b. Ebû Tâlib'] },
      { q: 'Medinelilerle yapılan biatlar nerede yapıldı?', o: ['Akabe\'de', 'Hira\'da', 'Bedir\'de', 'Kuba\'da'] },
      { q: 'Kaç Akabe Biatı yapıldı?', o: ['İki', 'Bir', 'Üç', 'Beş'] },
    ],
  },
  {
    n: 12, era: 'hicret', year: '622', icon: '🌄', title: 'Hicret',
    text: 'Mekkeliler Peygamberimizi öldürmeye karar verince Allah ona hicret izni verdi. Hz. Ali, Peygamberimizin yatağında yattı; ardından birkaç gün Mekke\'de kalıp Peygamberimize bırakılmış emanetleri sahiplerine teslim etti. Peygamberimiz Hz. Ebû Bekir ile birlikte Sevr mağarasında üç gün saklandı. Peşlerindekiler mağaranın ağzına kadar geldiğinde Hz. Ebû Bekir endişelenince Peygamberimiz "Üzülme, Allah bizimle beraberdir" dedi (Tevbe, 40). Medine\'ye varmadan Kuba\'da, Müslümanların inşa ettiği ilk mescid olan Kuba Mescidi\'ni yaptılar. Hicret, daha sonra Hz. Ömer döneminde Hicrî takvimin başlangıcı kabul edildi.',
    kid: 'Peygamberimiz Hz. Ebû Bekir ile birlikte Mekke\'den Medine\'ye göç etti. Buna hicret denir. Yolda Sevr mağarasında saklandılar. Peygamberimiz arkadaşına "Üzülme, Allah bizimle" dedi. Kuba\'da ilk mescidi yaptılar.',
    q: [
      { q: 'Hicret gecesi Peygamberimizin yatağında kim yattı?', o: ['Hz. Ali', 'Hz. Ebû Bekir', 'Hz. Ömer', 'Zeyd b. Hârise'] },
      { q: 'Hicret yolunda saklanılan mağara hangisidir?', o: ['Sevr', 'Hira', 'Uhud', 'Nur'] },
      { q: 'Hicret sırasında Müslümanların inşa ettiği ilk mescid hangisidir?', o: ['Kuba Mescidi', 'Mescid-i Nebevî', 'Mescid-i Aksâ', 'Mescid-i Kıbleteyn'] },
      { q: 'Hicrî takvimin başlangıcı hangi olaydır?', o: ['Hicret', 'İlk vahiy', 'Mekke\'nin fethi', 'Bedir'] },
    ],
  },
  {
    n: 13, era: 'medine', year: '622', icon: '🕌', title: 'Medine\'de kardeşlik',
    text: 'Medine\'de ilk iş olarak Mescid-i Nebevî inşa edildi; Peygamberimiz taş ve kerpiç taşıyarak bizzat çalıştı. Mekke\'den mallarını bırakıp gelen Müslümanlara "Muhacir", onlara kucak açan Medinelilere "Ensar" (yardımcılar) denir. Peygamberimiz her Muhaciri bir Ensarla kardeş yaptı. Sa\'d b. Rebî\', kardeşi Abdurrahman b. Avf\'a malının yarısını teklif etti; Abdurrahman teşekkür edip "Bana çarşının yolunu göster" dedi ve alın teriyle geçimini kazandı.',
    kid: 'Medine\'de herkes birlikte çalışıp bir mescid yaptı. Mekke\'den gelenlere Muhacir, Medinelilere Ensar denir. Peygamberimiz onları kardeş yaptı. Ensar, sahip olduklarını kardeşleriyle paylaştı.',
    q: [
      { q: 'Mekke\'den Medine\'ye göç edenlere ne denir?', o: ['Muhacir', 'Ensar', 'Ehl-i Suffe', 'Tâbiîn'] },
      { q: 'Medineli Müslümanlara ne denir?', o: ['Ensar', 'Muhacir', 'Hanif', 'Mekkî'] },
      { q: 'Abdurrahman b. Avf, kardeşinden ne istedi?', o: ['Çarşının yolunu göstermesini', 'Malının yarısını', 'Bir ev', 'Bir deve'] },
      { q: 'Medine\'de inşa edilen mescidin adı nedir?', o: ['Mescid-i Nebevî', 'Mescid-i Aksâ', 'Kubbetü\'s-Sahra', 'Mescid-i Haram'] },
    ],
  },
  {
    n: 14, era: 'medine', year: '624', icon: '⚔️', title: 'Bedir',
    text: 'Hicretin ikinci yılı Ramazan ayında Bedir kuyuları yanında yaklaşık 313 Müslüman, sayıları bine yakın Mekke ordusuyla karşılaştı. Az sayıdaki Müslümanlar zafer kazandı. Savaştan sonra esirlere iyi davranılması emredildi. Fidye ödeyemeyen ve okuma yazma bilen esirler, on Müslüman çocuğa okuma yazma öğretirse serbest bırakıldı; rivayete göre yaşanan bu olay, ilme verilen değerin güzel bir örneğidir.',
    kid: 'Bedir\'de az sayıdaki Müslümanlar büyük bir orduya karşı kazandı. Esirlere iyi davranıldı. Okuma yazma bilen esirler, on çocuğa okuma yazma öğretince özgür bırakıldı.',
    q: [
      { q: 'Bedir Savaşı hangi ayda oldu?', o: ['Ramazan', 'Muharrem', 'Zilhicce', 'Recep'] },
      { q: 'Bedir\'de Müslümanların sayısı yaklaşık kaçtı?', o: ['313', '1000', '3000', '70'] },
      { q: 'Okuma yazma bilen esirler nasıl serbest kalabiliyordu?', o: ['On çocuğa okuma yazma öğreterek', 'Altın ödeyerek', 'Bir yıl çalışarak', 'Şiir okuyarak'] },
      { q: 'Bedir Savaşı hangi yıl oldu?', o: ['624', '622', '627', '630'] },
    ],
  },
  {
    n: 15, era: 'medine', year: '625', icon: '🏹', title: 'Uhud ve itaat',
    text: 'Bedir\'in intikamını almak isteyen Mekkeliler ertesi yıl Uhud Dağı eteğine geldi. Peygamberimiz Abdullah b. Cübeyr komutasındaki elli okçuyu bir tepeye yerleştirdi ve "Ne olursa olsun yerinizden ayrılmayın" dedi. Savaşın başında Müslümanlar üstündü; ancak okçuların çoğu savaşın bittiğini sanıp tepeyi bıraktı. Bu boşluktan arkadan saldırılınca Müslümanlar ağır kayıp verdi; Peygamberimizin amcası Hz. Hamza şehit oldu. Uhud, emre itaatin ve sabrın önemini gösteren bir derstir.',
    kid: 'Uhud\'da Peygamberimiz okçulara "Tepeden ayrılmayın" dedi. Bazıları savaşın bittiğini sanıp ayrıldı ve Müslümanlar zor durumda kaldı. Peygamberimizin amcası Hz. Hamza şehit oldu. Bu olay sözü dinlemenin önemini öğretir.',
    q: [
      { q: 'Peygamberimiz okçulara ne emretti?', o: ['Ne olursa olsun tepeden ayrılmamalarını', 'Hemen saldırmalarını', 'Geri çekilmelerini', 'Ganimet toplamalarını'] },
      { q: 'Uhud\'da şehit olan Peygamber amcası kimdir?', o: ['Hz. Hamza', 'Ebû Tâlib', 'Hz. Abbas', 'Ebû Leheb'] },
      { q: 'Uhud Savaşı hangi yıl oldu?', o: ['625', '624', '628', '632'] },
      { q: 'Okçuların komutanı kimdi?', o: ['Abdullah b. Cübeyr', 'Halid b. Velid', 'Hz. Ali', 'Sa\'d b. Muâz'] },
    ],
  },
  {
    n: 16, era: 'medine', year: '627', icon: '🛡️', title: 'Hendek',
    text: 'Mekkeliler ve müttefikleri yaklaşık on bin kişilik bir orduyla Medine\'ye yürüdü. İranlı sahabe Selmân-ı Fârisî, şehrin açık tarafına hendek kazılmasını önerdi; bu, Arapların bilmediği bir savunma yöntemiydi. Peygamberimiz de kazıda herkesle birlikte toprak taşıdı. Hendeği geçemeyen ordu Medine\'yi yaklaşık bir ay kuşattı; sonunda soğuk ve şiddetli bir rüzgâr çadırlarını dağıtınca geri çekildiler.',
    kid: 'Büyük bir ordu Medine\'ye gelince Selman adlı sahabe şehrin önüne hendek kazmayı önerdi. Peygamberimiz de herkesle birlikte kazdı. Düşman hendeği geçemedi ve sert bir rüzgâr çıkınca geri döndü.',
    q: [
      { q: 'Hendek kazma fikri kime aittir?', o: ['Selmân-ı Fârisî', 'Hz. Ömer', 'Hz. Ebû Bekir', 'Hz. Osman'] },
      { q: 'Hendek Savaşı hangi yıl oldu?', o: ['627', '625', '630', '622'] },
      { q: 'Hendeği kimler kazdı?', o: ['Peygamberimiz dâhil herkes birlikte', 'Sadece köleler', 'Sadece Ensar', 'Kiralanan işçiler'] },
      { q: 'Kuşatma nasıl sona erdi?', o: ['Şiddetli rüzgâr düşmanı dağıttı', 'Büyük bir meydan savaşıyla', 'Barış antlaşmasıyla', 'Medine teslim oldu'] },
    ],
  },
  {
    n: 17, era: 'medine', year: '628', icon: '📜', title: 'Hudeybiye barışı',
    text: 'Peygamberimiz ve yaklaşık 1400 sahabe umre yapmak için Mekke\'ye yola çıktı ama Mekkeliler izin vermedi. Hudeybiye\'de bir ağacın altında sahabeler Peygamberimize bağlılık sözü verdi; buna Rıdvan Biatı denir. Ardından on yıl sürecek bir barış antlaşması yapıldı. Şartlar ilk bakışta Müslümanların aleyhine görünse de dönüş yolunda inen Fetih suresi bu barışı "apaçık bir fetih" olarak müjdeledi. Barış ortamında İslam hızla yayıldı.',
    kid: 'Peygamberimiz umre için Mekke\'ye gitmek istedi ama izin verilmedi. Bunun yerine Mekkelilerle on yıllık bir barış antlaşması yaptı. Bu barış sayesinde İslam daha çok insana ulaştı.',
    q: [
      { q: 'Hudeybiye yolculuğunun amacı neydi?', o: ['Umre yapmak', 'Savaşmak', 'Ticaret yapmak', 'Hicret etmek'] },
      { q: 'Hudeybiye Antlaşması kaç yıllık barış öngörüyordu?', o: ['10', '1', '5', '50'] },
      { q: 'Antlaşmadan sonra hangi sure indi?', o: ['Fetih', 'Nasr', 'Kâfirûn', 'Mâide'] },
      { q: 'Ağaç altında verilen bağlılık sözünün adı nedir?', o: ['Rıdvan Biatı', 'Akabe Biatı', 'Veda Biatı', 'Hılfü\'l-Fudûl'] },
    ],
  },
  {
    n: 18, era: 'medine', year: '630', icon: '🕋', title: 'Mekke\'nin fethi',
    text: 'Mekkeliler Hudeybiye Antlaşması\'nı bozunca Peygamberimiz on bin kişilik bir orduyla Mekke\'ye yürüdü ve şehir büyük ölçüde savaşmadan fethedildi. Kâbe\'deki putları kırarken "Hak geldi, bâtıl yok oldu" (İsrâ, 81) ayetini okudu. Yıllarca kendisine eziyet eden Mekkelilere, Hz. Yusuf\'un kardeşlerine söylediği sözü hatırlatarak "Bugün size kınama yok" dedi ve birkaç kişi dışında herkesi affetti. Hz. Bilal, Kâbe\'nin üzerine çıkarak ezan okudu.',
    kid: 'Peygamberimiz Mekke\'ye geri döndüğünde intikam almadı. Ona kötülük yapanların neredeyse hepsini affetti. Hz. Bilal Kâbe\'nin üstünde ezan okudu.',
    q: [
      { q: 'Mekke hangi yıl fethedildi?', o: ['630', '624', '628', '632'] },
      { q: 'Peygamberimiz fetihten sonra Mekkelilere nasıl davrandı?', o: ['Büyük çoğunluğunu affetti', 'Hepsini sürgün etti', 'Mallarını aldı', 'Esir aldı'] },
      { q: 'Fetih günü Kâbe\'nin üzerinde ezanı kim okudu?', o: ['Hz. Bilal', 'Hz. Ali', 'Hz. Ömer', 'Abdullah b. Mes\'ûd'] },
      { q: 'Putlar kırılırken okunan ayet hangisidir?', o: ['"Hak geldi, bâtıl yok oldu."', '"Oku!"', '"Üzülme, Allah bizimle."', '"Bugün dininizi kemale erdirdim."'] },
    ],
  },
  {
    n: 19, era: 'medine', year: '632', icon: '🏔️', title: 'Veda Haccı',
    text: 'Peygamberimiz hicretten sonraki ilk ve tek haccını 632 yılında yüz bini aşkın Müslümanla yaptı. Arafat\'ta ve Mina\'da okuduğu Veda Hutbesi\'nde canların, malların ve namusların dokunulmaz olduğunu bildirdi; kadınların haklarını gözetmeyi emretti; "Arap\'ın Arap olmayana, Arap olmayanın Arap\'a üstünlüğü yoktur; üstünlük ancak takvadadır" dedi. Ümmetine Allah\'ın Kitabı\'nı emanet etti. Bu hac sırasında "Bugün dininizi kemale erdirdim" ayeti (Mâide, 3) indi.',
    kid: 'Peygamberimiz son haccında Arafat\'ta herkese seslendi: "Kimse kimseden üstün değildir; üstünlük Allah\'a saygı ve iyiliktedir." İnsanların canına ve malına dokunulmamasını, kadınların haklarının korunmasını istedi.',
    q: [
      { q: 'Veda Hutbesi nerede okundu?', o: ['Arafat\'ta', 'Taif\'te', 'Kuba\'da', 'Medine\'de'] },
      { q: 'Veda Hutbesi\'ne göre üstünlük neyledir?', o: ['Takvayla', 'Soyla', 'Zenginlikle', 'Dille'] },
      { q: 'Veda Haccı hangi yıl yapıldı?', o: ['632', '630', '628', '622'] },
      { q: 'Veda Haccı\'nda inen ayet hangisidir?', o: ['"Bugün dininizi kemale erdirdim."', '"Oku!"', '"Hak geldi, bâtıl yok oldu."', '"Üzülme, Allah bizimle."'] },
    ],
  },
  {
    n: 20, era: 'medine', year: '632', icon: '🤍', title: 'Vefat ve miras',
    text: 'Peygamberimiz Veda Haccı\'ndan birkaç ay sonra, 632 yılında, kamerî takvime göre 63 yaşında Medine\'de Hz. Âişe\'nin odasında vefat etti. Haberi duyan sahabeler sarsıldı. Hz. Ebû Bekir, "Kim Muhammed\'e ibadet ediyorsa bilsin ki Muhammed vefat etti; kim Allah\'a ibadet ediyorsa bilsin ki Allah diridir, ölmez" diyerek Âl-i İmrân suresinin 144. ayetini okudu ve Müslümanları teskin etti. Ardından ilk halife seçildi. Peygamberimiz geride Kur\'an\'ı, sünnetini ve güzel ahlakını miras bıraktı.',
    kid: 'Peygamberimiz 63 yaşında Medine\'de vefat etti. Herkes çok üzüldü. Hz. Ebû Bekir Müslümanları teselli etti ve ilk halife oldu. Peygamberimiz bize Kur\'an\'ı ve güzel ahlakını bıraktı.',
    q: [
      { q: 'Peygamberimiz kaç yaşında vefat etti?', o: ['63', '40', '53', '70'] },
      { q: 'Peygamberimiz hangi şehirde vefat etti?', o: ['Medine', 'Mekke', 'Taif', 'Kudüs'] },
      { q: 'İlk halife kimdir?', o: ['Hz. Ebû Bekir', 'Hz. Ömer', 'Hz. Osman', 'Hz. Ali'] },
      { q: 'Hz. Ebû Bekir vefat haberinden sonra hangi sureden ayet okudu?', o: ['Âl-i İmrân', 'Yâsîn', 'Mülk', 'Rahmân'] },
    ],
  },
];

export const BADGES = [
  { id: 'ilk', icon: '🌱', name: 'İlk adım', desc: 'İlk dersini bitir' },
  { id: 'tam', icon: '🎯', name: 'Tam isabet', desc: 'Bir testte 3/3 yap' },
  { id: 'seri3', icon: '🔥', name: '3 gün seri', desc: '3 gün üst üste ders yap' },
  { id: 'seri7', icon: '⭐', name: '7 gün seri', desc: '7 gün üst üste ders yap' },
  { id: 'seri30', icon: '🌟', name: '30 gün seri', desc: '30 gün üst üste ders yap' },
  { id: 'mekke', icon: '🕋', name: 'Mekke yılları', desc: 'İlk 11 dersi bitir' },
  { id: 'hicret', icon: '🌄', name: 'Muhacir', desc: 'Hicret dersini bitir' },
  { id: 'medine', icon: '🕌', name: 'Medine yılları', desc: 'Bütün dersleri bitir' },
  { id: 'yaris', icon: '⚡', name: 'İlk yarış', desc: 'Bir yarışı tamamla' },
  { id: 'galip', icon: '🏆', name: 'İlk galibiyet', desc: 'Bir yarış kazan' },
  { id: 'galip10', icon: '👑', name: 'On galibiyet', desc: '10 yarış kazan' },
];

export const SOURCES = [
  'Kur\'ân-ı Kerîm ve meali (Diyanet İşleri Başkanlığı)',
  'İbn Hişâm, es-Sîretü\'n-Nebeviyye',
  'Buhârî, el-Câmiu\'s-Sahîh',
  'TDV İslâm Ansiklopedisi, "Muhammed" maddesi',
  'Diyanet İşleri Başkanlığı, Hz. Muhammed\'in (s.a.v.) Hayatı',
];

// Yarış soru havuzu: { id, lesson, q, o } (o[0] doğru)
export const POOL = LESSONS.flatMap((l) => l.q.map((x, i) => ({ id: l.n * 10 + i + 1, lesson: l.n, ...x })));
export const byId = (id) => POOL.find((x) => x.id === id);

export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

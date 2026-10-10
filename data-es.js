// Siyer Yolu · contenido de las lecciones en español
// Misma estructura que data.js: la respuesta correcta es SIEMPRE la primera opción (la aplicación las mezcla).
// Los números de lección y el orden de las preguntas coinciden con la versión turca: el servidor usa los mismos identificadores.

export const ERAS = { mekke: 'Los años de La Meca', hicret: 'La Hégira', medine: 'Los años de Medina' };

export const LESSONS = [
  {
    n: 1, era: 'mekke', year: '571', icon: '🐘', title: 'El Año del Elefante y el nacimiento',
    text: 'El Profeta Muhammad (s.a.w.) nació en La Meca en el año 571. Ese año es el mismo en que Abraha, gobernador de Yemen, llegó con un ejército de elefantes para destruir la Kaaba y no lo consiguió; por eso se le conoce como el "Año del Elefante", y el suceso se narra en la sura Al-Fil del Corán. Su padre, Abdullah, había fallecido unos meses antes de su nacimiento. Su madre, Amina, dio la buena noticia a su abuelo Abd al-Muttalib. El abuelo le puso un nombre poco común entre los árabes: Muhammad, que significa "el muy alabado".',
    kid: 'El Profeta Muhammad (s.a.w.) nació en la ciudad de La Meca. Al año de su nacimiento se le llama "Año del Elefante", porque ese año un ejército que venía con elefantes tuvo que volver sin poder dañar la Kaaba. Su madre se llamaba Amina. Su abuelo le puso el nombre de Muhammad, que significa "el muy alabado".',
    q: [
      { q: '¿En qué año nació el Profeta?', o: ['571', '610', '622', '632'] },
      { q: '¿Con qué nombre se conoce el año de su nacimiento?', o: ['Año del Elefante', 'Año de la Tristeza', 'Año de la Hégira', 'Año de la Despedida'] },
      { q: '¿Cómo se llamaba la madre del Profeta?', o: ['Amina', 'Halima', 'Jadiya', 'Fátima'] },
      { q: '¿Quién le puso el nombre de "Muhammad"?', o: ['Su abuelo Abd al-Muttalib', 'Su tío Abu Tálib', 'Su nodriza Halima', 'Waraqa ibn Náwfal'] },
    ],
  },
  {
    n: 2, era: 'mekke', year: '571–595', icon: '🐑', title: 'Una infancia huérfana',
    text: 'Los mequíes entregaban a sus hijos a nodrizas del desierto para que crecieran con aire puro y aprendieran un árabe correcto. La nodriza del Profeta fue Halima, de la tribu de los Banu Sa\'d. Cuando tenía seis años, su madre Amina falleció en un lugar llamado Abwa, al regresar de Medina. Durante dos años lo crio su abuelo Abd al-Muttalib; cuando también murió el abuelo, lo tomó bajo su protección su tío Abu Tálib. En su juventud trabajó un tiempo como pastor, cuidando las ovejas de los mequíes.',
    kid: 'De pequeño, el Profeta creció en el desierto junto a su nodriza Halima. A los seis años perdió a su madre. Primero su abuelo y después su tío Abu Tálib lo cuidaron con mucho cariño. De joven fue pastor y cuidaba ovejas.',
    q: [
      { q: '¿Quién fue la nodriza del Profeta?', o: ['Halima', 'Amina', 'Sumayya', 'Aisha'] },
      { q: '¿Cuántos años tenía el Profeta cuando falleció su madre?', o: ['6', '2', '12', '25'] },
      { q: 'Tras la muerte de su abuelo, ¿quién lo protegió?', o: ['Su tío Abu Tálib', 'Su tío Hamza', 'Abu Bakr', 'Zayd ibn Háritha'] },
      { q: '¿Qué trabajo hizo el Profeta en su juventud?', o: ['Pastor', 'Herrero', 'Pescador', 'Agricultor'] },
    ],
  },
  {
    n: 3, era: 'mekke', year: '590–605', icon: '🤝', title: 'El hombre de confianza: al-Amín',
    text: 'El joven Muhammad participó en el Hilf al-Fudul (la Alianza de los Virtuosos), un pacto para ayudar a cualquier persona que sufriera una injusticia, fuera quien fuera. Por su honradez, los mequíes lo llamaban "al-Amín", es decir, el digno de confianza. Cuando tenía 35 años, mientras se reparaba la Kaaba, las tribus estuvieron a punto de pelear por decidir quién colocaría la Piedra Negra en su lugar. Elegido como árbitro, el Profeta extendió su manto en el suelo, puso la piedra encima y pidió que el jefe de cada tribu sujetara un extremo del manto. Luego colocó la piedra con sus propias manos; así el problema se resolvió sin derramar sangre.',
    kid: 'Los mequíes llamaban al Profeta "al-Amín", que significa "el de confianza", porque nunca mentía. Un día las tribus discutían por quién pondría en su sitio la Piedra Negra de la Kaaba. El Profeta extendió su manto, puso la piedra encima y cada uno sujetó una punta. Así nadie se enojó.',
    q: [
      { q: '¿Qué sobrenombre le dieron los mequíes al Profeta?', o: ['al-Amín', 'as-Siddiq', 'al-Faruq', 'Sayfullah'] },
      { q: '¿Para qué se creó el Hilf al-Fudul?', o: ['Para ayudar a quien sufría una injusticia', 'Para organizar caravanas comerciales', 'Para reparar la Kaaba', 'Para un concurso de poesía'] },
      { q: '¿Cómo resolvió la disputa de la Piedra Negra?', o: ['Extendió su manto y las tribus la llevaron juntas', 'Lo echó a suertes', 'Eligió al jefe más anciano', 'Dejó la piedra donde estaba'] },
      { q: '¿Cuántos años tenía el Profeta cuando se reparó la Kaaba?', o: ['35', '25', '40', '53'] },
    ],
  },
  {
    n: 4, era: 'mekke', year: '595', icon: '🐪', title: 'Un hogar con Jadiya',
    text: 'Jadiya, una de las comerciantes más respetadas de La Meca, oyó hablar de la honradez del Profeta y le pidió que llevara su caravana comercial a Siria (Sham). Las ganancias bendecidas del viaje y el buen carácter del Profeta impresionaron mucho a Jadiya. A los 25 años, el Profeta se casó con Jadiya, que era mayor que él. De este matrimonio nacieron Qásim, Zaynab, Ruqayya, Umm Kulthum, Fátima y Abdullah. Jadiya fue durante toda su vida su mayor apoyo.',
    kid: 'Jadiya era una comerciante muy respetada. Al ver lo honrado que era el Profeta, quiso casarse con él. El Profeta se casó con Jadiya a los 25 años. Una de sus hijas es Fátima.',
    q: [
      { q: '¿A qué edad se casó el Profeta con Jadiya?', o: ['25', '20', '35', '40'] },
      { q: '¿A qué se dedicaba Jadiya?', o: ['Al comercio', 'A la enseñanza', 'A la medicina', 'Al tejido'] },
      { q: '¿A dónde llevó el Profeta la caravana de Jadiya?', o: ['Siria (Sham)', 'Yemen', 'Egipto', 'Bagdad'] },
      { q: '¿Cuál de estas personas es hija del Profeta?', o: ['Fátima', 'Amina', 'Halima', 'Sumayya'] },
    ],
  },
  {
    n: 5, era: 'mekke', year: '610', icon: '⛰️', title: 'La primera revelación en Hira',
    text: 'De vez en cuando el Profeta se retiraba a meditar en la cueva de Hira, en el Monte de la Luz (Yabal an-Nur). En el mes de Ramadán del año 610, cuando tenía 40 años, vino el ángel de la revelación, Yibril (Gabriel), y le dijo: "¡Lee!". Así descendieron las cinco primeras aleyas de la sura Al-Alaq: "¡Lee en el nombre de tu Señor, que ha creado!". El Profeta volvió a casa conmovido y dijo: "Cúbranme". Jadiya lo consoló: "Allah nunca te avergonzará; tú cuidas de tus parientes y ayudas a quien lleva una carga". Después lo llevó a ver a su primo, Waraqa ibn Náwfal.',
    kid: 'Mientras el Profeta meditaba en la cueva de Hira, vino el ángel Yibril y le dijo: "¡Lee!". Así descendieron las primeras aleyas del Corán. El Profeta tenía entonces 40 años. Al volver a casa, Jadiya lo consoló con mucho cariño.',
    q: [
      { q: '¿En qué cueva llegó la primera revelación?', o: ['Hira', 'Thawr', 'Uhud', 'Safa'] },
      { q: '¿En qué sura están las primeras aleyas reveladas?', o: ['Al-Alaq', 'Al-Fátiha', 'Al-Fil', 'Al-Ijlás'] },
      { q: '¿Cuántos años tenía el Profeta cuando llegó la primera revelación?', o: ['40', '25', '35', '53'] },
      { q: '¿Cómo se llama el ángel de la revelación?', o: ['Yibril (Gabriel)', 'Mikail', 'Israfil', 'Azrail'] },
    ],
  },
  {
    n: 6, era: 'mekke', year: '610–613', icon: '🌱', title: 'Los primeros musulmanes',
    text: 'La primera persona en creer fue Jadiya. El primer musulmán entre los hombres adultos fue Abu Bakr; entre los niños, Ali; y entre los esclavos liberados, Zayd ibn Háritha. Por invitación de Abu Bakr también se hicieron musulmanes Uthmán, Abd ar-Rahmán ibn Awf, Talha, Zubayr y Sa\'d ibn Abi Waqqás. Durante los tres primeros años la predicación del Islam se hizo en secreto; los musulmanes se reunían en la casa de al-Arqam, cerca de la colina de Safa (Dar al-Arqam), para aprender el Corán.',
    kid: 'La primera persona que creyó en el Profeta fue su esposa Jadiya. Su amigo Abu Bakr y el pequeño Ali también creyeron enseguida. Los primeros musulmanes se reunían en secreto en la casa de un compañero llamado al-Arqam para aprender el Corán.',
    q: [
      { q: '¿Quién fue la primera persona en creer?', o: ['Jadiya', 'Abu Bakr', 'Ali', 'Umar'] },
      { q: '¿Quién fue el primer musulmán entre los niños?', o: ['Ali', 'Zayd ibn Háritha', 'Uthmán', 'Hamza'] },
      { q: '¿De quién era la casa donde se reunían en secreto los musulmanes?', o: ['De al-Arqam', 'De Abu Tálib', 'De Waraqa', 'De Abu Yahl'] },
      { q: '¿Quién se hizo musulmán por invitación de Abu Bakr?', o: ['Uthmán', 'Hamza', 'Umar', 'Jálid ibn al-Walid'] },
    ],
  },
  {
    n: 7, era: 'mekke', year: '613–615', icon: '🪨', title: 'El nombre de la paciencia: Bilal',
    text: 'Por orden de Allah, la predicación comenzó a hacerse en público; el Profeta subió a la colina de Safa y llamó a los mequíes. Los notables idólatras vieron en esta predicación una amenaza para su orden y maltrataron sobre todo a los musulmanes que no tenían quien los protegiera. Bilal, un esclavo abisinio, no dejó de decir "Ahad, Ahad (Allah es Uno)" ni siquiera cuando lo tendieron sobre la arena ardiente y le pusieron una piedra sobre el pecho. Abu Bakr lo compró y lo liberó. Sumayya, madre de Ammar, murió mártir por no renunciar a su fe y se convirtió en la primera mártir del Islam.',
    kid: 'Algunos mequíes trataron muy mal a los musulmanes. Acostaron a Bilal sobre la arena caliente, pero él seguía diciendo "Allah es Uno". Abu Bakr compró a Bilal y lo dejó libre. Más tarde Bilal fue el primero en hacer el adhán, la llamada a la oración.',
    q: [
      { q: '¿Qué decía Bilal mientras lo torturaban?', o: ['Ahad, Ahad', 'Alhamdulillah', 'Bismillah', 'Allahu Akbar'] },
      { q: '¿Quién compró a Bilal y lo liberó?', o: ['Abu Bakr', 'Uthmán', 'Jadiya', 'Umar'] },
      { q: '¿Quién fue la primera persona en morir mártir en el Islam?', o: ['Sumayya', 'Hamza', 'Mus\'ab', 'Ammar'] },
      { q: '¿Dónde comenzó el Profeta la predicación pública?', o: ['En la colina de Safa', 'En la cueva de Hira', 'En Táif', 'En Arafat'] },
    ],
  },
  {
    n: 8, era: 'mekke', year: '615', icon: '⛵', title: 'La emigración a Abisinia',
    text: 'Cuando aumentó la presión, el Profeta permitió que un grupo de musulmanes fuera a Abisinia (la actual Etiopía), gobernada por el Nayashi (el Negus), conocido por su justicia. Los mequíes enviaron emisarios para traerlos de vuelta. El Nayashi escuchó a ambas partes. Yáfar ibn Abi Tálib, que habló en nombre de los musulmanes, explicó que el Islam los había alejado de los ídolos, de la mentira y de la injusticia y los llamaba a la verdad, y recitó aleyas de la sura Maryam. El Nayashi se conmovió mucho y, en lugar de entregarlos, protegió a los musulmanes.',
    kid: 'Cuando la presión en La Meca aumentó, algunos musulmanes fueron en barco a Abisinia. Su rey, el Nayashi, era muy justo. Un compañero llamado Yáfar le recitó la sura Maryam. El Nayashi protegió a los musulmanes.',
    q: [
      { q: '¿Quién era el justo gobernante de Abisinia?', o: ['El Nayashi (Negus)', 'Heraclio', 'Cosroes', 'Abraha'] },
      { q: '¿Quién habló en nombre de los musulmanes ante el Nayashi?', o: ['Yáfar ibn Abi Tálib', 'Umar', 'Bilal', 'Mus\'ab ibn Umayr'] },
      { q: '¿De qué sura se recitaron aleyas ante el Nayashi?', o: ['Maryam', 'Yasín', 'Al-Fil', 'Al-Kawthar'] },
      { q: '¿Por qué fueron los musulmanes a Abisinia?', o: ['Para protegerse de la presión en La Meca', 'Para comerciar', 'Para luchar', 'Para hacer la peregrinación'] },
    ],
  },
  {
    n: 9, era: 'mekke', year: '616–619', icon: '🍂', title: 'El boicot y el Año de la Tristeza',
    text: 'Los notables de La Meca impusieron un boicot a los Banu Háshim, que no dejaban de proteger al Profeta: se prohibió comerciar y casarse con ellos. Durante unos tres años, los musulmanes y los parientes que los protegían sufrieron hambre y penurias en el barrio de Abu Tálib. Poco después del fin del boicot, en el décimo año de la profecía, fallecieron con poco tiempo de diferencia su tío Abu Tálib y Jadiya; a ese año se le llama el "Año de la Tristeza". El Profeta fue a Táif con la esperanza de encontrar ayuda, pero lo apedrearon. Aun así no los maldijo: pidió a Allah que de sus descendientes salieran personas creyentes. Mientras descansaba agotado en un viñedo, un joven llamado Addás le ofreció uvas.',
    kid: 'Durante un tiempo nadie quiso comerciar con los musulmanes, y pasaron tres años muy difíciles. Después el Profeta perdió a su querida esposa Jadiya y a su tío. Cuando fue a Táif le tiraron piedras, pero él no se enojó: rezó por ellos.',
    q: [
      { q: '¿Cuántos años duró aproximadamente el boicot?', o: ['3', '1', '7', '10'] },
      { q: '¿Qué dos fallecimientos recuerda el "Año de la Tristeza"?', o: ['Jadiya y Abu Tálib', 'Amina y Abd al-Muttalib', 'Hamza y Sumayya', 'Abu Bakr y Umar'] },
      { q: '¿Qué hizo el Profeta cuando lo apedrearon en Táif?', o: ['Rezó por ellos', 'Los maldijo', 'Les declaró la guerra', 'No volvió a hablarles'] },
      { q: '¿Quién fue el joven que le ofreció uvas en Táif?', o: ['Addás', 'Zayd', 'Bilal', 'Anas'] },
    ],
  },
  {
    n: 10, era: 'mekke', year: '620–621 (aprox.)', icon: '🌙', title: 'El Isra y el Miray',
    text: 'Antes de la Hégira, una noche el Profeta fue llevado desde la Mezquita Sagrada (al-Masyid al-Haram) hasta la Mezquita al-Aqsa de Jerusalén (el Isra), y desde allí fue elevado a los cielos (el Miray). La primera aleya de la sura Al-Isra narra este viaje. En el Miray se prescribieron a los musulmanes las cinco oraciones diarias, y se les regalaron las dos últimas aleyas de la sura Al-Báqara. Cuando los mequíes se burlaron del suceso, Abu Bakr dijo: "Si él lo ha dicho, es verdad"; por eso se le conoce como "as-Siddiq" (el que confirma la verdad).',
    kid: 'Una noche el Profeta fue llevado de La Meca a Jerusalén, y desde allí subió a los cielos. A este viaje se le llama Isra y Miray. Esa noche Allah regaló a los musulmanes las cinco oraciones diarias. Abu Bakr lo creyó enseguida, y por eso lo llamaron "as-Siddiq".',
    q: [
      { q: '¿Entre qué dos mezquitas fue el viaje del Isra?', o: ['Mezquita Sagrada – Mezquita al-Aqsa', 'Quba – Mezquita del Profeta', 'Mezquita Sagrada – Quba', 'Mezquita del Profeta – Mezquita al-Aqsa'] },
      { q: '¿Qué acto de adoración se prescribió en el Miray?', o: ['Las cinco oraciones diarias', 'El ayuno', 'El zakat', 'La peregrinación'] },
      { q: '¿Cuál es el sobrenombre de Abu Bakr que significa "el que confirma la verdad"?', o: ['as-Siddiq', 'al-Faruq', 'Dhun-Nurayn', 'al-Amín'] },
      { q: '¿En la primera aleya de qué sura se narra este viaje?', o: ['Al-Isra', 'An-Naym', 'Al-Qadr', 'Al-Fil'] },
    ],
  },
  {
    n: 11, era: 'mekke', year: '621–622', icon: '🤲', title: 'Los juramentos de Aqaba',
    text: 'Durante la temporada de peregrinación, algunas personas venidas de Yathrib (la actual Medina) se encontraron con el Profeta en Aqaba, en Mina, y se hicieron musulmanes. Al año siguiente, doce personas hicieron el Primer Juramento de Aqaba. El Profeta envió con ellos a Mus\'ab ibn Umayr para que les enseñara el Corán y el Islam. Gracias al esfuerzo de Mus\'ab, el Islam se extendió rápidamente en Medina, y un año después más de setenta personas prometieron en el Segundo Juramento de Aqaba proteger al Profeta en su ciudad. Así se abrió el camino de la Hégira.',
    kid: 'Personas que venían de Medina se encontraron con el Profeta en un lugar llamado Aqaba y se hicieron musulmanas. El Profeta les envió a Mus\'ab como maestro. La gente de Medina prometió proteger al Profeta.',
    q: [
      { q: '¿Cuál era el nombre antiguo de Medina?', o: ['Yathrib', 'Bakka', 'Táif', 'Jaybar'] },
      { q: '¿A quién se envió a Medina como maestro?', o: ['Mus\'ab ibn Umayr', 'Ali', 'Bilal', 'Yáfar ibn Abi Tálib'] },
      { q: '¿Dónde se hicieron los juramentos con la gente de Medina?', o: ['En Aqaba', 'En Hira', 'En Badr', 'En Quba'] },
      { q: '¿Cuántos juramentos de Aqaba hubo?', o: ['Dos', 'Uno', 'Tres', 'Cinco'] },
    ],
  },
  {
    n: 12, era: 'hicret', year: '622', icon: '🌄', title: 'La Hégira',
    text: 'Cuando los mequíes decidieron matar al Profeta, Allah le dio permiso para emigrar. Ali se acostó en la cama del Profeta; después se quedó unos días en La Meca para devolver a sus dueños los bienes que le habían confiado al Profeta. El Profeta y Abu Bakr se escondieron tres días en la cueva de Thawr. Cuando sus perseguidores llegaron hasta la entrada de la cueva y Abu Bakr se inquietó, el Profeta le dijo: "No te entristezcas, Allah está con nosotros" (At-Tawba, 40). Antes de llegar a Medina, en Quba, construyeron la Mezquita de Quba, la primera mezquita levantada por los musulmanes. Más tarde, en tiempos de Umar, la Hégira se tomó como inicio del calendario islámico.',
    kid: 'El Profeta emigró de La Meca a Medina junto con Abu Bakr. A esto se le llama Hégira. Por el camino se escondieron en la cueva de Thawr. El Profeta le dijo a su amigo: "No te entristezcas, Allah está con nosotros". En Quba construyeron la primera mezquita.',
    q: [
      { q: '¿Quién se acostó en la cama del Profeta la noche de la Hégira?', o: ['Ali', 'Abu Bakr', 'Umar', 'Zayd ibn Háritha'] },
      { q: '¿En qué cueva se escondieron durante la Hégira?', o: ['Thawr', 'Hira', 'Uhud', 'Nur'] },
      { q: '¿Cuál fue la primera mezquita construida por los musulmanes durante la Hégira?', o: ['La Mezquita de Quba', 'La Mezquita del Profeta', 'La Mezquita al-Aqsa', 'La Mezquita de las Dos Qiblas'] },
      { q: '¿Qué suceso marca el inicio del calendario islámico?', o: ['La Hégira', 'La primera revelación', 'La conquista de La Meca', 'La batalla de Badr'] },
    ],
  },
  {
    n: 13, era: 'medine', year: '622', icon: '🕌', title: 'Hermandad en Medina',
    text: 'Lo primero que se hizo en Medina fue construir la Mezquita del Profeta (al-Masyid an-Nabawi); el Profeta trabajó él mismo cargando piedras y adobes. A los musulmanes que llegaron de La Meca dejando atrás sus bienes se les llama "Muhayirun" (emigrantes), y a los habitantes de Medina que los acogieron, "Ansar" (auxiliares). El Profeta hermanó a cada emigrante con un ansari. Sa\'d ibn ar-Rabí ofreció la mitad de sus bienes a su hermano Abd ar-Rahmán ibn Awf; Abd ar-Rahmán le dio las gracias y le dijo: "Muéstrame el camino al mercado", y se ganó la vida con el sudor de su frente.',
    kid: 'En Medina todos trabajaron juntos para construir una mezquita. A los que llegaron de La Meca se les llama Muhayirun, y a la gente de Medina, Ansar. El Profeta los hizo hermanos. Los Ansar compartieron lo que tenían con sus hermanos.',
    q: [
      { q: '¿Cómo se llama a quienes emigraron de La Meca a Medina?', o: ['Muhayirun', 'Ansar', 'Ahl as-Suffa', 'Tabiun'] },
      { q: '¿Cómo se llama a los musulmanes de Medina?', o: ['Ansar', 'Muhayirun', 'Hanif', 'Mequíes'] },
      { q: '¿Qué le pidió Abd ar-Rahmán ibn Awf a su hermano?', o: ['Que le mostrara el camino al mercado', 'La mitad de sus bienes', 'Una casa', 'Un camello'] },
      { q: '¿Cómo se llama la mezquita construida en Medina?', o: ['La Mezquita del Profeta', 'La Mezquita al-Aqsa', 'La Cúpula de la Roca', 'La Mezquita Sagrada'] },
    ],
  },
  {
    n: 14, era: 'medine', year: '624', icon: '⚔️', title: 'Badr',
    text: 'En el mes de Ramadán del segundo año de la Hégira, junto a los pozos de Badr, unos 313 musulmanes se enfrentaron a un ejército mequí de casi mil hombres. Los musulmanes, siendo pocos, obtuvieron la victoria. Después de la batalla se ordenó tratar bien a los prisioneros. Los prisioneros que no podían pagar rescate y sabían leer y escribir eran liberados si enseñaban a leer y escribir a diez niños musulmanes; este suceso, que recogen las narraciones, es un hermoso ejemplo del valor que se da al conocimiento.',
    kid: 'En Badr, unos pocos musulmanes ganaron frente a un gran ejército. A los prisioneros se los trató bien. Los prisioneros que sabían leer y escribir quedaban libres después de enseñar a leer y escribir a diez niños.',
    q: [
      { q: '¿En qué mes fue la batalla de Badr?', o: ['Ramadán', 'Muharram', 'Dhul-Hiyya', 'Rayab'] },
      { q: '¿Cuántos musulmanes había aproximadamente en Badr?', o: ['313', '1000', '3000', '70'] },
      { q: '¿Cómo podían quedar libres los prisioneros que sabían leer y escribir?', o: ['Enseñando a leer y escribir a diez niños', 'Pagando oro', 'Trabajando un año', 'Recitando poesía'] },
      { q: '¿En qué año fue la batalla de Badr?', o: ['624', '622', '627', '630'] },
    ],
  },
  {
    n: 15, era: 'medine', year: '625', icon: '🏹', title: 'Uhud y la obediencia',
    text: 'Los mequíes, queriendo vengar Badr, llegaron al año siguiente a las faldas del monte Uhud. El Profeta colocó a cincuenta arqueros al mando de Abdullah ibn Yubayr sobre una colina y les dijo: "Pase lo que pase, no abandonen su puesto". Al comienzo de la batalla los musulmanes llevaban ventaja; pero la mayoría de los arqueros creyó que la batalla había terminado y dejó la colina. Al ser atacados por la espalda a través de ese hueco, los musulmanes sufrieron graves pérdidas; Hamza, el tío del Profeta, murió como mártir. Uhud es una lección sobre la importancia de obedecer las órdenes y de la paciencia.',
    kid: 'En Uhud, el Profeta dijo a los arqueros: "No se vayan de la colina". Algunos pensaron que la batalla había terminado y se fueron, y los musulmanes pasaron por un momento difícil. Hamza, el tío del Profeta, murió como mártir. Esta historia nos enseña lo importante que es escuchar y obedecer.',
    q: [
      { q: '¿Qué ordenó el Profeta a los arqueros?', o: ['No abandonar la colina pasara lo que pasara', 'Atacar de inmediato', 'Retirarse', 'Recoger el botín'] },
      { q: '¿Qué tío del Profeta murió como mártir en Uhud?', o: ['Hamza', 'Abu Tálib', 'Al-Abbás', 'Abu Lahab'] },
      { q: '¿En qué año fue la batalla de Uhud?', o: ['625', '624', '628', '632'] },
      { q: '¿Quién era el comandante de los arqueros?', o: ['Abdullah ibn Yubayr', 'Jálid ibn al-Walid', 'Ali', 'Sa\'d ibn Muadh'] },
    ],
  },
  {
    n: 16, era: 'medine', year: '627', icon: '🛡️', title: 'La Trinchera',
    text: 'Los mequíes y sus aliados marcharon sobre Medina con un ejército de unos diez mil hombres. Salmán al-Farisi, un compañero de origen persa, propuso cavar una trinchera en el lado abierto de la ciudad; era un método de defensa que los árabes no conocían. El Profeta también cargó tierra junto a todos durante la excavación. El ejército, incapaz de cruzar la trinchera, sitió Medina durante casi un mes; al final, cuando un viento frío y fuerte deshizo sus tiendas, se retiraron.',
    kid: 'Cuando un gran ejército llegó a Medina, un compañero llamado Salmán propuso cavar una trinchera delante de la ciudad. El Profeta también cavó junto a todos. El enemigo no pudo cruzar la trinchera y, cuando sopló un viento fuerte, se marchó.',
    q: [
      { q: '¿De quién fue la idea de cavar la trinchera?', o: ['Salmán al-Farisi', 'Umar', 'Abu Bakr', 'Uthmán'] },
      { q: '¿En qué año fue la batalla de la Trinchera?', o: ['627', '625', '630', '622'] },
      { q: '¿Quiénes cavaron la trinchera?', o: ['Todos juntos, incluido el Profeta', 'Solo los esclavos', 'Solo los Ansar', 'Trabajadores contratados'] },
      { q: '¿Cómo terminó el asedio?', o: ['Un viento fuerte dispersó al enemigo', 'Con una gran batalla campal', 'Con un tratado de paz', 'Medina se rindió'] },
    ],
  },
  {
    n: 17, era: 'medine', year: '628', icon: '📜', title: 'La paz de Hudaybiya',
    text: 'El Profeta y unos 1400 compañeros partieron hacia La Meca para hacer la umra (peregrinación menor), pero los mequíes no se lo permitieron. En Hudaybiya, bajo un árbol, los compañeros juraron lealtad al Profeta; a esto se le llama el Juramento de Ridwán. Después se firmó un tratado de paz que debía durar diez años. Aunque a primera vista las condiciones parecían desfavorables para los musulmanes, la sura Al-Fath, revelada en el camino de regreso, anunció esta paz como "una victoria evidente". En un ambiente de paz, el Islam se extendió rápidamente.',
    kid: 'El Profeta quería ir a La Meca para hacer la umra, pero no lo dejaron. En su lugar, firmó con los mequíes un tratado de paz de diez años. Gracias a esa paz, el Islam llegó a mucha más gente.',
    q: [
      { q: '¿Cuál era el objetivo del viaje a Hudaybiya?', o: ['Hacer la umra', 'Luchar', 'Comerciar', 'Emigrar'] },
      { q: '¿Cuántos años de paz establecía el Tratado de Hudaybiya?', o: ['10', '1', '5', '50'] },
      { q: '¿Qué sura se reveló después del tratado?', o: ['Al-Fath', 'An-Nasr', 'Al-Káfirún', 'Al-Máida'] },
      { q: '¿Cómo se llama el juramento de lealtad hecho bajo el árbol?', o: ['El Juramento de Ridwán', 'El Juramento de Aqaba', 'El Juramento de Despedida', 'El Hilf al-Fudul'] },
    ],
  },
  {
    n: 18, era: 'medine', year: '630', icon: '🕋', title: 'La conquista de La Meca',
    text: 'Cuando los mequíes rompieron el Tratado de Hudaybiya, el Profeta marchó sobre La Meca con un ejército de diez mil hombres, y la ciudad fue conquistada en gran medida sin combate. Mientras derribaba los ídolos de la Kaaba recitaba la aleya: "Ha llegado la verdad y se ha desvanecido la falsedad" (Al-Isra, 81). A los mequíes que lo habían perseguido durante años les recordó las palabras que el profeta Yusuf (José) dijo a sus hermanos: "Hoy no hay reproche contra ustedes", y perdonó a todos salvo a unas pocas personas. Bilal subió a lo alto de la Kaaba y llamó a la oración.',
    kid: 'Cuando el Profeta volvió a La Meca, no se vengó. Perdonó a casi todos los que le habían hecho daño. Bilal hizo la llamada a la oración desde lo alto de la Kaaba.',
    q: [
      { q: '¿En qué año fue conquistada La Meca?', o: ['630', '624', '628', '632'] },
      { q: '¿Cómo trató el Profeta a los mequíes tras la conquista?', o: ['Perdonó a la gran mayoría', 'Los desterró a todos', 'Les quitó sus bienes', 'Los hizo prisioneros'] },
      { q: '¿Quién llamó a la oración desde lo alto de la Kaaba el día de la conquista?', o: ['Bilal', 'Ali', 'Umar', 'Abdullah ibn Mas\'ud'] },
      { q: '¿Qué aleya se recitó mientras se derribaban los ídolos?', o: ['"Ha llegado la verdad y se ha desvanecido la falsedad."', '"¡Lee!"', '"No te entristezcas, Allah está con nosotros."', '"Hoy les he perfeccionado su religión."'] },
    ],
  },
  {
    n: 19, era: 'medine', year: '632', icon: '🏔️', title: 'La Peregrinación de Despedida',
    text: 'En el año 632 el Profeta hizo su primera y única peregrinación (hayy) después de la Hégira, junto con más de cien mil musulmanes. En el Sermón de Despedida, pronunciado en Arafat y en Mina, declaró inviolables las vidas, los bienes y el honor de las personas; ordenó respetar los derechos de las mujeres; y dijo: "Ningún árabe es superior a un no árabe, ni un no árabe a un árabe; la superioridad está solo en la piedad (taqwa)". Confió a su comunidad el Libro de Allah. Durante esta peregrinación se reveló la aleya "Hoy les he perfeccionado su religión" (Al-Máida, 3).',
    kid: 'En su última peregrinación, el Profeta habló a todos en Arafat: "Nadie es superior a nadie; la superioridad está en el respeto a Allah y en hacer el bien". Pidió que se respetaran la vida y los bienes de las personas, y que se protegieran los derechos de las mujeres.',
    q: [
      { q: '¿Dónde se pronunció el Sermón de Despedida?', o: ['En Arafat', 'En Táif', 'En Quba', 'En Medina'] },
      { q: 'Según el Sermón de Despedida, ¿en qué está la superioridad?', o: ['En la piedad (taqwa)', 'En el linaje', 'En la riqueza', 'En el idioma'] },
      { q: '¿En qué año fue la Peregrinación de Despedida?', o: ['632', '630', '628', '622'] },
      { q: '¿Qué aleya se reveló durante la Peregrinación de Despedida?', o: ['"Hoy les he perfeccionado su religión."', '"¡Lee!"', '"Ha llegado la verdad y se ha desvanecido la falsedad."', '"No te entristezcas, Allah está con nosotros."'] },
    ],
  },
  {
    n: 20, era: 'medine', year: '632', icon: '🤍', title: 'Su fallecimiento y su legado',
    text: 'Unos meses después de la Peregrinación de Despedida, en el año 632, el Profeta falleció en Medina, en la habitación de Aisha, a los 63 años según el calendario lunar. Los compañeros que oyeron la noticia quedaron conmocionados. Abu Bakr dijo: "Quien adoraba a Muhammad, que sepa que Muhammad ha muerto; quien adora a Allah, que sepa que Allah está vivo y no muere", recitó la aleya 144 de la sura Al Imrán y tranquilizó a los musulmanes. Después fue elegido primer califa. El Profeta dejó como legado el Corán, su sunna y su buen carácter.',
    kid: 'El Profeta falleció en Medina a los 63 años. Todos se pusieron muy tristes. Abu Bakr consoló a los musulmanes y fue el primer califa. El Profeta nos dejó el Corán y su buen carácter.',
    q: [
      { q: '¿A qué edad falleció el Profeta?', o: ['63', '40', '53', '70'] },
      { q: '¿En qué ciudad falleció el Profeta?', o: ['Medina', 'La Meca', 'Táif', 'Jerusalén'] },
      { q: '¿Quién fue el primer califa?', o: ['Abu Bakr', 'Umar', 'Uthmán', 'Ali'] },
      { q: 'Tras la noticia del fallecimiento, ¿de qué sura recitó Abu Bakr una aleya?', o: ['Al Imrán', 'Yasín', 'Al-Mulk', 'Ar-Rahmán'] },
    ],
  },
];

export const BADGES = [
  { id: 'ilk', icon: '🌱', name: 'Primer paso', desc: 'Termina tu primera lección' },
  { id: 'tam', icon: '🎯', name: 'Puntaje perfecto', desc: 'Saca 3/3 en un test' },
  { id: 'seri3', icon: '🔥', name: 'Racha de 3 días', desc: 'Haz una lección 3 días seguidos' },
  { id: 'seri7', icon: '⭐', name: 'Racha de 7 días', desc: 'Haz una lección 7 días seguidos' },
  { id: 'seri30', icon: '🌟', name: 'Racha de 30 días', desc: 'Haz una lección 30 días seguidos' },
  { id: 'mekke', icon: '🕋', name: 'Los años de La Meca', desc: 'Termina las 11 primeras lecciones' },
  { id: 'hicret', icon: '🌄', name: 'Muhayir', desc: 'Termina la lección de la Hégira' },
  { id: 'medine', icon: '🕌', name: 'Los años de Medina', desc: 'Termina todas las lecciones' },
  { id: 'yaris', icon: '⚡', name: 'Primera competencia', desc: 'Completa una competencia' },
  { id: 'galip', icon: '🏆', name: 'Primera victoria', desc: 'Gana una competencia' },
  { id: 'galip10', icon: '👑', name: 'Diez victorias', desc: 'Gana 10 competencias' },
];

export const SOURCES = [
  'El Sagrado Corán y sus traducciones del significado',
  'Ibn Hisham, as-Sira an-Nabawiyya',
  'Al-Bujari, al-Yami as-Sahih',
  'TDV İslâm Ansiklopedisi, artículo "Muhammed"',
  'Presidencia de Asuntos Religiosos de Turquía (Diyanet), La vida del Profeta Muhammad (s.a.w.)',
];

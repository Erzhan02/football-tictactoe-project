import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// Reference data
// ─────────────────────────────────────────────
const LEAGUES = [
  { tag: 'premier-league', name: 'Premier League', country: 'England' },
  { tag: 'laliga', name: 'La Liga', country: 'Spain' },
  { tag: 'serie-a', name: 'Serie A', country: 'Italy' },
  { tag: 'bundesliga', name: 'Bundesliga', country: 'Germany' },
  { tag: 'ligue1', name: 'Ligue 1', country: 'France' },
  { tag: 'eredivisie', name: 'Eredivisie', country: 'Netherlands' },
  { tag: 'ligaportugal', name: 'Liga Portugal', country: 'Portugal' },
  { tag: 'superlig', name: 'Süper Lig', country: 'Turkey' },
  { tag: 'mls', name: 'MLS', country: 'USA' },
  { tag: 'saudi-league', name: 'Saudi Pro League', country: 'Saudi Arabia' },
];

const CLUBS = [
  { tag: 'barcelona', name: 'FC Barcelona', country: 'Spain', leagueTag: 'laliga' },
  { tag: 'real-madrid', name: 'Real Madrid', country: 'Spain', leagueTag: 'laliga' },
  { tag: 'atletico', name: 'Atlético Madrid', country: 'Spain', leagueTag: 'laliga' },
  { tag: 'manchester-city', name: 'Manchester City', country: 'England', leagueTag: 'premier-league' },
  { tag: 'manchester-united', name: 'Manchester United', country: 'England', leagueTag: 'premier-league' },
  { tag: 'liverpool', name: 'Liverpool FC', country: 'England', leagueTag: 'premier-league' },
  { tag: 'chelsea', name: 'Chelsea FC', country: 'England', leagueTag: 'premier-league' },
  { tag: 'arsenal', name: 'Arsenal FC', country: 'England', leagueTag: 'premier-league' },
  { tag: 'tottenham', name: 'Tottenham Hotspur', country: 'England', leagueTag: 'premier-league' },
  { tag: 'psg', name: 'Paris Saint-Germain', country: 'France', leagueTag: 'ligue1' },
  { tag: 'monaco', name: 'AS Monaco', country: 'France', leagueTag: 'ligue1' },
  { tag: 'lyon', name: 'Olympique Lyonnais', country: 'France', leagueTag: 'ligue1' },
  { tag: 'marseille', name: 'Olympique de Marseille', country: 'France', leagueTag: 'ligue1' },
  { tag: 'bavaria', name: 'Bayern München', country: 'Germany', leagueTag: 'bundesliga' },
  { tag: 'dortmund', name: 'Borussia Dortmund', country: 'Germany', leagueTag: 'bundesliga' },
  { tag: 'wolfsburg', name: 'VfL Wolfsburg', country: 'Germany', leagueTag: 'bundesliga' },
  { tag: 'juventus', name: 'Juventus FC', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'ac-milan', name: 'AC Milan', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'inter', name: 'Inter Milan', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'roma', name: 'AS Roma', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'porto', name: 'FC Porto', country: 'Portugal', leagueTag: 'ligaportugal' },
  { tag: 'benfica', name: 'SL Benfica', country: 'Portugal', leagueTag: 'ligaportugal' },
  { tag: 'ajax', name: 'AFC Ajax', country: 'Netherlands', leagueTag: 'eredivisie' },
  { tag: 'inter-miami', name: 'Inter Miami CF', country: 'USA', leagueTag: 'mls' },
  { tag: 'al-nassr', name: 'Al-Nassr FC', country: 'Saudi Arabia', leagueTag: 'saudi-league' },
  { tag: 'al-hilal', name: 'Al-Hilal SFC', country: 'Saudi Arabia', leagueTag: 'saudi-league' },
  { tag: 'sportingcp', name: 'Sporting CP', country: 'Portugal', leagueTag: 'ligaportugal' },
  { tag: 'bordeaux', name: 'Girondins de Bordeaux', country: 'France', leagueTag: 'ligue1' },
  { tag: 'psv', name: 'PSV Eindhoven', country: 'Netherlands', leagueTag: 'eredivisie' },
  { tag: 'al-ittihad', name: 'Al-Ittihad', country: 'Saudi Arabia', leagueTag: 'saudi-league' },
  { tag: 'orlandocity', name: 'Orlando City SC', country: 'USA', leagueTag: 'mls' },
  { tag: 'feyenoord', name: 'Feyenoord', country: 'Netherlands', leagueTag: 'eredivisie' },
  { tag: 'lazio', name: 'SS Lazio', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'napoli', name: 'SSC Napoli', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'lagalaxy', name: 'LA Galaxy', country: 'USA', leagueTag: 'mls' },
  { tag: 'fenerbahce', name: 'Fenerbahçe SK', country: 'Turkey', leagueTag: 'superlig' },
  { tag: 'sevilla', name: 'Sevilla FC', country: 'Spain', leagueTag: 'laliga' },
  { tag: 'lille', name: 'LOSC Lille', country: 'France', leagueTag: 'ligue1' },
  { tag: 'al-ahli', name: 'Al-Ahli', country: 'Saudi Arabia', leagueTag: 'saudi-league' },
  { tag: 'gladbach', name: 'Borussia Mönchengladbach', country: 'Germany', leagueTag: 'bundesliga' },
  { tag: 'parma', name: 'Parma Calcio', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'newcastle', name: 'Newcastle United', country: 'England', leagueTag: 'premier-league' },
  { tag: 'udinese', name: 'Udinese Calcio', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'valencia', name: 'Valencia CF', country: 'Spain', leagueTag: 'laliga' },
  { tag: 'everton', name: 'Everton FC', country: 'England', leagueTag: 'premier-league' },
  { tag: 'como', name: 'Como 1907', country: 'Italy', leagueTag: 'serie-a' },
  { tag: 'kann', name: 'Канн', country: '', leagueTag: '' },
  { tag: 'kruzeyro', name: 'Крузейро', country: '', leagueTag: '' },
  { tag: 'korintians', name: 'Коринтианс', country: '', leagueTag: '' },
  { tag: 'gremio', name: 'Гремио', country: '', leagueTag: '' },
  { tag: 'flamengo', name: 'Фламенго', country: '', leagueTag: '' },
  { tag: 'atletikumineyru', name: 'Атлетику Минейру', country: '', leagueTag: '' },
  { tag: 'keretaro', name: 'Керетаро', country: '', leagueTag: '' },
  { tag: 'fluminense', name: 'Флуминенсе', country: '', leagueTag: '' },
  { tag: 'nyu-yorkredbulls', name: 'Нью-Йорк Ред Буллс', country: '', leagueTag: '' },
  { tag: 'reyms', name: 'Реймс', country: '', leagueTag: '' },
  { tag: 'mets', name: 'Мец', country: '', leagueTag: '' },
  { tag: 'vilyareal', name: 'Вильяреал', country: '', leagueTag: '' },
  { tag: 'astonvilla', name: 'Астон Вилла', country: '', leagueTag: '' },
  { tag: 'goa', name: 'Гоа', country: '', leagueTag: '' },
  { tag: 'vestkhem', name: 'Вест Хэм', country: '', leagueTag: '' },
  { tag: 'nant', name: 'Нант', country: '', leagueTag: '' },
  { tag: 'al-garafa', name: 'Аль-Гарафа', country: '', leagueTag: '' },
  { tag: 'katarsk', name: 'Катар СК', country: '', leagueTag: '' },
  { tag: 'monpele', name: 'Монпелье', country: '', leagueTag: '' },
  { tag: 'nim', name: 'Ним', country: '', leagueTag: '' },
  { tag: 'sent-eten', name: 'Сент-Этьен', country: '', leagueTag: '' },
  { tag: 'oser', name: 'Осер', country: '', leagueTag: '' },
  { tag: 'le-man', name: 'Ле-Ман', country: '', leagueTag: '' },
  { tag: 'gingam', name: 'Гингам', country: '', leagueTag: '' },
  { tag: 'shankhayshenkhua', name: 'Шанхай Шэньхуа', country: '', leagueTag: '' },
  { tag: 'galatasaray', name: 'Галатасарай', country: '', leagueTag: '' },
  { tag: 'monrealimpakt', name: 'Монреаль Импакт', country: '', leagueTag: '' },
  { tag: 'feniksrayzing', name: 'Феникс Райзинг', country: '', leagueTag: '' },
  { tag: 'seltavigo', name: 'Сельта Виго', country: '', leagueTag: '' },
  { tag: 'lidsyunayted', name: 'Лидс Юнайтед', country: '', leagueTag: '' },
  { tag: 'platense', name: 'Платенсе', country: '', leagueTag: '' },
  { tag: 'erkules', name: 'Эркулес', country: '', leagueTag: '' },
  { tag: 'baniyas', name: 'Банияс', country: '', leagueTag: '' },
  { tag: 'riverpleyt', name: 'Ривер Плейт', country: '', leagueTag: '' },
  { tag: 'nyuellsoldboyz', name: 'Ньюэллс Олд Бойз', country: '', leagueTag: '' },
  { tag: 'punesiti', name: 'Пуне Сити', country: '', leagueTag: '' },
  { tag: 'bolton', name: 'Болтон', country: '', leagueTag: '' },
  { tag: 'west-brom', name: 'Вест Бромвич', country: '', leagueTag: '' },
  { tag: 'khemnits', name: 'Хемниц', country: '', leagueTag: '' },
  { tag: 'kayzerslautern', name: 'Кайзерслаутерн', country: '', leagueTag: '' },
  { tag: 'bayerleverkuzen', name: 'Байер Леверкузен', country: '', leagueTag: '' },
  { tag: 'karlsrue', name: 'Карлсруэ', country: '', leagueTag: '' },
  { tag: 'metrostars', name: 'Метростарс', country: '', leagueTag: '' },
  { tag: 'vfbshtutgart', name: 'ВФБ Штутгарт', country: '', leagueTag: '' },
  { tag: 'sampdoria', name: 'Сэмпдория', country: '', leagueTag: '' },
  { tag: 'servett', name: 'Серветт', country: '', leagueTag: '' },
  { tag: 'tsv1861nerdlingen', name: 'ТСВ 1861 Нёрдлинген', country: '', leagueTag: '' },
  { tag: 'nyu-yorkkozmos', name: 'Нью-Йорк Козмос', country: '', leagueTag: '' },
  { tag: 'gamburg', name: 'Гамбург', country: '', leagueTag: '' },
  { tag: 'augsburg', name: 'Аугсбург', country: '', leagueTag: '' },
  { tag: 'deportivo', name: 'Депортиво', country: '', leagueTag: '' },
  { tag: 'kataniya', name: 'Катания', country: '', leagueTag: '' },
  { tag: 'nyu-inglendrevolyushn', name: 'Нью-Инглэнд Революшн', country: '', leagueTag: '' },
  { tag: 'suonsisiti', name: 'Суонси Сити', country: '', leagueTag: '' },
  { tag: 'nyu-yorksiti', name: 'Нью-Йорк Сити', country: '', leagueTag: '' },
  { tag: 'donkasterrovers', name: 'Донкастер Роверс', country: '', leagueTag: '' },
  { tag: 'brondbyu', name: 'Брондбю', country: '', leagueTag: '' },
  { tag: 'nottingham', name: 'Ноттингем Форест', country: '', leagueTag: '' },
  { tag: 'seltik', name: 'Селтик', country: '', leagueTag: '' },
  { tag: 'denbos', name: 'Ден Бос', country: '', leagueTag: '' },
  { tag: 'kheerenven', name: 'Хееренвен', country: '', leagueTag: '' },
  { tag: 'groningen', name: 'Гронинген', country: '', leagueTag: '' },
  { tag: 'nitstsa', name: 'Ницца', country: '', leagueTag: '' },
  { tag: 'orlandositi', name: 'Орландо Сити', country: '', leagueTag: '' },
  { tag: 'keln', name: 'Кельн', country: '', leagueTag: '' },
  { tag: 'valensiya', name: 'Валенсия', country: '', leagueTag: '' },
  { tag: 'vaskodagama', name: 'Васко да Гама', country: '', leagueTag: '' },
  { tag: 'santakruz', name: 'Санта Круз', country: '', leagueTag: '' },
  { tag: 'olimpiakos', name: 'Олимпиакос', country: '', leagueTag: '' },
  { tag: 'aekafiny', name: 'AEK Афины', country: '', leagueTag: '' },
  { tag: 'kraisense', name: 'Краисьенсе', country: '', leagueTag: '' },
  { tag: 'san-paulu', name: 'Сан-Паулу', country: '', leagueTag: '' },
  { tag: 'undiaosan-zhuan', name: 'Ундиао Сан-Жуан', country: '', leagueTag: '' },
  { tag: 'palmeyras', name: 'Палмейрас', country: '', leagueTag: '' },
  { tag: 'anzhi', name: 'Анжи', country: '', leagueTag: '' },
  { tag: 'delhi-dynamos', name: 'Дели Динамос', country: '', leagueTag: '' },
  { tag: 'fiorentina', name: 'Фиорентина', country: '', leagueTag: '' },
  { tag: 'realbetis', name: 'Реал Бетис', country: '', leagueTag: '' },
  { tag: 'saragosa', name: 'Сарагоса', country: '', leagueTag: '' },
  { tag: 'shalke04', name: 'Шальке 04', country: '', leagueTag: '' },
  { tag: 'yuniondeportivasalamanka', name: 'Юнион Депортива Саламанка', country: '', leagueTag: '' },
  { tag: 'cherkezoser', name: 'Черкез Осер', country: '', leagueTag: '' },
  { tag: 'argentinoskhuniors', name: 'Аргентинос Хуниорс', country: '', leagueTag: '' },
  { tag: 'bokakhuniors', name: 'Бока Хуниорс', country: '', leagueTag: '' },
  { tag: 'atletikutukuman', name: 'Атлетику Тукуман', country: '', leagueTag: '' },
  { tag: 'independente', name: 'Индепендьенте', country: '', leagueTag: '' },
  { tag: 'kordekhesus', name: 'Кор. де Хесус', country: '', leagueTag: '' },
  { tag: 'banfild', name: 'Банфилд', country: '', leagueTag: '' },
  { tag: 'rasingklub', name: 'Расинг Клуб', country: '', leagueTag: '' },
  { tag: 'los-andzhelesatsteks', name: 'Лос-Анджелес Ацтекс', country: '', leagueTag: '' },
  { tag: 'vashingtondiplomats', name: 'Вашингтон Дипломатс', country: '', leagueTag: '' },
  { tag: 'rktsvalveyk', name: 'РКЦ Валвейк', country: '', leagueTag: '' },
  { tag: 'reyndzhers', name: 'Рейнджерс', country: '', leagueTag: '' },
  { tag: 'sidney', name: 'Сидней', country: '', leagueTag: '' },
  { tag: 'breshia', name: 'Брешиа', country: '', leagueTag: '' },
  { tag: 'redzhina', name: 'Реджина', country: '', leagueTag: '' },
  { tag: 'aleksandriya', name: 'Александрия', country: '', leagueTag: '' },
  { tag: 'lechche', name: 'Лечче', country: '', leagueTag: '' },
  { tag: 'sportingkhikhon', name: 'Спортинг Хихон', country: '', leagueTag: '' },
  { tag: 'realsaragosa', name: 'Реал Сарагоса', country: '', leagueTag: '' },
  { tag: 'eybar', name: 'Эйбар', country: '', leagueTag: '' },
  { tag: 'seuta', name: 'Сеута', country: '', leagueTag: '' },
  { tag: 'vik', name: 'Вик', country: '', leagueTag: '' },
  { tag: 'realsosedad', name: 'Реал Сосьедад', country: '', leagueTag: '' },
  { tag: 'leysha', name: 'Лейша', country: '', leagueTag: '' },
  { tag: 'fulkhem', name: 'Фулхэм', country: '', leagueTag: '' },
  { tag: 'natal', name: 'Натал', country: '', leagueTag: '' },
  { tag: 'beshiktash', name: 'Бешикташ', country: '', leagueTag: '' },
  { tag: 'nasonal', name: 'Насьональ', country: '', leagueTag: '' },
  { tag: 'krusasul', name: 'Крус Асуль', country: '', leagueTag: '' },
  { tag: 'danubio', name: 'Данубио', country: '', leagueTag: '' },
  { tag: 'kagliari', name: 'Каглиари', country: '', leagueTag: '' },
  { tag: 'dinamozagreb', name: 'Динамо Загреб', country: '', leagueTag: '' },
  { tag: 'shalke', name: 'Шальке', country: '', leagueTag: '' },
  { tag: 'khayduksplit', name: 'Хайдук Сплит', country: '', leagueTag: '' },
  { tag: 'aries', name: 'Ариес', country: '', leagueTag: '' },
  { tag: 'shakhterdonetsk', name: 'Шахтёр Донецк', country: '', leagueTag: '' },
  { tag: 'trabzonspor', name: 'Трабзонспор', country: '', leagueTag: '' },
  { tag: 'orense', name: 'Оренсе', country: '', leagueTag: '' },
  { tag: 'standarlezh', name: 'Стандар Льеж', country: '', leagueTag: '' },
  { tag: 'anderlekht', name: 'Андерлехт', country: '', leagueTag: '' },
  { tag: 'tuluza', name: 'Тулуза', country: '', leagueTag: '' },
  { tag: 'bryugge', name: 'Брюгге', country: '', leagueTag: '' },
  { tag: 'verderbremen', name: 'Вердер Бремен', country: '', leagueTag: '' },
  { tag: 'leganes', name: 'Леганес', country: '', leagueTag: '' },
  { tag: 'espanol', name: 'Эспаньол', country: '', leagueTag: '' },
  { tag: 'malorka', name: 'Мальорка', country: '', leagueTag: '' },
  { tag: 'antalyaspor', name: 'Антальяспор', country: '', leagueTag: '' },
  { tag: 'konyaspor', name: 'Коньяспор', country: '', leagueTag: '' },
  { tag: 'uotford', name: 'Уотфорд', country: '', leagueTag: '' },
  { tag: 'cska-moscow', name: 'ЦСКА Москва', country: '', leagueTag: '' },
  { tag: 'asecmimozas', name: 'ASEC Мимозас', country: '', leagueTag: '' },
  { tag: 'bernli', name: 'Бёрнли', country: '', leagueTag: '' },
  { tag: 'beveren', name: 'Беверен', country: '', leagueTag: '' },
  { tag: 'metalurgdonetsk', name: 'Металург Донецк', country: '', leagueTag: '' },
  { tag: 'loryan', name: 'Лорьян', country: '', leagueTag: '' },
  { tag: 'renn', name: 'Ренн', country: '', leagueTag: '' },
  { tag: 'atletikbilbao', name: 'Атлетик Бильбао', country: '', leagueTag: '' },
  { tag: 'nansi', name: 'Нанси', country: '', leagueTag: '' },
  { tag: 'ruan', name: 'Руан', country: '', leagueTag: '' },
  { tag: 'torino', name: 'Торино', country: '', leagueTag: '' },
  { tag: 'montsa', name: 'Монца', country: '', leagueTag: '' },
  { tag: 'bolonya', name: 'Болонья', country: '', leagueTag: '' },
  { tag: 'avellino', name: 'Авеллино', country: '', leagueTag: '' },
  { tag: 'peskara', name: 'Пескара', country: '', leagueTag: '' },
  { tag: 'sautgempton', name: 'Саутгемптон', country: '', leagueTag: '' },
  { tag: 'blekbernrovers', name: 'Блэкберн Роверс', country: '', leagueTag: '' },
  { tag: 'karlaylyunayted', name: 'Карлайл Юнайтед', country: '', leagueTag: '' },
  { tag: 'middlesbrough', name: 'Мидлсбро', country: '', leagueTag: '' },
  { tag: 'alnviktaun', name: 'Алнвик Таун', country: '', leagueTag: '' },
  { tag: 'uestkhem', name: 'Уэст Хэм', country: '', leagueTag: '' },
  { tag: 'molde', name: 'Молде', country: '', leagueTag: '' },
  { tag: 'altay', name: 'Алтай', country: '', leagueTag: '' },
  { tag: 'braga', name: 'Брага', country: '', leagueTag: '' },
  { tag: 'fenikash', name: 'Феникаш', country: '', leagueTag: '' },
  { tag: 'stouksiti', name: 'Стоук Сити', country: '', leagueTag: '' },
  { tag: 'dsyunayted', name: 'ДС Юнайтед', country: '', leagueTag: '' },
  { tag: 'perudzha', name: 'Перуджа', country: '', leagueTag: '' },
  { tag: 'messina', name: 'Мессина', country: '', leagueTag: '' },
  { tag: 'estudiantes', name: 'Эстудиантес', country: '', leagueTag: '' },
  { tag: 'stremsgodset', name: 'Стремсгодсет', country: '', leagueTag: '' },
  { tag: 'genuya', name: 'Генуя', country: '', leagueTag: '' },
  { tag: 'vardar', name: 'Вардар', country: '', leagueTag: '' },
  { tag: 'legiya', name: 'Легия', country: '', leagueTag: '' },
  { tag: 'taleres', name: 'Тальерес', country: '', leagueTag: '' },
  { tag: 'al-sadd', name: 'Аль-Садд', country: '', leagueTag: '' },
  { tag: 'tenerife', name: 'Тенерифе', country: '', leagueTag: '' },
  { tag: 'rayavalekano', name: 'Рая Вальекано', country: '', leagueTag: '' },
  { tag: 'atletikonasonal', name: 'Атлетико Насьональ', country: '', leagueTag: '' },
  { tag: 'penyarol', name: 'Пеньяроль', country: '', leagueTag: '' },
  { tag: 'bolivar', name: 'Боливар', country: '', leagueTag: '' },
  { tag: 'sportingkali', name: 'Спортинг Кали', country: '', leagueTag: '' },
  { tag: 'grasskhoppers', name: 'Грассхопперс', country: '', leagueTag: '' },
  { tag: 'sakaryaspor', name: 'Сакарьяспор', country: '', leagueTag: '' },
  { tag: 'zenit', name: 'Зенит', country: '', leagueTag: '' },
  { tag: 'krasnodar', name: 'Краснодар', country: '', leagueTag: '' },
  { tag: 'spartak', name: 'Спартак', country: '', leagueTag: '' },
  { tag: 'lokomotiv', name: 'Локомотив', country: '', leagueTag: '' },
  { tag: 'portsmut', name: 'Портсмут', country: '', leagueTag: '' },
  { tag: 'satonsiti', name: 'Сатон Сити', country: '', leagueTag: '' },
  { tag: 'dinamomoskva', name: 'Динамо Москва', country: '', leagueTag: '' },
  { tag: 'dinamokiev', name: 'Динамо Киев', country: '', leagueTag: '' },
  { tag: 'kluzh', name: 'Клуж', country: '', leagueTag: '' },
  { tag: 'bastiya', name: 'Бастия', country: '', leagueTag: '' },
  { tag: 'dyamatadio', name: 'Дьяматадио', country: '', leagueTag: '' },
  { tag: 'senegal', name: 'Сенегал', country: '', leagueTag: '' },
  { tag: 'styaua', name: 'Стяуа', country: '', leagueTag: '' },
  { tag: 'vidadkasablanka', name: 'Видад Касабланка', country: '', leagueTag: '' },
  { tag: 'kasasport', name: 'Каса Спорт', country: '', leagueTag: '' },
  { tag: 'malaga', name: 'Малага', country: '', leagueTag: '' },
  { tag: 'kolo-kolo', name: 'Коло-Коло', country: '', leagueTag: '' },
  { tag: 'trenchin', name: 'Тренчин', country: '', leagueTag: '' },
  { tag: 'zhilina', name: 'Жилина', country: '', leagueTag: '' },
  { tag: 'rbleyptsig', name: 'RB Лейпциг', country: '', leagueTag: '' },
  { tag: 'birmingem', name: 'Бирмингем', country: '', leagueTag: '' },
  { tag: 'avryunayted', name: 'Авр Юнайтед', country: '', leagueTag: '' },
  { tag: 'urugvay', name: 'Уругвай', country: '', leagueTag: '' },
  { tag: 'khoffenkhaym', name: 'Хоффенхайм', country: '', leagueTag: '' },
  { tag: 'tsv1861nyordlingen', name: 'ТСВ 1861 Нёрдлинген', country: '', leagueTag: '' },
  { tag: 'shakhtyordonetsk', name: 'Шахтёр Донецк', country: '', leagueTag: '' },
  { tag: 'byornli', name: 'Бёрнли', country: '', leagueTag: '' }
];

const TOURNAMENTS = [
  { tag: 'ucl', name: 'UEFA Champions League', type: 'CLUB' as const },
  { tag: 'uel', name: 'UEFA Europa League', type: 'CLUB' as const },
  { tag: 'worldcup-winner', name: 'FIFA World Cup Winner', type: 'NATIONAL' as const },
  { tag: 'worldcup', name: 'FIFA World Cup Participant', type: 'NATIONAL' as const },
  { tag: 'euro', name: 'UEFA European Championship', type: 'NATIONAL' as const },
  { tag: 'copa-america', name: 'Copa América', type: 'NATIONAL' as const },
  { tag: 'afcon', name: 'Africa Cup of Nations', type: 'NATIONAL' as const },
  { tag: 'ballondor', name: "Ballon d'Or", type: 'INDIVIDUAL' as const },
];

const MANAGERS = [
  { tag: 'pep',        name: 'Pep Guardiola',      nationality: 'Spain' },
  { tag: 'ancelotti',  name: 'Carlo Ancelotti',     nationality: 'Italy' },
  { tag: 'ferguson',   name: 'Alex Ferguson',       nationality: 'Scotland' },
  { tag: 'mourinho',   name: 'José Mourinho',       nationality: 'Portugal' },
  { tag: 'klopp',      name: 'Jürgen Klopp',        nationality: 'Germany' },
  { tag: 'zidane',     name: 'Zinedine Zidane',     nationality: 'France' },
  { tag: 'simeone',    name: 'Diego Simeone',       nationality: 'Argentina' },
  { tag: 'wenger',     name: 'Arsène Wenger',       nationality: 'France' },
  { tag: 'del-bosque', name: 'Vicente del Bosque',  nationality: 'Spain' },
  { tag: 'luis-enrique', name: 'Luis Enrique',      nationality: 'Spain' },
  { tag: 'conte',      name: 'Antonio Conte',       nationality: 'Italy' },
  { tag: 'tuchel',     name: 'Thomas Tuchel',       nationality: 'Germany' },
  { tag: 'flick',      name: 'Hans-Dieter Flick',   nationality: 'Germany' },
  { tag: 'capello',    name: 'Fabio Capello',       nationality: 'Italy' },
  { tag: 'heynckes',   name: 'Jupp Heynckes',       nationality: 'Germany' },
];

import { PLAYERS } from './curatedPlayers.js';

// ─────────────────────────────────────────────
// Seed function
// ─────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting seed...');

  // Upsert leagues
  console.log('  → Seeding leagues...');
  for (const league of LEAGUES) {
    await prisma.league.upsert({
      where: { tag: league.tag },
      update: { name: league.name, country: league.country },
      create: { tag: league.tag, name: league.name, country: league.country },
    });
  }

  // Upsert clubs
  console.log('  → Seeding clubs...');
  for (const club of CLUBS) {
    const league = club.leagueTag
      ? await prisma.league.findUnique({ where: { tag: club.leagueTag } })
      : null;

    await prisma.club.upsert({
      where: { tag: club.tag },
      update: { name: club.name, country: club.country, leagueId: league?.id },
      create: { tag: club.tag, name: club.name, country: club.country, leagueId: league?.id },
    });
  }

  // Upsert tournaments
  console.log('  → Seeding tournaments...');
  for (const t of TOURNAMENTS) {
    await prisma.tournament.upsert({
      where: { tag: t.tag },
      update: { name: t.name, type: t.type },
      create: { tag: t.tag, name: t.name, type: t.type },
    });
  }

  // Upsert managers
  console.log('  → Seeding managers...');
  for (const m of MANAGERS) {
    await prisma.manager.upsert({
      where: { tag: m.tag },
      update: { name: m.name, nationality: m.nationality },
      create: { tag: m.tag, name: m.name, nationality: m.nationality },
    });
  }

  // Upsert players with all their relations
  console.log('  → Seeding players...');
  for (const p of PLAYERS) {
    const player = await prisma.player.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        aliases: p.aliases,
        nationality: p.nationality,
        position: p.position,
      },
      create: {
        id: p.id,
        name: p.name,
        aliases: p.aliases,
        nationality: p.nationality,
        position: p.position,
      },
    });

    // Link clubs
    for (const clubTag of p.clubs) {
      const club = await prisma.club.findUnique({ where: { tag: clubTag } });
      if (club) {
        await prisma.playerClub.upsert({
          where: { playerId_clubId: { playerId: player.id, clubId: club.id } },
          update: {},
          create: { playerId: player.id, clubId: club.id },
        });
      }
    }

    // Link leagues
    for (const leagueTag of p.leagues) {
      const league = await prisma.league.findUnique({ where: { tag: leagueTag } });
      if (league) {
        await prisma.playerLeague.upsert({
          where: { playerId_leagueId: { playerId: player.id, leagueId: league.id } },
          update: {},
          create: { playerId: player.id, leagueId: league.id },
        });
      }
    }

    // Link managers
    for (const managerTag of p.managers) {
      const manager = await prisma.manager.findUnique({ where: { tag: managerTag } });
      if (manager) {
        await prisma.playerManager.upsert({
          where: { playerId_managerId: { playerId: player.id, managerId: manager.id } },
          update: {},
          create: { playerId: player.id, managerId: manager.id },
        });
      }
    }

    // Link tournaments
    for (const tournamentTag of p.tournaments) {
      const tournament = await prisma.tournament.findUnique({ where: { tag: tournamentTag } });
      if (tournament) {
        await prisma.playerTournament.upsert({
          where: { playerId_tournamentId: { playerId: player.id, tournamentId: tournament.id } },
          update: {},
          create: { playerId: player.id, tournamentId: tournament.id },
        });
      }
    }

    console.log(`    ✓ ${p.name}`);
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   Leagues:     ${LEAGUES.length}`);
  console.log(`   Clubs:       ${CLUBS.length}`);
  console.log(`   Tournaments: ${TOURNAMENTS.length}`);
  console.log(`   Managers:    ${MANAGERS.length}`);
  console.log(`   Players:     ${PLAYERS.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

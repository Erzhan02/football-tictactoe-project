import fs from 'fs';

const rawData = fs.readFileSync('/Users/erzhan/Desktop/football-tictactoe-project/players_final.json', 'utf8');
const newPlayers = JSON.parse(rawData);

// Transliteration helper
function transliterate(str: string): string {
  const ru: Record<string, string> = {
    'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh', 'з':'z',
    'и':'i', 'й':'y', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r',
    'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'kh', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'shch',
    'ы':'y', 'э':'e', 'ю':'yu', 'я':'ya', 'ь':'', 'ъ':''
  };
  return str.toLowerCase().split('').map(char => ru[char] ?? char).join('');
}

function slugify(str: string): string {
  return transliterate(str)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const NATIONALITIES_MAP: Record<string, { tag: string; nameEn: string }> = {
  'Франция': { tag: 'france', nameEn: 'France' },
  'Испания': { tag: 'spain', nameEn: 'Spain' },
  'Аргентина': { tag: 'argentina', nameEn: 'Argentina' },
  'Англия': { tag: 'england', nameEn: 'England' },
  'Португалия': { tag: 'portugal', nameEn: 'Portugal' },
  'Бразилия': { tag: 'brazil', nameEn: 'Brazil' },
  'Нидерланды': { tag: 'netherlands', nameEn: 'Netherlands' },
  'Бельгия': { tag: 'belgium', nameEn: 'Belgium' },
  'Германия': { tag: 'germany', nameEn: 'Germany' },
  'Италия': { tag: 'italy', nameEn: 'Italy' },
  'Россия': { tag: 'russia', nameEn: 'Russia' },
  'Уругвай': { tag: 'uruguay', nameEn: 'Uruguay' },
  'Хорватия': { tag: 'croatia', nameEn: 'Croatia' },
  'Колумбия': { tag: 'colombia', nameEn: 'Colombia' },
  'Швейцария': { tag: 'switzerland', nameEn: 'Switzerland' },
  'Швеция': { tag: 'sweden', nameEn: 'Sweden' },
  'Марокко': { tag: 'morocco', nameEn: 'Morocco' },
  'Турция': { tag: 'turkey', nameEn: 'Turkey' },
  'Дания': { tag: 'denmark', nameEn: 'Denmark' },
  'Украина': { tag: 'ukraine', nameEn: 'Ukraine' },
  "Кот-д'Ивуар": { tag: 'ivory-coast', nameEn: 'Ivory Coast' },
  "Кот-д’Ивуар": { tag: 'ivory-coast', nameEn: 'Ivory Coast' },
  'Египет': { tag: 'egypt', nameEn: 'Egypt' },
  'Норвегия': { tag: 'norway', nameEn: 'Norway' },
  'Чили': { tag: 'chile', nameEn: 'Chile' },
  'Уэльс': { tag: 'wales', nameEn: 'Wales' },
  'Ирландия': { tag: 'ireland', nameEn: 'Ireland' },
  'Нигерия': { tag: 'nigeria', nameEn: 'Nigeria' },
  'Словакия': { tag: 'slovakia', nameEn: 'Slovakia' },
  'Австрия': { tag: 'austria', nameEn: 'Austria' },
  'Македония': { tag: 'macedonia', nameEn: 'Macedonia' }
};

const LEAGUES_MAP: Record<string, string> = {
  'АПЛ': 'premier-league',
  'Ла Лига': 'laliga',
  'Серия А': 'serie-a',
  'Лига 1': 'ligue1',
  'Бундеслига': 'bundesliga',
  'Эредивизи': 'eredivisie',
  'Турецкая Суперлига': 'superlig',
  'Примейра-лига': 'ligaportugal'
};

const COACHES_MAP: Record<string, string> = {
  'Фабио Капелло': 'capello',
  'Висенте дель Боске': 'del-bosque',
  'Карло Анчелотти': 'ancelotti',
  'Арсен Венгер': 'wenger',
  'Луис Энрике': 'luis-enrique',
  'Жозе Моуринью': 'mourinho',
  'Антонио Конте': 'conte',
  'Алекс Фергюсон': 'ferguson',
  'Юпп Хайнкес': 'heynckes',
  'Юрген Клопп': 'klopp',
  'Хосеп Гвардиола': 'pep',
  'Ханс-Дитер Флик': 'flick',
  'Зинедин Зидан': 'zidane',
  'Диего Симеоне': 'simeone',
  'Томас Тухель': 'tuchel'
};

const TROPHIES_MAP: Record<string, string[]> = {
  'ЛЧ': ['ucl'],
  'ЛЕ': ['uel'],
  'ЧМ': ['worldcup-winner', 'worldcup'],
  'Евро': ['euro'],
  'Золотой мяч': ['ballondor']
};

const CLUB_NAME_MAP: Record<string, string> = {
  "AC Милан": "ac-milan",
  "Милан": "ac-milan",
  "Аякс": "ajax",
  "Арсенал": "arsenal",
  "Атлетико Мадрид": "atletico",
  "Атлетико": "atletico",
  "Барселона": "barcelona",
  "Байерн Мюнхен": "bavaria",
  "Бавария": "bavaria",
  "Бавария Мюнхен": "bavaria",
  "Бенфика": "benfica",
  "Бордо": "bordeaux",
  "Челси": "chelsea",
  "Боруссия Дортмунд": "dortmund",
  "Боруссия Менхенгладбах": "gladbach",
  "Гладбах": "gladbach",
  "Интер": "inter",
  "Интер Милан": "inter",
  "Ювентус": "juventus",
  "Ливерпуль": "liverpool",
  "Лилль": "lille",
  "Лион": "lyon",
  "Манчестер Сити": "manchester-city",
  "Манчестер Юнайтед": "manchester-united",
  "Марсель": "marseille",
  "Олимпик Марсель": "marseille",
  "Монако": "monaco",
  "Наполи": "napoli",
  "Ньюкасл": "newcastle",
  "Порту": "porto",
  "ПСЖ": "psg",
  "ПСВ": "psv",
  "Реал Мадрид": "real-madrid",
  "Рома": "roma",
  "Севилья": "sevilla",
  "Спортинг": "sportingcp",
  "Тоттенхэм": "tottenham",
  "Вольфсбург": "wolfsburg",
  "Лацио": "lazio",
  "Лос-Анджелес Гэлакси": "lagalaxy",
  "ЛА Гэлакси": "lagalaxy",
  "Фенербахче": "fenerbahce",
  "Фейеноорд": "feyenoord",
  "Аль-Иттихад": "al-ittihad",
  "Комо": "como",
  "Интер Майами": "inter-miami",
  "Аль-Наср": "al-nassr",
  "Аль-Хиляль": "al-hilal",
  "Сэмпдория": "sampdoria",
  "Самп": "sampdoria",
  "Вест Бромвич Альбион": "west-brom",
  "Вест Бромвич": "west-brom",
  "Ноттингем Форест": "nottingham",
  "Ноттинем Форест": "nottingham",
  "Миддлсбро": "middlesbrough",
  "Мидлсбро": "middlesbrough",
  "ЦСКА Москва": "cska-moscow",
  "ЦСКА": "cska-moscow",
  "Дели Динамос": "delhi-dynamos",
  "Делхи Динамос": "delhi-dynamos"
};

// Dynamically load all clubs from seed.ts to automatically map their names to tags
try {
  const seedPath = '/Users/erzhan/Desktop/football-tictactoe-project/server/prisma/seed.ts';
  const seedContent = fs.readFileSync(seedPath, 'utf8');
  const clubsStartMatch = seedContent.match(/const CLUBS = \[\r?\n/);
  if (clubsStartMatch) {
    const startIndex = seedContent.indexOf('const CLUBS = [');
    const endIndex = seedContent.indexOf('];', startIndex) + 2;
    const clubsSliceStr = seedContent.slice(startIndex, endIndex);
    
    // Extract each club object: { tag: '...', name: '...' }
    const regex = /\{\s*tag:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
    let match;
    while ((match = regex.exec(clubsSliceStr)) !== null) {
      const tag = match[1];
      const name = match[2];
      if (!CLUB_NAME_MAP[name]) {
        CLUB_NAME_MAP[name] = tag;
      }
    }
  }
} catch (e) {
  console.warn('⚠️ Warning: Could not dynamically load CLUBS from seed.ts', e);
}

const uniqueClubs = new Map<string, string>(); // name -> tag
const uniqueManagers = new Map<string, string>(); // name -> tag
const uniqueLeagues = new Map<string, string>(); // name -> tag

const curatedPlayers: any[] = [];
const frontendPlayers: any[] = [];

newPlayers.forEach((p: any) => {
  // Transliterate name to slug for ID
  const playerSlug = slugify(p.name);
  const playerId = playerSlug || `player-${p.id}`;

  // Map nationality
  const ruNation = p.nationality?.[0] || 'Франция';
  const nationInfo = NATIONALITIES_MAP[ruNation] || { tag: slugify(ruNation), nameEn: ruNation };
  const nationalityEn = nationInfo.nameEn;

  // Map clubs
  const clubTags: string[] = [];
  if (p.clubs) {
    p.clubs.forEach((cName: string) => {
      let tag = CLUB_NAME_MAP[cName];
      if (!tag) {
        tag = slugify(cName);
      }
      clubTags.push(tag);
      uniqueClubs.set(cName, tag);
    });
  }

  // Map leagues
  const leagueTags: string[] = [];
  if (p.leagues) {
    p.leagues.forEach((lName: string) => {
      const tag = LEAGUES_MAP[lName] || slugify(lName);
      leagueTags.push(tag);
      uniqueLeagues.set(lName, tag);
    });
  }

  // Map managers
  const managerTags: string[] = [];
  if (p.coaches) {
    p.coaches.forEach((mName: string) => {
      const tag = COACHES_MAP[mName] || slugify(mName);
      managerTags.push(tag);
      uniqueManagers.set(mName, tag);
    });
  }

  // Map trophies
  const tournamentTags: string[] = [];
  if (p.trophies) {
    p.trophies.forEach((tName: string) => {
      const tags = TROPHIES_MAP[tName] || [slugify(tName)];
      tournamentTags.push(...tags);
    });
  }

  // Build aliases
  const aliases = [
    p.name.toLowerCase(),
    transliterate(p.name).toLowerCase(),
  ];
  // Add last name as alias if it's multiple words
  const parts = p.name.split(' ');
  if (parts.length > 1) {
    aliases.push(parts[parts.length - 1].toLowerCase());
  }

  // Create curatedPlayer object for DB seeding
  curatedPlayers.push({
    id: playerId,
    name: p.name,
    aliases: Array.from(new Set(aliases)),
    nationality: nationalityEn,
    position: 'Player',
    clubs: Array.from(new Set(clubTags)),
    leagues: Array.from(new Set(leagueTags)),
    managers: Array.from(new Set(managerTags)),
    tournaments: Array.from(new Set(tournamentTags)),
  });

  // Create frontend player tags list
  const tags = [
    ...clubTags,
    ...leagueTags,
    ...managerTags,
    ...tournamentTags,
    nationInfo.tag
  ];

  frontendPlayers.push({
    id: playerId,
    name: p.name,
    aliases: Array.from(new Set(aliases)),
    nationality: nationalityEn,
    position: 'Player',
    tags: Array.from(new Set(tags))
  });
});

// Write curatedPlayers.ts
const curatedPlayersFileContent = `// Curated famous players list (generated from players_final.json)
export interface PlayerSeed {
  id: string;
  name: string;
  aliases: string[];
  nationality?: string;
  position?: string;
  clubs: string[];
  leagues: string[];
  managers: string[];
  tournaments: string[];
}

export const PLAYERS: PlayerSeed[] = ${JSON.stringify(curatedPlayers, null, 2)};
`;

fs.writeFileSync('/Users/erzhan/Desktop/football-tictactoe-project/server/prisma/curatedPlayers.ts', curatedPlayersFileContent, 'utf8');
console.log('✓ Wrote curatedPlayers.ts');

// Write frontend players.ts
const frontendPlayersFileContent = `import type { Player } from '@/types';

export const PLAYERS: Player[] = ${JSON.stringify(frontendPlayers, null, 2)};
`;

fs.writeFileSync('/Users/erzhan/Desktop/football-tictactoe-project/frontend/src/data/players.ts', frontendPlayersFileContent, 'utf8');
fs.writeFileSync('/Users/erzhan/Desktop/football-tictactoe-project/src/data/players.ts', frontendPlayersFileContent, 'utf8');
console.log('✓ Wrote frontend players.ts');

// Now, update seed.ts dynamically!
const seedFilePath = '/Users/erzhan/Desktop/football-tictactoe-project/server/prisma/seed.ts';
let seedContent = fs.readFileSync(seedFilePath, 'utf8');

// Parse the existing CLUBS from seed.ts
const clubsStartMatch = seedContent.match(/const CLUBS = \[\r?\n/);
if (clubsStartMatch) {
  // Find where it ends
  const startIndex = seedContent.indexOf('const CLUBS = [');
  const endIndex = seedContent.indexOf('];', startIndex) + 2;
  const clubsSliceStr = seedContent.slice(startIndex, endIndex);

  // We want to extract each club object using regex:
  // e.g. { tag: 'barcelona', name: 'FC Barcelona', country: 'Spain', leagueTag: 'laliga' }
  const regex = /\{\s*tag:\s*'([^']+)',\s*name:\s*'([^']+)',\s*country:\s*'([^']*)',\s*leagueTag:\s*'([^']*)'\s*\}/g;
  const existingClubsMap = new Map<string, { tag: string; name: string; country?: string; leagueTag?: string }>();
  
  let match;
  while ((match = regex.exec(clubsSliceStr)) !== null) {
    existingClubsMap.set(match[1], {
      tag: match[1],
      name: match[2],
      country: match[3],
      leagueTag: match[4]
    });
  }

  // Merge the unique clubs we found from the JSON
  const mergedClubsList: any[] = [];
  const addedTags = new Set<string>();

  // 1. Add all clubs from the old seed file (if they match our mapping or are just in the old file)
  existingClubsMap.forEach((club) => {
    mergedClubsList.push(club);
    addedTags.add(club.tag);
  });

  // 2. Add all new unique clubs from our players list
  uniqueClubs.forEach((tag, nameRu) => {
    if (!addedTags.has(tag)) {
      mergedClubsList.push({
        tag: tag,
        name: nameRu,
        country: '',
        leagueTag: ''
      });
      addedTags.add(tag);
    }
  });

  // Format the new CLUBS array string
  const clubsArrayString = `const CLUBS = [\n` + 
    mergedClubsList.map(c => `  { tag: '${c.tag}', name: '${c.name.replace(/'/g, "\\'")}', country: '${c.country || ''}', leagueTag: '${c.leagueTag || ''}' }`).join(',\n') +
    `\n];`;

  // Replace the old CLUBS array in seed.ts with the new one
  seedContent = seedContent.slice(0, startIndex) + clubsArrayString + seedContent.slice(endIndex);
  fs.writeFileSync(seedFilePath, seedContent, 'utf8');
  console.log('✓ Successfully updated seed.ts with merged CLUBS array (total clubs: ' + mergedClubsList.length + ')');
} else {
  console.log('✗ Could not parse CLUBS block in seed.ts');
}

console.log('\n--- DATA SUMMARY ---');
console.log('Unique Clubs count:', uniqueClubs.size);
console.log('Unique Managers count:', uniqueManagers.size);
console.log('Unique Leagues count:', uniqueLeagues.size);

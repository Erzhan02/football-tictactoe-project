import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to normalize strings for slug/tags
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, '')      // remove non-alphanumeric chars
    .trim();
}

// Helper to normalize float version strings (e.g., "24.0" -> "24")
function normalizeVersion(v: string | undefined): string {
  if (!v) return '';
  const parsed = parseFloat(v);
  return isNaN(parsed) ? '' : Math.round(parsed).toString();
}

// Top leagues keywords to filter
const TOP_LEAGUES_KEYWORDS = [
  'premier league',
  'primera division',
  'la liga',
  'laliga',
  'bundesliga',
  'serie a',
  'ligue 1',
  'major league soccer',
  'mls',
  'saudi',
  'eredivisie',
  'liga portugal',
  'champions league',
  'icons',
  'soccer aid'
];

const SEED_ID_MAPPING: Record<string, string> = {
  'lionelmessi': 'messi',
  'cristianoronaldo': 'ronaldo',
  'neymarjr': 'neymar',
  'neymar': 'neymar',
  'xavihernandez': 'xavi',
  'andresiniesta': 'iniesta',
  'luissuarez': 'suarez',
  'robertlewandowski': 'lewandowski',
  'thomasmuller': 'muller',
  'franckribery': 'ribery',
  'arjenrobben': 'robben',
  'kevindebruyne': 'de-bruyne',
  'bernardosilva': 'bernardo-silva',
  'erlinghaaland': 'haaland',
  'mohamedsalah': 'salah',
  'robertofirmino': 'firmino',
  'sadiomane': 'mane',
  'virgilvandijk': 'van-dijk',
  'karimbenzema': 'benzema',
  'lukamodric': 'modric',
  'tonikroos': 'kroos',
  'sergioramos': 'ramos',
  'raphaelvarane': 'varane',
  'antoinegriezmann': 'griezmann',
  'edenhazard': 'hazard',
  'ngolokante': 'kante',
  'paulpogba': 'pogba',
  'kylianmbappe': 'mbappe',
  'mesutozil': 'ozil',
  'sergioaguero': 'aguero',
  'didierdrogba': 'drogba',
  'johnterry': 'terry',
  'franklampard': 'lampard',
  'thierryhenry': 'henry',
  'zlatanibrahimovic': 'ibrahimovic',
  'paulodybala': 'dybala',
  'andreapirlo': 'pirlo',
  'gianluigibuffon': 'buffon',
  'giorgiochiellini': 'chiellini',
  'davidsilva': 'david-silva',
  'waynerooney': 'rooney',
  'stevengerrard': 'gerrard',
  'leroysane': 'sane',
  'raheemsterling': 'sterling',
  'thiagoalcantara': 'thiago',
  'thiagosilva': 'thiago-silva',
  'ricardokaka': 'kaka',
  'kaka': 'kaka',

  // Short-name initials mappings to match seeded players
  'lmessi': 'messi',
  'lsuarez': 'suarez',
  'rlewandowski': 'lewandowski',
  'tmuller': 'muller',
  'fribery': 'ribery',
  'arobben': 'robben',
  'kdebruyne': 'de-bruyne',
  'ehaaland': 'haaland',
  'msalah': 'salah',
  'smane': 'mane',
  'vvandijk': 'van-dijk',
  'kbenzema': 'benzema',
  'lmodric': 'modric',
  'tkroos': 'kroos',
  'rvarane': 'varane',
  'agriezmann': 'griezmann',
  'ehazard': 'hazard',
  'nkante': 'kante',
  'ppogba': 'pogba',
  'kmbappe': 'mbappe',
  'mozil': 'ozil',
  'saguero': 'aguero',
  'ddrogba': 'drogba',
  'jterry': 'terry',
  'flampard': 'lampard',
  'thenry': 'henry',
  'zibrahimovic': 'ibrahimovic',
  'pdybala': 'dybala',
  'apirlo': 'pirlo',
  'gbuffon': 'buffon',
  'gchiellini': 'chiellini',
  'wrooney': 'rooney',
  'sgerrard': 'gerrard',
  'lsane': 'sane',
  'rsterling': 'sterling',
  'amacallister': 'amacallister',
};

const LEAGUE_TAG_MAPPING: Record<string, string> = {
  'premierleague': 'premier-league',
  'englishpremierleague': 'premier-league',
  'laliga': 'laliga',
  'spainprimeradivision': 'laliga',
  'seriea': 'serie-a',
  'italianseriea': 'serie-a',
  'bundesliga': 'bundesliga',
  'german1bundesliga': 'bundesliga',
  'ligue1': 'ligue1',
  'frenchligue1': 'ligue1',
  'mls': 'mls',
  'usamajorleaguesoccer': 'mls',
  'majorleaguesoccer': 'mls',
  'saudiproleague': 'saudi-league',
  'saudiprofessionalleague': 'saudi-league',
  'roshnsaudileague': 'saudi-league',
  'proleague': 'saudi-league'
};

const CLUB_TAG_MAPPING: Record<string, string> = {
  'fcbarcelona': 'barcelona',
  'barcelona': 'barcelona',
  'realmadrid': 'real-madrid',
  'realmadridcf': 'real-madrid',
  'atleticomadrid': 'atletico',
  'atletico': 'atletico',
  'manchestercity': 'manchester-city',
  'manchesterunited': 'manchester-united',
  'liverpool': 'liverpool',
  'liverpoolfc': 'liverpool',
  'chelsea': 'chelsea',
  'chelseafc': 'chelsea',
  'arsenal': 'arsenal',
  'arsenalfc': 'arsenal',
  'tottenhamhotspur': 'tottenham',
  'tottenham': 'tottenham',
  'parissaintgermain': 'psg',
  'psg': 'psg',
  'asmonaco': 'monaco',
  'monaco': 'monaco',
  'olympiaquelyonnais': 'lyon',
  'lyon': 'lyon',
  'olympiquedemarseille': 'marseille',
  'marseille': 'marseille',
  'bayernmunchen': 'bavaria',
  'fcbayernmunchen': 'bavaria',
  'bayernmunich': 'bavaria',
  'borussiadortmund': 'dortmund',
  'dortmund': 'dortmund',
  'vflwolfsburg': 'wolfsburg',
  'wolfsburg': 'wolfsburg',
  'juventus': 'juventus',
  'juventusfc': 'juventus',
  'acmilan': 'ac-milan',
  'intermilan': 'inter',
  'internazionale': 'inter',
  'inter': 'inter',
  'asroma': 'roma',
  'roma': 'roma',
  'fcporto': 'porto',
  'porto': 'porto',
  'slbenfica': 'benfica',
  'benfica': 'benfica',
  'afcajax': 'ajax',
  'ajax': 'ajax',
  'intermiami': 'inter-miami',
  'intermiamicf': 'inter-miami',
  'alnassr': 'al-nassr',
  'alnassrfc': 'al-nassr',
  'alhilal': 'al-hilal',
  'alhilalsfc': 'al-hilal',
  'sportingcp': 'sportingcp',
  'sportinglisbon': 'sportingcp',
  'girondinsdebordeaux': 'bordeaux',
  'bordeaux': 'bordeaux',
  'psveindhoven': 'psv',
  'psv': 'psv',
  'alittihad': 'al-ittihad',
  'orlandocity': 'orlandocity',
  'orlandocitysc': 'orlandocity',
  'feyenoord': 'feyenoord',
  'sslazio': 'lazio',
  'lazio': 'lazio',
  'sscnapoli': 'napoli',
  'napoli': 'napoli',
  'lagalaxy': 'lagalaxy',
  'fenerbahcesk': 'fenerbahce',
  'fenerbahce': 'fenerbahce',
  'sevillafc': 'sevilla',
  'sevilla': 'sevilla',
  'losclille': 'lille',
  'lille': 'lille',
  'alahli': 'al-ahli',
  'borussiamonchengladbach': 'gladbach',
  'gladbach': 'gladbach',
  'parmacalcio': 'parma',
  'parma': 'parma',
  'newcastleunited': 'newcastle',
  'newcastle': 'newcastle',
  'udinesecalcio': 'udinese',
  'udinese': 'udinese',
  'valenciacf': 'valencia',
  'valencia': 'valencia',
  'evertonfc': 'everton',
  'everton': 'everton',
  'como1907': 'como',
  'como': 'como'
};

const COACH_ID_TO_MANAGER_TAG: Record<number, string> = {
  455361: 'pep',
  455375: 'mourinho',
  452946: 'simeone',
  455353: 'klopp',
  455384: 'conte',
  455800: 'ancelotti',
  523937: 'tuchel',
  523959: 'luis-enrique',
  37352367: 'flick',
};


function isTopLeague(leagueName: string | undefined, clubName: string | undefined): boolean {
  if (!leagueName && !clubName) return false;
  const lName = (leagueName || '').toLowerCase();
  const cName = (clubName || '').toLowerCase();
  
  if (cName === 'icons' || cName === 'soccer aid') return true;
  
  return TOP_LEAGUES_KEYWORDS.some(keyword => lName.includes(keyword));
}

// Generate aliases from a full name (e.g. "Lionel Andrés Messi Cuccittini" -> ["Lionel Messi", "Messi"])
function generateAliases(shortName: string, longName: string): string[] {
  const aliases = new Set<string>();
  
  const cleanShort = shortName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const cleanLong = longName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  
  aliases.add(cleanShort.toLowerCase());
  aliases.add(cleanLong.toLowerCase());
  
  // Split long name and add last name
  const longNameParts = cleanLong.split(/\s+/);
  if (longNameParts.length > 1) {
    const lastName = longNameParts[longNameParts.length - 1];
    if (lastName.length > 2) {
      aliases.add(lastName.toLowerCase());
    }
    const firstLast = `${longNameParts[0]} ${lastName}`;
    aliases.add(firstLast.toLowerCase());
  }

  // Also strip dots from short name (e.g. "L. Messi" -> "L Messi")
  aliases.add(cleanShort.replace(/\./g, '').toLowerCase());
  
  return Array.from(aliases);
}

interface GroupedPlayer {
  playerId: string;
  maxOverall: number;
  bestRow: any;
  allClubs: Set<string>; // club tags
  clubDetails: Map<string, { name: string, leagueTag: string, leagueName: string }>;
  managers: Set<string>; // 'pep', 'mourinho'
}

async function run() {
  const startTime = Date.now();

  // ── Find and verify path to male_teams.csv ──
  const teamPathsToCheck = [
    path.resolve(process.cwd(), 'male_teams.csv'),
    path.resolve(process.cwd(), '..', 'male_teams.csv'),
    path.resolve(process.cwd(), 'server', 'male_teams.csv'),
  ];
  let teamCsvPath = '';
  for (const p of teamPathsToCheck) {
    if (fs.existsSync(p)) {
      teamCsvPath = p;
      break;
    }
  }

  const teamCoachMap = new Map<string, number>();
  if (teamCsvPath) {
    console.log(`🚀 Found Teams CSV at: ${teamCsvPath}`);
    console.log('⏳ Loading team-coach relationships into memory...');
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(teamCsvPath)
        .pipe(csv())
        .on('data', (row) => {
          const teamId = row.team_id || row.club_team_id;
          const fifaVersion = normalizeVersion(row.fifa_version);
          const coachId = parseInt(row.coach_id || '0', 10);
          if (teamId && fifaVersion && coachId) {
            teamCoachMap.set(`${fifaVersion}_${teamId}`, coachId);
          }
        })
        .on('end', () => {
          console.log(`📊 Loaded ${teamCoachMap.size} team-coach mappings`);
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  } else {
    console.log('⚠️ Could not find male_teams.csv. Manager auto-mapping will be skipped.');
  }

  // ── Find and verify path to male_players.csv ──
  const pathsToCheck = [
    path.resolve(process.cwd(), 'male_fc_24_players.csv'),
    path.resolve(process.cwd(), 'male_players.csv'),
    path.resolve(process.cwd(), '..', 'male_fc_24_players.csv'),
    path.resolve(process.cwd(), '..', 'male_players.csv'),
    path.resolve(process.cwd(), 'server', 'male_fc_24_players.csv'),
    path.resolve(process.cwd(), 'server', 'male_players.csv'),
  ];

  let csvPath = '';
  for (const p of pathsToCheck) {
    if (fs.existsSync(p)) {
      csvPath = p;
      break;
    }
  }

  if (!csvPath) {
    console.error('❌ Could not find male_players.csv or male_fc_24_players.csv in the root or server folder.');
    process.exit(1);
  }

  console.log(`🚀 Found Players CSV at: ${csvPath}`);
  console.log('⏳ Grouping players and collecting historical clubs/managers. This might take a few moments...');

  const playerMap = new Map<string, GroupedPlayer>();

  // Parse Players CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        const playerId = row.player_id;
        if (!playerId) return;

        const overall = parseInt(row.overall || '0', 10);
        const leagueName = row.league || row.league_name;
        const clubName = row.club || row.club_name;
        const clubTeamId = row.club_team_id;
        const fifaVersion = normalizeVersion(row.fifa_version);

        let playerEntry = playerMap.get(playerId);
        if (!playerEntry) {
          playerEntry = {
            playerId,
            maxOverall: 0,
            bestRow: null,
            allClubs: new Set(),
            clubDetails: new Map(),
            managers: new Set(),
          };
          playerMap.set(playerId, playerEntry);
        }

        if (overall > playerEntry.maxOverall) {
          playerEntry.maxOverall = overall;
          playerEntry.bestRow = row;
        }

        // Collect club and league if present
        if (clubName && leagueName) {
          let clubTag = slugify(clubName);
          if (CLUB_TAG_MAPPING[clubTag]) {
            clubTag = CLUB_TAG_MAPPING[clubTag];
          }
          let leagueTag = slugify(leagueName);
          if (LEAGUE_TAG_MAPPING[leagueTag]) {
            leagueTag = LEAGUE_TAG_MAPPING[leagueTag];
          }

          playerEntry.allClubs.add(clubTag);
          playerEntry.clubDetails.set(clubTag, {
            name: clubName,
            leagueTag,
            leagueName
          });

          // Check if coach matches a known manager in this version
          if (clubTeamId && fifaVersion) {
            const coachId = teamCoachMap.get(`${fifaVersion}_${clubTeamId}`);
            if (coachId) {
              const managerTag = COACH_ID_TO_MANAGER_TAG[coachId];
              if (managerTag) {
                playerEntry.managers.add(managerTag);
              }
            }
          }
        }
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => reject(err));
  });

  // Filter: Peak overall rating >= 80 and the best row is in a top league (or icons)
  const groupedPlayersToImport = Array.from(playerMap.values()).filter(entry => {
    if (!entry.bestRow) return false;
    const bestLeague = entry.bestRow.league || entry.bestRow.league_name;
    const bestClub = entry.bestRow.club || entry.bestRow.club_name;
    return entry.maxOverall >= 80 && isTopLeague(bestLeague, bestClub);
  });

  console.log(`📊 Found ${groupedPlayersToImport.length} unique players (grouped by ID) matching criteria`);

  // Pre-deduplicate by final database ID to avoid duplicate keys and merge clubs/managers
  const finalPlayersToUpsert = new Map<string, {
    id: string;
    name: string;
    shortName: string;
    longName: string;
    nationality: string | null;
    position: string | null;
    aliases: Set<string>;
    clubs: Map<string, { name: string, leagueTag: string, leagueName: string }>;
    managers: Set<string>;
  }>();

  for (const entry of groupedPlayersToImport) {
    const row = entry.bestRow;
    const name = row.name || row.long_name || row.short_name;
    const shortName = row.short_name || row.name || '';
    const longName = row.long_name || row.name || '';

    const shortSlug = slugify(shortName);
    const longSlug = slugify(longName);

    // Try to resolve the ID using SEED_ID_MAPPING
    let id = shortSlug;
    if (SEED_ID_MAPPING[shortSlug]) {
      id = SEED_ID_MAPPING[shortSlug];
    } else if (SEED_ID_MAPPING[longSlug]) {
      id = SEED_ID_MAPPING[longSlug];
    } else {
      // Dynamic lookup in DB for existing seeded player to map to
      const existingPlayer = await prisma.player.findFirst({
        where: {
          OR: [
            { id: shortSlug },
            { id: longSlug },
            { name: { equals: longName, mode: 'insensitive' } },
            { name: { equals: shortName, mode: 'insensitive' } },
            { aliases: { has: shortName.toLowerCase() } },
            { aliases: { has: longName.toLowerCase() } },
          ]
        },
        select: { id: true }
      });
      if (existingPlayer) {
        id = existingPlayer.id;
      }
    }

    const nationality = row.nation || row.nationality_name || null;
    const rawPositions = row.position || row.player_positions || '';
    let position = 'Forward';
    const posUpper = rawPositions.toUpperCase();
    if (posUpper.includes('GK')) {
      position = 'Goalkeeper';
    } else if (posUpper.includes('CB') || posUpper.includes('LB') || posUpper.includes('RB') || posUpper.includes('LWB') || posUpper.includes('RWB') || posUpper.includes('DF')) {
      position = 'Defender';
    } else if (posUpper.includes('CM') || posUpper.includes('CDM') || posUpper.includes('CAM') || posUpper.includes('LM') || posUpper.includes('RM') || posUpper.includes('MF')) {
      position = 'Midfielder';
    }

    // Generate aliases
    const aliases = generateAliases(shortName, longName);

    let existingMerged = finalPlayersToUpsert.get(id);
    if (!existingMerged) {
      existingMerged = {
        id,
        name,
        shortName,
        longName,
        nationality,
        position,
        aliases: new Set(aliases),
        clubs: new Map(),
        managers: new Set(),
      };
      finalPlayersToUpsert.set(id, existingMerged);
    }

    // Merge clubs
    for (const [clubTag, details] of entry.clubDetails.entries()) {
      existingMerged.clubs.set(clubTag, details);
    }

    // Merge managers
    for (const m of entry.managers) {
      existingMerged.managers.add(m);
    }
  }

  console.log(`📊 Unique merged player records to insert: ${finalPlayersToUpsert.size}`);
  console.log('⏳ Performing bulk database insertions...');

  // 1. Collect unique leagues & clubs
  const uniqueLeagues = new Map<string, { tag: string, name: string }>();
  const uniqueClubs = new Map<string, { tag: string, name: string, leagueTag?: string }>();

  for (const p of finalPlayersToUpsert.values()) {
    for (const [clubTag, clubDetails] of p.clubs.entries()) {
      if (clubDetails.leagueTag && clubDetails.leagueName) {
        uniqueLeagues.set(clubDetails.leagueTag, {
          tag: clubDetails.leagueTag,
          name: clubDetails.leagueName
        });
      }
      uniqueClubs.set(clubTag, {
        tag: clubTag,
        name: clubDetails.name,
        leagueTag: clubDetails.leagueTag || undefined
      });
    }
  }

  // 2. Bulk insert Leagues
  const leaguesData = Array.from(uniqueLeagues.values()).map(l => ({ tag: l.tag, name: l.name }));
  await prisma.league.createMany({ data: leaguesData, skipDuplicates: true });
  console.log(`  ✓ Bulk inserted ${leaguesData.length} unique leagues`);

  // Query database leagues to build a tag -> id mapping
  const dbLeagues = await prisma.league.findMany();
  const leagueTagToId = new Map(dbLeagues.map(l => [l.tag, l.id]));

  // 3. Bulk insert Clubs
  const clubsData = Array.from(uniqueClubs.values()).map(c => ({
    tag: c.tag,
    name: c.name,
    leagueId: c.leagueTag ? leagueTagToId.get(c.leagueTag) : null
  }));
  await prisma.club.createMany({ data: clubsData, skipDuplicates: true });
  console.log(`  ✓ Bulk inserted ${clubsData.length} unique clubs`);

  // Query database clubs to build a tag -> id mapping
  const dbClubs = await prisma.club.findMany();
  const clubTagToId = new Map(dbClubs.map(c => [c.tag, c.id]));

  // 4. Bulk insert Players (ignore duplicate IDs like manually seeded players to preserve their manual metadata)
  const playersData = Array.from(finalPlayersToUpsert.values()).map(p => ({
    id: p.id,
    name: p.name,
    nationality: p.nationality,
    position: p.position,
    aliases: Array.from(p.aliases)
  }));
  await prisma.player.createMany({ data: playersData, skipDuplicates: true });
  console.log(`  ✓ Bulk inserted ${playersData.length} players`);

  // 4b. Sync aliases and names for existing/seeded players that were skipped by createMany
  const existingDbPlayers = await prisma.player.findMany({
    where: {
      id: { in: Array.from(finalPlayersToUpsert.keys()) }
    },
    select: { id: true, name: true, aliases: true }
  });

  console.log(`⏳ Merging aliases and metadata for ${existingDbPlayers.length} existing players...`);
  for (const dbPlayer of existingDbPlayers) {
    const csvPlayer = finalPlayersToUpsert.get(dbPlayer.id);
    if (csvPlayer) {
      const mergedAliases = new Set([...dbPlayer.aliases, ...csvPlayer.aliases]);
      const newName = csvPlayer.name.length > dbPlayer.name.length ? csvPlayer.name : dbPlayer.name;

      await prisma.player.update({
        where: { id: dbPlayer.id },
        data: {
          name: newName,
          aliases: Array.from(mergedAliases)
        }
      });
    }
  }
  console.log('  ✓ Merged aliases and metadata successfully.');

  // 5. Bulk insert Player relations (PlayerClub, PlayerLeague, PlayerManager)
  const playerClubsData: any[] = [];
  const playerLeaguesData: any[] = [];
  const playerManagersData: any[] = [];

  // Fetch managers
  const dbManagers = await prisma.manager.findMany();
  const managerTagToId = new Map(dbManagers.map(m => [m.tag, m.id]));

  for (const p of finalPlayersToUpsert.values()) {
    // 5a. Clubs relations
    for (const clubTag of p.clubs.keys()) {
      const clubId = clubTagToId.get(clubTag);
      if (clubId) {
        playerClubsData.push({ playerId: p.id, clubId });
      }
    }

    // 5b. Leagues relations (for all leagues associated with their clubs)
    const leaguesForPlayer = new Set<string>();
    for (const clubDetails of p.clubs.values()) {
      if (clubDetails.leagueTag) leaguesForPlayer.add(clubDetails.leagueTag);
    }
    for (const lTag of leaguesForPlayer) {
      const leagueId = leagueTagToId.get(lTag);
      if (leagueId) {
        playerLeaguesData.push({ playerId: p.id, leagueId });
      }
    }

    // 5c. Managers relations
    for (const mTag of p.managers) {
      const managerId = managerTagToId.get(mTag);
      if (managerId) {
        playerManagersData.push({ playerId: p.id, managerId });
      }
    }
  }

  // Insert relations in batch
  await Promise.all([
    prisma.playerClub.createMany({ data: playerClubsData, skipDuplicates: true }),
    prisma.playerLeague.createMany({ data: playerLeaguesData, skipDuplicates: true }),
    prisma.playerManager.createMany({ data: playerManagersData, skipDuplicates: true })
  ]);

  console.log(`  ✓ Linked ${playerClubsData.length} player-club mappings`);
  console.log(`  ✓ Linked ${playerLeaguesData.length} player-league mappings`);
  console.log(`  ✓ Linked ${playerManagersData.length} player-manager mappings`);

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 Success! Successfully bulk imported and merged all player datasets in ${durationSec}s!`);
}

run()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

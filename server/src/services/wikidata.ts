import { prisma } from '../lib/prisma.js';

// Static mapping of common country QIDs to their English labels
const QID_COUNTRY_MAP: Record<string, string> = {
  'Q155': 'Brazil',
  'Q414': 'Argentina',
  'Q142': 'France',
  'Q29': 'Spain',
  'Q183': 'Germany',
  'Q38': 'Italy',
  'Q21': 'England',
  'Q145': 'England', // UK often stands for England in soccer databases
  'Q22': 'Scotland',
  'Q25': 'Wales',
  'Q26': 'Northern Ireland',
  'Q55': 'Netherlands',
  'Q45': 'Portugal',
  'Q224': 'Croatia',
  'Q31': 'Belgium',
  'Q33': 'Finland',
  'Q16': 'Canada',
  'Q232': 'Kazakhstan',
  'Q1009': 'Cameroon',
  'Q1017': 'Nigeria',
  'Q79': 'Egypt',
  'Q262': 'Algeria',
  'Q1028': 'Morocco',
  'Q1049': 'Senegal',
  'Q884': 'South Korea',
  'Q17': 'Japan',
  'Q96': 'Mexico',
  'Q30': 'USA',
  'Q159': 'Russia',
  'Q212': 'Ukraine',
  'Q213': 'Czechia',
  'Q36': 'Poland',
  'Q35': 'Denmark',
  'Q34': 'Sweden',
  'Q20': 'Norway',
  'Q739': 'Colombia',
  'Q717': 'Venezuela',
  'Q733': 'Paraguay',
  'Q77': 'Uruguay',
  'Q298': 'Chile',
  'Q258': 'South Africa',
  'Q265': 'Uzbekistan',
  'Q419': 'Peru',
  'Q715': 'Ecuador',
  'Q734': 'Bolivia',
};

// Static mapping of position QIDs
const QID_POSITION_MAP: Record<string, string> = {
  'Q1151268': 'Defender',
  'Q193592': 'Midfielder',
  'Q280658': 'Forward',
  'Q1151247': 'Goalkeeper',
  'Q193590': 'Winger',
};

// Static mapping of club QIDs to database club tags
const QID_CLUB_MAP: Record<string, string> = {
  'Q11308': 'barcelona',
  'Q8682': 'real-madrid',
  'Q20909': 'atletico',
  'Q12706': 'manchester-city',
  'Q18656': 'manchester-united',
  'Q113084': 'liverpool',
  'Q9616': 'chelsea',
  'Q9617': 'arsenal',
  'Q18726': 'tottenham',
  'Q483020': 'psg',
  'Q193309': 'monaco',
  'Q101078': 'lyon',
  'Q48480': 'marseille',
  'Q15789': 'bavaria',
  'Q11911': 'dortmund',
  'Q10186': 'wolfsburg',
  'Q1422': 'juventus',
  'Q1543': 'ac-milan',
  'Q10875': 'inter',
  'Q5381': 'roma',
  'Q108422': 'porto',
  'Q131499': 'benfica',
  'Q8124': 'ajax',
  'Q169043': 'inter-miami',
  'Q51880918': 'inter-miami', // Alternative Inter Miami QID
  'Q482310': 'al-nassr',
  'Q314050': 'al-hilal',
  'Q7511': 'sportingcp',
  'Q101070': 'bordeaux',
  'Q11909': 'psv',
  'Q482442': 'al-ittihad',
  'Q16847008': 'orlandocity',
  'Q12402': 'feyenoord',
  'Q3412': 'lazio',
  'Q201376': 'napoli',
  'Q193278': 'lagalaxy',
  'Q134267': 'fenerbahce',
  'Q10349': 'sevilla',
  'Q113085': 'lille',
  'Q483120': 'al-ahli',
  'Q101859': 'gladbach',
  'Q217036': 'parma',
  'Q18570': 'newcastle',
  'Q10471': 'udinese',
  'Q9474': 'valencia',
  'Q5794': 'everton',
  'Q24483': 'como',
};

// Manager Tenures mapping to identify player-manager links by year overlaps
interface ManagerTenure {
  manager: string;
  club: string;
  start: number;
  end: number;
}

const MANAGER_TENURES: ManagerTenure[] = [
  { manager: 'pep', club: 'barcelona', start: 2008, end: 2012 },
  { manager: 'pep', club: 'bavaria', start: 2013, end: 2016 },
  { manager: 'pep', club: 'manchester-city', start: 2016, end: 2026 },
  
  { manager: 'ancelotti', club: 'juventus', start: 1999, end: 2001 },
  { manager: 'ancelotti', club: 'ac-milan', start: 2001, end: 2009 },
  { manager: 'ancelotti', club: 'chelsea', start: 2009, end: 2011 },
  { manager: 'ancelotti', club: 'psg', start: 2011, end: 2013 },
  { manager: 'ancelotti', club: 'real-madrid', start: 2013, end: 2015 },
  { manager: 'ancelotti', club: 'bavaria', start: 2016, end: 2017 },
  { manager: 'ancelotti', club: 'napoli', start: 2018, end: 2019 },
  { manager: 'ancelotti', club: 'everton', start: 2019, end: 2021 },
  { manager: 'ancelotti', club: 'real-madrid', start: 2021, end: 2026 },
  
  { manager: 'ferguson', club: 'manchester-united', start: 1986, end: 2013 },
  
  { manager: 'mourinho', club: 'porto', start: 2002, end: 2004 },
  { manager: 'mourinho', club: 'chelsea', start: 2004, end: 2007 },
  { manager: 'mourinho', club: 'inter', start: 2008, end: 2010 },
  { manager: 'mourinho', club: 'real-madrid', start: 2010, end: 2013 },
  { manager: 'mourinho', club: 'chelsea', start: 2013, end: 2015 },
  { manager: 'mourinho', club: 'manchester-united', start: 2016, end: 2018 },
  { manager: 'mourinho', club: 'tottenham', start: 2019, end: 2021 },
  { manager: 'mourinho', club: 'roma', start: 2021, end: 2024 },
  { manager: 'mourinho', club: 'fenerbahce', start: 2024, end: 2026 },
  
  { manager: 'klopp', club: 'dortmund', start: 2008, end: 2015 },
  { manager: 'klopp', club: 'liverpool', start: 2015, end: 2024 },
  
  { manager: 'zidane', club: 'real-madrid', start: 2016, end: 2018 },
  { manager: 'zidane', club: 'real-madrid', start: 2019, end: 2021 },
  
  { manager: 'simeone', club: 'atletico', start: 2011, end: 2026 },
  
  { manager: 'wenger', club: 'monaco', start: 1987, end: 1994 },
  { manager: 'wenger', club: 'arsenal', start: 1996, end: 2018 },
  
  { manager: 'del-bosque', club: 'real-madrid', start: 1999, end: 2003 },
  
  { manager: 'luis-enrique', club: 'barcelona', start: 2014, end: 2017 },
  { manager: 'luis-enrique', club: 'psg', start: 2023, end: 2026 },
  
  { manager: 'conte', club: 'juventus', start: 2011, end: 2014 },
  { manager: 'conte', club: 'chelsea', start: 2016, end: 2018 },
  { manager: 'conte', club: 'inter', start: 2019, end: 2021 },
  { manager: 'conte', club: 'tottenham', start: 2021, end: 2023 },
  
  { manager: 'tuchel', club: 'dortmund', start: 2015, end: 2017 },
  { manager: 'tuchel', club: 'psg', start: 2018, end: 2020 },
  { manager: 'tuchel', club: 'chelsea', start: 2021, end: 2022 },
  { manager: 'tuchel', club: 'bavaria', start: 2023, end: 2024 },
  
  { manager: 'flick', club: 'bavaria', start: 2019, end: 2021 },
  { manager: 'flick', club: 'barcelona', start: 2024, end: 2026 },
  
  { manager: 'capello', club: 'ac-milan', start: 1991, end: 1996 },
  { manager: 'capello', club: 'real-madrid', start: 1996, end: 1997 },
  { manager: 'capello', club: 'ac-milan', start: 1997, end: 1998 },
  { manager: 'capello', club: 'roma', start: 1999, end: 2004 },
  { manager: 'capello', club: 'juventus', start: 2004, end: 2006 },
  { manager: 'capello', club: 'real-madrid', start: 2006, end: 2007 },
  
  { manager: 'heynckes', club: 'bavaria', start: 1987, end: 1991 },
  { manager: 'heynckes', club: 'real-madrid', start: 1997, end: 1998 },
  { manager: 'heynckes', club: 'benfica', start: 1999, end: 2000 },
  { manager: 'heynckes', club: 'bavaria', start: 2011, end: 2013 },
  { manager: 'heynckes', club: 'bavaria', start: 2017, end: 2018 }
];

export interface ScrapedPlayer {
  name: string;
  aliases: string[];
  nationality: string;
  position: string;
  tags: string[];
}

// Search for a player in Wikidata
async function searchWikidataId(name: string): Promise<string | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
    name
  )}&language=en&format=json&limit=5&type=item&origin=*`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FootballTicTacToeBot/1.0 (contact: admin@football-tictactoe.com)'
      }
    });
    const data = (await response.json()) as any;
    if (data.search && data.search.length > 0) {
      // Return the first ID
      return data.search[0].id;
    }
  } catch (error) {
    console.error(`Error searching Wikidata for ${name}:`, error);
  }
  return null;
}

// Fetch country label dynamically if not in static map
async function fetchLabel(qid: string): Promise<string | null> {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FootballTicTacToeBot/1.0 (contact: admin@football-tictactoe.com)'
      }
    });
    const data = (await response.json()) as any;
    return data.entities[qid]?.labels?.en?.value || null;
  } catch {
    return null;
  }
}

// Main Scraper Logic
export async function scrapePlayerFromWikidata(name: string): Promise<ScrapedPlayer | null> {
  const qid = await searchWikidataId(name);
  if (!qid) return null;

  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FootballTicTacToeBot/1.0 (contact: admin@football-tictactoe.com)'
      }
    });
    const data = (await response.json()) as any;
    const entity = data.entities[qid];
    if (!entity) return null;

    const enLabel = entity.labels?.en?.value || '';
    const ruLabel = entity.labels?.ru?.value || '';
    const playerName = ruLabel || enLabel || name;

    // Build aliases list
    const aliasesSet = new Set<string>();
    aliasesSet.add(playerName.toLowerCase());
    if (enLabel) aliasesSet.add(enLabel.toLowerCase());
    if (ruLabel) aliasesSet.add(ruLabel.toLowerCase());
    
    // Add custom aliases from Wikidata
    const enAliases = entity.aliases?.en?.map((a: any) => a.value.toLowerCase()) || [];
    const ruAliases = entity.aliases?.ru?.map((a: any) => a.value.toLowerCase()) || [];
    for (const a of [...enAliases, ...ruAliases]) {
      aliasesSet.add(a);
    }

    // Resolve Nationality (P27)
    let nationality = '';
    const nationalityClaim = entity.claims?.P27?.[0];
    if (nationalityClaim) {
      const countryQid = nationalityClaim.mainsnak?.datavalue?.value?.id;
      if (countryQid) {
        nationality = QID_COUNTRY_MAP[countryQid] || (await fetchLabel(countryQid)) || '';
      }
    }

    // Resolve Position (P413)
    let position = '';
    const positionClaims = entity.claims?.P413 || [];
    for (const pClaim of positionClaims) {
      const posQid = pClaim.mainsnak?.datavalue?.value?.id;
      if (posQid && QID_POSITION_MAP[posQid]) {
        position = QID_POSITION_MAP[posQid];
        break; // Take the first recognized position
      }
    }

    // Fetch database clubs and leagues to determine league relations
    const dbClubs = await prisma.club.findMany({ include: { league: true } });
    const clubTagToLeagueTag = new Map<string, string>();
    for (const c of dbClubs) {
      if (c.league?.tag) {
        clubTagToLeagueTag.set(c.tag, c.league.tag);
      }
    }

    // Resolve Clubs (P54) and Managers by overlapping years
    const tagsSet = new Set<string>();
    const clubClaims = entity.claims?.P54 || [];
    
    const parsedClubs: { tag: string; start: number; end: number }[] = [];

    for (const cClaim of clubClaims) {
      const clubQid = cClaim.mainsnak?.datavalue?.value?.id;
      if (!clubQid) continue;

      let clubTag = QID_CLUB_MAP[clubQid];

      // If QID is not in static map, fallback to fuzzy label matching
      if (!clubTag) {
        const clubLabel = (await fetchLabel(clubQid)) || '';
        if (clubLabel) {
          const matchedClub = dbClubs.find(c => {
            const labelLower = clubLabel.toLowerCase();
            const nameLower = c.name.toLowerCase();
            const escapedName = nameLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedName}\\b`);
            return regex.test(labelLower) || nameLower.includes(labelLower);
          });
          if (matchedClub) {
            clubTag = matchedClub.tag;
          }
        }
      }

      if (clubTag) {
        tagsSet.add(clubTag);
        
        // Link the league automatically
        const leagueTag = clubTagToLeagueTag.get(clubTag);
        if (leagueTag) {
          tagsSet.add(leagueTag);
        }

        // Parse years to link managers later
        let startYear = 0;
        let endYear = new Date().getFullYear();

        const startQual = cClaim.qualifiers?.P580?.[0];
        if (startQual && startQual.datavalue?.value?.time) {
          const match = startQual.datavalue.value.time.match(/^\+?(-?\d+)/);
          if (match) startYear = parseInt(match[1], 10);
        }

        const endQual = cClaim.qualifiers?.P582?.[0];
        if (endQual && endQual.datavalue?.value?.time) {
          const match = endQual.datavalue.value.time.match(/^\+?(-?\d+)/);
          if (match) endYear = parseInt(match[1], 10);
        }

        if (startYear > 0) {
          parsedClubs.push({ tag: clubTag, start: startYear, end: endYear });
        }
      }
    }

    // Resolve Managers based on parsed club stints and tenures
    for (const stint of parsedClubs) {
      const matchingTenures = MANAGER_TENURES.filter(
        t => t.club === stint.tag && stint.start <= t.end && stint.end >= t.start
      );
      for (const t of matchingTenures) {
        tagsSet.add(t.manager);
      }
    }

    // Resolve Tournaments (Awards P166 and Participation P1344)
    const awardsClaims = entity.claims?.P166 || [];
    for (const aClaim of awardsClaims) {
      const awardQid = aClaim.mainsnak?.datavalue?.value?.id;
      if (awardQid === 'Q229159' || awardQid === 'Q165084') {
        tagsSet.add('ballondor');
      }
      if (awardQid === 'Q20202996') {
        tagsSet.add('worldcup-winner');
        tagsSet.add('worldcup');
      }
      if (awardQid === 'Q18428') {
        tagsSet.add('ucl');
      }
      if (awardQid === 'Q18750') {
        tagsSet.add('uel');
      }
      if (awardQid === 'Q180857') {
        tagsSet.add('euro');
      }
    }

    // Resolve participation (P1344)
    const partClaims = entity.claims?.P1344 || [];
    for (const pClaim of partClaims) {
      const eventQid = pClaim.mainsnak?.datavalue?.value?.id;
      if (eventQid) {
        const eventLabel = (await fetchLabel(eventQid)) || '';
        if (eventLabel) {
          if (eventLabel.includes('FIFA World Cup')) {
            tagsSet.add('worldcup');
          }
          if (eventLabel.includes('UEFA European Championship')) {
            tagsSet.add('euro');
          }
        }
      }
    }

    // Fallback checking: if the player won World Cup, they participated in it
    if (tagsSet.has('worldcup-winner')) {
      tagsSet.add('worldcup');
    }

    // If nationality matches, add it to tags (in lowercase)
    if (nationality) {
      tagsSet.add(nationality.toLowerCase());
    }

    return {
      name: playerName,
      aliases: Array.from(aliasesSet),
      nationality,
      position,
      tags: Array.from(tagsSet),
    };
  } catch (error) {
    console.error(`Error scraping player from Wikidata (${name}):`, error);
  }
  return null;
}

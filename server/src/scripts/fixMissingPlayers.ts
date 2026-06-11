import { prisma } from '../lib/prisma.js';
import Fuse from 'fuse.js';

// Players that seedTournaments couldn't find — fix their aliases or add them manually
// Format: { id, name, nationality, aliases[], clubs[], leagues[], tournaments[] }

const MISSING_KEY_PLAYERS = [
  // ─── Lionel Messi ───
  {
    id: 'messi',
    name: 'Lionel Messi',
    nationality: 'Argentina',
    position: 'Forward',
    aliases: ['lionel messi', 'leo messi', 'messi', 'l. messi', 'l messi'],
    clubs: ['barcelona', 'psg', 'inter-miami'],
    leagues: ['laliga', 'ligue1', 'mls'],
    managers: ['pep'],
    tournaments: ['ucl', 'worldcup-winner', 'copa-america', 'ballondor'],
  },
  // ─── Ryan Giggs ───
  {
    id: 'giggs',
    name: 'Ryan Giggs',
    nationality: 'Wales',
    position: 'Midfielder',
    aliases: ['ryan giggs', 'giggs'],
    clubs: ['manchester-united'],
    leagues: ['premier-league'],
    managers: ['mourinho'],
    tournaments: ['ucl'],
  },
  // ─── Paul Scholes ───
  {
    id: 'scholes',
    name: 'Paul Scholes',
    nationality: 'England',
    position: 'Midfielder',
    aliases: ['paul scholes', 'scholes'],
    clubs: ['manchester-united'],
    leagues: ['premier-league'],
    managers: ['mourinho'],
    tournaments: ['ucl'],
  },
  // ─── Carlos Tevez ───
  {
    id: 'tevez',
    name: 'Carlos Tevez',
    nationality: 'Argentina',
    position: 'Forward',
    aliases: ['carlos tevez', 'tevez', 'carlitos tevez'],
    clubs: ['manchester-united', 'manchester-city', 'juventus'],
    leagues: ['premier-league', 'serie-a'],
    managers: ['pep', 'mourinho'],
    tournaments: ['ucl'],
  },
  // ─── Wesley Sneijder ───
  {
    id: 'sneijder',
    name: 'Wesley Sneijder',
    nationality: 'Netherlands',
    position: 'Midfielder',
    aliases: ['wesley sneijder', 'sneijder', 'w. sneijder'],
    clubs: ['inter', 'real-madrid'],
    leagues: ['serie-a', 'laliga'],
    managers: ['mourinho'],
    tournaments: ['ucl'],
  },
  // ─── Gennaro Gattuso ───
  {
    id: 'gattuso',
    name: 'Gennaro Gattuso',
    nationality: 'Italy',
    position: 'Midfielder',
    aliases: ['gennaro gattuso', 'gattuso', 'rino gattuso'],
    clubs: ['ac-milan'],
    leagues: ['serie-a'],
    managers: [],
    tournaments: ['ucl', 'worldcup-winner'],
  },
  // ─── Diego Milito ───
  {
    id: 'milito',
    name: 'Diego Milito',
    nationality: 'Argentina',
    position: 'Forward',
    aliases: ['diego milito', 'milito', 'd. milito'],
    clubs: ['inter'],
    leagues: ['serie-a'],
    managers: ['mourinho'],
    tournaments: ['ucl'],
  },
  // ─── Arturo Vidal ───
  {
    id: 'avidal',
    name: 'Arturo Vidal',
    nationality: 'Chile',
    position: 'Midfielder',
    aliases: ['arturo vidal', 'vidal', 'a. vidal', 'arturo erasmo vidal'],
    clubs: ['barcelona', 'bavaria', 'inter', 'juventus'],
    leagues: ['laliga', 'bundesliga', 'serie-a'],
    managers: ['pep'],
    tournaments: ['ucl', 'copa-america', 'worldcup'],
  },
  // ─── Claudio Bravo ───
  {
    id: 'cbravo',
    name: 'Claudio Bravo',
    nationality: 'Chile',
    position: 'Goalkeeper',
    aliases: ['claudio bravo', 'bravo', 'c. bravo'],
    clubs: ['manchester-city', 'barcelona', 'real-sociedad'],
    leagues: ['premier-league', 'laliga'],
    managers: ['pep'],
    tournaments: ['copa-america', 'worldcup'],
  },
  // ─── Edinson Cavani ───
  {
    id: 'cavani',
    name: 'Edinson Cavani',
    nationality: 'Uruguay',
    position: 'Forward',
    aliases: ['edinson cavani', 'cavani', 'el matador', 'e. cavani'],
    clubs: ['psg', 'manchester-united', 'atletico', 'napoli'],
    leagues: ['ligue1', 'premier-league', 'laliga', 'serie-a'],
    managers: ['mourinho', 'conte'],
    tournaments: ['worldcup'],
  },
  // ─── Darwin Nunez ───
  {
    id: 'dnunez',
    name: 'Darwin Nunez',
    nationality: 'Uruguay',
    position: 'Forward',
    aliases: ['darwin nunez', 'nunez', 'd. nunez', 'darwin gabriel nunez ribeiro'],
    clubs: ['liverpool'],
    leagues: ['premier-league'],
    managers: [],
    tournaments: ['worldcup'],
  },
  // ─── Riyad Mahrez ───
  {
    id: 'rmahrez',
    name: 'Riyad Mahrez',
    nationality: 'Algeria',
    position: 'Forward',
    aliases: ['riyad mahrez', 'mahrez', 'r. mahrez'],
    clubs: ['manchester-city', 'leicestercity', 'al-ahli'],
    leagues: ['premier-league', 'saudi-league'],
    managers: ['pep'],
    tournaments: ['ucl'],
  },
];

async function main() {
  console.log('🔧 Fixing missing key players...\n');

  // Load existing DB data
  const dbClubs = await prisma.club.findMany();
  const clubTagToId = new Map(dbClubs.map(c => [c.tag, c.id]));

  const dbLeagues = await prisma.league.findMany();
  const leagueTagToId = new Map(dbLeagues.map(l => [l.tag, l.id]));

  const dbManagers = await prisma.manager.findMany();
  const managerTagToId = new Map(dbManagers.map(m => [m.tag, m.id]));

  const dbTournaments = await prisma.tournament.findMany();
  const tournamentTagToId = new Map(dbTournaments.map(t => [t.tag, t.id]));

  for (const p of MISSING_KEY_PLAYERS) {
    // Upsert player
    await prisma.player.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name,
        nationality: p.nationality,
        position: p.position,
        aliases: p.aliases,
      },
      update: {
        aliases: p.aliases,
        nationality: p.nationality,
      },
    });

    // Club links
    for (const clubTag of p.clubs) {
      const clubId = clubTagToId.get(clubTag);
      if (clubId) {
        await prisma.playerClub.upsert({
          where: { playerId_clubId: { playerId: p.id, clubId } },
          create: { playerId: p.id, clubId },
          update: {},
        });
        // Find league for this club and link
        const club = dbClubs.find(c => c.id === clubId);
        if (club?.leagueId) {
          await prisma.playerLeague.upsert({
            where: { playerId_leagueId: { playerId: p.id, leagueId: club.leagueId } },
            create: { playerId: p.id, leagueId: club.leagueId },
            update: {},
          }).catch(() => {});
        }
      }
    }

    // League links (explicit)
    for (const leagueTag of p.leagues) {
      const leagueId = leagueTagToId.get(leagueTag);
      if (leagueId) {
        await prisma.playerLeague.upsert({
          where: { playerId_leagueId: { playerId: p.id, leagueId } },
          create: { playerId: p.id, leagueId },
          update: {},
        }).catch(() => {});
      }
    }

    // Manager links
    for (const managerTag of p.managers) {
      const managerId = managerTagToId.get(managerTag);
      if (managerId) {
        await prisma.playerManager.upsert({
          where: { playerId_managerId: { playerId: p.id, managerId } },
          create: { playerId: p.id, managerId },
          update: {},
        }).catch(() => {});
      }
    }

    // Tournament links
    for (const tournamentTag of p.tournaments) {
      const tournamentId = tournamentTagToId.get(tournamentTag);
      if (tournamentId) {
        await prisma.playerTournament.upsert({
          where: { playerId_tournamentId: { playerId: p.id, tournamentId } },
          create: { playerId: p.id, tournamentId },
          update: {},
        }).catch(() => {});
      }
    }

    console.log(`✅ ${p.name} — clubs:${p.clubs.length} leagues:${p.leagues.length} managers:${p.managers.length} tournaments:${p.tournaments.length}`);
  }

  console.log('\n🎉 Done fixing missing players!');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

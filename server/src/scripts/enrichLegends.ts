import { prisma } from '../lib/prisma.js';
import { scrapePlayerFromWikidata } from '../services/wikidata.js';

async function enrichAllPlayers() {
  console.log('🚀 Starting Database Enrichment from Wikidata...');

  const players = await prisma.player.findMany({
    orderBy: { name: 'asc' },
  });

  console.log(`📊 Found ${players.length} players to enrich. Processing...\n`);

  let successCount = 0;

  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    console.log(`[${i + 1}/${players.length}] ⏳ Scraping: "${p.name}" (ID: ${p.id})...`);
    
    // We try to scrape using the player's name
    const scraped = await scrapePlayerFromWikidata(p.name);
    if (!scraped) {
      console.log(`  ⚠️  Player not found on Wikidata. Skipping.`);
      console.log('-------------------------------------------');
      continue;
    }

    console.log(`  ✓ Found: "${scraped.name}" (${scraped.nationality}, ${scraped.position})`);
    console.log(`  ✓ Parsed Tags: ${scraped.tags.join(', ')}`);

    // Merge aliases
    const mergedAliases = Array.from(new Set([...p.aliases, ...scraped.aliases, p.name.toLowerCase()]));

    // Update Player profile
    await prisma.player.update({
      where: { id: p.id },
      data: {
        name: scraped.name,
        nationality: scraped.nationality || p.nationality,
        position: scraped.position || p.position,
        aliases: mergedAliases,
      },
    });

    // We filter the tags into clubs, leagues, managers, and tournaments
    const dbClubs = await prisma.club.findMany();
    const dbLeagues = await prisma.league.findMany();
    const dbManagers = await prisma.manager.findMany();
    const dbTournaments = await prisma.tournament.findMany();

    const clubTags = scraped.tags.filter(t => dbClubs.some(c => c.tag === t));
    const leagueTags = scraped.tags.filter(t => dbLeagues.some(l => l.tag === t));
    const managerTags = scraped.tags.filter(t => dbManagers.some(m => m.tag === t));
    const tournamentTags = scraped.tags.filter(t => dbTournaments.some(tr => tr.tag === t));

    // Clear old relations and rebuild
    await prisma.$transaction([
      prisma.playerClub.deleteMany({ where: { playerId: p.id } }),
      prisma.playerLeague.deleteMany({ where: { playerId: p.id } }),
      prisma.playerManager.deleteMany({ where: { playerId: p.id } }),
      prisma.playerTournament.deleteMany({ where: { playerId: p.id } }),
    ]);

    // Insert new relations
    const clubsToLink = dbClubs.filter(c => clubTags.includes(c.tag));
    const leaguesToLink = dbLeagues.filter(l => leagueTags.includes(l.tag));
    const managersToLink = dbManagers.filter(m => managerTags.includes(m.tag));
    const tournamentsToLink = dbTournaments.filter(tr => tournamentTags.includes(tr.tag));

    await Promise.all([
      ...clubsToLink.map(c =>
        prisma.playerClub.create({
          data: { playerId: p.id, clubId: c.id },
        })
      ),
      ...leaguesToLink.map(l =>
        prisma.playerLeague.create({
          data: { playerId: p.id, leagueId: l.id },
        })
      ),
      ...managersToLink.map(m =>
        prisma.playerManager.create({
          data: { playerId: p.id, managerId: m.id },
        })
      ),
      ...tournamentsToLink.map(tr =>
        prisma.playerTournament.create({
          data: { playerId: p.id, tournamentId: tr.id },
        })
      ),
    ]);

    console.log(`  ✓ Linked: ${clubsToLink.length} clubs, ${leaguesToLink.length} leagues, ${managersToLink.length} managers, ${tournamentsToLink.length} tournaments`);
    console.log('-------------------------------------------');
    successCount++;
    
    // Add a small delay to respect Wikidata API limits (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n🎉 Success! Successfully enriched ${successCount}/${players.length} players!`);
}

enrichAllPlayers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

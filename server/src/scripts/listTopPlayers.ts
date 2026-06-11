import { prisma } from '../lib/prisma.js';

async function main() {
  const players = await prisma.player.findMany({
    include: {
      clubs: true,
      managers: true,
      tournaments: true,
      leagues: true
    }
  });

  // Sort by count of relations
  const sorted = players.map(p => {
    const score = p.clubs.length + p.managers.length + p.tournaments.length + p.leagues.length;
    return {
      id: p.id,
      name: p.name,
      nationality: p.nationality,
      position: p.position,
      score,
      clubsCount: p.clubs.length,
      managersCount: p.managers.length,
      tournamentsCount: p.tournaments.length,
      leaguesCount: p.leagues.length,
      clubs: p.clubs,
      managers: p.managers,
      tournaments: p.tournaments,
      leagues: p.leagues
    };
  }).sort((a, b) => b.score - a.score);

  console.log('Top 20 players by relation score:');
  sorted.slice(0, 20).forEach(p => {
    console.log(`${p.name} (${p.id}) - Score: ${p.score} (Clubs: ${p.clubsCount}, Managers: ${p.managersCount}, Tournaments: ${p.tournamentsCount}, Leagues: ${p.leaguesCount})`);
  });

  console.log('\nTotal players with at least 1 club and 1 tournament:', sorted.filter(p => p.clubsCount > 0 && p.tournamentsCount > 0).length);
}

main().catch(console.error).finally(() => prisma.$disconnect());

import { prisma } from '../lib/prisma.js';

async function checkPlayer() {
  const players = await prisma.player.findMany({
    where: {
      OR: [
        { name: { contains: 'James', mode: 'insensitive' } },
        { name: { contains: 'Rodríguez', mode: 'insensitive' } },
      ]
    },
    include: {
      clubs: { include: { club: true } },
      leagues: { include: { league: true } },
      managers: { include: { manager: true } },
      tournaments: { include: { tournament: true } },
    }
  });

  console.log(`Found ${players.length} players:`);
  for (const p of players) {
    console.log(`- ID: ${p.id}, Name: ${p.name}`);
    console.log(`  Nationality: ${p.nationality}, Position: ${p.position}`);
    console.log(`  Clubs: ${p.clubs.map(c => c.club.tag).join(', ')}`);
    console.log(`  Leagues: ${p.leagues.map(l => l.league.tag).join(', ')}`);
    console.log(`  Managers: ${p.managers.map(m => m.manager.tag).join(', ')}`);
    console.log(`  Tournaments: ${p.tournaments.map(t => t.tournament.tag).join(', ')}`);
    console.log('--------------------------------------------');
  }
}

checkPlayer()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

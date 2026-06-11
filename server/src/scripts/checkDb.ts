import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('=== CHECKING DB PLAYERS ===');
  
  const keywords = ['Ibrahimovic', 'Maradona', 'Beckham', 'Ramos', 'Carlos', 'Alves'];
  
  const players = await prisma.player.findMany({
    where: {
      OR: keywords.map(kw => ({ name: { contains: kw, mode: 'insensitive' } }))
    },
    include: {
      clubs: { include: { club: true } },
      leagues: { include: { league: true } },
      managers: { include: { manager: true } },
      tournaments: { include: { tournament: true } }
    }
  });

  for (const p of players) {
    console.log(`Player: ${p.name} (ID: ${p.id})`);
    console.log(`  Nationality: ${p.nationality}, Position: ${p.position}`);
    console.log(`  Clubs: ${p.clubs.map(c => c.club.name).join(', ')}`);
    console.log(`  Leagues: ${p.leagues.map(l => l.league.name).join(', ')}`);
    console.log(`  Managers: ${p.managers.map(m => m.manager.name).join(', ')}`);
    console.log(`  Tournaments: ${p.tournaments.map(t => t.tournament.name).join(', ')}`);
    console.log('---');
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

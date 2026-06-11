import { prisma } from '../lib/prisma.js';

async function checkClubs() {
  const clubs = await prisma.club.findMany({
    where: {
      OR: [
        { name: { contains: 'Madrid', mode: 'insensitive' } },
        { name: { contains: 'Bayern', mode: 'insensitive' } },
        { name: { contains: 'München', mode: 'insensitive' } },
        { tag: { in: ['real-madrid', 'realmadrid', 'bavaria', 'fcbayernmunchen'] } }
      ]
    }
  });

  console.log(JSON.stringify(clubs, null, 2));
}

checkClubs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

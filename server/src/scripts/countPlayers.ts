import { prisma } from '../lib/prisma.js';

async function main() {
  const count = await prisma.player.count();
  console.log('Total players in DB:', count);
}

main().catch(console.error).finally(() => prisma.$disconnect());

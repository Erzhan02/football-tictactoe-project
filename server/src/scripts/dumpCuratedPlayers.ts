import { prisma } from '../lib/prisma.js';
import { writeFileSync } from 'fs';

async function main() {
  const players = await prisma.player.findMany({
    include: {
      clubs: { include: { club: true } },
      leagues: { include: { league: true } },
      managers: { include: { manager: true } },
      tournaments: { include: { tournament: true } }
    }
  });

  // Let's filter players who are in the manual seed or have high significance
  // A player is significant if they have a tournament or are manually seeded, or have many clubs/managers.
  // We can sort them by relation score and select the top 200-250.
  const mapped = players.map(p => {
    const clubs = p.clubs.map(c => c.club.tag);
    const leagues = p.leagues.map(l => l.league.tag);
    const managers = p.managers.map(m => m.manager.tag);
    const tournaments = p.tournaments.map(t => t.tournament.tag);
    
    // Calculate a fame score
    let score = p.clubs.length * 1 + p.managers.length * 2 + p.tournaments.length * 3 + p.leagues.length * 1;
    if (p.nationality) score += 1;
    
    return {
      id: p.id,
      name: p.name,
      aliases: p.aliases,
      nationality: p.nationality,
      position: p.position,
      clubs,
      leagues,
      managers,
      tournaments,
      score
    };
  });

  // Sort by score descending
  const sorted = mapped.sort((a, b) => b.score - a.score);

  // We want to take top 250 players
  const topPlayers = sorted.slice(0, 250);

  // Let's write them to a typescript file
  const tsContent = `// Curated famous players list (generated from DB)
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

export const PLAYERS: PlayerSeed[] = ${JSON.stringify(topPlayers, null, 2)};
`;

  writeFileSync('src/scripts/curatedPlayers.ts', tsContent);
  console.log('Successfully wrote', topPlayers.length, 'players to src/scripts/curatedPlayers.ts');
}

main().catch(console.error).finally(() => prisma.$disconnect());

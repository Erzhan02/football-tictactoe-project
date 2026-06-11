import { readFileSync } from 'fs';
import path from 'path';

const seedPath = '/Users/erzhan/Desktop/football-tictactoe-project/server/prisma/seed.ts';
const content = readFileSync(seedPath, 'utf-8');

// Use regex or count to see how many elements are in PLAYERS
const matches = content.match(/id:\s*'[^']+'/g);
console.log('Number of player entries (id):', matches ? matches.length : 0);
if (matches) {
  console.log('Some matches:', matches.slice(0, 10));
}

import { readFileSync, writeFileSync } from 'fs';

const seedPath = 'prisma/seed.ts';
let seedContent = readFileSync(seedPath, 'utf-8');

// We want to replace the part:
// // ─────────────────────────────────────────────
// // Player data
// // ─────────────────────────────────────────────
// interface PlayerSeed { ... }
// const PLAYERS: PlayerSeed[] = [ ... ];
//
// with:
// import { PLAYERS } from './curatedPlayers.js';

// Let's find the start and end of this block
const startText = '// ─────────────────────────────────────────────\n// Player data\n// ─────────────────────────────────────────────';
const startIndex = seedContent.indexOf(startText);

if (startIndex === -1) {
  console.error('Could not find start of Player data block');
  process.exit(1);
}

// The end of the block is right before "// Seed function"
const endText = '// Seed function';
const endIndex = seedContent.indexOf(endText);

if (endIndex === -1) {
  console.error('Could not find Seed function block');
  process.exit(1);
}

// Slice out the players block and insert the import statement
const newContent = 
  seedContent.substring(0, startIndex) +
  "import { PLAYERS } from './curatedPlayers.js';\n\n// ─────────────────────────────────────────────\n" +
  seedContent.substring(endIndex);

writeFileSync(seedPath, newContent);
console.log('Successfully updated prisma/seed.ts programmatically!');

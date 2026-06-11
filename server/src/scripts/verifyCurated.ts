import { PLAYERS } from './curatedPlayers.js';

console.log('Total players in curated list:', PLAYERS.length);
console.log('Player Names:');
const names = PLAYERS.map(p => p.name).sort();
for (let i = 0; i < names.length; i += 4) {
  console.log(names.slice(i, i + 4).join('  |  '));
}

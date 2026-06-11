import { readFileSync, writeFileSync } from 'fs';

const filePath = 'prisma/curatedPlayers.ts';
let fileContent = readFileSync(filePath, 'utf-8');

const additionalPlayers = [
  {
    id: 'yashin',
    name: 'Lev Yashin',
    aliases: ['яшин', 'лев яшин', 'lev yashin', 'yashin', 'the black spider'],
    nationality: 'Russia',
    position: 'Goalkeeper',
    clubs: [],
    leagues: [],
    managers: [],
    tournaments: ['ballondor', 'euro', 'worldcup']
  },
  {
    id: 'golovin',
    name: 'Aleksandr Golovin',
    aliases: ['головин', 'александр головин', 'aleksandr golovin', 'golovin'],
    nationality: 'Russia',
    position: 'Midfielder',
    clubs: ['monaco'],
    leagues: ['ligue1'],
    managers: [],
    tournaments: ['worldcup']
  },
  {
    id: 'arshavin',
    name: 'Andrey Arshavin',
    aliases: ['аршавин', 'андрей аршавин', 'andrey arshavin', 'arshavin'],
    nationality: 'Russia',
    position: 'Forward',
    clubs: ['arsenal'],
    leagues: ['premier-league'],
    managers: ['wenger'],
    tournaments: []
  },
  {
    id: 'schmeichel',
    name: 'Peter Schmeichel',
    aliases: ['шмейхель', 'петер шмейхель', 'peter schmeichel', 'schmeichel'],
    nationality: 'Denmark',
    position: 'Goalkeeper',
    clubs: ['manchester-united'],
    leagues: ['premier-league'],
    managers: ['ferguson'],
    tournaments: ['ucl', 'euro', 'worldcup']
  },
  {
    id: 'eriksen',
    name: 'Christian Eriksen',
    aliases: ['эриксен', 'кристиан эриксен', 'christian eriksen', 'eriksen'],
    nationality: 'Denmark',
    position: 'Midfielder',
    clubs: ['manchester-united', 'tottenham', 'inter', 'ajax'],
    leagues: ['premier-league', 'serie-a', 'eredivisie'],
    managers: ['mourinho', 'conte'],
    tournaments: ['ucl', 'worldcup']
  },
  {
    id: 'christensen',
    name: 'Andreas Christensen',
    aliases: ['кристенсен', 'андреас кристенсен', 'andreas christensen', 'christensen'],
    nationality: 'Denmark',
    position: 'Defender',
    clubs: ['chelsea', 'barcelona', 'gladbach'],
    leagues: ['premier-league', 'laliga', 'bundesliga'],
    managers: ['conte', 'tuchel'],
    tournaments: ['ucl', 'worldcup']
  },
  {
    id: 'larsson',
    name: 'Henrik Larsson',
    aliases: ['ларссон', 'хенрик ларссон', 'henrik larsson', 'larsson'],
    nationality: 'Sweden',
    position: 'Forward',
    clubs: ['barcelona', 'manchester-united'],
    leagues: ['laliga', 'premier-league'],
    managers: ['ferguson'],
    tournaments: ['ucl', 'worldcup']
  },
  {
    id: 'isak',
    name: 'Alexander Isak',
    aliases: ['исак', 'александр исак', 'alexander isak', 'isak'],
    nationality: 'Sweden',
    position: 'Forward',
    clubs: ['dortmund', 'newcastle'],
    leagues: ['bundesliga', 'premier-league'],
    managers: ['tuchel'],
    tournaments: []
  },
  {
    id: 'calhanoglu',
    name: 'Hakan Calhanoglu',
    aliases: ['чалханоглу', 'хакан чалханоглу', 'hakan calhanoglu', 'calhanoglu'],
    nationality: 'Turkey',
    position: 'Midfielder',
    clubs: ['inter', 'ac-milan'],
    leagues: ['serie-a', 'bundesliga'],
    managers: [],
    tournaments: []
  },
  {
    id: 'turan',
    name: 'Arda Turan',
    aliases: ['туран', 'арда туран', 'arda turan', 'turan'],
    nationality: 'Turkey',
    position: 'Midfielder',
    clubs: ['barcelona', 'atletico'],
    leagues: ['laliga'],
    managers: ['simeone', 'luis-enrique'],
    tournaments: ['ucl', 'uel']
  },
  {
    id: 'zinchenko',
    name: 'Oleksandr Zinchenko',
    aliases: ['зинченко', 'александр зинченко', 'oleksandr zinchenko', 'zinchenko'],
    nationality: 'Ukraine',
    position: 'Defender',
    clubs: ['manchester-city', 'arsenal', 'psv'],
    leagues: ['premier-league', 'eredivisie'],
    managers: ['pep'],
    tournaments: []
  },
  {
    id: 'yayatoure',
    name: 'Yaya Toure',
    aliases: ['яя туре', 'туре', 'yaya toure', 'toure'],
    nationality: 'Ivory Coast',
    position: 'Midfielder',
    clubs: ['barcelona', 'manchester-city', 'monaco'],
    leagues: ['laliga', 'premier-league', 'ligue1'],
    managers: ['pep'],
    tournaments: ['ucl', 'afcon']
  },
  {
    id: 'odegaard',
    name: 'Martin Odegaard',
    aliases: ['эдегор', 'мартин эдегор', 'martin odegaard', 'odegaard'],
    nationality: 'Norway',
    position: 'Midfielder',
    clubs: ['real-madrid', 'arsenal'],
    leagues: ['laliga', 'premier-league'],
    managers: ['ancelotti'],
    tournaments: []
  },
  {
    id: 'giggs',
    name: 'Ryan Giggs',
    aliases: ['гиггз', 'райан гиггз', 'ryan giggs', 'giggs'],
    nationality: 'Wales',
    position: 'Midfielder',
    clubs: ['manchester-united'],
    leagues: ['premier-league'],
    managers: ['ferguson', 'mourinho'],
    tournaments: ['ucl']
  }
];

// Let's parse the PLAYERS array from fileContent and inject these
// To keep it simple, we can do it by replacing "export const PLAYERS: PlayerSeed[] = ["
// with "export const PLAYERS: PlayerSeed[] = " and appending the JSON at the end,
// or we can read the file, locate the end of the array, and programmatically insert the new items.
const insertPos = fileContent.indexOf('export const PLAYERS: PlayerSeed[] = [') + 'export const PLAYERS: PlayerSeed[] = ['.length;

if (insertPos === -1) {
  console.error('Could not find PLAYERS declaration in curatedPlayers.ts');
  process.exit(1);
}

const formattedPlayers = additionalPlayers.map(p => JSON.stringify(p, null, 2)).join(',\n') + ',\n';

const newContent = fileContent.substring(0, insertPos) + '\n' + formattedPlayers + fileContent.substring(insertPos);

writeFileSync(filePath, newContent);
console.log('Successfully enriched curatedPlayers.ts with', additionalPlayers.length, 'players.');

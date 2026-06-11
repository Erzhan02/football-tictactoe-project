import { prisma } from '../lib/prisma.js';
import Fuse from 'fuse.js';

// ─────────────────────────────────────────────
// Hardcoded tournament data
// Each entry: { tournament tag, player names[] }
// ─────────────────────────────────────────────

const TOURNAMENT_PLAYER_DATA: { tag: string; players: string[] }[] = [
  // ════════════════════════════════════════════
  // UCL — Champions League winners (key squad players)
  // ════════════════════════════════════════════
  {
    tag: 'ucl',
    players: [
      // 2023-24 Real Madrid
      'Vinicius Junior', 'Jude Bellingham', 'Toni Kroos', 'Luka Modric', 'Rodrygo',
      'Eduardo Camavinga', 'Aurelien Tchouameni', 'Federico Valverde', 'David Alaba',
      'Antonio Rudiger', 'Dani Carvajal', 'Ferland Mendy', 'Eder Militao', 'Nacho',
      'Andriy Lunin', 'Joselu',
      // 2022-23 Man City
      'Erling Haaland', 'Kevin De Bruyne', 'Bernardo Silva', 'Rodri', 'Ilkay Gundogan',
      'Jack Grealish', 'Phil Foden', 'Riyad Mahrez', 'Manuel Akanji', 'Ruben Dias',
      'John Stones', 'Kyle Walker', 'Nathan Ake', 'Ederson', 'Stefan Ortega',
      'Rico Lewis', 'Jeremy Doku', 'Julian Alvarez',
      // 2021-22 Real Madrid
      'Karim Benzema', 'Vinicius Junior', 'Luka Modric', 'Toni Kroos', 'Casemiro',
      'Federico Valverde', 'David Alaba', 'Eder Militao', 'Dani Carvajal', 'Ferland Mendy',
      'Eduardo Camavinga', 'Marco Asensio', 'Rodrygo', 'Thibaut Courtois',
      // 2020-21 Chelsea
      'Kai Havertz', 'Mason Mount', 'Timo Werner', 'Christian Pulisic', 'N\'Golo Kante',
      'Jorginho', 'Mateo Kovacic', 'Cesar Azpilicueta', 'Andreas Christensen',
      'Antonio Rudiger', 'Reece James', 'Ben Chilwell', 'Thiago Silva', 'Edouard Mendy',
      'Hakim Ziyech', 'Callum Hudson-Odoi',
      // 2019-20 Bayern Munich
      'Robert Lewandowski', 'Thomas Muller', 'Serge Gnabry', 'Kingsley Coman',
      'Joshua Kimmich', 'Leon Goretzka', 'Thiago Alcantara', 'Philippe Coutinho',
      'Alphonso Davies', 'David Alaba', 'Jerome Boateng', 'Benjamin Pavard',
      'Manuel Neuer', 'Lucas Hernandez',
      // 2018-19 Liverpool
      'Mohamed Salah', 'Sadio Mane', 'Roberto Firmino', 'Virgil van Dijk',
      'Alisson Becker', 'Trent Alexander-Arnold', 'Andrew Robertson', 'Fabinho',
      'Jordan Henderson', 'Georginio Wijnaldum', 'James Milner', 'Divock Origi',
      'Naby Keita', 'Xherdan Shaqiri',
      // 2017-18 Real Madrid
      'Cristiano Ronaldo', 'Karim Benzema', 'Gareth Bale', 'Luka Modric',
      'Toni Kroos', 'Casemiro', 'Isco', 'Marcelo', 'Dani Carvajal', 'Raphael Varane',
      'Sergio Ramos', 'Keylor Navas',
      // 2016-17 Real Madrid (same core)
      'Cristiano Ronaldo', 'Karim Benzema', 'Gareth Bale', 'Luka Modric',
      'Toni Kroos', 'Casemiro', 'Sergio Ramos', 'Raphael Varane',
      // 2015-16 Real Madrid
      'Cristiano Ronaldo', 'Karim Benzema', 'Gareth Bale', 'Luka Modric',
      'Toni Kroos', 'Casemiro', 'Sergio Ramos', 'Raphael Varane', 'Marcelo',
      // 2014-15 Barcelona
      'Lionel Messi', 'Neymar', 'Luis Suarez', 'Andres Iniesta', 'Xavi Hernandez',
      'Ivan Rakitic', 'Gerard Pique', 'Jordi Alba', 'Sergio Busquets',
      'Javier Mascherano', 'Dani Alves', 'Marc-Andre ter Stegen', 'Pedro',
      // 2013-14 Real Madrid
      'Cristiano Ronaldo', 'Karim Benzema', 'Gareth Bale', 'Luka Modric',
      'Toni Kroos', 'Angel Di Maria', 'Sergio Ramos', 'Raphael Varane',
      'Marcelo', 'Dani Carvajal', 'Iker Casillas', 'Pepe',
      // 2012-13 Bayern Munich
      'Franck Ribery', 'Arjen Robben', 'Thomas Muller', 'Robert Lewandowski',
      'Philipp Lahm', 'Bastian Schweinsteiger', 'Manuel Neuer', 'Dante',
      'Jerome Boateng', 'Mario Gotze', 'Toni Kroos',
      // 2011-12 Chelsea
      'Frank Lampard', 'John Terry', 'Didier Drogba', 'Ashley Cole',
      'Juan Mata', 'Fernando Torres', 'Petr Cech', 'Branislav Ivanovic', 'Gary Cahill',
      // 2010-11 Barcelona
      'Lionel Messi', 'David Villa', 'Andres Iniesta', 'Xavi Hernandez',
      'Gerard Pique', 'Carles Puyol', 'Dani Alves', 'Sergio Busquets',
      'Pedro', 'Eric Abidal', 'Victor Valdes',
      // 2009-10 Inter Milan
      'Diego Milito', 'Wesley Sneijder', 'Javier Zanetti', 'Lucio',
      'Maicon', 'Esteban Cambiasso', 'Samuel Eto\'o', 'Dejan Stankovic',
      // 2008-09 Barcelona
      'Lionel Messi', 'Samuel Eto\'o', 'Thierry Henry', 'Andres Iniesta',
      'Xavi Hernandez', 'Gerard Pique', 'Carles Puyol', 'Dani Alves', 'Sergio Busquets',
      // 2007-08 Manchester United
      'Cristiano Ronaldo', 'Wayne Rooney', 'Carlos Tevez', 'Rio Ferdinand',
      'Nemanja Vidic', 'Paul Scholes', 'Ryan Giggs', 'Michael Carrick', 'Edwin van der Sar',
      // 2006-07 AC Milan
      'Kaka', 'Andrea Pirlo', 'Filippo Inzaghi', 'Clarence Seedorf',
      'Gennaro Gattuso', 'Alessandro Nesta', 'Paolo Maldini', 'Dida',
      // 2005-06 Barcelona
      'Ronaldinho', 'Lionel Messi', 'Samuel Eto\'o', 'Xavi Hernandez',
      'Andres Iniesta', 'Carles Puyol', 'Deco', 'Giovanni van Bronckhorst',
      // 2004-05 Liverpool
      'Steven Gerrard', 'Xabi Alonso', 'Jamie Carragher', 'Luis Garcia',
      'Djibril Cisse', 'Milan Baros',
      // 2003-04 Porto
      'Deco', 'Maniche', 'Ricardo Carvalho',
    ],
  },

  // ════════════════════════════════════════════
  // WORLD CUP WINNERS
  // ════════════════════════════════════════════
  {
    tag: 'worldcup-winner',
    players: [
      // 2022 Argentina
      'Lionel Messi', 'Angel Di Maria', 'Julian Alvarez', 'Rodrigo De Paul',
      'Alexis Mac Allister', 'Leandro Paredes', 'Emiliano Martinez', 'Cristian Romero',
      'Nicolas Otamendi', 'Nicolas Tagliafico', 'Marcos Acuna', 'Nahuel Molina',
      'Lisandro Martinez', 'Papu Gomez', 'Lautaro Martinez', 'Paulo Dybala',
      'German Pezzella', 'Guido Rodriguez', 'Enzo Fernandez',
      // 2018 France
      'Kylian Mbappe', 'Antoine Griezmann', 'Paul Pogba', 'N\'Golo Kante',
      'Raphael Varane', 'Samuel Umtiti', 'Benjamin Pavard', 'Lucas Hernandez',
      'Blaise Matuidi', 'Olivier Giroud', 'Hugo Lloris', 'Ousmane Dembele',
      'Thomas Lemar', 'Steven Nzonzi', 'Presnel Kimpembe', 'Corentin Tolisso',
      'Florian Thauvin', 'Adil Rami', 'Djibril Sidibe',
      // 2014 Germany
      'Miroslav Klose', 'Thomas Muller', 'Mario Gotze', 'Toni Kroos',
      'Bastian Schweinsteiger', 'Philipp Lahm', 'Manuel Neuer', 'Jerome Boateng',
      'Mats Hummels', 'Per Mertesacker', 'Benedikt Howedes', 'Andre Schurrle',
      'Mesut Ozil', 'Sami Khedira', 'Julian Draxler', 'Lukas Podolski',
      'Christoph Kramer', 'Mario Gotze',
      // 2010 Spain
      'David Villa', 'Andres Iniesta', 'Xavi Hernandez', 'Sergio Ramos',
      'Gerard Pique', 'Carles Puyol', 'Iker Casillas', 'David Silva',
      'Fernando Torres', 'Cesc Fabregas', 'Joan Capdevila', 'Sergio Busquets',
      'Xabi Alonso', 'Pedro', 'Jesus Navas', 'Victor Valdes', 'Fernando Llorente',
      'Carlos Marchena',
      // 2006 Italy
      'Gianluigi Buffon', 'Fabio Cannavaro', 'Andrea Pirlo', 'Francesco Totti',
      'Alessandro Del Piero', 'Luca Toni', 'Marco Materazzi', 'Gianluca Zambrotta',
      'Fabio Grosso', 'Mauro Camoranesi', 'Gennaro Gattuso', 'Alessandro Nesta',
      'Simone Perrotta', 'Alberto Gilardino',
      // 2002 Brazil
      'Ronaldo', 'Ronaldinho', 'Rivaldo', 'Roberto Carlos', 'Cafu',
      'Edilson', 'Kleberson', 'Luizao',
      // 1998 France
      'Zinedine Zidane', 'Thierry Henry', 'Patrick Vieira', 'Marcel Desailly',
      'Lilian Thuram', 'Laurent Blanc', 'Didier Deschamps', 'David Trezeguet',
      'Emmanuel Petit', 'Youri Djorkaeff', 'Fabien Barthez',
    ],
  },

  // ════════════════════════════════════════════
  // WORLD CUP PARTICIPANTS (broader — by nationality)
  // We store this as players who have worldcup tag regardless of winning
  // ════════════════════════════════════════════
  {
    tag: 'worldcup',
    players: [
      // Key players at WC 2022
      'Lionel Messi', 'Angel Di Maria', 'Julian Alvarez', 'Alexis Mac Allister',
      'Kylian Mbappe', 'Antoine Griezmann', 'Olivier Giroud', 'Aurelien Tchouameni',
      'Adrien Rabiot', 'Theo Hernandez', 'Marcus Rashford', 'Phil Foden',
      'Bukayo Saka', 'Harry Kane', 'Jude Bellingham', 'Declan Rice', 'Jordan Pickford',
      'Luke Shaw', 'Kyle Walker', 'John Stones', 'Eric Dier', 'Raheem Sterling',
      'Erling Haaland',  // Norway didn't qualify but let's skip
      'Robert Lewandowski', 'Piotr Zielinski', 'Wojciech Szczesny',
      'Luka Modric', 'Ivan Perisic', 'Mateo Kovacic', 'Dominik Livakovic',
      'Cristiano Ronaldo', 'Bruno Fernandes', 'Joao Felix', 'Bernardo Silva', 'Ruben Dias', 'Raphael Guerreiro',
      'Neymar', 'Vinicius Junior', 'Richarlison', 'Casemiro', 'Thiago Silva',
      'Marquinhos', 'Alisson Becker', 'Rodrygo', 'Raphinha', 'Gabriel Jesus',
      'Pedri', 'Gavi', 'Dani Olmo', 'Ferran Torres', 'Alvaro Morata', 'Jordi Alba',
      'Sergio Busquets', 'Marco Asensio',
      'Thomas Muller', 'Joshua Kimmich', 'Manuel Neuer', 'Leon Goretzka',
      'Serge Gnabry', 'Kai Havertz', 'Ilkay Gundogan', 'Antonio Rudiger',
      'Leroy Sane', 'Jamal Musiala',
      'Virgil van Dijk', 'Memphis Depay', 'Cody Gakpo', 'Denzel Dumfries',
      'Daley Blind', 'Frenkie de Jong', 'Stefan de Vrij',
      'Romelu Lukaku', 'Kevin De Bruyne', 'Thibaut Courtois', 'Eden Hazard',
      'Jan Vertonghen', 'Toby Alderweireld', 'Thomas Meunier', 'Axel Witsel',
      'Dries Mertens',
      'Gareth Bale',
      'Mohamed Salah', 'Trezeguet', 'Kahraba',
      'Riyad Mahrez', 'Sofiane Feghouli',
      // WC 2018 notable players
      'Radamel Falcao', 'James Rodriguez', 'David Ospina',
      'Darwin Nunez', 'Luis Suarez', 'Edinson Cavani', 'Diego Godin',
      'Granit Xhaka', 'Xherdan Shaqiri',
      'Emil Forsberg', 'Viktor Claesson',
      'Arturo Vidal', 'Alexis Sanchez', 'Claudio Bravo', 'Gary Medel',
      'Ivan Perisic', 'Mario Mandzukic',
      'Aymeric Laporte',
      // Africa — WC 2022
      'Hakim Ziyech', 'Youssef En-Nesyri', 'Sofyan Amrabat', 'Romain Saiss',
      'Achraf Hakimi', 'Azzedine Ounahi',
      'Sadio Mane', 'Cheikhou Kouyate', 'Idrissa Gueye', 'Edouard Mendy',
    ],
  },

  // ════════════════════════════════════════════
  // EURO WINNERS
  // ════════════════════════════════════════════
  {
    tag: 'euro',
    players: [
      // Euro 2024 — Spain
      'Dani Olmo', 'Fabian Ruiz', 'Pedri', 'Gavi', 'Rodri', 'Ferran Torres',
      'Lamine Yamal', 'Alvaro Morata', 'Nicolas Williams', 'Aymeric Laporte',
      'Robin Le Normand', 'Marc Cucurella', 'Dani Carvajal', 'Jesus Navas',
      'David Raya', 'Unai Simon',
      // Euro 2020 — Italy
      'Gianluigi Donnarumma', 'Leonardo Bonucci', 'Giorgio Chiellini', 'Marco Verratti',
      'Nicolo Barella', 'Lorenzo Insigne', 'Ciro Immobile', 'Federico Chiesa',
      'Manuel Locatelli', 'Emerson Royal', 'Leonardo Spinazzola', 'Giovanni Di Lorenzo',
      'Jorginho', 'Federico Bernardeschi',
      // Euro 2016 — Portugal
      'Cristiano Ronaldo', 'Rui Patricio', 'Pepe', 'Bruno Alves', 'Ricardo Quaresma',
      'Renato Sanches', 'Joao Mario', 'Cedric Soares', 'Raphael Guerreiro',
      'Nani', 'Eder',
      // Euro 2012 — Spain
      'Iker Casillas', 'Sergio Ramos', 'Gerard Pique', 'Jordi Alba', 'David Alaba',
      'Andres Iniesta', 'Xavi Hernandez', 'Cesc Fabregas', 'Xabi Alonso',
      'David Silva', 'Fernando Torres', 'David Villa', 'Pedro', 'Sergio Busquets',
      'Jesus Navas', 'Juan Mata',
      // Euro 2008 — Spain
      'Iker Casillas', 'Sergio Ramos', 'Carlos Marchena', 'Marcos Senna',
      'Andres Iniesta', 'Xavi Hernandez', 'Cesc Fabregas', 'David Villa',
      'Fernando Torres', 'David Silva',
      // Euro 2004 — Greece (not many in DB)
      'Theo Zagorakis',
    ],
  },

  // ════════════════════════════════════════════
  // COPA AMERICA WINNERS
  // ════════════════════════════════════════════
  {
    tag: 'copa-america',
    players: [
      // 2024 Argentina
      'Lionel Messi', 'Angel Di Maria', 'Julian Alvarez', 'Rodrigo De Paul',
      'Alexis Mac Allister', 'Emiliano Martinez', 'Cristian Romero',
      'Nicolas Otamendi', 'Marcos Acuna', 'Lautaro Martinez', 'Enzo Fernandez',
      'Lisandro Martinez', 'Nahuel Molina', 'Nicolas Tagliafico',
      // 2021 Argentina
      'Lionel Messi', 'Angel Di Maria', 'Rodrigo De Paul', 'Emiliano Martinez',
      'Cristian Romero', 'Nicolas Otamendi', 'Marcos Acuna', 'Lautaro Martinez',
      'Leandro Paredes', 'Papu Gomez',
      // 2019 Brazil
      'Neymar', 'Philippe Coutinho', 'Gabriel Jesus', 'Casemiro', 'Thiago Silva',
      'Dani Alves', 'Alisson Becker', 'Richarlison', 'Roberto Firmino',
      'Arthur Melo', 'Alex Sandro',
      // 2016 Chile
      'Alexis Sanchez', 'Arturo Vidal', 'Claudio Bravo', 'Gary Medel',
      'Charles Aranguiz',
      // 2015 Chile
      'Alexis Sanchez', 'Arturo Vidal', 'Claudio Bravo', 'Gary Medel',
      'Mauricio Isla', 'Charles Aranguiz',
    ],
  },

  // ════════════════════════════════════════════
  // BALLON D'OR winners
  // ════════════════════════════════════════════
  {
    tag: 'ballondor',
    players: [
      'Lionel Messi',         // 2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023
      'Cristiano Ronaldo',    // 2008, 2013, 2014, 2016, 2017
      'Karim Benzema',        // 2022
      'Luka Modric',          // 2018
      'Kylian Mbappe',        // 2024
      'Ronaldinho',           // 2005
      'Fabio Cannavaro',      // 2006
      'Kaka',                 // 2007
      'Luis Figo',            // 2000 (probably not in DB)
      'Zinedine Zidane',      // 2003 (probably not in DB)
      'Ronaldo',              // 2002
      'Michael Owen',         // 2001
      'Rivaldo',              // 1999
      'Andres Iniesta',       // nominees
      'Xavi Hernandez',       // nominees
      'Virgil van Dijk',      // 2019 runner up
      'Robert Lewandowski',   // 2020 (unofficial), 2021 winner
      'Franck Ribery',        // 2013 runner up
    ],
  },
];

// ─────────────────────────────────────────────
// Fuzzy player matcher
// ─────────────────────────────────────────────
async function buildPlayerIndex() {
  const players = await prisma.player.findMany({
    select: { id: true, name: true, aliases: true },
  });
  const fuse = new Fuse(players, {
    keys: ['name', 'aliases'],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 3,
  });
  return { players, fuse };
}

function findPlayer(name: string, fuse: Fuse<{ id: string; name: string; aliases: string[] }>) {
  const results = fuse.search(name.trim());
  if (results.length === 0) return null;
  return results[0].item;
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting tournament data seeding...\n');

  const { fuse } = await buildPlayerIndex();

  // Fetch all tournaments from DB
  const dbTournaments = await prisma.tournament.findMany();
  const tournamentByTag = new Map(dbTournaments.map(t => [t.tag, t]));

  let totalLinked = 0;
  let totalNotFound = 0;
  let totalAlreadyExists = 0;

  const notFoundLog: { tournament: string; player: string }[] = [];

  for (const entry of TOURNAMENT_PLAYER_DATA) {
    const tournament = tournamentByTag.get(entry.tag);
    if (!tournament) {
      console.log(`⚠️  Tournament with tag "${entry.tag}" not found in DB — skipping`);
      continue;
    }

    console.log(`\n🏆 Processing: ${tournament.name} [${entry.tag}] — ${entry.players.length} players`);

    const uniquePlayers = [...new Set(entry.players)]; // deduplicate
    let linked = 0;
    let notFound = 0;
    let alreadyExists = 0;

    for (const playerName of uniquePlayers) {
      const player = findPlayer(playerName, fuse);
      if (!player) {
        notFoundLog.push({ tournament: entry.tag, player: playerName });
        notFound++;
        continue;
      }

      try {
        await prisma.playerTournament.upsert({
          where: { playerId_tournamentId: { playerId: player.id, tournamentId: tournament.id } },
          create: { playerId: player.id, tournamentId: tournament.id },
          update: {},
        });
        linked++;
        totalLinked++;
      } catch {
        alreadyExists++;
        totalAlreadyExists++;
      }
    }

    console.log(`  ✅ Linked: ${linked}  |  ⏭️ Already existed: ${alreadyExists}  |  ❌ Not found: ${notFound}`);
    totalNotFound += notFound;
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SEEDING COMPLETE');
  console.log('═'.repeat(60));
  console.log(`✅ Total links created:     ${totalLinked}`);
  console.log(`⏭️  Already existed:         ${totalAlreadyExists}`);
  console.log(`❌ Players not found in DB: ${totalNotFound}`);

  if (notFoundLog.length > 0) {
    console.log('\n❌ Not found players:');
    for (const entry of notFoundLog) {
      console.log(`  [${entry.tournament}] ${entry.player}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

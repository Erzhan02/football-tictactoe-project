import { validatePlayerAnswer } from '../services/validation.js';
import { prisma } from '../lib/prisma.js';

async function verify(playerName: string, rowTag: string, colTag: string) {
  console.log(`Verifying: "${playerName}" for Row: "${rowTag}" & Col: "${colTag}"`);
  const result = await validatePlayerAnswer({
    playerName,
    rowTag,
    colTag,
    usedPlayerIds: [],
  });
  console.log(`  Valid: ${result.valid}`);
  console.log(`  Player ID: ${result.player?.id}, Name: ${result.player?.name}`);
  console.log(`  Error message: ${result.errorMessage}`);
  console.log('---');
}

async function run() {
  console.log('=== VERIFYING ANSWERS ===\n');

  // Scenario 1: Ederson (Pep & UCL)
  await verify('Ederson Santana de Moraes', 'pep', 'ucl');
  await verify('Ederson', 'pep', 'ucl');

  // Scenario 2: Robert Lewandowski (Pep & Bundesliga)
  await verify('Robert Lewandowski', 'pep', 'bundesliga');

  // Scenario 3: Alexis Mac Allister (World Cup & Premier League)
  await verify('Alexis Mac Allister', 'worldcup-winner', 'premier-league');

  // Scenario 4: Thierry Henry (Wenger & Serie A)
  await verify('Thierry Henry', 'wenger', 'serie-a');

  // Scenario 5: Cesc Fàbregas (Wenger & Euro)
  await verify('Cesc Fabregas', 'wenger', 'euro');

  // Scenario 6: Roberto Baggio (Capello & Ballon d'Or)
  await verify('Roberto Baggio', 'capello', 'ballondor');

  // Scenario 7: Diego Maradona (Napoli/Serie A & World Cup Winner)
  await verify('Diego Maradona', 'napoli', 'worldcup-winner');

  // Scenario 8: David Beckham (LA Galaxy/MLS & UCL)
  await verify('David Beckham', 'lagalaxy', 'ucl');

  // Scenario 9: Lev Yashin (Euro & Ballon d'Or)
  await verify('Lev Yashin', 'euro', 'ballondor');

  // Scenario 10: Zico (Udinese/Serie A & World Cup)
  await verify('Zico', 'udinese', 'worldcup');

  // Scenario 11: Alfredo Di Stéfano (Ballon d'Or & UCL)
  await verify('Alfredo Di Stefano', 'ballondor', 'ucl');

  // Scenario 12: Romário (PSV/Eredivisie & World Cup Winner)
  await verify('Romario', 'psv', 'worldcup-winner');

  // Scenario 13: Eden Hazard (Ligue 1 & UEFA Europa League)
  await verify('Eden Hazard', 'uel', 'ligue1');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

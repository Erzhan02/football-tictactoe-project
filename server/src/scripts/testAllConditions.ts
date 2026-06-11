import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────
// All conditions from the frontend catalog
// ─────────────────────────────────────────────
const CONDITIONS = [
  // Competitions (tournaments)
  { id: 'ucl',           label: 'Лига Чемпионов',        type: 'tournament' },
  { id: 'uel',           label: 'Лига Европы',            type: 'tournament' },
  { id: 'worldcup-winner', label: 'Чемпион мира',         type: 'tournament' },
  { id: 'euro',         label: 'Чемпион Европы',          type: 'tournament' },
  { id: 'copa-america', label: 'Чемпион Южной Америки',   type: 'tournament' },
  { id: 'afcon',        label: 'Кубок Африки',            type: 'tournament' },
  { id: 'ballondor',    label: 'Золотой мяч',             type: 'tournament' },
  // Leagues
  { id: 'premier-league', label: 'АПЛ',                   type: 'league' },
  { id: 'laliga',       label: 'Ла Лига',                 type: 'league' },
  { id: 'serie-a',      label: 'Серия А',                 type: 'league' },
  { id: 'bundesliga',   label: 'Бундеслига',              type: 'league' },
  { id: 'ligue1',       label: 'Лига 1',                  type: 'league' },
  { id: 'mls',          label: 'MLS',                     type: 'league' },
  { id: 'saudi-league', label: 'Саудовская Про-лига',     type: 'league' },
  // Clubs
  { id: 'barcelona',       label: 'Барселона',            type: 'club' },
  { id: 'real-madrid',     label: 'Реал Мадрид',          type: 'club' },
  { id: 'manchester-city', label: 'Манчестер Сити',       type: 'club' },
  { id: 'manchester-united', label: 'Манчестер Юнайтед', type: 'club' },
  { id: 'liverpool',       label: 'Ливерпуль',            type: 'club' },
  { id: 'chelsea',         label: 'Челси',                type: 'club' },
  { id: 'arsenal',         label: 'Арсенал',              type: 'club' },
  { id: 'psg',             label: 'ПСЖ',                  type: 'club' },
  { id: 'bavaria',         label: 'Бавария',              type: 'club' },
  { id: 'dortmund',        label: 'Боруссия Дортмунд',   type: 'club' },
  { id: 'juventus',        label: 'Ювентус',              type: 'club' },
  { id: 'ac-milan',        label: 'Милан',                type: 'club' },
  { id: 'inter',           label: 'Интер',                type: 'club' },
  { id: 'atletico',        label: 'Атлетико Мадрид',      type: 'club' },
  // Managers
  { id: 'pep',      label: 'Пеп Гвардиола',               type: 'manager' },
  { id: 'mourinho', label: 'Моуриньо',                    type: 'manager' },
  // Nationalities
  { id: 'spain',       label: 'Испания',       type: 'nationality', value: 'Spain' },
  { id: 'germany',     label: 'Германия',      type: 'nationality', value: 'Germany' },
  { id: 'france',      label: 'Франция',       type: 'nationality', value: 'France' },
  { id: 'brazil',      label: 'Бразилия',      type: 'nationality', value: 'Brazil' },
  { id: 'argentina',   label: 'Аргентина',     type: 'nationality', value: 'Argentina' },
  { id: 'england',     label: 'Англия',        type: 'nationality', value: 'England' },
  { id: 'portugal',    label: 'Португалия',    type: 'nationality', value: 'Portugal' },
  { id: 'italy',       label: 'Италия',        type: 'nationality', value: 'Italy' },
  { id: 'netherlands', label: 'Нидерланды',   type: 'nationality', value: 'Netherlands' },
  { id: 'belgium',     label: 'Бельгия',       type: 'nationality', value: 'Belgium' },
  { id: 'russia',      label: 'Россия',        type: 'nationality', value: 'Russia' },
  { id: 'uruguay',     label: 'Уругвай',       type: 'nationality', value: 'Uruguay' },
  { id: 'croatia',     label: 'Хорватия',      type: 'nationality', value: 'Croatia' },
  { id: 'colombia',    label: 'Колумбия',      type: 'nationality', value: 'Colombia' },
  { id: 'switzerland', label: 'Швейцария',     type: 'nationality', value: 'Switzerland' },
  { id: 'sweden',      label: 'Швеция',        type: 'nationality', value: 'Sweden' },
  { id: 'morocco',     label: 'Марокко',       type: 'nationality', value: 'Morocco' },
  { id: 'turkey',      label: 'Турция',        type: 'nationality', value: 'Turkey' },
  { id: 'denmark',     label: 'Дания',         type: 'nationality', value: 'Denmark' },
  { id: 'ukraine',     label: 'Украина',       type: 'nationality', value: 'Ukraine' },
  { id: 'ivory-coast', label: 'Кот-д\'Ивуар', type: 'nationality', value: 'Ivory Coast' },
  { id: 'egypt',       label: 'Египет',        type: 'nationality', value: 'Egypt' },
  { id: 'norway',      label: 'Норвегия',      type: 'nationality', value: 'Norway' },
  { id: 'chile',       label: 'Чили',          type: 'nationality', value: 'Chile' },
  { id: 'wales',       label: 'Уэльс',         type: 'nationality', value: 'Wales' },
] as const;

// ─────────────────────────────────────────────
// Get player IDs matching a condition
// ─────────────────────────────────────────────
async function getPlayersForCondition(cond: typeof CONDITIONS[number]): Promise<Set<string>> {
  if (cond.type === 'nationality') {
    const players = await prisma.player.findMany({
      where: { nationality: { equals: (cond as any).value, mode: 'insensitive' } },
      select: { id: true },
    });
    return new Set(players.map(p => p.id));
  }

  if (cond.type === 'club') {
    const club = await prisma.club.findUnique({ where: { tag: cond.id } });
    if (!club) return new Set();
    const links = await prisma.playerClub.findMany({
      where: { clubId: club.id },
      select: { playerId: true },
    });
    return new Set(links.map(l => l.playerId));
  }

  if (cond.type === 'league') {
    const league = await prisma.league.findUnique({ where: { tag: cond.id } });
    if (!league) return new Set();
    const links = await prisma.playerLeague.findMany({
      where: { leagueId: league.id },
      select: { playerId: true },
    });
    return new Set(links.map(l => l.playerId));
  }

  if (cond.type === 'tournament') {
    const tournament = await prisma.tournament.findUnique({ where: { tag: cond.id } });
    if (!tournament) return new Set();
    const links = await prisma.playerTournament.findMany({
      where: { tournamentId: tournament.id },
      select: { playerId: true },
    });
    return new Set(links.map(l => l.playerId));
  }

  if (cond.type === 'manager') {
    const manager = await prisma.manager.findUnique({ where: { tag: cond.id } });
    if (!manager) return new Set();
    const links = await prisma.playerManager.findMany({
      where: { managerId: manager.id },
      select: { playerId: true },
    });
    return new Set(links.map(l => l.playerId));
  }

  return new Set();
}

function intersection(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const id of a) {
    if (b.has(id)) count++;
  }
  return count;
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  console.log('🔍 Загружаю данные по всем условиям...\n');

  // Step 1: Check each condition individually
  const conditionSets = new Map<string, Set<string>>();
  const singleResults: { label: string; count: number; ok: boolean }[] = [];

  for (const cond of CONDITIONS) {
    const players = await getPlayersForCondition(cond);
    conditionSets.set(cond.id, players);
    singleResults.push({ label: `${cond.label} [${cond.id}]`, count: players.size, ok: players.size > 0 });
  }

  // Print single condition results
  console.log('━'.repeat(60));
  console.log('📋 ПРОВЕРКА КАЖДОГО УСЛОВИЯ ОТДЕЛЬНО');
  console.log('━'.repeat(60));

  const brokenConditions: string[] = [];
  for (const r of singleResults) {
    const icon = r.ok ? '✅' : '❌';
    const countStr = r.ok ? `${r.count} игроков` : 'НЕТ ИГРОКОВ';
    console.log(`${icon} ${r.label.padEnd(45)} ${countStr}`);
    if (!r.ok) brokenConditions.push(r.label);
  }

  // Step 2: Check all condition pairs
  console.log('\n' + '━'.repeat(60));
  console.log('🔀 ПРОВЕРКА ВСЕХ ПЕРЕСЕЧЕНИЙ (строка × колонка)');
  console.log('━'.repeat(60));

  const emptyPairs: string[] = [];
  const lowPairs: string[] = []; // < 3 players
  let totalPairs = 0;
  let okPairs = 0;

  for (let i = 0; i < CONDITIONS.length; i++) {
    for (let j = 0; j < CONDITIONS.length; j++) {
      if (i === j) continue; // same condition on both axes is invalid anyway

      const condA = CONDITIONS[i];
      const condB = CONDITIONS[j];
      const setA = conditionSets.get(condA.id)!;
      const setB = conditionSets.get(condB.id)!;
      const count = intersection(setA, setB);
      totalPairs++;

      if (count === 0) {
        emptyPairs.push(`❌ ${condA.label} × ${condB.label} — 0 игроков`);
      } else {
        okPairs++;
        if (count < 3) {
          lowPairs.push(`⚠️  ${condA.label} × ${condB.label} — только ${count} игрок(а)`);
        }
      }
    }
  }

  // Print empty pairs
  if (emptyPairs.length > 0) {
    console.log(`\n❌ НЕВОЗМОЖНЫЕ КОМБИНАЦИИ (${emptyPairs.length}):`);
    for (const p of emptyPairs) console.log('  ' + p);
  }

  // Print low pairs
  if (lowPairs.length > 0) {
    console.log(`\n⚠️  РИСКОВАННЫЕ КОМБИНАЦИИ (мало игроков) (${lowPairs.length}):`);
    for (const p of lowPairs) console.log('  ' + p);
  }

  // Step 3: Summary
  console.log('\n' + '━'.repeat(60));
  console.log('📊 ИТОГ');
  console.log('━'.repeat(60));
  console.log(`Всего условий:          ${CONDITIONS.length}`);
  console.log(`Нерабочих условий:      ${brokenConditions.length}`);
  console.log(`Всего пар:              ${totalPairs}`);
  console.log(`Рабочих пар:            ${okPairs} (${Math.round(okPairs/totalPairs*100)}%)`);
  console.log(`Невозможных пар:        ${emptyPairs.length}`);
  console.log(`Рискованных пар (<3):   ${lowPairs.length}`);

  if (brokenConditions.length === 0 && emptyPairs.length === 0) {
    console.log('\n🎉 Всё отлично! Все условия и комбинации работают.');
  } else {
    console.log('\n🚨 Есть проблемы, требующие внимания (см. выше).');
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

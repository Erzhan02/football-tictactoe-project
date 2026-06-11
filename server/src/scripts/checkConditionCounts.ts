import { prisma } from '../lib/prisma.js';

const CONDITIONS = [
  // Competitions (tournaments)
  { id: 'ucl',           label: 'Лига Чемпионов',        type: 'tournament' },
  { id: 'uel',           label: 'Лига Европы',            type: 'tournament' },
  { id: 'worldcup-winner', label: 'Чемпион мира',         type: 'tournament' },
  { id: 'worldcup',     label: 'Участник ЧМ',             type: 'tournament' },
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
];

async function getPlayersForCondition(cond: typeof CONDITIONS[number]): Promise<number> {
  if (cond.type === 'nationality') {
    return prisma.player.count({
      where: { nationality: { equals: (cond as any).value, mode: 'insensitive' } }
    });
  }

  if (cond.type === 'club') {
    const club = await prisma.club.findUnique({ where: { tag: cond.id } });
    if (!club) return 0;
    return prisma.playerClub.count({ where: { clubId: club.id } });
  }

  if (cond.type === 'league') {
    const league = await prisma.league.findUnique({ where: { tag: cond.id } });
    if (!league) return 0;
    return prisma.playerLeague.count({ where: { leagueId: league.id } });
  }

  if (cond.type === 'tournament') {
    const tournament = await prisma.tournament.findUnique({ where: { tag: cond.id } });
    if (!tournament) return 0;
    return prisma.playerTournament.count({ where: { tournamentId: tournament.id } });
  }

  if (cond.type === 'manager') {
    const manager = await prisma.manager.findUnique({ where: { tag: cond.id } });
    if (!manager) return 0;
    return prisma.playerManager.count({ where: { managerId: manager.id } });
  }

  return 0;
}

async function main() {
  console.log('=== Checking Player Counts for Each Condition ===');
  for (const cond of CONDITIONS) {
    const count = await getPlayersForCondition(cond);
    if (count === 0) {
      console.log(`❌ ${cond.label} (${cond.id}) has 0 players!`);
    } else {
      console.log(`✅ ${cond.label} (${cond.id}): ${count} players`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

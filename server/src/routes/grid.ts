import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────
// Safe conditions pool — only those with enough players
// ─────────────────────────────────────────────
const SAFE_CONDITIONS = [
  // Leagues
  { tag: 'premier-league', label: 'АПЛ',                   type: 'league' },
  { tag: 'laliga',         label: 'Ла Лига',               type: 'league' },
  { tag: 'serie-a',        label: 'Серия А',               type: 'league' },
  { tag: 'bundesliga',     label: 'Бундеслига',            type: 'league' },
  { tag: 'ligue1',         label: 'Лига 1',                type: 'league' },
  // Clubs
  { tag: 'barcelona',         label: 'Барселона',          type: 'club' },
  { tag: 'real-madrid',       label: 'Реал Мадрид',        type: 'club' },
  { tag: 'manchester-city',   label: 'Манчестер Сити',     type: 'club' },
  { tag: 'manchester-united', label: 'Манчестер Юнайтед',  type: 'club' },
  { tag: 'liverpool',         label: 'Ливерпуль',          type: 'club' },
  { tag: 'chelsea',           label: 'Челси',              type: 'club' },
  { tag: 'arsenal',           label: 'Арсенал',            type: 'club' },
  { tag: 'psg',               label: 'ПСЖ',                type: 'club' },
  { tag: 'bavaria',           label: 'Бавария',            type: 'club' },
  { tag: 'dortmund',          label: 'Боруссия Дортмунд',  type: 'club' },
  { tag: 'juventus',          label: 'Ювентус',            type: 'club' },
  { tag: 'inter',             label: 'Интер',              type: 'club' },
  { tag: 'atletico',          label: 'Атлетико Мадрид',    type: 'club' },
  // Managers
  { tag: 'pep',      label: 'Пеп Гвардиола',              type: 'manager' },
  { tag: 'mourinho', label: 'Моуриньо',                    type: 'manager' },
  // Tournaments
  { tag: 'ucl',             label: 'Лига Чемпионов',       type: 'tournament' },
  { tag: 'worldcup-winner', label: 'Чемпион мира',         type: 'tournament' },
  { tag: 'euro',            label: 'Чемпион Европы',       type: 'tournament' },
  { tag: 'copa-america',    label: 'Чемпион Южной Америки',type: 'tournament' },
  { tag: 'ballondor',       label: 'Золотой мяч',          type: 'tournament' },
  // Nationalities (only those with 20+ players)
  { tag: 'spain',       label: 'Испания (сборная)',        type: 'nationality' },
  { tag: 'germany',     label: 'Германия (сборная)',       type: 'nationality' },
  { tag: 'france',      label: 'Франция (сборная)',        type: 'nationality' },
  { tag: 'brazil',      label: 'Бразилия (сборная)',       type: 'nationality' },
  { tag: 'argentina',   label: 'Аргентина (сборная)',      type: 'nationality' },
  { tag: 'england',     label: 'Англия (сборная)',         type: 'nationality' },
  { tag: 'portugal',    label: 'Португалия (сборная)',     type: 'nationality' },
  { tag: 'italy',       label: 'Италия (сборная)',         type: 'nationality' },
  { tag: 'netherlands', label: 'Нидерланды (сборная)',     type: 'nationality' },
  { tag: 'belgium',     label: 'Бельгия (сборная)',        type: 'nationality' },
  { tag: 'croatia',     label: 'Хорватия (сборная)',       type: 'nationality' },
  { tag: 'uruguay',     label: 'Уругвай (сборная)',        type: 'nationality' },
] as const;

const NATIONALITY_VALUES: Record<string, string> = {
  spain: 'Spain', germany: 'Germany', france: 'France',
  brazil: 'Brazil', argentina: 'Argentina', england: 'England',
  portugal: 'Portugal', italy: 'Italy', netherlands: 'Netherlands',
  belgium: 'Belgium', croatia: 'Croatia', uruguay: 'Uruguay',
};

async function getPlayerSet(tag: string, type: string): Promise<Set<string>> {
  if (type === 'nationality') {
    const nat = NATIONALITY_VALUES[tag];
    if (!nat) return new Set();
    const players = await prisma.player.findMany({
      where: { nationality: { equals: nat, mode: 'insensitive' } },
      select: { id: true },
    });
    return new Set(players.map((p) => p.id));
  }
  if (type === 'club') {
    const club = await prisma.club.findUnique({ where: { tag } });
    if (!club) return new Set();
    const links = await prisma.playerClub.findMany({ where: { clubId: club.id }, select: { playerId: true } });
    return new Set(links.map((l) => l.playerId));
  }
  if (type === 'league') {
    const league = await prisma.league.findUnique({ where: { tag } });
    if (!league) return new Set();
    const links = await prisma.playerLeague.findMany({ where: { leagueId: league.id }, select: { playerId: true } });
    return new Set(links.map((l) => l.playerId));
  }
  if (type === 'tournament') {
    const tournament = await prisma.tournament.findUnique({ where: { tag } });
    if (!tournament) return new Set();
    const links = await prisma.playerTournament.findMany({ where: { tournamentId: tournament.id }, select: { playerId: true } });
    return new Set(links.map((l) => l.playerId));
  }
  if (type === 'manager') {
    const manager = await prisma.manager.findUnique({ where: { tag } });
    if (!manager) return new Set();
    const links = await prisma.playerManager.findMany({ where: { managerId: manager.id }, select: { playerId: true } });
    return new Set(links.map((l) => l.playerId));
  }
  return new Set();
}

function intersectionCount(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const id of a) { if (b.has(id)) count++; }
  return count;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Cache player sets in memory (refreshed every 10 minutes)
let cachedPlayerSets: Map<string, Set<string>> | null = null;
let cacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000;

async function getOrBuildCache() {
  const now = Date.now();
  if (cachedPlayerSets && now - cacheTime < CACHE_TTL) return cachedPlayerSets;

  const map = new Map<string, Set<string>>();
  for (const cond of SAFE_CONDITIONS) {
    const set = await getPlayerSet(cond.tag, cond.type);
    map.set(cond.tag, set);
  }
  cachedPlayerSets = map;
  cacheTime = now;
  return map;
}

const MIN_PLAYERS = 3;
const MAX_ATTEMPTS = 100;

const FALLBACK_GRID = {
  rowConditions: [
    { id: 'r1', label: 'Пеп Гвардиола', tag: 'pep' },
    { id: 'r2', label: 'Чемпион мира', tag: 'worldcup-winner' },
    { id: 'r3', label: 'Золотой мяч', tag: 'ballondor' },
  ],
  colConditions: [
    { id: 'c1', label: 'Лига Чемпионов', tag: 'ucl' },
    { id: 'c2', label: 'АПЛ', tag: 'premier-league' },
    { id: 'c3', label: 'Бундеслига', tag: 'bundesliga' },
  ],
};

export async function gridRoutes(app: FastifyInstance) {
  // GET /api/grid/random
  app.get('/api/grid/random', async (_req, reply) => {
    try {
      const playerSets = await getOrBuildCache();

      // Only use conditions with enough players
      const viableConds = [...SAFE_CONDITIONS].filter(
        (c) => (playerSets.get(c.tag)?.size ?? 0) >= 10
      );

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const shuffled = shuffle(viableConds);
        const rows = shuffled.slice(0, 3);
        const cols = shuffled.slice(3, 6);

        // No duplicate tags between rows and cols
        const rowTags = new Set(rows.map((r) => r.tag));
        const colTags = new Set(cols.map((c) => c.tag));
        if ([...rowTags].some((t) => colTags.has(t))) continue;

        // Check all 9 intersections
        let allGood = true;
        for (const row of rows) {
          for (const col of cols) {
            const rowSet = playerSets.get(row.tag)!;
            const colSet = playerSets.get(col.tag)!;
            if (intersectionCount(rowSet, colSet) < MIN_PLAYERS) {
              allGood = false;
              break;
            }
          }
          if (!allGood) break;
        }

        if (allGood) {
          return reply.send({
            rowConditions: rows.map((c, i) => ({ id: `r${i + 1}`, label: c.label, tag: c.tag })),
            colConditions: cols.map((c, i) => ({ id: `c${i + 1}`, label: c.label, tag: c.tag })),
          });
        }
      }

      // Fallback after MAX_ATTEMPTS
      return reply.send(FALLBACK_GRID);
    } catch (e) {
      app.log.error(e);
      return reply.status(500).send({ error: 'Failed to generate grid' });
    }
  });

  // POST /api/grid/invalidate-cache — force refresh
  app.post('/api/grid/invalidate-cache', async (_req, reply) => {
    cachedPlayerSets = null;
    return reply.send({ ok: true });
  });
}

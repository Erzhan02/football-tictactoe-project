import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { searchPlayerSuggestions } from '../services/validation.js';
import { scrapePlayerFromWikidata } from '../services/wikidata.js';

// GET /players/search?q=messi&limit=5
// GET /players/scrape?name=Lamine+Yamal
// GET /players
// GET /players/:id
// POST /players
// PUT /players/:id
// DELETE /players/:id

export async function playersRoutes(app: FastifyInstance) {
  // ── Scrape player from Wikidata ─────────────
  app.get('/players/scrape', async (request, reply) => {
    const { name = '' } = request.query as { name?: string };

    if (!name || name.trim().length < 2) {
      return reply.status(400).send({ error: 'Player name is required' });
    }

    const scraped = await scrapePlayerFromWikidata(name);
    if (!scraped) {
      return reply.status(404).send({ error: 'Player not found on Wikidata' });
    }

    return reply.send(scraped);
  });

  // ── Search suggestions ──────────────────────
  app.get('/players/search', async (request, reply) => {
    const { q = '', limit = '5' } = request.query as { q?: string; limit?: string };

    if (!q || q.trim().length < 2) {
      return reply.send([]);
    }

    const results = await searchPlayerSuggestions(q, parseInt(limit, 10));
    return reply.send(results);
  });

  // ── Get all players (paginated) ─────────────
  app.get('/players', async (request, reply) => {
    const { page = '1', limit = '50', q = '' } = request.query as {
      page?: string;
      limit?: string;
      q?: string;
    };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { nationality: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        skip,
        take: parseInt(limit, 10),
        orderBy: { name: 'asc' },
        include: {
          clubs: { include: { club: true } },
          leagues: { include: { league: true } },
          managers: { include: { manager: true } },
          tournaments: { include: { tournament: true } },
        },
      }),
      prisma.player.count({ where }),
    ]);

    return reply.send({ players, total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
  });

  // ── Get single player ───────────────────────
  app.get('/players/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        clubs: { include: { club: true } },
        leagues: { include: { league: true } },
        managers: { include: { manager: true } },
        tournaments: { include: { tournament: true } },
      },
    });

    if (!player) {
      return reply.status(404).send({ error: 'Player not found' });
    }

    return reply.send(player);
  });

  // ── Create player ───────────────────────────
  const CreatePlayerSchema = z.object({
    name: z.string().min(2),
    aliases: z.array(z.string()).default([]),
    nationality: z.string().optional(),
    position: z.string().optional(),
    clubTags: z.array(z.string()).default([]),
    leagueTags: z.array(z.string()).default([]),
    managerTags: z.array(z.string()).default([]),
    tournamentTags: z.array(z.string()).default([]),
  });

  app.post('/players', async (request, reply) => {
    const body = CreatePlayerSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    const { name, aliases, nationality, position, clubTags, leagueTags, managerTags, tournamentTags } = body.data;

    const player = await prisma.player.create({
      data: { name, aliases, nationality, position },
    });

    // Link relations
    await linkPlayerRelations(player.id, clubTags, leagueTags, managerTags, tournamentTags);

    return reply.status(201).send(player);
  });

  // ── Update player ───────────────────────────
  app.put('/players/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = CreatePlayerSchema.partial().safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    const { clubTags, leagueTags, managerTags, tournamentTags, ...playerData } = body.data;

    const player = await prisma.player.update({
      where: { id },
      data: playerData,
    });

    if (clubTags || leagueTags || managerTags || tournamentTags) {
      // Remove old relations and re-create
      await prisma.$transaction([
        prisma.playerClub.deleteMany({ where: { playerId: id } }),
        prisma.playerLeague.deleteMany({ where: { playerId: id } }),
        prisma.playerManager.deleteMany({ where: { playerId: id } }),
        prisma.playerTournament.deleteMany({ where: { playerId: id } }),
      ]);
      await linkPlayerRelations(
        id,
        clubTags ?? [],
        leagueTags ?? [],
        managerTags ?? [],
        tournamentTags ?? []
      );
    }

    return reply.send(player);
  });

  // ── Delete player ───────────────────────────
  app.delete('/players/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.player.delete({ where: { id } });
    return reply.status(204).send();
  });
}

// ─────────────────────────────────────────────
// Helper: link player to relation tables
// ─────────────────────────────────────────────
async function linkPlayerRelations(
  playerId: string,
  clubTags: string[],
  leagueTags: string[],
  managerTags: string[],
  tournamentTags: string[]
) {
  const [clubs, leagues, managers, tournaments] = await Promise.all([
    prisma.club.findMany({ where: { tag: { in: clubTags } } }),
    prisma.league.findMany({ where: { tag: { in: leagueTags } } }),
    prisma.manager.findMany({ where: { tag: { in: managerTags } } }),
    prisma.tournament.findMany({ where: { tag: { in: tournamentTags } } }),
  ]);

  await Promise.all([
    ...clubs.map((c) =>
      prisma.playerClub.upsert({
        where: { playerId_clubId: { playerId, clubId: c.id } },
        update: {},
        create: { playerId, clubId: c.id },
      })
    ),
    ...leagues.map((l) =>
      prisma.playerLeague.upsert({
        where: { playerId_leagueId: { playerId, leagueId: l.id } },
        update: {},
        create: { playerId, leagueId: l.id },
      })
    ),
    ...managers.map((m) =>
      prisma.playerManager.upsert({
        where: { playerId_managerId: { playerId, managerId: m.id } },
        update: {},
        create: { playerId, managerId: m.id },
      })
    ),
    ...tournaments.map((t) =>
      prisma.playerTournament.upsert({
        where: { playerId_tournamentId: { playerId, tournamentId: t.id } },
        update: {},
        create: { playerId, tournamentId: t.id },
      })
    ),
  ]);
}

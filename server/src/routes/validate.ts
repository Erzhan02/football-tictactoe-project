import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validatePlayerAnswer } from '../services/validation.js';
import { prisma } from '../lib/prisma.js';

// POST /validate
// GET  /conditions

export async function validateRoutes(app: FastifyInstance) {
  // ── Validate player answer ──────────────────
  const ValidateSchema = z.object({
    playerName: z.string().min(1),
    rowTag: z.string().min(1),
    colTag: z.string().min(1),
    usedPlayerIds: z.array(z.string()).default([]),
  });

  app.post('/validate', async (request, reply) => {
    const body = ValidateSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    const result = await validatePlayerAnswer(body.data);
    return reply.send(result);
  });

  // ── Get all available conditions ────────────
  app.get('/conditions', async (_request, reply) => {
    const [clubs, leagues, tournaments, managers] = await Promise.all([
      prisma.club.findMany({ orderBy: { name: 'asc' } }),
      prisma.league.findMany({ orderBy: { name: 'asc' } }),
      prisma.tournament.findMany({ orderBy: { name: 'asc' } }),
      prisma.manager.findMany({ orderBy: { name: 'asc' } }),
    ]);

    const conditions = [
      ...tournaments.map((t) => ({
        id: `cond-${t.tag}`,
        label: t.name,
        tag: t.tag,
        group: 'Турниры',
      })),
      ...leagues.map((l) => ({
        id: `cond-${l.tag}`,
        label: l.name,
        tag: l.tag,
        group: 'Лиги',
      })),
      ...clubs.map((c) => ({
        id: `cond-${c.tag}`,
        label: `Играл за ${c.name}`,
        tag: c.tag,
        group: 'Клубы',
      })),
      ...managers.map((m) => ({
        id: `cond-${m.tag}`,
        label: `Играл под руководством ${m.name}`,
        tag: m.tag,
        group: 'Тренеры',
      })),
    ];

    return reply.send(conditions);
  });
}

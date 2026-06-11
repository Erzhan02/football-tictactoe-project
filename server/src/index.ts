import Fastify from 'fastify';
import cors from '@fastify/cors';
import { playersRoutes } from './routes/players.js';
import { validateRoutes } from './routes/validate.js';
import { gridRoutes } from './routes/grid.js';
import { prisma } from './lib/prisma.js';

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
    },
  },
});

// ─────────────────────────────────────────────
// Plugins
// ─────────────────────────────────────────────
await app.register(cors, {
  origin: (process.env.CORS_ORIGIN ?? 'http://localhost:5174').split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
await app.register(playersRoutes);
await app.register(validateRoutes);
await app.register(gridRoutes);

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3000', 10);

try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`⚽ Football TicTacToe API running on http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  await prisma.$disconnect();
  process.exit(1);
}

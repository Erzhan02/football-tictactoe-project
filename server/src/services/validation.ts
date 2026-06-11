import { prisma } from '../lib/prisma.js';
import Fuse from 'fuse.js';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface ValidationRequest {
  playerName: string;
  rowTag: string;
  colTag: string;
  usedPlayerIds: string[];
}

export interface ValidationResponse {
  valid: boolean;
  player: { id: string; name: string } | null;
  errorType: 'not_found' | 'wrong_conditions' | 'already_used' | null;
  errorMessage: string | null;
}

export interface SearchResult {
  id: string;
  name: string;
  nationality: string | null;
  position: string | null;
}

// ─────────────────────────────────────────────
// Tag resolution — figure out which table/field to query
// ─────────────────────────────────────────────
type TagType = 'club' | 'league' | 'tournament' | 'manager' | 'nationality';

// Map condition tags to actual nationality strings stored in player records
const NATIONALITY_TAG_MAP: Record<string, string> = {
  'france': 'France',
  'spain': 'Spain',
  'argentina': 'Argentina',
  'england': 'England',
  'portugal': 'Portugal',
  'brazil': 'Brazil',
  'netherlands': 'Netherlands',
  'belgium': 'Belgium',
  'germany': 'Germany',
  'italy': 'Italy',
  'russia': 'Russia',
  'uruguay': 'Uruguay',
  'croatia': 'Croatia',
  'colombia': 'Colombia',
  'switzerland': 'Switzerland',
  'sweden': 'Sweden',
  'morocco': 'Morocco',
  'turkey': 'Turkey',
  'denmark': 'Denmark',
  'ukraine': 'Ukraine',
  'ivory-coast': 'Ivory Coast',
  'egypt': 'Egypt',
  'norway': 'Norway',
  'chile': 'Chile',
  'wales': 'Wales',
};

async function resolveTag(tag: string): Promise<TagType | null> {
  // Check nationality tags first (no DB lookup needed)
  if (NATIONALITY_TAG_MAP[tag]) return 'nationality';

  const [club, league, tournament, manager] = await Promise.all([
    prisma.club.findUnique({ where: { tag } }),
    prisma.league.findUnique({ where: { tag } }),
    prisma.tournament.findUnique({ where: { tag } }),
    prisma.manager.findUnique({ where: { tag } }),
  ]);

  if (club) return 'club';
  if (league) return 'league';
  if (tournament) return 'tournament';
  if (manager) return 'manager';
  return null;
}

async function playerHasTag(playerId: string, tag: string): Promise<boolean> {
  const tagType = await resolveTag(tag);
  if (!tagType) return false;

  switch (tagType) {
    case 'nationality': {
      const nationalityName = NATIONALITY_TAG_MAP[tag];
      if (!nationalityName) return false;
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        select: { nationality: true },
      });
      return player?.nationality?.toLowerCase() === nationalityName.toLowerCase();
    }
    case 'club': {
      const club = await prisma.club.findUnique({ where: { tag } });
      if (!club) return false;
      const link = await prisma.playerClub.findUnique({
        where: { playerId_clubId: { playerId, clubId: club.id } },
      });
      return !!link;
    }
    case 'league': {
      const league = await prisma.league.findUnique({ where: { tag } });
      if (!league) return false;
      const link = await prisma.playerLeague.findUnique({
        where: { playerId_leagueId: { playerId, leagueId: league.id } },
      });
      return !!link;
    }
    case 'tournament': {
      const tournament = await prisma.tournament.findUnique({ where: { tag } });
      if (!tournament) return false;
      const link = await prisma.playerTournament.findUnique({
        where: { playerId_tournamentId: { playerId, tournamentId: tournament.id } },
      });
      return !!link;
    }
    case 'manager': {
      const manager = await prisma.manager.findUnique({ where: { tag } });
      if (!manager) return false;
      const link = await prisma.playerManager.findUnique({
        where: { playerId_managerId: { playerId, managerId: manager.id } },
      });
      return !!link;
    }
  }
}

// ─────────────────────────────────────────────
// Fuzzy player search by name
// ─────────────────────────────────────────────
async function findPlayerByName(input: string) {
  const allPlayers = await prisma.player.findMany({
    select: { id: true, name: true, aliases: true, nationality: true, position: true },
  });

  const fuse = new Fuse(allPlayers, {
    keys: ['name', 'aliases'],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 3,
  });

  const results = fuse.search(input.trim());
  return results.length > 0 ? results[0].item : null;
}

// ─────────────────────────────────────────────
// Main validate function
// ─────────────────────────────────────────────
export async function validatePlayerAnswer(
  req: ValidationRequest
): Promise<ValidationResponse> {
  const { playerName, rowTag, colTag, usedPlayerIds } = req;

  if (!playerName.trim()) {
    return { valid: false, player: null, errorType: 'not_found', errorMessage: 'Введите имя футболиста' };
  }

  const player = await findPlayerByName(playerName);

  if (!player) {
    return {
      valid: false,
      player: null,
      errorType: 'not_found',
      errorMessage: `Футболист "${playerName}" не найден в базе данных`,
    };
  }

  if (usedPlayerIds.includes(player.id)) {
    return {
      valid: false,
      player: { id: player.id, name: player.name },
      errorType: 'already_used',
      errorMessage: `${player.name} уже был использован в этой игре`,
    };
  }

  const [hasRow, hasCol] = await Promise.all([
    playerHasTag(player.id, rowTag),
    playerHasTag(player.id, colTag),
  ]);

  if (!hasRow || !hasCol) {
    const missing: string[] = [];
    if (!hasRow) missing.push(`"${rowTag}"`);
    if (!hasCol) missing.push(`"${colTag}"`);
    return {
      valid: false,
      player: { id: player.id, name: player.name },
      errorType: 'wrong_conditions',
      errorMessage: `${player.name} не подходит под условие: ${missing.join(' и ')}`,
    };
  }

  return {
    valid: true,
    player: { id: player.id, name: player.name },
    errorType: null,
    errorMessage: null,
  };
}

// ─────────────────────────────────────────────
// Search suggestions
// ─────────────────────────────────────────────
export async function searchPlayerSuggestions(
  query: string,
  limit = 5
): Promise<SearchResult[]> {
  if (query.trim().length < 2) return [];

  const allPlayers = await prisma.player.findMany({
    select: { id: true, name: true, aliases: true, nationality: true, position: true },
  });

  const fuse = new Fuse(allPlayers, {
    keys: ['name', 'aliases'],
    threshold: 0.35,
    minMatchCharLength: 2,
  });

  return fuse.search(query.trim(), { limit }).map((r) => ({
    id: r.item.id,
    name: r.item.name,
    nationality: r.item.nationality,
    position: r.item.position,
  }));
}

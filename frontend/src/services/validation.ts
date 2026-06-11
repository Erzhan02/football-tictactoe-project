import Fuse from 'fuse.js';
import type { Player, Condition, ValidationResult } from '@/types';

// Let's get the API URL from import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ─────────────────────────────────────────────
// Fuse.js config for fuzzy name matching (local fallback)
// ─────────────────────────────────────────────
function buildFuse(players: Player[]) {
  return new Fuse(players, {
    keys: ['name', 'aliases'],
    threshold: 0.35,   // 0 = exact, 1 = anything
    includeScore: true,
    minMatchCharLength: 3,
  });
}

// ─────────────────────────────────────────────
// Main validation function
// ─────────────────────────────────────────────
export async function validatePlayer(
  input: string,
  rowCondition: Condition,
  colCondition: Condition,
  usedPlayerIds: string[],
  database: Player[]
): Promise<ValidationResult> {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      valid: false,
      player: null,
      errorType: 'not_found',
      errorMessage: 'Введите имя футболиста',
    };
  }

  // Try API validation first
  try {
    const response = await fetch(`${API_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: trimmed,
        rowTag: rowCondition.tag,
        colTag: colCondition.tag,
        usedPlayerIds,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('API validation failed, falling back to local database validation:', error);
  }

  // Local fallback
  const fuse = buildFuse(database);
  const results = fuse.search(trimmed);

  if (results.length === 0) {
    return {
      valid: false,
      player: null,
      errorType: 'not_found',
      errorMessage: `Футболист "${trimmed}" не найден в базе данных`,
    };
  }

  const bestMatch = results[0].item;

  // Check if already used
  if (usedPlayerIds.includes(bestMatch.id)) {
    return {
      valid: false,
      player: bestMatch,
      errorType: 'already_used',
      errorMessage: `${bestMatch.name} уже был использован в этой игре`,
    };
  }

  const hasRowTag = bestMatch.tags.includes(rowCondition.tag);
  const hasColTag = bestMatch.tags.includes(colCondition.tag);

  if (!hasRowTag || !hasColTag) {
    const missing: string[] = [];
    if (!hasRowTag) missing.push(`"${rowCondition.label}"`);
    if (!hasColTag) missing.push(`"${colCondition.label}"`);

    return {
      valid: false,
      player: bestMatch,
      errorType: 'wrong_conditions',
      errorMessage: `${bestMatch.name} не подходит под условие: ${missing.join(' и ')}`,
    };
  }

  return {
    valid: true,
    player: bestMatch,
  };
}

// ─────────────────────────────────────────────
// Search suggestions (autocomplete)
// ─────────────────────────────────────────────
export async function searchPlayers(input: string, database: Player[], limit = 5): Promise<Player[]> {
  const trimmed = input.trim();
  if (trimmed.length < 2) return [];

  // Try API search suggestions first
  try {
    const response = await fetch(`${API_URL}/players/search?q=${encodeURIComponent(trimmed)}&limit=${limit}`);
    if (response.ok) {
      const data = await response.json();
      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        nationality: p.nationality || '',
        position: p.position || '',
        aliases: [],
        tags: [],
      }));
    }
  } catch (error) {
    console.warn('API search suggestions failed, falling back to local database:', error);
  }

  // Local fallback
  const fuse = buildFuse(database);
  return fuse.search(trimmed, { limit }).map((r) => r.item);
}

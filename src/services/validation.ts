import Fuse from 'fuse.js';
import type { Player, Condition, ValidationResult } from '@/types';

// ─────────────────────────────────────────────
// Fuse.js config for fuzzy name matching
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
export function validatePlayer(
  input: string,
  rowCondition: Condition,
  colCondition: Condition,
  usedPlayerIds: string[],
  database: Player[]
): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      valid: false,
      player: null,
      errorType: 'not_found',
      errorMessage: 'Введите имя футболиста',
    };
  }

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
export function searchPlayers(input: string, database: Player[], limit = 5): Player[] {
  if (input.trim().length < 2) return [];
  const fuse = buildFuse(database);
  return fuse.search(input.trim(), { limit }).map((r) => r.item);
}

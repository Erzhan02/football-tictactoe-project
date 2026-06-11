// ─────────────────────────────────────────────
// Core game types
// ─────────────────────────────────────────────

export type PlayerSymbol = 'X' | 'O';

export interface CellState {
  symbol: PlayerSymbol;
  playerName: string;
  playerId: string;
}

export interface Condition {
  id: string;
  label: string;
  tag: string; // used to match against player.tags
}

// ─────────────────────────────────────────────
// Game board
// ─────────────────────────────────────────────

export type Board = (CellState | null)[][];

export type GameStatus = 'playing' | 'won' | 'draw';

export interface WinInfo {
  winner: PlayerSymbol;
  line: [number, number][]; // winning cell coordinates
}

// ─────────────────────────────────────────────
// Player database
// ─────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  aliases: string[];  // alternative spellings / translations
  tags: string[];     // e.g. ["ucl", "pep", "barcelona", "worldcup"]
  nationality?: string;
  position?: string;
}

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────

export type ValidationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ValidationResult {
  valid: boolean;
  player: Player | null;
  errorType?: 'not_found' | 'wrong_conditions' | 'already_used';
  errorMessage?: string;
}

// ─────────────────────────────────────────────
// Presets
// ─────────────────────────────────────────────

export interface Preset {
  id: string;
  name: string;
  rowConditions: Condition[];
  colConditions: Condition[];
  createdAt: number;
}

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────

export interface SelectedCell {
  row: number;
  col: number;
}

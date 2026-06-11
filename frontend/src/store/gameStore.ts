import { create } from 'zustand';
import type {
  Board,
  PlayerSymbol,
  CellState,
  Condition,
  SelectedCell,
  WinInfo,
  GameStatus,
  GamePhase,
} from '@/types';
import {
  createEmptyBoard,
  checkWinner,
  isBoardFull,
  getOpponent,
} from '@/services/gameLogic';
import { DEFAULT_ROW_CONDITIONS, DEFAULT_COL_CONDITIONS, CONDITIONS_CATALOG } from '@/data/conditions';

interface GameStore {
  // Board state
  board: Board;
  currentPlayer: PlayerSymbol;
  status: GameStatus;
  winInfo: WinInfo | null;
  usedPlayerIds: string[];

  // Conditions (editable headers)
  rowConditions: Condition[];
  colConditions: Condition[];

  // Modal state
  selectedCell: SelectedCell | null;
  isModalOpen: boolean;

  // Score tracking
  scoreX: number;
  scoreO: number;

  // Player names
  playerXName: string;
  playerOName: string;

  // Game phase
  phase: GamePhase;

  // Column/Row pick state
  pickedCol: number | null;  // X picks a column (0,1,2)
  pickedRow: number | null;  // O picks a row (0,1,2)

  // Actions
  selectCell: (row: number, col: number) => void;
  closeModal: () => void;
  placePlayer: (row: number, col: number, playerName: string, playerId: string) => 'success' | 'occupied';
  resetGame: () => void;
  updateRowCondition: (index: number, condition: Condition) => void;
  updateColCondition: (index: number, condition: Condition) => void;
  loadPresetConditions: (rowConditions: Condition[], colConditions: Condition[]) => void;
  randomizeConditions: () => void;
  randomizeRowConditions: () => void;
  randomizeColConditions: () => void;

  // Phase actions
  startGame: (playerXName: string, playerOName: string, xSymbol: PlayerSymbol) => void;
  pickColumn: (col: number) => void;
  pickRow: (row: number) => void;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const useGameStore = create<GameStore>()((set, get) => ({
  board: createEmptyBoard(),
  currentPlayer: 'X',
  status: 'playing',
  winInfo: null,
  usedPlayerIds: [],
  rowConditions: DEFAULT_ROW_CONDITIONS.map((c) => ({ ...c })),
  colConditions: DEFAULT_COL_CONDITIONS.map((c) => ({ ...c })),
  selectedCell: null,
  isModalOpen: false,
  scoreX: 0,
  scoreO: 0,
  playerXName: 'Игрок X',
  playerOName: 'Игрок O',
  phase: 'setup',
  pickedCol: null,
  pickedRow: null,

  selectCell: (row, col) => {
    const { board, status, phase } = get();
    if (phase !== 'playing') return;
    if (status !== 'playing') return;
    if (board[row][col] !== null) return;
    set({ selectedCell: { row, col }, isModalOpen: true });
  },

  closeModal: () => {
    set({ isModalOpen: false, selectedCell: null });
  },

  placePlayer: (row, col, playerName, playerId) => {
    const state = get();
    if (state.board[row][col] !== null) return 'occupied';

    const currentPlayer = state.currentPlayer;

    const newBoard: Board = state.board.map((r, rIdx) =>
      r.map((cell, cIdx) => {
        if (rIdx === row && cIdx === col) {
          const newCell: CellState = { symbol: currentPlayer, playerName, playerId };
          return newCell;
        }
        return cell;
      })
    );

    const newUsedPlayerIds = [...state.usedPlayerIds, playerId];

    const winInfo = checkWinner(newBoard);
    let newStatus: GameStatus = 'playing';
    let newWinInfo: WinInfo | null = null;
    let newScoreX = state.scoreX;
    let newScoreO = state.scoreO;
    let newCurrentPlayer: PlayerSymbol = currentPlayer;

    if (winInfo) {
      newStatus = 'won';
      newWinInfo = winInfo;
      if (currentPlayer === 'X') newScoreX += 1;
      else newScoreO += 1;
    } else if (isBoardFull(newBoard)) {
      newStatus = 'draw';
    } else {
      newCurrentPlayer = getOpponent(currentPlayer);
    }

    set({
      board: newBoard,
      usedPlayerIds: newUsedPlayerIds,
      isModalOpen: false,
      selectedCell: null,
      status: newStatus,
      winInfo: newWinInfo,
      scoreX: newScoreX,
      scoreO: newScoreO,
      currentPlayer: newCurrentPlayer,
    });

    return 'success';
  },

  resetGame: () => {
    set({
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winInfo: null,
      usedPlayerIds: [],
      isModalOpen: false,
      selectedCell: null,
      phase: 'setup',
      pickedCol: null,
      pickedRow: null,
    });
  },

  updateRowCondition: (index, condition) => {
    const { rowConditions } = get();
    const updated = rowConditions.map((c, i) => (i === index ? condition : c));
    set({ rowConditions: updated });
  },

  updateColCondition: (index, condition) => {
    const { colConditions } = get();
    const updated = colConditions.map((c, i) => (i === index ? condition : c));
    set({ colConditions: updated });
  },

  loadPresetConditions: (rowConditions, colConditions) => {
    set({
      rowConditions: rowConditions.map((c) => ({ ...c })),
      colConditions: colConditions.map((c) => ({ ...c })),
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winInfo: null,
      usedPlayerIds: [],
      isModalOpen: false,
      selectedCell: null,
      phase: 'setup',
      pickedCol: null,
      pickedRow: null,
    });
  },

  randomizeConditions: () => {
    const catalog = CONDITIONS_CATALOG;
    const rows = pickRandom(catalog, 3).map((c, i) => ({ ...c, id: `r${i + 1}` }));
    // Pick 3 more that don't duplicate row tags
    const rowTags = new Set(rows.map(c => c.tag));
    const remaining = catalog.filter(c => !rowTags.has(c.tag));
    const cols = pickRandom(remaining, 3).map((c, i) => ({ ...c, id: `c${i + 1}` }));
    set({ rowConditions: rows, colConditions: cols });
  },

  randomizeRowConditions: () => {
    const catalog = CONDITIONS_CATALOG;
    const { colConditions } = get();
    const colTags = new Set(colConditions.map(c => c.tag));
    const remaining = catalog.filter(c => !colTags.has(c.tag));
    const rows = pickRandom(remaining, 3).map((c, i) => ({ ...c, id: `r${i + 1}` }));
    set({ rowConditions: rows });
  },

  randomizeColConditions: () => {
    const catalog = CONDITIONS_CATALOG;
    const { rowConditions } = get();
    const rowTags = new Set(rowConditions.map(c => c.tag));
    const remaining = catalog.filter(c => !rowTags.has(c.tag));
    const cols = pickRandom(remaining, 3).map((c, i) => ({ ...c, id: `c${i + 1}` }));
    set({ colConditions: cols });
  },

  startGame: (xName, oName) => {
    set({
      playerXName: xName || 'Игрок X',
      playerOName: oName || 'Игрок O',
      phase: 'playing',
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winInfo: null,
      usedPlayerIds: [],
      pickedCol: null,
      pickedRow: null,
    });
  },

  pickColumn: (col) => {
    set({ pickedCol: col, phase: 'picking-row' });
  },

  pickRow: (row) => {
    set({ pickedRow: row, phase: 'playing' });
  },
}));

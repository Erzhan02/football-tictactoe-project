import { create } from 'zustand';
import type {
  Board,
  PlayerSymbol,
  CellState,
  Condition,
  SelectedCell,
  WinInfo,
  GameStatus,
} from '@/types';
import {
  createEmptyBoard,
  checkWinner,
  isBoardFull,
  getOpponent,
} from '@/services/gameLogic';
import { DEFAULT_ROW_CONDITIONS, DEFAULT_COL_CONDITIONS } from '@/data/conditions';

interface GameStore {
  // Board state
  board: Board;
  currentPlayer: PlayerSymbol;
  status: GameStatus;
  winInfo: WinInfo | null;
  usedPlayerIds: string[];   // changed from Set to array to avoid immer issues

  // Conditions (editable headers)
  rowConditions: Condition[];
  colConditions: Condition[];

  // Modal state
  selectedCell: SelectedCell | null;
  isModalOpen: boolean;

  // Score tracking
  scoreX: number;
  scoreO: number;

  // Actions
  selectCell: (row: number, col: number) => void;
  closeModal: () => void;
  placePlayer: (row: number, col: number, playerName: string, playerId: string) => 'success' | 'occupied';
  resetGame: () => void;
  updateRowCondition: (index: number, condition: Condition) => void;
  updateColCondition: (index: number, condition: Condition) => void;
  loadPresetConditions: (rowConditions: Condition[], colConditions: Condition[]) => void;
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

  selectCell: (row, col) => {
    const { board, status } = get();
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

    // Build the new board immutably
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

    // Check game result
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
    });
  },
}));

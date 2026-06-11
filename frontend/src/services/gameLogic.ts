import type { Board, WinInfo, PlayerSymbol } from '@/types';

const WINNING_LINES: [number, number][][] = [
  // Rows
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  // Columns
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  // Diagonals
  [[0,0],[1,1],[2,2]],
  [[0,2],[1,1],[2,0]],
];

export function checkWinner(board: Board): WinInfo | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cellA = board[a[0]][a[1]];
    const cellB = board[b[0]][b[1]];
    const cellC = board[c[0]][c[1]];

    if (
      cellA &&
      cellB &&
      cellC &&
      cellA.symbol === cellB.symbol &&
      cellB.symbol === cellC.symbol
    ) {
      return {
        winner: cellA.symbol,
        line: line as [number, number][],
      };
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function createEmptyBoard(): Board {
  return Array(3).fill(null).map(() => Array(3).fill(null));
}

export function getOpponent(player: PlayerSymbol): PlayerSymbol {
  return player === 'X' ? 'O' : 'X';
}

export function isWinningCell(
  row: number,
  col: number,
  winInfo: WinInfo | null
): boolean {
  if (!winInfo) return false;
  return winInfo.line.some(([r, c]) => r === row && c === col);
}

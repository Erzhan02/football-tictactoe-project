import React from 'react';
import type { CellState, PlayerSymbol } from '@/types';

interface GameCellProps {
  cell: CellState | null;
  row: number;
  col: number;
  isWinning: boolean;
  isAvailable: boolean;
  onClick: () => void;
  currentPlayer: PlayerSymbol;
}

const GameCell: React.FC<GameCellProps> = ({
  cell, isWinning, isAvailable, onClick, currentPlayer,
}) => {
  const isEmpty = cell === null;

  const symbolColors: Record<PlayerSymbol, string> = {
    X: 'text-blue-400',
    O: 'text-rose-400',
  };

  const symbolGlow: Record<PlayerSymbol, string> = {
    X: '0 0 20px rgba(59,130,246,0.6), 0 0 40px rgba(59,130,246,0.2)',
    O: '0 0 20px rgba(244,63,94,0.6), 0 0 40px rgba(244,63,94,0.2)',
  };

  return (
    <button
      onClick={isEmpty && isAvailable ? onClick : undefined}
      disabled={!isEmpty || !isAvailable}
      className={`
        relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center
        transition-all duration-300 group
        ${isEmpty && isAvailable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
        ${isWinning ? 'animate-winning-glow scale-105' : ''}
      `}
      style={{
        background: isWinning
          ? 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.15))'
          : isEmpty
          ? 'rgba(255,255,255,0.04)'
          : cell?.symbol === 'X'
          ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.08))'
          : 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(225,29,72,0.08))',
        border: isWinning
          ? '2px solid rgba(251,191,36,0.7)'
          : isEmpty
          ? '1px solid rgba(255,255,255,0.08)'
          : cell?.symbol === 'X'
          ? '1px solid rgba(59,130,246,0.35)'
          : '1px solid rgba(244,63,94,0.35)',
        boxShadow: isWinning
          ? '0 0 30px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2)'
          : cell && !isWinning
          ? symbolGlow[cell.symbol]
          : undefined,
      }}
    >
      {/* Hover hint for empty cells */}
      {isEmpty && isAvailable && (
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 text-white">
          {currentPlayer}
        </span>
      )}

      {/* Cell content */}
      {cell && (
        <div className="flex flex-col items-center justify-center gap-1 p-2 w-full max-w-full overflow-hidden animate-bounce-in">
          <span
            className={`text-3xl sm:text-4xl font-black ${symbolColors[cell.symbol]}`}
            style={{ textShadow: symbolGlow[cell.symbol] }}
          >
            {cell.symbol}
          </span>
          <span className="text-white/60 text-[10px] sm:text-xs font-semibold text-center leading-tight max-w-full truncate px-1">
            {cell.playerName}
          </span>
        </div>
      )}

      {/* Win star */}
      {isWinning && (
        <div className="absolute top-1 right-1 text-gold-400 text-xs animate-bounce-in">⭐</div>
      )}
    </button>
  );
};

export default GameCell;

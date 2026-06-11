import React, { useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { isWinningCell } from '@/services/gameLogic';
import GameCell from './GameCell';
import GameHeader from './GameHeader';
import PlayerInputModal from '@/components/Modal/PlayerInputModal';
import WinnerModal from '@/components/Modal/WinnerModal';
import PresetManager from '@/components/Preset/PresetManager';

const GameBoard: React.FC = () => {
  const {
    board,
    currentPlayer,
    status,
    winInfo,
    rowConditions,
    colConditions,
    scoreX,
    scoreO,
    isModalOpen,
    selectCell,
    closeModal,
    resetGame,
    updateRowCondition,
    updateColCondition,
  } = useGameStore();

  const [showWinner, setShowWinner] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  const { loadPresetConditions } = useGameStore();

  const handleRandomGrid = useCallback(async () => {
    setIsLoadingRandom(true);
    try {
      const res = await fetch('http://localhost:3000/api/grid/random');
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      loadPresetConditions(data.rowConditions, data.colConditions);
    } catch (e) {
      console.error('Failed to load random grid:', e);
    } finally {
      setIsLoadingRandom(false);
    }
  }, [loadPresetConditions]);

  // Show winner modal when game ends
  React.useEffect(() => {
    if (status === 'won' || status === 'draw') {
      setTimeout(() => setShowWinner(true), 600);
    } else {
      setShowWinner(false);
    }
  }, [status]);

  const handleReset = () => {
    setShowWinner(false);
    resetGame();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">
      {/* Score & Current Player */}
      <div className="flex items-center justify-between w-full">
        {/* Player X score */}
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            currentPlayer === 'X' && status === 'playing' ? 'scale-105' : 'opacity-60'
          }`}
          style={{
            background: 'rgba(59,130,246,0.15)',
            border: currentPlayer === 'X' && status === 'playing'
              ? '2px solid rgba(59,130,246,0.6)'
              : '1px solid rgba(59,130,246,0.2)',
            boxShadow: currentPlayer === 'X' && status === 'playing'
              ? '0 0 20px rgba(59,130,246,0.3)'
              : 'none',
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-black text-white text-sm">X</div>
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Игрок X</p>
            <p className="text-blue-400 font-black text-xl leading-none">{scoreX}</p>
          </div>
          {currentPlayer === 'X' && status === 'playing' && (
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse ml-1" />
          )}
        </div>

        {/* Game status / reset */}
        <div className="flex flex-col items-center gap-2">
          {status === 'playing' ? (
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              Ход: <span className={currentPlayer === 'X' ? 'text-blue-400' : 'text-rose-400'}>{currentPlayer}</span>
            </p>
          ) : (
            <p className="text-gold-400 text-xs font-bold uppercase tracking-wider animate-bounce">
              {status === 'draw' ? '🤝 Ничья' : `🏆 Победа ${winInfo?.winner}`}
            </p>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            🔄 Новая игра
          </button>
        </div>

        {/* Player O score */}
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            currentPlayer === 'O' && status === 'playing' ? 'scale-105' : 'opacity-60'
          }`}
          style={{
            background: 'rgba(244,63,94,0.15)',
            border: currentPlayer === 'O' && status === 'playing'
              ? '2px solid rgba(244,63,94,0.6)'
              : '1px solid rgba(244,63,94,0.2)',
            boxShadow: currentPlayer === 'O' && status === 'playing'
              ? '0 0 20px rgba(244,63,94,0.3)'
              : 'none',
          }}
        >
          {currentPlayer === 'O' && status === 'playing' && (
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse mr-1" />
          )}
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider text-right">Игрок O</p>
            <p className="text-rose-400 font-black text-xl leading-none text-right">{scoreO}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center font-black text-white text-sm">O</div>
        </div>
      </div>

      {/* Grid */}
      <div
        className="w-full rounded-3xl p-4 sm:p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* 4x4 grid: top-left corner + 3 col headers + 3 row headers + 9 cells */}
        <div
          className="grid gap-2 sm:gap-3"
          style={{
            gridTemplateColumns: 'minmax(80px, 1fr) repeat(3, minmax(80px, 1fr))',
            gridTemplateRows: 'auto repeat(3, minmax(80px, 1fr))',
          }}
        >
          {/* Top-left corner: preset + random buttons */}
          <div className="flex flex-col items-center justify-center gap-1">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="w-10 h-10 rounded-xl text-xl transition-all hover:scale-110"
              title="Пресеты"
              style={{
                background: showPresets ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)',
                border: showPresets ? '1px solid rgba(251,191,36,0.5)' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              📋
            </button>
            <button
              onClick={handleRandomGrid}
              disabled={isLoadingRandom}
              className="w-10 h-10 rounded-xl text-xl transition-all hover:scale-110 disabled:opacity-50"
              title="Случайная сетка"
              style={{
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            >
              {isLoadingRandom ? '⏳' : '🎲'}
            </button>
          </div>

          {/* Column headers */}
          {colConditions.map((cond, i) => (
            <GameHeader
              key={cond.id}
              condition={cond}
              type="col"
              onUpdate={(updated) => updateColCondition(i, updated)}
            />
          ))}

          {/* Rows: row header + 3 cells */}
          {rowConditions.map((rowCond, rowIdx) => (
            <React.Fragment key={rowCond.id}>
              {/* Row header */}
              <GameHeader
                condition={rowCond}
                type="row"
                onUpdate={(updated) => updateRowCondition(rowIdx, updated)}
              />

              {/* Cells */}
              {colConditions.map((_, colIdx) => (
                <GameCell
                  key={colIdx}
                  cell={board[rowIdx][colIdx]}
                  row={rowIdx}
                  col={colIdx}
                  isWinning={isWinningCell(rowIdx, colIdx, winInfo)}
                  isAvailable={status === 'playing'}
                  onClick={() => selectCell(rowIdx, colIdx)}
                  currentPlayer={currentPlayer}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Presets panel */}
      {showPresets && (
        <div className="w-full animate-slide-up">
          <PresetManager onClose={() => setShowPresets(false)} />
        </div>
      )}

      {/* Modals */}
      <PlayerInputModal isOpen={isModalOpen} onClose={closeModal} />
      <WinnerModal
        isOpen={showWinner}
        status={status as 'won' | 'draw'}
        winner={winInfo?.winner}
        scoreX={scoreX}
        scoreO={scoreO}
        onReset={handleReset}
        onClose={() => setShowWinner(false)}
      />
    </div>
  );
};

export default GameBoard;

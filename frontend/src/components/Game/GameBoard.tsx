import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { isWinningCell } from '@/services/gameLogic';
import GameCell from './GameCell';
import GameHeader from './GameHeader';
import PlayerSetupScreen from './PlayerSetupScreen';
import ColumnPickPhase from './ColumnPickPhase';
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
    phase,
    playerXName,
    playerOName,
    pickedCol,
    pickedRow,
    randomizeConditions,
  } = useGameStore();

  const [showWinner, setShowWinner] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [setupDone, setSetupDone] = useState(false);

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
    setSetupDone(false);
    resetGame();
  };

  const currentName = currentPlayer === 'X' ? playerXName : playerOName;

  // ── Setup screen ──────────────────────────────────────────────────────
  if (!setupDone) {
    return (
      <PlayerSetupScreen
        onStart={() => setSetupDone(true)}
      />
    );
  }

  // ── Column/Row pick phase ─────────────────────────────────────────────
  if (phase === 'picking-col' || phase === 'picking-row') {
    return <ColumnPickPhase />;
  }

  // ── Main game ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">

      {/* Score & Current Player */}
      <div className="flex items-center justify-between w-full">
        {/* Player X */}
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
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-black text-white text-sm">✕</div>
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">{playerXName}</p>
            <p className="text-blue-400 font-black text-xl leading-none">{scoreX}</p>
          </div>
          {currentPlayer === 'X' && status === 'playing' && (
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse ml-1" />
          )}
        </div>

        {/* Center controls */}
        <div className="flex flex-col items-center gap-2">
          {status === 'playing' ? (
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              Ход:{' '}
              <span className={currentPlayer === 'X' ? 'text-blue-400' : 'text-rose-400'}>
                {currentName}
              </span>
            </p>
          ) : (
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider animate-bounce">
              {status === 'draw' ? '🤝 Ничья' : `🏆 ${winInfo?.winner === 'X' ? playerXName : playerOName}!`}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              🔄 Новая игра
            </button>
            <button
              onClick={randomizeConditions}
              title="Случайные условия"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-yellow-400/70 hover:text-yellow-400 transition-colors"
              style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}
            >
              🎲
            </button>
          </div>
        </div>

        {/* Player O */}
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
            <p className="text-white/40 text-[10px] uppercase tracking-wider text-right">{playerOName}</p>
            <p className="text-rose-400 font-black text-xl leading-none text-right">{scoreO}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center font-black text-white text-sm">○</div>
        </div>
      </div>

      {/* Picked col/row hint */}
      {(pickedCol !== null || pickedRow !== null) && (
        <div className="flex items-center gap-4 text-xs">
          {pickedCol !== null && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
            >
              <span>✕</span>
              <span>{playerXName} → колонка «{colConditions[pickedCol]?.label}»</span>
            </div>
          )}
          {pickedRow !== null && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold"
              style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185' }}
            >
              <span>○</span>
              <span>{playerOName} → строка «{rowConditions[pickedRow]?.label}»</span>
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        className="w-full rounded-3xl p-4 sm:p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="grid gap-2 sm:gap-3"
          style={{
            gridTemplateColumns: 'minmax(80px, 1fr) repeat(3, minmax(80px, 1fr))',
            gridTemplateRows: 'auto repeat(3, minmax(80px, 1fr))',
          }}
        >
          {/* Top-left corner */}
          <div className="flex items-center justify-center">
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
          </div>

          {/* Column headers */}
          {colConditions.map((cond, i) => (
            <div
              key={cond.id}
              className="relative"
              style={{
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                ...(pickedCol === i ? {
                  boxShadow: '0 0 20px rgba(59,130,246,0.3)',
                  outline: '2px solid rgba(59,130,246,0.5)',
                  outlineOffset: '2px',
                } : {}),
              }}
            >
              {pickedCol === i && (
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold z-10 whitespace-nowrap"
                  style={{ background: 'rgba(59,130,246,0.9)', color: 'white' }}
                >
                  ✕ {playerXName}
                </div>
              )}
              <GameHeader
                condition={cond}
                type="col"
                onUpdate={(updated) => updateColCondition(i, updated)}
                highlighted={pickedCol === i ? 'x' : undefined}
              />
            </div>
          ))}

          {/* Rows */}
          {rowConditions.map((rowCond, rowIdx) => (
            <React.Fragment key={rowCond.id}>
              {/* Row header */}
              <div
                className="relative"
                style={{
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  ...(pickedRow === rowIdx ? {
                    boxShadow: '0 0 20px rgba(244,63,94,0.3)',
                    outline: '2px solid rgba(244,63,94,0.5)',
                    outlineOffset: '2px',
                  } : {}),
                }}
              >
                {pickedRow === rowIdx && (
                  <div
                    className="absolute -left-1 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold z-10 whitespace-nowrap"
                    style={{
                      background: 'rgba(244,63,94,0.9)',
                      color: 'white',
                      writingMode: 'horizontal-tb',
                      transform: 'translateY(-50%) translateX(-110%)',
                    }}
                  >
                    ○ {playerOName}
                  </div>
                )}
                <GameHeader
                  condition={rowCond}
                  type="row"
                  onUpdate={(updated) => updateRowCondition(rowIdx, updated)}
                  highlighted={pickedRow === rowIdx ? 'o' : undefined}
                />
              </div>

              {/* Cells */}
              {colConditions.map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="relative"
                  style={{
                    borderRadius: '16px',
                    ...(pickedCol === colIdx && pickedRow === rowIdx ? {
                      boxShadow: '0 0 25px rgba(139,92,246,0.4)',
                    } : pickedCol === colIdx ? {
                      background: 'rgba(59,130,246,0.04)',
                    } : pickedRow === rowIdx ? {
                      background: 'rgba(244,63,94,0.04)',
                    } : {}),
                  }}
                >
                  {/* Intersection marker */}
                  {pickedCol === colIdx && pickedRow === rowIdx && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none z-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(244,63,94,0.08))',
                        border: '1px solid rgba(139,92,246,0.3)',
                      }}
                    />
                  )}
                  <GameCell
                    cell={board[rowIdx][colIdx]}
                    row={rowIdx}
                    col={colIdx}
                    isWinning={isWinningCell(rowIdx, colIdx, winInfo)}
                    isAvailable={status === 'playing'}
                    onClick={() => selectCell(rowIdx, colIdx)}
                    currentPlayer={currentPlayer}
                  />
                </div>
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
        winnerName={winInfo?.winner === 'X' ? playerXName : playerOName}
        scoreX={scoreX}
        scoreO={scoreO}
        playerXName={playerXName}
        playerOName={playerOName}
        onReset={handleReset}
        onClose={() => setShowWinner(false)}
      />
    </div>
  );
};

export default GameBoard;

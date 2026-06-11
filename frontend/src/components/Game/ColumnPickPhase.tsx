import React from 'react';
import { useGameStore } from '@/store/gameStore';

const ColumnPickPhase: React.FC = () => {
  const {
    phase,
    playerXName,
    playerOName,
    rowConditions,
    colConditions,
    pickedCol,
    pickColumn,
    pickRow,
  } = useGameStore();

  const isPickingCol = phase === 'picking-col';
  const isPickingRow = phase === 'picking-row';

  const currentName = isPickingCol ? playerXName : playerOName;
  const currentSymbol = isPickingCol ? 'X' : 'O';
  const currentColor = isPickingCol ? '#3b82f6' : '#f43f5e';
  const currentBg   = isPickingCol ? 'rgba(59,130,246,0.15)' : 'rgba(244,63,94,0.15)';
  const currentBorder = isPickingCol ? 'rgba(59,130,246,0.5)' : 'rgba(244,63,94,0.5)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,15,0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20"
          style={{
            background: `radial-gradient(ellipse, ${currentColor}, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Phase indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: currentBg, border: `1px solid ${currentBorder}`, color: currentColor }}
          >
            <span className="text-base">{currentSymbol === 'X' ? '✕' : '○'}</span>
            <span>{currentName}</span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: currentColor }} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">
            {isPickingCol ? '📌 Выберите колонку' : '📌 Выберите строку'}
          </h2>
          <p className="text-white/40 text-sm">
            {isPickingCol
              ? `${playerXName} (✕) выбирает колонку — она будет выделена синим`
              : `${playerOName} (○) выбирает строку — она будет выделена красным`}
          </p>
        </div>

        {/* Mini grid preview */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Column headers — clickable if picking col */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div /> {/* corner */}
            {colConditions.map((cond, i) => (
              <button
                key={cond.id}
                onClick={() => isPickingCol && pickColumn(i)}
                disabled={!isPickingCol}
                className="py-2 px-1 rounded-xl text-center text-xs font-semibold transition-all duration-200"
                style={{
                  background: isPickingCol
                    ? 'rgba(59,130,246,0.1)'
                    : pickedCol === i
                    ? 'rgba(59,130,246,0.2)'
                    : 'rgba(255,255,255,0.04)',
                  border: pickedCol === i
                    ? '2px solid rgba(59,130,246,0.8)'
                    : isPickingCol
                    ? '1px solid rgba(59,130,246,0.3)'
                    : '1px solid rgba(255,255,255,0.07)',
                  color: isPickingCol ? '#60a5fa' : pickedCol === i ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                  cursor: isPickingCol ? 'pointer' : 'default',
                  transform: isPickingCol ? undefined : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (isPickingCol) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isPickingCol) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.1)';
                  }
                }}
              >
                <div className="truncate">{cond.label}</div>
                {isPickingCol && <div className="text-[9px] mt-0.5 text-blue-400/60">нажать</div>}
              </button>
            ))}
          </div>

          {/* Row headers — clickable if picking row */}
          {rowConditions.map((rowCond, rowIdx) => (
            <div key={rowCond.id} className="grid grid-cols-4 gap-2 mb-2">
              <button
                onClick={() => isPickingRow && pickRow(rowIdx)}
                disabled={!isPickingRow}
                className="py-2 px-1 rounded-xl text-center text-xs font-semibold transition-all duration-200"
                style={{
                  background: isPickingRow
                    ? 'rgba(244,63,94,0.1)'
                    : 'rgba(255,255,255,0.04)',
                  border: isPickingRow
                    ? '1px solid rgba(244,63,94,0.3)'
                    : '1px solid rgba(255,255,255,0.07)',
                  color: isPickingRow ? '#fb7185' : 'rgba(255,255,255,0.4)',
                  cursor: isPickingRow ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) => {
                  if (isPickingRow) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isPickingRow) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.1)';
                  }
                }}
              >
                <div className="truncate">{rowCond.label}</div>
                {isPickingRow && <div className="text-[9px] mt-0.5 text-rose-400/60">нажать</div>}
              </button>

              {/* 3 empty cells */}
              {colConditions.map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="rounded-xl"
                  style={{
                    height: 40,
                    background: pickedCol === colIdx
                      ? 'rgba(59,130,246,0.08)'
                      : 'rgba(255,255,255,0.02)',
                    border: pickedCol === colIdx
                      ? '1px solid rgba(59,130,246,0.2)'
                      : '1px solid rgba(255,255,255,0.04)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="flex items-center gap-2 text-xs font-semibold"
            style={{ color: phase === 'picking-col' ? '#60a5fa' : 'rgba(59,130,246,0.4)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
              style={{
                background: phase === 'picking-col' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.1)',
                border: `1px solid ${phase === 'picking-col' ? 'rgba(59,130,246,0.8)' : 'rgba(59,130,246,0.2)'}`,
              }}
            >
              {phase === 'picking-row' || phase === 'playing' ? '✓' : '1'}
            </div>
            ✕ Колонка
          </div>
          <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div
            className="flex items-center gap-2 text-xs font-semibold"
            style={{ color: phase === 'picking-row' ? '#fb7185' : 'rgba(255,255,255,0.2)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
              style={{
                background: phase === 'picking-row' ? 'rgba(244,63,94,0.3)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${phase === 'picking-row' ? 'rgba(244,63,94,0.8)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              2
            </div>
            ○ Строка
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnPickPhase;

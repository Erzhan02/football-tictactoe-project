import React, { useState, useRef, useEffect } from 'react';
import type { PlayerSymbol, Condition } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { CONDITIONS_CATALOG } from '@/data/conditions';

interface Props {
  onStart: () => void;
}

// ── Condition Picker ────────────────────────────────────────────────────
interface ConditionPickerProps {
  condition: Condition;
  onChange: (c: Condition) => void;
  color: 'blue' | 'rose';
  prefix: string;
}

const ConditionPicker: React.FC<ConditionPickerProps> = ({ condition, onChange, color, prefix }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = CONDITIONS_CATALOG.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.tag.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const borderColor = color === 'blue' ? 'rgba(59,130,246,0.35)' : 'rgba(244,63,94,0.35)';
  const bgColor     = color === 'blue' ? 'rgba(59,130,246,0.08)' : 'rgba(244,63,94,0.08)';
  const accentColor = color === 'blue' ? '#60a5fa' : '#fb7185';
  const hoverBg     = color === 'blue' ? 'rgba(59,130,246,0.15)' : 'rgba(244,63,94,0.15)';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setSearch(''); }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 group"
        style={{
          background: open ? hoverBg : bgColor,
          border: `1px solid ${open ? accentColor : borderColor}`,
        }}
      >
        <span className="text-[10px] font-bold shrink-0" style={{ color: accentColor, opacity: 0.6 }}>
          {prefix}
        </span>
        <span className="text-white text-xs font-semibold flex-1 truncate">{condition.label}</span>
        <span className="text-white/20 text-[10px] group-hover:text-white/40 transition-colors shrink-0">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f1923, #0a1218)',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 15px 50px rgba(0,0,0,0.8)',
          }}
        >
          <div className="p-2 sticky top-0" style={{ background: '#0a1218' }}>
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск условия..."
              className="w-full rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${borderColor}`,
              }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onChange({ ...c, id: condition.id });
                  setOpen(false);
                  setSearch('');
                }}
                className="w-full px-3 py-2 text-left flex items-center justify-between transition-colors"
                style={{
                  background: c.tag === condition.tag ? hoverBg : 'transparent',
                  borderLeft: c.tag === condition.tag ? `3px solid ${accentColor}` : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (c.tag !== condition.tag)
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (c.tag !== condition.tag)
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span className="text-white text-xs font-semibold">{c.label}</span>
                <span className="text-white/25 text-[10px] ml-2">#{c.tag}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-white/30 text-xs text-center py-4">Ничего не найдено</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Setup Screen ───────────────────────────────────────────────────
const PlayerSetupScreen: React.FC<Props> = ({ onStart }) => {
  const {
    randomizeConditions,
    randomizeRowConditions,
    randomizeColConditions,
    startGame,
    rowConditions,
    colConditions,
    updateRowCondition,
    updateColCondition,
  } = useGameStore();

  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [symbol1, setSymbol1] = useState<PlayerSymbol>('X');

  const symbol2: PlayerSymbol = symbol1 === 'X' ? 'O' : 'X';
  const xName = symbol1 === 'X' ? name1 : name2;
  const oName = symbol1 === 'O' ? name1 : name2;

  const handleStart = () => {
    startGame(xName || 'Игрок X', oName || 'Игрок O');
    onStart();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(5,5,15,0.98)', backdropFilter: 'blur(20px)' }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #f43f5e, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative min-h-full flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">⚽</div>
            <h1 className="text-3xl font-black text-white mb-1">Football TicTacToe</h1>
            <p className="text-white/35 text-sm">Настройте игру и нажмите «Начать»</p>
          </div>

          {/* ── Players ── */}
          <div
            className="p-5 rounded-2xl mb-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-white/35 text-xs uppercase tracking-widest font-bold mb-4">👥 Игроки</p>
            <div className="grid grid-cols-2 gap-4">
              {/* Player 1 */}
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Игрок 1</p>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Введите имя..."
                  maxLength={20}
                  className="w-full text-white text-sm font-semibold outline-none placeholder:text-white/20 mb-3"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setSymbol1('X')}
                    className="flex-1 py-2 rounded-xl font-black text-base transition-all duration-200"
                    style={{
                      background: symbol1 === 'X' ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.04)',
                      border: symbol1 === 'X' ? '2px solid rgba(59,130,246,0.7)' : '1px solid rgba(255,255,255,0.08)',
                      color: symbol1 === 'X' ? '#60a5fa' : 'rgba(255,255,255,0.2)',
                    }}
                  >✕</button>
                  <button
                    onClick={() => setSymbol1('O')}
                    className="flex-1 py-2 rounded-xl font-black text-base transition-all duration-200"
                    style={{
                      background: symbol1 === 'O' ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.04)',
                      border: symbol1 === 'O' ? '2px solid rgba(244,63,94,0.7)' : '1px solid rgba(255,255,255,0.08)',
                      color: symbol1 === 'O' ? '#fb7185' : 'rgba(255,255,255,0.2)',
                    }}
                  >○</button>
                </div>
              </div>

              {/* Player 2 */}
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Игрок 2</p>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Введите имя..."
                  maxLength={20}
                  className="w-full text-white text-sm font-semibold outline-none placeholder:text-white/20 mb-3"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                />
                {/* Auto-assigned symbol display */}
                <div
                  className="py-2 px-3 rounded-xl text-center font-black text-base"
                  style={{
                    background: symbol2 === 'X' ? 'rgba(59,130,246,0.15)' : 'rgba(244,63,94,0.15)',
                    border: symbol2 === 'X' ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(244,63,94,0.4)',
                    color: symbol2 === 'X' ? '#60a5fa' : '#fb7185',
                  }}
                >
                  {symbol2 === 'X' ? '✕ Крестик' : '○ Нолик'} (авто)
                </div>
              </div>
            </div>
          </div>

          {/* ── Conditions ── */}
          <div
            className="p-5 rounded-2xl mb-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/35 text-xs uppercase tracking-widest font-bold">⚽ Условия игры</p>
              <div className="flex gap-2">
                <button
                  onClick={randomizeRowConditions}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1))',
                    border: '1px solid rgba(59,130,246,0.45)',
                    color: '#60a5fa',
                    boxShadow: '0 4px 15px rgba(59,130,246,0.1)',
                  }}
                >
                  🎲 Строки
                </button>
                <button
                  onClick={randomizeColConditions}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(244,63,94,0.1))',
                    border: '1px solid rgba(244,63,94,0.45)',
                    color: '#fb7185',
                    boxShadow: '0 4px 15px rgba(244,63,94,0.1)',
                  }}
                >
                  🎲 Столбцы
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Rows */}
              <div>
                <p className="text-blue-400/60 text-[10px] uppercase tracking-widest font-bold mb-2.5 flex items-center gap-1.5">
                  <span>←</span> Строки
                </p>
                <div className="flex flex-col gap-2">
                  {rowConditions.map((cond, i) => (
                    <ConditionPicker
                      key={cond.id}
                      condition={cond}
                      onChange={(updated) => updateRowCondition(i, updated)}
                      color="blue"
                      prefix={`Р${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Cols */}
              <div>
                <p className="text-rose-400/60 text-[10px] uppercase tracking-widest font-bold mb-2.5 flex items-center gap-1.5">
                  <span>↑</span> Столбцы
                </p>
                <div className="flex flex-col gap-2">
                  {colConditions.map((cond, i) => (
                    <ConditionPicker
                      key={cond.id}
                      condition={cond}
                      onChange={(updated) => updateColCondition(i, updated)}
                      color="rose"
                      prefix={`С${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Grid preview */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/20 text-[10px] uppercase tracking-widest mb-2">Предпросмотр поля</p>
              <div
                className="grid gap-1 text-[9px]"
                style={{ gridTemplateColumns: '1fr repeat(3, 1fr)' }}
              >
                <div />
                {colConditions.map((c) => (
                  <div key={c.id} className="text-center text-white/30 truncate px-1 py-1 rounded"
                    style={{ background: 'rgba(244,63,94,0.06)' }}>{c.label}</div>
                ))}
                {rowConditions.map((r) => (
                  <React.Fragment key={r.id}>
                    <div className="text-white/30 truncate px-1 py-1 rounded text-right"
                      style={{ background: 'rgba(59,130,246,0.06)' }}>{r.label}</div>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="rounded"
                        style={{ height: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
              color: 'white',
              letterSpacing: '0.05em',
            }}
          >
            ⚡ Начать игру
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetupScreen;

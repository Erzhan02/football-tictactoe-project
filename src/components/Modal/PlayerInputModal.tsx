import React, { useState, useRef, useEffect } from 'react';
import Modal from '@/components/UI/Modal';
import { useGameStore } from '@/store/gameStore';
import { useDatabaseStore } from '@/store/databaseStore';
import { validatePlayer, searchPlayers } from '@/services/validation';
import type { ValidationResult, Player } from '@/types';

interface PlayerInputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerInputModal: React.FC<PlayerInputModalProps> = ({ isOpen, onClose }) => {
  const { selectedCell, rowConditions, colConditions, currentPlayer, usedPlayerIds, placePlayer } =
    useGameStore();
  const { players } = useDatabaseStore();

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [animState, setAnimState] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const rowCond = selectedCell ? rowConditions[selectedCell.row] : null;
  const colCond = selectedCell ? colConditions[selectedCell.col] : null;

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setInput('');
      setSuggestions([]);
      setValidationResult(null);
      setAnimState('idle');
    }
  }, [isOpen]);

  const handleInputChange = (value: string) => {
    setInput(value);
    setValidationResult(null);
    setAnimState('idle');
    if (value.length >= 2) {
      setSuggestions(searchPlayers(value, players, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCell || !rowCond || !colCond || isSubmitting) return;
    setIsSubmitting(true);
    setSuggestions([]);

    const result = validatePlayer(input, rowCond, colCond, usedPlayerIds, players);
    setValidationResult(result);

    if (result.valid && result.player) {
      setAnimState('success');
      setTimeout(() => {
        placePlayer(selectedCell.row, selectedCell.col, result.player!.name, result.player!.id);
        setIsSubmitting(false);
        setInput('');
        setValidationResult(null);
        setAnimState('idle');
      }, 700);
    } else {
      setAnimState('error');
      setTimeout(() => {
        setAnimState('idle');
        setIsSubmitting(false);
        inputRef.current?.focus();
      }, 800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const selectSuggestion = (player: Player) => {
    setInput(player.name);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  if (!selectedCell || !rowCond || !colCond) return null;

  const playerColor = currentPlayer === 'X'
    ? { text: 'text-blue-400', bg: 'bg-blue-500', border: 'border-blue-500', glow: 'rgba(59,130,246,0.3)' }
    : { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500', glow: 'rgba(244,63,94,0.3)' };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        {/* Player indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg ${playerColor.bg}`}
            style={{ boxShadow: `0 0 20px ${playerColor.glow}` }}
          >
            {currentPlayer}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Ход игрока {currentPlayer}</p>
            <p className="text-white/50 text-xs">Назовите подходящего футболиста</p>
          </div>
        </div>

        {/* Condition display */}
        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">Клетка должна совпадать с:</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)' }}
            >
              {rowCond.label}
            </span>
            <span className="text-white/30 text-lg font-thin">×</span>
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)' }}
            >
              {colCond.label}
            </span>
          </div>
        </div>

        {/* Input */}
        <div className="relative">
          <div
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              animState === 'success'
                ? 'ring-2 ring-green-500'
                : animState === 'error'
                ? 'ring-2 ring-red-500 animate-shake'
                : 'ring-1 ring-white/20 focus-within:ring-white/50'
            }`}
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <span className="text-white/40 text-xl">⚽</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Имя футболиста..."
              disabled={isSubmitting}
              className="flex-1 bg-transparent text-white placeholder-white/30 outline-none font-medium text-base"
            />
            {animState === 'success' && <span className="text-green-400 text-xl animate-bounce-in">✓</span>}
            {animState === 'error' && <span className="text-red-400 text-xl">✗</span>}
          </div>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10"
              style={{
                background: 'linear-gradient(135deg, #1a2f1d, #0d2910)',
                border: '1px solid rgba(251,191,36,0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              {suggestions.map((player) => (
                <button
                  key={player.id}
                  onClick={() => selectSuggestion(player)}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <span className="text-gold-400">⚽</span>
                  <span className="font-medium">{player.name}</span>
                  <span className="text-white/30 text-xs ml-auto">{player.nationality}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Validation message */}
        {validationResult && !validationResult.valid && (
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-in"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <span className="text-red-400 text-lg mt-0.5">⚠️</span>
            <div>
              <p className="text-red-300 text-sm font-semibold">Неверный ответ</p>
              <p className="text-red-400/80 text-xs mt-0.5">{validationResult.errorMessage}</p>
              {validationResult.errorType !== 'not_found' && validationResult.player && (
                <p className="text-white/30 text-xs mt-1">Найден: {validationResult.player.name}</p>
              )}
            </div>
          </div>
        )}

        {validationResult?.valid && (
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in"
            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <span className="text-green-400 text-lg">🎉</span>
            <p className="text-green-300 text-sm font-semibold">
              {validationResult.player?.name} — отличный выбор!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl text-white/60 hover:text-white font-medium text-sm transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Пропустить ход
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !input.trim()}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
              input.trim()
                ? `${playerColor.bg} text-white hover:opacity-90 shadow-lg`
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
            style={input.trim() ? { boxShadow: `0 4px 20px ${playerColor.glow}` } : {}}
          >
            {isSubmitting ? '...' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PlayerInputModal;

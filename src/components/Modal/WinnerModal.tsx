import React from 'react';
import Modal from '@/components/UI/Modal';
import type { PlayerSymbol } from '@/types';

interface WinnerModalProps {
  isOpen: boolean;
  status: 'won' | 'draw';
  winner?: PlayerSymbol;
  scoreX: number;
  scoreO: number;
  onReset: () => void;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen, status, winner, scoreX, scoreO, onReset, onClose,
}) => {
  const isDraw = status === 'draw';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-6">
        {/* Trophy / Draw Icon */}
        <div className="text-7xl animate-bounce-in">
          {isDraw ? '🤝' : '🏆'}
        </div>

        {/* Title */}
        <div>
          {isDraw ? (
            <h2 className="text-2xl font-black text-white">Ничья!</h2>
          ) : (
            <>
              <p className="text-sm text-white/50 uppercase tracking-wider font-semibold mb-1">Победитель</p>
              <h2 className="text-4xl font-black">
                <span
                  className={winner === 'X' ? 'text-blue-400' : 'text-rose-400'}
                  style={{
                    textShadow: winner === 'X'
                      ? '0 0 20px rgba(59,130,246,0.8)'
                      : '0 0 20px rgba(244,63,94,0.8)',
                  }}
                >
                  Игрок {winner}
                </span>
              </h2>
            </>
          )}
          <p className="text-white/40 text-sm mt-2">
            {isDraw ? 'Оба игрока сыграли отлично!' : 'Блестящая игра!'}
          </p>
        </div>

        {/* Score */}
        <div
          className="flex items-center justify-center gap-8 py-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="text-center">
            <p className="text-blue-400 font-black text-3xl">{scoreX}</p>
            <p className="text-white/50 text-xs font-semibold mt-1">ИГРОК X</p>
          </div>
          <div className="text-white/20 text-2xl font-thin">:</div>
          <div className="text-center">
            <p className="text-rose-400 font-black text-3xl">{scoreO}</p>
            <p className="text-white/50 text-xs font-semibold mt-1">ИГРОК O</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-white/60 hover:text-white font-medium text-sm transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Посмотреть
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
            }}
          >
            🔄 Новая игра
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WinnerModal;

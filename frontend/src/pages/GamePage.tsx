import React from 'react';
import { Link } from 'react-router-dom';
import GameBoard from '@/components/Game/GameBoard';

const GamePage: React.FC = () => {
  return (
    <div className="min-h-screen pitch-texture flex flex-col">
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-30"
        style={{
          background: 'rgba(10,31,13,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚽</span>
          <div>
            <h1 className="text-white font-black text-lg leading-none">Football</h1>
            <p className="text-gold-400 text-xs font-bold leading-none">TIC TAC TOE</p>
          </div>
        </div>

        <Link
          to="/database"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <span>🗃️</span>
          <span className="hidden sm:inline">Редактор базы</span>
        </Link>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center py-6 sm:py-10">
        <GameBoard />
      </main>

      {/* Footer hint */}
      <footer className="text-center pb-4 text-white/20 text-xs">
        Нажмите на клетку, чтобы назвать футболиста · Заголовки кликабельны для редактирования
      </footer>
    </div>
  );
};

export default GamePage;

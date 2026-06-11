import React from 'react';
import { Link } from 'react-router-dom';
import DatabaseEditor from '@/components/Database/DatabaseEditor';
import { useDatabaseStore } from '@/store/databaseStore';

const DatabasePage: React.FC = () => {
  const { players } = useDatabaseStore();

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
          <span className="text-2xl">🗃️</span>
          <div>
            <h1 className="text-white font-black text-lg leading-none">База игроков</h1>
            <p className="text-gold-400 text-xs font-bold leading-none">{players.length} футболистов</p>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <span>⚽</span>
          <span className="hidden sm:inline">Играть</span>
        </Link>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-10">
        {/* Info block */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            background: 'rgba(251,191,36,0.07)',
            border: '1px solid rgba(251,191,36,0.2)',
          }}
        >
          <p className="text-gold-400 text-xs font-bold mb-1 uppercase tracking-wider">💡 Как работает база</p>
          <p className="text-white/60 text-sm leading-relaxed">
            Каждый игрок имеет набор <strong className="text-white/80">тегов</strong> (например: <code className="text-gold-400 text-xs">ucl, pep, barcelona</code>).
            При проверке ответа система ищет футболиста по имени и проверяет, есть ли у него теги обоих условий клетки.
            Добавьте своих игроков или отредактируйте теги существующих.
          </p>
        </div>

        <DatabaseEditor />
      </main>
    </div>
  );
};

export default DatabasePage;

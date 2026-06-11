import React, { useState } from 'react';
import { useDatabaseStore } from '@/store/databaseStore';
import type { Player } from '@/types';
import { CONDITIONS_CATALOG } from '@/data/conditions';

const DatabaseEditor: React.FC = () => {
  const { players, addPlayer, updatePlayer, deletePlayer, resetToDefault } = useDatabaseStore();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Поиск по имени или тегу..."
          className="flex-1 min-w-[200px] bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-gold-400/50"
        />
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{
            background: showAddForm ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          ➕ Добавить
        </button>
        <button
          onClick={() => {
            if (window.confirm('Сбросить базу к стандартной?')) resetToDefault();
          }}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ↺ Сброс
        </button>
      </div>

      {/* Add player form */}
      {showAddForm && (
        <AddPlayerForm
          onAdd={(player) => { addPlayer(player); setShowAddForm(false); }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Stats */}
      <div className="flex gap-2 text-xs text-white/40">
        <span>Всего игроков: <span className="text-white/70 font-semibold">{players.length}</span></span>
        {search && <span>· Найдено: <span className="text-white/70 font-semibold">{filtered.length}</span></span>}
      </div>

      {/* Players list */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {filtered.map((player) =>
          editingId === player.id ? (
            <EditPlayerForm
              key={player.id}
              player={player}
              onSave={(updates) => { updatePlayer(player.id, updates); setEditingId(null); }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <PlayerRow
              key={player.id}
              player={player}
              onEdit={() => setEditingId(player.id)}
              onDelete={() => {
                if (window.confirm(`Удалить ${player.name}?`)) deletePlayer(player.id);
              }}
            />
          )
        )}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-white/30 text-sm">Ничего не найдено</div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Player row (read mode)
// ─────────────────────────────────────────────
const PlayerRow: React.FC<{
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ player, onEdit, onDelete }) => (
  <div
    className="group flex items-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-white/5"
    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white font-semibold text-sm">{player.name}</span>
        {player.nationality && (
          <span className="text-white/40 text-xs">{player.nationality}</span>
        )}
        {player.position && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
          >
            {player.position}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1 mt-1.5">
        {player.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full font-mono"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <button
        onClick={onEdit}
        className="px-2 py-1 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all"
      >
        ✏️
      </button>
      <button
        onClick={onDelete}
        className="px-2 py-1 rounded-lg text-xs text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
      >
        🗑️
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Edit player form
// ─────────────────────────────────────────────
const EditPlayerForm: React.FC<{
  player: Player;
  onSave: (updates: Partial<Player>) => void;
  onCancel: () => void;
}> = ({ player, onSave, onCancel }) => {
  const [name, setName] = useState(player.name);
  const [aliases, setAliases] = useState(player.aliases.join(', '));
  const [nationality, setNationality] = useState(player.nationality ?? '');
  const [position, setPosition] = useState(player.position ?? '');
  const [tags, setTags] = useState(player.tags.join(', '));

  return (
    <PlayerForm
      initialName={name} setName={setName}
      initialAliases={aliases} setAliases={setAliases}
      initialNationality={nationality} setNationality={setNationality}
      initialPosition={position} setPosition={setPosition}
      initialTags={tags} setTags={setTags}
      onSave={() => onSave({
        name,
        aliases: aliases.split(',').map((s) => s.trim()).filter(Boolean),
        nationality,
        position,
        tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      })}
      onCancel={onCancel}
      mode="edit"
    />
  );
};

// ─────────────────────────────────────────────
// Add player form
// ─────────────────────────────────────────────
const AddPlayerForm: React.FC<{
  onAdd: (player: Player) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');
  const [nationality, setNationality] = useState('');
  const [position, setPosition] = useState('');
  const [tags, setTags] = useState('');

  return (
    <PlayerForm
      initialName={name} setName={setName}
      initialAliases={aliases} setAliases={setAliases}
      initialNationality={nationality} setNationality={setNationality}
      initialPosition={position} setPosition={setPosition}
      initialTags={tags} setTags={setTags}
      onSave={() => {
        if (!name.trim()) return;
        onAdd({
          id: `player-${Date.now()}`,
          name: name.trim(),
          aliases: aliases.split(',').map((s) => s.trim()).filter(Boolean),
          nationality,
          position,
          tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
        });
      }}
      onCancel={onCancel}
      mode="add"
    />
  );
};

// ─────────────────────────────────────────────
// Shared form UI
// ─────────────────────────────────────────────
interface PlayerFormProps {
  initialName: string; setName: (v: string) => void;
  initialAliases: string; setAliases: (v: string) => void;
  initialNationality: string; setNationality: (v: string) => void;
  initialPosition: string; setPosition: (v: string) => void;
  initialTags: string; setTags: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  mode: 'add' | 'edit';
}

const PlayerForm: React.FC<PlayerFormProps> = ({
  initialName, setName,
  initialAliases, setAliases,
  initialNationality, setNationality,
  initialPosition, setPosition,
  initialTags, setTags,
  onSave, onCancel, mode,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass = "w-full bg-white/10 text-white placeholder-white/30 rounded-lg px-3 py-2 text-xs outline-none border border-white/10 focus:border-gold-400/50";
  const labelClass = "text-white/50 text-[10px] uppercase tracking-wider font-semibold block mb-1";

  const handleAutofill = async () => {
    if (!initialName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/players/scrape?name=${encodeURIComponent(initialName.trim())}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Игрок не найден в Викиданных');
        }
        throw new Error('Ошибка при загрузке данных');
      }
      const data = await response.json();
      
      if (data.name) setName(data.name);
      if (data.nationality) setNationality(data.nationality);
      if (data.position) setPosition(data.position);
      
      // Merge aliases
      const existingAliases = initialAliases.split(',').map((s) => s.trim()).filter(Boolean);
      const scrapedAliases = data.aliases || [];
      const mergedAliases = Array.from(new Set([...existingAliases, ...scrapedAliases]));
      setAliases(mergedAliases.join(', '));

      // Merge tags
      const existingTags = initialTags.split(',').map((s) => s.trim()).filter(Boolean);
      const scrapedTags = data.tags || [];
      const mergedTags = Array.from(new Set([...existingTags, ...scrapedTags]));
      setTags(mergedTags.join(', '));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Произошла ошибка при автозаполнении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl p-4 space-y-3 animate-slide-up"
      style={{
        background: 'rgba(251,191,36,0.05)',
        border: '1px solid rgba(251,191,36,0.25)',
      }}
    >
      <p className="text-gold-400 font-bold text-xs uppercase tracking-wider">
        {mode === 'add' ? '➕ Новый игрок' : '✏️ Редактировать'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-white/50 text-[10px] uppercase tracking-wider font-semibold block">Имя *</label>
            <button
              type="button"
              disabled={loading || !initialName.trim()}
              onClick={handleAutofill}
              className="text-[10px] px-2 py-0.5 rounded-md text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(251,191,36,0.2)',
                border: '1px solid rgba(251,191,36,0.4)',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-gold-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Загрузка...</span>
                </>
              ) : (
                <>🌐 Автозаполнение из Wikipedia</>
              )}
            </button>
          </div>
          <input className={inputClass} value={initialName} onChange={(e) => setName(e.target.value)} placeholder="Lionel Messi" />
          {error && <span className="text-[10px] text-red-400 mt-1 block">{error}</span>}
        </div>
        <div>
          <label className={labelClass}>Национальность</label>
          <input className={inputClass} value={initialNationality} onChange={(e) => setNationality(e.target.value)} placeholder="Argentina" />
        </div>
        <div>
          <label className={labelClass}>Позиция</label>
          <input className={inputClass} value={initialPosition} onChange={(e) => setPosition(e.target.value)} placeholder="Forward" />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Псевдонимы (через запятую)</label>
          <input className={inputClass} value={initialAliases} onChange={(e) => setAliases(e.target.value)} placeholder="месси, leo messi, messi" />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Теги (через запятую)</label>
          <input className={inputClass} value={initialTags} onChange={(e) => setTags(e.target.value)} placeholder="ucl, barcelona, pep, ballondor" />
          <div className="flex flex-wrap gap-1 mt-2">
            {CONDITIONS_CATALOG.slice(0, 6).map((c) => (
              <button
                key={c.tag}
                onClick={() => {
                  const arr = initialTags.split(',').map((s) => s.trim()).filter(Boolean);
                  if (!arr.includes(c.tag)) setTags([...arr, c.tag].join(', '));
                }}
                className="text-[10px] px-2 py-0.5 rounded-full text-white/40 hover:text-white/70 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                +{c.tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg text-xs text-white/50 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Отмена
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-all"
          style={{ background: 'rgba(251,191,36,0.35)', border: '1px solid rgba(251,191,36,0.5)' }}
        >
          {mode === 'add' ? 'Добавить' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
};

export default DatabaseEditor;

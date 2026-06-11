import React, { useState } from 'react';
import { useDatabaseStore } from '@/store/databaseStore';
import { useGameStore } from '@/store/gameStore';
import type { Preset } from '@/types';

interface PresetManagerProps {
  onClose: () => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({ onClose }) => {
  const { presets, savePreset, deletePreset } = useDatabaseStore();
  const { rowConditions, colConditions, loadPresetConditions } = useGameStore();
  const [saveMode, setSaveMode] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (!presetName.trim()) return;
    const preset: Preset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      rowConditions: rowConditions.map((c) => ({ ...c })),
      colConditions: colConditions.map((c) => ({ ...c })),
      createdAt: Date.now(),
    };
    savePreset(preset);
    setPresetName('');
    setSaveMode(false);
  };

  const handleLoad = (preset: Preset) => {
    loadPresetConditions(preset.rowConditions, preset.colConditions);
    onClose();
  };

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: '1px solid rgba(251,191,36,0.2)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          📋 <span>Пресеты условий</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSaveMode(!saveMode)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: saveMode ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: saveMode ? '#fbbf24' : 'rgba(255,255,255,0.6)',
            }}
          >
            💾 Сохранить текущий
          </button>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Save mode */}
      {saveMode && (
        <div className="flex gap-2 mb-4 animate-slide-up">
          <input
            autoFocus
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Название пресета..."
            className="flex-1 bg-white/10 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm outline-none border border-white/10 focus:border-gold-400/50"
          />
          <button
            onClick={handleSave}
            disabled={!presetName.trim()}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{ background: 'rgba(251,191,36,0.4)', border: '1px solid rgba(251,191,36,0.6)' }}
          >
            ✓
          </button>
        </div>
      )}

      {/* Presets grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="group rounded-xl p-3 cursor-pointer transition-all hover:scale-102"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-white text-xs font-bold leading-tight">{preset.name}</p>
              <button
                onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }}
                className="text-white/20 hover:text-red-400 transition-colors text-xs opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-0.5 mb-3">
              <p className="text-white/30 text-[10px]">↕ {preset.rowConditions.map((c) => c.label).join(', ')}</p>
              <p className="text-white/30 text-[10px]">↔ {preset.colConditions.map((c) => c.label).join(', ')}</p>
            </div>

            <button
              onClick={() => handleLoad(preset)}
              className="w-full py-1.5 rounded-lg text-[10px] font-bold text-white transition-all"
              style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.3)' }}
            >
              Загрузить
            </button>
          </div>
        ))}

        {presets.length === 0 && (
          <div className="col-span-3 text-center py-6 text-white/30 text-sm">
            Нет сохранённых пресетов
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetManager;

import React, { useState, useRef, useEffect } from 'react';
import { CONDITIONS_CATALOG } from '@/data/conditions';
import type { Condition } from '@/types';

interface GameHeaderProps {
  condition: Condition;
  type: 'row' | 'col';
  onUpdate: (condition: Condition) => void;
  highlighted?: 'x' | 'o';
}

const GameHeader: React.FC<GameHeaderProps> = ({ condition, type, onUpdate, highlighted }) => {
  const hlBg    = highlighted === 'x' ? 'rgba(59,130,246,0.15)' : highlighted === 'o' ? 'rgba(244,63,94,0.15)' : 'rgba(251,191,36,0.1)';
  const hlBorder = highlighted === 'x' ? 'rgba(59,130,246,0.5)' : highlighted === 'o' ? 'rgba(244,63,94,0.5)' : 'rgba(251,191,36,0.25)';

  const [isEditing, setIsEditing] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = CONDITIONS_CATALOG.filter((c) =>
    c.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    c.tag.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsEditing(false);
        setShowDropdown(false);
        setSearchValue('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectCondition = (c: Condition) => {
    onUpdate({ ...c, id: condition.id });
    setIsEditing(false);
    setShowDropdown(false);
    setSearchValue('');
  };

  const applyCustom = () => {
    if (!searchValue.trim()) return;
    const tag = customTag.trim() || searchValue.toLowerCase().replace(/\s+/g, '-');
    onUpdate({ id: condition.id, label: searchValue.trim(), tag });
    setIsEditing(false);
    setShowDropdown(false);
    setSearchValue('');
    setCustomTag('');
  };

  if (type === 'col') {
    return (
      <div ref={ref} className="relative flex flex-col items-center">
        <button
          onClick={() => { setIsEditing(true); setShowDropdown(true); }}
          className="group px-3 py-2 rounded-xl text-center w-full min-w-[100px] transition-all duration-200 hover:scale-105"
          style={{
            background: hlBg,
            border: `1px solid ${hlBorder}`,
          }}
        >
          <span className="text-xs font-bold text-gold-400 block leading-tight">{condition.label}</span>
          <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors mt-0.5 block">✏️ изменить</span>
        </button>

        {isEditing && showDropdown && (
          <EditDropdown
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            customTag={customTag}
            setCustomTag={setCustomTag}
            filtered={filtered}
            onSelect={selectCondition}
            onApplyCustom={applyCustom}
            position="bottom"
          />
        )}
      </div>
    );
  }

  // Row header
  return (
    <div ref={ref} className="relative flex items-center justify-end">
      <button
        onClick={() => { setIsEditing(true); setShowDropdown(true); }}
        className="group px-3 py-2 rounded-xl text-right w-full transition-all duration-200 hover:scale-105"
        style={{
          background: hlBg,
          border: `1px solid ${hlBorder}`,
        }}
      >
        <span className="text-xs font-bold text-gold-400 block leading-tight">{condition.label}</span>
        <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors mt-0.5 block">✏️ изменить</span>
      </button>

      {isEditing && showDropdown && (
        <EditDropdown
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          customTag={customTag}
          setCustomTag={setCustomTag}
          filtered={filtered}
          onSelect={selectCondition}
          onApplyCustom={applyCustom}
          position="right"
        />
      )}
    </div>
  );
};

interface EditDropdownProps {
  searchValue: string;
  setSearchValue: (v: string) => void;
  customTag: string;
  setCustomTag: (v: string) => void;
  filtered: Condition[];
  onSelect: (c: Condition) => void;
  onApplyCustom: () => void;
  position: 'bottom' | 'right';
}

const EditDropdown: React.FC<EditDropdownProps> = ({
  searchValue, setSearchValue, customTag, setCustomTag,
  filtered, onSelect, onApplyCustom, position,
}) => {
  const posClass = position === 'bottom'
    ? 'top-full left-0 right-0 mt-1'
    : 'top-0 left-full ml-1';

  return (
    <div
      className={`absolute ${posClass} z-20 rounded-xl overflow-hidden`}
      style={{
        background: 'linear-gradient(135deg, #1a2f1d, #0d2910)',
        border: '1px solid rgba(251,191,36,0.3)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
        minWidth: '220px',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      <div className="p-2 sticky top-0" style={{ background: '#0d2910' }}>
        <input
          autoFocus
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Поиск условия..."
          className="w-full bg-white/10 text-white placeholder-white/30 rounded-lg px-3 py-2 text-xs outline-none border border-white/10 focus:border-gold-400/50"
        />
      </div>

      <div className="py-1">
        {filtered.slice(0, 10).map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="w-full px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-colors"
          >
            <span className="font-semibold">{c.label}</span>
            <span className="text-white/30 ml-2 text-[10px]">#{c.tag}</span>
          </button>
        ))}

        {searchValue && (
          <>
            <div className="px-3 py-1 text-[10px] text-white/30 uppercase tracking-wider font-semibold border-t border-white/10 mt-1 pt-2">
              Своё условие
            </div>
            <div className="px-2 pb-2 space-y-1">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Тег (напр: my-club)..."
                className="w-full bg-white/10 text-white placeholder-white/30 rounded-lg px-2 py-1.5 text-xs outline-none border border-white/10"
              />
              <button
                onClick={onApplyCustom}
                className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
                style={{ background: 'rgba(251,191,36,0.3)', border: '1px solid rgba(251,191,36,0.5)' }}
              >
                Применить: "{searchValue}"
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameHeader;

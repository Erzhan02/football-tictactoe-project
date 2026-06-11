import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Player, Preset } from '@/types';
import { PLAYERS } from '@/data/players';
import { DEFAULT_PRESETS } from '@/data/conditions';

interface DatabaseStore {
  players: Player[];
  presets: Preset[];

  // Player CRUD
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Preset management
  savePreset: (preset: Preset) => void;
  deletePreset: (id: string) => void;

  // Reset to defaults
  resetToDefault: () => void;
}

export const useDatabaseStore = create<DatabaseStore>()(
  persist(
    immer((set) => ({
      players: PLAYERS,
      presets: DEFAULT_PRESETS,

      addPlayer: (player) => {
        set((state) => {
          state.players.push(player);
        });
      },

      updatePlayer: (id, updates) => {
        set((state) => {
          const idx = state.players.findIndex((p) => p.id === id);
          if (idx !== -1) {
            state.players[idx] = { ...state.players[idx], ...updates };
          }
        });
      },

      deletePlayer: (id) => {
        set((state) => {
          state.players = state.players.filter((p) => p.id !== id);
        });
      },

      savePreset: (preset) => {
        set((state) => {
          const idx = state.presets.findIndex((p) => p.id === preset.id);
          if (idx !== -1) {
            state.presets[idx] = preset;
          } else {
            state.presets.push(preset);
          }
        });
      },

      deletePreset: (id) => {
        set((state) => {
          state.presets = state.presets.filter((p) => p.id !== id);
        });
      },

      resetToDefault: () => {
        set((state) => {
          state.players = PLAYERS;
          state.presets = DEFAULT_PRESETS;
        });
      },
    })),
    {
      name: 'football-ttt-database',
      version: 2,
    }
  )
);

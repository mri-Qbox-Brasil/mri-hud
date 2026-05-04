import { create } from "zustand";
import type { optionalHudIconMetaShapeType } from "../types/types";

export interface DynamicPanel {
  id: string;
  title?: string;
  icon?: string;
  hudIconInfo?: optionalHudIconMetaShapeType;
  value?: string | number;
  isShowing?: boolean;
  left?: number;
  top?: number;
}

type PanelMap = Record<string, DynamicPanel>;

interface DynamicPanelsState {
  panels: PanelMap;
  setPanels: (panels: DynamicPanel[]) => void;
  addPanel: (panel: DynamicPanel) => void;
  removePanel: (id: string) => void;
  updatePanel: (id: string, patch: Partial<DynamicPanel>) => void;
  clear: () => void;
}

export const useDynamicPanelsStore = create<DynamicPanelsState>((set) => ({
  panels: {},

  setPanels: (panels) => {
    const map: PanelMap = {};
    for (const p of panels) map[p.id] = p;
    set({ panels: map });
  },

  addPanel: (panel) =>
    set((state) => ({ panels: { ...state.panels, [panel.id]: panel } })),

  removePanel: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.panels;
      return { panels: rest };
    }),

  updatePanel: (id, patch) =>
    set((state) => {
      if (!state.panels[id]) return state;
      return {
        panels: { ...state.panels, [id]: { ...state.panels[id], ...patch } },
      };
    }),

  clear: () => set({ panels: {} }),
}));

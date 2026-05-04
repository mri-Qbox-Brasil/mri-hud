import { create } from "zustand";
import type { layoutIconKind } from "../types/types";
import { layoutStoreLocalStorageName } from "../types/types";

export type PlayerStatusLayoutType = {
  layout: layoutIconKind;
  iconBetweenSpacing: number;
  yAxisSpacing: number;
  xAxisSpacing: number;
};

interface LayoutState extends PlayerStatusLayoutType {
  resetLayout: () => void;
  receiveUIUpdateMessage: (data: PlayerStatusLayoutType) => void;
  updateLayout: (layout: layoutIconKind) => void;
  updateLayoutSettings: (
    layout: layoutIconKind,
    xAxisSpacing: number,
    yAxisSpacing: number,
    iconBetweenSpacing: number
  ) => void;
}

function loadFromStorage(): Partial<PlayerStatusLayoutType> {
  try {
    const raw = localStorage.getItem(layoutStoreLocalStorageName);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getDefaults(): PlayerStatusLayoutType {
  const s = loadFromStorage();
  return {
    layout: s.layout ?? "standard",
    iconBetweenSpacing: s.iconBetweenSpacing ?? 10,
    xAxisSpacing: s.xAxisSpacing ?? 20,
    yAxisSpacing: s.yAxisSpacing ?? 2,
  };
}

export const useLayoutStore = create<LayoutState>((set) => ({
  ...getDefaults(),

  resetLayout: () => {
    localStorage.removeItem(layoutStoreLocalStorageName);
    set(getDefaults());
  },

  receiveUIUpdateMessage: (data) =>
    set({
      layout: data.layout,
      iconBetweenSpacing: data.iconBetweenSpacing,
      xAxisSpacing: data.xAxisSpacing,
      yAxisSpacing: data.yAxisSpacing,
    }),

  updateLayout: (layout) => set({ layout }),

  updateLayoutSettings: (layout, xAxisSpacing, yAxisSpacing, iconBetweenSpacing) =>
    set({ layout, xAxisSpacing, yAxisSpacing, iconBetweenSpacing }),
}));

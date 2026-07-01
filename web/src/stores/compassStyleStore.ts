import { create } from "zustand";

// Estilo visual da bussola standalone (a pe / veiculo classico). 'classic' = a
// fita branca legada; 'digital' = a fita tech (mesma do cluster digital de
// veiculo). Escolha por-player, persistida em localStorage (como o resto do
// menu do HUD).
export type CompassType = "classic" | "digital";
export const COMPASS_TYPES: readonly CompassType[] = ["classic", "digital"];

const LS_KEY = "mri-hud:compassType";

function load(): CompassType {
  try {
    return localStorage.getItem(LS_KEY) === "digital" ? "digital" : "classic";
  } catch {
    return "classic";
  }
}

interface CompassStyleState {
  type: CompassType;
  setType: (t: CompassType) => void;
}

export const useCompassStyleStore = create<CompassStyleState>((set) => ({
  type: load(),
  setType: (t) => {
    try {
      localStorage.setItem(LS_KEY, t);
    } catch {
      /* ignore */
    }
    set({ type: t });
  },
}));

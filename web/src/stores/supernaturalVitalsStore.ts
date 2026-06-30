import { create } from "zustand";
import { capAmountToHundred } from "../types/types";

/**
 * Vitais extras do skin 'sobrenatural' que NAO existem no HUD base
 * (folego, sanidade, mana). Sao "stats custom": valores 0-100 alimentados
 * por outros resources via NUI:
 *
 *   SendNUIMessage({ action = 'vitals', topic = 'supernatural',
 *                    folego = 80, sanidade = 60, mana = 45 })
 *
 * Campos ausentes na mensagem mantem o valor atual. Default 100 ate um
 * script setar. Mapeados como vida/fome/sede no skin vem do HUD base.
 * Ver [[hud-theme-skin-architecture]].
 */
interface SupernaturalVitalsState {
  folego: number;
  sanidade: number;
  mana: number;
  receiveMessage: (data: { folego?: number; sanidade?: number; mana?: number }) => void;
}

export const useSupernaturalVitalsStore = create<SupernaturalVitalsState>((set) => ({
  folego: 100,
  sanidade: 100,
  mana: 100,

  receiveMessage: (data) =>
    set((s) => ({
      folego: data.folego != null ? capAmountToHundred(data.folego) : s.folego,
      sanidade: data.sanidade != null ? capAmountToHundred(data.sanidade) : s.sanidade,
      mana: data.mana != null ? capAmountToHundred(data.mana) : s.mana,
    })),
}));

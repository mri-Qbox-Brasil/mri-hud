import { create } from "zustand";
import { playerSkinLocalStorageName } from "../types/types";

/**
 * Skin da HUD do player. Decide o visual geral da HUD de status do jogador:
 *   - 'classic'      = HUD atual (MetaLayout + MoneyHud + ServerLogo + bussola)
 *   - 'sobrenatural' = reskin ocultista/Diablo II (orbes de vitais, paineis de pedra)
 *
 * NAO afeta a HUD de veiculo (essa tem o proprio tema: [[vehicleThemeStore]]).
 *
 * O skin sobrenatural tem 3 eixos de customizacao (do handoff):
 *   - palette: 6 paletas de cor
 *   - vitalStyle: orbes | aneis | barras | cristal
 *   - layout: unido | separado | classico
 *
 * Camadas (igual ao tema de veiculo):
 *   1. Config.* (shared/config.lua) -> default global via `hudconfig` (setConfig)
 *   2. Override local do admin (menu) -> localStorage, vence o default.
 */
export type PlayerSkin = "classic" | "sobrenatural";
export type SkinPalette = "pergaminho" | "sangue" | "eterno" | "esmeralda" | "geada" | "cinzas";
export type VitalStyle = "orbes" | "aneis" | "barras" | "cristal" | "calice";
export type SkinLayout = "unido" | "separado" | "classico";

export const SKIN_PALETTES: readonly SkinPalette[] = ["pergaminho", "sangue", "eterno", "esmeralda", "geada", "cinzas"];
export const VITAL_STYLES: readonly VitalStyle[] = ["orbes", "aneis", "barras", "cristal", "calice"];
export const SKIN_LAYOUTS: readonly SkinLayout[] = ["unido", "separado", "classico"];

interface PlayerSkinState {
  skin: PlayerSkin;
  palette: SkinPalette;
  vitalStyle: VitalStyle;
  layout: SkinLayout;
  /** Remove os paineis de pedra das orbes + dinheiro (servidor mantem). */
  frameless: boolean;
  overridden: boolean;
  setConfig: (cfg: { skin?: string; palette?: string; style?: string; layout?: string; frameless?: boolean }) => void;
  setSkin: (skin: PlayerSkin) => void;
  setPalette: (palette: SkinPalette) => void;
  setVitalStyle: (style: VitalStyle) => void;
  setLayout: (layout: SkinLayout) => void;
  setFrameless: (frameless: boolean) => void;
}

const isSkin = (v: unknown): v is PlayerSkin => v === "classic" || v === "sobrenatural";
const isPalette = (v: unknown): v is SkinPalette => (SKIN_PALETTES as readonly string[]).includes(v as string);
const isStyle = (v: unknown): v is VitalStyle => (VITAL_STYLES as readonly string[]).includes(v as string);
const isLayout = (v: unknown): v is SkinLayout => (SKIN_LAYOUTS as readonly string[]).includes(v as string);

function loadStored() {
  try {
    const raw = localStorage.getItem(playerSkinLocalStorageName);
    if (!raw) return {};
    const p = JSON.parse(raw);
    return {
      skin: isSkin(p.skin) ? p.skin : undefined,
      palette: isPalette(p.palette) ? p.palette : undefined,
      vitalStyle: isStyle(p.vitalStyle) ? p.vitalStyle : undefined,
      layout: isLayout(p.layout) ? p.layout : undefined,
      frameless: p.frameless === true,
      overridden: p.overridden === true,
    };
  } catch {
    return {};
  }
}

function persist(s: Pick<PlayerSkinState, "skin" | "palette" | "vitalStyle" | "layout" | "frameless" | "overridden">) {
  localStorage.setItem(
    playerSkinLocalStorageName,
    JSON.stringify({ skin: s.skin, palette: s.palette, vitalStyle: s.vitalStyle, layout: s.layout, frameless: s.frameless, overridden: s.overridden })
  );
}

function notifyClient(get: () => PlayerSkinState) {
  import("../utils/eventHandler").then(({ fetchNui }) =>
    fetchNui("setPlayerSkin", {
      skin: get().skin,
      palette: get().palette,
      style: get().vitalStyle,
      layout: get().layout,
      frameless: get().frameless,
    })
  );
}

const stored = loadStored();

export const usePlayerSkinStore = create<PlayerSkinState>((set, get) => ({
  skin: stored.skin ?? "classic",
  palette: stored.palette ?? "pergaminho",
  vitalStyle: stored.vitalStyle ?? "orbes",
  layout: stored.layout ?? "classico",
  frameless: stored.frameless ?? false,
  overridden: stored.overridden ?? false,

  setConfig: (cfg) => {
    if (get().overridden) return;
    const next: Partial<PlayerSkinState> = {};
    if (isSkin(cfg.skin)) next.skin = cfg.skin;
    if (isPalette(cfg.palette)) next.palette = cfg.palette;
    if (isStyle(cfg.style)) next.vitalStyle = cfg.style;
    if (isLayout(cfg.layout)) next.layout = cfg.layout;
    if (typeof cfg.frameless === "boolean") next.frameless = cfg.frameless;
    if (Object.keys(next).length) set(next);
  },

  setSkin: (skin) => { set({ skin, overridden: true }); persist(get()); notifyClient(get); },
  setPalette: (palette) => { set({ palette, overridden: true }); persist(get()); notifyClient(get); },
  setVitalStyle: (vitalStyle) => { set({ vitalStyle, overridden: true }); persist(get()); notifyClient(get); },
  setLayout: (layout) => { set({ layout, overridden: true }); persist(get()); notifyClient(get); },
  setFrameless: (frameless) => { set({ frameless, overridden: true }); persist(get()); notifyClient(get); },
}));

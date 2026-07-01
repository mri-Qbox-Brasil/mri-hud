import { create } from "zustand";
import { playerSkinLocalStorageName } from "../types/types";

/**
 * Skin da HUD do player. Decide o visual geral da HUD de status do jogador:
 *   - 'classic'      = HUD atual (MetaLayout + MoneyHud + ServerLogo + bussola)
 *   - 'sobrenatural' = reskin ocultista/Diablo II (orbes de vitais, paineis de pedra)
 *
 * NAO afeta a HUD de veiculo (essa tem o proprio tema: [[vehicleThemeStore]]).
 *
 * O skin sobrenatural tem eixos de customizacao (do handoff):
 *   - palette: 6 paletas de cor + 'custom' (cores livres via customPalette)
 *   - vitalStyle: orbes | aneis | barras | cristal | calice
 *   - layout: unido | separado | classico
 *   - vitalOverrides: por vital, sobrescreve cor/glifo/rotulo/visibilidade
 *     (equivalente ao designer de icones do skin classico)
 *
 * Camadas (igual ao tema de veiculo):
 *   1. Config.* (shared/config.lua) -> default global via `hudconfig` (setConfig)
 *   2. Override local do admin (menu) -> localStorage, vence o default.
 */
export type PlayerSkin = "classic" | "sobrenatural";
export type SkinPalette = "pergaminho" | "sangue" | "eterno" | "esmeralda" | "geada" | "cinzas" | "custom";
export type VitalStyle = "orbes" | "aneis" | "barras" | "cristal" | "calice";
export type SkinLayout = "unido" | "separado" | "classico";

/** Chaves dos vitais do skin (espelha ORDER/VitalValues do kit SupernaturalHud). */
export type SkinVitalKey = "vida" | "folego" | "fome" | "sede" | "sanidade" | "mana";
export const SKIN_VITAL_KEYS: readonly SkinVitalKey[] = ["vida", "folego", "fome", "sede", "sanidade", "mana"];

/** Override de um vital. Campos ausentes/vazios = usa o default do kit. */
export interface VitalOverride {
  color?: string;
  glyph?: string;
  label?: string;
  hidden?: boolean;
}
export type VitalOverrides = Partial<Record<SkinVitalKey, VitalOverride>>;

/** Cores livres da paleta 'custom' (o kit deriva glow/stone2/amb a partir daqui). */
export interface CustomPalette {
  accent: string;
  deep: string;
  stone: string;
}
export const DEFAULT_CUSTOM_PALETTE: CustomPalette = { accent: "#d9b25e", deep: "#6e4f1c", stone: "#181208" };

export const SKIN_PALETTES: readonly SkinPalette[] = ["pergaminho", "sangue", "eterno", "esmeralda", "geada", "cinzas", "custom"];
export const VITAL_STYLES: readonly VitalStyle[] = ["orbes", "aneis", "barras", "cristal", "calice"];
export const SKIN_LAYOUTS: readonly SkinLayout[] = ["unido", "separado", "classico"];

interface PlayerSkinState {
  skin: PlayerSkin;
  palette: SkinPalette;
  vitalStyle: VitalStyle;
  layout: SkinLayout;
  /** Remove os paineis de pedra das orbes + dinheiro (servidor mantem). */
  frameless: boolean;
  /** Sobrescritas por vital (cor/glifo/rotulo/visibilidade). */
  vitalOverrides: VitalOverrides;
  /** Cores da paleta 'custom' (so aplicam quando palette === 'custom'). */
  customPalette: CustomPalette;
  overridden: boolean;
  /** Config global (primitivos skin/palette/style/layout/frameless). `force` =
   *  absoluta (sobrescreve e limpa o override local). vitalOverrides/customPalette
   *  NAO vem por aqui: sao locais por cliente. */
  setConfig: (cfg: {
    skin?: string;
    palette?: string;
    style?: string;
    layout?: string;
    frameless?: boolean;
  }, force?: boolean) => void;
  setSkin: (skin: PlayerSkin) => void;
  setPalette: (palette: SkinPalette) => void;
  setVitalStyle: (style: VitalStyle) => void;
  setLayout: (layout: SkinLayout) => void;
  setFrameless: (frameless: boolean) => void;
  /** Mescla um patch no override de um vital (campos undefined preservam). */
  setVitalOverride: (k: SkinVitalKey, patch: VitalOverride) => void;
  /** Limpa o override de um vital (volta pro default do kit). */
  resetVitalOverride: (k: SkinVitalKey) => void;
  /** Limpa todos os overrides + volta a paleta custom pro default. */
  resetVitalOverrides: () => void;
  setCustomPaletteColor: (field: keyof CustomPalette, hex: string) => void;
}

const isSkin = (v: unknown): v is PlayerSkin => v === "classic" || v === "sobrenatural";
const isPalette = (v: unknown): v is SkinPalette => (SKIN_PALETTES as readonly string[]).includes(v as string);
const isStyle = (v: unknown): v is VitalStyle => (VITAL_STYLES as readonly string[]).includes(v as string);
const isLayout = (v: unknown): v is SkinLayout => (SKIN_LAYOUTS as readonly string[]).includes(v as string);
const isVitalKey = (v: unknown): v is SkinVitalKey => (SKIN_VITAL_KEYS as readonly string[]).includes(v as string);

// Sanitiza um dict de overrides (de localStorage ou do config): so chaves de
// vital validas, so campos conhecidos, tipos corretos.
function cleanOverrides(raw: unknown): VitalOverrides {
  const out: VitalOverrides = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [k, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!isVitalKey(k) || !val || typeof val !== "object") continue;
    const o = val as Record<string, unknown>;
    const clean: VitalOverride = {};
    if (typeof o.color === "string") clean.color = o.color;
    if (typeof o.glyph === "string") clean.glyph = o.glyph;
    if (typeof o.label === "string") clean.label = o.label;
    if (typeof o.hidden === "boolean") clean.hidden = o.hidden;
    if (Object.keys(clean).length) out[k] = clean;
  }
  return out;
}

function cleanCustomPalette(raw: unknown): CustomPalette {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    accent: typeof o.accent === "string" ? o.accent : DEFAULT_CUSTOM_PALETTE.accent,
    deep: typeof o.deep === "string" ? o.deep : DEFAULT_CUSTOM_PALETTE.deep,
    stone: typeof o.stone === "string" ? o.stone : DEFAULT_CUSTOM_PALETTE.stone,
  };
}

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
      vitalOverrides: cleanOverrides(p.vitalOverrides),
      customPalette: cleanCustomPalette(p.customPalette),
      overridden: p.overridden === true,
    };
  } catch {
    return {};
  }
}

function persist(
  s: Pick<PlayerSkinState, "skin" | "palette" | "vitalStyle" | "layout" | "frameless" | "vitalOverrides" | "customPalette" | "overridden">
) {
  localStorage.setItem(
    playerSkinLocalStorageName,
    JSON.stringify({
      skin: s.skin,
      palette: s.palette,
      vitalStyle: s.vitalStyle,
      layout: s.layout,
      frameless: s.frameless,
      vitalOverrides: s.vitalOverrides,
      customPalette: s.customPalette,
      overridden: s.overridden,
    })
  );
}

// Espelha os primitivos do skin no Config local (Lua) deste cliente — preview
// local do admin no F10. vitalOverrides/customPalette NAO vao (sao locais da NUI).
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
  vitalOverrides: stored.vitalOverrides ?? {},
  customPalette: stored.customPalette ?? { ...DEFAULT_CUSTOM_PALETTE },
  overridden: stored.overridden ?? false,

  setConfig: (cfg, force) => {
    // Sem force: primitivos globais so aplicam se nao ha override local. Com
    // force (config admin absoluta): aplica sempre e limpa o override. A
    // customizacao por vital / paleta custom sao LOCAIS -> nunca tocadas aqui.
    if (get().overridden && !force) return;
    const next: Partial<PlayerSkinState> = {};
    if (isSkin(cfg.skin)) next.skin = cfg.skin;
    if (isPalette(cfg.palette)) next.palette = cfg.palette;
    if (isStyle(cfg.style)) next.vitalStyle = cfg.style;
    if (isLayout(cfg.layout)) next.layout = cfg.layout;
    if (typeof cfg.frameless === "boolean") next.frameless = cfg.frameless;
    if (force) next.overridden = false;
    if (Object.keys(next).length) {
      set(next);
      if (force) persist(get());
    }
  },

  setSkin: (skin) => { set({ skin, overridden: true }); persist(get()); notifyClient(get); },
  setPalette: (palette) => { set({ palette, overridden: true }); persist(get()); notifyClient(get); },
  setVitalStyle: (vitalStyle) => { set({ vitalStyle, overridden: true }); persist(get()); notifyClient(get); },
  setLayout: (layout) => { set({ layout, overridden: true }); persist(get()); notifyClient(get); },
  setFrameless: (frameless) => { set({ frameless, overridden: true }); persist(get()); notifyClient(get); },

  // vitalOverrides e customPalette sao LOCAIS por cliente (localStorage). Nao
  // marcam `overridden` (esse flag e so pros primitivos globais do skin) e nao
  // notificam o Lua — sao consumidos direto pela NUI (SupernaturalSkin).
  setVitalOverride: (k, patch) => {
    const prev = get().vitalOverrides[k] ?? {};
    const merged: VitalOverride = { ...prev, ...patch };
    // Campos vazios ('' / undefined) somem do override -> voltam pro default.
    (Object.keys(merged) as (keyof VitalOverride)[]).forEach((f) => {
      const val = merged[f];
      if (val === undefined || val === "") delete merged[f];
    });
    set({ vitalOverrides: { ...get().vitalOverrides, [k]: merged } });
    persist(get());
  },

  resetVitalOverride: (k) => {
    const rest = { ...get().vitalOverrides };
    delete rest[k];
    set({ vitalOverrides: rest });
    persist(get());
  },

  resetVitalOverrides: () => {
    set({ vitalOverrides: {}, customPalette: { ...DEFAULT_CUSTOM_PALETTE } });
    persist(get());
  },

  setCustomPaletteColor: (field, hex) => {
    set({ customPalette: { ...get().customPalette, [field]: hex } });
    persist(get());
  },
}));

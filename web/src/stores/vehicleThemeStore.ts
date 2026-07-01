import { create } from "zustand";
import { vehicleThemeLocalStorageName } from "../types/types";

/**
 * Tema da HUD de veiculo. Decide qual visual o cluster de veiculo usa:
 *   - 'classic' = velocimetro analogico atual (gauges do ui-kit)
 *   - 'digital' = cluster digital/tech ciano do design handoff
 *
 * Fonte de verdade em camadas:
 *   1. Config.VehicleHudTheme/Variant (shared/config.lua) -> default global,
 *      entregue via `hudconfig` no init (setConfig).
 *   2. Override local do player (admin escolhe no menu) -> persistido em
 *      localStorage; vence o default do config quando presente...
 *   3. ...EXCETO quando a config vem marcada como `force` (absoluta): o admin
 *      salvou no painel Qadmin, ou e um usuario comum recebendo o global no
 *      load. Nesse caso o global sobrescreve E limpa o override local. Assim a
 *      config admin sempre vence a customizacao do usuario comum.
 *
 * O override do menu eh gated por admin no AppearancePanel ("admin escolher").
 */
export type VehicleTheme = "classic" | "digital";
export type SpeedoVariant = "ring" | "arc" | "linear";

export const SPEEDO_VARIANTS: readonly SpeedoVariant[] = ["ring", "arc", "linear"];

interface VehicleThemeState {
  theme: VehicleTheme;
  variant: SpeedoVariant;
  /** True quando o player sobrescreveu o default via menu (persiste localmente). */
  overridden: boolean;
  /** Config global vinda do Config.VehicleHud* (hudconfig). `force` = absoluta
   *  (sobrescreve e limpa o override local). */
  setConfig: (cfg: { theme?: string; variant?: string }, force?: boolean) => void;
  /** Troca feita pelo admin no menu -> vira override local. */
  setTheme: (theme: VehicleTheme) => void;
  setVariant: (variant: SpeedoVariant) => void;
}

function isTheme(v: unknown): v is VehicleTheme {
  return v === "classic" || v === "digital";
}
function isVariant(v: unknown): v is SpeedoVariant {
  return v === "ring" || v === "arc" || v === "linear";
}

function loadStored(): { theme?: VehicleTheme; variant?: SpeedoVariant; overridden?: boolean } {
  try {
    const raw = localStorage.getItem(vehicleThemeLocalStorageName);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      theme: isTheme(parsed.theme) ? parsed.theme : undefined,
      variant: isVariant(parsed.variant) ? parsed.variant : undefined,
      overridden: parsed.overridden === true,
    };
  } catch {
    return {};
  }
}

function persist(state: Pick<VehicleThemeState, "theme" | "variant" | "overridden">) {
  localStorage.setItem(
    vehicleThemeLocalStorageName,
    JSON.stringify({ theme: state.theme, variant: state.variant, overridden: state.overridden })
  );
}

const stored = loadStored();

export const useVehicleThemeStore = create<VehicleThemeState>((set, get) => ({
  theme: stored.theme ?? "classic",
  variant: stored.variant ?? "ring",
  overridden: stored.overridden ?? false,

  setConfig: (cfg, force) => {
    // Sem force: default do config so se aplica se o player nao tem override
    // local. Com force (config admin absoluta): aplica sempre e limpa o override.
    if (get().overridden && !force) return;
    const next: Partial<VehicleThemeState> = {};
    if (isTheme(cfg.theme)) next.theme = cfg.theme;
    if (isVariant(cfg.variant)) next.variant = cfg.variant;
    if (force) next.overridden = false;
    if (Object.keys(next).length) {
      set(next);
      if (force) persist(get());
    }
  },

  setTheme: (theme) => {
    set({ theme, overridden: true });
    persist(get());
    import("../utils/eventHandler").then(({ fetchNui }) =>
      fetchNui("setVehicleTheme", { theme: get().theme, variant: get().variant })
    );
  },

  setVariant: (variant) => {
    set({ variant, overridden: true });
    persist(get());
    import("../utils/eventHandler").then(({ fetchNui }) =>
      fetchNui("setVehicleTheme", { theme: get().theme, variant: get().variant })
    );
  },
}));

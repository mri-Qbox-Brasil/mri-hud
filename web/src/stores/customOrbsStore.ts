import { create } from "zustand";

/**
 * Orbes customizadas — mesma ideia dos custom gauges/panels, mas renderizadas
 * como orbes do skin sobrenatural (cor/glifo/label livres). Outros resources
 * injetam via NUI:
 *
 *   SendNUIMessage({ action = 'orb', topic = 'set',
 *     orb = { id='mana', label='Mana', glyph='ᛜ', color='#a87fe0', value=80 } })
 *   SendNUIMessage({ action = 'orb', topic = 'value', id='mana', value=55 })
 *   SendNUIMessage({ action = 'orb', topic = 'remove', id='mana' })
 *
 * Posicao/visibilidade/escala saem de graca via DraggableHudElement (id
 * `customOrb_<id>`) no modo de posicionamento (F10). `configs` guarda o visual;
 * `runtime` guarda so o valor (atualiza sem recriar o config).
 */
export interface OrbConfig {
  id: string;
  label: string;
  glyph: string;
  color: string;   // hex — alimenta o liquido e o brilho da orbe
  maxValue: number;
  size: number;
  lowAt: number;   // pulsa (alerta) quando value <= lowAt; 0 = nunca
  // Ancora default (px). O usuario reposiciona no F10 (override no positioningStore).
  left: number;
  bottom: number;
}

interface OrbRuntime {
  value: number;
}

interface CustomOrbsState {
  configs: Record<string, OrbConfig>;
  runtime: Record<string, OrbRuntime>;
  setOrb: (cfg: Partial<OrbConfig> & { id: string; value?: number }) => void;
  updateValue: (id: string, value: number) => void;
  removeOrb: (id: string) => void;
  setAll: (orbs: Array<Partial<OrbConfig> & { id: string; value?: number }>) => void;
  clear: () => void;
}

const defaults: Omit<OrbConfig, "id"> = {
  label: "",
  glyph: "◆",
  color: "#a87fe0",
  maxValue: 100,
  size: 58,
  lowAt: 0,
  left: 320,
  bottom: 300,
};

function mergeConfig(id: string, incoming: Partial<OrbConfig>, existing?: OrbConfig): OrbConfig {
  return { ...defaults, ...(existing ?? {}), ...incoming, id };
}

export const useCustomOrbsStore = create<CustomOrbsState>((set) => ({
  configs: {},
  runtime: {},

  setOrb({ id, value, ...rest }) {
    set((state) => ({
      configs: { ...state.configs, [id]: mergeConfig(id, rest, state.configs[id]) },
      runtime: { ...state.runtime, [id]: { value: value ?? state.runtime[id]?.value ?? 0 } },
    }));
  },

  updateValue(id, value) {
    set((state) => ({ runtime: { ...state.runtime, [id]: { value } } }));
  },

  removeOrb(id) {
    set((state) => {
      const { [id]: _c, ...configs } = state.configs;
      const { [id]: _r, ...runtime } = state.runtime;
      return { configs, runtime };
    });
  },

  // Substitui todas as orbes — as ausentes na lista somem. Preserva o config
  // existente das que continuam (merge com os dados do Lua).
  setAll(orbs) {
    set((state) => {
      const configs: Record<string, OrbConfig> = {};
      const runtime: Record<string, OrbRuntime> = {};
      for (const { id, value, ...rest } of orbs) {
        configs[id] = mergeConfig(id, rest, state.configs[id]);
        runtime[id] = { value: value ?? state.runtime[id]?.value ?? 0 };
      }
      return { configs, runtime };
    });
  },

  clear() {
    set({ configs: {}, runtime: {} });
  },
}));

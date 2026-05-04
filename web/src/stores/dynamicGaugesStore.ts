import { create } from "zustand";

export interface GaugeConfig {
  id: string;
  arcLength: number;
  rotation: number;
  size: number;
  ringSize: number;
  color: string;
  outlineColor: string;
  outlineOpacity: number;
  iconName?: string;
  label?: string;
  // Lua-provided default position — user override lives in positioningStore
  x: number;
  y: number;
  maxValue: number;
  showValue: boolean;
  // Classic arc gauge (default) or realistic analog gauge
  style?: "arc" | "analog";
  // Analog gauge specific
  minValue?: number;
  majorTickInterval?: number;
  minorTickCount?: number;
  unit?: string;
  needleStyle?: "needle" | "digital" | "arc";
}

interface GaugeRuntime {
  value: number;
}

interface DynamicGaugesState {
  configs: Record<string, GaugeConfig>;
  runtime: Record<string, GaugeRuntime>;
  setGauge: (cfg: Partial<GaugeConfig> & { id: string; value?: number }) => void;
  updateValue: (id: string, value: number) => void;
  removeGauge: (id: string) => void;
  setAll: (gauges: Array<Partial<GaugeConfig> & { id: string; value?: number }>) => void;
  clear: () => void;
}

const defaults: Omit<GaugeConfig, "id"> = {
  arcLength: 75,
  rotation: 225,
  size: 60,
  ringSize: 4,
  color: "#3b82f6",
  outlineColor: "#3b82f6",
  outlineOpacity: 0.4,
  x: 50,
  y: 80,
  maxValue: 100,
  showValue: true,
};

function mergeConfig(id: string, incoming: Partial<GaugeConfig>, existing?: GaugeConfig): GaugeConfig {
  return { ...defaults, ...(existing ?? {}), ...incoming, id };
}

export const useDynamicGaugesStore = create<DynamicGaugesState>((set, get) => ({
  configs: {},
  runtime: {},

  setGauge({ id, value, ...rest }) {
    set((state) => {
      const cfg = mergeConfig(id, rest, state.configs[id]);
      const runtime = {
        ...state.runtime,
        [id]: { value: value ?? state.runtime[id]?.value ?? 0 },
      };
      return { configs: { ...state.configs, [id]: cfg }, runtime };
    });
  },

  updateValue(id, value) {
    set((state) => ({
      runtime: { ...state.runtime, [id]: { value } },
    }));
  },

  removeGauge(id) {
    set((state) => {
      const { [id]: _c, ...configs } = state.configs;
      const { [id]: _r, ...runtime } = state.runtime;
      return { configs, runtime };
    });
  },

  // Replaces all gauges — gauges absent from the list are removed.
  // Existing config is preserved for gauges that remain (merged with Lua data).
  setAll(gauges) {
    set((state) => {
      const configs: Record<string, GaugeConfig> = {};
      const runtime: Record<string, GaugeRuntime> = {};
      for (const { id, value, ...rest } of gauges) {
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

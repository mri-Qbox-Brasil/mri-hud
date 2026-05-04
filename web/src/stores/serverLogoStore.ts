import { create } from "zustand";

export interface LogoConfig {
  enabled: boolean;
  src: string;
  width: number;
  x: number;
  y: number;
}

interface ServerLogoState {
  config: LogoConfig | null;
  setConfig: (cfg: LogoConfig) => void;
}

export const useServerLogoStore = create<ServerLogoState>((set) => ({
  config: null,
  setConfig: (cfg) => set({ config: cfg }),
}));

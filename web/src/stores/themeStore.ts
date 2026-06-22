import { create } from "zustand";

/**
 * Theme store da suite MRI. Guarda o accent color (hex) compartilhado entre
 * todos os scripts MRI (controlado pela convar `mri:color` do server).
 *
 * Fluxo:
 *   1. Lua envia `updateUISettings` com `accentColor` no payload (init)
 *   2. eventHandler.ts chama `themeStore.setAccentColor(hex)`
 *   3. Componentes consomem via `useThemeStore((s) => s.accentColor)` e
 *      passam pro `useAccentColor()` que aplica nas CSS vars shadcn
 *
 * Convar mri:color muda em runtime → server broadcasta `setAccentColor`
 * action → store atualiza → todos os componentes reativos refletem.
 */
interface ThemeState {
  accentColor: string;
  setAccentColor: (hex: string) => void;
}

const DEFAULT_ACCENT = "#00E699";

export const useThemeStore = create<ThemeState>((set) => ({
  accentColor: DEFAULT_ACCENT,
  setAccentColor: (hex) => {
    // Aceita so hex 6 ou 8 chars. Invalido = mantem o atual.
    if (!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) return;
    set({ accentColor: hex });
  },
}));

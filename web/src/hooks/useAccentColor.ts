import { useEffect } from "react";

/** Converte hex (#RRGGBB / #RRGGBBAA) pro formato HSL do shadcn ("h s% l%").
 *  Alpha e ignorado. Retorna null se o hex for invalido. */
function hexToHsl(hex: string): string | null {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i);
  if (!m) return null;
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Aplica `accentColor` (hex da convar `mri:color`) nas CSS vars `--primary` e
 * `--ring` em HSL.
 *
 * --primary alimenta `bg-primary`, `border-primary`, `text-primary` e shadows.
 * --ring alimenta o focus state dos inputs (`focus:border-ring` no MriInput
 * do @mriqbox/ui-kit).
 *
 * Uso tipico no componente raiz:
 *   const accent = useThemeStore((s) => s.accentColor)
 *   useAccentColor(accent)
 */
export function useAccentColor(accentColor: string): void {
  useEffect(() => {
    const hsl = hexToHsl(accentColor);
    if (!hsl) return;
    const root = document.documentElement.style;
    root.setProperty("--primary", hsl);
    root.setProperty("--ring", hsl);
  }, [accentColor]);
}

/**
 * Aplica `backgroundColor` (hex da convar `mri:backgroundColor`) na CSS var
 * `--background` (fundo do menu/paineis). String vazia/invalida = no-op, entao
 * o default do tema e mantido ate a convar chegar.
 */
export function useBackgroundColor(backgroundColor: string): void {
  useEffect(() => {
    const hsl = hexToHsl(backgroundColor);
    if (!hsl) return;
    document.documentElement.style.setProperty("--background", hsl);
  }, [backgroundColor]);
}

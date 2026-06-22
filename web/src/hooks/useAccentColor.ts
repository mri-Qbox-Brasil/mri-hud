import { useEffect } from "react";

/**
 * Aplica `accentColor` (hex #RRGGBB ou #RRGGBBAA da convar `mri:color`)
 * nas CSS vars `--primary` e `--ring` em formato HSL.
 *
 * --primary alimenta `bg-primary`, `border-primary`, `text-primary` e shadows.
 * --ring alimenta o focus state dos inputs (`focus:border-ring` no MriInput
 * do @mriqbox/ui-kit). Sem o --ring, o foco do input continuaria com a cor
 * default do tema mesmo se o accent fosse outra cor. Alpha do hex e ignorado
 * pro theming HSL.
 *
 * Uso tipico no componente raiz:
 *   const accent = useThemeStore((s) => s.accentColor)
 *   useAccentColor(accent)
 */
export function useAccentColor(accentColor: string): void {
  useEffect(() => {
    const m = accentColor.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i);
    if (!m) return;
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
    const hsl = `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    const root = document.documentElement.style;
    root.setProperty("--primary", hsl);
    root.setProperty("--ring", hsl);
  }, [accentColor]);
}

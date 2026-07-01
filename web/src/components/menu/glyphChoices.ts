// Paleta curada de glifos esotéricos (Unicode BMP) pro seletor de vitais do skin
// sobrenatural. Só caracteres de texto — renderizam nas fontes serif/sistema do
// CEF (as runas Elder Futhark são os defaults do kit). Agrupados só pra exibição.
export interface GlyphGroup {
  label: string;
  glyphs: string[];
}

export const GLYPH_GROUPS: GlyphGroup[] = [
  {
    label: "Runas",
    glyphs: ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛖ", "ᛗ", "ᛚ", "ᛜ", "ᛞ", "ᛟ"],
  },
  {
    label: "Planetas",
    glyphs: ["☉", "☽", "☾", "☿", "♀", "♁", "♂", "♃", "♄", "♅", "♆", "♇"],
  },
  {
    label: "Zodíaco",
    glyphs: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
  },
  {
    label: "Sagrado",
    glyphs: ["✝", "✞", "✟", "✠", "☦", "☨", "☩", "☥", "⚱", "⚰", "☠", "⚕"],
  },
  {
    label: "Selos & Estrelas",
    glyphs: ["★", "☆", "✦", "✧", "✩", "✪", "✫", "✬", "✭", "✮", "✯", "❂", "✵", "❉", "❋", "⚝"],
  },
  {
    label: "Arcano",
    glyphs: ["Ω", "Δ", "Ψ", "Φ", "Θ", "Σ", "Λ", "Ξ", "Π", "Γ", "∞", "⚚"],
  },
];

// Lista achatada (útil pra validação/testes).
export const GLYPH_CHOICES: string[] = GLYPH_GROUPS.flatMap((g) => g.glyphs);

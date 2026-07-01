/**
 * Kit de pecas do skin 'sobrenatural' (tema ocultista / Diablo II do handoff).
 *
 * Exporta as pecas (orbes/aneis/barras + paineis de servidor/dinheiro/relogio/
 * voz) e helpers. A composicao + posicionamento (DraggableHudElement) fica no
 * container SupernaturalSkin, pra cada peca ser movel/escondivel separadamente.
 *
 * Requer Cinzel / Cinzel Decorative / JetBrains Mono (carregadas no index.css).
 */
import type React from "react";
import { useEffect, useRef, useState } from "react";

/* ----------------------------------------------------------------- tipos */
export type SkinKey = "pergaminho" | "sangue" | "eterno" | "esmeralda" | "geada" | "cinzas";
export type StyleKey = "orbes" | "aneis" | "barras" | "cristal" | "calice";
export type LayoutKey = "unido" | "separado" | "classico";

export interface VitalValues {
  vida: number;
  folego: number;
  fome: number;
  sede: number;
  sanidade: number;
  mana: number;
}

/* --------------------------------------------------------------- paletas */
export interface Skin { accent: string; deep: string; glow: string; stone: string; stone2: string; amb: string; }
export const SKINS: Record<SkinKey, Skin> = {
  pergaminho: { accent: "#d9b25e", deep: "#6e4f1c", glow: "rgba(217,178,94,.5)",  stone: "#181208", stone2: "#22190c", amb: "rgba(200,150,60,.12)" },
  sangue:     { accent: "#c75b4a", deep: "#5e1f18", glow: "rgba(199,91,74,.5)",   stone: "#1a1010", stone2: "#241413", amb: "rgba(180,60,40,.10)" },
  eterno:     { accent: "#a87fe0", deep: "#3e2767", glow: "rgba(168,127,224,.5)", stone: "#150f1d", stone2: "#1f1630", amb: "rgba(120,70,200,.12)" },
  esmeralda:  { accent: "#5fb87a", deep: "#1f5236", glow: "rgba(95,184,122,.5)",  stone: "#0e1611", stone2: "#142019", amb: "rgba(50,160,100,.12)" },
  geada:      { accent: "#6fc2d6", deep: "#1f4e5e", glow: "rgba(111,194,214,.5)", stone: "#0d141a", stone2: "#131e26", amb: "rgba(90,180,210,.12)" },
  cinzas:     { accent: "#bcae98", deep: "#5a5040", glow: "rgba(188,174,152,.45)",stone: "#15130f", stone2: "#1f1c16", amb: "rgba(180,170,150,.10)" },
};

/* matiz oklch por atributo */
const HUE: Record<keyof VitalValues, number> = { vida: 25, folego: 135, fome: 60, sede: 230, sanidade: 185, mana: 295 };
const GLYPH: Record<keyof VitalValues, string> = { vida: "ᚺ", folego: "ᛋ", fome: "ᚠ", sede: "ᛚ", sanidade: "ᛟ", mana: "ᛜ" };
const LABELS: Record<keyof VitalValues, string> = { vida: "Vida", folego: "Fôlego", fome: "Fome", sede: "Sede", sanidade: "Sanidade", mana: "Mana" };
export const LABEL = LABELS;
export const ORDER: (keyof VitalValues)[] = ["vida", "folego", "fome", "sede", "sanidade", "mana"];

// Converte OKLCH -> sRGB. O CEF (Chromium) do FiveM e antigo e NAO suporta a
// funcao css `oklch()` (so Chrome 111+), entao gradientes/fundos que usavam
// oklch renderizavam invalidos in-game (orbes apareciam vazias). Convertendo
// pra rgb()/rgba() em JS o visual fica identico e compativel com o CEF.
function oklchToRgb(L: number, C: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  const lr =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const g = (x: number) => {
    const v = Math.max(0, Math.min(1, x));
    return Math.round((v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255);
  };
  return [g(lr), g(lg), g(lb)];
}
const okc = (L: number, C: number, h: number, a?: number) => {
  const [r, g, b] = oklchToRgb(L, C, h);
  return a === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
};
const vc  = (h: number) => okc(0.62, 0.15, h);
const vca = (h: number, a: number) => okc(0.62, 0.15, h, a);

// Orbes custom (API 'orb', injetadas por outros resources) recebem cor em hex;
// convertemos pra rgba() por alpha — CEF-safe, do mesmo jeito que `vca` faz pros
// vitais nativos a partir do hue.
export function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h || "888888", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/* ------------------------------------------------------- keyframes (uma vez) */
export const KEYFRAMES = `
@keyframes hud-glowpulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes hud-voiceripple{0%{transform:scale(.8);opacity:.7}100%{transform:scale(2.1);opacity:0}}
@keyframes hud-lowpulse{0%,100%{box-shadow:0 0 0 0 rgba(220,40,40,0),inset 0 0 28px rgba(0,0,0,.7)}50%{box-shadow:0 0 26px 4px rgba(220,40,40,.6),inset 0 0 28px rgba(0,0,0,.7)}}
@keyframes hud-meniscus{0%,100%{transform:translateY(0);opacity:.85}50%{transform:translateY(-1.5px);opacity:1}}
@keyframes hud-sheen{0%{transform:translate(-60%,-60%) rotate(28deg);opacity:0}18%{opacity:.5}40%{transform:translate(60%,60%) rotate(28deg);opacity:0}100%{transform:translate(60%,60%) rotate(28deg);opacity:0}}
@keyframes hud-chalicebubble{0%{transform:translateY(110%) scale(.3);opacity:0}20%{opacity:.8}90%{opacity:.4}100%{transform:translateY(-10%) scale(1.1);opacity:0}}
@keyframes hud-vsighalo{0%,100%{opacity:.35;transform:scale(.94)}50%{opacity:.85;transform:scale(1.02)}}
`;

/* --------------------------------------------------------- paineis de pedra */
export function panelBase(c: Skin): React.CSSProperties {
  const stoneBg = `radial-gradient(120% 130% at 30% 0%, rgba(255,225,160,.05), transparent 55%), linear-gradient(160deg, ${c.stone2}, ${c.stone}), repeating-linear-gradient(115deg, rgba(255,255,255,.02) 0 2px, transparent 2px 6px), repeating-linear-gradient(28deg, rgba(0,0,0,.14) 0 3px, transparent 3px 9px)`;
  return { background: stoneBg, border: "1px solid rgba(180,140,70,.4)", boxShadow: "0 10px 34px rgba(0,0,0,.6), inset 0 0 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(180,140,70,.1), inset 0 1px 0 rgba(255,220,150,.1)", borderRadius: 5, position: "relative" };
}
function Corners({ c }: { c: Skin }) {
  const corner = (pos: React.CSSProperties): React.CSSProperties => ({ position: "absolute", width: 7, height: 7, transform: "rotate(45deg)", background: c.accent, boxShadow: `0 0 6px ${c.glow}`, ...pos });
  return (<>
    <span style={corner({ top: 5, left: 5 })} /><span style={corner({ top: 5, right: 5 })} />
    <span style={corner({ bottom: 5, left: 5 })} /><span style={corner({ bottom: 5, right: 5 })} />
  </>);
}
const labelMono: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" };

/* ============================================================ vitais */
function Orb({ k, value, size, low }: { k: keyof VitalValues; value: number; size: number; low: boolean }) {
  const hue = HUE[k], col = vc(hue), pct = Math.round(value), big = size > 70;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative rounded-full"
        style={{
          width: size, height: size,
          background: "radial-gradient(circle at 36% 28%, #f7e3ad, #c79a44 42%, #8a6526 64%, #4a3514 82%, #2a1d0c)",
          boxShadow: `0 5px 16px rgba(0,0,0,.7), 0 0 22px ${vca(hue, .3)}, inset 0 2px 5px rgba(255,238,190,.65), inset 0 -5px 9px rgba(0,0,0,.6), inset 0 0 0 1px rgba(40,28,12,.7)`,
          animation: low ? "hud-lowpulse 1.1s infinite" : undefined,
        }}
      >
        <div
          className="absolute rounded-full overflow-hidden"
          style={{ inset: 3, background: "radial-gradient(circle at 40% 35%, #1c150c, #0a0703)", boxShadow: "inset 0 0 18px rgba(0,0,0,.9), inset 0 0 0 2px rgba(0,0,0,.65), inset 0 0 0 3px rgba(180,140,70,.22)" }}
        >
          <div
            className="absolute left-0 right-0 bottom-0 transition-[height] duration-500"
            style={{ height: `${pct}%`, background: `linear-gradient(180deg, ${vca(hue, .95)}, ${vca(hue, .8)} 40%, ${vca(hue, .45)})`, boxShadow: `inset 0 6px 10px ${vca(hue, .7)}, 0 -2px 8px ${vca(hue, .55)}` }}
          >
            <div className="absolute left-0 right-0" style={{ top: -1, height: big ? 5 : 3, background: `linear-gradient(180deg, ${okc(0.85, 0.12, hue, 0.95)}, transparent)`, boxShadow: `0 0 7px ${vca(hue, .9)}`, animation: "hud-meniscus 3.4s ease-in-out infinite" }} />
          </div>
          <div className="absolute rounded-full pointer-events-none" style={{ top: "9%", left: "15%", width: "44%", height: "32%", background: "radial-gradient(circle, rgba(255,255,255,.42), transparent 70%)" }} />
          <div className="absolute rounded-full pointer-events-none z-[3]" style={{ top: "8%", left: "14%", width: "46%", height: "38%", background: "radial-gradient(circle, rgba(255,255,255,.55), transparent 72%)", animation: "hud-sheen 6.5s ease-in-out infinite" }} />
        </div>
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-px">
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: big ? 19 : 15, lineHeight: 1, color: "#f3e9d4", textShadow: `0 0 8px ${col}, 0 1px 2px #000` }}>{GLYPH[k]}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: big ? 12 : 10, color: "#f3e9d4", textShadow: "0 1px 2px #000" }}>{pct}</span>
        </div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 1.5, color: "#9c8458", textTransform: "uppercase" }}>{LABELS[k]}</span>
    </div>
  );
}

/** Orbe custom (API 'orb'): mesmo visual da orbe nativa, mas cor/glifo/label
 * livres (vindos de outro resource). Usa as keyframes do kit (hud-meniscus/
 * hud-sheen/hud-lowpulse) — o container CustomOrbs injeta KEYFRAMES. */
export function CustomOrb({
  value, color, glyph, label, size = 58, low = false,
}: { value: number; color: string; glyph: string; label: string; size?: number; low?: boolean }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const big = size > 70;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative rounded-full"
        style={{
          width: size, height: size,
          background: "radial-gradient(circle at 36% 28%, #f7e3ad, #c79a44 42%, #8a6526 64%, #4a3514 82%, #2a1d0c)",
          boxShadow: `0 5px 16px rgba(0,0,0,.7), 0 0 22px ${rgba(color, .3)}, inset 0 2px 5px rgba(255,238,190,.65), inset 0 -5px 9px rgba(0,0,0,.6), inset 0 0 0 1px rgba(40,28,12,.7)`,
          animation: low ? "hud-lowpulse 1.1s infinite" : undefined,
        }}
      >
        <div
          className="absolute rounded-full overflow-hidden"
          style={{ inset: 3, background: "radial-gradient(circle at 40% 35%, #1c150c, #0a0703)", boxShadow: "inset 0 0 18px rgba(0,0,0,.9), inset 0 0 0 2px rgba(0,0,0,.65), inset 0 0 0 3px rgba(180,140,70,.22)" }}
        >
          <div
            className="absolute left-0 right-0 bottom-0 transition-[height] duration-500"
            style={{ height: `${pct}%`, background: `linear-gradient(180deg, ${rgba(color, .95)}, ${rgba(color, .8)} 40%, ${rgba(color, .45)})`, boxShadow: `inset 0 6px 10px ${rgba(color, .7)}, 0 -2px 8px ${rgba(color, .55)}` }}
          >
            <div className="absolute left-0 right-0" style={{ top: -1, height: big ? 5 : 3, background: `linear-gradient(180deg, ${rgba(color, .95)}, transparent)`, boxShadow: `0 0 7px ${rgba(color, .9)}`, animation: "hud-meniscus 3.4s ease-in-out infinite" }} />
          </div>
          <div className="absolute rounded-full pointer-events-none" style={{ top: "9%", left: "15%", width: "44%", height: "32%", background: "radial-gradient(circle, rgba(255,255,255,.42), transparent 70%)" }} />
          <div className="absolute rounded-full pointer-events-none z-[3]" style={{ top: "8%", left: "14%", width: "46%", height: "38%", background: "radial-gradient(circle, rgba(255,255,255,.55), transparent 72%)", animation: "hud-sheen 6.5s ease-in-out infinite" }} />
        </div>
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-px">
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: big ? 19 : 15, lineHeight: 1, color: "#f3e9d4", textShadow: `0 0 8px ${color}, 0 1px 2px #000` }}>{glyph}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: big ? 12 : 10, color: "#f3e9d4", textShadow: "0 1px 2px #000" }}>{pct}</span>
        </div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 1.5, color: "#9c8458", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

// Estilo 'calice' (handoff sobrenatural_plus): cálice de vidro com moldura de
// pedra, líquido subindo por altura, bolhas fervendo e reflexo. Cor por vital
// da paleta (vc/vca, já em rgb — CEF-safe).
const CHALICE_BUBBLES = [
  { left: "16%", delay: "0s",   dur: "3s",   s: 6 },
  { left: "44%", delay: "1.2s", dur: "4.5s", s: 4 },
  { left: "68%", delay: "0.6s", dur: "3.5s", s: 9 },
  { left: "30%", delay: "2.5s", dur: "2.8s", s: 4 },
  { left: "84%", delay: "1.7s", dur: "4s",   s: 6 },
];
function Chalice({ k, value, size, low }: { k: keyof VitalValues; value: number; size: number; low: boolean }) {
  const hue = HUE[k], col = vc(hue), pct = Math.round(value), big = size > 70;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: size, height: size,
          border: `${big ? 4 : 3}px solid #2a2320`,
          background: "rgba(10,7,3,.92)",
          boxShadow: "0 4px 14px rgba(0,0,0,.6), inset 0 0 0 1px rgba(180,140,70,.15)",
          animation: low ? "hud-lowpulse 1.6s ease-in-out infinite" : undefined,
        }}
      >
        {/* globo de vidro (clip) */}
        <div className="absolute rounded-full overflow-hidden" style={{ inset: 3 }}>
          {/* nível do líquido */}
          <div
            className="absolute left-0 right-0 bottom-0 transition-[height] duration-500"
            style={{
              height: `${pct}%`,
              background: `linear-gradient(180deg, ${vca(hue, .95)}, ${vca(hue, .7)} 45%, ${vca(hue, .45)})`,
              boxShadow: `inset 0 6px 10px ${vca(hue, .6)}, 0 0 15px ${vca(hue, .55)}`,
            }}
          >
            {CHALICE_BUBBLES.map((b, i) => (
              <span
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  bottom: 0, left: b.left, width: b.s, height: b.s,
                  background: "rgba(255,255,255,.28)",
                  animation: `hud-chalicebubble ${b.dur} ${b.delay} infinite linear`,
                }}
              />
            ))}
          </div>
          {/* reflexo do vidro */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{ top: "10%", left: "16%", width: "44%", height: "26%", background: "radial-gradient(circle, rgba(255,255,255,.2), transparent 70%)", transform: "rotate(-15deg)" }}
          />
        </div>
        {/* glifo + valor + label */}
        <div className="relative z-10 flex flex-col items-center justify-center" style={{ textShadow: "0 2px 4px rgba(0,0,0,.9)" }}>
          <span style={{ fontSize: big ? 16 : 12, lineHeight: 1, color: col, textShadow: `0 0 8px ${vca(hue, .6)}` }}>{GLYPH[k]}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: big ? 13 : 10, color: "#f3e9d4" }}>{pct}</span>
        </div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 1, color: "#9c8458", textTransform: "uppercase" }}>{LABELS[k]}</span>
    </div>
  );
}

function Ring({ k, value }: { k: keyof VitalValues; value: number }) {
  const hue = HUE[k], col = vc(hue), pct = Math.round(value), deg = pct * 3.6;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative rounded-full" style={{ width: 62, height: 62 }}>
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${col} ${deg}deg, rgba(255,255,255,.06) ${deg}deg 360deg)`, filter: `drop-shadow(0 0 6px ${vca(hue, .4)})` }} />
        <div className="absolute rounded-full flex flex-col items-center justify-center gap-px" style={{ inset: 6, background: "#0c0805" }}>
          <span style={{ fontSize: 17, lineHeight: 1, color: col, textShadow: `0 0 8px ${vca(hue, .6)}` }}>{GLYPH[k]}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#e7dac0" }}>{pct}</span>
        </div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 1, color: "#9c8458", textTransform: "uppercase" }}>{LABELS[k]}</span>
    </div>
  );
}

function Bar({ k, value, cristal }: { k: keyof VitalValues; value: number; cristal: boolean }) {
  const hue = HUE[k], col = vc(hue), pct = Math.round(value);
  return (
    <div className="flex items-center gap-[11px]" style={{ width: 320 }}>
      <span className="text-center" style={{ fontSize: 16, width: 20, color: col, textShadow: `0 0 8px ${vca(hue, .6)}` }}>{GLYPH[k]}</span>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 1, color: "#9c8458", textTransform: "uppercase", width: 54 }}>{LABELS[k]}</span>
      <div className="relative flex-1 overflow-hidden" style={{ height: 11, background: "rgba(255,255,255,.06)", clipPath: cristal ? "polygon(0 0,100% 0,94% 100%,0 100%)" : undefined, borderRadius: cristal ? 0 : 3 }}>
        <div className="absolute inset-0 transition-[width] duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${vca(hue, .6)}, ${col})`, boxShadow: `0 0 10px ${vca(hue, .55)}`, clipPath: cristal ? "polygon(0 0,100% 0,90% 100%,0 100%)" : undefined }} />
      </div>
      <span className="text-right" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#e7dac0", width: 26 }}>{pct}</span>
    </div>
  );
}

function Vital({ k, value, style }: { k: keyof VitalValues; value: number; style: StyleKey }) {
  if (style === "orbes") {
    const big = k === "vida" || k === "mana";
    return <Orb k={k} value={value} size={big ? 96 : 58} low={k === "vida" && Math.round(value) < 30} />;
  }
  if (style === "calice") {
    const big = k === "vida" || k === "mana";
    return <Chalice k={k} value={value} size={big ? 96 : 58} low={k === "vida" && Math.round(value) < 30} />;
  }
  if (style === "aneis") return <Ring k={k} value={value} />;
  return <Bar k={k} value={value} cristal={style === "cristal"} />;
}

/** Uma orbe/anel/barra, opcionalmente dentro do painel de pedra. */
export function VitalPanel({ k, value, style, c, framed }: { k: keyof VitalValues; value: number; style: StyleKey; c: Skin; framed: boolean }) {
  const inner = <Vital k={k} value={value} style={style} />;
  if (!framed) return inner;
  return <div style={{ ...panelBase(c), padding: 11, display: "inline-flex" }}>{inner}</div>;
}

/* ============================================================ paineis */
export function ServerPanel({ server, c }: { server: { name: string; tagline: string; sigil: string; players: string; ping: number }; c: Skin }) {
  return (
    <div style={{ ...panelBase(c), padding: "14px 18px", minWidth: 240, borderLeft: `3px solid ${c.accent}` }}>
      <Corners c={c} />
      <div className="flex items-center gap-[11px]">
        <span style={{ fontFamily: "'Cinzel Decorative',serif", fontWeight: 900, fontSize: 12, lineHeight: 1, padding: "7px 8px", border: `1px solid ${c.accent}77`, borderRadius: 3, color: c.accent, textShadow: `0 0 10px ${c.glow}`, background: "rgba(0,0,0,.3)" }}>{server.sigil}</span>
        <div>
          <div style={{ fontFamily: "'Cinzel Decorative',serif", fontWeight: 900, fontSize: 20, letterSpacing: 1, lineHeight: 1, color: c.accent, textShadow: `0 0 14px ${c.glow}` }}>{server.name}</div>
          <div style={{ ...labelMono, fontSize: 10, letterSpacing: 2, color: "#9c8458", marginTop: 4 }}>{server.tagline}</div>
        </div>
      </div>
      {(server.players || server.ping > 0) && (
        <div className="flex items-center gap-4 mt-3 pt-[11px]" style={{ borderTop: "1px solid rgba(180,140,70,.18)" }}>
          {server.players && (
            <div className="flex items-center gap-[7px]">
              <span className="rounded-full" style={{ width: 8, height: 8, background: "#7bbf63", boxShadow: "0 0 8px #7bbf63", animation: "hud-glowpulse 2.4s infinite" }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#d8c9a6" }}>{server.players} <span style={{ color: "#857036" }}>online</span></span>
            </div>
          )}
          {server.ping > 0 && (
            <div className="flex items-center gap-[7px]">
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#857036" }}>ping</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#d8c9a6" }}>{server.ping}ms</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MoneyPanel({ money, c, framed }: { money: { cash: string; bank: string }; c: Skin; framed: boolean }) {
  const block = (label: string, val: string, accentVal: boolean) => {
    const valueEl = (
      <>
        <div style={{ ...labelMono, fontSize: 9, letterSpacing: 2, color: "#857036" }}>{label}</div>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 22, marginTop: 2, color: accentVal ? c.accent : "#efe3c6", textShadow: accentVal ? `0 0 14px ${c.glow}` : undefined }}>
          {val} <span style={{ fontSize: 13, color: accentVal ? undefined : "#9c8458", opacity: accentVal ? 0.7 : 1 }}>au</span>
        </div>
      </>
    );
    return framed
      ? <div style={{ ...panelBase(c), padding: "10px 16px", minWidth: 138, textAlign: "right", borderTop: `2px solid ${c.accent}` }}>{valueEl}</div>
      : <div style={{ textAlign: "right", minWidth: 110, textShadow: "0 1px 3px #000" }}>{valueEl}</div>;
  };
  return <div className="flex gap-2.5">{block("moeda viva", money.cash, false)}{block("cofre etéreo", money.bank, true)}</div>;
}

export function ClockPanel({ clock, c }: { clock: { time: string; date: string }; c: Skin }) {
  return (
    <div style={{ ...panelBase(c), display: "flex", alignItems: "center", gap: 12, padding: "8px 18px" }}>
      <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 17, color: c.accent, textShadow: `0 0 14px ${c.glow}` }}>☾</span>
      <div className="text-right">
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 20, letterSpacing: 2, lineHeight: 1 }}>{clock.time}</div>
        <div style={{ ...labelMono, fontSize: 9, letterSpacing: 2, color: "#9c8458", marginTop: 3 }}>{clock.date}</div>
      </div>
    </div>
  );
}

export function VoicePanel({ voice, c, framed }: { voice: { talking: boolean; range: string }; c: Skin; framed: boolean }) {
  const body = <VoiceSigil talking={voice.talking} accent={c.accent} glow={c.glow} />;
  const inner = framed
    ? <div style={{ ...panelBase(c), display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 12px 10px" }}>{body}</div>
    : body;
  // Escala base 0.85 — o sigilo vinha grande demais no padrão. O resize do
  // modo posicionamento (ScaledHudContent) multiplica sobre isto.
  return <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>{inner}</div>;
}

// VoiceSigil (handoff sobrenatural_plus): disco forjado com o mic num soquete
// central, equalizador radial de runas, halo arcano pulsante ao falar e medidor
// de alcance. Nosso HUD só distingue falando/mudo, então o alcance fica em
// 'normal'. CEF-safe (accent hex, radial-gradient, box-shadow, 1 keyframe).
const VSIG_BARS = 18;
function VoiceSigil({ talking, accent, glow }: { talking: boolean; accent: string; glow: string }) {
  const [phase, setPhase] = useState(0);
  const lastRef = useRef(0);
  useEffect(() => {
    if (!talking) return;
    let raf = 0;
    const loop = (t: number) => {
      if (t - lastRef.current > 120) { setPhase((p) => p + 1); lastRef.current = t; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [talking]);

  const label = talking ? "NORMAL" : "MUDO";
  const micGlyph = talking ? "ᛘ" : "⊘";
  const rIdx = talking ? 1 : -1; // 'normal' acende os pontos 0 e 1

  return (
    <div className="flex flex-col items-center" style={{ gap: 8, fontFamily: "'Cinzel',serif" }}>
      {/* disco forjado */}
      <div
        className="relative rounded-full"
        style={{
          width: 70, height: 70,
          background: "radial-gradient(circle at 36% 28%, #f7e3ad, #c79a44 42%, #8a6526 64%, #4a3514 82%, #2a1d0c)",
          boxShadow: `0 5px 16px rgba(0,0,0,.7), 0 0 20px ${talking ? glow : "rgba(0,0,0,0)"}, inset 0 2px 5px rgba(255,238,190,.6), inset 0 -5px 9px rgba(0,0,0,.6), inset 0 0 0 1px rgba(40,28,12,.7)`,
          transition: "box-shadow .3s",
        }}
      >
        {/* poço interno + equalizador radial */}
        <div
          className="absolute rounded-full overflow-hidden flex items-center justify-center"
          style={{ inset: 3, background: "radial-gradient(circle at 40% 35%, #14100a, #070502)", boxShadow: "inset 0 0 16px rgba(0,0,0,.9), inset 0 0 0 2px rgba(0,0,0,.65), inset 0 0 0 3px rgba(180,140,70,.22)" }}
        >
          {talking && (
            <span
              className="absolute rounded-full"
              style={{ inset: 12, background: `radial-gradient(circle, ${accent}44, transparent 68%)`, boxShadow: `inset 0 0 18px ${glow}, 0 0 16px ${glow}`, border: `1px solid ${accent}66`, animation: "hud-vsighalo 1.5s ease-in-out infinite" }}
            />
          )}
          {Array.from({ length: VSIG_BARS }).map((_, i) => {
            const deg = i * (360 / VSIG_BARS);
            const amp = talking ? 0.45 + 0.55 * Math.abs(Math.sin(phase * 0.8 + i * 0.7)) : 0.18;
            const len = 6 + amp * 13;
            return (
              <span
                key={i}
                style={{
                  position: "absolute", left: "50%", top: "50%", width: 2.5, height: len, borderRadius: 2,
                  transformOrigin: "center top", transform: `rotate(${deg}deg) translate(-50%, 21px)`,
                  background: `linear-gradient(180deg, ${accent}, ${accent}00)`,
                  opacity: talking ? 0.5 + amp * 0.5 : 0.32,
                  boxShadow: talking ? `0 0 5px ${glow}` : "none",
                  transition: "height .12s, opacity .12s",
                }}
              />
            );
          })}
          {/* soquete central com o mic */}
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{ zIndex: 2, width: 30, height: 30, background: talking ? `radial-gradient(circle, ${accent}55, rgba(0,0,0,.4))` : "rgba(0,0,0,.35)", boxShadow: talking ? `inset 0 0 10px ${glow}, 0 0 8px ${glow}` : "inset 0 0 8px rgba(0,0,0,.7)", border: `1px solid ${talking ? accent + "aa" : "rgba(180,140,70,.28)"}`, transition: "all .2s" }}
          >
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 17, lineHeight: 1, color: talking ? "#f3e9d4" : "#6f5c34", textShadow: talking ? `0 0 8px ${accent}, 0 1px 2px #000` : "none", transition: "color .2s" }}>{micGlyph}</span>
          </div>
        </div>
      </div>
      {/* medidor de alcance */}
      <div className="flex items-center" style={{ gap: 6, height: 10 }}>
        {[0, 1, 2].map((i) => {
          const on = i <= rIdx;
          return (
            <span
              key={i}
              className="rounded-full"
              style={{ width: i === 1 ? 9 : 6, height: i === 1 ? 9 : 6, border: `1px solid ${on ? accent : "rgba(180,140,70,.3)"}`, background: on ? accent : "transparent", boxShadow: on ? `0 0 7px ${glow}` : "none", transition: "all .2s" }}
            />
          );
        })}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: talking ? accent : "#857036", textShadow: talking ? `0 0 8px ${glow}` : "none", transition: "color .2s" }}>{label}</span>
    </div>
  );
}

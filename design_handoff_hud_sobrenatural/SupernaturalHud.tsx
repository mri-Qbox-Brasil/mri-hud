/**
 * SupernaturalHud — HUD de FiveM com tema ocultista / Diablo II.
 *
 * Drop-in para React + Tailwind. Sem dependências além de React.
 * Os valores contínuos (altura do líquido, grau dos anéis) ficam em `style`
 * inline de propósito — Tailwind não cobre valor contínuo por frame.
 *
 * Uso:
 *   <SupernaturalHud
 *      vitals={{ vida: 72, folego: 64, fome: 48, sede: 81, sanidade: 34, mana: 55 }}
 *      money={{ cash: '12.480', bank: '84.300' }}
 *      server={{ name: 'Véu Sombrio', tagline: 'occult roleplay', sigil: 'VS', players: '87/128', ping: 42 }}
 *      clock={{ time: '03:33', date: 'III · Lua Negra' }}
 *      voice={{ talking: true, range: 'NORMAL' }}
 *      minimap={{ street: 'Beco do Véu', district: '▲ Distrito IV' }}
 *      skin="pergaminho"   // pergaminho | sangue | eterno | esmeralda | geada | cinzas
 *      style="orbes"       // orbes | aneis | barras | cristal
 *      layout="classico"   // unido | separado | classico
 *   />
 *
 * IMPORTANTE: requer as fontes Cinzel / Cinzel Decorative / JetBrains Mono
 * (veja o README — adicione o <link> do Google Fonts ou instale via @fontsource).
 */
import React from "react";

/* ----------------------------------------------------------------- tipos */
export type SkinKey = "pergaminho" | "sangue" | "eterno" | "esmeralda" | "geada" | "cinzas";
export type StyleKey = "orbes" | "aneis" | "barras" | "cristal";
export type LayoutKey = "unido" | "separado" | "classico";

export interface VitalValues {
  vida: number;     // 0–100
  folego: number;
  fome: number;
  sede: number;
  sanidade: number;
  mana: number;
}

export interface SupernaturalHudProps {
  vitals: VitalValues;
  money?: { cash: string; bank: string };
  server?: { name: string; tagline: string; sigil: string; players: string; ping: number };
  clock?: { time: string; date: string };
  voice?: { talking: boolean; range: string };
  minimap?: { street: string; district: string };
  skin?: SkinKey;
  style?: StyleKey;
  layout?: LayoutKey;
  className?: string;
}

/* --------------------------------------------------------------- paletas */
interface Skin { accent: string; deep: string; glow: string; stone: string; stone2: string; amb: string; }
const SKINS: Record<SkinKey, Skin> = {
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
const LABEL: Record<keyof VitalValues, string> = { vida: "Vida", folego: "Fôlego", fome: "Fome", sede: "Sede", sanidade: "Sanidade", mana: "Mana" };

const vc  = (h: number) => `oklch(0.62 0.15 ${h})`;
const vca = (h: number, a: number) => `oklch(0.62 0.15 ${h} / ${a})`;

/* ------------------------------------------------------- keyframes (uma vez) */
const KEYFRAMES = `
@keyframes hud-glowpulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes hud-voiceripple{0%{transform:scale(.8);opacity:.7}100%{transform:scale(2.1);opacity:0}}
@keyframes hud-ember{0%{transform:translateY(0) scale(1);opacity:0}12%{opacity:.7}90%{opacity:.3}100%{transform:translateY(-180px) scale(.4);opacity:0}}
@keyframes hud-lowpulse{0%,100%{box-shadow:0 0 0 0 rgba(220,40,40,0),inset 0 0 28px rgba(0,0,0,.7)}50%{box-shadow:0 0 26px 4px rgba(220,40,40,.6),inset 0 0 28px rgba(0,0,0,.7)}}
@keyframes hud-meniscus{0%,100%{transform:translateY(0);opacity:.85}50%{transform:translateY(-1.5px);opacity:1}}
@keyframes hud-sheen{0%{transform:translate(-60%,-60%) rotate(28deg);opacity:0}18%{opacity:.5}40%{transform:translate(60%,60%) rotate(28deg);opacity:0}100%{transform:translate(60%,60%) rotate(28deg);opacity:0}}
`;

/* ============================================================ ORB / sub-peças */
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
            <div
              className="absolute left-0 right-0"
              style={{ top: -1, height: big ? 5 : 3, background: `linear-gradient(180deg, oklch(0.85 0.12 ${hue} / .95), transparent)`, boxShadow: `0 0 7px ${vca(hue, .9)}`, animation: "hud-meniscus 3.4s ease-in-out infinite" }}
            />
          </div>
          <div className="absolute rounded-full pointer-events-none" style={{ top: "9%", left: "15%", width: "44%", height: "32%", background: "radial-gradient(circle, rgba(255,255,255,.42), transparent 70%)" }} />
          <div className="absolute rounded-full pointer-events-none z-[3]" style={{ top: "8%", left: "14%", width: "46%", height: "38%", background: "radial-gradient(circle, rgba(255,255,255,.55), transparent 72%)", animation: "hud-sheen 6.5s ease-in-out infinite" }} />
        </div>
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-px">
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: big ? 19 : 15, lineHeight: 1, color: "#f3e9d4", textShadow: `0 0 8px ${col}, 0 1px 2px #000` }}>{GLYPH[k]}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: big ? 12 : 10, color: "#f3e9d4", textShadow: "0 1px 2px #000" }}>{pct}</span>
        </div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 1.5, color: "#9c8458", textTransform: "uppercase" }}>{LABEL[k]}</span>
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
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 1, color: "#9c8458", textTransform: "uppercase" }}>{LABEL[k]}</span>
    </div>
  );
}

function Bar({ k, value, cristal }: { k: keyof VitalValues; value: number; cristal: boolean }) {
  const hue = HUE[k], col = vc(hue), pct = Math.round(value);
  return (
    <div className="flex items-center gap-[11px]">
      <span className="text-center" style={{ fontSize: 16, width: 20, color: col, textShadow: `0 0 8px ${vca(hue, .6)}` }}>{GLYPH[k]}</span>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 1, color: "#9c8458", textTransform: "uppercase", width: 54 }}>{LABEL[k]}</span>
      <div className="relative flex-1 overflow-hidden" style={{ height: 11, background: "rgba(255,255,255,.06)", clipPath: cristal ? "polygon(0 0,100% 0,94% 100%,0 100%)" : undefined, borderRadius: cristal ? 0 : 3 }}>
        <div className="absolute inset-0 transition-[width] duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${vca(hue, .6)}, ${col})`, boxShadow: `0 0 10px ${vca(hue, .55)}`, clipPath: cristal ? "polygon(0 0,100% 0,90% 100%,0 100%)" : undefined }} />
      </div>
      <span className="text-right" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#e7dac0", width: 26 }}>{pct}</span>
    </div>
  );
}

/* ==================================================================== HUD */
const ORDER: (keyof VitalValues)[] = ["vida", "folego", "fome", "sede", "sanidade", "mana"];

export default function SupernaturalHud({
  vitals,
  money = { cash: "12.480", bank: "84.300" },
  server = { name: "Véu Sombrio", tagline: "occult roleplay", sigil: "VS", players: "87/128", ping: 42 },
  clock = { time: "03:33", date: "III · Lua Negra" },
  voice = { talking: false, range: "MUDO" },
  minimap = { street: "Beco do Véu", district: "▲ Distrito IV" },
  skin = "pergaminho",
  style = "orbes",
  layout = "classico",
  className = "",
}: SupernaturalHudProps) {
  const c = SKINS[skin];
  const accent = c.accent;
  const cristal = style === "cristal";
  const framed = layout !== "unido";

  const stoneBg = `radial-gradient(120% 130% at 30% 0%, rgba(255,225,160,.05), transparent 55%), linear-gradient(160deg, ${c.stone2}, ${c.stone}), repeating-linear-gradient(115deg, rgba(255,255,255,.02) 0 2px, transparent 2px 6px), repeating-linear-gradient(28deg, rgba(0,0,0,.14) 0 3px, transparent 3px 9px)`;
  const panelBase: React.CSSProperties = { background: stoneBg, border: "1px solid rgba(180,140,70,.4)", boxShadow: "0 10px 34px rgba(0,0,0,.6), inset 0 0 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(180,140,70,.1), inset 0 1px 0 rgba(255,220,150,.1)", borderRadius: 5, position: "relative" };
  const corner = (pos: React.CSSProperties): React.CSSProperties => ({ position: "absolute", width: 7, height: 7, transform: "rotate(45deg)", background: accent, boxShadow: `0 0 6px ${c.glow}`, ...pos });
  const blk = (extra: React.CSSProperties): React.CSSProperties => (framed ? { ...panelBase, ...extra } : extra);

  const secondary = ORDER.filter((k) => k !== "vida" && k !== "mana");

  /* corpo dos vitais conforme estilo */
  let vitalsBody: React.ReactNode = null;
  if (style === "orbes") {
    vitalsBody = (
      <>
        <div style={blk({ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: framed ? "12px 16px" : 0 })}>
          <Orb k="vida" value={vitals.vida} size={96} low={Math.round(vitals.vida) < 30} />
        </div>
        <div style={blk({ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px", padding: framed ? "14px 16px" : "0 4px" })}>
          {secondary.map((k) => <Orb key={k} k={k} value={vitals[k]} size={58} low={false} />)}
        </div>
      </>
    );
  } else if (style === "aneis") {
    vitalsBody = (
      <div style={blk({ display: "flex", gap: 14, alignItems: "flex-end", padding: framed ? "14px 18px" : 0 })}>
        {ORDER.map((k) => <Ring key={k} k={k} value={vitals[k]} />)}
      </div>
    );
  } else {
    vitalsBody = (
      <div style={blk({ display: "flex", flexDirection: "column", gap: 9, width: 320, padding: framed ? "16px 18px" : 0, clipPath: cristal && framed ? "polygon(0 0,100% 0,100% 82%,96% 100%,0 100%)" : undefined })}>
        {ORDER.map((k) => <Bar key={k} k={k} value={vitals[k]} cristal={cristal} />)}
      </div>
    );
  }

  const manaOrb = style === "orbes" ? (
    <div style={blk({ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: framed ? "12px 16px" : 0, marginLeft: layout === "classico" ? "auto" : 0 })}>
      <Orb k="mana" value={vitals.mana} size={96} low={false} />
    </div>
  ) : null;

  const bottomBase: React.CSSProperties = { position: "absolute", bottom: 22, left: 22, zIndex: 30, display: "flex", alignItems: "flex-end" };
  let bottomLayer: React.CSSProperties;
  if (layout === "unido") bottomLayer = { ...panelBase, ...bottomBase, position: "absolute", padding: "16px 20px", gap: 18, alignItems: "center" };
  else if (layout === "classico") bottomLayer = { ...bottomBase, right: 22, gap: 14 };
  else bottomLayer = { ...bottomBase, gap: 14 };

  const labelMono: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" };

  return (
    <div className={`fixed inset-0 select-none ${className}`} style={{ fontFamily: "'Cinzel',serif", color: "#ece2cf" }}>
      <style>{KEYFRAMES}</style>

      {/* fundo placeholder — REMOVA: no jogo o gameplay fica atrás da HUD */}
      <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(135deg,#161009 0 22px,#120d08 22px 44px)" }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 50% 25%, ${c.amb}, transparent 60%), radial-gradient(80% 60% at 18% 95%, ${c.amb}, transparent 55%)` }} />
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 380px 110px rgba(0,0,0,.9)" }} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{ bottom: -10, left: `${(i * 12 + 5) % 96}%`, width: 3 + (i % 3), height: 3 + (i % 3), background: accent, filter: "blur(.5px)", boxShadow: `0 0 8px ${accent}`, animation: `hud-ember ${8 + i * 1.5}s linear ${i * 1.2}s infinite` }} />
      ))}

      {/* TOPO ESQUERDA — servidor */}
      <div style={{ ...panelBase, position: "absolute", top: 24, left: 24, zIndex: 30, padding: "14px 18px", minWidth: 240, borderLeft: `3px solid ${accent}` }}>
        <span style={corner({ top: 5, left: 5 })} /><span style={corner({ top: 5, right: 5 })} /><span style={corner({ bottom: 5, left: 5 })} /><span style={corner({ bottom: 5, right: 5 })} />
        <div className="flex items-center gap-[11px]">
          <span style={{ fontFamily: "'Cinzel Decorative',serif", fontWeight: 900, fontSize: 12, lineHeight: 1, padding: "7px 8px", border: `1px solid ${accent}77`, borderRadius: 3, color: accent, textShadow: `0 0 10px ${c.glow}`, background: "rgba(0,0,0,.3)" }}>{server.sigil}</span>
          <div>
            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontWeight: 900, fontSize: 20, letterSpacing: 1, lineHeight: 1, color: accent, textShadow: `0 0 14px ${c.glow}` }}>{server.name}</div>
            <div style={{ ...labelMono, fontSize: 10, letterSpacing: 2, color: "#9c8458", marginTop: 4 }}>{server.tagline}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-[11px]" style={{ borderTop: "1px solid rgba(180,140,70,.18)" }}>
          <div className="flex items-center gap-[7px]">
            <span className="rounded-full" style={{ width: 8, height: 8, background: "#7bbf63", boxShadow: "0 0 8px #7bbf63", animation: "hud-glowpulse 2.4s infinite" }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#d8c9a6" }}>{server.players} <span style={{ color: "#857036" }}>online</span></span>
          </div>
          <div className="flex items-center gap-[7px]">
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#857036" }}>ping</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#d8c9a6" }}>{server.ping}ms</span>
          </div>
        </div>
      </div>

      {/* TOPO DIREITA — dinheiro + relógio */}
      <div className="absolute z-30 flex flex-col gap-2.5 items-end" style={{ top: 24, right: 24 }}>
        <div className="flex gap-2.5">
          <div style={{ ...panelBase, padding: "10px 16px", minWidth: 138, textAlign: "right", borderTop: `2px solid ${accent}` }}>
            <div style={{ ...labelMono, fontSize: 9, letterSpacing: 2, color: "#857036" }}>moeda viva</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 22, marginTop: 2, color: "#efe3c6" }}>{money.cash} <span style={{ fontSize: 13, color: "#9c8458" }}>au</span></div>
          </div>
          <div style={{ ...panelBase, padding: "10px 16px", minWidth: 138, textAlign: "right", borderTop: `2px solid ${accent}` }}>
            <div style={{ ...labelMono, fontSize: 9, letterSpacing: 2, color: "#857036" }}>cofre etéreo</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 22, marginTop: 2, color: accent, textShadow: `0 0 14px ${c.glow}` }}>{money.bank} <span style={{ fontSize: 13, opacity: .7 }}>au</span></div>
          </div>
        </div>
        <div style={{ ...panelBase, display: "flex", alignItems: "center", gap: 12, padding: "8px 18px" }}>
          <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 17, color: accent, textShadow: `0 0 14px ${c.glow}` }}>☾</span>
          <div className="text-right">
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 20, letterSpacing: 2, lineHeight: 1 }}>{clock.time}</div>
            <div style={{ ...labelMono, fontSize: 9, letterSpacing: 2, color: "#9c8458", marginTop: 3 }}>{clock.date}</div>
          </div>
        </div>
      </div>

      {/* INFERIOR — vitais + minimapa + voz */}
      <div style={bottomLayer}>
        {layout === "unido" && (<><span style={corner({ top: 5, left: 5 })} /><span style={corner({ top: 5, right: 5 })} /><span style={corner({ bottom: 5, left: 5 })} /><span style={corner({ bottom: 5, right: 5 })} /></>)}

        {vitalsBody}

        {/* minimapa */}
        <div style={blk({ padding: framed ? 6 : 0 })}>
          <div className="relative overflow-hidden" style={{ width: 220, height: 160, background: "repeating-linear-gradient(45deg,#19130a 0 14px,#130e07 14px 28px)", border: "1px solid rgba(180,140,70,.35)" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 55%, rgba(200,150,70,.12), transparent 70%)" }} />
            <div className="absolute top-0 bottom-0" style={{ left: "38%", width: 7, background: "rgba(150,120,70,.25)", transform: "skewX(-12deg)" }} />
            <div className="absolute left-0 right-0" style={{ top: "52%", height: 7, background: "rgba(150,120,70,.25)" }} />
            <div className="absolute left-0 right-0" style={{ top: "24%", height: 4, background: "rgba(150,120,70,.16)", transform: "skewY(-3deg)" }} />
            <span className="absolute rounded-full" style={{ top: "30%", left: "62%", width: 7, height: 7, background: "#dca33a", boxShadow: "0 0 7px #dca33a" }} />
            <span className="absolute rounded-full" style={{ top: "68%", left: "24%", width: 7, height: 7, background: "#7bbf63", boxShadow: "0 0 7px #7bbf63" }} />
            <span className="absolute rounded-full" style={{ top: "44%", left: "80%", width: 9, height: 9, background: accent, boxShadow: `0 0 9px ${accent}` }} />
            <div className="absolute" style={{ top: "55%", left: "38%", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "16px solid #f3e9d4", transform: "translate(-50%,-50%) rotate(28deg)", filter: "drop-shadow(0 0 5px rgba(255,220,150,.9))" }} />
            <div className="absolute" style={{ top: 7, left: 9, fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: "rgba(240,225,190,.6)" }}>N</div>
            <div className="absolute flex justify-between items-center" style={{ bottom: 7, left: 10, right: 10 }}>
              <span style={{ ...labelMono, fontSize: 9, letterSpacing: 1, color: "#cdb98c" }}>{minimap.street}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#9c8458" }}>{minimap.district}</span>
            </div>
          </div>
        </div>

        {/* voz */}
        <div style={blk({ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 12px 10px" })}>
          <div className="relative flex items-center justify-center rounded-full" style={{ width: 42, height: 42, border: `1px solid ${voice.talking ? accent : "rgba(180,140,70,.35)"}`, background: voice.talking ? `${accent}22` : "rgba(0,0,0,.25)", boxShadow: voice.talking ? `0 0 16px ${c.glow}` : undefined, transition: "all .2s" }}>
            {voice.talking && <span className="absolute inset-0 rounded-full" style={{ border: `1px solid ${accent}`, animation: "hud-voiceripple 1.1s ease-out infinite" }} />}
            <span style={{ fontSize: 18, lineHeight: 1, color: voice.talking ? accent : "#857036", transition: "color .2s" }}>⊻</span>
          </div>
          <div className="flex gap-[3px] items-end" style={{ height: 16 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const h = voice.talking ? 4 + Math.abs(Math.sin(Date.now() / 200 + i)) * 12 : 3;
              return <span key={i} className="rounded-[2px]" style={{ width: 3, height: h, opacity: voice.talking ? 1 : .35, background: accent }} />;
            })}
          </div>
          <span style={{ ...labelMono, fontSize: 8, letterSpacing: 1, color: "#9c8458" }}>{voice.range}</span>
        </div>

        {manaOrb}
      </div>
    </div>
  );
}

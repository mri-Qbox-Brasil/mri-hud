/**
 * VoiceSigil — indicador de voz/microfone com tema ocultista (Diablo II).
 *
 * Selo forjado: mic num soquete central, equalizador radial de runas ao redor,
 * halo arcano pulsante ao falar e medidor de alcance (Sussurro / Normal / Grito).
 *
 * Drop-in React. Sem dependências além de React. Anima sozinho enquanto `talking`.
 * Os valores contínuos ficam em `style` inline (Tailwind não cobre valor por frame).
 *
 * Requer a fonte "Cinzel" (glifo) e "JetBrains Mono" (label) — se o seu HUD já
 * carrega essas famílias, nada a fazer.
 *
 * Uso:
 *   <VoiceSigil talking={micAtivo} range="normal" />         // sussurro | normal | grito
 *   <VoiceSigil talking={false} />                            // mudo
 *   <VoiceSigil talking accent="#a87fe0" glow="rgba(168,127,224,.5)" />  // outra skin
 */
import React from "react";

export type VoiceRange = "sussurro" | "normal" | "grito";

export interface VoiceSigilProps {
  /** microfone ativo (transmitindo) */
  talking: boolean;
  /** alcance da voz — controla quantos pontos acendem e o rótulo */
  range?: VoiceRange;
  /** cor de destaque da skin (default = dourado "pergaminho") */
  accent?: string;
  /** brilho/aura da skin, rgba (default combina com o dourado) */
  glow?: string;
  /** rótulo exibido enquanto mudo */
  mutedLabel?: string;
  className?: string;
}

const KEYFRAMES = `
@keyframes vsig-halo{0%,100%{opacity:.35;transform:scale(.94)}50%{opacity:.85;transform:scale(1.02)}}
`;

const N_BARS = 18;
const RANGE_IDX: Record<VoiceRange, number> = { sussurro: 0, normal: 1, grito: 2 };
const RANGE_LABEL: Record<VoiceRange, string> = { sussurro: "SUSSURRO", normal: "NORMAL", grito: "GRITO" };

export default function VoiceSigil({
  talking,
  range = "normal",
  accent = "#d9b25e",
  glow = "rgba(217,178,94,.5)",
  mutedLabel = "MUDO",
  className = "",
}: VoiceSigilProps) {
  // fase de animação do equalizador — só corre enquanto falando
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    if (!talking) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 120) { setPhase((p) => p + 1); last = t; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [talking]);

  const rIdx = talking ? RANGE_IDX[range] : -1;
  const label = talking ? RANGE_LABEL[range] : mutedLabel;
  const micGlyph = talking ? "ᛘ" : "⊘";

  const bars = Array.from({ length: N_BARS }).map((_, i) => {
    const deg = i * (360 / N_BARS);
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
  });

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ gap: 8, fontFamily: "'Cinzel',serif" }}>
      <style>{KEYFRAMES}</style>

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
          style={{
            inset: 3,
            background: "radial-gradient(circle at 40% 35%, #14100a, #070502)",
            boxShadow: "inset 0 0 16px rgba(0,0,0,.9), inset 0 0 0 2px rgba(0,0,0,.65), inset 0 0 0 3px rgba(180,140,70,.22)",
          }}
        >
          {talking && (
            <span
              className="absolute rounded-full"
              style={{
                inset: 12,
                background: `radial-gradient(circle, ${accent}44, transparent 68%)`,
                boxShadow: `inset 0 0 18px ${glow}, 0 0 16px ${glow}`,
                border: `1px solid ${accent}66`,
                animation: "vsig-halo 1.5s ease-in-out infinite",
              }}
            />
          )}
          {bars}
          {/* soquete central com o mic */}
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              zIndex: 2, width: 30, height: 30,
              background: talking ? `radial-gradient(circle, ${accent}55, rgba(0,0,0,.4))` : "rgba(0,0,0,.35)",
              boxShadow: talking ? `inset 0 0 10px ${glow}, 0 0 8px ${glow}` : "inset 0 0 8px rgba(0,0,0,.7)",
              border: `1px solid ${talking ? accent + "aa" : "rgba(180,140,70,.28)"}`,
              transition: "all .2s",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel',serif", fontSize: 17, lineHeight: 1,
                color: talking ? "#f3e9d4" : "#6f5c34",
                textShadow: talking ? `0 0 8px ${accent}, 0 1px 2px #000` : "none",
                transition: "color .2s",
              }}
            >
              {micGlyph}
            </span>
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
              style={{
                width: i === 1 ? 9 : 6, height: i === 1 ? 9 : 6,
                border: `1px solid ${on ? accent : "rgba(180,140,70,.3)"}`,
                background: on ? accent : "transparent",
                boxShadow: on ? `0 0 7px ${glow}` : "none",
                transition: "all .2s",
              }}
            />
          );
        })}
      </div>

      <span
        style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 2, textTransform: "uppercase",
          color: talking ? accent : "#857036",
          textShadow: talking ? `0 0 8px ${glow}` : "none",
          transition: "color .2s",
        }}
      >
        {label}
      </span>
    </div>
  );
}

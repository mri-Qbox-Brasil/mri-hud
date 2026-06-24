import { useMemo, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import MetaShape from "../molecules/MetaShape";
import { usePositioningStore } from "../../stores/positioningStore";

// Laboratorio de shapes (dev): ajuste os defaults de estilo de cada shape ao
// vivo e copie o JSON resultante. O preview usa o MESMO MetaShape da HUD (que
// renderiza via wrappers do @mriqbox/ui-kit), entao bate 1:1 com o jogo.
//
// O JSON de saida traz so os campos de ESTILO (geometria) que viram default no
// componente do kit. Tamanho (height/width), progresso e cor sao preview-only:
// na HUD vem da config/dados em runtime, nao do default da shape.

type Shape = string;

const SHAPES: Shape[] = [
  "circle-ring", "circle-fill", "inner-circle", "split-circle",
  "diamond-ring", "hexagon-ring", "triangle-ring", "star-ring",
  "square-ring", "square-fill", "pill-ring", "badge",
  "horizontal-bar", "icon-percentage",
];

type NumField = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  shapes: Shape[] | "*";
};

// Campos de ESTILO (entram no JSON de defaults).
const STYLE_FIELDS: NumField[] = [
  { key: "ringSize", label: "Ring size", min: 0.5, max: 16, step: 0.5, shapes: ["circle-ring", "inner-circle", "split-circle", "diamond-ring", "hexagon-ring", "triangle-ring", "star-ring", "square-ring", "pill-ring"] },
  { key: "borderSize", label: "Border size", min: 0.5, max: 16, step: 0.5, shapes: ["circle-fill", "square-fill"] },
  { key: "borderGap", label: "Border gap", min: 0.3, max: 1, step: 0.01, shapes: ["inner-circle", "split-circle", "pill-ring"] },
  { key: "dashes", label: "Dashes", min: 1, max: 24, step: 1, shapes: ["split-circle"] },
  { key: "gap", label: "Gap", min: 0, max: 20, step: 0.5, shapes: ["split-circle"] },
  { key: "barHeight", label: "Bar height", min: 4, max: 60, step: 1, shapes: ["badge"] },
  { key: "xAxisRound", label: "Bar X round", min: 0, max: 40, step: 1, shapes: ["badge"] },
  { key: "yAxisRound", label: "Bar Y round", min: 0, max: 40, step: 1, shapes: ["badge"] },
  { key: "cardRadius", label: "Card round", min: 0, max: 40, step: 1, shapes: ["badge"] },
  { key: "iconScaling", label: "Icon scaling", min: 0.1, max: 1, step: 0.01, shapes: "*" },
  { key: "iconTranslateX", label: "Icon X", min: -30, max: 30, step: 1, shapes: "*" },
  { key: "iconTranslateY", label: "Icon Y", min: -30, max: 30, step: 1, shapes: "*" },
];

// Shapes cujo aspecto (largura != altura) importa. As demais sao "quadradas"
// (usam max(h,w) como raio), entao Width acompanha o Size automaticamente.
const ASPECT_SHAPES = ["pill-ring", "horizontal-bar", "badge", "square-ring", "square-fill"];

// Campos PREVIEW-ONLY (nao entram no JSON).
const PREVIEW_FIELDS: NumField[] = [
  { key: "height", label: "Size (preview)", min: 20, max: 200, step: 1, shapes: "*" },
  { key: "width", label: "Width (preview)", min: 10, max: 200, step: 1, shapes: ASPECT_SHAPES },
  { key: "progressValue", label: "Progress (preview)", min: 0, max: 100, step: 1, shapes: "*" },
  { key: "rotateDegree", label: "Rotate (preview)", min: 0, max: 360, step: 1, shapes: "*" },
];

const COLOR_FIELDS = [
  { key: "progressColor", label: "Progress" },
  { key: "outlineColor", label: "Outline" },
  { key: "innerColor", label: "Inner" },
  { key: "iconColor", label: "Icon" },
];

const INITIAL: Record<string, number | string | boolean> = {
  height: 90, width: 90, progressValue: 65, rotateDegree: 0,
  ringSize: 4, borderSize: 3, borderGap: 0.85, dashes: 8, gap: 4,
  xAxisRound: 5, yAxisRound: 20, barHeight: 20, cardRadius: 14,
  iconScaling: 0.45, iconTranslateX: 0, iconTranslateY: 0,
  displayOutline: true,
  progressColor: "#00E699", outlineColor: "#1f6b56", innerColor: "#212121", iconColor: "#ffffff",
};

const relevant = (f: NumField, shape: Shape) => f.shapes === "*" || f.shapes.includes(shape);

export default function ShapeLab({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"shapes" | "positions">("shapes");
  const [shape, setShape] = useState<Shape>("circle-ring");
  const [showIcon, setShowIcon] = useState(true);
  const [vals, setVals] = useState<Record<string, number | string | boolean>>(INITIAL);

  // Posicionamento ao vivo (offsets/overrides que o usuario cria arrastando no
  // modo posicionamento). A aba "Posições" so exibe pra copiar — o sistema de
  // arraste continua sendo o de sempre.
  const elements = usePositioningStore((s) => s.elements);
  const gaugeOverrides = usePositioningStore((s) => s.gaugeOverrides);
  const resetAllPos = usePositioningStore((s) => s.resetAll);

  const positionsJson = useMemo(() => {
    const els: Record<string, Record<string, number | boolean>> = {};
    for (const [id, e] of Object.entries(elements)) {
      const entry: Record<string, number | boolean> = {};
      if (e.dx || e.dy) {
        entry.dx = Math.round(e.dx);
        entry.dy = Math.round(e.dy);
        entry.dxVw = +((e.dx / window.innerWidth) * 100).toFixed(2);
        entry.dyVh = +((e.dy / window.innerHeight) * 100).toFixed(2);
      }
      if (e.scale && Math.abs(e.scale - 1) > 0.005) entry.scale = e.scale;
      if (e.hidden) entry.hidden = true;
      if (e.vertical) entry.vertical = true;
      if (Object.keys(entry).length) els[id] = entry;
    }
    const gauges: Record<string, Record<string, number | boolean>> = {};
    for (const [id, g] of Object.entries(gaugeOverrides)) {
      const entry: Record<string, number | boolean> = {};
      if (g.x !== undefined) entry.x = +g.x.toFixed(2);
      if (g.y !== undefined) entry.y = +g.y.toFixed(2);
      if (g.scale && Math.abs(g.scale - 1) > 0.005) entry.scale = g.scale;
      if (g.isShowing === false) entry.isShowing = false;
      if (Object.keys(entry).length) gauges[id] = entry;
    }
    return JSON.stringify({ elements: els, gauges }, null, 2);
  }, [elements, gaugeOverrides]);

  const set = (k: string, v: number | string | boolean) => setVals((s) => ({ ...s, [k]: v }));

  // Ao trocar de shape, ajusta a largura de preview pra forma fazer sentido:
  // pill nasce estreita (senao vira circulo), barra nasce larga; demais seguem
  // o Size (quadradas).
  const SHAPE_WIDTH: Record<string, number> = { "pill-ring": 36, "horizontal-bar": 150 };
  const pickShape = (s: Shape) => {
    setShape(s);
    set("width", SHAPE_WIDTH[s] ?? (vals.height as number));
  };

  // Shapes quadradas usam max(h,w) como raio — Width acompanha o Size pra
  // mexer no tamanho fazer sentido. Aspecto independente so nas ASPECT_SHAPES.
  const effWidth = ASPECT_SHAPES.includes(shape) ? (vals.width as number) : (vals.height as number);
  const hudIconInfo = useMemo(
    () => ({ shape, ...vals, width: effWidth, icon: showIcon ? faHeart : null }),
    [shape, vals, showIcon, effWidth]
  );

  // JSON: so os campos de estilo relevantes pra shape atual (+ displayOutline
  // quando faz sentido). Esses sao os defaults a aplicar no componente do kit.
  const styleJson = useMemo(() => {
    const out: Record<string, number | boolean> = {};
    for (const f of STYLE_FIELDS) {
      if (relevant(f, shape)) out[f.key] = vals[f.key] as number;
    }
    const ringy = STYLE_FIELDS.find((f) => f.key === "ringSize")!;
    if (relevant(ringy, shape) || ["circle-fill", "square-fill"].includes(shape)) {
      out.displayOutline = vals.displayOutline as boolean;
    }
    return JSON.stringify({ [shape]: out }, null, 2);
  }, [shape, vals]);

  const numFields = [...PREVIEW_FIELDS, ...STYLE_FIELDS].filter((f) => relevant(f, shape));

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100000,
        background: "rgba(0,0,0,0.55)", display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: "monospace",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(10,15,28,0.98)", border: "1px solid rgba(59,130,246,0.35)",
          borderRadius: 12, width: 760, maxWidth: "92vw", maxHeight: "88vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.7)", color: "rgba(226,232,240,0.9)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ color: "rgba(147,197,253,0.9)", fontSize: 12, letterSpacing: "0.1em" }}>SHAPE LAB</span>
          <div style={{ display: "flex", gap: 4 }}>
            {(["shapes", "positions"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? "rgba(59,130,246,0.2)" : "transparent",
                  border: `1px solid ${tab === t ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.12)"}`,
                  color: tab === t ? "rgba(147,197,253,0.95)" : "rgba(255,255,255,0.5)",
                  borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontFamily: "monospace",
                }}
              >
                {t === "shapes" ? "Shapes" : "Posições"}
              </button>
            ))}
          </div>
          {tab === "shapes" && (
            <>
              <select
                value={shape}
                onChange={(e) => pickShape(e.target.value)}
                style={{ background: "rgba(255,255,255,0.06)", color: "inherit", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 8px", fontFamily: "monospace", fontSize: 12 }}
              >
                {SHAPES.map((s) => <option key={s} value={s} style={{ background: "#0a0f1c" }}>{s}</option>)}
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, opacity: 0.8 }}>
                <input type="checkbox" checked={showIcon} onChange={(e) => setShowIcon(e.target.checked)} /> ícone
              </label>
            </>
          )}
          <button onClick={onClose} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {tab === "shapes" && (
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* Controls */}
          <div style={{ width: 340, padding: 14, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            {numFields.map((f) => (
              <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 11, width: 110, opacity: 0.75 }}>
                  {f.key === "height" && ASPECT_SHAPES.includes(shape) ? "Height (preview)" : f.label}
                </label>
                <input
                  type="range" min={f.min} max={f.max} step={f.step}
                  value={vals[f.key] as number}
                  onChange={(e) => set(f.key, parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <input
                  type="number" min={f.min} max={f.max} step={f.step}
                  value={vals[f.key] as number}
                  onChange={(e) => set(f.key, parseFloat(e.target.value))}
                  style={{ width: 54, background: "rgba(255,255,255,0.06)", color: "inherit", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, padding: "2px 4px", fontSize: 11, fontFamily: "monospace" }}
                />
              </div>
            ))}

            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, opacity: 0.8, marginTop: 2 }}>
              <input type="checkbox" checked={vals.displayOutline as boolean} onChange={(e) => set("displayOutline", e.target.checked)} />
              displayOutline
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
              {COLOR_FIELDS.map((c) => (
                <label key={c.key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, opacity: 0.7 }}>
                  <input type="color" value={vals[c.key] as string} onChange={(e) => set(c.key, e.target.value)} style={{ width: 22, height: 18, padding: 0, border: "none", background: "none" }} />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          {/* Preview + output */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "repeating-conic-gradient(#1a2030 0% 25%, #141a28 0% 50%) 50% / 24px 24px", minHeight: 200 }}>
              <MetaShape hudIconInfo={hudIconInfo as never} />
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: "rgba(147,197,253,0.6)", letterSpacing: "0.08em" }}>DEFAULTS DE ESTILO (cole pra mim)</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(styleJson)}
                  style={{ marginLeft: "auto", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)", color: "rgba(147,197,253,0.9)", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}
                >
                  copiar
                </button>
              </div>
              <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: "rgba(190,240,210,0.9)", maxHeight: 120, overflow: "auto", whiteSpace: "pre-wrap" }}>{styleJson}</pre>
            </div>
          </div>
        </div>
        )}

        {tab === "positions" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: 14, gap: 8 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              Arraste os elementos no modo <b>Posicionamento</b> (Dev Tools → Posicionamento). As posições aparecem aqui pra copiar: <code>dx/dy</code> em px e <code>dxVw/dyVh</code> em % da viewport (1920×1080 ≈ valores de calibragem). Gauges dinâmicos saem em <code>gauges</code>.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "rgba(147,197,253,0.6)", letterSpacing: "0.08em" }}>POSIÇÕES (cole pra mim)</span>
              <button
                onClick={() => navigator.clipboard?.writeText(positionsJson)}
                style={{ marginLeft: "auto", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)", color: "rgba(147,197,253,0.9)", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}
              >
                copiar
              </button>
              <button
                onClick={resetAllPos}
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(252,165,165,0.85)", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}
              >
                resetar tudo
              </button>
            </div>
            <pre style={{ margin: 0, flex: 1, overflow: "auto", fontSize: 11, lineHeight: 1.4, color: "rgba(190,240,210,0.9)", whiteSpace: "pre-wrap", background: "rgba(0,0,0,0.25)", borderRadius: 6, padding: 10 }}>{positionsJson}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

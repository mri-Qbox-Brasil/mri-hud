import type { ReactNode } from "react";
import { useCustomDigitalStore, type DigitalElement } from "../../stores/customDigitalStore";
import DraggableHudElement from "../atoms/DraggableHudElement";
import ScaledHudContent from "../atoms/ScaledHudContent";

const FONT = "'Chakra Petch', 'Yantramanav', sans-serif";

/**
 * Elementos customizados do cluster digital (API 'digitalelement'). Montado
 * DENTRO do VehicleDigitalHud, entao herda o gating (so aparece no tema digital
 * + quando o cluster esta visivel). Cada elemento e um DraggableHudElement.
 * Ver [[customDigitalStore]].
 */
export default function CustomDigitalElements({ accent }: { accent: string }) {
  const elements = useCustomDigitalStore((s) => s.elements);
  const list = Object.values(elements).filter((el) => el.isShowing !== false);
  if (!list.length) return null;

  return (
    <>
      {list.map((el) => (
        <DigitalEl key={el.id} id={`digitalEl_${el.id}`} label={el.label || el.id} left={el.left} bottom={el.bottom}>
          <Element el={el} accent={accent} />
        </DigitalEl>
      ))}
    </>
  );
}

function DigitalEl({ id, label, left, bottom, children }: { id: string; label: string; left: string; bottom: number; children: ReactNode }) {
  return (
    <DraggableHudElement id={id} label={label} zIndex={10}>
      <ScaledHudContent style={{ position: "fixed", left, bottom, transform: "translateX(-50%)", pointerEvents: "none", fontFamily: FONT }}>
        {children}
      </ScaledHudContent>
    </DraggableHudElement>
  );
}

function Element({ el, accent }: { el: DigitalElement; accent: string }) {
  const color = el.color || accent;
  const value = Math.max(0, Math.min(100, Math.round(el.value)));

  if (el.kind === "pill") {
    const on = el.value > 0;
    const col = on ? color : "rgba(255,255,255,0.4)";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 9px", borderRadius: 20, background: on ? "rgba(70,224,255,0.1)" : "rgba(255,255,255,0.06)", border: `1px solid ${on ? col : "rgba(255,255,255,0.15)"}` }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: col, boxShadow: on ? `0 0 8px ${col}` : undefined }} />
        <div style={{ font: `600 9px ${FONT}`, letterSpacing: "0.16em", color: col }}>{el.text || el.label}</div>
      </div>
    );
  }

  if (el.kind === "text") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <div style={{ font: `700 22px ${FONT}`, color: "#fff", textShadow: el.glow ? `0 0 12px ${color}` : undefined }}>{el.text || Math.round(el.value)}</div>
        <div style={{ font: `500 8px ${FONT}`, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{el.label}</div>
      </div>
    );
  }

  // bar (default) — barra vertical igual FUEL/ENG/TURBO
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
      <div style={{ font: `600 10px ${FONT}`, color: "#fff" }}>{value}</div>
      <div style={{ position: "relative", width: 7, height: 78, borderRadius: 5, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${value}%`, background: color, borderRadius: 5, boxShadow: el.glow ? `0 0 8px ${color}` : undefined, transition: "height 0.12s ease-out" }} />
      </div>
      <div style={{ font: `500 9px ${FONT}`, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)" }}>{el.label}</div>
    </div>
  );
}

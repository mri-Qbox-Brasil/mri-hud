import { useCustomOrbsStore } from "../../stores/customOrbsStore";
import { CustomOrb, KEYFRAMES } from "./SupernaturalHud";
import DraggableHudElement from "../atoms/DraggableHudElement";
import ScaledHudContent from "../atoms/ScaledHudContent";

/**
 * Orbes customizadas injetadas por outros resources (API 'orb'). Renderizam
 * sempre que existir alguma — independente do skin ativo — cada uma como seu
 * proprio DraggableHudElement (movivel/escondivel/redimensionavel no F10).
 * Ver [[customOrbsStore]] e SupernaturalHud.CustomOrb.
 */
export default function CustomOrbs() {
  const configs = useCustomOrbsStore((s) => s.configs);
  const runtime = useCustomOrbsStore((s) => s.runtime);

  const entries = Object.values(configs);
  if (!entries.length) return null;

  return (
    <>
      {/* Keyframes do kit (meniscus/sheen/lowpulse) — garante animacao mesmo
          fora da skin sobrenatural, onde SupernaturalSkin nao injeta. */}
      <style>{KEYFRAMES}</style>
      {entries.map((cfg) => {
        const value = runtime[cfg.id]?.value ?? 0;
        const low = cfg.lowAt > 0 && Math.round(value) <= cfg.lowAt;
        return (
          <DraggableHudElement key={cfg.id} id={`customOrb_${cfg.id}`} label={cfg.label || cfg.id} zIndex={20}>
            <ScaledHudContent style={{ position: "fixed", left: cfg.left, bottom: cfg.bottom, pointerEvents: "none" }}>
              <CustomOrb value={value} color={cfg.color} glyph={cfg.glyph} label={cfg.label} size={cfg.size} low={low} />
            </ScaledHudContent>
          </DraggableHudElement>
        );
      })}
    </>
  );
}

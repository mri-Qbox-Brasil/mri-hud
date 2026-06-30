import type { CSSProperties, ReactNode } from "react";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useMoneyHudStore } from "../../stores/moneyHudStore";
import { useSupernaturalVitalsStore } from "../../stores/supernaturalVitalsStore";
import { usePlayerSkinStore } from "../../stores/playerSkinStore";
import { usePositioningStore } from "../../stores/positioningStore";
import debugMode from "../../stores/debugStore";
import DraggableHudElement from "../atoms/DraggableHudElement";
import ScaledHudContent from "../atoms/ScaledHudContent";
import {
  SKINS,
  ORDER,
  LABEL,
  KEYFRAMES,
  VitalPanel,
  ServerPanel,
  MoneyPanel,
  VoicePanel,
  type StyleKey,
  type VitalValues,
} from "./SupernaturalHud";

/**
 * Container do skin 'sobrenatural'. Compoe cada peca (servidor, dinheiro,
 * relogio, voz e CADA vital) como um DraggableHudElement proprio, pra serem
 * movidas/escondidas/redimensionadas separadamente no F10.
 *
 * Mapa de vitais (0-100): vida=health · fome=hunger · sede=thirst (HUD base);
 * folego · sanidade · mana = stats custom (supernaturalVitalsStore).
 */
type Anchor = Pick<CSSProperties, "top" | "left" | "right" | "bottom">;

// Posicoes padrao de cada vital por estilo (o usuario reposiciona no F10).
function vitalAnchor(style: StyleKey, k: keyof VitalValues, i: number): Anchor {
  if (style === "orbes") {
    const map: Record<keyof VitalValues, Anchor> = {
      vida: { left: 24, bottom: 22 },
      folego: { left: 150, bottom: 96 },
      fome: { left: 226, bottom: 96 },
      sede: { left: 150, bottom: 22 },
      sanidade: { left: 226, bottom: 22 },
      mana: { right: 24, bottom: 22 },
    };
    return map[k];
  }
  if (style === "aneis") return { left: 24 + i * 74, bottom: 22 };
  // barras / cristal — empilhadas
  return { left: 24, bottom: 22 + (ORDER.length - 1 - i) * 30 };
}

function SkinEl({
  id, label, anchor, canResize = true, children,
}: { id: string; label: string; anchor: Anchor; canResize?: boolean; children: ReactNode }) {
  return (
    <DraggableHudElement id={id} label={label} zIndex={20} canResize={canResize}>
      <ScaledHudContent style={{ position: "fixed", ...anchor, pointerEvents: "none" }}>
        {children}
      </ScaledHudContent>
    </DraggableHudElement>
  );
}

export default function SupernaturalSkin() {
  const show = usePlayerStatusHudStore((s) => s.show);
  const icons = usePlayerStatusHudStore((s) => s.icons);
  const voiceEffect = useColorEffectStore((s) => (s.icons as any).voice?.currentEffect ?? 0);
  const cash = useMoneyHudStore((s) => s.cash);
  const bank = useMoneyHudStore((s) => s.bank);
  const folego = useSupernaturalVitalsStore((s) => s.folego);
  const sanidade = useSupernaturalVitalsStore((s) => s.sanidade);
  const mana = useSupernaturalVitalsStore((s) => s.mana);

  const palette = usePlayerSkinStore((s) => s.palette);
  const vitalStyle = usePlayerSkinStore((s) => s.vitalStyle);
  const frameless = usePlayerSkinStore((s) => s.frameless);
  const positioningActive = usePositioningStore((s) => s.active);

  if (!show && !debugMode && !positioningActive) return null;

  const c = SKINS[palette];
  const framed = !frameless; // frameless afeta vitais + dinheiro (servidor mantem)
  const v = (name: string) => Math.round((icons as any)[name]?.progressValue ?? 0);
  const vitals: VitalValues = {
    vida: v("health"),
    fome: v("hunger"),
    sede: v("thirst"),
    folego: Math.round(folego),
    sanidade: Math.round(sanidade),
    mana: Math.round(mana),
  };

  const money = { cash: cash.toLocaleString("pt-BR"), bank: bank.toLocaleString("pt-BR") };
  const server = { name: "MRI", tagline: "roleplay", sigil: "MRI", players: "", ping: 0 };
  const voice = { talking: voiceEffect > 0, range: voiceEffect > 0 ? "NORMAL" : "MUDO" };

  return (
    <>
      <style>{KEYFRAMES}</style>

      <SkinEl id="skinServer" label="Servidor" anchor={{ top: 24, left: 24 }}>
        <ServerPanel server={server} c={c} />
      </SkinEl>

      <SkinEl id="skinMoney" label="Dinheiro" anchor={{ top: 24, right: 24 }}>
        <MoneyPanel money={money} c={c} framed={framed} />
      </SkinEl>

      <SkinEl id="skinVoice" label="Voz" anchor={{ bottom: 26, left: 320 }} canResize={false}>
        <VoicePanel voice={voice} c={c} framed />
      </SkinEl>

      {ORDER.map((k, i) => (
        <SkinEl key={k} id={`skinVital_${k}`} label={LABEL[k]} anchor={vitalAnchor(vitalStyle, k, i)}>
          <VitalPanel k={k} value={vitals[k]} style={vitalStyle} c={c} framed={framed} />
        </SkinEl>
      ))}
    </>
  );
}

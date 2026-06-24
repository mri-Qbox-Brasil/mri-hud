import { useEffect } from "react";
import { useVehicleHudStore } from "../../stores/vehicleHudStore";
import { usePositioningStore } from "../../stores/positioningStore";
import { fetchNui } from "../../utils/eventHandler";
import debugMode from "../../stores/debugStore";
import DraggableHudElement from "../atoms/DraggableHudElement";


export default function MapBorderHud() {
  const show = useVehicleHudStore((s) => s.show);
  const el = usePositioningStore((s) => s.elements["minimap"]);

  // Notify Lua whenever the minimap drag offset changes so it can call
  // SetMinimapComponentPosition with the updated normalized coordinates.
  useEffect(() => {
    const dx = el?.dx ?? 0;
    const dy = el?.dy ?? 0;
    fetchNui("minimapPosition", { x: dx / window.innerWidth, y: dy / window.innerHeight });
  }, [el?.dx, el?.dy]);

  if (!show && !debugMode) return null;

  return (
    <DraggableHudElement
      id="minimap"
      label="Minimapa"
      zIndex={8}
    >
      {/* Em producao o minimap usa a borda nativa do GTA; este box e so pra
          dar bounds ao DraggableHudElement. No modo dev (sem jogo atras) ele
          vira um placeholder visivel pra facilitar alinhar os elementos. */}
      <div
        style={{
          position: "absolute",
          bottom: "7.9%",
          left: "1.3%",
          width: 0,
          textAlign: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            bottom: "6.30%",
            width: "29vh",
            height: "18.5vh",
            position: "absolute",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            ...(debugMode
              ? {
                  border: "2px dashed rgba(147,197,253,0.5)",
                  background: "rgba(59,130,246,0.07)",
                  borderRadius: 4,
                  color: "rgba(147,197,253,0.7)",
                  fontFamily: "monospace",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                }
              : {}),
          }}
        >
          {debugMode && "MINIMAPA"}
        </div>
      </div>
    </DraggableHudElement>
  );
}

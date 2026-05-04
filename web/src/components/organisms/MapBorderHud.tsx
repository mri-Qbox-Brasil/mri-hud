import { useEffect } from "react";
import { useVehicleHudStore } from "../../stores/vehicleHudStore";
import { usePositioningStore } from "../../stores/positioningStore";
import { fetchNui } from "../../utils/eventHandler";
import debugMode from "../../stores/debugStore";
import DraggableHudElement from "../atoms/DraggableHudElement";


export default function MapBorderHud() {
  const show = useVehicleHudStore((s) => s.show);
  const showSquareBorder = useVehicleHudStore((s) => s.showSquareBorder);
  const showCircleBorder = useVehicleHudStore((s) => s.showCircleBorder);
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
      <div
        style={{
          position: "absolute",
          bottom: "7.9%",
          left: "1.3%",
          width: 0,
          textAlign: "center",
        }}
      >
        {(showSquareBorder || debugMode) && (
          <div
            className="map-square"
            style={{
              bottom: "6.30%",
              width: "29vh",
              height: "18.5vh",
              border: "4px solid #bababa",
              position: "absolute",
              display: "inline-block",
            }}
          />
        )}
        {showCircleBorder && (
          <div
            style={{
              bottom: "6.9%",
              width: "27vh",
              height: "22.9vh",
              border: "4px solid #bababa",
              position: "absolute",
              display: "inline-block",
              borderRadius: "50%",
            }}
          />
        )}
      </div>
    </DraggableHudElement>
  );
}

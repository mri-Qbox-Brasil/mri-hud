import { useServerLogoStore } from "../../stores/serverLogoStore";
import { usePositioningStore } from "../../stores/positioningStore";
import DraggableHudElement from "../atoms/DraggableHudElement";

function resolveSrc(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
  return `./${src}`;
}

export default function ServerLogoHud() {
  const config = useServerLogoStore((s) => s.config);
  const active = usePositioningStore((s) => s.active);

  if (!config) return null;
  if (!config.enabled && !active) return null;

  const { src, width, x, y } = config;

  return (
    <DraggableHudElement
      id="serverLogo"
      label="Logo do Servidor"
      zIndex={5}
    >
      <div
        style={{
          position: "absolute",
          left: `${x}vw`,
          top: `${y}vh`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <img
          src={resolveSrc(src)}
          alt=""
          draggable={false}
          style={{ width, display: "block", objectFit: "contain" }}
        />
      </div>
    </DraggableHudElement>
  );
}

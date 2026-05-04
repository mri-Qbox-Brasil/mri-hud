import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useLayoutStore } from "../../stores/layoutStore";
import { usePositioningStore } from "../../stores/positioningStore";
import debugMode from "../../stores/debugStore";
import IconsList from "../organisms/IconsList";
import DynamicPanels from "../organisms/DynamicPanels";
import DraggableHudElement from "../atoms/DraggableHudElement";

export default function MetaLayout() {
  const show = usePlayerStatusHudStore((s) => s.show);
  const layout = useLayoutStore((s) => s.layout);
  const iconBetweenSpacing = useLayoutStore((s) => s.iconBetweenSpacing);
  const yAxisSpacing = useLayoutStore((s) => s.yAxisSpacing);
  const xAxisSpacing = useLayoutStore((s) => s.xAxisSpacing);
  const vertical = usePositioningStore((s) => s.elements["statusBar"]?.vertical ?? false);

  if (!show && !debugMode) return null;

  const innerStyle = {
    gap: `${iconBetweenSpacing}px`,
    marginBottom: `${yAxisSpacing}px`,
    marginLeft: `${xAxisSpacing}px`,
  };

  // Unified icon row — horizontal or vertical based on user's rotation choice
  const row = (
    <div
      style={{
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        alignItems: "center",
        gap: `${iconBetweenSpacing}px`,
      }}
    >
      <IconsList />
      <DynamicPanels />
    </div>
  );

  let inner: React.ReactNode;

  if (layout === "center-bottom-row") {
    inner = (
      <div className="absolute bottom-[0.3vw] w-[100vw]">
        <div className="static flex flex-col mx-auto" style={{ width: "max-content", ...innerStyle }}>
          {row}
        </div>
      </div>
    );
  } else if (layout === "bottom-right-row") {
    inner = (
      <div className="absolute bottom-[0.3vw] right-[0.3vw] flex flex-col" style={innerStyle}>
        {row}
      </div>
    );
  } else if (layout === "left-bottom-column") {
    inner = (
      <div className="absolute bottom-[0.3vw] left-[1vh]">
        <div className="static flex flex-col" style={innerStyle}>{row}</div>
      </div>
    );
  } else if (layout === "right-bottom-column") {
    inner = (
      <div className="absolute bottom-[0.3vw] right-[1vh]">
        <div className="static flex flex-col" style={innerStyle}>{row}</div>
      </div>
    );
  } else if (layout === "top-left-row") {
    inner = (
      <div className="absolute top-[0.3vw] left-[0.3vw] flex flex-col" style={innerStyle}>
        {row}
      </div>
    );
  } else if (layout === "top-right-row") {
    inner = (
      <div className="absolute top-[0.3vw] right-[0.3vw] flex flex-col" style={innerStyle}>
        {row}
      </div>
    );
  } else {
    // standard (default) — bottom-left
    inner = (
      <div className="absolute bottom-[0.3vw] left-[0.3vw] flex flex-col standard-layout" style={innerStyle}>
        {row}
      </div>
    );
  }

  return (
    <DraggableHudElement
      id="statusBar"
      label="Barra de Status"
      zIndex={20}
      canRotate
    >
      {inner}
    </DraggableHudElement>
  );
}

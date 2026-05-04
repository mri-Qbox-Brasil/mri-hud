import { useState } from "react";
import type { DynamicPanel as DynamicPanelType } from "../../stores/dynamicPanelsStore";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { createShapeIcon } from "../../types/types";
import { resolveIcon } from "../../utils/faIconMap";
import MetaShape from "./MetaShape";

interface Props {
  panel: DynamicPanelType;
}

// Fields that Lua controls — everything else comes from shape geometry
const LUA_FIELDS = new Set([
  "progressColor", "outlineColor", "iconColor", "innerColor",
  "progressContrast", "outlineContrast", "iconContrast",
  "progressDropShadowAmount", "outlineDropShadowAmount", "iconDropShadowAmount",
  "progressValue", "icon", "iconName", "isShowing", "name",
]);

export default function DynamicPanel({ panel }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const baseIcon = usePlayerStatusHudStore((s) => s.icons.health as any);

  if (panel.hudIconInfo) {
    const raw = { ...panel.hudIconInfo } as any;
    if (typeof raw.icon === "string") {
      raw.icon = resolveIcon(raw.icon);
    } else if (!raw.icon && raw.iconName) {
      raw.icon = resolveIcon(raw.iconName);
    }

    // Determine the target shape: Lua override or global configured shape
    const targetShape = raw.shape ?? baseIcon.shape ?? "inner-circle";

    // Use createShapeIcon to get correct geometry defaults for the target shape
    // (e.g. circle-ring needs ringSize=6, not whatever square-fill had)
    const shapeBase = createShapeIcon(targetShape, {}) as any;

    // Start with shape geometry defaults, then inherit user-configured sizing from baseIcon
    const merged: any = {
      ...shapeBase,
      height: baseIcon.height,
      width: baseIcon.width,
      // Inherit ring geometry so thickness matches the standard panels
      ...(baseIcon.ringSize != null    && { ringSize:  baseIcon.ringSize }),
      ...(baseIcon.borderGap != null   && { borderGap: baseIcon.borderGap }),
      ...(baseIcon.iconScaling != null && { iconScaling: baseIcon.iconScaling }),
      shape: targetShape,
    };

    // Overlay Lua's color/value/icon fields
    for (const [k, v] of Object.entries(raw)) {
      if (v !== undefined && v !== null && LUA_FIELDS.has(k)) {
        merged[k] = v;
      }
    }

    // Fallback required color fields so MetaShape never crashes
    if (!merged.progressColor) merged.progressColor = "#3b82f6";
    if (!merged.outlineColor) merged.outlineColor = "rgba(59,130,246,0.4)";
    if (!merged.iconColor) merged.iconColor = "#ffffff";
    if (merged.progressContrast == null) merged.progressContrast = 100;
    if (merged.iconContrast == null) merged.iconContrast = 100;
    if (merged.outlineContrast == null) merged.outlineContrast = 100;
    if (merged.progressDropShadowAmount == null) merged.progressDropShadowAmount = 0;
    if (merged.iconDropShadowAmount == null) merged.iconDropShadowAmount = 0;
    if (merged.outlineDropShadowAmount == null) merged.outlineDropShadowAmount = 0;
    if (merged.progressValue == null) merged.progressValue = 0;

    return (
      <div className="flex flex-col items-center gap-[6px] text-white text-[12px] text-center">
        <MetaShape hudIconInfo={merged} />
        {panel.title && <div className="opacity-85 text-[11px] mt-1">{panel.title}</div>}
        {panel.value !== undefined && <div className="font-bold">{panel.value}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-[4px] text-white text-[12px] text-center w-[56px]">
      {panel.icon && !imgFailed && (
        <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center p-[2px] bg-black/[0.12] border border-white/[0.06]">
          <img
            src={`assets/panels/${panel.icon}`}
            alt={panel.title || panel.id}
            className="w-[36px] h-[36px] object-contain block mx-auto"
            onError={(e) => {
              setImgFailed(true);
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      {imgFailed && (
        <div className="text-[14px] opacity-90">
          {panel.title ? panel.title.charAt(0) : "#"}
        </div>
      )}
      {panel.title && <div className="text-[11px] opacity-90 mt-[2px]">{panel.title}</div>}
      {panel.value !== undefined && <div className="font-bold text-[12px]">{panel.value}</div>}
    </div>
  );
}

import type { BaseShapeProps } from "./shapeUtils";
import { makeFilter } from "./shapeUtils";
import FaInSvg from "./FaInSvg";

export default function SquareFill({
  height = 50,
  width = 50,
  icon = null,
  iconColor = "red",
  iconContrast = 100,
  iconDropShadowAmount = 0,
  iconScaling = 0.45,
  iconTranslateX = 0,
  iconTranslateY = 0,
  innerColor = "#212121",
  outlineColor = "red",
  outlineContrast = 100,
  outlineDropShadowAmount = 0,
  progressColor = "red",
  progressContrast = 100,
  progressDropShadowAmount = 0,
  progressValue = 100,
  borderSize = 3,
  name = "icon",
  rotateDegree = 0,
  translateX = 0,
  translateY = 0,
}: BaseShapeProps) {
  const fillHeight = (progressValue! / 100) * height!;
  const clipId = `${name}-sq-fill-clip`;

  return (
    <svg width={width} height={height} overflow="visible">
      <defs>
        <clipPath id={clipId}>
          <rect width={width} height={height} rx={2} ry={2} />
        </clipPath>
      </defs>
      <rect width={width} height={height} fill={innerColor} />
      <rect
        x={0}
        y={height! - fillHeight}
        width={width}
        height={fillHeight}
        fill={progressColor}
        clipPath={`url(#${clipId})`}
        style={{
          transition: "y 0.6s cubic-bezier(0.215, 0.61, 0.355, 1), height 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
          filter: makeFilter(progressDropShadowAmount!, progressColor!, progressContrast!),
        }}
      />
      <rect
        width={width! - 0.2}
        height={height! - 0.2}
        fill="transparent"
        stroke={outlineColor}
        strokeWidth={borderSize}
        style={{ filter: makeFilter(outlineDropShadowAmount!, outlineColor!, outlineContrast!) }}
      />
      {icon && (
        <g style={{ filter: makeFilter(iconDropShadowAmount!, iconColor!, iconContrast!) }}>
          <FaInSvg icon={icon} cx={width! / 2} cy={height! / 2} scaling={iconScaling!} color={iconColor!} translateX={iconTranslateX} translateY={iconTranslateY} />
        </g>
      )}
    </svg>
  );
}

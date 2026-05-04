import type { BaseShapeProps } from "./shapeUtils";
import { makeFilter } from "./shapeUtils";
import FaInSvg from "./FaInSvg";

export default function IconPercentage({
  height = 50,
  width = 50,
  icon = null,
  iconColor = "red",
  iconContrast = 100,
  iconDropShadowAmount = 0,
  iconScaling = 0.45,
  iconTranslateX = 0,
  iconTranslateY = 0,
  progressColor = "red",
  progressValue = 100,
}: BaseShapeProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: progressColor,
        fontSize: height,
        width,
        height,
      }}
    >
      {icon && (
        <svg
          width={width! * iconScaling! * 2}
          height={width! * iconScaling! * 2}
          viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`}
          style={{
            display: "block",
            fill: iconColor,
            filter: makeFilter(iconDropShadowAmount!, iconColor!, iconContrast!),
          }}
        >
          {Array.isArray(icon.icon[4])
            ? icon.icon[4].map((d: string, i: number) => <path key={i} d={d} fill={iconColor} />)
            : <path d={icon.icon[4] as string} fill={iconColor} />}
        </svg>
      )}
      <span style={{ fontSize: height! * 0.3, fontWeight: 700, color: progressColor }}>
        {Math.round(progressValue!)}%
      </span>
    </div>
  );
}

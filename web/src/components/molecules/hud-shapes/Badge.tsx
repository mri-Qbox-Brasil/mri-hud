import type { BaseShapeProps } from "./shapeUtils";
import { makeFilter } from "./shapeUtils";
import FaInSvg from "./FaInSvg";

export default function Badge({
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
  translateX = 0,
  translateY = 0,
  xAxisRound = 5,
  yAxisRound = 20,
}: BaseShapeProps) {
  const progressWidth = (progressValue! / 100) * width!;

  const svgTransform =
    translateX || translateY ? `translate(${translateX} ${translateY})` : undefined;

  return (
    <div
      className="flex flex-col justify-center px-1 pb-2 pt-4 rounded-lg"
      style={{ backgroundColor: innerColor }}
    >
      {icon && (
        <div
          className="flex flex-col justify-center mb-3"
          style={{ filter: makeFilter(iconDropShadowAmount!, iconColor!, iconContrast!) }}
        >
          <svg
            width={width! * iconScaling! * 2}
            height={width! * iconScaling! * 2}
            viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`}
            style={{ display: "block", margin: "0 auto", fill: iconColor }}
          >
            {Array.isArray(icon.icon[4])
              ? icon.icon[4].map((d: string, i: number) => (
                  <path key={i} d={d} fill={iconColor} />
                ))
              : <path d={icon.icon[4] as string} fill={iconColor} />}
          </svg>
        </div>
      )}
      <svg height={height} width={width} transform={svgTransform} overflow="visible">
        <rect
          width={width! - 0.2}
          height={height! - 0.2}
          fill={outlineColor}
          rx={xAxisRound}
          ry={yAxisRound}
          style={{
            filter: makeFilter(outlineDropShadowAmount!, outlineColor!, outlineContrast!),
            overflow: "visible",
          }}
        />
        <rect
          width={progressWidth}
          height={height}
          fill={progressColor}
          rx={xAxisRound}
          ry={yAxisRound}
          style={{
            transition: "width 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
            filter: makeFilter(progressDropShadowAmount!, progressColor!, progressContrast!),
          }}
        />
      </svg>
    </div>
  );
}

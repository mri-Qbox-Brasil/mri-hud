import type { BaseShapeProps } from "./shapeUtils";
import { makeFilter } from "./shapeUtils";
import FaInSvg from "./FaInSvg";

export default function SquareRing({
  displayOutline = true,
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
  ringSize = 4,
  rotateDegree = 0,
  translateX = 0,
  translateY = 0,
}: BaseShapeProps) {
  const perimeter = (width! + height!) * 2;
  const strokeDashoffset = perimeter - (progressValue! / 100) * perimeter;

  const svgTransform = [
    rotateDegree! > 0 ? `rotate(${rotateDegree} 0 0)` : "",
    `translate(${translateX} ${translateY})`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg width={width} height={height} transform={svgTransform} overflow="visible">
      <g>
        {displayOutline && (
          <rect
            stroke={outlineColor}
            width={width}
            height={height}
            strokeWidth={ringSize}
            strokeDasharray={`${perimeter} ${perimeter}`}
            shapeRendering="geometricPrecision"
            strokeDashoffset={0}
            fill="transparent"
            style={{ filter: makeFilter(outlineDropShadowAmount!, outlineColor!, outlineContrast!) }}
          />
        )}
        <rect
          fill={innerColor}
          transform={`translate(${ringSize! / 2 - 0.1} ${ringSize! / 2 - 0.3})`}
          stroke="transparent"
          shapeRendering="geometricPrecision"
          width={width! - ringSize! + 0.2}
          height={height! - ringSize! + 0.2}
          strokeDasharray={`${perimeter} ${perimeter}`}
          strokeDashoffset={0}
        />
        <rect
          stroke={progressColor}
          fill="transparent"
          width={width}
          height={height}
          strokeWidth={ringSize! - 0.1}
          strokeDasharray={`${perimeter} ${perimeter}`}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
            filter: makeFilter(progressDropShadowAmount!, progressColor!, progressContrast!),
          }}
        />
      </g>
      {icon && (
        <g style={{ filter: makeFilter(iconDropShadowAmount!, iconColor!, iconContrast!) }}>
          <FaInSvg
            icon={icon}
            cx={width! / 2}
            cy={height! / 2}
            scaling={iconScaling!}
            color={iconColor!}
            translateX={iconTranslateX}
            translateY={iconTranslateY}
          />
        </g>
      )}
    </svg>
  );
}

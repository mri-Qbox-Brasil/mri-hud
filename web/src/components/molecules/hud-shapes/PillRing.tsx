import type { BaseShapeProps } from "./shapeUtils";
import { makeFilter } from "./shapeUtils";
import FaInSvg from "./FaInSvg";

// Pill-shaped ring: tall rounded rectangle with ring progress
export default function PillRing({
  displayOutline = true,
  height = 50,
  width = 20,
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
  borderGap = 0.85,
  rotateDegree = 0,
  translateX = 0,
  translateY = 0,
}: BaseShapeProps) {
  const rx = width! / 2;
  const perimeter = 2 * ((height! - width!) + Math.PI * rx);
  const strokeDashoffset = perimeter - (progressValue! / 100) * perimeter;
  const cx = width! / 2;
  const cy = height! / 2;

  const svgTransform = [
    rotateDegree! > 0 ? `rotate(${rotateDegree} ${cx} ${cy})` : "",
    `translate(${translateX} ${translateY})`,
  ].filter(Boolean).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} overflow="visible">
      <g transform={svgTransform}>
        <rect x={0} y={0} width={width} height={height} rx={rx} ry={rx} fill={innerColor} />
        {displayOutline && (
          <rect
            x={ringSize! / 2}
            y={ringSize! / 2}
            width={width! - ringSize!}
            height={height! - ringSize!}
            rx={rx - ringSize! / 2}
            ry={rx - ringSize! / 2}
            fill="transparent"
            stroke={outlineColor}
            strokeWidth={ringSize}
            style={{ filter: makeFilter(outlineDropShadowAmount!, outlineColor!, outlineContrast!) }}
          />
        )}
        <rect
          x={ringSize! / 2}
          y={ringSize! / 2}
          width={width! - ringSize!}
          height={height! - ringSize!}
          rx={rx - ringSize! / 2}
          ry={rx - ringSize! / 2}
          fill="transparent"
          stroke={progressColor}
          strokeWidth={ringSize}
          strokeDasharray={`${perimeter} ${perimeter}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90, ${cx}, ${cy})`}
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
            filter: makeFilter(progressDropShadowAmount!, progressColor!, progressContrast!),
          }}
        />
      </g>
      {icon && (
        <g style={{ filter: makeFilter(iconDropShadowAmount!, iconColor!, iconContrast!) }}>
          <FaInSvg icon={icon} cx={cx} cy={cy} scaling={iconScaling!} color={iconColor!} translateX={iconTranslateX} translateY={iconTranslateY} />
        </g>
      )}
    </svg>
  );
}

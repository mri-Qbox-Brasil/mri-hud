import type { BaseShapeProps } from "./shapeUtils";
import { makeFilter } from "./shapeUtils";
import FaInSvg from "./FaInSvg";

export default function HorizontalBar({
  height = 50,
  width = 50,
  icon = null,
  iconColor = "red",
  iconContrast = 100,
  iconDropShadowAmount = 0,
  iconScaling = 0.45,
  iconTranslateX = 0,
  iconTranslateY = 0,
  outlineColor = "red",
  outlineContrast = 100,
  outlineDropShadowAmount = 0,
  progressColor = "red",
  progressContrast = 100,
  progressDropShadowAmount = 0,
  progressValue = 100,
  rotateDegree = 0,
  translateX = 0,
  translateY = 0,
}: BaseShapeProps) {
  const strokeDashoffset = width! - (progressValue! / 100) * width!;

  const gTransform = [
    rotateDegree! > 0 ? `rotate(${rotateDegree} ${height! / 2} ${width! / 4})` : "",
    `translate(${translateX} ${translateY})`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="border-4 border-black relative">
      <svg height={height! - 8} width={width}>
        <g transform={gTransform}>
          <line
            stroke={outlineColor}
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            strokeWidth={width}
            style={{ filter: makeFilter(outlineDropShadowAmount!, outlineColor!, outlineContrast!) }}
          />
          <line
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={progressColor}
            fill="transparent"
            strokeDasharray={width}
            strokeDashoffset={strokeDashoffset}
            strokeWidth={width}
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
              filter: makeFilter(progressDropShadowAmount!, progressColor!, progressContrast!),
            }}
          />
        </g>
        {icon && (
          <g
            dominantBaseline="middle"
            style={{ filter: makeFilter(iconDropShadowAmount!, iconColor!, iconContrast!) }}
          >
            <FaInSvg
              icon={icon}
              cx={width! / 2}
              cy={(height! - 8) / 2}
              scaling={iconScaling!}
              color={iconColor!}
              translateX={iconTranslateX}
              translateY={iconTranslateY}
            />
          </g>
        )}
      </svg>
    </div>
  );
}

import type { BaseShapeProps } from "./shapeUtils";
import { makeFilter } from "./shapeUtils";
import FaInSvg from "./FaInSvg";

export default function CircleRing({
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
  const radius = Math.max(height, width) / 2;
  const normalizedRadius = radius - ringSize / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  const gTransform = [
    rotateDegree > 0 ? `rotate(${rotateDegree} ${radius} ${radius})` : "",
    `translate(${translateX} ${translateY})`,
  ]
    .filter(Boolean)
    .join(" ");

  const innerRadius = normalizedRadius - ringSize / 2 + 0.1;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      overflow="visible"
    >
      <g transform={gTransform}>
        <circle
          fill={innerColor}
          stroke="transparent"
          strokeDashoffset={0}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeWidth={ringSize - 0.6}
          r={innerRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90, ${radius}, ${radius})`}
        />
        {displayOutline && (
          <circle
            fill="transparent"
            stroke={outlineColor}
            strokeDashoffset={0}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeWidth={ringSize}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90, ${radius}, ${radius})`}
            style={{
              filter: makeFilter(outlineDropShadowAmount, outlineColor, outlineContrast),
            }}
          />
        )}
        <circle
          stroke={progressColor}
          fill="transparent"
          strokeDashoffset={strokeDashoffset}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeWidth={ringSize}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90, ${radius}, ${radius})`}
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
            filter: makeFilter(progressDropShadowAmount, progressColor, progressContrast),
          }}
        />
      </g>
      {icon && (
        <g
          style={{
            filter: makeFilter(iconDropShadowAmount, iconColor, iconContrast),
          }}
        >
          <FaInSvg
            icon={icon}
            cx={radius}
            cy={radius}
            scaling={iconScaling}
            color={iconColor}
            translateX={iconTranslateX}
            translateY={iconTranslateY}
          />
        </g>
      )}
    </svg>
  );
}

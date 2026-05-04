import type { BaseShapeProps } from "./shapeUtils";
import { makeFilter } from "./shapeUtils";
import FaInSvg from "./FaInSvg";

export default function CircleFill({
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
  progressContrast = 100,
  progressDropShadowAmount = 0,
  progressValue = 100,
  borderSize = 3,
  rotateDegree = 0,
  translateX = 0,
  translateY = 0,
  name = "icon",
}: BaseShapeProps) {
  const minimumAxis = Math.max(height, width);
  const radius = minimumAxis / 2;
  const stroke = radius;
  const normalizedRadius = radius - stroke / 2;

  const strokeDashoffset = minimumAxis - (progressValue / 100) * minimumAxis;

  const gTransform = [
    rotateDegree > 0 ? `rotate(${rotateDegree} ${radius} ${height / 4})` : "",
    `translate(${translateX} ${translateY})`,
  ]
    .filter(Boolean)
    .join(" ");

  const clipId = `${name || "icon"}-cut-out-circle`;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      overflow="visible"
    >
      <defs>
        <clipPath id={clipId}>
          <circle strokeWidth={stroke} r={radius} cx={radius} cy={radius} />
        </clipPath>
      </defs>
      <g transform={gTransform}>
        <circle
          stroke="black"
          fill="transparent"
          strokeWidth={borderSize}
          r={normalizedRadius * 2 + borderSize / 2}
          cx={radius}
          cy={radius}
          shapeRendering="geometricPrecision"
        />
        <line
          x1="50%"
          y1="100%"
          x2="50%"
          y2="0%"
          stroke={progressColor}
          strokeDasharray={minimumAxis}
          strokeDashoffset={strokeDashoffset}
          strokeWidth={minimumAxis}
          clipPath={`url(#${clipId})`}
          shapeRendering="geometricPrecision"
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
            filter: makeFilter(progressDropShadowAmount, progressColor, progressContrast),
          }}
        />
      </g>
      {icon && (
        <g style={{ filter: makeFilter(iconDropShadowAmount, iconColor, iconContrast) }}>
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

import { useEffect, useRef, useState } from "react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface Props {
  displayOutline?: boolean;
  height?: number;
  width?: number;
  icon?: IconDefinition | null;
  iconColor?: string;
  iconScaling?: number;
  iconTranslateX?: number;
  iconTranslateY?: number;
  innerColor?: string;
  innerColorOpacity?: number;
  outlineColor?: string;
  outlineColorOpacity?: number;
  progressColor?: string;
  progressValue?: number;
  ringSize?: number;
  rotateDegree?: number;
  translateX?: number;
  translateY?: number;
  maxLengthDisplay?: number;
  maxProgressValue?: number;
  showInnerBG?: boolean;
  displayNumber?: number;
  text?: string;
}

export default function PartialCircleRing({
  displayOutline = true,
  height = 50,
  width: _width,
  icon = null,
  iconColor = "red",
  iconScaling = 0.45,
  iconTranslateX = 0,
  iconTranslateY = 0,
  innerColor = "#212121",
  innerColorOpacity = 1,
  outlineColor = "red",
  outlineColorOpacity = 0.4,
  progressColor = "red",
  progressValue = 100,
  ringSize = 4,
  rotateDegree = 0,
  translateX = 0,
  translateY = 0,
  maxLengthDisplay = 100,
  maxProgressValue = 100,
  showInnerBG = false,
  displayNumber = 0,
  text = "",
}: Props) {
  const radius = height / 2;
  const normalizedRadius = radius - ringSize / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const clampedValue = Math.min(progressValue, maxProgressValue);
  const transposeValue = (clampedValue / maxProgressValue) * 100;

  // Tween the progress circle via CSS transition
  const dashoffset =
    circumference - (transposeValue / (100 / maxLengthDisplay)) / 100 * circumference;
  const outlineDashoffset = circumference - (maxLengthDisplay / 100) * circumference;

  // Tween the display number
  const [tweenedNumber, setTweenedNumber] = useState(displayNumber);
  const tweenRef = useRef<{ from: number; to: number; start: number; raf: number }>({
    from: displayNumber,
    to: displayNumber,
    start: 0,
    raf: 0,
  });

  useEffect(() => {
    const t = tweenRef.current;
    cancelAnimationFrame(t.raf);
    t.from = tweenedNumber;
    t.to = displayNumber;
    t.start = performance.now();
    const duration = 600;
    function tick(now: number) {
      const elapsed = now - t.start;
      const p = Math.min(elapsed / duration, 1);
      setTweenedNumber(t.from + (t.to - t.from) * p);
      if (p < 1) t.raf = requestAnimationFrame(tick);
    }
    t.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(t.raf);
  }, [displayNumber]);

  const transform = [
    rotateDegree > 0 ? `rotate(${rotateDegree} ${radius} ${radius})` : "",
    `translate(${translateX} ${translateY})`,
  ]
    .filter(Boolean)
    .join(" ");

  // FontAwesome icon path rendering inside SVG
  let iconPathData: string | string[] | null = null;
  let iconViewBox = [0, 0, 512, 512];
  if (icon) {
    const def = icon as IconDefinition;
    iconViewBox = [0, 0, def.icon[0], def.icon[1]];
    iconPathData = def.icon[4];
  }

  const iconSize = radius * 2 * iconScaling;
  const iconX = radius - iconSize / 2 + iconTranslateX;
  const iconY = radius - iconSize / 2 + iconTranslateY;
  const [vbX, vbY, vbW, vbH] = iconViewBox;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      overflow="visible"
    >
      <g transform={transform}>
        {displayOutline && (
          <circle
            opacity={outlineColorOpacity}
            fill="transparent"
            stroke={outlineColor}
            strokeDashoffset={outlineDashoffset}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeWidth={ringSize}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90, ${radius}, ${radius})`}
          />
        )}
        {showInnerBG && (
          <circle
            fill={innerColor}
            fillOpacity={innerColorOpacity}
            stroke="transparent"
            strokeWidth={ringSize - 0.6}
            r={normalizedRadius - ringSize / 2 + 0.1}
            cx={radius}
            cy={radius}
          />
        )}
        <circle
          stroke={progressColor}
          fill="transparent"
          strokeDashoffset={dashoffset}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeWidth={ringSize}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90, ${radius}, ${radius})`}
          style={{ transition: "stroke-dashoffset 0.6s linear" }}
        />
      </g>

      {text && (
        <>
          <text
            className="vehicle-number"
            fill="white"
            x="50%"
            y="45%"
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {Math.floor(tweenedNumber)}
          </text>
          <text
            className="vehicle-text"
            fill="white"
            x="50%"
            y="70%"
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {text}
          </text>
        </>
      )}

      {iconPathData && (
        <svg
          x={iconX}
          y={iconY}
          width={iconSize}
          height={iconSize}
          viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        >
          {Array.isArray(iconPathData) ? (
            iconPathData.map((d, i) => (
              <path key={i} d={d} fill={iconColor} />
            ))
          ) : (
            <path d={iconPathData as string} fill={iconColor} />
          )}
        </svg>
      )}
    </svg>
  );
}

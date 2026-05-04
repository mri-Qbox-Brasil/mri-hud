import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface Props {
  icon: IconDefinition;
  cx: number;
  cy: number;
  scaling: number;
  color: string;
  translateX?: number;
  translateY?: number;
  filter?: string;
}

export default function FaInSvg({
  icon,
  cx,
  cy,
  scaling,
  color,
  translateX = 0,
  translateY = 0,
  filter,
}: Props) {
  const vbW = icon.icon[0];
  const vbH = icon.icon[1];
  const size = cx * 2 * scaling;
  const x = cx - size / 2 + translateX;
  const y = cy - size / 2 + translateY;
  const pathData = icon.icon[4];

  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox={`0 0 ${vbW} ${vbH}`}
      style={filter ? { filter } : undefined}
      overflow="visible"
    >
      {Array.isArray(pathData) ? (
        pathData.map((d, i) => <path key={i} d={d} fill={color} />)
      ) : (
        <path d={pathData as string} fill={color} />
      )}
    </svg>
  );
}

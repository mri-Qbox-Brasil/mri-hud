import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export function makeFilter(shadow: number, color: string, contrast: number): string {
  const parts: string[] = [];
  if (shadow) parts.push(`drop-shadow(0px 0px ${shadow}px ${color})`);
  if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
  return parts.join(" ");
}

export interface FaIconProps {
  icon: IconDefinition;
  cx: number;
  cy: number;
  scaling: number;
  color: string;
  translateX?: number;
  translateY?: number;
  filter?: string;
}

export function getFaIconAttrs(props: FaIconProps) {
  const { icon, cx, cy, scaling, color, translateX = 0, translateY = 0 } = props;
  const vbW = icon.icon[0];
  const vbH = icon.icon[1];
  const size = cx * 2 * scaling;
  return {
    x: cx - size / 2 + translateX,
    y: cy - size / 2 + translateY,
    width: size,
    height: size,
    viewBox: `0 0 ${vbW} ${vbH}`,
    pathData: icon.icon[4],
    color,
  };
}

export interface BaseShapeProps {
  displayOutline?: boolean;
  height?: number;
  icon?: IconDefinition | null;
  iconColor?: string;
  iconContrast?: number;
  iconDropShadowAmount?: number;
  iconRotateDegree?: number;
  iconScaling?: number;
  iconTranslateX?: number;
  iconTranslateY?: number;
  innerColor?: string;
  name?: string;
  outlineColor?: string;
  outlineContrast?: number;
  outlineDropShadowAmount?: number;
  progressColor?: string;
  progressContrast?: number;
  progressDropShadowAmount?: number;
  progressValue?: number;
  ringSize?: number;
  borderGap?: number;
  borderSize?: number;
  rotateDegree?: number;
  translateX?: number;
  translateY?: number;
  width?: number;
  dashes?: number;
  gap?: number;
  xAxisRound?: number;
  yAxisRound?: number;
  barHeight?: number;
}

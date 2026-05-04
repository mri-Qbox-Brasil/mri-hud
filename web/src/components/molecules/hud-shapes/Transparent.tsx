import type { BaseShapeProps } from "./shapeUtils";

export default function Transparent({ height = 50, width = 50 }: BaseShapeProps) {
  return <div style={{ width, height }} />;
}

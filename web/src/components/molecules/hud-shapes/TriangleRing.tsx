import { MriTriangleRing } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriTriangleRing do @mriqbox/ui-kit (mantem a API local).
export default function TriangleRing(props: BaseShapeProps) {
  return <MriTriangleRing {...adaptShapeProps(props)} />;
}

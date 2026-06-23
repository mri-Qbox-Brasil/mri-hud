import { MriSquareRing } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriSquareRing do @mriqbox/ui-kit (mantem a API local).
export default function SquareRing(props: BaseShapeProps) {
  return <MriSquareRing {...adaptShapeProps(props)} />;
}

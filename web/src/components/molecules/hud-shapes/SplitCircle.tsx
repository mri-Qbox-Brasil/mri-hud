import { MriSplitCircle } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriSplitCircle do @mriqbox/ui-kit (mantem a API local).
export default function SplitCircle(props: BaseShapeProps) {
  return <MriSplitCircle {...adaptShapeProps(props)} />;
}

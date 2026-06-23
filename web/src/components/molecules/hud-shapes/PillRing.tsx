import { MriPillRing } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriPillRing do @mriqbox/ui-kit (mantem a API local).
export default function PillRing(props: BaseShapeProps) {
  return <MriPillRing {...adaptShapeProps(props)} />;
}

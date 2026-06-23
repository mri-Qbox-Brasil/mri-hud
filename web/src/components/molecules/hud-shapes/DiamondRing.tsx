import { MriDiamondRing } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriDiamondRing do @mriqbox/ui-kit (mantem a API local).
export default function DiamondRing(props: BaseShapeProps) {
  return <MriDiamondRing {...adaptShapeProps(props)} />;
}

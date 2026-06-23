import { MriStarRing } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriStarRing do @mriqbox/ui-kit (mantem a API local).
export default function StarRing(props: BaseShapeProps) {
  return <MriStarRing {...adaptShapeProps(props)} />;
}

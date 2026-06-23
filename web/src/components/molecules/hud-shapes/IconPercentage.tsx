import { MriIconPercentage } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriIconPercentage do @mriqbox/ui-kit (mantem a API local).
export default function IconPercentage(props: BaseShapeProps) {
  return <MriIconPercentage {...adaptShapeProps(props)} />;
}

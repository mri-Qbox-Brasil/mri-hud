import { MriCircleFill } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriCircleFill do @mriqbox/ui-kit (mantem a API local).
export default function CircleFill(props: BaseShapeProps) {
  return <MriCircleFill {...adaptShapeProps(props)} />;
}

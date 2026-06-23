import { MriSquareFill } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriSquareFill do @mriqbox/ui-kit (mantem a API local).
export default function SquareFill(props: BaseShapeProps) {
  return <MriSquareFill {...adaptShapeProps(props)} />;
}

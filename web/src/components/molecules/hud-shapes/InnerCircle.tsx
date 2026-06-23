import { MriInnerCircle } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriInnerCircle do @mriqbox/ui-kit (mantem a API local).
export default function InnerCircle(props: BaseShapeProps) {
  return <MriInnerCircle {...adaptShapeProps(props)} />;
}

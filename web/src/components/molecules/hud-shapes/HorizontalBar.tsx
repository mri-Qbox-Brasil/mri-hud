import { MriHorizontalBar } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriHorizontalBar do @mriqbox/ui-kit (mantem a API local).
export default function HorizontalBar(props: BaseShapeProps) {
  return <MriHorizontalBar {...adaptShapeProps(props)} />;
}

import { MriHexagonRing } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriHexagonRing do @mriqbox/ui-kit (mantem a API local).
export default function HexagonRing(props: BaseShapeProps) {
  return <MriHexagonRing {...adaptShapeProps(props)} />;
}

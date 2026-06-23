import { MriCircleRing } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriCircleRing do @mriqbox/ui-kit. Preserva a API local
// (BaseShapeProps, icone FontAwesome) que MetaShape e os organisms consomem;
// o adapter converte o icone pro contrato do kit.
export default function CircleRing(props: BaseShapeProps) {
  return <MriCircleRing {...adaptShapeProps(props)} />;
}

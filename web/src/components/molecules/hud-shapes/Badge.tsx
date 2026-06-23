import { MriBadgeShape } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";
import { adaptShapeProps } from "./_adaptShape";

// Wrapper fino sobre MriBadgeShape do @mriqbox/ui-kit (mantem a API local).
// Nome local `Badge`; no kit a shape chama-se MriBadgeShape (MriBadge ja e
// um atom de chip de rotulo).
export default function Badge(props: BaseShapeProps) {
  return <MriBadgeShape {...adaptShapeProps(props)} />;
}

import { MriPartialCircleRing } from "@mriqbox/ui-kit";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faToMri } from "./_adaptShape";

interface Props {
  displayOutline?: boolean;
  height?: number;
  width?: number;
  icon?: IconDefinition | null;
  iconColor?: string;
  iconScaling?: number;
  iconTranslateX?: number;
  iconTranslateY?: number;
  innerColor?: string;
  innerColorOpacity?: number;
  outlineColor?: string;
  outlineColorOpacity?: number;
  progressColor?: string;
  progressValue?: number;
  ringSize?: number;
  rotateDegree?: number;
  translateX?: number;
  translateY?: number;
  maxLengthDisplay?: number;
  maxProgressValue?: number;
  showInnerBG?: boolean;
  displayNumber?: number;
  text?: string;
}

// Wrapper fino sobre MriPartialCircleRing do @mriqbox/ui-kit. Preserva a API
// local (props extras + icone FontAwesome); converte so o icone.
export default function PartialCircleRing({ icon, ...rest }: Props) {
  return <MriPartialCircleRing {...rest} icon={icon ? faToMri(icon) : null} />;
}

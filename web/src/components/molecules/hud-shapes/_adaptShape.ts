import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { MriShapeProps, MriSvgIcon } from "@mriqbox/ui-kit";
import type { BaseShapeProps } from "./shapeUtils";

// Converte um icone FontAwesome no contrato MriSvgIcon do kit (viewBox + paths).
// O kit nao depende de FontAwesome; a conversao acontece aqui, no ponto de uso.
export function faToMri(icon: IconDefinition): MriSvgIcon {
  return { viewBox: [icon.icon[0], icon.icon[1]], paths: icon.icon[4] };
}

// Adapta as props locais (BaseShapeProps, icone FA) para as props do kit
// (MriShapeProps, icone MriSvgIcon). Os demais campos tem os mesmos nomes.
export function adaptShapeProps(props: BaseShapeProps): MriShapeProps {
  const { icon, ...rest } = props;
  return { ...rest, icon: icon ? faToMri(icon) : null };
}

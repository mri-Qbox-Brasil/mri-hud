import { MriClinometer } from "@mriqbox/ui-kit";

interface Props {
  size: number;
  roll: number; // graus — positivo = escora a boreste (direita)
}

// Wrapper fino sobre MriClinometer do @mriqbox/ui-kit (mantem a API local).
export default function Clinometer(props: Props) {
  return <MriClinometer {...props} />;
}

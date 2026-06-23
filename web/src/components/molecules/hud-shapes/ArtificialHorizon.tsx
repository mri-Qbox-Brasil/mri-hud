import { MriArtificialHorizon } from "@mriqbox/ui-kit";

interface Props {
  size: number;
  pitch: number; // degrees, positive = nose up
  roll: number;  // degrees, GetEntityRotation(v,2).y — positive = right bank in GTA V
}

// Wrapper fino sobre MriArtificialHorizon do @mriqbox/ui-kit (mantem a API local).
export default function ArtificialHorizon(props: Props) {
  return <MriArtificialHorizon {...props} />;
}

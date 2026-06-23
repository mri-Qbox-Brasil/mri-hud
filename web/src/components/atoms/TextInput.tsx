import { MriInput } from "@mriqbox/ui-kit";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
}

// Wrapper sobre MriInput do @mriqbox/ui-kit. Mantem a API local (onChange
// recebe a string direto, nao o event). Visual e tema do kit.
export default function TextInput({ value, onChange, onBlur }: Props) {
  return (
    <MriInput
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      autoFocus
      className="text-center"
    />
  );
}

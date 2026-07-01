import { MriNumberInput } from "@mriqbox/ui-kit";

interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}

// Wrapper fino sobre o MriNumberInput do @mriqbox/ui-kit. Mantem a API local
// (onChange recebe number direto) e centraliza no grid dos paineis (mx-auto).
export default function NumberInput({ value, min = 0, max = 10, step = 1, onChange }: Props) {
  return (
    <MriNumberInput
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      className="mx-auto w-28"
    />
  );
}

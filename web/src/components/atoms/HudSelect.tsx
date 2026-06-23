import { MriSelect } from "@mriqbox/ui-kit";

interface Props {
  values: ReadonlyArray<string>;
  value: string;
  onChange: (val: string) => void;
}

function toLabel(str: string) {
  return str.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Wrapper sobre MriSelect do @mriqbox/ui-kit. Mantem a API local (array de
// strings) — converte pra {label,value}[] aplicando toLabel pra exibicao.
// Visual e tema do kit (reage ao accent).
export default function HudSelect({ values, value, onChange }: Props) {
  const options = values.map((v) => ({ label: toLabel(v), value: v }));
  return (
    <MriSelect
      options={options}
      value={value}
      onChange={onChange}
      className="w-full"
    />
  );
}

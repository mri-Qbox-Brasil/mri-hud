import { MriSwitch } from "@mriqbox/ui-kit";

interface Props {
  checked: boolean;
  checkedText?: string;
  uncheckedText?: string;
  center?: boolean;
  onChange: (checked: boolean) => void;
}

// Wrapper sobre MriSwitch do @mriqbox/ui-kit. Mantem a API local
// (checkedText/uncheckedText/center) — o MriSwitch nao tem label embutido,
// entao o texto fica num <span> ao lado. Reage ao accent (--primary).
export default function Switch({ checked, checkedText = "", uncheckedText = "", center = false, onChange }: Props) {
  return (
    <div
      className="flex flex-row items-center pt-2 pb-4 gap-3 select-none"
      style={center ? { justifyContent: "center" } : {}}
    >
      <MriSwitch
        checked={checked}
        onCheckedChange={onChange}
        aria-label={checkedText || uncheckedText || "toggle"}
      />
      {checkedText && uncheckedText ? (
        <span className="text-[1.2em] leading-tight text-foreground">{checked ? checkedText : uncheckedText}</span>
      ) : null}
    </div>
  );
}

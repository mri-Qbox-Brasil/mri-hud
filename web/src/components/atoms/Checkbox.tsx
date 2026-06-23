interface Props {
  checked: boolean;
  primaryText: string;
  secondaryText?: string;
  onChange: (checked: boolean) => void;
}

// Sem equivalente direto no @mriqbox/ui-kit (nao ha MriCheckbox). Mantido
// local, mas re-tintado com tokens shadcn (--primary/--card/--border) pra
// reagir ao accent da suite igual aos componentes do kit.
export default function Checkbox({ checked, primaryText, secondaryText = "", onChange }: Props) {
  return (
    <div
      className={`flex flex-row gap-4 py-3 cursor-pointer select-none ${secondaryText ? "items-center" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`grid place-content-center shrink-0 rounded-[0.15em] border-[0.15em] -translate-y-[0.075em] transition-colors ${
          checked ? "border-primary bg-primary" : "border-primary/45 bg-card"
        }`}
        style={{ width: "1.6em", height: "1.6em" }}
      >
        {checked && (
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
            <polyline
              points="1.5,6.5 4.5,9.5 10.5,2.5"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {secondaryText ? (
        <div className="flex flex-col text-foreground">
          <span className="text-[1.2em] leading-tight mb-1">{primaryText}</span>
          <span className="text-[1.1em] leading-tight text-muted-foreground">{secondaryText}</span>
        </div>
      ) : (
        <span className="text-[1.2em] leading-tight text-foreground">{primaryText}</span>
      )}
    </div>
  );
}

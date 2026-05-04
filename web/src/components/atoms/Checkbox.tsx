interface Props {
  checked: boolean;
  primaryText: string;
  secondaryText?: string;
  onChange: (checked: boolean) => void;
}

export default function Checkbox({ checked, primaryText, secondaryText = "", onChange }: Props) {
  return (
    <div
      className={`flex flex-row gap-4 py-3 cursor-pointer select-none ${secondaryText ? "items-center" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <div
        style={{
          width: "1.6em",
          height: "1.6em",
          flexShrink: 0,
          display: "grid",
          placeContent: "center",
          borderRadius: "0.15em",
          border: `0.15em solid ${checked ? "rgba(96,165,250,0.85)" : "rgba(59,130,246,0.45)"}`,
          backgroundColor: checked ? "rgba(59,130,246,0.9)" : "rgba(15,23,42,0.9)",
          transform: "translateY(-0.075em)",
          transition: "border-color 0.15s, background-color 0.15s",
        }}
      >
        {checked && (
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
            <polyline
              points="1.5,6.5 4.5,9.5 10.5,2.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {secondaryText ? (
        <div className="flex flex-col">
          <span className="text-[1.2em] leading-tight mb-1">{primaryText}</span>
          <span className="text-[1.1em] leading-tight">{secondaryText}</span>
        </div>
      ) : (
        <span className="text-[1.2em] leading-tight">{primaryText}</span>
      )}
    </div>
  );
}

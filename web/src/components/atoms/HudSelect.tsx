interface Props {
  values: ReadonlyArray<string>;
  value: string;
  onChange: (val: string) => void;
}

function toLabel(str: string) {
  return str.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function HudSelect({ values, value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-white px-2 py-2 text-base cursor-pointer focus:outline-none"
      style={{
        background: "rgba(15,23,42,0.9)",
        border: "1px solid rgba(59,130,246,0.3)",
        borderRadius: 4,
        color: "rgba(147,197,253,0.9)",
      }}
    >
      {values.map((v) => (
        <option key={v} value={v}>{toLabel(v)}</option>
      ))}
    </select>
  );
}

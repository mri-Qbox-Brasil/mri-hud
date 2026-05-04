interface Props {
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
}

export default function TextInput({ value, onChange, onBlur }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      autoFocus
      className="text-white px-2 py-1 text-base focus:outline-none w-full text-center"
      style={{
        background: "rgba(15,23,42,0.9)",
        border: "1px solid rgba(59,130,246,0.3)",
        borderRadius: 4,
        color: "rgba(147,197,253,0.9)",
      }}
    />
  );
}

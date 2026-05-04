interface Props {
  color: string;
  onChange: (hex: string) => void;
}

export default function ColorPicker({ color, onChange }: Props) {
  const safe = color && color !== "" ? color : "#3b82f6";

  return (
    <div className="flex flex-col items-center mx-auto rounded-lg overflow-hidden w-[40px] h-[40px]" style={{ border: "2px solid rgba(59,130,246,0.4)" }}>
      <input
        type="color"
        value={safe.length === 9 ? safe.slice(0, 7) : safe}
        onChange={(e) => onChange(e.target.value)}
        className="w-[60px] h-[60px] -translate-x-[10px] -translate-y-[10px] cursor-pointer border-none bg-transparent"
        title={safe}
      />
    </div>
  );
}

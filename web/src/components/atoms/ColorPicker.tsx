interface Props {
  color: string;
  onChange: (hex: string) => void;
}

// Swatch compacto (40x40) que abre o color picker nativo. Mantido local em
// vez de usar MriColorPicker do kit — o do kit e um picker inline completo
// (sliders, modos) com UX diferente, mudaria o layout dos paineis. Borda
// re-tintada com --primary pra reagir ao accent.
export default function ColorPicker({ color, onChange }: Props) {
  const safe = color && color !== "" ? color : "#3b82f6";

  return (
    <div className="flex flex-col items-center mx-auto rounded-lg overflow-hidden w-[40px] h-[40px] border-2 border-border">
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

interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}

function clamp(val: number, min: number, max: number) {
  const clamped = Math.max(min, Math.min(max, val));
  return Math.round(clamped * 100) / 100;
}

// Sem equivalente no @mriqbox/ui-kit (nao ha MriNumberInput com steppers).
// Mantido local, re-tintado com tokens shadcn pra reagir ao accent. O
// stepper "-" mantem hover destructive (decremento) e o "+" hover primary.
export default function NumberInput({ value, min = 0, max = 10, step = 1, onChange }: Props) {
  function adjust(dir: 1 | -1) {
    onChange(clamp(value + dir * step, min, max));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw.endsWith(".")) return;
    const n = Number(raw);
    if (!isNaN(n)) onChange(clamp(n, min, max));
  }

  return (
    <div className="flex flex-row mx-auto h-10 w-30 rounded border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => adjust(-1)}
        className="font-semibold text-muted-foreground h-full w-8 flex bg-card border-r border-border cursor-pointer transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
      >
        <span className="mx-auto mt-[10%] text-lg font-bold">-</span>
      </button>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="w-14 p-1 text-base focus:outline-none text-center bg-background text-foreground"
      />
      <button
        type="button"
        onClick={() => adjust(1)}
        className="font-semibold text-muted-foreground h-full w-8 flex bg-card border-l border-border cursor-pointer transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
      >
        <span className="mx-auto mt-[10%] text-lg font-bold">+</span>
      </button>
    </div>
  );
}

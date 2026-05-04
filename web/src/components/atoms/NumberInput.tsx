interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}

function clamp(val: number, min: number, max: number, step: number) {
  const clamped = Math.max(min, Math.min(max, val));
  return Math.round(clamped * 100) / 100;
}

export default function NumberInput({ value, min = 0, max = 10, step = 1, onChange }: Props) {
  function adjust(dir: 1 | -1) {
    onChange(clamp(value + dir * step, min, max, step));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw.endsWith(".")) return;
    const n = Number(raw);
    if (!isNaN(n)) onChange(clamp(n, min, max, step));
  }

  return (
    <div
      className="flex flex-row mx-auto h-10 w-30"
      style={{ border: "1px solid rgba(59,130,246,0.3)", borderRadius: 4 }}
    >
      <button
        className="font-semibold text-white h-full w-8 flex focus:outline-none cursor-pointer"
        style={{
          background: "rgba(15,23,42,0.9)",
          borderRight: "1px solid rgba(59,130,246,0.3)",
          borderRadius: "4px 0 0 4px",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(185,28,28,0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(15,23,42,0.9)")}
        onClick={() => adjust(-1)}
        type="button"
      >
        <span className="mx-auto mt-[10%] text-lg font-bold">-</span>
      </button>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="w-14 p-1 text-xs text-base focus:outline-none text-center text-white"
        style={{ background: "rgba(10,15,28,0.8)", color: "rgba(147,197,253,0.9)" }}
      />
      <button
        className="font-semibold text-white h-full w-8 flex focus:outline-none cursor-pointer"
        style={{
          background: "rgba(15,23,42,0.9)",
          borderLeft: "1px solid rgba(59,130,246,0.3)",
          borderRadius: "0 4px 4px 0",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(30,64,175,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(15,23,42,0.9)")}
        onClick={() => adjust(1)}
        type="button"
      >
        <span className="mx-auto mt-[10%] text-lg font-bold">+</span>
      </button>
    </div>
  );
}

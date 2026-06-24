import { useEffect, useRef, useState } from "react";

export function useSmoothValue(target: number, tau = 120, snapEpsilon = 0.3): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const targetRef = useRef(target);
  const lastRef = useRef<number | null>(null);

  targetRef.current = target;

  useEffect(() => {
    let raf = 0;

    const tick = (now: number) => {
      const last = lastRef.current ?? now;
      lastRef.current = now;
      const dt = now - last;

      const cur = valueRef.current;
      const tgt = targetRef.current;
      const diff = tgt - cur;

      const next = Math.abs(diff) <= snapEpsilon
        ? tgt
        : cur + diff * (1 - Math.exp(-dt / tau));

      if (next !== cur) {
        valueRef.current = next;
        setValue(next);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastRef.current = null;
    };
  }, [tau, snapEpsilon]);

  return value;
}

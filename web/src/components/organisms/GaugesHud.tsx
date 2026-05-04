import { useDynamicGaugesStore } from "../../stores/dynamicGaugesStore";
import { resolveIcon } from "../../utils/faIconMap";
import DraggableGauge from "../atoms/DraggableGauge";

export default function GaugesHud() {
  const configs = useDynamicGaugesStore((s) => s.configs);
  const runtime = useDynamicGaugesStore((s) => s.runtime);

  const entries = Object.values(configs);
  if (!entries.length) return null;

  return (
    <>
      {entries.map((cfg) => (
        <DraggableGauge
          key={cfg.id}
          cfg={cfg}
          value={runtime[cfg.id]?.value ?? 0}
          icon={resolveIcon(cfg.iconName)}
        />
      ))}
    </>
  );
}

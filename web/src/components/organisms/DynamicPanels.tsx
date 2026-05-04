import { useDynamicPanelsStore } from "../../stores/dynamicPanelsStore";
import DynamicPanel from "../molecules/DynamicPanel";

export default function DynamicPanels() {
  const panels = useDynamicPanelsStore((s) => s.panels);
  const list = Object.values(panels).filter((p) => p.isShowing !== false);

  if (!list.length) return null;

  return (
    <div className="flex flex-row gap-[10px] pointer-events-none">
      {list.map((panel) => (
        <div key={panel.id} className="my-auto pointer-events-auto">
          <DynamicPanel panel={panel} />
        </div>
      ))}
    </div>
  );
}

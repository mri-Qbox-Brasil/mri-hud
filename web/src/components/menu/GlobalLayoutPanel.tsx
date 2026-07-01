import { Columns3 } from "lucide-react";
import { iconLayouts } from "../../types/types";
import { useLayoutStore } from "../../stores/layoutStore";
import { useT } from "../../utils/i18n";
import Panel from "../atoms/Panel";
import HudSelect from "../atoms/HudSelect";
import NumberInput from "../atoms/NumberInput";
import type { layoutIconKind } from "../../types/types";

export default function GlobalLayoutPanel() {
  const t = useT();
  const layout = useLayoutStore((s) => s.layout);
  const iconBetweenSpacing = useLayoutStore((s) => s.iconBetweenSpacing);
  const yAxisSpacing = useLayoutStore((s) => s.yAxisSpacing);
  const xAxisSpacing = useLayoutStore((s) => s.xAxisSpacing);
  const store = useLayoutStore.getState;

  return (
    <Panel name={t("menu.icons.layout_settings")} icon={Columns3}>
      <div className="text-sm flex flex-col" style={{ color: "hsl(var(--muted-foreground))" }}>
        <div className="flex justify-center mb-4">
          <div className="w-55">
            <p className="text-lg text-center mb-2">{t("menu.icons.layout")}</p>
            <HudSelect
              values={[...iconLayouts]}
              value={layout}
              onChange={(v) => store().updateLayout(v as layoutIconKind)}
            />
          </div>
        </div>
        <div className="mx-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-end mb-8">
          <div>
            <p className="text-base text-center mb-2">{t("menu.icons.between_spacing")}</p>
            <NumberInput min={-100} max={200} value={iconBetweenSpacing}
              onChange={(v) => useLayoutStore.setState({ iconBetweenSpacing: v })} />
          </div>
          <div>
            <p className="text-base text-center mb-2">{t("menu.icons.y_spacing")}</p>
            <NumberInput min={-100} max={500} value={yAxisSpacing}
              onChange={(v) => useLayoutStore.setState({ yAxisSpacing: v })} />
          </div>
          <div>
            <p className="text-base text-center mb-2">{t("menu.icons.x_spacing")}</p>
            <NumberInput min={-100} max={500} value={xAxisSpacing}
              onChange={(v) => useLayoutStore.setState({ xAxisSpacing: v })} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

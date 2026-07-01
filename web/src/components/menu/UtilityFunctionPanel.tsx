import { Wrench } from "lucide-react";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useT } from "../../utils/i18n";
import Panel from "../atoms/Panel";
import Button from "../atoms/Button";

export default function UtilityFunctionPanel() {
  const t = useT();

  return (
    <Panel name={t("menu.icons.utility")} icon={Wrench}>
      <div className="flex flex-row mx-4">
        <Button
          name={t("menu.icons.copy_colors")}
          className="h-15 w-55 whitespace-normal text-center"
          onClick={() => useColorEffectStore.getState().updateIconColorToProgressColor()}
        />
      </div>
    </Panel>
  );
}

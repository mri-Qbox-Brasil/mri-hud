import { Wrench } from "lucide-react";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useI18nStore } from "../../utils/i18n";
import Panel from "../atoms/Panel";
import Button from "../atoms/Button";

export default function UtilityFunctionPanel() {
  const t = useI18nStore((s) => s.translations);

  return (
    <Panel name={t.utilityFunctions} icon={Wrench}>
      <div className="flex flex-row mx-4">
        <Button
          name={t.copyProgressColorsToIconsColors}
          className="h-15 w-55 whitespace-normal text-center"
          onClick={() => useColorEffectStore.getState().updateIconColorToProgressColor()}
        />
      </div>
    </Panel>
  );
}

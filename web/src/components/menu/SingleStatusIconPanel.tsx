import { useState } from "react";
import { shapes, iconNames } from "../../types/types";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useI18nStore } from "../../utils/i18n";
import Panel from "../atoms/Panel";
import HudSelect from "../atoms/HudSelect";
import NumberInput from "../atoms/NumberInput";
import Switch from "../atoms/Switch";
import ColorPicker from "../atoms/ColorPicker";
import type { shapekind, iconNamesKind } from "../../types/types";

const iconColors = [
  "#FFFFFF", "rgb(33, 171, 97)", "#326dbf", "#dd6e14", "#1a7cad", "rgb(220, 6, 6)",
  "rgb(138, 168, 189)", "rgb(255, 72, 133)", "rgb(185, 255, 40)", "#3FA554",
  "rgb(182, 72, 255)", "rgb(255, 72, 133)", "#D64763", "rgb(0, 0, 0)",
];

export default function SingleStatusIconPanel() {
  const t = useI18nStore((s) => s.translations);
  const icons = usePlayerStatusHudStore((s) => s.icons);
  const colorIcons = useColorEffectStore((s) => s.icons);
  const playerStore = usePlayerStatusHudStore.getState;
  const colorStore = useColorEffectStore.getState;

  const [iconName, setIconName] = useState<iconNamesKind>("voice");
  const [stageIndex, setStageIndex] = useState(0);

  const icon = (icons as any)[iconName];
  const colorData = (colorIcons as any)[iconName];
  const colorArray = colorData?.colorEffects ?? [];
  const colorStatesArray = colorArray.map((e: any) => e.name);
  const currentStage = colorArray[stageIndex] ?? colorArray[0];

  const iconIndex = iconNames.indexOf(iconName);
  const panelIconColor = iconColors[iconIndex] ?? "#FFFFFF";

  // Sync editSingleIconName/Stage into globalColorSettings for design-mode preview
  useColorEffectStore.setState((s) => ({
    globalColorSettings: { ...s.globalColorSettings, editSingleIconName: iconName, editSingleIconStage: stageIndex },
  }));

  function handleIconChange(name: string) {
    setIconName(name as iconNamesKind);
    setStageIndex(0);
  }

  return (
    <Panel name={t.singleStatusIconSettings} color={panelIconColor}>
      <div className="flex flex-row mb-8 mt-4">
        <div className="flex-1">
          <div className="max-w-50 ml-8">
            <p className="text-lg text-center mb-2">{t.iconStatusToEdit}</p>
            <HudSelect values={[...iconNames]} value={iconName} onChange={handleIconChange} />
          </div>
        </div>
        <div className="w-50">
          <p className="text-lg text-center mb-2">{t.iconShape}</p>
          <HudSelect
            values={shapes}
            value={icon?.shape ?? "circle-ring"}
            onChange={(s) => {
              playerStore().updateIconShape(iconName, s as shapekind);
              colorStore().updateIconShapeEditableColor(iconName, s as shapekind);
            }}
          />
        </div>
        <div className="flex-1" />
      </div>

      <div className="mx-8">
        <p className="text-sm font-semibold uppercase" style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.06em" }}>{t.singleIconSizeAndPositionSection}</p>
        <hr className="mb-6" style={{ borderColor: "hsl(var(--border))" }} />
      </div>

      <div className="mx-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-end">
        <Field label={t.widthSize}>
          <NumberInput min={1} max={200} value={icon?.width ?? 50}
            onChange={(v) => playerStore().updateIconSetting(iconName, "width", v)} />
        </Field>
        <Field label={t.heightSize}>
          <NumberInput min={1} max={200} value={icon?.height ?? 50}
            onChange={(v) => playerStore().updateIconSetting(iconName, "height", v)} />
        </Field>
        {icon?.ringSize != null && (
          <Field label={t.ringSize}>
            <NumberInput min={1} max={25} step={0.5} value={icon.ringSize}
              onChange={(v) => playerStore().updateIconSetting(iconName, "ringSize", v)} />
          </Field>
        )}
        {icon?.displayOutline != null && (
          <Field label={t.showProgressOutline}>
            <Switch center checked={icon.displayOutline}
              onChange={(v) => playerStore().updateIconSetting(iconName, "displayOutline", v)} />
          </Field>
        )}
        <Field label={t.xAxisPosition}>
          <NumberInput min={-20} max={20} step={0.25} value={icon?.translateX ?? 0}
            onChange={(v) => playerStore().updateIconSetting(iconName, "translateX", v)} />
        </Field>
        <Field label={t.yAxisPosition}>
          <NumberInput min={-20} max={20} step={0.25} value={icon?.translateY ?? 0}
            onChange={(v) => playerStore().updateIconSetting(iconName, "translateY", v)} />
        </Field>
        <Field label={t.rotation}>
          <NumberInput min={0} max={360} value={icon?.rotateDegree ?? 0}
            onChange={(v) => playerStore().updateIconSetting(iconName, "rotateDegree", v)} />
        </Field>
        <Field label={t.iconXAxisPosition}>
          <NumberInput min={-10} max={10} step={0.01} value={icon?.iconTranslateX ?? 0}
            onChange={(v) => playerStore().updateIconSetting(iconName, "iconTranslateX", v)} />
        </Field>
        <Field label={t.iconYAxisPosition}>
          <NumberInput min={-10} max={10} step={0.01} value={icon?.iconTranslateY ?? 0}
            onChange={(v) => playerStore().updateIconSetting(iconName, "iconTranslateY", v)} />
        </Field>
        <Field label={t.iconSize}>
          <NumberInput min={0} max={3} step={0.01} value={icon?.iconScaling ?? 0.4}
            onChange={(v) => playerStore().updateIconSetting(iconName, "iconScaling", v)} />
        </Field>
        {icon?.xAxisRound != null && (
          <Field label={t.xAxisCurve}>
            <NumberInput min={0} max={100} value={icon.xAxisRound}
              onChange={(v) => playerStore().updateIconSetting(iconName, "xAxisRound", v)} />
          </Field>
        )}
        {icon?.yAxisRound != null && (
          <Field label={t.yAxisCurve}>
            <NumberInput min={0} max={100} value={icon.yAxisRound}
              onChange={(v) => playerStore().updateIconSetting(iconName, "yAxisRound", v)} />
          </Field>
        )}
      </div>

      <div className="mx-8 mt-8">
        <p className="text-sm font-semibold uppercase" style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.06em" }}>{t.singleIconColorSection}</p>
        <hr style={{ borderColor: "hsl(var(--border))" }} />
      </div>

      {colorStatesArray.length > 1 && (
        <div className="flex flex-row justify-center mt-4">
          <div className="w-50">
            <p className="text-lg text-center mb-2">{t.iconState}</p>
            <HudSelect
              values={colorStatesArray}
              value={colorStatesArray[stageIndex] ?? colorStatesArray[0]}
              onChange={(v) => setStageIndex(colorStatesArray.indexOf(v))}
            />
          </div>
        </div>
      )}

      {currentStage && (
        <div className="mx-4 mt-6 mb-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <Field label={t.progressColor}>
            <ColorPicker color={currentStage.progressColor}
              onChange={(c) => colorStore().updateColorSetting(iconName, stageIndex, "progressColor", c)} />
          </Field>
          <Field label={t.progressContrast}>
            <NumberInput min={0} max={300} value={currentStage.progressContrast}
              onChange={(v) => colorStore().updateColorSetting(iconName, stageIndex, "progressContrast", v)} />
          </Field>
          <Field label={t.progressShadow}>
            <NumberInput min={0} max={20} value={currentStage.progressDropShadowAmount}
              onChange={(v) => colorStore().updateColorSetting(iconName, stageIndex, "progressDropShadowAmount", v)} />
          </Field>
          <Field label={t.iconColor}>
            <ColorPicker color={currentStage.iconColor}
              onChange={(c) => colorStore().updateColorSetting(iconName, stageIndex, "iconColor", c)} />
          </Field>
          <Field label={t.iconContrast}>
            <NumberInput min={0} max={300} value={currentStage.iconContrast}
              onChange={(v) => colorStore().updateColorSetting(iconName, stageIndex, "iconContrast", v)} />
          </Field>
          <Field label={t.iconShadow}>
            <NumberInput min={0} max={20} value={currentStage.iconDropShadowAmount}
              onChange={(v) => colorStore().updateColorSetting(iconName, stageIndex, "iconDropShadowAmount", v)} />
          </Field>
          <Field label={t.outlineColor}>
            <ColorPicker color={currentStage.outlineColor}
              onChange={(c) => colorStore().updateColorSetting(iconName, stageIndex, "outlineColor", c)} />
          </Field>
          <Field label={t.outlineContrast}>
            <NumberInput min={0} max={300} value={currentStage.outlineContrast}
              onChange={(v) => colorStore().updateColorSetting(iconName, stageIndex, "outlineContrast", v)} />
          </Field>
          <Field label={t.outlineShadow}>
            <NumberInput min={0} max={20} value={currentStage.outlineDropShadowAmount}
              onChange={(v) => colorStore().updateColorSetting(iconName, stageIndex, "outlineDropShadowAmount", v)} />
          </Field>
          {colorData?.editableColors?.innerColor && (
            <Field label={t.innerColor}>
              <ColorPicker color={currentStage.innerColor}
                onChange={(c) => colorStore().updateColorSetting(iconName, stageIndex, "innerColor", c)} />
            </Field>
          )}
        </div>
      )}
    </Panel>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col mx-auto items-center">
      <p className="text-base text-center mb-2">{label}</p>
      {children}
    </div>
  );
}

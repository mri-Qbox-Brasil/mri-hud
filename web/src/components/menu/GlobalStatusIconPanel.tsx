import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { shapes } from "../../types/types";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useI18nStore } from "../../utils/i18n";
import Panel from "../atoms/Panel";
import HudSelect from "../atoms/HudSelect";
import NumberInput from "../atoms/NumberInput";
import Switch from "../atoms/Switch";
import ColorPicker from "../atoms/ColorPicker";
import type { shapekind } from "../../types/types";

export default function GlobalStatusIconPanel() {
  const t = useI18nStore((s) => s.translations);
  const gs = usePlayerStatusHudStore((s) => s.globalIconSettings);
  const gc = useColorEffectStore((s) => s.globalColorSettings);
  const playerStore = usePlayerStatusHudStore.getState;
  const colorStore = useColorEffectStore.getState;

  return (
    <Panel name={t.globalStatusIconsSettings} icon={faGlobe} color="white">
      <div className="flex justify-center mb-8">
        <div className="w-50">
          <p className="text-lg text-center mb-2">{t.iconShape}</p>
          <HudSelect
            values={shapes}
            value={gs.shape ?? "circle-ring"}
            onChange={(s) => {
              playerStore().updateAllShapes(s as shapekind);
              colorStore().updateAllIconShapeEditableColor(s as shapekind);
            }}
          />
        </div>
      </div>

      <div className="mx-8">
        <p className="text-sm font-semibold uppercase" style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.06em" }}>{t.globalSizeAndPositionSection}</p>
        <hr className="mb-6" style={{ borderColor: "hsl(var(--border))" }} />
      </div>

      <div className="mx-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-end">
        <Field label={t.widthSize}>
          <NumberInput min={1} max={200} value={gs.width ?? 50} onChange={playerStore().updateAllWidth} />
        </Field>
        <Field label={t.heightSize}>
          <NumberInput min={1} max={200} value={gs.height ?? 50} onChange={playerStore().updateAllHeight} />
        </Field>
        {gs.ringSize != null && (
          <Field label={t.ringSize}>
            <NumberInput min={1} max={25} step={0.5} value={gs.ringSize} onChange={playerStore().updateAllRingSize} />
          </Field>
        )}
        {gs.displayOutline != null && (
          <Field label={t.showProgressOutline}>
            <Switch center checked={gs.displayOutline} onChange={playerStore().updateAllDisplayOutline} />
          </Field>
        )}
        <Field label={t.xAxisPosition}>
          <NumberInput min={-20} max={20} step={0.25} value={gs.translateX ?? 0} onChange={playerStore().updateAllTranslateX} />
        </Field>
        <Field label={t.yAxisPosition}>
          <NumberInput min={-20} max={20} step={0.25} value={gs.translateY ?? 0} onChange={playerStore().updateAllTranslateY} />
        </Field>
        <Field label={t.rotation}>
          <NumberInput min={0} max={360} value={gs.rotateDegree ?? 0} onChange={playerStore().updateAllRotateDegree} />
        </Field>
        <Field label={t.iconXAxisPosition}>
          <NumberInput min={-10} max={10} step={0.01} value={gs.iconTranslateX ?? 0} onChange={playerStore().updateAllTranslateIconX} />
        </Field>
        <Field label={t.iconYAxisPosition}>
          <NumberInput min={-10} max={10} step={0.01} value={gs.iconTranslateY ?? 0} onChange={playerStore().updateAllTranslateIconY} />
        </Field>
        <Field label={t.iconSize}>
          <NumberInput min={0} max={3} step={0.01} value={gs.iconScaling ?? 0.4} onChange={playerStore().updateAllIconScale} />
        </Field>
        {gs.xAxisRound != null && (
          <Field label={t.xAxisCurve}>
            <NumberInput min={0} max={100} value={gs.xAxisRound} onChange={playerStore().updateAllRoundXAxis} />
          </Field>
        )}
        {gs.yAxisRound != null && (
          <Field label={t.yAxisCurve}>
            <NumberInput min={0} max={100} value={gs.yAxisRound} onChange={playerStore().updateAllRoundYAxis} />
          </Field>
        )}
      </div>

      <div className="mx-8 mt-8">
        <p className="text-sm font-semibold uppercase" style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.06em" }}>{t.globalColorSection}</p>
        <hr style={{ borderColor: "hsl(var(--border))" }} />
      </div>

      <div className="mx-4 mt-6 mb-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <Field label={t.progressColor}>
          <ColorPicker color={gc.progressColor} onChange={(c) => colorStore().updateAllDefaultEffectColorSetting("progressColor", c)} />
        </Field>
        <Field label={t.progressContrast}>
          <NumberInput min={0} max={300} value={gc.progressContrast} onChange={(v) => colorStore().updateAllDefaultEffectColorSetting("progressContrast", v)} />
        </Field>
        <Field label={t.progressShadow}>
          <NumberInput min={0} max={20} value={gc.progressDropShadowAmount} onChange={(v) => colorStore().updateAllDefaultEffectColorSetting("progressDropShadowAmount", v)} />
        </Field>
        <Field label={t.iconColor}>
          <ColorPicker color={gc.iconColor} onChange={(c) => colorStore().updateAllDefaultEffectColorSetting("iconColor", c)} />
        </Field>
        <Field label={t.iconContrast}>
          <NumberInput min={0} max={300} value={gc.iconContrast} onChange={(v) => colorStore().updateAllDefaultEffectColorSetting("iconContrast", v)} />
        </Field>
        <Field label={t.iconShadow}>
          <NumberInput min={0} max={20} value={gc.iconDropShadowAmount} onChange={(v) => colorStore().updateAllDefaultEffectColorSetting("iconDropShadowAmount", v)} />
        </Field>
        <Field label={t.outlineColor}>
          <ColorPicker color={gc.outlineColor} onChange={(c) => colorStore().updateAllDefaultEffectColorSetting("outlineColor", c)} />
        </Field>
        <Field label={t.outlineContrast}>
          <NumberInput min={0} max={300} value={gc.outlineContrast} onChange={(v) => colorStore().updateAllDefaultEffectColorSetting("outlineContrast", v)} />
        </Field>
        <Field label={t.outlineShadow}>
          <NumberInput min={0} max={20} value={gc.outlineDropShadowAmount} onChange={(v) => colorStore().updateAllDefaultEffectColorSetting("outlineDropShadowAmount", v)} />
        </Field>
        {gc.editableColors?.innerColor && (
          <Field label={t.innerColor}>
            <ColorPicker color={gc.innerColor} onChange={(c) => colorStore().updateAllDefaultEffectColorSetting("innerColor", c)} />
          </Field>
        )}
      </div>
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

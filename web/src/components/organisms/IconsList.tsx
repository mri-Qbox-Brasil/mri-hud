import type { playerHudIcons } from "../../types/types";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useExternalStatusStore } from "../../stores/externalStatusStore";
import { useVehicleThemeStore } from "../../stores/vehicleThemeStore";
import { useVehicleHudStore } from "../../stores/vehicleHudStore";
import MetaShape from "../molecules/MetaShape";

// Icones de status do player que o cluster do tema 'digital' ja exibe e que,
// portanto, sao ocultados dentro do veiculo pra nao duplicar. Por ora so o
// cinto (harness) — engine/nitro/cruise seguem visiveis.
const DIGITAL_DUPLICATED_ICONS: Array<keyof playerHudIcons> = ["harness"];

interface IconsListProps {
  isReversed?: boolean;
  iconsToShow?: Array<keyof playerHudIcons>;
  iconsToNotShow?: Array<keyof playerHudIcons>;
}

export default function IconsList({
  isReversed = false,
  iconsToShow = [],
  iconsToNotShow = [],
}: IconsListProps) {
  const icons = usePlayerStatusHudStore((s) => s.icons);
  const showingOrder = usePlayerStatusHudStore((s) => s.showingOrder);
  const designMode = usePlayerStatusHudStore((s) => s.designMode);
  const designProgress = usePlayerStatusHudStore((s) => s.designProgress);
  const colorIcons = useColorEffectStore((s) => s.icons);
  const globalColorSettings = useColorEffectStore((s) => s.globalColorSettings);
  const externalIcons = useExternalStatusStore((s) => s.icons);

  // Com o tema digital ativo dentro do veiculo, oculta os icones duplicados
  // pelo cluster (atualmente so o cinto). Nao some no designMode (customizacao)
  // pra que ainda seja configuravel no menu.
  const vehicleTheme = useVehicleThemeStore((s) => s.theme);
  const inVehicle = useVehicleHudStore((s) => s.show);
  const digitalActive = vehicleTheme === "digital" && inVehicle;

  let orderList: Array<keyof playerHudIcons> =
    iconsToShow.length ? iconsToShow : showingOrder;
  if (isReversed) orderList = [...orderList].reverse();

  return (
    <>
      {orderList.map((iconName) => {
        const icon = (icons as any)[iconName];
        const colorData = (colorIcons as any)[iconName];
        if (!colorData) return null;

        const effectIndex = designMode
          ? globalColorSettings.editSingleIconName === iconName
            ? globalColorSettings.editSingleIconStage
            : 0
          : colorData.currentEffect;
        const currentEffect = colorData.colorEffects[effectIndex];
        const buffColor = externalIcons[iconName as string];

        const hiddenByDigital =
          digitalActive && !designMode && DIGITAL_DUPLICATED_ICONS.includes(iconName);
        const isVisible =
          (icon.isShowing && !iconsToNotShow.includes(iconName) && !hiddenByDigital) ||
          designMode;
        if (!isVisible) return null;

        const hudIconInfo = {
          ...icon,
          progressColor: currentEffect.progressColor,
          progressContrast: currentEffect.progressContrast,
          progressDropShadowAmount: currentEffect.progressDropShadowAmount,
          progressValue: designMode ? designProgress : icon.progressValue,
          iconColor: buffColor ? buffColor.iconColor : currentEffect.iconColor,
          iconContrast: currentEffect.iconContrast,
          iconDropShadowAmount: currentEffect.iconDropShadowAmount,
          outlineColor: currentEffect.outlineColor,
          outlineContrast: currentEffect.outlineContrast,
          outlineDropShadowAmount: currentEffect.outlineDropShadowAmount,
          innerColor: currentEffect.innerColor,
        };

        return (
          <div key={iconName} className="my-auto">
            <MetaShape hudIconInfo={hudIconInfo} />
          </div>
        );
      })}

      {Object.entries(externalIcons).map(([iconName, statusIcon]) => {
        if (!statusIcon.name) return null;
        if (!statusIcon.isShowing && !designMode) return null;
        return (
          <div key={iconName} className="my-auto">
            <MetaShape hudIconInfo={statusIcon} />
          </div>
        );
      })}
    </>
  );
}

import type { playerHudIcons } from "../../types/types";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useExternalStatusStore } from "../../stores/externalStatusStore";
import MetaShape from "../molecules/MetaShape";

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

        const isVisible =
          (icon.isShowing && !iconsToNotShow.includes(iconName)) || designMode;
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

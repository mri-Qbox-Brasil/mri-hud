import { Save, RotateCcw } from "lucide-react";
import { MriCard, MriButton, MriSwitch, MriAccordion } from "@mriqbox/ui-kit";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useLayoutStore } from "../../stores/layoutStore";
import { useMenuStore } from "../../stores/menuStore";
import { useI18nStore } from "../../utils/i18n";
import { saveUIDataToServer } from "../../utils/eventHandler";
import GlobalStatusIconPanel from "./GlobalStatusIconPanel";
import SingleStatusIconPanel from "./SingleStatusIconPanel";
import GlobalLayoutPanel from "./GlobalLayoutPanel";
import UtilityFunctionPanel from "./UtilityFunctionPanel";
import ProfilePanel from "./ProfilePanel";

export default function StatusIconsPanel() {
  const t = useI18nStore((s) => s.translations);
  const designMode = usePlayerStatusHudStore((s) => s.designMode);
  const saveUIState = usePlayerStatusHudStore((s) => s.saveUIState);
  const adminOnly = useMenuStore((s) => s.adminOnly);
  const isAdmin = useMenuStore((s) => s.isAdmin);

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header / acoes */}
      <MriCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-bold text-foreground">{t.statusIconsSettings}</p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{t.designMode}</span>
            <MriSwitch
              checked={designMode}
              onCheckedChange={(v) => usePlayerStatusHudStore.setState({ designMode: v })}
              aria-label={t.designMode}
            />
          </div>

          <div className="flex items-center gap-2">
            <MriButton
              variant="destructive"
              size="sm"
              onClick={() => {
                usePlayerStatusHudStore.getState().resetPlayerStatusIcons();
                useColorEffectStore.getState().resetColorEffects();
                useLayoutStore.getState().resetLayout();
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              {t.resetStatusIconSettings}
            </MriButton>
            {adminOnly && isAdmin && (
              <MriButton
                size="sm"
                disabled={saveUIState !== "ready"}
                onClick={() => {
                  saveUIDataToServer();
                  usePlayerStatusHudStore.setState({ saveUIState: "updating" });
                }}
              >
                <Save className="w-4 h-4 mr-1.5" />
                {t.saveChangesToServer}
              </MriButton>
            )}
          </div>
        </div>
      </MriCard>

      {/* Accordion unico: abrir uma secao fecha as outras (type="single"). */}
      <MriAccordion type="single" collapsible className="flex flex-col gap-3">
        <GlobalStatusIconPanel />
        <SingleStatusIconPanel />
        <GlobalLayoutPanel />
        <UtilityFunctionPanel />
        <ProfilePanel />
      </MriAccordion>
    </div>
  );
}

import { Save, RotateCcw, Sparkles } from "lucide-react";
import { MriCard, MriButton, MriSwitch, MriAccordion } from "@mriqbox/ui-kit";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useLayoutStore } from "../../stores/layoutStore";
import { useMenuStore } from "../../stores/menuStore";
import { usePlayerSkinStore } from "../../stores/playerSkinStore";
import { useT } from "../../utils/i18n";
import { saveUIDataToServer } from "../../utils/eventHandler";
import GlobalStatusIconPanel from "./GlobalStatusIconPanel";
import SingleStatusIconPanel from "./SingleStatusIconPanel";
import GlobalLayoutPanel from "./GlobalLayoutPanel";
import UtilityFunctionPanel from "./UtilityFunctionPanel";
import ProfilePanel from "./ProfilePanel";

export default function StatusIconsPanel() {
  const t = useT();
  const designMode = usePlayerStatusHudStore((s) => s.designMode);
  const saveUIState = usePlayerStatusHudStore((s) => s.saveUIState);
  const adminOnly = useMenuStore((s) => s.adminOnly);
  const isAdmin = useMenuStore((s) => s.isAdmin);
  const playerSkin = usePlayerSkinStore((s) => s.skin);

  // O designer abaixo edita a HUD de icones classica (MetaLayout). Skins que
  // desenham os proprios vitais (ex.: sobrenatural) nao usam nada disto, entao
  // escondemos os controles e mostramos um aviso pra nao configurar no vazio.
  if (playerSkin !== "classic") {
    return (
      <div className="flex flex-col gap-4 py-4">
        <MriCard className="p-6 flex flex-col items-center gap-3 text-center">
          <Sparkles className="w-8 h-8 text-primary" />
          <p className="text-sm font-bold text-foreground">{t("menu.icons.notice_title")}</p>
          <p className="text-xs text-muted-foreground max-w-md">{t("menu.icons.notice_body")}</p>
        </MriCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header / acoes */}
      <MriCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-bold text-foreground">{t("menu.icons.settings")}</p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{t("menu.icons.design_mode")}</span>
            <MriSwitch
              checked={designMode}
              onCheckedChange={(v) => usePlayerStatusHudStore.setState({ designMode: v })}
              aria-label={t("menu.icons.design_mode")}
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
              {t("menu.icons.reset")}
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
                {t("menu.icons.save_server")}
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

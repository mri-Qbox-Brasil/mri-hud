import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { useColorEffectStore } from "../../stores/colorEffectStore";
import { useLayoutStore } from "../../stores/layoutStore";
import { useMenuStore } from "../../stores/menuStore";
import { useI18nStore } from "../../utils/i18n";
import { saveUIDataToServer } from "../../utils/eventHandler";
import Button from "../atoms/Button";
import Switch from "../atoms/Switch";
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
    <div className="text-sm flex flex-col select-none" style={{ color: "hsl(var(--muted-foreground))" }}>
      <div className="my-3 flex flex-row items-center" style={{ color: "hsl(var(--foreground))" }}>
        <div className="flex-1 flex flex-col justify-center min-w-min">
          <p className="ml-3 p-0">{t.statusIconsSettings}</p>
        </div>
        <div className="text-base">
          <p>{t.designMode}</p>
          <Switch
            center
            checked={designMode}
            onChange={(v) => usePlayerStatusHudStore.setState({ designMode: v })}
          />
        </div>
        <div className="flex flex-1 min-w-min justify-end gap-2">
          <Button
            name={t.resetStatusIconSettings}
            className="mr-5 hover:bg-red-600"
            onClick={() => {
              usePlayerStatusHudStore.getState().resetPlayerStatusIcons();
              useColorEffectStore.getState().resetColorEffects();
              useLayoutStore.getState().resetLayout();
            }}
          />
          {adminOnly && isAdmin && (
            <Button
              name={t.saveChangesToServer}
              disabled={saveUIState !== "ready"}
              onClick={() => {
                saveUIDataToServer();
                usePlayerStatusHudStore.setState({ saveUIState: "updating" });
              }}
            />
          )}
        </div>
      </div>

      <hr style={{ borderColor: "hsl(var(--border))" }} />
      <GlobalStatusIconPanel />
      <hr style={{ borderColor: "hsl(var(--border))" }} />
      <SingleStatusIconPanel />
      <hr style={{ borderColor: "hsl(var(--border))" }} />
      <GlobalLayoutPanel />
      <hr style={{ borderColor: "hsl(var(--border))" }} />
      <UtilityFunctionPanel />
      <hr style={{ borderColor: "hsl(var(--border))" }} />
      <ProfilePanel />
    </div>
  );
}

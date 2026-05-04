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
    <div className="text-sm flex flex-col select-none" style={{ color: "rgba(200,220,255,0.85)" }}>
      <div className="my-3 flex flex-row items-center" style={{ color: "rgba(147,197,253,0.9)" }}>
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

      <hr style={{ borderColor: "rgba(59,130,246,0.18)" }} />
      <GlobalStatusIconPanel />
      <hr style={{ borderColor: "rgba(59,130,246,0.18)" }} />
      <SingleStatusIconPanel />
      <hr style={{ borderColor: "rgba(59,130,246,0.18)" }} />
      <GlobalLayoutPanel />
      <hr style={{ borderColor: "rgba(59,130,246,0.18)" }} />
      <UtilityFunctionPanel />
      <hr style={{ borderColor: "rgba(59,130,246,0.18)" }} />
      <ProfilePanel />
    </div>
  );
}

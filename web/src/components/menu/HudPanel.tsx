import { useMenuStore } from "../../stores/menuStore";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { usePositioningStore } from "../../stores/positioningStore";
import { useI18nStore } from "../../utils/i18n";
import { fetchNui } from "../../utils/eventHandler";
import Button from "../atoms/Button";
import Checkbox from "../atoms/Checkbox";
import Switch from "../atoms/Switch";
import PsLogo from "../atoms/PsLogo";

export default function HudPanel() {
  const t = useI18nStore((s) => s.translations);

  const isRestarting = useMenuStore((s) => s.isRestarting);
  const isOutMapChecked = useMenuStore((s) => s.isOutMapChecked);
  const isOutCompassChecked = useMenuStore((s) => s.isOutCompassChecked);
  const isCompassFollowChecked = useMenuStore((s) => s.isCompassFollowChecked);
  const isOpenMenuSoundsChecked = useMenuStore((s) => s.isOpenMenuSoundsChecked);
  const isResetSoundsChecked = useMenuStore((s) => s.isResetSoundsChecked);
  const isListSoundsChecked = useMenuStore((s) => s.isListSoundsChecked);
  const isMapNotifyChecked = useMenuStore((s) => s.isMapNotifyChecked);
  const isLowFuelAlertChecked = useMenuStore((s) => s.isLowFuelAlertChecked);
  const isCinematicNotifyChecked = useMenuStore((s) => s.isCinematicNotifyChecked);
  const isMapEnabledChecked = useMenuStore((s) => s.isMapEnabledChecked);
  const isToggleMapShapeChecked = useMenuStore((s) => s.isToggleMapShapeChecked);
  const isShowCompassChecked = useMenuStore((s) => s.isShowCompassChecked);
  const isShowStreetsChecked = useMenuStore((s) => s.isShowStreetsChecked);
  const isPointerShowChecked = useMenuStore((s) => s.isPointerShowChecked);
  const isCinematicModeChecked = useMenuStore((s) => s.isCinematicModeChecked);
  const isUseMPHChecked = useMenuStore((s) => s.isUseMPHChecked);
  const positioningEnabled = usePositioningStore((s) => s.enabled);

  const dynamicIcons = usePlayerStatusHudStore((s) => s.dynamicIcons);

  const set = useMenuStore.setState;
  const setPlayer = usePlayerStatusHudStore.getState;

  return (
    <div className="text-sm flex flex-col" style={{ color: "hsl(var(--muted-foreground))" }}>
      <div className="mx-4 mb-5 mt-3">
        <div className="float-right w-[25%]">
          <PsLogo />
        </div>
        <div className="-mx-4 mb-4 text-xl" style={{ color: "hsl(var(--foreground))" }}>
          <p>{t.resetHud}</p>
        </div>

        <Button
          name={t.resetHud}
          disabled={isRestarting}
          disabledText={t.resettingHud}
          className="whitespace-nowrap hover:bg-red-600"
          onClick={() => { fetchNui("restartHud"); set({ isRestarting: true }); }}
        />
        <p className="text-base">{t.resetHudDescription}</p>

        <Button
          name={t.resetSettings}
          className="hover:bg-red-600"
          onClick={() => {
            useMenuStore.getState().resetHudMenuSetting();
            useMenuStore.getState().sendMenuSettingsToClient();
          }}
        />
        <p className="text-base">{t.resetSettingsDescriptionLine1}</p>
        <p className="text-base">{t.resetSettingsDescriptionLine2}</p>
      </div>

      {positioningEnabled && (
        <>
          <hr style={{ borderColor: "hsl(var(--border))" }} />

          <div className="my-3 text-base font-semibold" style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <p>{t.positioningMenu}</p>
          </div>
          <div className="mx-4 mb-4 flex flex-col gap-3">
            <div>
              <Button
                name={t.openPositioningMode}
                onClick={() => {
                  fetchNui("switchToPositioningMode");
                  useMenuStore.setState({ show: false });
                  usePositioningStore.setState({ active: true });
                }}
              />
              <p className="text-base">{t.openPositioningModeDescription}</p>
            </div>
            <div>
              <Button
                name={t.resetAllPositions}
                className="hover:bg-red-600"
                onClick={() => usePositioningStore.getState().resetAll()}
              />
              <p className="text-base">{t.resetAllPositionsDescription}</p>
            </div>
          </div>
        </>
      )}

      <hr style={{ borderColor: "hsl(var(--border))" }} />

      <div className="my-3 text-base font-semibold" style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}><p>{t.optionsMenu}</p></div>
      <div className="mx-4 mb-4 flex flex-col">
        <Checkbox checked={isOutMapChecked} primaryText={t.minimapVehicleCheckBoxPrimary} secondaryText={t.minimapVehicleCheckBoxSecondary}
          onChange={(v) => { set({ isOutMapChecked: v }); fetchNui("showOutMap", { checked: v }); }} />
        <Checkbox checked={isOutCompassChecked} primaryText={t.compassVehicleCheckBoxPrimary} secondaryText={t.compassVehicleCheckBoxSecondary}
          onChange={(v) => { set({ isOutCompassChecked: v }); fetchNui("showOutCompass", { checked: v }); }} />
        <Checkbox checked={isCompassFollowChecked} primaryText={t.compassFollowCheckBoxPrimary} secondaryText={t.compassFollowCheckBoxSecondary}
          onChange={(v) => { set({ isCompassFollowChecked: v }); fetchNui("showFollowCompass", { checked: v }); }} />
      </div>

      <hr style={{ borderColor: "hsl(var(--border))" }} />

      <div className="my-3 text-base font-semibold" style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}><p>{t.notificationsMenu}</p></div>
      <div className="mx-4 mb-4 flex flex-col">
        <Checkbox checked={isOpenMenuSoundsChecked} primaryText={t.menuSoundEffectsEnabled}
          onChange={(v) => { set({ isOpenMenuSoundsChecked: v }); fetchNui("openMenuSounds", { checked: v }); }} />
        <Checkbox checked={isResetSoundsChecked} primaryText={t.resetSoundEffectsEnabled}
          onChange={(v) => { set({ isResetSoundsChecked: v }); fetchNui("resetHudSounds", { checked: v }); }} />
        <Checkbox checked={isListSoundsChecked} primaryText={t.guiSoundEffectsEnabled}
          onChange={(v) => { set({ isListSoundsChecked: v }); fetchNui("checklistSounds", { checked: v }); }} />
        <Checkbox checked={isMapNotifyChecked} primaryText={t.mapNotificationsEnabled}
          onChange={(v) => { set({ isMapNotifyChecked: v }); fetchNui("showMapNotif", { checked: v }); }} />
        <Checkbox checked={isLowFuelAlertChecked} primaryText={t.lowFuelNotificationsEnabled}
          onChange={(v) => { set({ isLowFuelAlertChecked: v }); fetchNui("showFuelAlert", { checked: v }); }} />
        <Checkbox checked={isCinematicNotifyChecked} primaryText={t.cinematicModeNotificationEnabled}
          onChange={(v) => { set({ isCinematicNotifyChecked: v }); fetchNui("showCinematicNotif", { checked: v }); }} />
      </div>

      <hr style={{ borderColor: "hsl(var(--border))" }} />

      <div className="my-3 text-base font-semibold" style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}><p>{t.statusMenu}</p></div>
      <div className="mx-4 mb-4 flex flex-col">
        {(["health", "armor", "hunger", "thirst", "stress", "oxygen"] as const).map((icon) => (
          <Checkbox key={icon} checked={dynamicIcons[icon]}
            primaryText={t[`show${icon.charAt(0).toUpperCase() + icon.slice(1)}Always` as keyof typeof t] as string}
            onChange={(v) => { setPlayer().updateShowingDynamicIcon(icon, v); fetchNui("dynamicChange"); }} />
        ))}
      </div>

      <hr style={{ borderColor: "hsl(var(--border))" }} />

      <div className="my-3 text-base font-semibold" style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}><p>{t.vehicleMenu}</p></div>
      <div className="mx-4 mb-4 flex flex-col">
        <Switch
          checked={isToggleMapShapeChecked === "circle"}
          checkedText={t.minimapTypeCircle}
          uncheckedText={t.minimapTypeSquare}
          onChange={(v) => {
            const shape = v ? "circle" : "square";
            set({ isToggleMapShapeChecked: shape });
            fetchNui("ToggleMapShape", { shape });
          }}
        />
        <p className="font-semibold text-base pb-2">{t.minimapTypeDescription}</p>

        <Switch
          checked={isUseMPHChecked}
          checkedText={t.metricsTypeMiles}
          uncheckedText={t.metricsTypeKmh}
          onChange={(v) => {
            set({ isUseMPHChecked: v });
            fetchNui("toggleSpeedUnit", { useMPH: v });
          }}
        />
        <p className="font-semibold text-base pb-2">{t.metricsTypeDescription}</p>

        <Checkbox checked={isMapEnabledChecked} primaryText={t.minimapEnabled}
          onChange={(v) => { set({ isMapEnabledChecked: v }); fetchNui("HideMap", { checked: v }); }} />
        <Checkbox checked={dynamicIcons.engine} primaryText={t.showEngineAlways}
          onChange={(v) => { setPlayer().updateShowingDynamicIcon("engine", v); fetchNui("dynamicChange"); }} />
        <Checkbox checked={dynamicIcons.nitro} primaryText={t.showNitroAlways}
          onChange={(v) => { setPlayer().updateShowingDynamicIcon("nitro", v); fetchNui("dynamicChange"); }} />
      </div>

      <hr style={{ borderColor: "hsl(var(--border))" }} />

      <div className="my-3 text-base font-semibold" style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}><p>{t.compassMenu}</p></div>
      <div className="mx-4 mb-4 flex flex-col">
        <Checkbox checked={isShowCompassChecked} primaryText={t.compassEnabled} secondaryText={t.compassEnabledDescription}
          onChange={(v) => { set({ isShowCompassChecked: v }); fetchNui("showCompassBase", { checked: v }); }} />
        <Checkbox checked={isShowStreetsChecked} primaryText={t.showStreetNamesEnabled} secondaryText={t.showStreetNamesDescription}
          onChange={(v) => { set({ isShowStreetsChecked: v }); fetchNui("showStreetsNames", { checked: v }); }} />
        <Checkbox checked={isPointerShowChecked} primaryText={t.showCompassPointerEnabled} secondaryText={t.showCompassPointerDescription}
          onChange={(v) => { set({ isPointerShowChecked: v }); fetchNui("showPointerIndex", { checked: v }); }} />
      </div>

      <hr style={{ borderColor: "hsl(var(--border))" }} />

      <div className="my-3 text-base font-semibold" style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}><p>{t.cinematicMenu}</p></div>
      <div className="mx-4 mb-4 flex flex-row gap-5">
        <Checkbox checked={isCinematicModeChecked} primaryText={t.showCinematicBarsEnabled}
          onChange={(v) => { set({ isCinematicModeChecked: v }); fetchNui("cinematicMode", { checked: v }); }} />
      </div>
    </div>
  );
}

import { useMenuStore } from "../../stores/menuStore";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { usePositioningStore } from "../../stores/positioningStore";
import { useVehicleThemeStore, SPEEDO_VARIANTS, type SpeedoVariant } from "../../stores/vehicleThemeStore";
import {
  usePlayerSkinStore,
  SKIN_PALETTES,
  VITAL_STYLES,
  type SkinPalette,
  type VitalStyle,
} from "../../stores/playerSkinStore";
import { useI18nStore } from "../../utils/i18n";
import { fetchNui } from "../../utils/eventHandler";
import Button from "../atoms/Button";
import Checkbox from "../atoms/Checkbox";
import Switch from "../atoms/Switch";
import HudSelect from "../atoms/HudSelect";
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

  const isAdmin = useMenuStore((s) => s.isAdmin);
  const vehicleTheme = useVehicleThemeStore((s) => s.theme);
  const speedoVariant = useVehicleThemeStore((s) => s.variant);
  const setVehicleTheme = useVehicleThemeStore((s) => s.setTheme);
  const setSpeedoVariant = useVehicleThemeStore((s) => s.setVariant);

  const playerSkin = usePlayerSkinStore((s) => s.skin);
  const skinPalette = usePlayerSkinStore((s) => s.palette);
  const vitalStyle = usePlayerSkinStore((s) => s.vitalStyle);
  const skinFrameless = usePlayerSkinStore((s) => s.frameless);
  const setPlayerSkin = usePlayerSkinStore((s) => s.setSkin);
  const setSkinPalette = usePlayerSkinStore((s) => s.setPalette);
  const setVitalStyle = usePlayerSkinStore((s) => s.setVitalStyle);
  const setSkinFrameless = usePlayerSkinStore((s) => s.setFrameless);

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

        {/* Tema da HUD de veiculo: classico (analogico) x digital (cluster). Admin escolhe. */}
        <p className="font-semibold text-base pt-1" style={{ color: "hsl(var(--foreground))" }}>{t.vehicleThemeLabel}</p>
        <div style={{ opacity: isAdmin ? 1 : 0.5, pointerEvents: isAdmin ? "auto" : "none" }}>
          <Switch
            checked={vehicleTheme === "digital"}
            checkedText={t.vehicleThemeDigital}
            uncheckedText={t.vehicleThemeClassic}
            onChange={(v) => setVehicleTheme(v ? "digital" : "classic")}
          />
          {vehicleTheme === "digital" && (
            <div className="pb-2">
              <p className="font-semibold text-base pb-1">{t.vehicleSpeedoVariantLabel}</p>
              <HudSelect
                values={SPEEDO_VARIANTS}
                value={speedoVariant}
                onChange={(v) => setSpeedoVariant(v as SpeedoVariant)}
              />
              <p className="text-base pt-1">{t.vehicleSpeedoVariantDescription}</p>
            </div>
          )}
        </div>
        <p className="font-semibold text-base pb-2">
          {isAdmin ? t.vehicleThemeDescription : t.vehicleThemeAdminOnly}
        </p>

        <Checkbox checked={isMapEnabledChecked} primaryText={t.minimapEnabled}
          onChange={(v) => { set({ isMapEnabledChecked: v }); fetchNui("HideMap", { checked: v }); }} />
        <Checkbox checked={dynamicIcons.engine} primaryText={t.showEngineAlways}
          onChange={(v) => { setPlayer().updateShowingDynamicIcon("engine", v); fetchNui("dynamicChange"); }} />
        <Checkbox checked={dynamicIcons.nitro} primaryText={t.showNitroAlways}
          onChange={(v) => { setPlayer().updateShowingDynamicIcon("nitro", v); fetchNui("dynamicChange"); }} />
      </div>

      <hr style={{ borderColor: "hsl(var(--border))" }} />

      {/* Skin do HUD do player: classico x sobrenatural. Admin escolhe. */}
      <div className="my-3 text-base font-semibold" style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}><p>{t.playerSkinLabel}</p></div>
      <div className="mx-4 mb-4 flex flex-col" style={{ opacity: isAdmin ? 1 : 0.5, pointerEvents: isAdmin ? "auto" : "none" }}>
        <Switch
          checked={playerSkin === "sobrenatural"}
          checkedText={t.playerSkinSupernatural}
          uncheckedText={t.playerSkinClassic}
          onChange={(v) => setPlayerSkin(v ? "sobrenatural" : "classic")}
        />
        {playerSkin === "sobrenatural" && (
          <div className="flex flex-col gap-3 pb-2">
            <div>
              <p className="font-semibold text-base pb-1">{t.skinPaletteLabel}</p>
              <HudSelect values={SKIN_PALETTES} value={skinPalette} onChange={(v) => setSkinPalette(v as SkinPalette)} />
            </div>
            <div>
              <p className="font-semibold text-base pb-1">{t.skinStyleLabel}</p>
              <HudSelect values={VITAL_STYLES} value={vitalStyle} onChange={(v) => setVitalStyle(v as VitalStyle)} />
            </div>
            <Checkbox checked={skinFrameless} primaryText={t.skinFramelessLabel}
              onChange={(v) => setSkinFrameless(v)} />
          </div>
        )}
        <p className="font-semibold text-base pb-2">
          {isAdmin ? t.playerSkinDescription : t.playerSkinAdminOnly}
        </p>
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

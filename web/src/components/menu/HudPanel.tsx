import type { ComponentType } from "react";
import {
  RotateCcw,
  Move,
  SlidersHorizontal,
  Bell,
  Activity,
  Car,
  Sparkles,
  Compass,
  Clapperboard,
} from "lucide-react";
import {
  MriButton,
  MriAccordion,
  MriAccordionItem,
  MriAccordionTrigger,
  MriAccordionContent,
  MriSettingToggle,
  MriSettingField,
  MriSegmentedTabs,
  MriSelect,
} from "@mriqbox/ui-kit";
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
import { useCompassStyleStore } from "../../stores/compassStyleStore";
import { useI18nStore } from "../../utils/i18n";
import { fetchNui } from "../../utils/eventHandler";
import PsLogo from "../atoms/PsLogo";

// Converte 'circle-ring' -> 'Circle Ring' pros labels dos selects.
function toLabel(str: string) {
  return str.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function toOptions(values: ReadonlyArray<string>) {
  return values.map((v) => ({ label: toLabel(v), value: v }));
}

// Item de accordion estilo card com header (icone + titulo uppercase). Vive
// dentro do MriAccordion (single) do painel.
function Section({
  value,
  icon: Icon,
  title,
  children,
}: {
  value: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <MriAccordionItem value={value} className="border border-border rounded-xl bg-card overflow-hidden">
      <MriAccordionTrigger className="group px-4 py-3 hover:no-underline">
        <span className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest group-data-[state=open]:text-primary">
          <Icon className="w-3.5 h-3.5" /> {title}
        </span>
      </MriAccordionTrigger>
      <MriAccordionContent className="px-4 pb-3 pt-0">{children}</MriAccordionContent>
    </MriAccordionItem>
  );
}

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

  const compassType = useCompassStyleStore((s) => s.type);
  const setCompassType = useCompassStyleStore((s) => s.setType);

  const dynamicIcons = usePlayerStatusHudStore((s) => s.dynamicIcons);

  const set = useMenuStore.setState;
  const setPlayer = usePlayerStatusHudStore.getState;

  return (
    // Accordion unico: abrir uma secao fecha as outras (type="single").
    <MriAccordion type="single" collapsible defaultValue="reset" className="flex flex-col gap-3 py-4">
      {/* ----- Reset / HUD ----- */}
      <Section value="reset" icon={RotateCcw} title={t.resetHud}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3 flex-1">
            <div>
              <MriButton
                variant="destructive"
                disabled={isRestarting}
                onClick={() => { fetchNui("restartHud"); set({ isRestarting: true }); }}
              >
                {isRestarting ? t.resettingHud : t.resetHud}
              </MriButton>
              <p className="text-xs text-muted-foreground mt-1.5">{t.resetHudDescription}</p>
            </div>
            <div>
              <MriButton
                variant="outline"
                onClick={() => {
                  useMenuStore.getState().resetHudMenuSetting();
                  useMenuStore.getState().sendMenuSettingsToClient();
                }}
              >
                {t.resetSettings}
              </MriButton>
              <p className="text-xs text-muted-foreground mt-1.5">{t.resetSettingsDescriptionLine1}</p>
              <p className="text-xs text-muted-foreground">{t.resetSettingsDescriptionLine2}</p>
            </div>
          </div>
          <div className="w-32 shrink-0 opacity-90">
            <PsLogo />
          </div>
        </div>
      </Section>

      {/* ----- Posicionamento ----- */}
      {positioningEnabled && (
        <Section value="positioning" icon={Move} title={t.positioningMenu}>
          <div className="flex flex-col gap-3">
            <div>
              <MriButton
                variant="outline"
                onClick={() => {
                  fetchNui("switchToPositioningMode");
                  useMenuStore.setState({ show: false });
                  usePositioningStore.setState({ active: true });
                }}
              >
                {t.openPositioningMode}
              </MriButton>
              <p className="text-xs text-muted-foreground mt-1.5">{t.openPositioningModeDescription}</p>
            </div>
            <div>
              <MriButton variant="destructive" onClick={() => usePositioningStore.getState().resetAll()}>
                {t.resetAllPositions}
              </MriButton>
              <p className="text-xs text-muted-foreground mt-1.5">{t.resetAllPositionsDescription}</p>
            </div>
          </div>
        </Section>
      )}

      {/* ----- Opções (veiculo: minimapa/bussola) ----- */}
      <Section value="options" icon={SlidersHorizontal} title={t.optionsMenu}>
        <div className="flex flex-col">
          <MriSettingToggle
            label={t.minimapVehicleCheckBoxPrimary}
            description={t.minimapVehicleCheckBoxSecondary}
            checked={isOutMapChecked}
            onCheckedChange={(v) => { set({ isOutMapChecked: v }); fetchNui("showOutMap", { checked: v }); }}
          />
          <MriSettingToggle
            label={t.compassVehicleCheckBoxPrimary}
            description={t.compassVehicleCheckBoxSecondary}
            checked={isOutCompassChecked}
            onCheckedChange={(v) => { set({ isOutCompassChecked: v }); fetchNui("showOutCompass", { checked: v }); }}
          />
          <MriSettingToggle
            label={t.compassFollowCheckBoxPrimary}
            description={t.compassFollowCheckBoxSecondary}
            checked={isCompassFollowChecked}
            onCheckedChange={(v) => { set({ isCompassFollowChecked: v }); fetchNui("showFollowCompass", { checked: v }); }}
          />
        </div>
      </Section>

      {/* ----- Notificações ----- */}
      <Section value="notifications" icon={Bell} title={t.notificationsMenu}>
        <div className="flex flex-col">
          <MriSettingToggle label={t.menuSoundEffectsEnabled} checked={isOpenMenuSoundsChecked}
            onCheckedChange={(v) => { set({ isOpenMenuSoundsChecked: v }); fetchNui("openMenuSounds", { checked: v }); }} />
          <MriSettingToggle label={t.resetSoundEffectsEnabled} checked={isResetSoundsChecked}
            onCheckedChange={(v) => { set({ isResetSoundsChecked: v }); fetchNui("resetHudSounds", { checked: v }); }} />
          <MriSettingToggle label={t.guiSoundEffectsEnabled} checked={isListSoundsChecked}
            onCheckedChange={(v) => { set({ isListSoundsChecked: v }); fetchNui("checklistSounds", { checked: v }); }} />
          <MriSettingToggle label={t.mapNotificationsEnabled} checked={isMapNotifyChecked}
            onCheckedChange={(v) => { set({ isMapNotifyChecked: v }); fetchNui("showMapNotif", { checked: v }); }} />
          <MriSettingToggle label={t.lowFuelNotificationsEnabled} checked={isLowFuelAlertChecked}
            onCheckedChange={(v) => { set({ isLowFuelAlertChecked: v }); fetchNui("showFuelAlert", { checked: v }); }} />
          <MriSettingToggle label={t.cinematicModeNotificationEnabled} checked={isCinematicNotifyChecked}
            onCheckedChange={(v) => { set({ isCinematicNotifyChecked: v }); fetchNui("showCinematicNotif", { checked: v }); }} />
        </div>
      </Section>

      {/* ----- Status (sempre visivel) ----- */}
      <Section value="status" icon={Activity} title={t.statusMenu}>
        <div className="flex flex-col">
          {(["health", "armor", "hunger", "thirst", "stress", "oxygen"] as const).map((icon) => (
            <MriSettingToggle
              key={icon}
              label={t[`show${icon.charAt(0).toUpperCase() + icon.slice(1)}Always` as keyof typeof t] as string}
              checked={dynamicIcons[icon]}
              onCheckedChange={(v) => { setPlayer().updateShowingDynamicIcon(icon, v); fetchNui("dynamicChange"); }}
            />
          ))}
        </div>
      </Section>

      {/* ----- Veículo ----- */}
      <Section value="vehicle" icon={Car} title={t.vehicleMenu}>
        <div className="flex flex-col gap-1">
          <MriSettingField label={t.minimapTypeDescription} layout="inline">
            <MriSegmentedTabs
              items={[
                { id: "circle", label: t.minimapTypeCircle },
                { id: "square", label: t.minimapTypeSquare },
              ]}
              value={isToggleMapShapeChecked}
              onChange={(shape) => { set({ isToggleMapShapeChecked: shape as "circle" | "square" }); fetchNui("ToggleMapShape", { shape }); }}
            />
          </MriSettingField>

          <MriSettingField label={t.metricsTypeDescription} layout="inline">
            <MriSegmentedTabs
              items={[
                { id: "kmh", label: t.metricsTypeKmh },
                { id: "mph", label: t.metricsTypeMiles },
              ]}
              value={isUseMPHChecked ? "mph" : "kmh"}
              onChange={(u) => { const v = u === "mph"; set({ isUseMPHChecked: v }); fetchNui("toggleSpeedUnit", { useMPH: v }); }}
            />
          </MriSettingField>

          {/* Tema da HUD de veiculo (admin) */}
          <div style={{ opacity: isAdmin ? 1 : 0.55, pointerEvents: isAdmin ? "auto" : "none" }}>
            <MriSettingField
              label={t.vehicleThemeLabel}
              description={isAdmin ? t.vehicleThemeDescription : t.vehicleThemeAdminOnly}
              layout="inline"
            >
              <MriSegmentedTabs
                items={[
                  { id: "classic", label: t.vehicleThemeClassic },
                  { id: "digital", label: t.vehicleThemeDigital },
                ]}
                value={vehicleTheme}
                onChange={(v) => setVehicleTheme(v as "classic" | "digital")}
              />
            </MriSettingField>
            {vehicleTheme === "digital" && (
              <MriSettingField label={t.vehicleSpeedoVariantLabel} description={t.vehicleSpeedoVariantDescription}>
                <MriSelect
                  options={toOptions(SPEEDO_VARIANTS)}
                  value={speedoVariant}
                  onChange={(v) => setSpeedoVariant(v as SpeedoVariant)}
                  className="w-full"
                />
              </MriSettingField>
            )}
          </div>

          <MriSettingToggle label={t.minimapEnabled} checked={isMapEnabledChecked}
            onCheckedChange={(v) => { set({ isMapEnabledChecked: v }); fetchNui("HideMap", { checked: v }); }} />
          <MriSettingToggle label={t.showEngineAlways} checked={dynamicIcons.engine}
            onCheckedChange={(v) => { setPlayer().updateShowingDynamicIcon("engine", v); fetchNui("dynamicChange"); }} />
          <MriSettingToggle label={t.showNitroAlways} checked={dynamicIcons.nitro}
            onCheckedChange={(v) => { setPlayer().updateShowingDynamicIcon("nitro", v); fetchNui("dynamicChange"); }} />
        </div>
      </Section>

      {/* ----- Skin do Player (admin) ----- */}
      <Section value="skin" icon={Sparkles} title={t.playerSkinLabel}>
        <div className="flex flex-col gap-1" style={{ opacity: isAdmin ? 1 : 0.55, pointerEvents: isAdmin ? "auto" : "none" }}>
          <MriSettingField
            label={t.playerSkinLabel}
            description={isAdmin ? t.playerSkinDescription : t.playerSkinAdminOnly}
            layout="inline"
          >
            <MriSegmentedTabs
              items={[
                { id: "classic", label: t.playerSkinClassic },
                { id: "sobrenatural", label: t.playerSkinSupernatural },
              ]}
              value={playerSkin}
              onChange={(v) => setPlayerSkin(v as "classic" | "sobrenatural")}
            />
          </MriSettingField>
          {playerSkin === "sobrenatural" && (
            <>
              <MriSettingField label={t.skinPaletteLabel}>
                <MriSelect options={toOptions(SKIN_PALETTES)} value={skinPalette}
                  onChange={(v) => setSkinPalette(v as SkinPalette)} className="w-full" />
              </MriSettingField>
              <MriSettingField label={t.skinStyleLabel}>
                <MriSelect options={toOptions(VITAL_STYLES)} value={vitalStyle}
                  onChange={(v) => setVitalStyle(v as VitalStyle)} className="w-full" />
              </MriSettingField>
              <MriSettingToggle label={t.skinFramelessLabel} checked={skinFrameless}
                onCheckedChange={(v) => setSkinFrameless(v)} />
            </>
          )}
        </div>
      </Section>

      {/* ----- Bússola ----- */}
      <Section value="compass" icon={Compass} title={t.compassMenu}>
        <div className="flex flex-col">
          <MriSettingField label={t.compassTypeLabel} description={t.compassTypeDescription} layout="inline">
            <MriSegmentedTabs
              items={[
                { id: "classic", label: t.vehicleThemeClassic },
                { id: "digital", label: t.vehicleThemeDigital },
              ]}
              value={compassType}
              onChange={(v) => setCompassType(v as "classic" | "digital")}
            />
          </MriSettingField>
          <MriSettingToggle label={t.compassEnabled} description={t.compassEnabledDescription} checked={isShowCompassChecked}
            onCheckedChange={(v) => { set({ isShowCompassChecked: v }); fetchNui("showCompassBase", { checked: v }); }} />
          <MriSettingToggle label={t.showStreetNamesEnabled} description={t.showStreetNamesDescription} checked={isShowStreetsChecked}
            onCheckedChange={(v) => { set({ isShowStreetsChecked: v }); fetchNui("showStreetsNames", { checked: v }); }} />
          <MriSettingToggle label={t.showCompassPointerEnabled} description={t.showCompassPointerDescription} checked={isPointerShowChecked}
            onCheckedChange={(v) => { set({ isPointerShowChecked: v }); fetchNui("showPointerIndex", { checked: v }); }} />
        </div>
      </Section>

      {/* ----- Cinematográfico ----- */}
      <Section value="cinematic" icon={Clapperboard} title={t.cinematicMenu}>
        <MriSettingToggle label={t.showCinematicBarsEnabled} checked={isCinematicModeChecked}
          onCheckedChange={(v) => { set({ isCinematicModeChecked: v }); fetchNui("cinematicMode", { checked: v }); }} />
      </Section>
    </MriAccordion>
  );
}

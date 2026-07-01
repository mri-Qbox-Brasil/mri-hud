import type { ComponentType } from "react";
import {
  RotateCcw,
  Move,
  SlidersHorizontal,
  Bell,
  Activity,
  Car,
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
} from "@mriqbox/ui-kit";
import { useMenuStore } from "../../stores/menuStore";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";
import { usePositioningStore } from "../../stores/positioningStore";
import { useT } from "../../utils/i18n";
import { fetchNui } from "../../utils/eventHandler";
import PsLogo from "../atoms/PsLogo";

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

/**
 * Aba "Preferências" — config funcional por jogador (não altera a identidade
 * visual/tema, que vive em [[AppearancePanel]]). Sons, notificações, alertas,
 * unidades, toggles de minimapa/bússola, "mostrar sempre" e cinematográfico.
 */
export default function PreferencesPanel() {
  const t = useT();

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
    // Accordion unico: abrir uma secao fecha as outras (type="single").
    <MriAccordion type="single" collapsible defaultValue="reset" className="flex flex-col gap-3 py-4">
      {/* ----- Reset / HUD ----- */}
      <Section value="reset" icon={RotateCcw} title={t("menu.reset.hud")}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3 flex-1">
            <div>
              <MriButton
                variant="destructive"
                disabled={isRestarting}
                onClick={() => { fetchNui("restartHud"); set({ isRestarting: true }); }}
              >
                {isRestarting ? t("menu.reset.resetting") : t("menu.reset.hud")}
              </MriButton>
              <p className="text-xs text-muted-foreground mt-1.5">{t("menu.reset.hud_desc")}</p>
            </div>
            <div>
              <MriButton
                variant="outline"
                onClick={() => {
                  useMenuStore.getState().resetHudMenuSetting();
                  useMenuStore.getState().sendMenuSettingsToClient();
                }}
              >
                {t("menu.reset.settings")}
              </MriButton>
              <p className="text-xs text-muted-foreground mt-1.5">{t("menu.reset.settings_desc_1")}</p>
              <p className="text-xs text-muted-foreground">{t("menu.reset.settings_desc_2")}</p>
            </div>
          </div>
          <div className="w-32 shrink-0 opacity-90">
            <PsLogo />
          </div>
        </div>
      </Section>

      {/* ----- Posicionamento ----- */}
      {positioningEnabled && (
        <Section value="positioning" icon={Move} title={t("menu.positioning.title")}>
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
                {t("menu.positioning.open")}
              </MriButton>
              <p className="text-xs text-muted-foreground mt-1.5">{t("menu.positioning.open_desc")}</p>
            </div>
            <div>
              <MriButton variant="destructive" onClick={() => usePositioningStore.getState().resetAll()}>
                {t("menu.positioning.reset_all")}
              </MriButton>
              <p className="text-xs text-muted-foreground mt-1.5">{t("menu.positioning.reset_all_desc")}</p>
            </div>
          </div>
        </Section>
      )}

      {/* ----- Opções (veiculo: minimapa/bussola) ----- */}
      <Section value="options" icon={SlidersHorizontal} title={t("menu.options.title")}>
        <div className="flex flex-col">
          <MriSettingToggle
            label={t("menu.options.minimap_vehicle")}
            description={t("menu.options.minimap_vehicle_desc")}
            checked={isOutMapChecked}
            onCheckedChange={(v) => { set({ isOutMapChecked: v }); fetchNui("showOutMap", { checked: v }); }}
          />
          <MriSettingToggle
            label={t("menu.options.compass_vehicle")}
            description={t("menu.options.compass_vehicle_desc")}
            checked={isOutCompassChecked}
            onCheckedChange={(v) => { set({ isOutCompassChecked: v }); fetchNui("showOutCompass", { checked: v }); }}
          />
          <MriSettingToggle
            label={t("menu.options.compass_follow")}
            description={t("menu.options.compass_follow_desc")}
            checked={isCompassFollowChecked}
            onCheckedChange={(v) => { set({ isCompassFollowChecked: v }); fetchNui("showFollowCompass", { checked: v }); }}
          />
        </div>
      </Section>

      {/* ----- Notificações ----- */}
      <Section value="notifications" icon={Bell} title={t("menu.notifications.title")}>
        <div className="flex flex-col">
          <MriSettingToggle label={t("menu.notifications.menu_sounds")} checked={isOpenMenuSoundsChecked}
            onCheckedChange={(v) => { set({ isOpenMenuSoundsChecked: v }); fetchNui("openMenuSounds", { checked: v }); }} />
          <MriSettingToggle label={t("menu.notifications.reset_sounds")} checked={isResetSoundsChecked}
            onCheckedChange={(v) => { set({ isResetSoundsChecked: v }); fetchNui("resetHudSounds", { checked: v }); }} />
          <MriSettingToggle label={t("menu.notifications.gui_sounds")} checked={isListSoundsChecked}
            onCheckedChange={(v) => { set({ isListSoundsChecked: v }); fetchNui("checklistSounds", { checked: v }); }} />
          <MriSettingToggle label={t("menu.notifications.map")} checked={isMapNotifyChecked}
            onCheckedChange={(v) => { set({ isMapNotifyChecked: v }); fetchNui("showMapNotif", { checked: v }); }} />
          <MriSettingToggle label={t("menu.notifications.low_fuel")} checked={isLowFuelAlertChecked}
            onCheckedChange={(v) => { set({ isLowFuelAlertChecked: v }); fetchNui("showFuelAlert", { checked: v }); }} />
          <MriSettingToggle label={t("menu.notifications.cinematic")} checked={isCinematicNotifyChecked}
            onCheckedChange={(v) => { set({ isCinematicNotifyChecked: v }); fetchNui("showCinematicNotif", { checked: v }); }} />
        </div>
      </Section>

      {/* ----- Status (mostrar sempre) ----- */}
      <Section value="status" icon={Activity} title={t("menu.status.title")}>
        <div className="flex flex-col">
          {(["health", "armor", "hunger", "thirst", "stress", "oxygen"] as const).map((icon) => (
            <MriSettingToggle
              key={icon}
              label={t(`menu.status.show_${icon}`)}
              checked={dynamicIcons[icon]}
              onCheckedChange={(v) => { setPlayer().updateShowingDynamicIcon(icon, v); fetchNui("dynamicChange"); }}
            />
          ))}
        </div>
      </Section>

      {/* ----- Veículo (funcional) ----- */}
      <Section value="vehicle" icon={Car} title={t("menu.vehicle.title")}>
        <div className="flex flex-col gap-1">
          <MriSettingField label={t("menu.vehicle.minimap_type_desc")} layout="inline">
            <MriSegmentedTabs
              items={[
                { id: "circle", label: t("menu.vehicle.minimap_circle") },
                { id: "square", label: t("menu.vehicle.minimap_square") },
              ]}
              value={isToggleMapShapeChecked}
              onChange={(shape) => { set({ isToggleMapShapeChecked: shape as "circle" | "square" }); fetchNui("ToggleMapShape", { shape }); }}
            />
          </MriSettingField>

          <MriSettingField label={t("menu.vehicle.metrics_desc")} layout="inline">
            <MriSegmentedTabs
              items={[
                { id: "kmh", label: t("menu.vehicle.metrics_kmh") },
                { id: "mph", label: t("menu.vehicle.metrics_mph") },
              ]}
              value={isUseMPHChecked ? "mph" : "kmh"}
              onChange={(u) => { const v = u === "mph"; set({ isUseMPHChecked: v }); fetchNui("toggleSpeedUnit", { useMPH: v }); }}
            />
          </MriSettingField>

          <MriSettingToggle label={t("menu.vehicle.minimap_enabled")} checked={isMapEnabledChecked}
            onCheckedChange={(v) => { set({ isMapEnabledChecked: v }); fetchNui("HideMap", { checked: v }); }} />
          <MriSettingToggle label={t("menu.vehicle.show_engine")} checked={dynamicIcons.engine}
            onCheckedChange={(v) => { setPlayer().updateShowingDynamicIcon("engine", v); fetchNui("dynamicChange"); }} />
          <MriSettingToggle label={t("menu.vehicle.show_nitro")} checked={dynamicIcons.nitro}
            onCheckedChange={(v) => { setPlayer().updateShowingDynamicIcon("nitro", v); fetchNui("dynamicChange"); }} />
        </div>
      </Section>

      {/* ----- Bússola (funcional) ----- */}
      <Section value="compass" icon={Compass} title={t("menu.compass.title")}>
        <div className="flex flex-col">
          <MriSettingToggle label={t("menu.compass.enabled")} description={t("menu.compass.enabled_desc")} checked={isShowCompassChecked}
            onCheckedChange={(v) => { set({ isShowCompassChecked: v }); fetchNui("showCompassBase", { checked: v }); }} />
          <MriSettingToggle label={t("menu.compass.street_names")} description={t("menu.compass.street_names_desc")} checked={isShowStreetsChecked}
            onCheckedChange={(v) => { set({ isShowStreetsChecked: v }); fetchNui("showStreetsNames", { checked: v }); }} />
          <MriSettingToggle label={t("menu.compass.pointer")} description={t("menu.compass.pointer_desc")} checked={isPointerShowChecked}
            onCheckedChange={(v) => { set({ isPointerShowChecked: v }); fetchNui("showPointerIndex", { checked: v }); }} />
        </div>
      </Section>

      {/* ----- Cinematográfico ----- */}
      <Section value="cinematic" icon={Clapperboard} title={t("menu.cinematic.title")}>
        <MriSettingToggle label={t("menu.cinematic.bars")} checked={isCinematicModeChecked}
          onCheckedChange={(v) => { set({ isCinematicModeChecked: v }); fetchNui("cinematicMode", { checked: v }); }} />
      </Section>
    </MriAccordion>
  );
}

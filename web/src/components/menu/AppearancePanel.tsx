import type { ComponentType } from "react";
import { Car, Sparkles, Compass } from "lucide-react";
import {
  MriAccordion,
  MriAccordionItem,
  MriAccordionTrigger,
  MriAccordionContent,
  MriSettingToggle,
  MriSettingField,
  MriSegmentedTabs,
  MriSelect,
  MriColorPicker,
} from "@mriqbox/ui-kit";
import { useMenuStore } from "../../stores/menuStore";
import { useVehicleThemeStore, SPEEDO_VARIANTS, type SpeedoVariant } from "../../stores/vehicleThemeStore";
import {
  usePlayerSkinStore,
  SKIN_PALETTES,
  VITAL_STYLES,
  type SkinPalette,
  type VitalStyle,
} from "../../stores/playerSkinStore";
import { useCompassStyleStore } from "../../stores/compassStyleStore";
import { useT } from "../../utils/i18n";

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

/**
 * Aba "Aparência" — identidade visual/temas (o que muda o sistema visual como
 * um todo). Tema da HUD de veiculo, skin do player e estilo da bussola. Config
 * funcional por jogador vive em [[PreferencesPanel]].
 */
export default function AppearancePanel() {
  const t = useT();

  const isAdmin = useMenuStore((s) => s.isAdmin);
  const vehicleTheme = useVehicleThemeStore((s) => s.theme);
  const speedoVariant = useVehicleThemeStore((s) => s.variant);
  const setVehicleTheme = useVehicleThemeStore((s) => s.setTheme);
  const setSpeedoVariant = useVehicleThemeStore((s) => s.setVariant);

  const playerSkin = usePlayerSkinStore((s) => s.skin);
  const skinPalette = usePlayerSkinStore((s) => s.palette);
  const vitalStyle = usePlayerSkinStore((s) => s.vitalStyle);
  const skinFrameless = usePlayerSkinStore((s) => s.frameless);
  const customPalette = usePlayerSkinStore((s) => s.customPalette);
  const setPlayerSkin = usePlayerSkinStore((s) => s.setSkin);
  const setSkinPalette = usePlayerSkinStore((s) => s.setPalette);
  const setVitalStyle = usePlayerSkinStore((s) => s.setVitalStyle);
  const setSkinFrameless = usePlayerSkinStore((s) => s.setFrameless);
  const setCustomPaletteColor = usePlayerSkinStore((s) => s.setCustomPaletteColor);

  const compassType = useCompassStyleStore((s) => s.type);
  const setCompassType = useCompassStyleStore((s) => s.setType);

  return (
    // Accordion unico: abrir uma secao fecha as outras (type="single").
    <MriAccordion type="single" collapsible defaultValue="vehicle" className="flex flex-col gap-3 py-4">
      {/* ----- Tema do veículo (admin) ----- */}
      <Section value="vehicle" icon={Car} title={t("menu.vehicle.title")}>
        <div className="flex flex-col gap-1" style={{ opacity: isAdmin ? 1 : 0.55, pointerEvents: isAdmin ? "auto" : "none" }}>
          <MriSettingField
            label={t("menu.appearance.vehicle_theme")}
            description={isAdmin ? t("menu.appearance.vehicle_theme_desc") : t("menu.appearance.vehicle_theme_admin")}
            layout="inline"
          >
            <MriSegmentedTabs
              items={[
                { id: "classic", label: t("menu.appearance.theme_classic") },
                { id: "digital", label: t("menu.appearance.theme_digital") },
              ]}
              value={vehicleTheme}
              onChange={(v) => setVehicleTheme(v as "classic" | "digital")}
            />
          </MriSettingField>
          {vehicleTheme === "digital" && (
            <MriSettingField label={t("menu.appearance.speedo_variant")} description={t("menu.appearance.speedo_variant_desc")}>
              <MriSelect
                options={toOptions(SPEEDO_VARIANTS)}
                value={speedoVariant}
                onChange={(v) => setSpeedoVariant(v as SpeedoVariant)}
                className="w-full"
              />
            </MriSettingField>
          )}
        </div>
      </Section>

      {/* ----- Skin do Player (admin) ----- */}
      <Section value="skin" icon={Sparkles} title={t("menu.appearance.player_skin")}>
        <div className="flex flex-col gap-1" style={{ opacity: isAdmin ? 1 : 0.55, pointerEvents: isAdmin ? "auto" : "none" }}>
          <MriSettingField
            label={t("menu.appearance.player_skin")}
            description={isAdmin ? t("menu.appearance.player_skin_desc") : t("menu.appearance.player_skin_admin")}
            layout="inline"
          >
            <MriSegmentedTabs
              items={[
                { id: "classic", label: t("menu.appearance.skin_classic") },
                { id: "sobrenatural", label: t("menu.appearance.skin_supernatural") },
              ]}
              value={playerSkin}
              onChange={(v) => setPlayerSkin(v as "classic" | "sobrenatural")}
            />
          </MriSettingField>
          {playerSkin === "sobrenatural" && (
            <>
              <MriSettingField label={t("menu.appearance.skin_palette")}>
                <MriSelect options={toOptions(SKIN_PALETTES)} value={skinPalette}
                  onChange={(v) => setSkinPalette(v as SkinPalette)} className="w-full" />
              </MriSettingField>
              {skinPalette === "custom" && (
                <MriSettingField label={t("menu.appearance.custom_palette")} description={t("menu.appearance.custom_palette_desc")}>
                  <div className="flex items-center gap-4">
                    {(["accent", "deep", "stone"] as const).map((field) => (
                      <div key={field} className="flex flex-col items-center gap-1">
                        <MriColorPicker active format="hex" color={customPalette[field]} onChange={(hex) => setCustomPaletteColor(field, hex)} />
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {t(`menu.appearance.custom_${field}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </MriSettingField>
              )}
              <MriSettingField label={t("menu.appearance.skin_style")}>
                <MriSelect options={toOptions(VITAL_STYLES)} value={vitalStyle}
                  onChange={(v) => setVitalStyle(v as VitalStyle)} className="w-full" />
              </MriSettingField>
              <MriSettingToggle label={t("menu.appearance.skin_frameless")} checked={skinFrameless}
                onCheckedChange={(v) => setSkinFrameless(v)} />
            </>
          )}
        </div>
      </Section>

      {/* ----- Estilo da Bússola ----- */}
      <Section value="compass" icon={Compass} title={t("menu.compass.title")}>
        <MriSettingField label={t("menu.compass.type")} description={t("menu.compass.type_desc")} layout="inline">
          <MriSegmentedTabs
            items={[
              { id: "classic", label: t("menu.appearance.theme_classic") },
              { id: "digital", label: t("menu.appearance.theme_digital") },
            ]}
            value={compassType}
            onChange={(v) => setCompassType(v as "classic" | "digital")}
          />
        </MriSettingField>
      </Section>
    </MriAccordion>
  );
}

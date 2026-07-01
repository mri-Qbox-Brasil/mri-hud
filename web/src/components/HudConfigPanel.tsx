import { useCallback, useEffect, useState } from "react";
import { Settings, Save, RotateCcw, Car, Sparkles, Gauge, ShieldAlert } from "lucide-react";
import {
  MriPageHeader,
  MriCard,
  MriButton,
  MriSpinner,
  MriSectionHeader,
  MriSettingToggle,
  MriSettingField,
  MriSegmentedTabs,
  MriSelect,
  MriNumberInput,
} from "@mriqbox/ui-kit";
import { fetchNui } from "../utils/eventHandler";
import { SPEEDO_VARIANTS } from "../stores/vehicleThemeStore";
import { SKIN_PALETTES, VITAL_STYLES } from "../stores/playerSkinStore";

// Configuracoes globais (Config.X primitivos) vindas do DB via server/settings.lua.
// Shape flexivel: o backend retorna todos os primitivos; aqui editamos um
// subconjunto curado com controles proprios.
type HudSettings = Record<string, string | number | boolean>;

const SUPERNATURAL_LAYOUTS = ["unido", "separado", "classico"] as const;

function toOptions(values: ReadonlyArray<string>) {
  return values.map((v) => ({
    label: v.charAt(0).toUpperCase() + v.slice(1),
    value: v,
  }));
}

interface Props {
  /** Quando true, omite container/padding externos (o host Qadmin ja prove). */
  embedded?: boolean;
}

export default function HudConfigPanel({ embedded = false }: Props) {
  const [config, setConfig] = useState<HudSettings | null>(null);
  const [draft, setDraft] = useState<HudSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dirty = !!(config && draft) && JSON.stringify(config) !== JSON.stringify(draft);

  useEffect(() => {
    fetchNui("adminGetConfig")
      .then((data: HudSettings) => {
        if (!data || typeof data !== "object") return;
        setConfig(data);
        setDraft(data);
      })
      .catch((err) => console.error("[mri-hud:config] fetch falhou:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const result = await fetchNui("adminSaveConfig", draft);
      if (result?.success) {
        const next = (result.config as HudSettings) ?? draft;
        setConfig(next);
        setDraft(next);
      }
    } catch (err) {
      console.error("[mri-hud:config] save falhou:", err);
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const handleReset = useCallback(() => setDraft(config), [config]);

  // Helpers tipados de leitura/escrita sobre o draft.
  const num = (k: string, fallback = 0) => (typeof draft?.[k] === "number" ? (draft![k] as number) : fallback);
  const str = (k: string, fallback = "") => (typeof draft?.[k] === "string" ? (draft![k] as string) : fallback);
  const bool = (k: string) => draft?.[k] === true;
  const setField = (k: string, v: string | number | boolean) =>
    setDraft((prev) => (prev ? { ...prev, [k]: v } : prev));

  if (loading || !draft) {
    return (
      <div className="flex items-center justify-center h-64">
        <MriSpinner />
      </div>
    );
  }

  const content = (
    <div className="p-6 space-y-6">
      <MriPageHeader title="Configurações da HUD" icon={Settings}>
        <MriButton variant="outline" onClick={handleReset} disabled={!dirty || saving}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reverter
        </MriButton>
        <MriButton onClick={handleSave} disabled={!dirty || saving} isLoading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </MriButton>
      </MriPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Veículo */}
        <MriCard className="p-4">
          <MriSectionHeader icon={Car} title="Veículo" />
          <div className="flex flex-col gap-1">
            <MriSettingToggle
              label="HUD de veículo habilitada"
              description="Mostra velocímetro/combustível dentro de veículos"
              checked={bool("VehicleEnabled")}
              onCheckedChange={(v) => setField("VehicleEnabled", v)}
            />
            <MriSettingField label="Tema do velocímetro" description="Visual padrão do cluster de veículo" layout="inline">
              <MriSegmentedTabs
                items={[
                  { id: "classic", label: "Clássico" },
                  { id: "digital", label: "Digital" },
                ]}
                value={str("VehicleHudTheme", "classic")}
                onChange={(v) => setField("VehicleHudTheme", v)}
              />
            </MriSettingField>
            {str("VehicleHudTheme", "classic") === "digital" && (
              <MriSettingField label="Formato do velocímetro (digital)">
                <MriSelect
                  options={toOptions(SPEEDO_VARIANTS)}
                  value={str("VehicleHudVariant", "ring")}
                  onChange={(v) => setField("VehicleHudVariant", v)}
                  className="w-full"
                />
              </MriSettingField>
            )}
            <MriSettingField label="Unidade de velocidade padrão" description="Nova conexão usa esta unidade" layout="inline">
              <MriSegmentedTabs
                items={[
                  { id: "kmh", label: "km/h" },
                  { id: "mph", label: "mph" },
                ]}
                value={bool("UseMPH") ? "mph" : "kmh"}
                onChange={(u) => setField("UseMPH", u === "mph")}
              />
            </MriSettingField>
            <MriSettingToggle
              label="Comando de motor embutido (+engine)"
              checked={bool("EngineCommand")}
              onCheckedChange={(v) => setField("EngineCommand", v)}
            />
          </div>
        </MriCard>

        {/* Skin do Player */}
        <MriCard className="p-4">
          <MriSectionHeader icon={Sparkles} title="Skin do Player" />
          <div className="flex flex-col gap-1">
            <MriSettingField label="Skin da HUD do player" layout="inline">
              <MriSegmentedTabs
                items={[
                  { id: "classic", label: "Clássico" },
                  { id: "sobrenatural", label: "Sobrenatural" },
                ]}
                value={str("PlayerHudSkin", "classic")}
                onChange={(v) => setField("PlayerHudSkin", v)}
              />
            </MriSettingField>
            {str("PlayerHudSkin", "classic") === "sobrenatural" && (
              <>
                <MriSettingField label="Paleta">
                  <MriSelect options={toOptions(SKIN_PALETTES)} value={str("SupernaturalPalette", "pergaminho")}
                    onChange={(v) => setField("SupernaturalPalette", v)} className="w-full" />
                </MriSettingField>
                <MriSettingField label="Estilo dos vitais">
                  <MriSelect options={toOptions(VITAL_STYLES)} value={str("SupernaturalStyle", "orbes")}
                    onChange={(v) => setField("SupernaturalStyle", v)} className="w-full" />
                </MriSettingField>
                <MriSettingField label="Layout">
                  <MriSelect options={toOptions(SUPERNATURAL_LAYOUTS)} value={str("SupernaturalLayout", "classico")}
                    onChange={(v) => setField("SupernaturalLayout", v)} className="w-full" />
                </MriSettingField>
                <MriSettingToggle
                  label="Sem moldura (frameless)"
                  description="Remove os fundos de pedra das orbes/dinheiro"
                  checked={bool("SupernaturalFrameless")}
                  onCheckedChange={(v) => setField("SupernaturalFrameless", v)}
                />
              </>
            )}
          </div>
        </MriCard>

        {/* Stress */}
        <MriCard className="p-4">
          <MriSectionHeader icon={Gauge} title="Stress" />
          <div className="flex flex-col gap-1">
            <MriSettingField label="Chance de stress ao atirar (0-1)" layout="inline">
              <MriNumberInput value={num("StressChance", 0.1)} min={0} max={1} step={0.05}
                onChange={(v) => setField("StressChance", v)} />
            </MriSettingField>
            <MriSettingField label="Stress mínimo p/ tremer a tela" layout="inline">
              <MriNumberInput value={num("MinimumStress", 50)} min={0} max={100} step={5}
                onChange={(v) => setField("MinimumStress", v)} />
            </MriSettingField>
            <MriSettingField label="Velocidade mínima p/ stress" layout="inline">
              <MriNumberInput value={num("MinimumSpeed", 100)} min={0} max={300} step={5}
                onChange={(v) => setField("MinimumSpeed", v)} />
            </MriSettingField>
            <MriSettingField label="Velocidade mínima sem cinto" layout="inline">
              <MriNumberInput value={num("MinimumSpeedUnbuckled", 50)} min={0} max={300} step={5}
                onChange={(v) => setField("MinimumSpeedUnbuckled", v)} />
            </MriSettingField>
            <MriSettingToggle
              label="Desabilitar stress p/ polícia"
              checked={bool("DisablePoliceStress")}
              onCheckedChange={(v) => setField("DisablePoliceStress", v)}
            />
          </div>
        </MriCard>

        {/* Geral */}
        <MriCard className="p-4">
          <MriSectionHeader icon={ShieldAlert} title="Geral" />
          <div className="flex flex-col gap-1">
            <MriSettingToggle
              label="Somente admin edita ícones/formas"
              description="Restringe a aba de customização de status aos admins"
              checked={bool("AdminOnly")}
              onCheckedChange={(v) => setField("AdminOnly", v)}
            />
          </div>
        </MriCard>
      </div>
    </div>
  );

  return embedded ? content : <div className="h-full overflow-auto bg-background">{content}</div>;
}

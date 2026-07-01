import { useState } from "react";
import { RotateCcw, Sparkles, Eye, EyeOff } from "lucide-react";
import {
  MriCard, MriButton, MriSwitch, MriInput, MriColorPicker,
  MriPopover, MriPopoverTrigger, MriPopoverContent,
} from "@mriqbox/ui-kit";
import { usePlayerSkinStore, SKIN_VITAL_KEYS, type SkinVitalKey } from "../../stores/playerSkinStore";
import { useMenuStore } from "../../stores/menuStore";
import { LABEL, GLYPH_DEFAULT, DEFAULT_VITAL_COLOR } from "../organisms/SupernaturalHud";
import { useT } from "../../utils/i18n";
import { GLYPH_GROUPS } from "./glyphChoices";

// Seletor de glifo: botão mostrando o glifo atual -> popover com grid de
// símbolos esotéricos (Unicode) por categoria + campo de texto livre. O glifo
// é sempre string (renderiza na fonte serif, igual à orbe). Vazio = default.
function GlyphPicker({ value, placeholder, onPick }: { value: string; placeholder: string; onPick: (g: string) => void }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const serif = { fontFamily: "'Cinzel', serif" };
  return (
    <MriPopover open={open} onOpenChange={setOpen}>
      <MriPopoverTrigger asChild>
        <button
          type="button"
          className="w-full h-9 rounded-md border border-border bg-background/60 hover:border-primary/60 transition-colors flex items-center justify-center text-lg"
          style={{ ...serif, color: value ? undefined : "hsl(var(--muted-foreground))" }}
        >
          {value || placeholder}
        </button>
      </MriPopoverTrigger>
      <MriPopoverContent className="w-72 max-h-80 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {GLYPH_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{group.label}</p>
              <div className="grid grid-cols-8 gap-1">
                {group.glyphs.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { onPick(g); setOpen(false); }}
                    className={`h-8 rounded flex items-center justify-center text-base hover:bg-muted transition-colors ${value === g ? "ring-1 ring-primary bg-primary/10" : ""}`}
                    style={serif}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <MriInput type="text" value={value} placeholder={placeholder} maxLength={2}
              onChange={(e) => onPick(e.target.value)} className="text-center" />
            <MriButton variant="ghost" size="sm" onClick={() => { onPick(""); setOpen(false); }}>
              {t("menu.icons.glyph_default")}
            </MriButton>
          </div>
        </div>
      </MriPopoverContent>
    </MriPopover>
  );
}

/**
 * Customizador do skin 'sobrenatural' — equivalente ao designer de icones do
 * skin classico, mas para os vitais desenhados pelo skin (orbes/aneis/etc).
 * Por vital: cor, glifo, rotulo e visibilidade. Posicao/escala continuam no
 * modo posicionamento (F10). Vive na aba "Icones de Status" quando o skin
 * ativo e o sobrenatural (substitui o aviso de "nao aplicavel").
 */
function VitalRow({ k }: { k: SkinVitalKey }) {
  const t = useT();
  const ov = usePlayerSkinStore((s) => s.vitalOverrides[k]);
  const setVitalOverride = usePlayerSkinStore((s) => s.setVitalOverride);
  const resetVitalOverride = usePlayerSkinStore((s) => s.resetVitalOverride);

  const visible = !ov?.hidden;

  return (
    <MriCard className="p-3">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm font-bold text-foreground">{ov?.label || LABEL[k]}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {t("menu.icons.vital_visible")}
          </span>
          <MriSwitch
            checked={visible}
            onCheckedChange={(v) => setVitalOverride(k, { hidden: !v })}
            aria-label={t("menu.icons.vital_visible")}
          />
          <MriButton variant="ghost" size="sm" onClick={() => resetVitalOverride(k)} aria-label={t("menu.icons.reset")}>
            <RotateCcw className="w-3.5 h-3.5" />
          </MriButton>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_1.4fr] gap-3 items-end" style={{ opacity: visible ? 1 : 0.5 }}>
        <Field label={t("menu.icons.vital_color")}>
          <MriColorPicker
            active
            format="hex"
            color={ov?.color || DEFAULT_VITAL_COLOR[k]}
            onChange={(hex) => setVitalOverride(k, { color: hex })}
          />
        </Field>
        <Field label={t("menu.icons.vital_glyph")}>
          <GlyphPicker
            value={ov?.glyph ?? ""}
            placeholder={GLYPH_DEFAULT[k]}
            onPick={(g) => setVitalOverride(k, { glyph: g })}
          />
        </Field>
        <Field label={t("menu.icons.vital_label")}>
          <MriInput
            type="text"
            value={ov?.label ?? ""}
            placeholder={LABEL[k]}
            maxLength={16}
            onChange={(e) => setVitalOverride(k, { label: e.target.value })}
          />
        </Field>
      </div>
    </MriCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export default function SupernaturalCustomizer() {
  const t = useT();
  const isAdmin = useMenuStore((s) => s.isAdmin);
  const resetVitalOverrides = usePlayerSkinStore((s) => s.resetVitalOverrides);

  return (
    <div className="flex flex-col gap-4 py-4" style={{ opacity: isAdmin ? 1 : 0.55, pointerEvents: isAdmin ? "auto" : "none" }}>
      <MriCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">{t("menu.icons.skin_title")}</p>
              <p className="text-xs text-muted-foreground max-w-md">{t("menu.icons.skin_desc")}</p>
            </div>
          </div>
          <MriButton variant="destructive" size="sm" onClick={resetVitalOverrides}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            {t("menu.icons.reset_all")}
          </MriButton>
        </div>
      </MriCard>

      <div className="flex flex-col gap-3">
        {SKIN_VITAL_KEYS.map((k) => (
          <VitalRow key={k} k={k} />
        ))}
      </div>
    </div>
  );
}

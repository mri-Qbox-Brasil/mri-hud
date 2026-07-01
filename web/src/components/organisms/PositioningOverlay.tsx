import { MriButton, MriSwitch } from "@mriqbox/ui-kit";
import { usePositioningStore } from "../../stores/positioningStore";
import { fetchNui } from "../../utils/eventHandler";
import { useT } from "../../utils/i18n";

export default function PositioningOverlay() {
    const active = usePositioningStore((s) => s.active);
    const showAll = usePositioningStore((s) => s.showAll);
    const toggleShowAll = usePositioningStore((s) => s.toggleShowAll);
    const toggle = usePositioningStore((s) => s.toggle);
    const resetAll = usePositioningStore((s) => s.resetAll);
    const t = useT();

    function close() {
        fetchNui("closePositioningMode");
        toggle();
    }

    if (!active) return null;

    return (
        <>
            {/* Grid de alinhamento — accent bem sutil, so como guia visual. */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 30,
                    pointerEvents: "none",
                    backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)
          `,
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Header bar — chrome neutro (card + border + foreground). */}
            <div
                className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4 py-2 bg-card/95 border-b border-border text-foreground select-none"
                style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em" }}
            >
                <span className="text-foreground">{t("menu.positioning.mode_title")}</span>

                <div className="flex items-center gap-4">
                    {/* Toggle: filtrar só o contexto atual vs mostrar todos os instrumentos. */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <MriSwitch checked={showAll} onCheckedChange={toggleShowAll} aria-label={t("menu.positioning.show_all") || "Mostrar tudo"} />
                        <span className="text-muted-foreground">{t("menu.positioning.show_all") || "Mostrar tudo"}</span>
                    </label>
                    <MriButton variant="destructive" size="sm" onClick={resetAll}>
                        {t("menu.positioning.reset_all_short")}
                    </MriButton>
                    <MriButton variant="default" size="sm" onClick={close}>
                        {t("menu.positioning.close")}
                    </MriButton>
                </div>
            </div>
        </>
    );
}

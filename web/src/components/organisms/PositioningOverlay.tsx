import { MriButton } from "@mriqbox/ui-kit";
import { usePositioningStore } from "../../stores/positioningStore";
import { fetchNui } from "../../utils/eventHandler";
import { useI18nStore } from "../../utils/i18n";

export default function PositioningOverlay() {
    const active = usePositioningStore((s) => s.active);
    const toggle = usePositioningStore((s) => s.toggle);
    const resetAll = usePositioningStore((s) => s.resetAll);
    const t = useI18nStore((s) => s.translations);

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
                <span className="text-foreground">{t.positioningModeTitle}</span>

                <div className="flex gap-2">
                    <MriButton variant="destructive" size="sm" onClick={resetAll}>
                        {t.positioningResetAll}
                    </MriButton>
                    <MriButton variant="default" size="sm" onClick={close}>
                        {t.positioningClose}
                    </MriButton>
                </div>
            </div>
        </>
    );
}

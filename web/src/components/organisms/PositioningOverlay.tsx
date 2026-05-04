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
            {/* Grid background */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 30,
                    pointerEvents: "none",
                    backgroundImage: `
            linear-gradient(rgba(59,130,246,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)
          `,
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Header bar */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 16px",
                    background: "rgba(15,23,42,0.92)",
                    borderBottom: "1px solid rgba(59,130,246,0.4)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    userSelect: "none",
                    letterSpacing: "0.04em",
                }}
            >
                <span style={{ color: "rgba(147,197,253,0.95)" }}>
                    {t.positioningModeTitle}
                </span>

                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={resetAll}
                        style={{
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.4)",
                            color: "rgba(252,165,165,0.9)",
                            borderRadius: 6,
                            padding: "4px 12px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        {t.positioningResetAll}
                    </button>
                    <button
                        onClick={close}
                        style={{
                            background: "rgba(59,130,246,0.2)",
                            border: "1px solid rgba(59,130,246,0.5)",
                            color: "rgba(147,197,253,0.95)",
                            borderRadius: 6,
                            padding: "4px 12px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        {t.positioningClose}
                    </button>
                </div>
            </div>
        </>
    );
}

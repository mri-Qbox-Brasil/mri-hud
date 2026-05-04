import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCode, faChevronDown, faChevronUp,
    faArrowsUpDownLeftRight, faBars, faEye, faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";
import { usePositioningStore } from "../../stores/positioningStore";
import { useMenuStore } from "../../stores/menuStore";
import { usePlayerStatusHudStore } from "../../stores/playerStatusHudStore";

export default function DevPanel() {
    const [open, setOpen] = useState(false);

    const positioningActive = usePositioningStore((s) => s.active);
    const togglePositioning = usePositioningStore((s) => s.toggle);
    const resetAll = usePositioningStore((s) => s.resetAll);

    const menuOpen = useMenuStore((s) => s.show);
    const openMenu = useMenuStore((s) => s.receiveMessage);

    const designMode = usePlayerStatusHudStore((s) => s.designMode);

    return (
        <div
            style={{
                position: "fixed",
                bottom: 12,
                right: 12,
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 6,
                pointerEvents: "auto",
                fontFamily: "monospace",
            }}
        >
            {open && (
                <div
                    style={{
                        background: "rgba(10,15,28,0.95)",
                        border: "1px solid rgba(59,130,246,0.35)",
                        borderRadius: 10,
                        padding: "10px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        minWidth: 200,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
                    }}
                >
                    <div style={{ color: "rgba(147,197,253,0.6)", fontSize: 10, letterSpacing: "0.1em", marginBottom: 2 }}>
                        DEV TOOLS
                    </div>

                    <DevButton
                        icon={faArrowsUpDownLeftRight}
                        label="Posicionamento"
                        active={positioningActive}
                        onClick={togglePositioning}
                    />

                    <DevButton
                        icon={faBars}
                        label="Menu"
                        active={menuOpen}
                        onClick={openMenu}
                    />

                    <DevButton
                        icon={faEye}
                        label="Design Mode"
                        active={designMode}
                        onClick={() =>
                            usePlayerStatusHudStore.setState((s) => ({ designMode: !s.designMode }))
                        }
                    />

                    {positioningActive && (
                        <button
                            onClick={resetAll}
                            style={{
                                marginTop: 4,
                                background: "rgba(239,68,68,0.12)",
                                border: "1px solid rgba(239,68,68,0.3)",
                                color: "rgba(252,165,165,0.8)",
                                borderRadius: 6,
                                padding: "4px 10px",
                                cursor: "pointer",
                                fontSize: 11,
                                fontFamily: "monospace",
                            }}
                        >
                            Resetar posições
                        </button>
                    )}
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => setOpen((o) => !o)}
                title="Dev Tools"
                style={{
                    background: open ? "rgba(59,130,246,0.25)" : "rgba(10,15,28,0.85)",
                    border: `1px solid ${open ? "rgba(59,130,246,0.6)" : "rgba(59,130,246,0.2)"}`,
                    color: open ? "rgba(147,197,253,0.95)" : "rgba(147,197,253,0.6)",
                    borderRadius: 8,
                    width: 34,
                    height: 34,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    fontSize: 13,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    transition: "all 0.15s",
                }}
            >
                <FontAwesomeIcon icon={faCode} />
                <FontAwesomeIcon icon={open ? faChevronDown : faChevronUp} style={{ fontSize: 9 }} />
            </button>
        </div>
    );
}

function DevButton({
    icon, label, active, onClick,
}: {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: active ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: active ? "rgba(147,197,253,0.95)" : "rgba(255,255,255,0.55)",
                borderRadius: 6,
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "monospace",
                textAlign: "left",
                transition: "all 0.12s",
            }}
        >
            <FontAwesomeIcon icon={icon} style={{ width: 13, opacity: active ? 1 : 0.5 }} />
            <span style={{ flex: 1 }}>{label}</span>
            <span style={{ fontSize: 10, opacity: 0.6 }}>{active ? "ON" : "OFF"}</span>
        </button>
    );
}

import { useRef, useState, useCallback } from "react";
import { faSliders, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useMenuStore } from "../../stores/menuStore";
import { useI18nStore } from "../../utils/i18n";
import HudPanel from "../menu/HudPanel";
import StatusIconsPanel from "../menu/StatusIconsPanel";

interface Tab {
    key: string;
    labelKey: "generalTab" | "customizationTab";
    icon: typeof faSliders;
    adminOnly: boolean;
    content: React.ComponentType;
}

const TABS: Tab[] = [
    { key: "hud", labelKey: "generalTab", icon: faSliders, adminOnly: false, content: HudPanel },
    { key: "status", labelKey: "customizationTab", icon: faCircleNotch, adminOnly: true, content: StatusIconsPanel },
];

export default function Menu() {
    const show = useMenuStore((s) => s.show);
    const adminOnly = useMenuStore((s) => s.adminOnly);
    const isAdmin = useMenuStore((s) => s.isAdmin);
    const t = useI18nStore((s) => s.translations);

    const [activeKey, setActiveKey] = useState("hud");

    // Drag state
    const posRef = useRef({ x: Math.round(window.innerWidth / 5), y: Math.round(window.innerHeight / 5) });
    const [pos, setPos] = useState(posRef.current);
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

    const onDragMouseDown = useCallback((e: React.MouseEvent) => {
        dragging.current = true;
        dragStart.current = { mx: e.clientX, my: e.clientY, ox: posRef.current.x, oy: posRef.current.y };
        const onMove = (ev: MouseEvent) => {
            if (!dragging.current) return;
            const x = dragStart.current.ox + (ev.clientX - dragStart.current.mx);
            const y = dragStart.current.oy + (ev.clientY - dragStart.current.my);
            posRef.current = { x, y };
            setPos({ x, y });
        };
        const onUp = () => {
            dragging.current = false;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }, []);

    if (!show) return null;

    const visibleTabs = TABS.filter((t) => !t.adminOnly || !adminOnly || (adminOnly && isAdmin));
    const activeTab = visibleTabs.find((t) => t.key === activeKey) ?? visibleTabs[0];

    return (
        <section
            className="w-[60vw] h-[60vh] flex flex-col rounded-t-2xl shadow-lg text-white"
            style={{
                position: "fixed", left: pos.x, top: pos.y, zIndex: 200,
                background: "rgba(10,15,28,0.97)",
                border: "1px solid rgba(59,130,246,0.25)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.1)",
            }}
        >
            {/* Drag handle */}
            <div
                className="drag-bar rounded-t-2xl select-none"
                onMouseDown={onDragMouseDown}
                style={{
                    cursor: "grab",
                    background: "rgba(15,23,42,0.8)",
                    borderBottom: "1px solid rgba(59,130,246,0.18)",
                }}
            >
                <svg role="img" aria-label="drag handle" viewBox="0 0 24 24" height={24} width={24} className="mx-auto transition-opacity" style={{ opacity: 0.3 }}>
                    <path fill="rgba(147,197,253,0.8)" d="M3,15V13H5V15H3M3,11V9H5V11H3M7,15V13H9V15H7M7,11V9H9V11H7M11,15V13H13V15H11M11,11V9H13V11H11M15,15V13H17V15H15M15,11V9H17V11H15M19,15V13H21V15H19M19,11V9H21V11H19Z" />
                </svg>
            </div>

            <div className="flex font-semibold" style={{ height: "calc(100% - 24px)" }}>
                {/* Sidebar tabs */}
                <div
                    className="flex flex-col w-1/6"
                    style={{
                        background: "rgba(15,23,42,0.9)",
                        borderRight: "1px solid rgba(59,130,246,0.18)",
                    }}
                >
                    {visibleTabs.map((tab) => {
                        const vbW = tab.icon.icon[0];
                        const vbH = tab.icon.icon[1];
                        const pathData = tab.icon.icon[4] as string;
                        const isActive = activeTab.key === tab.key;
                        return (
                            <div
                                key={tab.key}
                                className="px-4 py-4 flex flex-row gap-3 cursor-pointer select-none transition-colors"
                                style={{
                                    background: isActive ? "rgba(30,58,138,0.5)" : "transparent",
                                    borderLeft: isActive ? "2px solid rgba(96,165,250,0.8)" : "2px solid transparent",
                                    color: isActive ? "rgba(147,197,253,1)" : "rgba(147,197,253,0.6)",
                                }}
                                onClick={() => setActiveKey(tab.key)}
                            >
                                <svg width="16" height="16" viewBox={`0 0 ${vbW} ${vbH}`} className="shrink-0 mt-0.5">
                                    <path d={pathData} fill="currentColor" />
                                </svg>
                                <span>{t[tab.labelKey]}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Tab content */}
                {visibleTabs.map((tab) => (
                    <div
                        key={tab.key}
                        className="flex-col w-5/6 px-5 overflow-y-scroll"
                        style={{
                            display: activeTab.key === tab.key ? "flex" : "none",
                            background: "rgba(10,15,28,0.6)",
                        }}
                    >
                        <tab.content />
                    </div>
                ))}
            </div>
        </section>
    );
}

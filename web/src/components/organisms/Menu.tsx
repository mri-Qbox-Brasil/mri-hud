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
            className="w-[60vw] h-[60vh] flex flex-col rounded-t-2xl text-foreground bg-background/95 border border-primary/25 shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
            style={{ position: "fixed", left: pos.x, top: pos.y, zIndex: 200 }}
        >
            {/* Drag handle */}
            <div
                className="drag-bar rounded-t-2xl select-none bg-card/80 border-b border-primary/20"
                onMouseDown={onDragMouseDown}
                style={{ cursor: "grab" }}
            >
                <svg role="img" aria-label="drag handle" viewBox="0 0 24 24" height={24} width={24} className="mx-auto text-primary/60" style={{ opacity: 0.4 }}>
                    <path fill="currentColor" d="M3,15V13H5V15H3M3,11V9H5V11H3M7,15V13H9V15H7M7,11V9H9V11H7M11,15V13H13V15H11M11,11V9H13V11H11M15,15V13H17V15H15M15,11V9H17V11H15M19,15V13H21V15H19M19,11V9H21V11H19Z" />
                </svg>
            </div>

            <div className="flex font-semibold" style={{ height: "calc(100% - 24px)" }}>
                {/* Sidebar tabs */}
                <div className="flex flex-col w-1/6 bg-card/90 border-r border-primary/20">
                    {visibleTabs.map((tab) => {
                        const vbW = tab.icon.icon[0];
                        const vbH = tab.icon.icon[1];
                        const pathData = tab.icon.icon[4] as string;
                        const isActive = activeTab.key === tab.key;
                        return (
                            <div
                                key={tab.key}
                                className={`px-4 py-4 flex flex-row gap-3 cursor-pointer select-none transition-colors border-l-2 ${
                                    isActive
                                        ? "bg-primary/15 border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
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
                        className="flex-col w-5/6 px-5 overflow-y-scroll bg-background/60"
                        style={{ display: activeTab.key === tab.key ? "flex" : "none" }}
                    >
                        <tab.content />
                    </div>
                ))}
            </div>
        </section>
    );
}

import { useRef, useState, useCallback } from "react";
import { GripHorizontal, SlidersHorizontal, Palette, X } from "lucide-react";
import { MriSegmentedTabs, MriScrollArea } from "@mriqbox/ui-kit";
import { useMenuStore } from "../../stores/menuStore";
import { useI18nStore } from "../../utils/i18n";
import HudPanel from "../menu/HudPanel";
import StatusIconsPanel from "../menu/StatusIconsPanel";

interface Tab {
    key: string;
    labelKey: "generalTab" | "customizationTab";
    icon: typeof SlidersHorizontal;
    adminOnly: boolean;
    content: React.ComponentType;
}

const TABS: Tab[] = [
    { key: "hud", labelKey: "generalTab", icon: SlidersHorizontal, adminOnly: false, content: HudPanel },
    { key: "status", labelKey: "customizationTab", icon: Palette, adminOnly: true, content: StatusIconsPanel },
];

export default function Menu() {
    const show = useMenuStore((s) => s.show);
    const adminOnly = useMenuStore((s) => s.adminOnly);
    const isAdmin = useMenuStore((s) => s.isAdmin);
    const t = useI18nStore((s) => s.translations);

    const [activeKey, setActiveKey] = useState("hud");

    // Drag state
    const posRef = useRef({ x: Math.round(window.innerWidth / 5), y: Math.round(window.innerHeight / 6) });
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

    const visibleTabs = TABS.filter((tab) => !tab.adminOnly || !adminOnly || (adminOnly && isAdmin));
    const activeTab = visibleTabs.find((tab) => tab.key === activeKey) ?? visibleTabs[0];
    const ActiveContent = activeTab.content;

    return (
        <section
            className="w-[58vw] max-w-[860px] h-[64vh] flex flex-col rounded-2xl overflow-hidden text-foreground bg-background/95 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            style={{ position: "fixed", left: pos.x, top: pos.y, zIndex: 90 }}
        >
            {/* Header / drag handle */}
            <div
                className="drag-bar flex items-center gap-3 px-4 py-3 select-none bg-card/80 border-b border-border"
                onMouseDown={onDragMouseDown}
                style={{ cursor: "grab" }}
            >
                <GripHorizontal className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                <span className="text-sm font-bold tracking-wide text-foreground">HUD</span>
                {visibleTabs.length > 1 && (
                    <div className="ml-2" onMouseDown={(e) => e.stopPropagation()}>
                        <MriSegmentedTabs
                            items={visibleTabs.map((tab) => ({ id: tab.key, label: t[tab.labelKey], icon: tab.icon }))}
                            value={activeTab.key}
                            onChange={setActiveKey}
                        />
                    </div>
                )}
                <button
                    type="button"
                    aria-label="close"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => useMenuStore.getState().closeMenu()}
                    className="ml-auto grid place-items-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Tab content */}
            <MriScrollArea className="flex-1 min-h-0">
                <div className="px-5">
                    <ActiveContent />
                </div>
            </MriScrollArea>
        </section>
    );
}

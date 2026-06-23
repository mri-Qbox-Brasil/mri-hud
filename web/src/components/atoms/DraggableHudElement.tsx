import { useRef, useCallback, useState, useLayoutEffect, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye, faEyeSlash, faArrowsUpDownLeftRight,
    faRotateLeft, faRotate, faMinus, faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { usePositioningStore } from "../../stores/positioningStore";
import { HudScaleContext } from "./hudScaleContext";

interface Props {
    id: string;
    label: string;
    zIndex?: number;
    canRotate?: boolean;
    canResize?: boolean;
    children: ReactNode;
}

export default function DraggableHudElement({
    id, label, zIndex = 10, canRotate = false, canResize: canResizeProp = true, children,
}: Props) {
    const active = usePositioningStore((s) => s.active);
    const el = usePositioningStore((s) => s.elements[id]);
    const move = usePositioningStore((s) => s.move);
    const toggleHidden = usePositioningStore((s) => s.toggleHidden);
    const toggleVertical = usePositioningStore((s) => s.toggleVertical);
    const rescale = usePositioningStore((s) => s.rescale);
    const reset = usePositioningStore((s) => s.reset);
    const perm = usePositioningStore((s) => s.permissions[id]);
    const canMove = perm?.canMove ?? true;
    const canHide = perm?.canHide ?? true;
    // canResizeProp is the hard component-level cap; perm.canResize is the server config gate
    const canResize = canResizeProp && (perm?.canResize ?? true);

    const dx = el?.dx ?? 0;
    const dy = el?.dy ?? 0;
    const hidden = el?.hidden ?? false;
    const vertical = el?.vertical ?? false;
    const scale = el?.scale ?? 1;

    const [dragging, setDragging] = useState(false);
    const [naturalBounds, setNaturalBounds] = useState<{ l: number; t: number; r: number; b: number } | null>(null);

    const dragRef = useRef({ startX: 0, startY: 0, startDx: 0, startDy: 0 });
    const boundsRef = useRef({ minDx: -Infinity, maxDx: Infinity, minDy: -Infinity, maxDy: Infinity });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    // Refs so the layout effect reads current dx/dy without them being deps
    const dxRef = useRef(dx);
    const dyRef = useRef(dy);
    dxRef.current = dx;
    dyRef.current = dy;

    const MARGIN = 20;

    // Measure the element's visual center when entering positioning mode
    useLayoutEffect(() => {
        if (!active || !wrapperRef.current) return;
        const wrapper = wrapperRef.current;
        const badge = badgeRef.current;
        let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
        // querySelectorAll scans all descendants — needed for containers with width:0
        // whose content is only visible via deeply nested position:absolute children.
        // SVG descendant elements are skipped: clipPath hides their content but NOT
        // their DOM bounding boxes, which can be enormous (e.g. horizon sky/ground rects).
        // Only the root <svg> element is used — its bbox correctly reflects layout size.
        for (const el of Array.from(wrapper.querySelectorAll<HTMLElement>("*"))) {
            if (badge && (el === badge || badge.contains(el))) continue;
            if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            L = Math.min(L, r.left);
            T = Math.min(T, r.top);
            R = Math.max(R, r.right);
            B = Math.max(B, r.bottom);
        }
        if (L !== Infinity) {
            // screen pos already includes dx/dy; subtract to get natural (dx=0) coords
            const ox = dxRef.current;
            const oy = dyRef.current;
            setNaturalBounds({ l: L - ox, t: T - oy, r: R - ox, b: B - oy });
        }
        return () => setNaturalBounds(null);
    }, [active]);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Compute bounds from element content (badge excluded) so clamping tracks the actual visual
        const wrapper = wrapperRef.current;
        if (wrapper) {
            const badge = badgeRef.current;
            let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
            for (const el of Array.from(wrapper.querySelectorAll<HTMLElement>("*"))) {
                if (badge && (el === badge || badge.contains(el))) continue;
                if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
                const r = el.getBoundingClientRect();
                if (r.width === 0 && r.height === 0) continue;
                L = Math.min(L, r.left);
                T = Math.min(T, r.top);
                R = Math.max(R, r.right);
                B = Math.max(B, r.bottom);
            }
            if (L !== Infinity) {
                boundsRef.current = {
                    minDx: MARGIN - L + dx,
                    maxDx: window.innerWidth - MARGIN - R + dx,
                    minDy: MARGIN - T + dy,
                    maxDy: window.innerHeight - MARGIN - B + dy,
                };
            }
        }

        dragRef.current = { startX: e.clientX, startY: e.clientY, startDx: dx, startDy: dy };
        setDragging(true);

        const onMove = (ev: MouseEvent) => {
            const { minDx, maxDx, minDy, maxDy } = boundsRef.current;
            const ndx = Math.max(minDx, Math.min(maxDx,
                dragRef.current.startDx + ev.clientX - dragRef.current.startX));
            const ndy = Math.max(minDy, Math.min(maxDy,
                dragRef.current.startDy + ev.clientY - dragRef.current.startY));
            move(id, ndx, ndy);
        };
        const onUp = () => {
            setDragging(false);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }, [dx, dy, id, move]);

    if (hidden && !active) return null;

    const hasOffset = dx !== 0 || dy !== 0;
    const hasCustomScale = Math.abs(scale - 1) > 0.005;
    const transform = hasOffset ? `translate(${dx}px, ${dy}px)` : undefined;
    const naturalCenter = naturalBounds
        ? { x: (naturalBounds.l + naturalBounds.r) / 2, y: (naturalBounds.t + naturalBounds.b) / 2 }
        : null;

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "fixed",
                inset: 0,
                overflow: "visible",
                pointerEvents: "none",
                zIndex,
                transform,
                opacity: hidden ? 0.3 : 1,
            }}
        >
            <HudScaleContext.Provider value={scale}>
                {children}
            </HudScaleContext.Provider>

            {/* Transparent drag target covering the full element — lets you grab from anywhere */}
            {active && naturalBounds && canMove && (
                <div
                    style={{
                        position: "absolute",
                        left: naturalBounds.l,
                        top: naturalBounds.t,
                        width: naturalBounds.r - naturalBounds.l,
                        height: naturalBounds.b - naturalBounds.t,
                        pointerEvents: "auto",
                        cursor: dragging ? "grabbing" : "grab",
                        zIndex: 9997,
                    }}
                    onMouseDown={onMouseDown}
                />
            )}

            {/* Drag-active outline overlay */}
            {dragging && naturalBounds && (
                <div
                    style={{
                        position: "absolute",
                        left: naturalBounds.l - 6,
                        top: naturalBounds.t - 6,
                        width: naturalBounds.r - naturalBounds.l + 12,
                        height: naturalBounds.b - naturalBounds.t + 12,
                        border: "2px solid hsl(var(--primary))",
                        boxShadow: "0 0 12px hsl(var(--primary) / 0.5), inset 0 0 8px hsl(var(--primary) / 0.15)",
                        borderRadius: 6,
                        pointerEvents: "none",
                        zIndex: 9998,
                    }}
                />
            )}

            {active && naturalBounds && naturalCenter && (canMove || canHide || canResize) && (
                <div
                    ref={badgeRef}
                    style={{
                        position: "absolute",
                        left: naturalCenter.x,
                        top: naturalBounds.b + 8,
                        transform: "translate(-50%, 0)",
                        pointerEvents: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: dragging ? "hsl(var(--primary) / 0.22)" : "hsl(var(--card))",
                        border: `1px solid ${dragging ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                        borderRadius: 8,
                        padding: "4px 8px",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 600,
                        userSelect: "none",
                        boxShadow: dragging
                            ? "0 0 10px hsl(var(--primary) / 0.4), 0 2px 8px rgba(0,0,0,0.5)"
                            : "0 2px 8px rgba(0,0,0,0.5)",
                        cursor: canMove ? (dragging ? "grabbing" : "grab") : "default",
                        zIndex: 9999,
                        whiteSpace: "nowrap",
                        opacity: dragging ? 0.5 : 1,
                        transition: "background 0.1s, border-color 0.1s, opacity 0.1s",
                    }}
                    onMouseDown={canMove ? onMouseDown : undefined}
                >
                    {canMove && (
                        <FontAwesomeIcon
                            icon={faArrowsUpDownLeftRight}
                            style={{
                                color: dragging ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                                fontSize: 11,
                                flexShrink: 0,
                            }}
                        />
                    )}
                    <span style={{ color: dragging ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))", letterSpacing: "0.04em" }}>
                        {label}
                    </span>

                    {canHide && (
                        <BadgeBtn
                            title={hidden ? "Mostrar" : "Ocultar"}
                            onClick={() => toggleHidden(id)}
                            icon={hidden ? faEye : faEyeSlash}
                        />
                    )}

                    {canMove && canRotate && (
                        <BadgeBtn
                            title={vertical ? "Horizontal" : "Vertical"}
                            onClick={() => toggleVertical(id)}
                            icon={faRotate}
                            color={vertical ? "rgba(167,243,208,0.9)" : "rgba(255,255,255,0.55)"}
                        />
                    )}

                    {canResize && (
                        <>
                            <BadgeBtn
                                title="Diminuir"
                                onClick={() => rescale(id, scale / 1.1)}
                                icon={faMinus}
                                color="rgba(255,255,255,0.7)"
                            />
                            <span style={{
                                color: hasCustomScale ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.5)",
                                fontSize: 10,
                                minWidth: 28,
                                textAlign: "center",
                                userSelect: "none",
                            }}>
                                {Math.round(scale * 100)}%
                            </span>
                            <BadgeBtn
                                title="Aumentar"
                                onClick={() => rescale(id, scale * 1.1)}
                                icon={faPlus}
                                color="rgba(255,255,255,0.7)"
                            />
                        </>
                    )}

                    {canMove && (hasOffset || hasCustomScale) && (
                        <BadgeBtn
                            title="Resetar posição"
                            onClick={() => reset(id)}
                            icon={faRotateLeft}
                            color="hsl(var(--destructive))"
                        />
                    )}
                </div>
            )}
        </div>
    );
}

function BadgeBtn({
    title, onClick, icon, color = "rgba(255,255,255,0.8)",
}: {
    title: string;
    onClick: () => void;
    icon: any;
    color?: string;
}) {
    return (
        <button
            style={{
                background: "none", border: "none", color,
                cursor: "pointer", padding: "0 2px", lineHeight: 1, flexShrink: 0,
            }}
            title={title}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
            <FontAwesomeIcon icon={icon} style={{ fontSize: 12 }} />
        </button>
    );
}

import { useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowsUpDownLeftRight, faRotateLeft, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { usePositioningStore } from "../../stores/positioningStore";
import { useDynamicGaugesStore, type GaugeConfig } from "../../stores/dynamicGaugesStore";
import PartialCircleRing from "../molecules/hud-shapes/PartialCircleRing";
import AnalogGauge from "../molecules/hud-shapes/AnalogGauge";

interface Props {
    cfg: GaugeConfig;
    value: number;
    icon: IconDefinition | null;
}

export default function DraggableGauge({ cfg, value, icon }: Props) {
    const active = usePositioningStore((s) => s.active);
    const perm = usePositioningStore((s) => s.permissions["dynamicGauges"]);
    const override = usePositioningStore((s) => s.gaugeOverrides[cfg.id]);
    const setGaugePosition = usePositioningStore((s) => s.setGaugePosition);
    const setGaugeVisibility = usePositioningStore((s) => s.setGaugeVisibility);
    const rescaleGauge = usePositioningStore((s) => s.rescaleGauge);
    const resetGauge = usePositioningStore((s) => s.resetGauge);

    const canMove = perm?.canMove ?? true;
    const canHide = perm?.canHide ?? true;
    const canResize = perm?.canResize ?? true;

    const isShowing = override?.isShowing !== false;
    const hasOverride = override?.x != null || override?.y != null;
    const gaugeScale = override?.scale ?? 1;
    const scaledSize = Math.round(cfg.size * gaugeScale);
    const hasCustomScale = Math.abs(gaugeScale - 1) > 0.005;

    const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
    const [dragging, setDragging] = useState(false);
    const dragRef = useRef({ startMouseX: 0, startMouseY: 0, startCfgX: 0, startCfgY: 0 });

    const baseX = override?.x ?? cfg.x;
    const baseY = override?.y ?? cfg.y;
    const displayX = preview?.x ?? baseX;
    const displayY = preview?.y ?? baseY;

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragRef.current = { startMouseX: e.clientX, startMouseY: e.clientY, startCfgX: baseX, startCfgY: baseY };
        setDragging(true);

        const halfPx = scaledSize / 2 + 10;
        const minX = (halfPx / window.innerWidth) * 100;
        const maxX = 100 - minX;
        const minY = (halfPx / window.innerHeight) * 100;
        const maxY = 100 - minY;
        const clamp = (nx: number, ny: number) => ({
            x: Math.max(minX, Math.min(maxX, nx)),
            y: Math.max(minY, Math.min(maxY, ny)),
        });

        const onMove = (ev: MouseEvent) => {
            const nx = dragRef.current.startCfgX + ((ev.clientX - dragRef.current.startMouseX) / window.innerWidth) * 100;
            const ny = dragRef.current.startCfgY + ((ev.clientY - dragRef.current.startMouseY) / window.innerHeight) * 100;
            setPreview(clamp(nx, ny));
        };

        const onUp = (ev: MouseEvent) => {
            const nx = dragRef.current.startCfgX + ((ev.clientX - dragRef.current.startMouseX) / window.innerWidth) * 100;
            const ny = dragRef.current.startCfgY + ((ev.clientY - dragRef.current.startMouseY) / window.innerHeight) * 100;
            const clamped = clamp(nx, ny);
            setGaugePosition(cfg.id, clamped.x, clamped.y);
            setPreview(null);
            setDragging(false);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }, [cfg.id, cfg.size, baseX, baseY, setGaugePosition]);

    if (!isShowing && !active) return null;

    return (
        <div
            style={{
                position: "fixed",
                left: `${displayX}vw`,
                top: `${displayY}vh`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 20,
                opacity: !isShowing && active ? 0.35 : 1,
                userSelect: "none",
            }}
        >
            {/* Drag-active glow ring */}
            {dragging && (
                <div
                    style={{
                        position: "absolute",
                        inset: -6,
                        borderRadius: "50%",
                        border: "2px solid rgba(59,130,246,0.9)",
                        boxShadow: "0 0 12px rgba(59,130,246,0.5), inset 0 0 8px rgba(59,130,246,0.15)",
                        pointerEvents: "none",
                    }}
                />
            )}

            {cfg.style === "analog" ? (
                <AnalogGauge
                    size={scaledSize}
                    value={value}
                    minValue={cfg.minValue ?? 0}
                    maxValue={cfg.maxValue}
                    arcLength={cfg.arcLength}
                    rotation={cfg.rotation}
                    majorTickInterval={cfg.majorTickInterval ?? Math.ceil(cfg.maxValue / 5)}
                    minorTickCount={cfg.minorTickCount ?? 4}
                    ringSize={cfg.ringSize}
                    color={dragging ? "#3b82f6" : cfg.color}
                    outlineColor={dragging ? "#3b82f6" : cfg.outlineColor}
                    outlineOpacity={cfg.outlineOpacity}
                    needleStyle={cfg.needleStyle ?? "needle"}
                    showValue={cfg.showValue}
                    unit={cfg.unit}
                    label={cfg.label}
                />
            ) : (
                <PartialCircleRing
                    height={scaledSize}
                    width={scaledSize}
                    progressValue={value}
                    maxProgressValue={cfg.maxValue}
                    maxLengthDisplay={cfg.arcLength}
                    rotateDegree={cfg.rotation}
                    ringSize={cfg.ringSize}
                    progressColor={dragging ? "#3b82f6" : cfg.color}
                    outlineColor={dragging ? "#3b82f6" : cfg.outlineColor}
                    outlineColorOpacity={cfg.outlineOpacity}
                    displayOutline
                    icon={icon}
                    iconColor={dragging ? "#93c5fd" : cfg.color}
                    iconScaling={0.38}
                    text={cfg.showValue ? (cfg.label ?? "") : ""}
                    displayNumber={cfg.showValue ? Math.round(value) : 0}
                />
            )}

            {/* Transparent drag target */}
            {active && canMove && (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: scaledSize,
                        height: scaledSize,
                        borderRadius: "50%",
                        pointerEvents: "auto",
                        cursor: dragging ? "grabbing" : "grab",
                        zIndex: 9997,
                    }}
                    onMouseDown={onMouseDown}
                />
            )}

            {/* Badge below the gauge */}
            {active && (canMove || canHide) && (
                <div
                    style={{
                        position: "absolute",
                        left: scaledSize / 2,
                        top: scaledSize + 8,
                        transform: "translate(-50%, 0)",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: dragging ? "rgba(30,58,138,0.95)" : "rgba(15,23,42,0.88)",
                        border: `1px solid ${dragging ? "rgba(96,165,250,0.9)" : "rgba(59,130,246,0.7)"}`,
                        borderRadius: 7,
                        padding: "3px 8px",
                        color: "white",
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        boxShadow: dragging
                            ? "0 0 10px rgba(59,130,246,0.4), 0 2px 8px rgba(0,0,0,0.5)"
                            : "0 2px 8px rgba(0,0,0,0.5)",
                        pointerEvents: "auto",
                        cursor: "default",
                        zIndex: 9999,
                        opacity: dragging ? 0.5 : 1,
                        transition: "background 0.1s, border-color 0.1s, opacity 0.1s",
                    }}
                >
                    {canMove && (
                        <FontAwesomeIcon
                            icon={faArrowsUpDownLeftRight}
                            style={{ color: dragging ? "rgba(147,197,253,1)" : "rgba(147,197,253,0.85)", fontSize: 10 }}
                        />
                    )}
                    <span style={{ color: dragging ? "#93c5fd" : "rgba(147,197,253,0.9)" }}>
                        {cfg.label ?? cfg.id}
                    </span>

                    {canHide && (
                        <button
                            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.75)", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}
                            title={isShowing ? "Ocultar" : "Mostrar"}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => setGaugeVisibility(cfg.id, !isShowing)}
                        >
                            <FontAwesomeIcon icon={isShowing ? faEyeSlash : faEye} style={{ fontSize: 11 }} />
                        </button>
                    )}

                    {canResize && (
                        <>
                            <button
                                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}
                                title="Diminuir"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={() => rescaleGauge(cfg.id, gaugeScale / 1.1)}
                            >
                                <FontAwesomeIcon icon={faMinus} style={{ fontSize: 10 }} />
                            </button>
                            <span style={{
                                color: hasCustomScale ? "rgba(200,230,255,0.95)" : "rgba(147,197,253,0.45)",
                                fontSize: 10,
                                minWidth: 28,
                                textAlign: "center",
                                userSelect: "none",
                            }}>
                                {Math.round(gaugeScale * 100)}%
                            </span>
                            <button
                                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}
                                title="Aumentar"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={() => rescaleGauge(cfg.id, gaugeScale * 1.1)}
                            >
                                <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} />
                            </button>
                        </>
                    )}

                    {canMove && (hasOverride || hasCustomScale) && (
                        <button
                            style={{ background: "none", border: "none", color: "rgba(252,165,165,0.85)", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}
                            title="Resetar posição"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => resetGauge(cfg.id)}
                        >
                            <FontAwesomeIcon icon={faRotateLeft} style={{ fontSize: 11 }} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

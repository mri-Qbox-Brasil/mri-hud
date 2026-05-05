import { useMemo } from "react";

interface Props {
    size: number;
    value: number;
    minValue: number;
    maxValue: number;
    /** Arc span as % of full circle (0–100). 75 = 270°. */
    arcLength: number;
    /** Start angle in degrees clockwise from 12 o'clock. */
    rotation: number;
    majorTickInterval: number;
    minorTickCount: number;
    ringSize: number;
    color: string;
    outlineColor: string;
    outlineOpacity: number;
    needleStyle: "needle" | "digital" | "arc";
    showValue: boolean;
    unit?: string;
    label?: string;
    odometer?: string;
}

interface Tick {
    x1: number; y1: number;
    x2: number; y2: number;
    isMajor: boolean;
    label?: string;
    labelX: number; labelY: number;
}

// Degrees-from-top (clockwise) → SVG {x, y}
function polar(cx: number, cy: number, r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// SVG arc path (clockwise)
function arcPath(cx: number, cy: number, r: number, fromDeg: number, spanDeg: number): string {
    if (spanDeg <= 0) return "";
    const s = polar(cx, cy, r, fromDeg);
    const e = polar(cx, cy, r, fromDeg + spanDeg);
    const large = spanDeg > 180 ? 1 : 0;
    return `M${s.x.toFixed(3)},${s.y.toFixed(3)} A${r},${r} 0 ${large} 1 ${e.x.toFixed(3)},${e.y.toFixed(3)}`;
}

export default function AnalogGauge({
    size, value, minValue, maxValue,
    arcLength, rotation, majorTickInterval, minorTickCount,
    ringSize, color, outlineColor, outlineOpacity,
    needleStyle, showValue, unit, label, odometer,
}: Props) {
    const cx = size / 2;
    const cy = size / 2;

    const geo = useMemo(() => {
        const outerR   = size / 2 - 2;
        const spanDeg  = (arcLength / 100) * 360;
        const trackR   = outerR - ringSize / 2;
        const tickOutR = trackR - ringSize / 2 - 3;
        const majLen   = outerR * 0.12;
        const minLen   = outerR * 0.065;
        const labelR   = tickOutR - majLen - outerR * 0.05;
        const needleR  = trackR * 0.88;
        const hubR     = Math.max(4, outerR * 0.065);

        // Clamp & fraction
        const cval     = Math.max(minValue, Math.min(maxValue, value));
        const frac     = maxValue > minValue ? (cval - minValue) / (maxValue - minValue) : 0;
        const valueDeg = rotation + frac * spanDeg;

        // Track and progress arcs
        const track    = arcPath(cx, cy, trackR, rotation, spanDeg);
        const progress = arcPath(cx, cy, trackR, rotation, frac * spanDeg);

        // Major tick values
        const majorVals: number[] = [];
        for (let v = minValue; v <= maxValue + majorTickInterval * 0.001; v += majorTickInterval) {
            majorVals.push(parseFloat(Math.min(v, maxValue).toFixed(10)));
        }
        if (majorVals[majorVals.length - 1] < maxValue - majorTickInterval * 0.001) {
            majorVals.push(maxValue);
        }

        // Build ticks
        const ticks: Tick[] = [];
        for (let mi = 0; mi < majorVals.length; mi++) {
            const mv    = majorVals[mi];
            const mFrac = (mv - minValue) / (maxValue - minValue);
            const mDeg  = rotation + mFrac * spanDeg;
            const outer = polar(cx, cy, tickOutR, mDeg);
            const inner = polar(cx, cy, tickOutR - majLen, mDeg);
            const lp    = polar(cx, cy, labelR, mDeg);
            ticks.push({
                x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y,
                isMajor: true, label: String(Math.round(mv)),
                labelX: lp.x, labelY: lp.y,
            });

            if (mi < majorVals.length - 1 && minorTickCount > 0) {
                const nv = majorVals[mi + 1];
                for (let j = 1; j <= minorTickCount; j++) {
                    const mf   = mFrac + (j / (minorTickCount + 1)) * ((nv - minValue) / (maxValue - minValue) - mFrac);
                    const md   = rotation + mf * spanDeg;
                    const mo   = polar(cx, cy, tickOutR, md);
                    const mi2  = polar(cx, cy, tickOutR - minLen, md);
                    ticks.push({
                        x1: mo.x, y1: mo.y, x2: mi2.x, y2: mi2.y,
                        isMajor: false, labelX: 0, labelY: 0,
                    });
                }
            }
        }

        return { outerR, trackR, hubR, needleR, ticks, track, progress, valueDeg, cval };
    }, [size, value, minValue, maxValue, arcLength, rotation, majorTickInterval, minorTickCount, ringSize, cx, cy]);

    const { outerR, hubR, needleR, ticks, track, progress, valueDeg, cval } = geo;
    const labelFs  = outerR * 0.145;
    const needleW  = Math.max(1.5, outerR * 0.025);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", overflow: "visible" }}>

            {/* Bezel */}
            <circle cx={cx} cy={cy} r={outerR} fill="rgba(0,0,0,0.88)" />
            <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />

            {/* Track arc */}
            {track && (
                <path d={track} fill="none"
                    stroke={outlineColor} strokeOpacity={outlineOpacity}
                    strokeWidth={ringSize} strokeLinecap="round" />
            )}

            {/* Progress arc */}
            {progress && (
                <path d={progress} fill="none"
                    stroke={color} strokeWidth={ringSize} strokeLinecap="round" />
            )}

            {/* Ticks */}
            {ticks.map((t, i) => (
                <line key={i}
                    x1={t.x1.toFixed(2)} y1={t.y1.toFixed(2)}
                    x2={t.x2.toFixed(2)} y2={t.y2.toFixed(2)}
                    stroke={t.isMajor ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.38)"}
                    strokeWidth={t.isMajor ? 1.5 : 0.9}
                    strokeLinecap="round"
                />
            ))}

            {/* Scale labels */}
            {ticks.filter(t => t.isMajor).map((t, i) => (
                <text key={i}
                    x={t.labelX.toFixed(2)} y={t.labelY.toFixed(2)}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.8)"
                    fontSize={labelFs.toFixed(1)}
                    fontFamily="system-ui, sans-serif"
                    fontWeight="400"
                >
                    {t.label}
                </text>
            ))}

            {/* ── Needle style ── */}
            {needleStyle === "needle" && (
                <>
                    <g transform={`translate(${cx},${cy}) rotate(${valueDeg})`}>
                        {/* Needle shaft */}
                        <line x1="0" y1={hubR + 1} x2="0" y2={-needleR}
                            stroke="white" strokeWidth={needleW} strokeLinecap="round" opacity="0.95" />
                        {/* Counterweight */}
                        <line x1="0" y1={hubR + 1} x2="0" y2={outerR * 0.12}
                            stroke="rgba(255,255,255,0.4)" strokeWidth={needleW * 1.6} strokeLinecap="round" />
                    </g>
                    <circle cx={cx} cy={cy} r={hubR} fill={color} />
                    <circle cx={cx} cy={cy} r={hubR * 0.45} fill="rgba(0,0,0,0.6)" />

                    {showValue && (
                        <>
                            <text x={cx} y={cy + outerR * 0.30}
                                textAnchor="middle" dominantBaseline="middle"
                                fill="white" fontSize={(outerR * 0.22).toFixed(1)}
                                fontFamily="system-ui, sans-serif" fontWeight="700">
                                {Math.round(cval)}
                            </text>
                            {unit && (
                                <text x={cx} y={cy + outerR * 0.46}
                                    textAnchor="middle" dominantBaseline="middle"
                                    fill="rgba(255,255,255,0.5)"
                                    fontSize={(outerR * 0.11).toFixed(1)}
                                    fontFamily="system-ui, sans-serif" fontWeight="500"
                                    letterSpacing="2">
                                    {unit.toUpperCase()}
                                </text>
                            )}
                            {odometer && (() => {
                                const panelW = outerR * 0.92;
                                const panelH = outerR * 0.26;
                                const panelX = cx - panelW / 2;
                                const panelY = cy + outerR * 0.52;
                                const textY  = panelY + panelH / 2;
                                const fs     = (outerR * 0.148).toFixed(1);
                                const ghost  = odometer.replace(/\d/g, "8");
                                return (
                                    <>
                                        {/* LCD panel */}
                                        <rect
                                            x={panelX.toFixed(2)} y={panelY.toFixed(2)}
                                            width={panelW.toFixed(2)} height={panelH.toFixed(2)}
                                            rx="2" ry="2"
                                            fill="rgba(4,9,5,0.92)"
                                            stroke="rgba(90,160,100,0.18)" strokeWidth="0.5"
                                        />
                                        {/* Ghost segments */}
                                        <text x={cx} y={textY.toFixed(2)}
                                            textAnchor="middle" dominantBaseline="middle"
                                            fill="rgba(110,200,120,0.13)"
                                            fontSize={fs}
                                            fontFamily='"Courier New", monospace'>
                                            {ghost}
                                        </text>
                                        {/* Active segments */}
                                        <text x={cx} y={textY.toFixed(2)}
                                            textAnchor="middle" dominantBaseline="middle"
                                            fill="#82de8c"
                                            fontSize={fs}
                                            fontFamily='"Courier New", monospace'
                                            fontWeight="600">
                                            {odometer}
                                        </text>
                                    </>
                                );
                            })()}
                        </>
                    )}
                </>
            )}

            {/* ── Digital style ── */}
            {needleStyle === "digital" && (
                <>
                    <circle cx={cx} cy={cy} r={outerR * 0.38} fill="rgba(0,0,0,0.45)" />
                    {showValue && (
                        <text x={cx} y={unit ? cy - outerR * 0.06 : cy}
                            textAnchor="middle" dominantBaseline="middle"
                            fill="white" fontSize={(outerR * 0.30).toFixed(1)}
                            fontFamily="system-ui, sans-serif" fontWeight="700"
                            letterSpacing="-0.5">
                            {Math.round(cval)}
                        </text>
                    )}
                    {unit && (
                        <text x={cx} y={cy + outerR * 0.22}
                            textAnchor="middle" dominantBaseline="middle"
                            fill="rgba(255,255,255,0.55)"
                            fontSize={(outerR * 0.12).toFixed(1)}
                            fontFamily="system-ui, sans-serif" fontWeight="500"
                            letterSpacing="2">
                            {unit.toUpperCase()}
                        </text>
                    )}
                </>
            )}

            {/* ── Arc style (small gauges) ── */}
            {needleStyle === "arc" && showValue && (
                <text x={cx} y={cy}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize={(outerR * 0.26).toFixed(1)}
                    fontFamily="system-ui, sans-serif" fontWeight="700">
                    {Math.round(cval)}
                </text>
            )}

            {/* Bottom label — hidden when odometer occupies that space */}
            {label && !(needleStyle === "needle" && odometer) && (
                <text x={cx} y={cy + outerR * (needleStyle === "needle" ? 0.60 : 0.55)}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.38)"
                    fontSize={(outerR * 0.095).toFixed(1)}
                    fontFamily="system-ui, sans-serif" fontWeight="400"
                    letterSpacing="1.5">
                    {label.toUpperCase()}
                </text>
            )}
        </svg>
    );
}

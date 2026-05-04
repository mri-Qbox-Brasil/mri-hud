import { useId } from "react";

interface Props {
    size: number;
    pitch: number; // degrees, positive = nose up
    roll: number;  // degrees, GetEntityRotation(v,2).y — positive = right bank in GTA V
}

function polar(cx: number, cy: number, r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Bank scale marks: [angle from top (CW positive), tick length multiplier, isMajor]
const BANK_MARKS: Array<[number, number, boolean]> = [
    [0, 1.0, true],
    [10, 0.5, false], [-10, 0.5, false],
    [20, 0.5, false], [-20, 0.5, false],
    [30, 0.75, true], [-30, 0.75, true],
    [45, 0.55, false], [-45, 0.55, false],
    [60, 0.75, true], [-60, 0.75, true],
];

export default function ArtificialHorizon({ size, pitch, roll }: Props) {
    const uid = useId();
    const clipId = `ah-clip-${uid}`;

    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 2;
    const clipR = outerR - 4;

    // 50° of pitch fills half the instrument
    const pxPerDeg = clipR / 50;
    // Positive pitch → horizon moves down → pitchOffset positive (more sky)
    const pitchOffset = pitch * pxPerDeg;
    // roll maps directly: positive roll = right bank = CW SVG rotation
    const bankAngle = roll;

    const bigR = clipR * 2.8;
    const bankArcR = outerR * 0.88;
    const bankTickLen = outerR * 0.08;

    const ladderW = [clipR * 0.18, clipR * 0.28, clipR * 0.38];
    const labelFs = outerR * 0.1;

    const pitchLines: Array<{ deg: number; y: number; w: number; major: boolean }> = [];
    for (const deg of [-30, -20, -10, -5, 5, 10, 20, 30]) {
        const absDeg = Math.abs(deg);
        const tier = absDeg >= 20 ? 2 : absDeg >= 10 ? 1 : 0;
        pitchLines.push({ deg, y: -deg * pxPerDeg, w: ladderW[tier], major: absDeg % 10 === 0 });
    }

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", overflow: "visible" }}>
            <defs>
                <clipPath id={clipId}>
                    <circle cx={cx} cy={cy} r={clipR} />
                </clipPath>
            </defs>

            {/* ── Rolling horizon (clipped) ── */}
            <g clipPath={`url(#${clipId})`}>
                <g transform={`translate(${cx},${cy}) rotate(${bankAngle}) translate(0,${pitchOffset.toFixed(2)})`}>
                    {/* Sky */}
                    <rect x={-bigR} y={-bigR} width={bigR * 2} height={bigR} fill="#1a4fa0" />
                    {/* Ground */}
                    <rect x={-bigR} y={0} width={bigR * 2} height={bigR} fill="#7a5230" />
                    {/* Sky gradient at horizon */}
                    <rect x={-bigR} y={-4} width={bigR * 2} height={4} fill="rgba(255,255,255,0.06)" />
                    {/* Horizon line */}
                    <line x1={-bigR} y1={0} x2={bigR} y2={0}
                        stroke="rgba(255,255,255,0.92)" strokeWidth={1.5} />

                    {/* Pitch ladder */}
                    {pitchLines.map(({ deg, y, w, major }) => (
                        <g key={deg}>
                            <line x1={-w} y1={y} x2={w} y2={y}
                                stroke="rgba(255,255,255,0.75)"
                                strokeWidth={major ? 1.2 : 0.85}
                                strokeLinecap="round" />
                            {major && (
                                <>
                                    <text x={-w - 3} y={y}
                                        textAnchor="end" dominantBaseline="middle"
                                        fill="rgba(255,255,255,0.65)"
                                        fontSize={labelFs}
                                        fontFamily="system-ui, sans-serif">
                                        {Math.abs(deg)}
                                    </text>
                                    <text x={w + 3} y={y}
                                        textAnchor="start" dominantBaseline="middle"
                                        fill="rgba(255,255,255,0.65)"
                                        fontSize={labelFs}
                                        fontFamily="system-ui, sans-serif">
                                        {Math.abs(deg)}
                                    </text>
                                </>
                            )}
                        </g>
                    ))}
                </g>
            </g>

            {/* ── Bezel ── */}
            <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(0,0,0,0.75)" strokeWidth={5} />
            <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />

            {/* ── Bank angle scale (fixed) ── */}
            {BANK_MARKS.map(([deg, lenMult, major]) => {
                const len = bankTickLen * lenMult;
                const outer = polar(cx, cy, bankArcR, deg);
                const inner = polar(cx, cy, bankArcR - len, deg);
                return (
                    <line key={deg}
                        x1={outer.x.toFixed(2)} y1={outer.y.toFixed(2)}
                        x2={inner.x.toFixed(2)} y2={inner.y.toFixed(2)}
                        stroke={major ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)"}
                        strokeWidth={major ? 1.5 : 1}
                        strokeLinecap="round" />
                );
            })}

            {/* ── Bank angle pointer (rotates with aircraft) ── */}
            <g transform={`rotate(${bankAngle}, ${cx}, ${cy})`}>
                <path
                    d={`M ${cx} ${(cy - bankArcR + 1).toFixed(1)} L ${(cx - 5).toFixed(1)} ${(cy - bankArcR + 11).toFixed(1)} L ${(cx + 5).toFixed(1)} ${(cy - bankArcR + 11).toFixed(1)} Z`}
                    fill="white" opacity={0.92} />
            </g>

            {/* ── Fixed aircraft symbol ── */}
            {/* Left wing */}
            <line x1={cx - outerR * 0.38} y1={cy} x2={cx - outerR * 0.1} y2={cy}
                stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />
            {/* Right wing */}
            <line x1={cx + outerR * 0.1} y1={cy} x2={cx + outerR * 0.38} y2={cy}
                stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />
            {/* Center dot */}
            <circle cx={cx} cy={cy} r={2.5} fill="#f59e0b" />
            {/* Tail fin */}
            <line x1={cx} y1={cy} x2={cx} y2={cy - outerR * 0.1}
                stroke="#f59e0b" strokeWidth={1.5} strokeLinecap="round" />

            {/* Center reference marks (horizon guides) */}
            <line x1={cx - outerR * 0.09} y1={cy} x2={cx - outerR * 0.14} y2={cy}
                stroke="white" strokeWidth={1} opacity={0.35} />
            <line x1={cx + outerR * 0.09} y1={cy} x2={cx + outerR * 0.14} y2={cy}
                stroke="white" strokeWidth={1} opacity={0.35} />
        </svg>
    );
}

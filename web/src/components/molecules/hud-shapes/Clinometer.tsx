interface Props {
    size: number;
    roll: number; // graus — positivo = escora a boreste (direita)
}

function polar(cx: number, cy: number, r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, fromDeg: number, spanDeg: number) {
    const s = polar(cx, cy, r, fromDeg);
    const e = polar(cx, cy, r, fromDeg + spanDeg);
    const large = spanDeg > 180 ? 1 : 0;
    return `M${s.x.toFixed(3)},${s.y.toFixed(3)} A${r},${r} 0 ${large} 1 ${e.x.toFixed(3)},${e.y.toFixed(3)}`;
}

const MAX_HEEL = 35;

// Ticks: [heelDeg, lengthMultiplier]
const TICKS: Array<[number, number]> = [
    [10, 0.6], [20, 0.8], [30, 1.0],
    [-10, 0.6], [-20, 0.8], [-30, 1.0],
];

export default function Clinometer({ size, roll }: Props) {
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 2;

    const arcR   = outerR * 0.60;
    const tubeW  = outerR * 0.22;
    const ballR  = tubeW  * 0.40;
    const tickLen = outerR * 0.07;

    // Arc: boreste (145°) → fundo (180°) → través (215°), horário
    const ARC_FROM = 145;
    const ARC_SPAN = 70;

    const clampedRoll = Math.max(-MAX_HEEL, Math.min(MAX_HEEL, roll));
    // roll positivo = boreste → ângulo decresce (vai para direita no fundo)
    const ballAngle = 180 - clampedRoll;
    const ball = polar(cx, cy, arcR, ballAngle);

    const pEnd = polar(cx, cy, arcR, 219);
    const sEnd = polar(cx, cy, arcR, 141);

    const valLabel = Math.abs(Math.round(roll));
    const sideLabel = roll < -0.5 ? "PORT" : roll > 0.5 ? "STBD" : "LEVEL";
    const sideColor = roll < -0.5 ? "rgba(255,110,110,0.85)" : roll > 0.5 ? "rgba(110,220,130,0.85)" : "rgba(255,255,255,0.45)";

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
            {/* Bezel */}
            <circle cx={cx} cy={cy} r={outerR} fill="rgba(0,0,0,0.88)" />
            <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />

            {/* Tubo */}
            <path d={arcPath(cx, cy, arcR, ARC_FROM, ARC_SPAN)}
                fill="none" stroke="rgba(255,255,255,0.10)"
                strokeWidth={tubeW} strokeLinecap="round" />
            {/* Reflexo do vidro */}
            <path d={arcPath(cx, cy, arcR - tubeW * 0.16, ARC_FROM, ARC_SPAN)}
                fill="none" stroke="rgba(255,255,255,0.07)"
                strokeWidth={tubeW * 0.32} strokeLinecap="round" />

            {/* Marcações */}
            {TICKS.map(([deg, lenMult]) => {
                const a = 180 - deg;
                const len = tickLen * lenMult;
                const inner = polar(cx, cy, arcR - tubeW / 2 - 2, a);
                const outer = polar(cx, cy, arcR + tubeW / 2 + 2, a);
                const lp    = polar(cx, cy, arcR - tubeW / 2 - len - 4, a);
                const isMajor = Math.abs(deg) === 30;
                return (
                    <g key={deg}>
                        <line x1={inner.x.toFixed(2)} y1={inner.y.toFixed(2)}
                            x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
                            stroke={isMajor ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.40)"}
                            strokeWidth={isMajor ? 1.5 : 1} strokeLinecap="round" />
                        {isMajor && (
                            <text x={lp.x.toFixed(2)} y={lp.y.toFixed(2)}
                                textAnchor="middle" dominantBaseline="middle"
                                fill="rgba(255,255,255,0.45)"
                                fontSize={(outerR * 0.095).toFixed(1)}
                                fontFamily="system-ui, sans-serif">
                                {Math.abs(deg)}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Marca central (0°) */}
            {(() => {
                const inner = polar(cx, cy, arcR - tubeW / 2 - 2, 180);
                const outer = polar(cx, cy, arcR + tubeW / 2 + 2, 180);
                return <line x1={inner.x.toFixed(2)} y1={inner.y.toFixed(2)}
                    x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
                    stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinecap="round" />;
            })()}

            {/* Bola */}
            <circle cx={ball.x.toFixed(2)} cy={ball.y.toFixed(2)} r={ballR}
                fill="#f59e0b" />
            <circle cx={ball.x.toFixed(2)} cy={ball.y.toFixed(2)} r={ballR}
                fill="none" stroke="rgba(0,0,0,0.30)" strokeWidth={1} />
            {/* Brilho da bola */}
            <circle cx={(ball.x - ballR * 0.25).toFixed(2)} cy={(ball.y - ballR * 0.28).toFixed(2)}
                r={(ballR * 0.30).toFixed(2)}
                fill="rgba(255,255,255,0.35)" />

            {/* Labels P / S */}
            <text x={pEnd.x.toFixed(2)} y={pEnd.y.toFixed(2)}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,110,110,0.80)"
                fontSize={(outerR * 0.13).toFixed(1)}
                fontFamily="system-ui, sans-serif" fontWeight="700">P</text>
            <text x={sEnd.x.toFixed(2)} y={sEnd.y.toFixed(2)}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(110,220,130,0.80)"
                fontSize={(outerR * 0.13).toFixed(1)}
                fontFamily="system-ui, sans-serif" fontWeight="700">S</text>

            {/* Leitura central */}
            <text x={cx} y={cy - outerR * 0.10}
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize={(outerR * 0.30).toFixed(1)}
                fontFamily="system-ui, sans-serif" fontWeight="700">
                {valLabel}°
            </text>
            <text x={cx} y={cy + outerR * 0.16}
                textAnchor="middle" dominantBaseline="middle"
                fill={sideColor} fontSize={(outerR * 0.10).toFixed(1)}
                fontFamily="system-ui, sans-serif" letterSpacing="1.5">
                {sideLabel}
            </text>
            <text x={cx} y={cy + outerR * 0.36}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.22)" fontSize={(outerR * 0.085).toFixed(1)}
                fontFamily="system-ui, sans-serif" letterSpacing="1.5">
                HEEL
            </text>
        </svg>
    );
}

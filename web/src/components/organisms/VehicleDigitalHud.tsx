import { useEffect, useRef, useState, type ReactNode } from "react";
import { useVehicleHudStore } from "../../stores/vehicleHudStore";
import { useMarineHudStore } from "../../stores/marineHudStore";
import { useAircraftHudStore } from "../../stores/aircraftHudStore";
import { usePositioningStore } from "../../stores/positioningStore";
import { useThemeStore } from "../../stores/themeStore";
import { useVehicleThemeStore, type SpeedoVariant } from "../../stores/vehicleThemeStore";
import debugMode from "../../stores/debugStore";
import DraggableHudElement from "../atoms/DraggableHudElement";
import ScaledHudContent from "../atoms/ScaledHudContent";
import CustomDigitalElements from "./CustomDigitalElements";
import { useSmoothValue } from "../../hooks/useSmoothValue";

const FONT = "'Chakra Petch', 'Yantramanav', sans-serif";
const RPM_MAX = 8000;
const WARNING = "#ffc24d";
const DANGER = "#ff5a52";

const SEG_HEIGHTS = [9, 11, 13, 15, 17, 19, 21, 23, 25, 27];

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

// Cor das barras fuel/eng por nivel (espelha a logica do handoff).
function barColor(p: number, accent: string) {
  return p > 50 ? accent : p > 22 ? WARNING : DANGER;
}

/**
 * Boost/turbo derivado da aceleracao (o jogo nao expoe boost de forma
 * confiavel). Suaviza a taxa de variacao da velocidade -> 0..100.
 */
function useBoost(speed: number, speedMax: number) {
  const [boost, setBoost] = useState(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const prevRef = useRef(speed);
  const valRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (dt > 0) {
        const accel = (speedRef.current - prevRef.current) / dt; // unidades/s
        prevRef.current = speedRef.current;
        const target = clamp((accel / speedMax) * 100 * 4, 0, 100);
        valRef.current += (target - valRef.current) * (1 - Math.exp(-dt / 0.18));
        setBoost(valRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speedMax]);

  return boost;
}

interface ClusterData {
  speed: number;
  speedInt: number;
  speedMax: number;
  speedUnit: string;
  fuel: number;
  eng: number;
  boost: number;
  rpm: number;
  gear: number;
  bearing: number;
  beltOn: boolean;
  accent: string;
  variant: SpeedoVariant;
}

export default function VehicleDigitalHud() {
  const show = useVehicleHudStore((s) => s.show);
  const rawSpeed = useVehicleHudStore((s) => s.speed);
  const speed = useSmoothValue(rawSpeed, 70);
  const fuel = useVehicleHudStore((s) => s.fuel);
  const engine = useVehicleHudStore((s) => s.engine);
  const rawRpm = useVehicleHudStore((s) => s.rpm);
  const rpm = useSmoothValue(rawRpm, 90);
  const gear = useVehicleHudStore((s) => s.gear);
  const heading = useVehicleHudStore((s) => s.heading);
  const showSeatBelt = useVehicleHudStore((s) => s.showSeatBelt);
  const useMPH = useVehicleHudStore((s) => s.useMPH);

  const accent = useThemeStore((s) => s.accentColor);
  const variant = useVehicleThemeStore((s) => s.variant);

  const marineActive = useMarineHudStore((s) => s.show);
  const aircraftActive = useAircraftHudStore((s) => s.show);
  const positioningActive = usePositioningStore((s) => s.active);
  const showAll = usePositioningStore((s) => s.showAll);

  // Posicionamento força só com "Mostrar tudo"; senão respeita o contexto.
  const forceAll = positioningActive ? showAll : debugMode;

  const speedMax = useMPH ? 120 : 200;
  const boost = useBoost(speed, speedMax);

  if (!show && !forceAll) return null;
  // Em barco/aviao o cluster digital de carro nao se aplica.
  if ((marineActive || aircraftActive) && !forceAll) return null;

  // GTA heading e anti-horario (90 = Oeste); converte pra bussola horaria (90 = Leste).
  const bearing = ((360 - heading) % 360 + 360) % 360;

  const data: ClusterData = {
    speed,
    speedInt: Math.round(speed),
    speedMax,
    speedUnit: useMPH ? "MPH" : "KM/H",
    fuel: clamp(Math.round(fuel), 0, 100),
    eng: clamp(Math.round(engine), 0, 100),
    boost: Math.round(boost),
    rpm,
    gear,
    bearing,
    beltOn: !showSeatBelt,
    accent,
    variant,
  };

  // Cada peca e um DraggableHudElement proprio (igual ao tema classico):
  // pode ser movida/escondida/redimensionada de forma independente no F10.
  // Os defaults abaixo montam o cluster do handoff ancorado no centro-baixo.
  return (
    <>
      <DigitalEl id="digitalCompass" label="Bússola" left="50%" bottom={230}>
        <CompassStrip bearing={data.bearing} accent={data.accent} />
      </DigitalEl>

      <DigitalEl id="digitalSpeedo" label="Velocímetro" left="50%" bottom={90}>
        <Speedometer
          variant={data.variant}
          speedInt={data.speedInt}
          frac={clamp(data.speed / data.speedMax, 0, 1)}
          unit={data.speedUnit}
          accent={data.accent}
        />
      </DigitalEl>

      <DigitalEl id="digitalFuel" label="Combustível" left="calc(50% - 200px)" bottom={108}>
        <VBar value={data.fuel} label="FUEL" height={78} color={barColor(data.fuel, data.accent)} />
      </DigitalEl>

      <DigitalEl id="digitalEngine" label="Motor" left="calc(50% - 158px)" bottom={108}>
        <VBar value={data.eng} label="ENG" height={78} color={barColor(data.eng, data.accent)} />
      </DigitalEl>

      <DigitalEl id="digitalTurbo" label="Turbo" left="calc(50% + 178px)" bottom={122}>
        <VBar value={data.boost} label="TURBO" height={60} color={data.accent} glow />
      </DigitalEl>

      <DigitalEl id="digitalBelt" label="Cinto" left="calc(50% + 178px)" bottom={92} canResize={false}>
        <BeltPill on={data.beltOn} accent={data.accent} />
      </DigitalEl>

      <DigitalEl id="digitalTach" label="Tacômetro" left="50%" bottom={50}>
        <Tachometer rpm={data.rpm} gear={data.gear} accent={data.accent} />
      </DigitalEl>

      {/* Elementos custom injetados por outros resources (API 'digitalelement').
          Herdam o gating do cluster: so aparecem aqui, no tema digital. */}
      <CustomDigitalElements accent={data.accent} />
    </>
  );
}

/**
 * Wrapper de uma peca individual do cluster digital. Ancora no centro-baixo
 * (translateX(-50%)) e fica posicionavel/escondivel/redimensionavel no F10.
 */
function DigitalEl({
  id,
  label,
  left,
  bottom,
  canResize = true,
  children,
}: {
  id: string;
  label: string;
  left: string;
  bottom: number;
  canResize?: boolean;
  children: ReactNode;
}) {
  return (
    <DraggableHudElement id={id} label={label} zIndex={10} canResize={canResize}>
      <ScaledHudContent
        style={{
          position: "fixed",
          left,
          bottom,
          transform: "translateX(-50%)",
          pointerEvents: "none",
          fontFamily: FONT,
        }}
      >
        {children}
      </ScaledHudContent>
    </DraggableHudElement>
  );
}

/* ---------------------------------------------------------------- speedometer */

function Speedometer({
  variant,
  speedInt,
  frac,
  unit,
  accent,
}: {
  variant: SpeedoVariant;
  speedInt: number;
  frac: number;
  unit: string;
  accent: string;
}) {
  const glow = "0 0 22px rgba(70,224,255,0.32)";
  const empty = "rgba(255,255,255,0.07)";

  if (variant === "linear") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 11, width: 280 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 11 }}>
          <div style={{ font: `600 72px ${FONT}`, color: "#fff", lineHeight: 0.78, textShadow: glow }}>{speedInt}</div>
          <div style={{ font: `500 11px ${FONT}`, letterSpacing: "0.3em", color: "rgba(255,255,255,0.5)" }}>{unit}</div>
        </div>
        <div style={{ position: "relative", width: "100%", height: 6, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 4, width: `${frac * 100}%`, background: accent, boxShadow: `0 0 12px ${accent}` }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(8,11,15,0.85) 0 1px, transparent 1px 26px)" }} />
        </div>
      </div>
    );
  }

  if (variant === "arc") {
    // SVG (em vez de circulo 280x280 com overflow:hidden) pra caixa de limites
    // bater no visivel: o medidor do DraggableHudElement pula filhos SVG e usa
    // so o <svg> raiz (280x146). Preenche da esquerda -> direita por cima.
    const R = 120;
    const cx = 140;
    const cy = 140;
    const sw = 28;
    const len = Math.PI * R;
    const d = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width={280} height={146} viewBox="0 0 280 146" style={{ overflow: "visible" }}>
          <path d={d} fill="none" stroke={empty} strokeWidth={sw} strokeLinecap="butt" />
          <path
            d={d}
            fill="none"
            stroke={accent}
            strokeWidth={sw}
            strokeLinecap="butt"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - frac)}
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -62 }}>
          <div style={{ font: `600 56px ${FONT}`, color: "#fff", lineHeight: 0.85, textShadow: glow }}>{speedInt}</div>
          <div style={{ font: `500 10px ${FONT}`, letterSpacing: "0.32em", color: "rgba(255,255,255,0.5)", marginTop: 5 }}>{unit}</div>
        </div>
      </div>
    );
  }

  // ring (default)
  return (
    <div style={{ position: "relative", width: 206, height: 206 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(${accent} ${frac * 100}%, ${empty} 0)`,
          WebkitMask: "radial-gradient(circle, transparent 80px, #000 81px)",
          mask: "radial-gradient(circle, transparent 80px, #000 81px)",
        }}
      />
      <div style={{ position: "absolute", inset: 16, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ font: `600 60px ${FONT}`, color: "#fff", lineHeight: 0.85, textShadow: glow }}>{speedInt}</div>
        <div style={{ font: `500 10px ${FONT}`, letterSpacing: "0.32em", color: "rgba(255,255,255,0.5)", marginTop: 7 }}>{unit}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- vbar */

function VBar({
  value,
  label,
  height,
  color,
  glow = false,
}: {
  value: number;
  label: string;
  height: number;
  color: string;
  glow?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
      <div style={{ font: `600 10px ${FONT}`, color: "#fff" }}>{value}</div>
      <div style={{ position: "relative", width: 7, height, borderRadius: 5, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: `${clamp(value, 0, 100)}%`,
            background: color,
            borderRadius: 5,
            boxShadow: glow ? `0 0 8px ${color}` : undefined,
            transition: "height 0.12s ease-out",
          }}
        />
      </div>
      <div style={{ font: `500 9px ${FONT}`, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)" }}>{label}</div>
    </div>
  );
}

/* -------------------------------------------------------------------- belt */

function BeltPill({ on, accent }: { on: boolean; accent: string }) {
  const col = on ? accent : DANGER;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 9px",
        borderRadius: 20,
        background: on ? "rgba(70,224,255,0.1)" : "rgba(255,90,82,0.12)",
        border: `1px solid ${on ? "rgba(70,224,255,0.32)" : "rgba(255,90,82,0.4)"}`,
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: col, boxShadow: `0 0 8px ${col}` }} />
      <div style={{ font: `600 9px ${FONT}`, letterSpacing: "0.16em", color: col }}>BELT</div>
    </div>
  );
}

/* --------------------------------------------------------------- tachometer */

function Tachometer({ rpm, gear, accent }: { rpm: number; gear: number; accent: string }) {
  const lit = Math.round(clamp(rpm / RPM_MAX, 0, 1) * 10);
  const gearLabel = gear > 0 ? String(gear) : "N";
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <div style={{ font: `700 22px ${FONT}`, color: "#fff" }}>{gearLabel}</div>
        <div style={{ font: `500 8px ${FONT}`, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>GEAR</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
        {SEG_HEIGHTS.map((h, i) => {
          const bg =
            i < lit ? (i >= 8 ? DANGER : i >= 7 ? WARNING : accent) : "rgba(255,255,255,0.10)";
          return <div key={i} style={{ width: 5, borderRadius: 2, height: h, background: bg }} />;
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
        <div style={{ font: `600 16px ${FONT}`, color: "#fff" }}>{Math.round(rpm)}</div>
        <div style={{ font: `500 8px ${FONT}`, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>RPM</div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- compass */

interface Tick {
  left: number;
  h: number;
  col: string;
  label: string;
}

const COMPASS_LABELS: Record<number, string> = {
  0: "N", 45: "NE", 90: "E", 135: "SE", 180: "S", 225: "SW", 270: "W", 315: "NW",
};

const COMPASS_TICKS: Tick[] = (() => {
  const ticks: Tick[] = [];
  for (let dd = 0; dd <= 720; dd += 15) {
    const major = dd % 45 === 0;
    ticks.push({
      left: dd * 3,
      h: major ? 12 : 6,
      col: major ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.20)",
      label: major ? COMPASS_LABELS[dd % 360] || "" : "",
    });
  }
  return ticks;
})();

function CompassStrip({ bearing, accent }: { bearing: number; accent: string }) {
  const compassX = 118 - bearing * 3;
  // SVG: o <svg> raiz clipa o conteudo (viewport) e e a unica caixa medida pelo
  // DraggableHudElement (filhos SVG sao pulados), entao a caixa de limites bate
  // nos 236x34 visiveis em vez de esticar ate os ticks distantes. Sem degrade.
  return (
    <svg width={236} height={34} viewBox="0 0 236 34" style={{ overflow: "hidden", display: "block" }}>
      <g transform={`translate(${compassX} 0)`}>
        {COMPASS_TICKS.map((tk, i) => (
          <g key={i}>
            <rect x={tk.left - 0.5} y={34 - tk.h} width={1} height={tk.h} fill={tk.col} />
            {tk.label && (
              <text
                x={tk.left}
                y={13}
                textAnchor="middle"
                fill={tk.col}
                style={{ font: `600 10px ${FONT}` }}
              >
                {tk.label}
              </text>
            )}
          </g>
        ))}
      </g>
      <line x1={118} y1={7} x2={118} y2={34} stroke={accent} strokeOpacity={0.7} strokeWidth={1} />
      <polygon points="113,0 123,0 118,6" fill={accent} />
    </svg>
  );
}

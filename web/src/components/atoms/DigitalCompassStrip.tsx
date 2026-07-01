// Fita de bussola no estilo "digital/tech" — a mesma do cluster digital de
// veiculo (VehicleDigitalHud/CompassStrip), extraida pra ser usada tambem pela
// bussola standalone (CompassHud) quando o player escolhe o tipo 'digital'.
// TODO: migrar pro mri-ui-kit (MriCompassStrip) junto com os demais
// componentes de HUD (painel digital / orbes).

const FONT = "'Chakra Petch', 'Yantramanav', sans-serif";

const COMPASS_LABELS: Record<number, string> = {
  0: "N", 45: "NE", 90: "E", 135: "SE", 180: "S", 225: "SW", 270: "W", 315: "NW",
};

interface Tick {
  left: number;
  h: number;
  col: string;
  label: string;
}

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

interface Props {
  /** Rumo atual em graus (0-360). */
  bearing: number;
  /** Cor de destaque (ponteiro + linha central). Aceita CSS var, ex hsl(var(--primary)). */
  accent?: string;
  /** Mostra o ponteiro central (linha + triângulo). Espelha o toggle da bussola
   *  classica (isPointerShowChecked). Default true. */
  showPointer?: boolean;
}

export default function DigitalCompassStrip({ bearing, accent = "hsl(var(--primary))", showPointer = true }: Props) {
  const compassX = 118 - bearing * 3;
  // O <svg> raiz clipa o conteudo (viewport) e e a unica caixa medida pelo
  // DraggableHudElement (filhos SVG sao pulados), entao a caixa de limites bate
  // nos 236x34 visiveis em vez de esticar ate os ticks distantes.
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
      {/* ponteiro central (accent via style pra resolver o var(--primary)) */}
      {showPointer && (
        <>
          <line x1={118} y1={7} x2={118} y2={34} style={{ stroke: accent, strokeOpacity: 0.7 }} strokeWidth={1} />
          <polygon points="113,0 123,0 118,6" style={{ fill: accent }} />
        </>
      )}
    </svg>
  );
}

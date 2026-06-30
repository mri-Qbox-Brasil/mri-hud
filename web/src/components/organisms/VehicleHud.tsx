import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { useVehicleHudStore } from "../../stores/vehicleHudStore";
import { useMarineHudStore } from "../../stores/marineHudStore";
import { useAircraftHudStore } from "../../stores/aircraftHudStore";
import { usePositioningStore } from "../../stores/positioningStore";
import { useVehicleThemeStore } from "../../stores/vehicleThemeStore";
import debugMode from "../../stores/debugStore";
import AnalogGauge from "../molecules/hud-shapes/AnalogGauge";
import DraggableHudElement from "../atoms/DraggableHudElement";
import ScaledHudContent from "../atoms/ScaledHudContent";
import { useSmoothValue } from "../../hooks/useSmoothValue";
import VehicleDigitalHud from "./VehicleDigitalHud";

export default function VehicleHud() {
  const theme = useVehicleThemeStore((s) => s.theme);

  // Tema 'digital' = cluster do design handoff. Tema 'classic' (default) =
  // velocimetro analogico abaixo. Trocar de tema nao remove nenhum dos dois.
  if (theme === "digital") return <VehicleDigitalHud />;

  return <VehicleClassicHud />;
}

function VehicleClassicHud() {
  const show        = useVehicleHudStore((s) => s.show);
  const rawSpeed    = useVehicleHudStore((s) => s.speed);
  const speed       = useSmoothValue(rawSpeed, 70);
  const fuel        = useVehicleHudStore((s) => s.fuel);
  const odometer    = useVehicleHudStore((s) => s.odometer);
  const fuelColor   = useVehicleHudStore((s) => s.fuelColor);
  const showSeatBelt  = useVehicleHudStore((s) => s.showSeatBelt);
  const seatbeltColor = useVehicleHudStore((s) => s.seatbeltColor);
  const useMPH      = useVehicleHudStore((s) => s.useMPH);
  const marineActive      = useMarineHudStore((s) => s.show);
  const aircraftActive    = useAircraftHudStore((s) => s.show);
  const positioningActive = usePositioningStore((s) => s.active);

  if (!show && !debugMode && !positioningActive) return null;

  const speedMax    = useMPH ? 120 : 200;
  const speedUnit   = useMPH ? "mph" : "km/h";
  const speedTick   = useMPH ? 20 : 20;
  const odometerStr = odometer > 0
    ? `${odometer.toLocaleString("pt-BR")} ${useMPH ? "mi" : "km"}`
    : undefined;

  return (
    <>
      <DraggableHudElement id="speedometer" label="Velocímetro" zIndex={10}>
        <ScaledHudContent style={{ position: "fixed", bottom: "12.21vh", left: "17.69vw", pointerEvents: "none" }}>
          <AnalogGauge
            size={140}
            value={speed}
            minValue={0}
            maxValue={speedMax}
            arcLength={75}
            rotation={225}
            majorTickInterval={speedTick}
            minorTickCount={4}
            ringSize={5}
            color="#ffffff"
            outlineColor="#ffffff"
            outlineOpacity={0.22}
            needleStyle="needle"
            showValue
            unit={speedUnit}
            label="SPEED"
            odometer={odometerStr}
          />
        </ScaledHudContent>
      </DraggableHudElement>

      {(!marineActive && !aircraftActive || positioningActive || debugMode) && (
        <DraggableHudElement id="fuelgauge" label="Combustível" zIndex={10}>
          <ScaledHudContent style={{ position: "fixed", bottom: "6.44vh", left: "22.61vw", pointerEvents: "none" }}>
            <AnalogGauge
              size={88}
              value={fuel}
              minValue={0}
              maxValue={100}
              arcLength={75}
              rotation={225}
              majorTickInterval={25}
              minorTickCount={1}
              ringSize={4}
              color={fuelColor}
              outlineColor={fuelColor}
              outlineOpacity={0.28}
              needleStyle="needle"
              showValue
              unit="%"
              label="FUEL"
            />
          </ScaledHudContent>
        </DraggableHudElement>
      )}

      {showSeatBelt && (
        <DraggableHudElement id="seatbelt" label="Cinto" zIndex={10} canResize={false}>
          <div style={{ position: "fixed", bottom: "8.09vh", left: "17.91vw", pointerEvents: "none" }}>
            <SeatbeltIcon color={seatbeltColor} />
          </div>
        </DraggableHudElement>
      )}
    </>
  );
}

function SeatbeltIcon({ color }: { color: string }) {
  const icon = faUserSlash;
  const pathData = icon.icon[4] as string;
  const vbW = icon.icon[0];
  const vbH = icon.icon[1];
  return (
    <svg width="22" height="22" viewBox={`0 0 ${vbW} ${vbH}`} overflow="visible">
      <path d={pathData} fill={color} transform="scale(1.1)" />
    </svg>
  );
}

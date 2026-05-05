import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { useVehicleHudStore } from "../../stores/vehicleHudStore";
import debugMode from "../../stores/debugStore";
import AnalogGauge from "../molecules/hud-shapes/AnalogGauge";
import DraggableHudElement from "../atoms/DraggableHudElement";
import ScaledHudContent from "../atoms/ScaledHudContent";

export default function VehicleHud() {
  const show        = useVehicleHudStore((s) => s.show);
  const speed       = useVehicleHudStore((s) => s.speed);
  const fuel        = useVehicleHudStore((s) => s.fuel);
  const altitude    = useVehicleHudStore((s) => s.altitude);
  const odometer    = useVehicleHudStore((s) => s.odometer);
  const fuelColor   = useVehicleHudStore((s) => s.fuelColor);
  const showAltitude  = useVehicleHudStore((s) => s.showAltitude);
  const showSeatBelt  = useVehicleHudStore((s) => s.showSeatBelt);
  const seatbeltColor = useVehicleHudStore((s) => s.seatbeltColor);
  const useMPH      = useVehicleHudStore((s) => s.useMPH);

  if (!show && !debugMode) return null;

  const speedMax   = useMPH ? 120 : 200;
  const speedUnit  = useMPH ? "mph" : "km/h";
  const speedTick  = useMPH ? 20 : 20;
  const odometerStr = odometer > 0
    ? `${odometer.toLocaleString("pt-BR")} ${useMPH ? "mi" : "km"}`
    : undefined;

  return (
    <>
      <DraggableHudElement id="speedometer" label="Velocímetro" zIndex={10}>
        <ScaledHudContent style={{ position: "fixed", bottom: "5vh", left: "5vw", pointerEvents: "none" }}>
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

      <DraggableHudElement id="fuelgauge" label="Combustível" zIndex={10}>
        <ScaledHudContent style={{ position: "fixed", bottom: "4vh", left: "15vw", pointerEvents: "none" }}>
          <AnalogGauge
            size={110}
            value={fuel}
            minValue={0}
            maxValue={100}
            arcLength={75}
            rotation={225}
            majorTickInterval={25}
            minorTickCount={1}
            ringSize={5}
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

      {(showAltitude || debugMode) && (
        <DraggableHudElement id="altitudegauge" label="Altitude" zIndex={10}>
          <ScaledHudContent style={{ position: "fixed", bottom: "5vh", left: "24vw", pointerEvents: "none" }}>
            <AnalogGauge
              size={120}
              value={altitude}
              minValue={0}
              maxValue={750}
              arcLength={75}
              rotation={225}
              majorTickInterval={150}
              minorTickCount={1}
              ringSize={5}
              color="#ffffff"
              outlineColor="#ffffff"
              outlineOpacity={0.22}
              needleStyle="needle"
              showValue
              unit="m"
              label="ALT"
            />
          </ScaledHudContent>
        </DraggableHudElement>
      )}

      {showSeatBelt && (
        <DraggableHudElement id="seatbelt" label="Cinto" zIndex={10} canResize={false}>
          <div style={{ position: "fixed", bottom: "16vh", left: "17vw", pointerEvents: "none" }}>
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

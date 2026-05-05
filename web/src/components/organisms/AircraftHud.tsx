import { useAircraftHudStore } from "../../stores/aircraftHudStore";
import { usePositioningStore } from "../../stores/positioningStore";
import DraggableHudElement from "../atoms/DraggableHudElement";
import ScaledHudContent from "../atoms/ScaledHudContent";
import ArtificialHorizon from "../molecules/hud-shapes/ArtificialHorizon";
import AnalogGauge from "../molecules/hud-shapes/AnalogGauge";

export default function AircraftHud() {
    const show              = useAircraftHudStore((s) => s.show);
    const airspeed          = useAircraftHudStore((s) => s.airspeed);
    const altitude          = useAircraftHudStore((s) => s.altitude);
    const verticalSpeed     = useAircraftHudStore((s) => s.verticalSpeed);
    const pitch             = useAircraftHudStore((s) => s.pitch);
    const roll              = useAircraftHudStore((s) => s.roll);
    const positioningActive = usePositioningStore((s) => s.active);

    if (!show && !positioningActive) return null;

    // Altimeter: needle completes one turn per 1000 m; label shows thousands
    const altMod = ((altitude % 1000) + 1000) % 1000;
    const altKilo = Math.floor(altitude / 1000);

    return (
        <>
            <DraggableHudElement id="aircraftHorizon" label="Horizonte" zIndex={15}>
                <ScaledHudContent style={{ position: "fixed", bottom: "3vh", left: "34vw", pointerEvents: "none" }}>
                    <ArtificialHorizon size={160} pitch={pitch} roll={roll} />
                </ScaledHudContent>
            </DraggableHudElement>

            <DraggableHudElement id="aircraftAsi" label="Velocidade" zIndex={15}>
                <ScaledHudContent style={{ position: "fixed", bottom: "3vh", left: "43vw", pointerEvents: "none" }}>
                    <AnalogGauge
                        size={120}
                        value={airspeed}
                        minValue={0}
                        maxValue={400}
                        arcLength={75}
                        rotation={225}
                        majorTickInterval={50}
                        minorTickCount={4}
                        ringSize={5}
                        color="#00cfff"
                        outlineColor="#00cfff"
                        outlineOpacity={0.25}
                        needleStyle="needle"
                        showValue
                        unit="km/h"
                        label="SPEED"
                    />
                </ScaledHudContent>
            </DraggableHudElement>

            <DraggableHudElement id="aircraftAlt" label="Altímetro" zIndex={15}>
                <ScaledHudContent style={{ position: "fixed", bottom: "3vh", left: "21vw", pointerEvents: "none" }}>
                    <AnalogGauge
                        size={120}
                        value={altMod}
                        minValue={0}
                        maxValue={1000}
                        arcLength={100}
                        rotation={0}
                        majorTickInterval={100}
                        minorTickCount={4}
                        ringSize={5}
                        color="#f59e0b"
                        outlineColor="#f59e0b"
                        outlineOpacity={0.25}
                        needleStyle="needle"
                        showValue
                        unit="m"
                        label={altKilo > 0 ? `ALT +${altKilo}K` : "ALT"}
                    />
                </ScaledHudContent>
            </DraggableHudElement>

            <DraggableHudElement id="aircraftVsi" label="Vel.Vertical" zIndex={15}>
                <ScaledHudContent style={{ position: "fixed", bottom: "3vh", left: "12vw", pointerEvents: "none" }}>
                    <AnalogGauge
                        size={100}
                        value={verticalSpeed}
                        minValue={-30}
                        maxValue={30}
                        arcLength={75}
                        rotation={225}
                        majorTickInterval={10}
                        minorTickCount={1}
                        ringSize={5}
                        color="#a78bfa"
                        outlineColor="#a78bfa"
                        outlineOpacity={0.25}
                        needleStyle="needle"
                        showValue
                        unit="m/s"
                        label="VSI"
                    />
                </ScaledHudContent>
            </DraggableHudElement>
        </>
    );
}

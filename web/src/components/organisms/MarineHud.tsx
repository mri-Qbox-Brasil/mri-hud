import { useMarineHudStore } from "../../stores/marineHudStore";
import DraggableHudElement from "../atoms/DraggableHudElement";
import ScaledHudContent from "../atoms/ScaledHudContent";
import Clinometer from "../molecules/hud-shapes/Clinometer";
import AnalogGauge from "../molecules/hud-shapes/AnalogGauge";

export default function MarineHud() {
    const show       = useMarineHudStore((s) => s.show);
    const speedKnots = useMarineHudStore((s) => s.speedKnots);
    const rpm        = useMarineHudStore((s) => s.rpm);
    const pitch      = useMarineHudStore((s) => s.pitch);
    const roll       = useMarineHudStore((s) => s.roll);

    if (!show) return null;

    return (
        <>
            <DraggableHudElement id="marineHeel" label="Escora" zIndex={15}>
                <ScaledHudContent style={{ position: "fixed", top: "5vh", left: "2vw", pointerEvents: "none" }}>
                    <Clinometer size={130} roll={roll} />
                </ScaledHudContent>
            </DraggableHudElement>

            <DraggableHudElement id="marineSpeed" label="Velocidade" zIndex={15}>
                <ScaledHudContent style={{ position: "fixed", top: "5vh", left: "12vw", pointerEvents: "none" }}>
                    <AnalogGauge
                        size={120}
                        value={speedKnots}
                        minValue={0}
                        maxValue={50}
                        arcLength={75}
                        rotation={225}
                        majorTickInterval={10}
                        minorTickCount={1}
                        ringSize={5}
                        color="#38bdf8"
                        outlineColor="#38bdf8"
                        outlineOpacity={0.25}
                        needleStyle="needle"
                        showValue
                        unit="kn"
                        label="SPEED"
                    />
                </ScaledHudContent>
            </DraggableHudElement>

            <DraggableHudElement id="marineRpm" label="RPM" zIndex={15}>
                <ScaledHudContent style={{ position: "fixed", top: "5vh", left: "21vw", pointerEvents: "none" }}>
                    <AnalogGauge
                        size={110}
                        value={rpm}
                        minValue={0}
                        maxValue={100}
                        arcLength={75}
                        rotation={225}
                        majorTickInterval={25}
                        minorTickCount={1}
                        ringSize={5}
                        color="#34d399"
                        outlineColor="#34d399"
                        outlineOpacity={0.25}
                        needleStyle="needle"
                        showValue
                        unit="%"
                        label="RPM"
                    />
                </ScaledHudContent>
            </DraggableHudElement>

            <DraggableHudElement id="marineTrim" label="Trim" zIndex={15}>
                <ScaledHudContent style={{ position: "fixed", top: "5vh", left: "29vw", pointerEvents: "none" }}>
                    <AnalogGauge
                        size={100}
                        value={pitch}
                        minValue={-20}
                        maxValue={20}
                        arcLength={75}
                        rotation={225}
                        majorTickInterval={10}
                        minorTickCount={1}
                        ringSize={5}
                        color="#fb923c"
                        outlineColor="#fb923c"
                        outlineOpacity={0.25}
                        needleStyle="needle"
                        showValue
                        unit="°"
                        label="TRIM"
                    />
                </ScaledHudContent>
            </DraggableHudElement>
        </>
    );
}

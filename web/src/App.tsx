import { useEffect, useRef } from "react";
import { useEventHandler, fetchNui } from "./utils/eventHandler";
import { useMenuStore } from "./stores/menuStore";
import { usePlayerStatusHudStore } from "./stores/playerStatusHudStore";
import { usePositioningStore } from "./stores/positioningStore";
import debugMode from "./stores/debugStore";
import "./debugMocks";
import MetaLayout from "./components/templates/MetaLayout";
import Menu from "./components/organisms/Menu";
import MapBorderHud from "./components/organisms/MapBorderHud";
import CompassHud from "./components/organisms/CompassHud";
import MoneyHud from "./components/organisms/MoneyHud";
import VehicleHud from "./components/organisms/VehicleHud";
import GaugesHud from "./components/organisms/GaugesHud";
import AircraftHud from "./components/organisms/AircraftHud";
import MarineHud from "./components/organisms/MarineHud";
import PositioningOverlay from "./components/organisms/PositioningOverlay";
import DevPanel from "./components/organisms/DevPanel";
import ServerLogoHud from "./components/organisms/ServerLogoHud";

export default function App() {
    useEventHandler();

    const handleKeyUp = useMenuStore((s) => s.handleKeyUp);
    const isCinematicModeChecked = useMenuStore((s) => s.isCinematicModeChecked);
    const togglePositioning = usePositioningStore((s) => s.toggle);

    // Design-mode progress animation
    const isUpRef = useRef(true);
    useEffect(() => {
        const id = setInterval(() => {
            usePlayerStatusHudStore.setState((state) => {
                let progress = state.designProgress;
                if (isUpRef.current) {
                    progress += 15;
                    if (progress > 100) { progress = 100; isUpRef.current = false; }
                } else {
                    progress -= 15;
                    if (progress < 0) { progress = 0; isUpRef.current = true; }
                }
                return { designProgress: progress };
            });
        }, 1400);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "F10") {
                const store = usePositioningStore.getState();
                if (!store.enabled) return;
                if (store.active) fetchNui("closePositioningMode");
                togglePositioning();
                return;
            }
            handleKeyUp(e);
        };
        document.addEventListener("keyup", handler);
        return () => document.removeEventListener("keyup", handler);
    }, [handleKeyUp, togglePositioning]);

    return (
        <main className={`${debugMode ? "bg-gray-300" : "bg-transparent"} min-h-screen`}>
            <PositioningOverlay />
            {debugMode && <DevPanel />}
            <ServerLogoHud />
            {!isCinematicModeChecked && (
                <>
                    <CompassHud />
                    <MoneyHud />
                    <MetaLayout />
                    <VehicleHud />
                    <GaugesHud />
                    <AircraftHud />
                    <MarineHud />
                    <MapBorderHud />
                </>
            )}
            <Menu />
        </main>
    );
}

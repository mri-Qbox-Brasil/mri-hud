import { useEffect, useRef } from "react";
import { useEventHandler, fetchNui } from "./utils/eventHandler";
import { useMenuStore } from "./stores/menuStore";
import { usePlayerStatusHudStore } from "./stores/playerStatusHudStore";
import { usePositioningStore } from "./stores/positioningStore";
import { useThemeStore } from "./stores/themeStore";
import { useAccentColor } from "./hooks/useAccentColor";
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

    // Suite MRI accent — Lua manda em updateUISettings; themeStore guarda;
    // useAccentColor aplica nas CSS vars --primary/--ring em runtime.
    const accentColor = useThemeStore((s) => s.accentColor);
    useAccentColor(accentColor);

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
            // F10 no NUI so FECHA o modo de posicionamento (quando ativo).
            // Abrir e trabalho do keymapping do Lua ('positioningMode'), que tem
            // suas proprias guardas. Sem o gate em store.active, o F10 ativava o
            // positioning sempre que o NUI tinha foco por outro motivo (ex: menu
            // de settings aberto) — ativando coisa que nao devia.
            if (e.key === "F10") {
                const store = usePositioningStore.getState();
                if (store.active) {
                    fetchNui("closePositioningMode");
                    togglePositioning();
                }
                return;
            }
            // ESC no modo de posicionamento: fecha o modo (libera foco NUI no
            // Lua + reseta o estado). Sem isso, o ESC nativo do FiveM tira o
            // foco mas deixa active=true no React e positioningMode=true no
            // Lua, travando a HUD em modo edicao sem poder interagir nem
            // re-abrir. So intercepta se positioning estiver ativo — senao
            // passa pro handleKeyUp (que fecha o menu de settings).
            if (e.key === "Escape") {
                const store = usePositioningStore.getState();
                if (store.active) {
                    fetchNui("closePositioningMode");
                    togglePositioning();
                    return;
                }
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

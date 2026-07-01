import debugMode from "./stores/debugStore";
import { usePlayerStatusHudStore } from "./stores/playerStatusHudStore";
import { useVehicleHudStore } from "./stores/vehicleHudStore";
import { useCompassHudStore } from "./stores/compassHudStore";
import { useMoneyHudStore } from "./stores/moneyHudStore";
import { useDynamicPanelsStore } from "./stores/dynamicPanelsStore";
import { useCustomOrbsStore } from "./stores/customOrbsStore";
import { useCustomDigitalStore } from "./stores/customDigitalStore";
import { useAircraftHudStore } from "./stores/aircraftHudStore";
import { useMarineHudStore } from "./stores/marineHudStore";
import { useServerLogoStore } from "./stores/serverLogoStore";
import { useVehicleThemeStore } from "./stores/vehicleThemeStore";
import { usePlayerSkinStore } from "./stores/playerSkinStore";
import { useSupernaturalVitalsStore } from "./stores/supernaturalVitalsStore";
import mriLogo from "./assets/mri-logo.png";

if (debugMode) {
    usePlayerStatusHudStore.setState({ designMode: true });

    useVehicleHudStore.setState({
        show: true,
        speed: 87,
        fuel: 65,
        rpm: 4200,
        gear: 3,
        engine: 88,
        heading: 135,
        altitude: 120,
        fuelColor: "#FFFFFF",
        showAltitude: true,
        showSeatBelt: true,
        seatbeltColor: "#e85b14",
        useMPH: false,
    });

    useVehicleThemeStore.setState({ theme: "digital", variant: "ring" });

    usePlayerSkinStore.setState({ skin: "sobrenatural", palette: "pergaminho", vitalStyle: "orbes", layout: "classico" });
    useSupernaturalVitalsStore.setState({ folego: 64, sanidade: 34, mana: 55 });

    useCompassHudStore.setState({
        show: true,
        heading: 180,
        streetName: "Alta Street",
        crossingRoad: "Innocence Blvd",
    });

    useMoneyHudStore.setState({
        show: true,
        cash: 12500,
        bank: 87340,
    });

    useMarineHudStore.setState({
        show: false,
        speedKnots: 18,
        rpm: 72,
        pitch: 3,
        roll: -12,
    });

    useAircraftHudStore.setState({
        show: false,
        airspeed: 185,
        altitude: 1250,
        verticalSpeed: 3.2,
        pitch: 8,
        roll: 15,
    });

    useServerLogoStore.getState().setConfig({ enabled: true, src: mriLogo, width: 120, x: 8, y: 6 });

    useDynamicPanelsStore.getState().addPanel({
        id: "stamina",
        hudIconInfo: {
            progressValue: 72,
            progressColor: "#00cfff",
            outlineColor: "rgba(0,207,255,0.35)",
            progressContrast: 100,
            iconContrast: 100,
            outlineContrast: 100,
            progressDropShadowAmount: 0,
            iconDropShadowAmount: 0,
            outlineDropShadowAmount: 0,
            icon: "bolt",
        } as any,
        isShowing: true,
    });

    // Orbe custom de preview (API 'orb').
    useCustomOrbsStore.getState().setOrb({
        id: "corrupcao", label: "Corrupção", glyph: "ᛟ", color: "#c75b4a",
        value: 66, size: 72, lowAt: 25, left: 480, bottom: 300,
    });

    // Elemento custom do cluster digital (API 'digitalelement').
    useCustomDigitalStore.getState().setElement({
        id: "nos", kind: "bar", label: "NOS", value: 80, color: "#a87fe0", glow: true,
        left: "calc(50% + 220px)", bottom: 108,
    });
}

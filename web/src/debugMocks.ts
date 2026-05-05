import debugMode from "./stores/debugStore";
import { usePlayerStatusHudStore } from "./stores/playerStatusHudStore";
import { useVehicleHudStore } from "./stores/vehicleHudStore";
import { useCompassHudStore } from "./stores/compassHudStore";
import { useMoneyHudStore } from "./stores/moneyHudStore";
import { useDynamicGaugesStore } from "./stores/dynamicGaugesStore";
import { useDynamicPanelsStore } from "./stores/dynamicPanelsStore";
import { useAircraftHudStore } from "./stores/aircraftHudStore";
import { useMarineHudStore } from "./stores/marineHudStore";
import { useServerLogoStore } from "./stores/serverLogoStore";

if (debugMode) {
    usePlayerStatusHudStore.setState({ designMode: true });

    useVehicleHudStore.setState({
        show: true,
        speed: 87,
        fuel: 65,
        altitude: 120,
        fuelColor: "#FFFFFF",
        showAltitude: true,
        showSeatBelt: true,
        seatbeltColor: "#e85b14",
        useMPH: false,
    });

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

    useDynamicGaugesStore.getState().setAll([

        {
            id: "speed-analog",
            style: "analog",
            needleStyle: "needle",
            arcLength: 75,
            rotation: 225,
            size: 180,
            ringSize: 6,
            color: "#00cfff",
            outlineColor: "#00cfff",
            outlineOpacity: 0.28,
            label: "SPEED",
            unit: "km/h",
            x: 80,
            y: 82,
            minValue: 0,
            maxValue: 200,
            majorTickInterval: 20,
            minorTickCount: 4,
            showValue: true,
            value: 87,
        },
        {
            id: "rpm-analog",
            style: "analog",
            needleStyle: "digital",
            arcLength: 75,
            rotation: 225,
            size: 140,
            ringSize: 5,
            color: "#ff6600",
            outlineColor: "#ff6600",
            outlineOpacity: 0.28,
            label: "RPM",
            unit: "rpm",
            x: 87,
            y: 82,
            minValue: 0,
            maxValue: 8000,
            majorTickInterval: 1000,
            minorTickCount: 4,
            showValue: true,
            value: 4200,
        },
        {
            id: "fuel-analog",
            style: "analog",
            needleStyle: "arc",
            arcLength: 65,
            rotation: 237,
            size: 90,
            ringSize: 5,
            color: "#22c55e",
            outlineColor: "#22c55e",
            outlineOpacity: 0.28,
            label: "FUEL",
            unit: "%",
            x: 74,
            y: 82,
            minValue: 0,
            maxValue: 100,
            majorTickInterval: 25,
            minorTickCount: 1,
            showValue: true,
            value: 65,
        },
    ]);

    // 12° port heel, 18 knots, 72% RPM, 3° bow-up trim
    useMarineHudStore.setState({
        show: true,
        speedKnots: 18,
        rpm: 72,
        pitch: 3,
        roll: -12,
    });

    // pitch 8° nose-up, 15° right bank
    useAircraftHudStore.setState({
        show: true,
        airspeed: 185,
        altitude: 1250,
        verticalSpeed: 3.2,
        pitch: 8,
        roll: 15,
    });

    useServerLogoStore.getState().setConfig({ enabled: true, src: "logo.png", width: 80, x: 50, y: 3 });

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
}

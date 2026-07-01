import { useEffect } from "react";
import { usePlayerStatusHudStore as usePlayerHudStore, ICON_DEFAULTS_VERSION } from "../stores/playerStatusHudStore";
import { useColorEffectStore } from "../stores/colorEffectStore";
import { useMenuStore } from "../stores/menuStore";
import { useVehicleHudStore } from "../stores/vehicleHudStore";
import { useExternalStatusStore } from "../stores/externalStatusStore";
import { useLayoutStore } from "../stores/layoutStore";
import { useDynamicPanelsStore } from "../stores/dynamicPanelsStore";
import { useDynamicGaugesStore } from "../stores/dynamicGaugesStore";
import { usePositioningStore } from "../stores/positioningStore";
import { useServerLogoStore } from "../stores/serverLogoStore";
import { useCompassHudStore } from "../stores/compassHudStore";
import { useMoneyHudStore } from "../stores/moneyHudStore";
import { useThemeStore } from "../stores/themeStore";
import { useAircraftHudStore } from "../stores/aircraftHudStore";
import { useMarineHudStore } from "../stores/marineHudStore";
import { useVehicleThemeStore } from "../stores/vehicleThemeStore";
import { usePlayerSkinStore } from "../stores/playerSkinStore";
import { useSupernaturalVitalsStore } from "../stores/supernaturalVitalsStore";
import { useCustomOrbsStore } from "../stores/customOrbsStore";
import { useCustomDigitalStore } from "../stores/customDigitalStore";
import { useI18nStore } from "./i18n";
import {
    colorStoreLocalStorageName,
    playerStoreLocalStorageName,
    layoutStoreLocalStorageName,
    profileLocalStorageName,
} from "../types/types";
import { useProfileStore } from "../stores/profileStore";

interface NuiMessage {
    data: {
        action: string;
        topic?: string;
        [key: string]: any;
    };
}

function mainEvent(event: MessageEvent<NuiMessage["data"]>) {
    const data = event.data;
    if (!data || !data.action) return;

    switch (data.action) {
        case "baseplate":
            switch (data.topic) {
                case "compassupdate":
                    useCompassHudStore.getState().receiveCompassMessage(data as any);
                    break;
                case "opencompass":
                    useCompassHudStore.getState().receiveCompassOpenMessage(data as any);
                    break;
                case "closecompass":
                    useCompassHudStore.getState().receiveCompassCloseMessage(data as any);
                    break;
            }
            break;

        case "car":
            switch (data.topic) {
                case "display":
                    useVehicleHudStore.getState().receiveShowMessage(data as any);
                    break;
                case "status":
                    useVehicleHudStore.getState().receiveUpdateMessage(data as any);
                    break;
                case "speed":
                    useVehicleHudStore.getState().receiveSpeedMessage(data as any);
                    break;
            }
            break;

        case "odometer":
            useVehicleHudStore.getState().receiveOdometerMessage(data as any);
            break;

        case "externalstatus":
            switch (data.topic) {
                case "buff":
                    useExternalStatusStore.getState().receiveBuffStatusMessage(data as any);
                    break;
                case "enhancement":
                    useExternalStatusStore
                        .getState()
                        .receiveEnhancementStatusMessage(data as any);
                    break;
            }
            break;

        case "hudtick":
            switch (data.topic) {
                case "display":
                    usePlayerHudStore.getState().receiveShowMessage(data as any);
                    break;
                case "status":
                default:
                    usePlayerHudStore.getState().receiveStatusUpdateMessage(data as any);
                    break;
            }
            break;

        case "menu":
            switch (data.topic) {
                case "adminonly":
                    useMenuStore.getState().receiveAdminMessage(data as any);
                    break;
                case "restart":
                    useMenuStore.getState().receiveRestartMessage();
                    break;
            }
            break;

        case "open":
            useMenuStore.getState().receiveMessage();
            break;

        case "show":
            useMoneyHudStore.getState().receiveShowAccountsMessage(data as any);
            break;

        case "showconstant":
            useMoneyHudStore.getState().receiveShowConstantMessage(data as any);
            break;

        case "update":
            useCompassHudStore.getState().receiveHeadingMessage(data as any);
            break;

        case "updatemoney":
            useMoneyHudStore.getState().receiveUpdateMessage(data as any);
            break;

        case "updateUISettings":
            // accentColor pode vir sozinho (broadcast da convar mri:color) OU
            // junto com icons/layout/colors (init/save). Atualiza o themeStore
            // independente das outras keys estarem presentes.
            if (typeof data.accentColor === "string") {
                useThemeStore.getState().setAccentColor(data.accentColor);
            }
            if (typeof data.backgroundColor === "string") {
                useThemeStore.getState().setBackgroundColor(data.backgroundColor);
            }
            if (!data.icons || !data.layout || !data.colors) return;
            usePlayerHudStore.getState().receiveUIUpdateMessage(data.icons);
            useLayoutStore.getState().receiveUIUpdateMessage(data.layout);
            useColorEffectStore.getState().receiveUIUpdateMessage(data.colors);
            break;

        case "panel":
            switch (data.topic) {
                case "list":
                    if (Array.isArray(data.panels)) {
                        useDynamicPanelsStore.getState().setPanels(data.panels);
                    }
                    break;
                case "add":
                    if (data.panel) {
                        useDynamicPanelsStore.getState().addPanel(data.panel);
                    }
                    break;
                case "remove":
                    if (data.id) {
                        useDynamicPanelsStore.getState().removePanel(data.id);
                    }
                    break;
                case "update":
                    if (data.id && data.patch) {
                        useDynamicPanelsStore.getState().updatePanel(data.id, data.patch);
                    }
                    break;
            }
            break;

        case "gauge":
            switch (data.topic) {
                case "set":
                    if (data.id) useDynamicGaugesStore.getState().setGauge(data as any);
                    break;
                case "value":
                    if (data.id != null && data.value != null)
                        useDynamicGaugesStore.getState().updateValue(data.id, data.value);
                    break;
                case "remove":
                    if (data.id) useDynamicGaugesStore.getState().removeGauge(data.id);
                    break;
                case "show":
                    if (data.id != null && data.isShowing != null)
                        usePositioningStore.getState().setGaugeVisibility(data.id, data.isShowing);
                    break;
                case "list":
                    if (Array.isArray(data.gauges)) useDynamicGaugesStore.getState().setAll(data.gauges);
                    break;
                case "clear":
                    useDynamicGaugesStore.getState().clear();
                    break;
            }
            break;

        case "marine":
            switch (data.topic) {
                case "display":
                    useMarineHudStore.getState().receiveShowMessage(data.isShowing);
                    break;
                case "status":
                    useMarineHudStore.getState().receiveStatusMessage(data as any);
                    break;
            }
            break;

        case "aircraft":
            switch (data.topic) {
                case "display":
                    useAircraftHudStore.getState().receiveShowMessage(data.isShowing);
                    break;
                case "status":
                    useAircraftHudStore.getState().receiveStatusMessage(data as any);
                    break;
            }
            break;

        case "vitals":
            // Stats custom do skin sobrenatural (folego/sanidade/mana), 0-100,
            // alimentados por outros resources.
            if (data.topic === "supernatural") {
                useSupernaturalVitalsStore.getState().receiveMessage(data as any);
            }
            break;

        case "orb":
            // Orbes custom (skin sobrenatural) injetadas por outros resources.
            switch (data.topic) {
                case "set":
                    if (data.orb?.id) useCustomOrbsStore.getState().setOrb(data.orb);
                    break;
                case "value":
                    if (data.id != null && data.value != null)
                        useCustomOrbsStore.getState().updateValue(data.id, data.value);
                    break;
                case "remove":
                    if (data.id) useCustomOrbsStore.getState().removeOrb(data.id);
                    break;
                case "list":
                    if (Array.isArray(data.orbs)) useCustomOrbsStore.getState().setAll(data.orbs);
                    break;
                case "clear":
                    useCustomOrbsStore.getState().clear();
                    break;
            }
            break;

        case "digitalelement":
            // Elementos custom do cluster digital do veiculo.
            switch (data.topic) {
                case "set":
                    if (data.element?.id) useCustomDigitalStore.getState().setElement(data.element);
                    break;
                case "value":
                    if (data.id != null && data.value != null)
                        useCustomDigitalStore.getState().updateValue(data.id, data.value);
                    break;
                case "remove":
                    if (data.id) useCustomDigitalStore.getState().removeElement(data.id);
                    break;
                case "list":
                    if (Array.isArray(data.elements)) useCustomDigitalStore.getState().setAll(data.elements);
                    break;
                case "clear":
                    useCustomDigitalStore.getState().clear();
                    break;
            }
            break;

        case "setLocales":
            // ox_lib: o cliente Lua manda o dict completo (lib.getLocales()) —
            // chaves planas dotted (notify.* / info.* / menu.*). Merge sobre o
            // fallback EN embutido no i18n.ts.
            if (data.locales) useI18nStore.getState().setTranslations(data.locales);
            break;

        case "hudconfig":
            if (data.statusIcons) {
                usePlayerHudStore.getState().receiveHudConfig({ statusIcons: data.statusIcons });
            }
            if (data.serverLogo) {
                useServerLogoStore.getState().setConfig(data.serverLogo);
            }
            if (data.positioning) {
                usePositioningStore.getState().setConfig({
                    enabled: data.positioning.enabled,
                    elements: data.positioning.elements,
                });
            }
            // force=true -> config global absoluta: as stores aplicam por cima
            // do override local do player (e o limpam). Ver server/settings.lua.
            if (data.vehicleTheme) {
                useVehicleThemeStore.getState().setConfig(data.vehicleTheme, data.force === true);
            }
            if (data.playerSkin) {
                usePlayerSkinStore.getState().setConfig(data.playerSkin, data.force === true);
            }
            break;

        case "positioning":
            switch (data.topic) {
                case "toggle":
                    usePositioningStore.getState().toggle();
                    break;
                case "open":
                    usePositioningStore.setState({ active: true });
                    break;
                case "close":
                    usePositioningStore.setState({ active: false });
                    break;
            }
            break;
    }
}

export function useEventHandler() {
    useEffect(() => {
        window.addEventListener("message", mainEvent as any);
        return () => window.removeEventListener("message", mainEvent as any);
    }, []);
}

function serializeIconData(
    iconData: Record<string, any>
): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(iconData)) {
        const { icon, isShowing, name, progressValue, ...rest } = value as any;
        result[key] = rest;
    }
    return result;
}

function serializeColorData(
    colorData: Record<string, any>
): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(colorData)) {
        const { currentEffect, editableColors, ...rest } = value as any;
        result[key] = rest;
    }
    return result;
}

export async function fetchNui(eventName: string, data: unknown = {}) {
    const options = {
        method: "post",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data),
    };
    // Resolve o nome do resource em runtime. Necessario pro modo embedded
    // (iframe hospedado pelo mri_Qadmin): GetParentResourceName aponta pro
    // resource dono da NUI (o proprio HUD), entao o callback registrado em
    // client/main.lua responde. Fallback 'ps-hud' pro nome historico.
    const w = window as unknown as { GetParentResourceName?: () => string; resourceName?: string };
    const resourceName = w.GetParentResourceName ? w.GetParentResourceName() : (w.resourceName || "ps-hud");
    try {
        const resp = await fetch(`https://${resourceName}/${eventName}`, options);
        return await resp.json();
    } catch {
        // silently fail when not in FiveM context
    }
}

export function saveUIDataToServer() {
    const playerStatusIcondata = usePlayerHudStore.getState();
    const colorData = useColorEffectStore.getState();
    const layoutdata = useLayoutStore.getState();
    const serializedIconData = serializeIconData(playerStatusIcondata.icons);
    const serializedColorData = serializeColorData(colorData.icons);
    fetchNui("saveUISettings", {
        icons: serializedIconData,
        layout: layoutdata,
        colors: serializedColorData,
    });
}

export function saveUIDataToLocalStorage() {
    const playerStatusIcondata = usePlayerHudStore.getState();
    const colorData = useColorEffectStore.getState();
    const layoutData = useLayoutStore.getState();
    const profileData = useProfileStore.getState();

    localStorage.setItem(
        colorStoreLocalStorageName,
        JSON.stringify({
            ...colorData.icons,
            globalColorSettings: colorData.globalColorSettings,
        })
    );

    localStorage.setItem(
        playerStoreLocalStorageName,
        JSON.stringify({
            ...playerStatusIcondata.icons,
            globalIconSettings: playerStatusIcondata.globalIconSettings,
            dynamicIcons: playerStatusIcondata.dynamicIcons,
            __iconsVersion: ICON_DEFAULTS_VERSION,
        })
    );

    localStorage.setItem(layoutStoreLocalStorageName, JSON.stringify(layoutData));

    localStorage.setItem(
        profileLocalStorageName,
        JSON.stringify({ profiles: profileData })
    );
}

import { create } from "zustand";
// Circular dep is intentional: both stores initialize before any functions are called
// eslint-disable-next-line import/no-cycle
import { useColorEffectStore } from "./colorEffectStore";
import {
  faBrain,
  faParachuteBox,
  faMeteor,
  faOilCan,
  faUserSlash,
  faTachometerAlt,
  faHeadset,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import type {
  playerHudIcons,
  shapekind,
  iconNamesKind,
  optionalHudIconType,
  dynamicIcons,
  dynamicIconNamesKind,
} from "../types/types";
import {
  defaultHudIcon,
  createShapeIcon,
  capAmountToHundred,
  playerStoreLocalStorageName,
} from "../types/types";
import {
  heartBeatRegular,
  shieldHalf,
  drumStick,
  wineGlass,
  personRunning,
  personRifle,
  laptop,
} from "../utils/icons";

type saveUIType = "ready" | "updating";

export type playerStatusType = {
  designMode: boolean;
  designProgress: number;
  globalIconSettings: optionalHudIconType;
  icons: playerHudIcons;
  saveUIState: saveUIType;
  show: boolean;
  showingOrder: Array<keyof playerHudIcons>;
  dynamicIcons: dynamicIcons;
};

type playerHudShowMessageType = { show: boolean };

type playerHudUpdateMessageType = {
  show: boolean;
  dynamicHealth: boolean;
  dynamicArmor: boolean;
  dynamicHunger: boolean;
  dynamicThirst: boolean;
  dynamicStress: boolean;
  dynamicOxygen: boolean;
  dynamicEngine: boolean;
  dynamicNitro: boolean;
  health: number;
  playerDead: boolean;
  armor: number;
  thirst: number;
  hunger: number;
  stress: number;
  voice: number;
  radioChannel: number;
  radioTalking: boolean;
  talking: boolean;
  armed: boolean;
  oxygen: number;
  parachute: number;
  nos: number;
  cruise: boolean;
  nitroActive: boolean;
  harness: boolean;
  hp: number;
  speed: number;
  engine: number;
  cinematic: boolean;
  dev: boolean;
};

function loadStored(): Record<string, any> {
  try {
    const raw = localStorage.getItem(playerStoreLocalStorageName);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getLS<T>(stored: Record<string, any>, key: string, fallback: T): T {
  return stored[key] != null ? stored[key] : fallback;
}

function buildDefaultSettings(stored: Record<string, any>): playerStatusType {
  return {
    designMode: false,
    designProgress: 0,
    globalIconSettings: getLS(
      stored,
      "globalIconSettings",
      (({ isShowing, name, icon, progressValue, ...o }) => o)(defaultHudIcon())
    ),
    icons: {
      voice: getLS(stored, "voice", defaultHudIcon("voice", true, faMicrophone)),
      health: getLS(stored, "health", defaultHudIcon("health", false, heartBeatRegular)),
      armor: getLS(stored, "armor", defaultHudIcon("armor", false, shieldHalf)),
      hunger: getLS(stored, "hunger", defaultHudIcon("hunger", false, drumStick)),
      thirst: getLS(stored, "thirst", defaultHudIcon("thirst", false, wineGlass)),
      stress: getLS(stored, "stress", defaultHudIcon("stress", false, faBrain)),
      oxygen: getLS(stored, "oxygen", defaultHudIcon("oxygen", false, personRunning)),
      armed: getLS(stored, "armed", defaultHudIcon("armed", false, personRifle)),
      parachute: getLS(stored, "parachute", defaultHudIcon("parachute", false, faParachuteBox)),
      engine: getLS(stored, "engine", defaultHudIcon("engine", false, faOilCan)),
      harness: getLS(stored, "harness", defaultHudIcon("harness", false, faUserSlash)),
      cruise: getLS(stored, "cruise", defaultHudIcon("cruise", false, faTachometerAlt)),
      nitro: getLS(stored, "nitro", defaultHudIcon("nitro", false, faMeteor)),
      dev: getLS(stored, "dev", defaultHudIcon("dev", false, laptop)),
    },
    dynamicIcons: getLS(stored, "dynamicIcons", {
      armor: false,
      engine: false,
      health: false,
      hunger: false,
      nitro: false,
      oxygen: false,
      stress: false,
      thirst: false,
    }),
    saveUIState: "ready",
    show: false,
    showingOrder: [
      "voice", "health", "armor", "hunger", "thirst",
      "oxygen", "stress", "armed", "parachute", "harness",
      "cruise", "nitro", "dev",
    ],
  };
}

interface PlayerStatusHudState extends playerStatusType {
  resetPlayerStatusIcons: () => void;
  updateAllIconsSettings: (settingName: keyof optionalHudIconType, value: any) => void;
  updateAllDisplayOutline: (show: boolean) => void;
  updateAllHeight: (height: number) => void;
  updateAllIconScale: (scale: number) => void;
  updateAllRingSize: (ringSize: number) => void;
  updateAllRoundXAxis: (xAxisCurve: number) => void;
  updateAllRoundYAxis: (yAxisCurve: number) => void;
  updateAllRotateDegree: (degree: number) => void;
  updateAllDashes: (dashes: number) => void;
  updateAllDashGaps: (gap: number) => void;
  updateAllBorderGap: (borderGap: number) => void;
  updateAllIconRotateDegrees: (iconRotation: number) => void;
  updateAllBorderSize: (borderSize: number) => void;
  updateAllShapes: (shape: shapekind) => void;
  updateAllTranslateIconX: (x: number) => void;
  updateAllTranslateIconY: (y: number) => void;
  updateAllTranslateX: (x: number) => void;
  updateAllTranslateY: (y: number) => void;
  updateAllWidth: (width: number) => void;
  updateIconShape: (iconName: iconNamesKind, shape: shapekind) => void;
  updateIconSetting: (iconName: iconNamesKind, settingName: keyof optionalHudIconType, value: any) => void;
  updateShowingDynamicIcon: (iconName: iconNamesKind, staticShow: boolean) => boolean;
  updateAllShowingDynamicIcons: (val: boolean) => void;
  receiveHudConfig: (data: { statusIcons: Array<{ id: string; enabled: boolean }> }) => void;
  receiveShowMessage: (data: playerHudShowMessageType) => void;
  receiveStatusUpdateMessage: (data: playerHudUpdateMessageType) => void;
  receiveUIUpdateMessage: (data: Record<string, any>) => void;
  receiveProfileData: (data: any) => void;
  staticGenericZeroHandleShow: (staticSetting: boolean, currentValue: number) => boolean;
  staticEngineHandleShow: (staticSetting: boolean, currentValue: number) => boolean;
  staticGenericHundredHandleShow: (staticSetting: boolean, currentValue: number) => boolean;
  staticNitroHandleShow: (staticSetting: boolean, currentValue: number, engineValue: number) => boolean;
}

// Versao dos defaults de estilo dos icones (definidos em types.ts via
// createShapeIcon). Quando recalibramos os defaults de shape, bump aqui e a
// migracao abaixo reconstroi o estilo de cada icone JA salvo a partir do seu
// `shape`, adotando os novos defaults sem o jogador precisar resetar — e sem
// perder shape/visibilidade/icone (cores ficam no colorEffectStore).
export const ICON_DEFAULTS_VERSION = 2;

const PLAYER_ICON_KEYS = [
  "voice", "health", "armor", "hunger", "thirst", "stress", "oxygen",
  "armed", "parachute", "engine", "harness", "cruise", "nitro", "dev",
];

function migrateStored(stored: Record<string, any>): Record<string, any> {
  if (!stored || Object.keys(stored).length === 0) return stored;
  if (stored.__iconsVersion === ICON_DEFAULTS_VERSION) return stored;

  for (const key of PLAYER_ICON_KEYS) {
    const saved = stored[key];
    if (saved && saved.shape) {
      // Recria o config a partir do shape -> pega os defaults novos do types.ts,
      // preservando o que e escolha do jogador / runtime.
      stored[key] = createShapeIcon(saved.shape, {
        icon: saved.icon ?? null,
        isShowing: saved.isShowing ?? false,
        name: saved.name ?? key,
        progressValue: saved.progressValue ?? 100,
      });
    }
  }
  stored.__iconsVersion = ICON_DEFAULTS_VERSION;
  try {
    localStorage.setItem(playerStoreLocalStorageName, JSON.stringify(stored));
  } catch { /* ignore */ }
  return stored;
}

const stored = migrateStored(loadStored());

export const usePlayerStatusHudStore = create<PlayerStatusHudState>((set, get) => ({
  ...buildDefaultSettings(stored),

  resetPlayerStatusIcons() {
    localStorage.removeItem(playerStoreLocalStorageName);
    set({ ...buildDefaultSettings({}), show: true });
  },

  updateAllIconsSettings(settingName, value) {
    set((state) => {
      const icons = { ...state.icons };
      for (const icon in icons) {
        if (settingName in (icons as any)[icon]) {
          (icons as any)[icon] = { ...(icons as any)[icon], [settingName]: value };
        }
      }
      // Atualiza tambem o globalIconSettings, senao os controles globais (que
      // leem value={gs.<setting>}) ficam presos no valor antigo e o stepper
      // parece nao funcionar.
      const globalIconSettings = { ...state.globalIconSettings, [settingName]: value };
      return { icons, globalIconSettings };
    });
  },

  updateAllDisplayOutline: (show) => get().updateAllIconsSettings("displayOutline", show),
  updateAllHeight: (height) => get().updateAllIconsSettings("height", height),
  updateAllIconScale: (scale) => get().updateAllIconsSettings("iconScaling", scale),
  updateAllRingSize: (ringSize) => get().updateAllIconsSettings("ringSize", ringSize),
  updateAllRoundXAxis: (xAxisCurve) => get().updateAllIconsSettings("xAxisRound", xAxisCurve),
  updateAllRoundYAxis: (yAxisCurve) => get().updateAllIconsSettings("yAxisRound", yAxisCurve),
  updateAllRotateDegree: (degree) => get().updateAllIconsSettings("rotateDegree", degree),
  updateAllDashes: (dashes) => get().updateAllIconsSettings("dashes", dashes),
  updateAllDashGaps: (gap) => get().updateAllIconsSettings("gap", gap),
  updateAllBorderGap: (borderGap) => get().updateAllIconsSettings("borderGap", borderGap),
  updateAllIconRotateDegrees: (iconRotation) => get().updateAllIconsSettings("iconRotateDegree", iconRotation),
  updateAllBorderSize: (borderSize) => get().updateAllIconsSettings("borderSize", borderSize),
  updateAllTranslateIconX: (x) => get().updateAllIconsSettings("iconTranslateX", x),
  updateAllTranslateIconY: (y) => get().updateAllIconsSettings("iconTranslateY", y),
  updateAllTranslateX: (x) => get().updateAllIconsSettings("translateX", x),
  updateAllTranslateY: (y) => get().updateAllIconsSettings("translateY", y),
  updateAllWidth: (width) => get().updateAllIconsSettings("width", width),

  updateAllShapes(shape) {
    set((state) => {
      const icons = { ...state.icons };
      for (const icon in icons) {
        const cur = (icons as any)[icon];
        (icons as any)[icon] = createShapeIcon(shape, {
          icon: cur.icon,
          isShowing: cur.isShowing,
          name: cur.name,
          progressValue: cur.progressValue,
        });
      }
      const globalIconSettings = (({ isShowing, name, icon, progressValue, ...o }) => o)(
        createShapeIcon(shape, {
          icon: state.globalIconSettings.icon,
          isShowing: state.globalIconSettings.isShowing,
          name: state.globalIconSettings.name,
        })
      );
      return { icons, globalIconSettings };
    });
  },

  updateIconShape(iconName, shape) {
    set((state) => {
      const cur = (state.icons as any)[iconName];
      const newShape = createShapeIcon(shape, {
        icon: cur.icon,
        isShowing: cur.isShowing,
        name: cur.name,
        progressValue: cur.progressValue,
      });
      return {
        icons: {
          ...state.icons,
          [iconName]: { ...newShape, shape },
        },
      };
    });
  },

  updateIconSetting(iconName, settingName, value) {
    set((state) => ({
      icons: {
        ...state.icons,
        [iconName]: { ...(state.icons as any)[iconName], [settingName]: value },
      },
    }));
  },

  updateShowingDynamicIcon(iconName, staticShow) {
    const state = get();
    const { staticGenericZeroHandleShow, staticGenericHundredHandleShow, staticEngineHandleShow, staticNitroHandleShow } = state;
    let result = false;
    const icons = state.icons as any;

    switch (iconName) {
      case "armor":
        result = staticGenericZeroHandleShow(staticShow, icons.armor.progressValue);
        break;
      case "engine":
        result = staticEngineHandleShow(staticShow, icons.engine.progressValue);
        break;
      case "health":
        result = staticGenericHundredHandleShow(staticShow, icons.health.progressValue);
        break;
      case "hunger":
        result = staticGenericHundredHandleShow(staticShow, icons.hunger.progressValue);
        break;
      case "nitro":
        result = staticNitroHandleShow(staticShow, icons.nitro.progressValue, icons.engine.progressValue);
        break;
      case "oxygen":
        result = staticGenericHundredHandleShow(staticShow, icons.oxygen.progressValue);
        break;
      case "stress":
        result = staticGenericZeroHandleShow(staticShow, icons.stress.progressValue);
        break;
      case "thirst":
        result = staticGenericHundredHandleShow(staticShow, icons.thirst.progressValue);
        break;
    }

    set((s) => ({
      dynamicIcons: { ...s.dynamicIcons, [iconName]: staticShow },
      icons: {
        ...s.icons,
        [iconName]: { ...(s.icons as any)[iconName], isShowing: result },
      },
    }));
    return result;
  },

  updateAllShowingDynamicIcons(val) {
    set((state) => {
      const dynamicIcons = { ...state.dynamicIcons } as any;
      const icons = { ...state.icons } as any;
      const s = get();
      for (const icon in dynamicIcons) {
        dynamicIcons[icon] = val;
        icons[icon] = { ...icons[icon], isShowing: s.updateShowingDynamicIcon(icon as dynamicIconNamesKind, val) };
      }
      return { dynamicIcons, icons };
    });
  },

  receiveHudConfig(data) {
    if (!data.statusIcons?.length) return;
    const validIds = new Set(Object.keys(get().icons));
    const newOrder = data.statusIcons
      .filter((ic) => ic.enabled && validIds.has(ic.id))
      .map((ic) => ic.id) as Array<keyof playerHudIcons>;
    if (newOrder.length > 0) set({ showingOrder: newOrder });
  },

  receiveShowMessage(data) {
    set({ show: data.show });
  },

  receiveStatusUpdateMessage(data) {
    const colorStore = useColorEffectStore.getState();

    set((state) => {
      const icons = { ...state.icons } as any;
      const dyn = state.dynamicIcons as any;
      const {
        staticGenericHundredHandleShow,
        staticGenericZeroHandleShow,
        staticEngineHandleShow,
        staticNitroHandleShow,
      } = state;

      icons.health = { ...icons.health, progressValue: capAmountToHundred(data.health) };
      icons.armor = { ...icons.armor, progressValue: capAmountToHundred(data.armor) };
      icons.thirst = { ...icons.thirst, progressValue: capAmountToHundred(data.thirst) };
      icons.hunger = { ...icons.hunger, progressValue: capAmountToHundred(data.hunger) };
      icons.stress = { ...icons.stress, progressValue: capAmountToHundred(data.stress) };
      icons.voice = { ...icons.voice, progressValue: capAmountToHundred(data.voice * 16.6) };
      icons.oxygen = { ...icons.oxygen, progressValue: capAmountToHundred(data.oxygen) };
      icons.parachute = { ...icons.parachute, progressValue: capAmountToHundred(data.parachute) };
      icons.engine = { ...icons.engine, progressValue: capAmountToHundred(data.engine) };
      icons.harness = { ...icons.harness, progressValue: capAmountToHundred(data.hp * 5) };
      icons.cruise = { ...icons.cruise, progressValue: capAmountToHundred(data.speed) };
      icons.nitro = { ...icons.nitro, progressValue: capAmountToHundred(data.nos || 0) };

      icons.health.isShowing = staticGenericHundredHandleShow(dyn.health, icons.health.progressValue);
      if (data.playerDead) {
        colorStore.updateIconEffectStage("health", 1);
        icons.health.progressValue = 100;
      } else {
        colorStore.updateIconEffectStage("health", 0);
      }

      icons.armor.isShowing = staticGenericZeroHandleShow(dyn.armor, icons.armor.progressValue);
      colorStore.updateIconEffectStage("armor", data.armor <= 0 ? 1 : 0);

      icons.hunger.isShowing = staticGenericHundredHandleShow(dyn.hunger, icons.hunger.progressValue);
      colorStore.updateIconEffectStage("hunger", data.hunger <= 30 ? 1 : 0);

      icons.thirst.isShowing = staticGenericHundredHandleShow(dyn.thirst, icons.thirst.progressValue);
      colorStore.updateIconEffectStage("thirst", data.thirst <= 30 ? 1 : 0);

      icons.stress.isShowing = staticGenericZeroHandleShow(dyn.stress, icons.stress.progressValue);
      icons.oxygen.isShowing = staticGenericHundredHandleShow(dyn.oxygen, icons.oxygen.progressValue);
      icons.engine.isShowing = staticEngineHandleShow(dyn.engine, icons.engine.progressValue);

      if (data.engine <= 25) colorStore.updateIconEffectStage("engine", 2);
      else if (data.engine <= 75) colorStore.updateIconEffectStage("engine", 1);
      else colorStore.updateIconEffectStage("engine", 0);

      icons.nitro.isShowing = staticNitroHandleShow(dyn.nitro, icons.nitro.progressValue, icons.engine.progressValue);
      colorStore.updateIconEffectStage("nitro", data.nitroActive ? 1 : 0);

      if (data.talking) {
        colorStore.updateIconEffectStage("voice", data.radioTalking ? 2 : 1);
      } else {
        colorStore.updateIconEffectStage("voice", 0);
      }

      icons.voice = {
        ...icons.voice,
        icon: data.radioChannel && data.radioChannel > 0 ? faHeadset : faMicrophone,
      };

      icons.cruise = { ...icons.cruise, isShowing: !!data.cruise };
      icons.harness = { ...icons.harness, isShowing: !!data.harness };
      icons.armed = { ...icons.armed, isShowing: !!data.armed };
      icons.parachute = { ...icons.parachute, isShowing: data.parachute >= 0 };
      icons.dev = { ...icons.dev, isShowing: !!data.dev };

      return { show: data.show, icons };
    });
  },

  receiveUIUpdateMessage(data) {
    if (!data || !Object.keys(data).length) return;
    set((state) => {
      const icons = { ...state.icons } as any;
      for (const [key, value] of Object.entries(data) as [string, any][]) {
        icons[key] = {
          ...createShapeIcon(value.shape, {
            icon: icons[key].icon,
            isShowing: icons[key].isShowing,
            name: icons[key].name,
            progressValue: icons[key].progressValue,
          }),
          ...value,
        };
      }
      return { icons, saveUIState: "ready" };
    });
  },

  receiveProfileData(data) {
    get().receiveUIUpdateMessage(data.icons);
    set({ globalIconSettings: data.globalIconSettings, showingOrder: data.showingOrder });
  },

  staticGenericZeroHandleShow(staticSetting, currentValue) {
    if (staticSetting) return true;
    return currentValue !== 0;
  },

  staticEngineHandleShow(staticSetting, currentValue) {
    if (staticSetting) return currentValue >= 0;
    return currentValue < 95 && currentValue >= 0;
  },

  staticGenericHundredHandleShow(staticSetting, currentValue) {
    if (staticSetting) return true;
    return currentValue < 100;
  },

  staticNitroHandleShow(staticSetting, currentValue, engineValue) {
    if (staticSetting) return engineValue > 0;
    return currentValue > 0;
  },
}));

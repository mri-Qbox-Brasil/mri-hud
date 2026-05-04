import { create } from "zustand";
// eslint-disable-next-line import/no-cycle
import { usePlayerStatusHudStore } from "./playerStatusHudStore";
import type {
  playerHudColorEffects,
  iconNamesKind,
  colorNamesKind,
  shapekind,
  globalEditableColorsType,
} from "../types/types";
import {
  defaultColorEffect,
  defaultEditableColor,
  createEditableColor,
  colorStoreLocalStorageName,
} from "../types/types";

export interface colorEffectStoreType {
  icons: playerHudColorEffects;
  globalColorSettings: globalEditableColorsType;
}

interface ColorEffectState extends colorEffectStoreType {
  resetColorEffects: () => void;
  receiveUIUpdateMessage: (data: Record<string, any>) => void;
  updateAllDefaultEffectColorSetting: (colorSetting: colorNamesKind, newValue: any) => void;
  updateAllIconShapeEditableColor: (shape: shapekind) => void;
  updateDefaultEffectColorSetting: (iconName: iconNamesKind, colorSetting: colorNamesKind, newValue: any) => void;
  updateIconColorToProgressColor: () => void;
  updateIconEffectStage: (iconName: iconNamesKind, stageNumber: number) => void;
  updateIconShapeEditableColor: (iconName: iconNamesKind, shape: shapekind) => void;
  updateColorSetting: (iconName: iconNamesKind, stageNumber: number, settingName: colorNamesKind, newValue: any) => void;
  updateProgressColor: (iconName: iconNamesKind, stageNumber: number, newColor: string) => void;
}

function loadStored(): Record<string, any> {
  try {
    const raw = localStorage.getItem(colorStoreLocalStorageName);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getLS<T>(stored: Record<string, any>, key: string, fallback: T): T {
  return stored[key] != null ? stored[key] : fallback;
}

function buildDefaultSettings(stored: Record<string, any>): colorEffectStoreType {
  return {
    globalColorSettings: getLS(stored, "globalColorSettings", {
      editableColors: defaultEditableColor(),
      editSingleIconName: "voice",
      editSingleIconStage: 0,
      iconColor: "",
      iconContrast: 100,
      iconDropShadowAmount: 0,
      innerColor: "",
      outlineColor: "",
      outlineContrast: 100,
      outlineDropShadowAmount: 0,
      progressColor: "",
      progressContrast: 100,
      progressDropShadowAmount: 0,
    }),
    icons: {
      voice: getLS(stored, "voice", {
        currentEffect: 0,
        colorEffects: [
          defaultColorEffect("not-talking", "#FFFFFF"),
          defaultColorEffect("talking", "#FFFF3E"),
          defaultColorEffect("radio-talking", "#D64763"),
        ],
        editableColors: defaultEditableColor(),
      }),
      health: getLS(stored, "health", {
        currentEffect: 0,
        colorEffects: [
          defaultColorEffect("alive", "#06d170"),
          defaultColorEffect("dead", "#ff0000"),
        ],
        editableColors: defaultEditableColor(),
      }),
      armor: getLS(stored, "armor", {
        currentEffect: 0,
        colorEffects: [
          defaultColorEffect("armor", "#0764ce"),
          defaultColorEffect("no-armor", "#ff0000"),
        ],
        editableColors: defaultEditableColor(),
      }),
      hunger: getLS(stored, "hunger", {
        currentEffect: 0,
        colorEffects: [
          defaultColorEffect("normal", "#ffbb00"),
          defaultColorEffect("starving", "#ff0000"),
        ],
        editableColors: defaultEditableColor(),
      }),
      thirst: getLS(stored, "thirst", {
        currentEffect: 0,
        colorEffects: [
          defaultColorEffect("normal", "#3b82f6"),
          defaultColorEffect("thirsty", "#ff0000"),
        ],
        editableColors: defaultEditableColor(),
      }),
      stress: getLS(stored, "stress", {
        currentEffect: 0,
        colorEffects: [defaultColorEffect("normal", "#f51319")],
        editableColors: defaultEditableColor(),
      }),
      oxygen: getLS(stored, "oxygen", {
        currentEffect: 0,
        colorEffects: [defaultColorEffect("normal", "#07c4ce")],
        editableColors: defaultEditableColor(),
      }),
      armed: getLS(stored, "armed", {
        currentEffect: 0,
        colorEffects: [defaultColorEffect("normal", "#f563ff")],
        editableColors: defaultEditableColor(),
      }),
      parachute: getLS(stored, "parachute", {
        currentEffect: 0,
        colorEffects: [defaultColorEffect("normal", "#d1ff63")],
        editableColors: defaultEditableColor(),
      }),
      engine: getLS(stored, "engine", {
        currentEffect: 0,
        colorEffects: [
          defaultColorEffect("no-damage", "#3FA554"),
          defaultColorEffect("minor-damage", "#dd6e14"),
          defaultColorEffect("major-damage", "#ff0000"),
        ],
        editableColors: defaultEditableColor(),
      }),
      harness: getLS(stored, "harness", {
        currentEffect: 0,
        colorEffects: [defaultColorEffect("normal", "#9a00ff")],
        editableColors: defaultEditableColor(),
      }),
      cruise: getLS(stored, "cruise", {
        currentEffect: 0,
        colorEffects: [defaultColorEffect("normal", "#f563ff")],
        editableColors: defaultEditableColor(),
      }),
      nitro: getLS(stored, "nitro", {
        currentEffect: 0,
        colorEffects: [
          defaultColorEffect("no-nitro", "#ffffff"),
          defaultColorEffect("active-nitro", "#D64763"),
        ],
        editableColors: defaultEditableColor(),
      }),
      dev: getLS(stored, "dev", {
        currentEffect: 0,
        colorEffects: [defaultColorEffect("normal", "#000000")],
        editableColors: defaultEditableColor(),
      }),
    },
  };
}

const stored = loadStored();

export const useColorEffectStore = create<ColorEffectState>((set, get) => ({
  ...buildDefaultSettings(stored),

  resetColorEffects() {
    localStorage.removeItem(colorStoreLocalStorageName);
    set(buildDefaultSettings({}));
  },

  receiveUIUpdateMessage(data) {
    if (!data || !Object.keys(data).length) return;
    const playerState = usePlayerStatusHudStore.getState();

    set((state) => {
      const icons = { ...state.icons } as any;
      for (const [key, value] of Object.entries(data) as [string, any][]) {
        icons[key] = {
          currentEffect: 0,
          editableColors: createEditableColor((playerState.icons as any)[key].shape),
          colorEffects: value.colorEffects,
        };
      }
      return { icons };
    });
  },

  updateAllDefaultEffectColorSetting(colorSetting, newValue) {
    set((state) => {
      const icons = { ...state.icons } as any;
      const shadowSettings = [
        "progressDropShadowAmount",
        "iconDropShadowAmount",
        "outlineDropShadowAmount",
      ];

      for (const iconKey of Object.keys(icons)) {
        if (shadowSettings.includes(colorSetting as string)) {
          icons[iconKey] = {
            ...icons[iconKey],
            colorEffects: icons[iconKey].colorEffects.map((eff: any) => ({
              ...eff,
              [colorSetting]: newValue,
            })),
          };
        } else {
          const effects = [...icons[iconKey].colorEffects];
          effects[0] = { ...effects[0], [colorSetting]: newValue };
          icons[iconKey] = { ...icons[iconKey], colorEffects: effects };
        }
      }

      return {
        icons,
        globalColorSettings: { ...state.globalColorSettings, [colorSetting]: newValue },
      };
    });
  },

  updateAllIconShapeEditableColor(shape) {
    const newEditableSettings = createEditableColor(shape);
    set((state) => {
      const icons = { ...state.icons } as any;
      for (const icon in icons) {
        icons[icon] = { ...icons[icon], editableColors: newEditableSettings };
      }
      return {
        icons,
        globalColorSettings: {
          ...state.globalColorSettings,
          editableColors: newEditableSettings,
        },
      };
    });
  },

  updateDefaultEffectColorSetting(iconName, colorSetting, newValue) {
    set((state) => {
      const iconData = (state.icons as any)[iconName];
      const effects = [...iconData.colorEffects];
      effects[0] = { ...effects[0], [colorSetting]: newValue };
      return {
        icons: {
          ...state.icons,
          [iconName]: { ...iconData, colorEffects: effects },
        },
      };
    });
  },

  updateIconColorToProgressColor() {
    set((state) => {
      const icons = { ...state.icons } as any;
      for (const iconKey of Object.keys(icons)) {
        icons[iconKey] = {
          ...icons[iconKey],
          colorEffects: icons[iconKey].colorEffects.map((eff: any) => ({
            ...eff,
            iconColor: eff.progressColor,
          })),
        };
      }
      return { icons };
    });
  },

  updateIconEffectStage(iconName, stageNumber) {
    set((state) => {
      const iconData = (state.icons as any)[iconName];
      if (stageNumber < 0 || stageNumber > iconData.colorEffects.length - 1) return state;
      return {
        icons: {
          ...state.icons,
          [iconName]: { ...iconData, currentEffect: stageNumber },
        },
      };
    });
  },

  updateIconShapeEditableColor(iconName, shape) {
    set((state) => ({
      icons: {
        ...state.icons,
        [iconName]: {
          ...(state.icons as any)[iconName],
          editableColors: createEditableColor(shape),
        },
      },
    }));
  },

  updateColorSetting(iconName, stageNumber, settingName, newValue) {
    set((state) => {
      const iconData = (state.icons as any)[iconName];
      if (stageNumber < 0 || stageNumber > iconData.colorEffects.length - 1) return state;
      const effects = [...iconData.colorEffects];
      effects[stageNumber] = { ...effects[stageNumber], [settingName]: newValue };
      return {
        icons: {
          ...state.icons,
          [iconName]: { ...iconData, colorEffects: effects },
        },
      };
    });
  },

  updateProgressColor(iconName, stageNumber, newColor) {
    get().updateColorSetting(iconName, stageNumber, "progressColor" as colorNamesKind, newColor);
  },
}));

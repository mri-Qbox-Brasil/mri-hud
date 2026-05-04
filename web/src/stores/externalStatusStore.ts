import { create } from "zustand";
import { usePlayerStatusHudStore } from "./playerStatusHudStore";
import type { optionalHudIconMetaShapeType, iconNamesKind } from "../types/types";
import { iconNames } from "../types/types";
import {
  faDatabase,
  faWind,
  faExclamation,
  faLightbulb,
  faDollarSign,
  faPersonSwimming,
  faDumbbell,
  faBiohazard,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import * as d3 from "d3-color";

interface ExternalStatusState {
  icons: Record<string, optionalHudIconMetaShapeType>;
  receiveBuffStatusMessage: (data: BuffStatusMessage) => void;
  receiveEnhancementStatusMessage: (data: EnhancementStatusMessage) => void;
}

interface BuffStatusMessage {
  display: boolean;
  iconColor?: string;
  iconName?: string;
  buffName: string;
  outlineColor?: string;
  progressColor?: string;
  progressValue?: number;
}

interface EnhancementStatusMessage {
  display: boolean;
  iconColor?: string;
  enhancementName: string;
}

const iconDataObj: Record<string, IconDefinition> = {
  biohazard: faBiohazard,
  database: faDatabase,
  dollarsign: faDollarSign,
  dumbbell: faDumbbell,
  exclamation: faExclamation,
  lightbulb: faLightbulb,
  locationarrow: faLocationArrow,
  swimming: faPersonSwimming,
  wind: faWind,
};

function getIconData(iconName?: string): IconDefinition {
  return (iconName && iconDataObj[iconName]) || faExclamation;
}

export const useExternalStatusStore = create<ExternalStatusState>((set, get) => ({
  icons: {},

  receiveBuffStatusMessage(data) {
    const name = data.buffName;

    set((state) => {
      const icons = { ...state.icons };

      if (!icons[name]) {
        const playerState = usePlayerStatusHudStore.getState();
        const healthShape = playerState.icons.health;

        const defaultShape = {
          ...healthShape,
          icon: getIconData(data.iconName),
          isShowing: data.display ?? true,
          name,
          progressValue: data.progressValue ?? 0,
        };

        const progressColor = data.progressColor || "#FFD700";
        const iconColor = data.iconColor || "#FFFFFF";

        let outlineColor = data.outlineColor;
        if (!outlineColor) {
          const c = d3.color(progressColor);
          if (c) {
            c.opacity = 0.4;
            outlineColor = c.formatHex8();
          }
        }

        icons[name] = { ...defaultShape, iconColor, outlineColor, progressColor };
        return { icons };
      }

      if (!isNaN(data.progressValue!) && data.progressValue! >= 0) {
        icons[name] = { ...icons[name], progressValue: data.progressValue };
      } else if (data.display != null && !data.display) {
        const { [name]: _, ...rest } = icons;
        return { icons: rest };
      } else {
        console.error("PS-Buffs error: Buff State Message malformed!");
      }

      return { icons };
    });
  },

  receiveEnhancementStatusMessage(data) {
    const name = data.enhancementName;
    if (!name) {
      console.error("PS-Buffs error: Enhancement Message name malformed:", data.enhancementName);
      return;
    }

    const playerIconName = name.replace("super-", "") as iconNamesKind;
    if (!iconNames.includes(playerIconName)) {
      console.error("PS-Buffs error: Enhancement Message name not valid:", data.enhancementName);
      return;
    }

    set((state) => {
      const icons = { ...state.icons };

      if (!icons[playerIconName] && data.display && data.iconColor) {
        icons[playerIconName] = { iconColor: data.iconColor };
        return { icons };
      }

      if (data.display === false) {
        if (!icons[playerIconName]) {
          console.error("PS-Buffs error: Enhancement name not found:", data.enhancementName);
          return state;
        }
        const { [playerIconName]: _, ...rest } = icons;
        return { icons: rest };
      }

      console.error("PS-Buffs error: Enhancement Message malformed:", data);
      return state;
    });
  },
}));

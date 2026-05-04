import { create } from "zustand";
import { menuStoreLocalStorageName } from "../types/types";
import debugMode from "./debugStore";

type MapShape = "circle" | "square";

type MenuStatus = {
  show: boolean;
  isRestarting: boolean;
  adminOnly: boolean;
  isAdmin: boolean;
  isCinematicModeChecked: boolean;
  isCinematicNotifyChecked: boolean;
  isCompassFollowChecked: boolean;
  isMapEnabledChecked: boolean;
  isListSoundsChecked: boolean;
  isLowFuelAlertChecked: boolean;
  isMapNotifyChecked: boolean;
  isOpenMenuSoundsChecked: boolean;
  isOutCompassChecked: boolean;
  isOutMapChecked: boolean;
  isPointerShowChecked: boolean;
  isResetSoundsChecked: boolean;
  isShowCompassChecked: boolean;
  isShowStreetsChecked: boolean;
  isToggleMapBordersChecked: boolean;
  isToggleMapShapeChecked: MapShape;
};

interface MenuState extends MenuStatus {
  closeMenu: () => void;
  handleKeyUp: (data: KeyboardEvent) => void;
  openMenu: () => void;
  receiveMessage: () => void;
  receiveAdminMessage: (data: { adminOnly: boolean; isAdmin: boolean }) => void;
  receiveRestartMessage: () => void;
  resetHudMenuSetting: () => void;
  sendMenuSettingsToClient: () => void;
}

const EXCLUDED_FROM_STORAGE: (keyof MenuStatus)[] = ["show", "isAdmin", "isRestarting"];

function loadStored(): Record<string, any> {
  try {
    const raw = localStorage.getItem(menuStoreLocalStorageName);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getLS<T>(stored: Record<string, any>, key: string, fallback: T): T {
  return stored[key] != null ? stored[key] : fallback;
}

function buildDefaultSettings(stored: Record<string, any>): MenuStatus {
  return {
    show: debugMode,
    isRestarting: false,
    adminOnly: debugMode,
    isAdmin: debugMode,
    isCinematicModeChecked: getLS(stored, "isCinematicModeChecked",
      getLS(stored, "isCineamticModeChecked", false)),
    isCinematicNotifyChecked: getLS(stored, "isCinematicNotifChecked", true),
    isCompassFollowChecked: getLS(stored, "isCompassFollowChecked", true),
    isMapEnabledChecked: getLS(stored, "isHideMapChecked", true),
    isListSoundsChecked: getLS(stored, "isListSoundsChecked", true),
    isLowFuelAlertChecked: getLS(stored, "isLowFuelChecked", true),
    isMapNotifyChecked: getLS(stored, "isMapNotifChecked", true),
    isOpenMenuSoundsChecked: getLS(stored, "isOpenMenuSoundsChecked", true),
    isOutCompassChecked: getLS(stored, "isOutCompassChecked", true),
    isOutMapChecked: getLS(stored, "isOutMapChecked", true),
    isPointerShowChecked: getLS(stored, "isPointerShowChecked", true),
    isResetSoundsChecked: getLS(stored, "isResetSoundsChecked", true),
    isShowCompassChecked: getLS(stored, "isShowCompassChecked", true),
    isShowStreetsChecked: getLS(stored, "isShowStreetsChecked", true),
    isToggleMapBordersChecked: getLS(stored, "isToggleMapBordersChecked", true),
    isToggleMapShapeChecked: getLS(stored, "isToggleMapShapeChecked", "circle"),
  };
}

function persistState(state: MenuStatus) {
  const toSave: Partial<MenuStatus> = { ...state };
  for (const key of EXCLUDED_FROM_STORAGE) {
    delete toSave[key];
  }
  localStorage.setItem(menuStoreLocalStorageName, JSON.stringify(toSave));
}

const stored = loadStored();

export const useMenuStore = create<MenuState>((set, get) => ({
  ...buildDefaultSettings(stored),

  closeMenu() {
    set({ show: false });
    persistState(get());
    import("../utils/eventHandler").then(({ fetchNui }) => fetchNui("closeMenu"));
  },

  handleKeyUp(data) {
    if (data.key === "Escape") {
      import("../utils/eventHandler").then(({ saveUIDataToLocalStorage }) => {
        saveUIDataToLocalStorage();
      });
      get().closeMenu();
    }
  },

  openMenu() {
    set({ show: true });
    persistState(get());
  },

  receiveMessage() {
    get().openMenu();
  },

  receiveAdminMessage(data) {
    set({ adminOnly: data.adminOnly, isAdmin: data.isAdmin });
    persistState(get());
  },

  receiveRestartMessage() {
    set({ isRestarting: false });
    persistState(get());
  },

  resetHudMenuSetting() {
    localStorage.removeItem(menuStoreLocalStorageName);
    const state = get();
    set({
      ...buildDefaultSettings({}),
      show: true,
      adminOnly: state.adminOnly,
      isAdmin: state.isAdmin,
    });
    import("./playerStatusHudStore").then(({ usePlayerStatusHudStore }) => {
      usePlayerStatusHudStore.getState().updateAllShowingDynamicIcons(false);
    });
  },

  sendMenuSettingsToClient() {
    const state = get();
    import("../utils/eventHandler").then(({ fetchNui }) => {
      fetchNui("updateMenuSettingsToClient", {
        isOutMapChecked: state.isOutMapChecked,
        isOutCompassChecked: state.isOutCompassChecked,
        isCompassFollowChecked: state.isCompassFollowChecked,
        isOpenMenuSoundsChecked: state.isOpenMenuSoundsChecked,
        isResetSoundsChecked: state.isResetSoundsChecked,
        isListSoundsChecked: state.isListSoundsChecked,
        isMapNotifyChecked: state.isMapNotifyChecked,
        isLowFuelAlertChecked: state.isLowFuelAlertChecked,
        isCinematicNotifyChecked: state.isCinematicNotifyChecked,
        isToggleMapShapeChecked: state.isToggleMapShapeChecked,
        isMapEnabledChecked: state.isMapEnabledChecked,
        isToggleMapBordersChecked: state.isToggleMapBordersChecked,
        isShowCompassChecked: state.isShowCompassChecked,
        isShowStreetsChecked: state.isShowStreetsChecked,
        isPointerShowChecked: state.isPointerShowChecked,
        isCinematicModeChecked: state.isCinematicModeChecked,
      });
    });
  },
}));

// Auto-persist on every state change (excluding ephemeral fields)
useMenuStore.subscribe((state) => persistState(state));

// Send initial settings to client on load
useMenuStore.getState().sendMenuSettingsToClient();

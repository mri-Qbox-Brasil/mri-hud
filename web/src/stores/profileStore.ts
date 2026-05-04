import { create } from "zustand";
import { profileLocalStorageName } from "../types/types";
import { usePlayerStatusHudStore } from "./playerStatusHudStore";
import { useColorEffectStore } from "./colorEffectStore";
import { useLayoutStore } from "./layoutStore";

interface ProfileEntry {
  name: string;
  savedData: string;
}

interface ProfileState {
  profiles: ProfileEntry[];
  addNewProfile: () => void;
  saveHUDToProfile: (index: number) => void;
  applyProfileToHud: (index: number) => void;
  deleteProfile: (index: number) => void;
  renameProfile: (index: number, name: string) => void;
}

function persist(profiles: ProfileEntry[]) {
  try {
    localStorage.setItem(profileLocalStorageName, JSON.stringify({ profiles }));
  } catch {}
}

function loadProfiles(): ProfileEntry[] {
  try {
    const raw = localStorage.getItem(profileLocalStorageName);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Support both { profiles: [] } (new format) and legacy array format
    if (Array.isArray(parsed)) return parsed.map((p: any) => ({ name: p.name ?? "Profile", savedData: p.savedData ?? "" }));
    if (Array.isArray(parsed.profiles)) return parsed.profiles;
    return [];
  } catch {
    return [];
  }
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: loadProfiles(),

  addNewProfile() {
    set((state) => {
      const profiles = [...state.profiles, { name: `Profile#${state.profiles.length + 1}`, savedData: "" }];
      persist(profiles);
      return { profiles };
    });
  },

  saveHUDToProfile(index) {
    const playerStatusIconData = usePlayerStatusHudStore.getState();
    const colorData = useColorEffectStore.getState();
    const layoutData = useLayoutStore.getState();
    const savedData = JSON.stringify({ playerStatusIconData, colorData, layoutData });
    set((state) => {
      const profiles = state.profiles.map((p, i) => (i === index ? { ...p, savedData } : p));
      persist(profiles);
      return { profiles };
    });
  },

  applyProfileToHud(index) {
    const profile = get().profiles[index];
    if (!profile?.savedData) return;
    try {
      const { playerStatusIconData, colorData, layoutData } = JSON.parse(profile.savedData);
      usePlayerStatusHudStore.getState().receiveProfileData(playerStatusIconData);
      useColorEffectStore.getState().receiveUIUpdateMessage(colorData.icons);
      useLayoutStore.getState().receiveUIUpdateMessage(layoutData);
    } catch {}
  },

  deleteProfile(index) {
    set((state) => {
      const profiles = state.profiles.filter((_, i) => i !== index);
      persist(profiles);
      return { profiles };
    });
  },

  renameProfile(index, name) {
    set((state) => {
      const profiles = state.profiles.map((p, i) => (i === index ? { ...p, name } : p));
      persist(profiles);
      return { profiles };
    });
  },
}));

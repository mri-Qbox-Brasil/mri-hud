import { create } from "zustand";

interface CompassState {
  heading: number;
  streetName: string;
  crossingRoad: string;
  show: boolean;
  isFollowCam: boolean;
  receiveHeadingMessage: (data: any) => void;
  receiveCompassMessage: (data: any) => void;
  receiveCompassOpenMessage: (data: any) => void;
  receiveCompassCloseMessage: (data: any) => void;
}

export const useCompassHudStore = create<CompassState>((set) => ({
  heading: 0,
  streetName: "",
  crossingRoad: "",
  show: false,
  isFollowCam: true,

  receiveHeadingMessage: (data) => set({ heading: data.value ?? data.heading ?? 0 }),

  receiveCompassMessage: (data) =>
    set({
      heading: data.heading ?? 0,
      streetName: data.streetName ?? "",
      crossingRoad: data.crossingRoad ?? "",
    }),

  receiveCompassOpenMessage: (_data) => set({ show: true }),
  receiveCompassCloseMessage: (_data) => set({ show: false }),
}));

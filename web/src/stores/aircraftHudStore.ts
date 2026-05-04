import { create } from "zustand";

interface AircraftState {
  show: boolean;
  airspeed: number;      // km/h
  altitude: number;      // meters ASL (GetEntityCoords.z)
  verticalSpeed: number; // m/s, positive = climbing
  pitch: number;         // degrees — GetEntityRotation(v,2).x, positive = nose up
  roll: number;          // degrees — GetEntityRotation(v,2).y, positive = right bank
}

interface AircraftActions {
  receiveShowMessage: (isShowing: boolean) => void;
  receiveStatusMessage: (data: Partial<Pick<AircraftState, "airspeed" | "altitude" | "verticalSpeed" | "pitch" | "roll">>) => void;
}

export const useAircraftHudStore = create<AircraftState & AircraftActions>((set) => ({
  show: false,
  airspeed: 0,
  altitude: 0,
  verticalSpeed: 0,
  pitch: 0,
  roll: 0,
  receiveShowMessage(isShowing) {
    set({ show: isShowing });
  },
  receiveStatusMessage(data) {
    set(data);
  },
}));

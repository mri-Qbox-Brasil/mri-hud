import { create } from "zustand";

interface MarineState {
  show: boolean;
  speedKnots: number; // nós
  rpm: number;        // 0–100 (normalizado de GetVehicleCurrentRpm)
  pitch: number;      // trim — GetEntityRotation(v,2).x
  roll: number;       // escora — GetEntityRotation(v,2).y, positivo = boreste
}

interface MarineActions {
  receiveShowMessage: (isShowing: boolean) => void;
  receiveStatusMessage: (data: Partial<Pick<MarineState, "speedKnots" | "rpm" | "pitch" | "roll">>) => void;
}

export const useMarineHudStore = create<MarineState & MarineActions>((set) => ({
  show: false,
  speedKnots: 0,
  rpm: 0,
  pitch: 0,
  roll: 0,
  receiveShowMessage(isShowing) {
    set({ show: isShowing });
  },
  receiveStatusMessage(data) {
    set(data);
  },
}));

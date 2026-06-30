import { create } from "zustand";
import { capAmountToHundred } from "../types/types";

type VehicleStatusType = {
  fuelColor: string;
  altitude: number;
  fuel: number;
  speed: number;
  // Telemetria extra usada pelo tema 'digital' (vem do loop rapido de speed).
  rpm: number;
  gear: number;
  engine: number;
  heading: number;
  odometer: number;
  show: boolean;
  showAltitude: boolean;
  showSeatBelt: boolean;
  showSquare: boolean;
  showCircle: boolean;
  seatbeltColor: string;
  useMPH: boolean;
};

interface VehicleHudState extends VehicleStatusType {
  receiveShowMessage: (data: { show: boolean; seatbelt: boolean }) => void;
  receiveOdometerMessage: (data: { value: number }) => void;
  receiveSpeedMessage: (data: {
    speed: number;
    rpm?: number;
    gear?: number;
    engine?: number;
    heading?: number;
  }) => void;
  receiveUpdateMessage: (data: {
    show: boolean;
    isPaused: boolean;
    seatbelt: boolean;
    speed: number;
    fuel: number;
    altitude: number;
    showAltitude: boolean;
    showSeatbelt: boolean;
    useMPH: boolean;
  }) => void;
}

export const useVehicleHudStore = create<VehicleHudState>((set) => ({
  fuelColor: "#FFFFFF",
  altitude: 0,
  fuel: 0,
  speed: 0,
  rpm: 0,
  gear: 0,
  engine: 100,
  heading: 0,
  odometer: 0,
  show: false,
  showAltitude: false,
  showSeatBelt: false,
  showSquare: false,
  showCircle: false,
  seatbeltColor: "#e85b14",
  useMPH: true,

  receiveShowMessage: (data) =>
    set({ show: data.show, showSeatBelt: data.seatbelt }),

  receiveOdometerMessage: (data) =>
    set({ odometer: Math.max(0, data.value) }),

  receiveSpeedMessage: (data) =>
    set((state) => ({
      speed: data.speed,
      rpm: data.rpm ?? state.rpm,
      gear: data.gear ?? state.gear,
      engine: data.engine ?? state.engine,
      heading: data.heading ?? state.heading,
    })),

  receiveUpdateMessage: (data) =>
    set((state) => {
      let fuelColor = "#FFFFFF";
      if (data.fuel <= 20) fuelColor = "#ff0000";
      else if (data.fuel <= 30) fuelColor = "#dd6e14";

      return {
        show: data.isPaused ? false : data.show,
        altitude: data.altitude,
        fuel: capAmountToHundred(data.fuel),
        showSeatBelt: !data.seatbelt,
        showAltitude: data.showAltitude,
        fuelColor,
        useMPH: data.useMPH,
      };
    }),
}));

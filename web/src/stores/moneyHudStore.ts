import { create } from "zustand";

interface MoneyHudState {
  cash: number;
  bank: number;
  show: boolean;
  showConstant: boolean;
  isPlus: boolean;
  isMinus: boolean;
  receiveShowAccountsMessage: (data: any) => void;
  receiveShowConstantMessage: (data: any) => void;
  receiveUpdateMessage: (data: any) => void;
}

export const useMoneyHudStore = create<MoneyHudState>((set) => ({
  cash: 0,
  bank: 0,
  show: false,
  showConstant: false,
  isPlus: false,
  isMinus: false,

  receiveShowAccountsMessage: (data) =>
    set({ show: data.show ?? true, cash: data.cash ?? 0, bank: data.bank ?? 0 }),

  receiveShowConstantMessage: (data) =>
    set({ showConstant: true, cash: data.cash ?? 0, bank: data.bank ?? 0 }),

  receiveUpdateMessage: (data) =>
    set({
      show: true,
      cash: data.cash ?? 0,
      bank: data.bank ?? 0,
      isPlus: data.plus ?? false,
      isMinus: data.minus ?? false,
    }),
}));

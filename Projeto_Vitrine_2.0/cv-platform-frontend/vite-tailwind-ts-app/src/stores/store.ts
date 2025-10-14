import * as zustand from "zustand";

const createAny = (zustand as any).default ?? (zustand as any).create;

interface AppState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useStore = createAny((set: (updater: (s: AppState) => Partial<AppState>) => void) => ({
  count: 0,
  increment: () => set((state: AppState) => ({ count: state.count + 1 })),
  decrement: () => set((state: AppState) => ({ count: state.count - 1 })),
}));
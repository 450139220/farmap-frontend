import { create } from "zustand";

interface CountState {
  count: number;
  increase: () => void;
}
const useCount = create<CountState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}));

const useUser = create<UserState & UserAction>((set) => ({
  username: "",
  role: "user",
  farms: [],
  currentFarmId: undefined,
  login: (data) =>
    set(() => ({
      username: data.username,
      role: data.role,
      farms: data.farms,
      currentFarmId: data.currentFarmId,
    })),
}));

export { useCount, useUser };

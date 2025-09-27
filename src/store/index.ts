import { create } from "zustand";

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

export { useUser };

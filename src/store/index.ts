import { create } from "zustand";

interface CountState {
  count: number;
  increase: () => void;
}

const useCount = create<CountState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}));

type UserState = {
  username: string;
  role: "user" | "admin";
};
type UserAction = {
  login: (username: UserState["username"], role: UserState["role"]) => void;
};
const useUser = create<UserState & UserAction>((set) => ({
  username: "",
  role: "user",
  login: (username, role) => set(() => ({ username, role })),
}));
// TODO: fetch real user states with requests, and build farm state

export { useCount, useUser };

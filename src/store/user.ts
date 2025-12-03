import { create } from "zustand";

export type FarmPreviewType = {
  id: number;
  name: number;
};

export type UserStoreState = {
  username: string;
  role: "user" | "guest" | "admin" | "expert";
  farms: FarmPreviewType[];
};
type UserStoreActions = {
  login: (user: UserStoreState) => void;
  logout: () => void;
};
type UserStore = UserStoreState & UserStoreActions;

const initUserStore: UserStoreState = {
  username: "",
  role: "admin",
  farms: [],
};
export const useUserStore = create<UserStore>((set) => ({
  ...initUserStore,

  login: (user) =>
    set(() => ({
      ...user,
    })),
  logout: () => set(() => initUserStore),
}));

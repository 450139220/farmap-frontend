import { create } from "zustand";

type Crop = {
  date: string;
  diseases: string;
  id: number;
  latitude: number;
  longitude: number;
  rate: number;
  size: number;
  url: string;
  yield: number;
};
type Location = {
  id: number;
  latitude: number;
  longitude: number;
};

type FarmStoreState = {
  address: string;
  center: string;
  zoom: number;
  // components: ("map" | "operations" | "weather" | "statistic")[];
  id: number;
  name: string;
  type: "citrus" | "plum";
  crops: Crop[];
  locations: Location[];
  // User informations
  userId: number;
  username: string;
};
type FarmStoreActions = {
  setFarm: (farm: FarmStoreState) => void;
};

type FarmStore = FarmStoreState & FarmStoreActions;

const initFarmStore: FarmStoreState = {
  address: "",
  center: "",
  zoom: -1,
  id: -1,
  name: "",
  type: "citrus",
  crops: [],
  locations: [],
  userId: -1,
  username: "",
};
export const useFarmStore = create<FarmStore>((set) => ({
  ...initFarmStore,
  setFarm: (farm) => set(() => ({ ...farm })),
}));

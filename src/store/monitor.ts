import { create } from "zustand";

// 1. 定义 State 的接口
interface MonitorStoreState {
  userInfo: any | null;
  activeOcxVm: any | null;
  activeOcxVmNew: any | null;
  initData: any | null;
}

// 2. 定义 Actions (相当于 Vuex 的 Mutations/Actions) 的接口
interface MonitorStoreActions {
  setActiveOcxVm: (vm: any | null) => void;
  setActiveOcxVmNew: (vm: any | null) => void;
  setInitData: (data: any | null) => void;
}

// 3. 组合 State 和 Actions 接口
type MonitorStore = MonitorStoreState & MonitorStoreActions;

// 4. 创建 Zustand Store
export const useMonitorStore = create<MonitorStore>((set) => ({
  // --- State (来自 index.js 的 state) ---
  userInfo: null,
  activeOcxVm: null,
  activeOcxVmNew: null,
  initData: null,

  // --- Actions (来自 mutations.js 的逻辑) ---

  // 对应 SET_ACTIVE_OCX_VM
  setActiveOcxVm: (vm) => set({ activeOcxVm: vm }),

  // 对应 SET_ACTIVE_OCX_VM_NEW
  setActiveOcxVmNew: (vm) => set({ activeOcxVmNew: vm }),

  // 对应 SET_INIT_DATA
  setInitData: (data) => set({ initData: data }),
}));

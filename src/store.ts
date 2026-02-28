import { create } from 'zustand';

interface DashboardState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  refreshInterval: 30000, // 30s default
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
}));

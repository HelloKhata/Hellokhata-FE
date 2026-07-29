import { create } from "zustand";
import { OfflineQueueItem, AttendanceRecord } from "../types";

interface AttendanceState {
  viewMode: "manager" | "kiosk";
  setViewMode: (mode: "manager" | "kiosk") => void;

  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;

  // Offline Sync State
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  offlineQueue: OfflineQueueItem[];
  addToOfflineQueue: (item: Omit<OfflineQueueItem, "id" | "syncState" | "retryCount">) => void;
  clearQueue: () => void;

  // Kiosk Modal State
  selectedKioskEmployee: { id: string; name: string; avatarUrl?: string; role: string } | null;
  setSelectedKioskEmployee: (emp: { id: string; name: string; avatarUrl?: string; role: string } | null) => void;
  kioskSuccessMessage: string | null;
  setKioskSuccessMessage: (msg: string | null) => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  viewMode: "manager",
  setViewMode: (mode) => set({ viewMode: mode }),

  selectedBranch: "Main Branch",
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  isOnline: true,
  setIsOnline: (online) => set({ isOnline: online }),

  offlineQueue: [],
  addToOfflineQueue: (item) => {
    const newItem: OfflineQueueItem = {
      ...item,
      id: `queue-${Date.now()}`,
      syncState: get().isOnline ? "synced" : "queued",
      retryCount: 0,
    };
    set((state) => ({
      offlineQueue: [newItem, ...state.offlineQueue],
    }));
  },
  clearQueue: () => set({ offlineQueue: [] }),

  selectedKioskEmployee: null,
  setSelectedKioskEmployee: (emp) => set({ selectedKioskEmployee: emp }),
  kioskSuccessMessage: null,
  setKioskSuccessMessage: (msg) => set({ kioskSuccessMessage: msg }),
}));

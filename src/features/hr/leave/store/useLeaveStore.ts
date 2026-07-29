import { create } from "zustand";
import { LeaveRequest, LeaveStatus } from "../types";

interface LeaveState {
  activeTab: "my_leave" | "approval_queue";
  setActiveTab: (tab: "my_leave" | "approval_queue") => void;

  managerQueueFilter: "all" | LeaveStatus;
  setManagerQueueFilter: (filter: "all" | LeaveStatus) => void;

  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;

  inspectingRequest: LeaveRequest | null;
  setInspectingRequest: (req: LeaveRequest | null) => void;
}

export const useLeaveStore = create<LeaveState>((set) => ({
  activeTab: "my_leave",
  setActiveTab: (tab) => set({ activeTab: tab }),

  managerQueueFilter: "all",
  setManagerQueueFilter: (filter) => set({ managerQueueFilter: filter }),

  selectedBranch: "Main Branch",
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  inspectingRequest: null,
  setInspectingRequest: (req) => set({ inspectingRequest: req }),
}));

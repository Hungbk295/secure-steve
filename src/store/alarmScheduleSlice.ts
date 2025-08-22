import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";

// Alarm Schedule State Types
interface AlarmScheduleItem {
  key: string;
  id: string;
  time: string;
  userName: string;
  department: string;
  category: string;
  status: string;
  authorityGroup: string;
  action: string;
  processAction: string; // none, Blacklist, Whitelist
}

type IAlarmScheduleState = {
  items: AlarmScheduleItem[];
  loading: boolean;
  error: string | null;
  pendingAlertsCount: number;
  filters: {
    timeRange: string[] | null;
    risk: string;
    triageVerdict: string;
    processStatus: string;
    serverIP: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
};

// Mock data based on your specifications
const MOCK_ALARM_SCHEDULE: AlarmScheduleItem[] = [
  {
    key: "1",
    id: "AS001",
    time: "2025-06-27T23:23:00Z",
    userName: "가나다",
    department: "보안",
    category: "사용자",
    status: "삭제(퇴사)",
    authorityGroup: "사용자",
    action: "사용자",
    processAction: "승인",
  },
  {
    key: "2",
    id: "AS002",
    time: "2025-06-26T21:49:00Z",
    userName: "황동욱",
    department: "보안",
    category: "사용자",
    status: "신규 승인",
    authorityGroup: "사용자",
    action: "사용자",
    processAction: "승인",
  },
  {
    key: "3",
    id: "AS003",
    time: "2025-06-25T19:53:00Z",
    userName: "아무개",
    department: "시스템 운영팀",
    category: "사용자",
    status: "신규 승인",
    authorityGroup: "사용자",
    action: "사용지",
    processAction: "삭제",
  },
  {
    key: "4",
    id: "AS004",
    time: "2025-06-20T09:59:00Z",
    userName: "가나다",
    department: "보안",
    category: "사용자",
    status: "보류",
    authorityGroup: "사용자",
    action: "사용지",
    processAction: "잠금해제",
  },
  {
    key: "5",
    id: "AS005",
    time: "2025-06-15T00:11:00Z",
    userName: "나크림",
    department: "보안",
    category: "관리자",
    status: "삭제",
    authorityGroup: "관리자",
    action: "사용지",
    processAction: "승인",
  },
];

const initialAlarmScheduleState: IAlarmScheduleState = {
  items: [],
  loading: false,
  error: null,
  pendingAlertsCount: 0,
  filters: {
    timeRange: null,
    risk: "all",
    triageVerdict: "all",
    processStatus: "all",
    serverIP: "all",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
};

// Async Actions
export const actionGetAlarmScheduleList = createAsyncThunk(
  "alarmSchedule/actionGetAlarmScheduleList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      // Apply filters
      let filteredData = MOCK_ALARM_SCHEDULE;

      if (filters.risk && filters.risk !== "all") {
        // Note: Risk filtering would be based on actual risk field in real data
        filteredData = filteredData.filter(
          (item) => item.category === filters.risk
        );
      }

      if (filters.triageVerdict && filters.triageVerdict !== "all") {
        // Note: Triage verdict filtering would be based on actual field in real data
        filteredData = filteredData.filter((item) =>
          item.action.includes(filters.triageVerdict)
        );
      }

      if (filters.processStatus && filters.processStatus !== "all") {
        filteredData = filteredData.filter(
          (item) => item.status === filters.processStatus
        );
      }

      if (filters.serverIP && filters.serverIP !== "all") {
        // Note: Server IP filtering would be based on actual field in real data
        filteredData = filteredData.filter(
          (item) => item.department === filters.serverIP
        );
      }

      if (filters.timeRange && filters.timeRange.length === 2) {
        const [startDate, endDate] = filters.timeRange;
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.time);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return itemDate >= start && itemDate <= end;
        });
      }

      // Sort by time descending (most recent first)
      filteredData.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      // Calculate pending alerts count
      const pendingCount = filteredData.filter(
        (item) => item.status === "보류" || item.action === "중립(보류)"
      ).length;

      return {
        data: filteredData,
        total: filteredData.length,
        current: filters.page || 1,
        pageSize: filters.pageSize || 30,
        pendingAlertsCount: pendingCount,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch alarm schedule list"
      );
    }
  }
);

export const actionUpdateFilePolicy = createAsyncThunk(
  "alarmSchedule/actionUpdateFilePolicy",
  async (
    { id, policy }: { id: string; policy: string },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call to /file-policies
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (Math.random() < 0.1) {
        throw new Error("Failed to update file policy");
      }

      return { id, policy, updatedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update file policy"
      );
    }
  }
);

export const actionExportCSV = createAsyncThunk(
  "alarmSchedule/actionExportCSV",
  async (data: AlarmScheduleItem[], { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate CSV content
      const headers = [
        "Time",
        "User Name",
        "부서",
        "구분",
        "Status",
        "권한 구분",
        "처리",
        "Process Action",
      ];
      const csvContent = [
        headers.join(","),
        ...data.map((item) =>
          [
            new Date(item.time).toLocaleString(),
            item.userName,
            item.department,
            item.category,
            item.status,
            item.authorityGroup,
            item.action,
            item.processAction,
          ].join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `alarm_schedule_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to export CSV"
      );
    }
  }
);

// Alarm Schedule Slice
export const alarmScheduleSlice = createSlice({
  name: "alarmSchedule",
  initialState: initialAlarmScheduleState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1; // Reset to first page when filters change
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateItemProcessAction: (state, action) => {
      const { id, policy } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.processAction = policy;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialAlarmScheduleState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Alarm Schedule List
      .addCase(actionGetAlarmScheduleList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetAlarmScheduleList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.pendingAlertsCount = action.payload.pendingAlertsCount || 0;
        state.error = null;
      })
      .addCase(actionGetAlarmScheduleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update File Policy
      .addCase(actionUpdateFilePolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionUpdateFilePolicy.fulfilled, (state, action) => {
        state.loading = false;
        const { id, policy } = action.payload;
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.processAction = policy;
        }
        state.error = null;
      })
      .addCase(actionUpdateFilePolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Export CSV
      .addCase(actionExportCSV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionExportCSV.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(actionExportCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateFilters,
  updatePagination,
  updateItemProcessAction,
  clearError,
  resetFilters,
} = alarmScheduleSlice.actions;

// Selectors
export const selectAlarmScheduleState = (state: RootState) =>
  state.alarmSchedule;
export const selectAlarmScheduleItems = (state: RootState) =>
  state.alarmSchedule.items;
export const selectAlarmScheduleLoading = (state: RootState) =>
  state.alarmSchedule.loading;
export const selectAlarmScheduleError = (state: RootState) =>
  state.alarmSchedule.error;
export const selectAlarmScheduleFilters = (state: RootState) =>
  state.alarmSchedule.filters;
export const selectAlarmSchedulePagination = (state: RootState) =>
  state.alarmSchedule.pagination;
export const selectPendingAlertsCount = (state: RootState) =>
  state.alarmSchedule.pendingAlertsCount;

// Combined selectors
export const selectAlarmScheduleFullState = (state: RootState) => ({
  items: state.alarmSchedule.items,
  loading: state.alarmSchedule.loading,
  error: state.alarmSchedule.error,
  filters: state.alarmSchedule.filters,
  pagination: state.alarmSchedule.pagination,
  pendingAlertsCount: state.alarmSchedule.pendingAlertsCount,
});

export default alarmScheduleSlice.reducer;

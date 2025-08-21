import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";

// Report List State Types
interface ReportListItem {
  key: string;
  id: string;
  time: string;
  status: "read" | "unread";
  alertName: string;
  actionedBy: string;
}

type IReportListState = {
  items: ReportListItem[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  filters: {
    timeRange: string[] | null;
    status: string;
    actionedBy: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
};

// Mock data based on specifications
const MOCK_REPORT_LIST: ReportListItem[] = [
  {
    key: "1",
    id: "alrt_20250616_2323",
    time: "2025-06-16T23:23:00+09:00",
    status: "unread",
    alertName: "원격지 탐지",
    actionedBy: "시스템",
  },
  {
    key: "2",
    id: "alrt_20250616_2143",
    time: "2025-06-16T21:43:00+09:00",
    status: "read",
    alertName: "주기적 보안점검",
    actionedBy: "KISA DB",
  },
  {
    key: "3",
    id: "alrt_20250616_1959",
    time: "2025-06-16T19:59:00+09:00",
    status: "read",
    alertName: "관리자 접속",
    actionedBy: "보안팀",
  },
  {
    key: "4",
    id: "alrt_20250616_0011",
    time: "2025-06-16T00:11:00+09:00",
    status: "read",
    alertName: "사용자 계정 승인",
    actionedBy: "관리자",
  },
  // Additional mock data for testing
  {
    key: "5",
    id: "alrt_20250615_1530",
    time: "2025-06-15T15:30:00+09:00",
    status: "unread",
    alertName: "비정상 로그인 시도",
    actionedBy: "시스템",
  },
  {
    key: "6",
    id: "alrt_20250615_1145",
    time: "2025-06-15T11:45:00+09:00",
    status: "read",
    alertName: "파일 업로드 탐지",
    actionedBy: "보안팀",
  },
  {
    key: "7",
    id: "alrt_20250615_0820",
    time: "2025-06-15T08:20:00+09:00",
    status: "unread",
    alertName: "권한 변경 요청",
    actionedBy: "관리자",
  },
  {
    key: "8",
    id: "alrt_20250614_1415",
    time: "2025-06-14T14:15:00+09:00",
    status: "read",
    alertName: "시스템 백업 완료",
    actionedBy: "시스템",
  },
  {
    key: "9",
    id: "alrt_20250614_1630",
    time: "2025-06-14T16:30:00+09:00",
    status: "unread",
    alertName: "악성코드 탐지",
    actionedBy: "KISA DB",
  },
  {
    key: "10",
    id: "alrt_20250613_0900",
    time: "2025-06-13T09:00:00+09:00",
    status: "read",
    alertName: "정기 점검 알림",
    actionedBy: "시스템",
  },
  {
    key: "11",
    id: "alrt_20250612_1820",
    time: "2025-06-12T18:20:00+09:00",
    status: "unread",
    alertName: "의심스러운 파일 접근",
    actionedBy: "KISA DB",
  },
  {
    key: "12",
    id: "alrt_20250612_1445",
    time: "2025-06-12T14:45:00+09:00",
    status: "read",
    alertName: "네트워크 이상 트래픽",
    actionedBy: "보안팀",
  },
];

const initialReportListState: IReportListState = {
  items: [],
  loading: false,
  error: null,
  unreadCount: 0,
  filters: {
    timeRange: null,
    status: "all",
    actionedBy: "all",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
};

// Async Actions
export const actionGetReportList = createAsyncThunk(
  "reportList/actionGetReportList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call to GET /alerts
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      // Apply filters
      const filteredData = MOCK_REPORT_LIST;

      //   if (filters.status && filters.status !== "all") {
      //     filteredData = filteredData.filter(
      //       (item) => item.status === filters.status
      //     );
      //   }

      //   if (filters.actionedBy && filters.actionedBy !== "all") {
      //     filteredData = filteredData.filter(
      //       (item) => item.actionedBy === filters.actionedBy
      //     );
      //   }

      //   if (filters.timeRange && filters.timeRange.length === 2) {
      //     const [startDate, endDate] = filters.timeRange;
      //     filteredData = filteredData.filter((item) => {
      //       const itemDate = new Date(item.time);
      //       const start = new Date(startDate);
      //       const end = new Date(endDate);
      //       return itemDate >= start && itemDate <= end;
      //     });
      //   }

      //   // Sort by time descending (most recent first)
      //   filteredData.sort(
      //     (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      //   );

      //   // Calculate unread count
      //   const unreadCount = filteredData.filter(
      //     (item) => item.status === "unread"
      //   ).length;

      return {
        data: filteredData,
        total: filteredData.length,
        current: filters.page || 1,
        pageSize: filters.pageSize || 30,
        unreadCount: filteredData.filter((item) => item.status === "unread")
          .length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch report list"
      );
    }
  }
);

export const actionUpdateAlertStatus = createAsyncThunk(
  "reportList/actionUpdateAlertStatus",
  async (
    { id, status }: { id: string; status: "read" | "unread" },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call to PUT /alerts/:id/status
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (Math.random() < 0.1) {
        throw new Error("Failed to update alert status");
      }

      return { id, status, updatedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update alert status"
      );
    }
  }
);

export const actionGetAlertDetail = createAsyncThunk(
  "reportList/actionGetAlertDetail",
  async (alertId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call to GET /alerts/:id
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (Math.random() < 0.1) {
        throw new Error("Failed to fetch alert detail");
      }

      // Mock detail data
      const mockDetail = {
        id: alertId,
        time: "2025-06-16T23:23:00+09:00",
        status: "unread",
        alertName: "원격지 탐지",
        actionedBy: "시스템",
        description: "원격지에서 비정상적인 접근이 감지되었습니다.",
        severity: "high",
        source: "192.168.1.100",
        target: "66.211.75.1",
        details: {
          sourceIP: "192.168.1.100",
          targetIP: "66.211.75.1",
          protocol: "TCP",
          port: "22",
          attempts: 5,
        },
      };

      return mockDetail;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch alert detail"
      );
    }
  }
);

// Report List Slice
export const reportListSlice = createSlice({
  name: "reportList",
  initialState: initialReportListState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1; // Reset to first page when filters change
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateItemStatus: (state, action) => {
      const { id, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.status = status;
        // Update unread count
        state.unreadCount = state.items.filter(
          (item) => item.status === "unread"
        ).length;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialReportListState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Report List
      .addCase(actionGetReportList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetReportList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.unreadCount = action.payload.unreadCount || 0;
        state.error = null;
      })
      .addCase(actionGetReportList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Alert Status
      .addCase(actionUpdateAlertStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(actionUpdateAlertStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.status = status;
          // Update unread count
          state.unreadCount = state.items.filter(
            (item) => item.status === "unread"
          ).length;
        }
        state.error = null;
      })
      .addCase(actionUpdateAlertStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Get Alert Detail
      .addCase(actionGetAlertDetail.pending, (state) => {
        state.error = null;
      })
      .addCase(actionGetAlertDetail.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(actionGetAlertDetail.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  updateFilters,
  updatePagination,
  updateItemStatus,
  clearError,
  resetFilters,
} = reportListSlice.actions;

// Selectors
export const selectReportListState = (state: RootState) => state.reportList;
export const selectReportListItems = (state: RootState) =>
  state.reportList.items;
export const selectReportListLoading = (state: RootState) =>
  state.reportList.loading;
export const selectReportListError = (state: RootState) =>
  state.reportList.error;
export const selectReportListFilters = (state: RootState) =>
  state.reportList.filters;
export const selectReportListPagination = (state: RootState) =>
  state.reportList.pagination;
export const selectUnreadCount = (state: RootState) =>
  state.reportList.unreadCount;

// Combined selectors
export const selectReportListFullState = (state: RootState) => ({
  items: state.reportList.items,
  loading: state.reportList.loading,
  error: state.reportList.error,
  filters: state.reportList.filters,
  pagination: state.reportList.pagination,
  unreadCount: state.reportList.unreadCount,
});

export default reportListSlice.reducer;

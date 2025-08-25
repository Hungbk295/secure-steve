import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";

interface ReportRegularItem {
  key: string;
  id: string;
  time: string;
  status: "read" | "unread";
  reportName: string;
  publishBy: string;
}

type IReportRegularState = {
  items: ReportRegularItem[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  filters: {
    timeRange: string[] | null;
    publishBy: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
};

const MOCK_REPORT_REGULAR: ReportRegularItem[] = [
  {
    key: "1",
    id: "rpt_20250616_2323",
    time: "2025-06-16T23:23:00+09:00",
    status: "unread",
    reportName: "2025년 6월 정기 리포트",
    publishBy: "정기 생성",
  },
  {
    key: "2",
    id: "rpt_20250616_2143",
    time: "2025-06-16T21:43:00+09:00",
    status: "read",
    reportName: "test(6612175) 수사 리포트",
    publishBy: "사용자 요청",
  },
  {
    key: "3",
    id: "rpt_20250616_1953",
    time: "2025-06-16T19:53:00+09:00",
    status: "read",
    reportName: "service(df.6612175) 수사 리포트",
    publishBy: "사용자 요청",
  },
  {
    key: "4",
    id: "rpt_20250516_0011",
    time: "2025-05-16T00:11:00+09:00",
    status: "read",
    reportName: "2025년 5월 정기 리포트",
    publishBy: "정기 생성",
  },
  {
    key: "5",
    id: "rpt_20250515_1830",
    time: "2025-05-15T18:30:00+09:00",
    status: "unread",
    reportName: "보안 감사 리포트",
    publishBy: "시스템",
  },
  {
    key: "6",
    id: "rpt_20250514_1445",
    time: "2025-05-14T14:45:00+09:00",
    status: "read",
    reportName: "위협 분석 리포트",
    publishBy: "보안팀",
  },
  {
    key: "7",
    id: "rpt_20250513_1130",
    time: "2025-05-13T11:30:00+09:00",
    status: "unread",
    reportName: "월간 보안 현황 리포트",
    publishBy: "정기 생성",
  },
  {
    key: "8",
    id: "rpt_20250512_2215",
    time: "2025-05-12T22:15:00+09:00",
    status: "read",
    reportName: "침입 탐지 분석 리포트",
    publishBy: "사용자 요청",
  },
  {
    key: "9",
    id: "rpt_20250511_1955",
    time: "2025-05-11T19:55:00+09:00",
    status: "unread",
    reportName: "악성코드 분석 리포트",
    publishBy: "KISA DB",
  },
  {
    key: "10",
    id: "rpt_20250510_1630",
    time: "2025-05-10T16:30:00+09:00",
    status: "read",
    reportName: "네트워크 트래픽 분석",
    publishBy: "시스템",
  },
  {
    key: "11",
    id: "rpt_20250509_1245",
    time: "2025-05-09T12:45:00+09:00",
    status: "unread",
    reportName: "사용자 행동 분석 리포트",
    publishBy: "보안팀",
  },
  {
    key: "12",
    id: "rpt_20250508_2030",
    time: "2025-05-08T20:30:00+09:00",
    status: "read",
    reportName: "시스템 성능 리포트",
    publishBy: "운영팀",
  },
];

const initialReportRegularState: IReportRegularState = {
  items: [],
  loading: false,
  error: null,
  unreadCount: 0,
  filters: {
    timeRange: null,
    publishBy: "all",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
};

export const actionGetReportRegularList = createAsyncThunk(
  "reportRegular/actionGetReportRegularList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      const filteredData = MOCK_REPORT_REGULAR;

      const unreadCount = filteredData.filter(
        (item) => item.status === "unread"
      ).length;

      return {
        data: filteredData,
        total: filteredData.length,
        current: filters.page || 1,
        pageSize: filters.pageSize || 30,
        unreadCount: unreadCount,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch report regular list"
      );
    }
  }
);

export const actionUpdateReportStatus = createAsyncThunk(
  "reportRegular/actionUpdateReportStatus",
  async (
    { id, status }: { id: string; status: "read" | "unread" },
    { rejectWithValue }
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (Math.random() < 0.1) {
        throw new Error("Failed to update report status");
      }

      return { id, status, updatedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update report status"
      );
    }
  }
);

export const actionGetReportDetail = createAsyncThunk(
  "reportRegular/actionGetReportDetail",
  async (reportId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (Math.random() < 0.1) {
        throw new Error("Failed to fetch report detail");
      }

      const mockDetail = {
        id: reportId,
        time: "2025-06-16T23:23:00+09:00",
        status: "unread",
        reportName: "2025년 6월 정기 리포트",
        publishBy: "정기 생성",
        description: "2025년 6월 정기 보안 리포트입니다.",
        fileSize: "2.5MB",
        format: "PDF",
        downloadUrl: "/api/reports/download/" + reportId,
        content: {
          summary: "이번 달 보안 현황 요약",
          threats: 25,
          resolved: 20,
          pending: 5,
          recommendations: [
            "방화벽 규칙 업데이트 필요",
            "사용자 교육 강화",
            "패치 관리 개선",
          ],
        },
      };

      return mockDetail;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch report detail"
      );
    }
  }
);

export const actionDownloadReport = createAsyncThunk(
  "reportRegular/actionDownloadReport",
  async (reportId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to download report");
      }

      // Mock download - create a blob and trigger download
      const mockContent = `보안 리포트 내용 - ID: ${reportId}\n생성일: ${new Date().toLocaleString()}\n\n이것은 모의 리포트 내용입니다.`;
      const blob = new Blob([mockContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `report_${reportId}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, reportId };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to download report"
      );
    }
  }
);

export const reportRegularSlice = createSlice({
  name: "reportRegular",
  initialState: initialReportRegularState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateItemStatus: (state, action) => {
      const { id, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.status = status;
        state.unreadCount = state.items.filter(
          (item) => item.status === "unread"
        ).length;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialReportRegularState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(actionGetReportRegularList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetReportRegularList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.unreadCount = action.payload.unreadCount || 0;
        state.error = null;
      })
      .addCase(actionGetReportRegularList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(actionUpdateReportStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(actionUpdateReportStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.status = status;
          state.unreadCount = state.items.filter(
            (item) => item.status === "unread"
          ).length;
        }
        state.error = null;
      })
      .addCase(actionUpdateReportStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(actionGetReportDetail.pending, (state) => {
        state.error = null;
      })
      .addCase(actionGetReportDetail.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(actionGetReportDetail.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(actionDownloadReport.pending, (state) => {
        state.error = null;
      })
      .addCase(actionDownloadReport.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(actionDownloadReport.rejected, (state, action) => {
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
} = reportRegularSlice.actions;

export const selectReportRegularState = (state: RootState) =>
  state.reportRegular;
export const selectReportRegularItems = (state: RootState) =>
  state.reportRegular.items;
export const selectReportRegularLoading = (state: RootState) =>
  state.reportRegular.loading;
export const selectReportRegularError = (state: RootState) =>
  state.reportRegular.error;
export const selectReportRegularFilters = (state: RootState) =>
  state.reportRegular.filters;
export const selectReportRegularPagination = (state: RootState) =>
  state.reportRegular.pagination;
export const selectReportRegularUnreadCount = (state: RootState) =>
  state.reportRegular.unreadCount;

export const selectReportRegularFullState = (state: RootState) => ({
  items: state.reportRegular.items,
  loading: state.reportRegular.loading,
  error: state.reportRegular.error,
  filters: state.reportRegular.filters,
  pagination: state.reportRegular.pagination,
  unreadCount: state.reportRegular.unreadCount,
});

export default reportRegularSlice.reducer;

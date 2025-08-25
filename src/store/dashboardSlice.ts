import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

interface LatestAlert {
  id: string;
  malware_status: string;
  risk: string;
  file_name: string;
  client_server_ip: string;
  file_created_at: string;
  analysis_time: string;
  process_status: string;
}

interface PeriodStats {
  timeRange: string;
  totalScans: number;
  kpis: Array<{
    label: string;
    value: number;
  }>;
}

interface MalwareFamilyChart {
  labels: string[];
  series: number[];
}

interface ServerStatus {
  connectedServers: number;
  health: {
    normal: number;
    issue: number;
  };
  attentionServers: Array<{
    serverIp: string;
    owner: string;
    detectionsLastWeek: number;
  }>;
}

interface Reports {
  whitelistNotice: boolean;
  regular: Array<{
    date: string;
    title: string;
  }>;
}

type IDashboardState = {
  latestAlerts: LatestAlert[];
  periodStats: PeriodStats | null;
  malwareFamilyChart: MalwareFamilyChart | null;
  serverStatus: ServerStatus | null;
  reports: Reports | null;
  loading: boolean;
  error: string | null;
};

const MOCK_DASHBOARD_DATA = {
  latest: [
    {
      id: "req_240619_2323",
      malware_status: "malware",
      risk: "High",
      file_name: "test.elf",
      client_server_ip: "66.211.75.1",
      file_created_at: "2025-06-19T23:23:00Z",
      analysis_time: "2025-06-19T23:24:00Z",
      process_status: "pending",
    },
    {
      id: "req_240618_1445",
      malware_status: "benign",
      risk: "Medium",
      file_name: "secure_app.exe",
      client_server_ip: "66.211.75.2",
      file_created_at: "2025-06-18T14:45:00Z",
      analysis_time: "2025-06-18T14:46:30Z",
      process_status: "quarantine",
    },
    {
      id: "req_240612_1940",
      malware_status: "benign",
      risk: "Low",
      file_name: "office_document.docx",
      client_server_ip: "66.211.75.5",
      file_created_at: "2025-06-12T19:40:00Z",
      analysis_time: "2025-06-12T19:41:20Z",
      process_status: "no_action",
    },
  ],
  periodStats: {
    timeRange: "30days",
    totalScans: 312,
    kpis: [
      { label: "Confirmed Malware", value: 211 },
      { label: "No Threats", value: 101 },
      { label: "Action Completed", value: 200 },
    ],
  },
  malwareFamilyChart: {
    labels: ["패밀리1", "패밀리2", "패밀리3", "패밀리4"],
    series: [48, 22, 18, 12],
  },
  serverStatus: {
    connectedServers: 128,
    health: { normal: 126, issue: 2 },
    attentionServers: [
      {
        serverIp: "66.211.75.1",
        owner: "보안담당자A",
        detectionsLastWeek: 9,
      },
      {
        serverIp: "66.211.75.3",
        owner: "보안담당자B",
        detectionsLastWeek: 5,
      },
    ],
  },
  reports: {
    whitelistNotice: true,
    regular: [
      {
        date: "2025-07-18",
        title: "최근 한 달 네트워크 서버 멀웨어 검출 증가…",
      },
      {
        date: "2025-06-18",
        title: "최근 한 달 트로이 목마 패밀리 출연 크게 증가…",
      },
    ],
  },
};

const initialDashboardState: IDashboardState = {
  latestAlerts: [],
  periodStats: null,
  malwareFamilyChart: null,
  serverStatus: null,
  reports: null,
  loading: false,
  error: null,
};

export const actionGetDashboardData = createAsyncThunk(
  "dashboard/actionGetDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.05) {
        throw new Error("Failed to fetch dashboard data");
      }

      return MOCK_DASHBOARD_DATA;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard data"
      );
    }
  }
);

export const actionUpdateAnalysisAction = createAsyncThunk(
  "dashboard/actionUpdateAnalysisAction",
  async (
    {
      id,
      process_status,
      comments,
    }: {
      id: string;
      process_status: string;
      comments: string;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("Action selected:", {
        id,
        process_status,
        comments,
        message: "No actual API call made - just for demo",
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      return {
        id,
        process_status,
        comments,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update analysis action"
      );
    }
  }
);

export const actionGetPeriodStats = createAsyncThunk(
  "dashboard/actionGetPeriodStats",
  async (timeRange: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const statsMap: Record<string, any> = {
        "30days": {
          timeRange: "30days",
          totalScans: 312,
          kpis: [
            { label: "Confirmed Malware", value: 211 },
            { label: "No Threats", value: 101 },
            { label: "Action Completed", value: 200 },
          ],
        },
        "7days": {
          timeRange: "7days",
          totalScans: 89,
          kpis: [
            { label: "Confirmed Malware", value: 52 },
            { label: "No Threats", value: 25 },
            { label: "Action Completed", value: 48 },
          ],
        },
        "1day": {
          timeRange: "1day",
          totalScans: 12,
          kpis: [
            { label: "Confirmed Malware", value: 7 },
            { label: "No Threats", value: 3 },
            { label: "Action Completed", value: 6 },
          ],
        },
      };

      return statsMap[timeRange] || statsMap["30days"];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch period stats"
      );
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {
    updateTimeRange: (state, action) => {
      if (state.periodStats) {
        state.periodStats.timeRange = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLatestAlertStatus: (state, action) => {
      const alertIndex = state.latestAlerts.findIndex(
        (alert) => alert.id === action.payload.id
      );
      if (alertIndex !== -1) {
        state.latestAlerts[alertIndex].process_status =
          action.payload.process_status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionGetDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.latestAlerts = action.payload.latest;
        state.periodStats = action.payload.periodStats;
        state.malwareFamilyChart = action.payload.malwareFamilyChart;
        state.serverStatus = action.payload.serverStatus;
        state.reports = action.payload.reports;
        state.error = null;
      })
      .addCase(actionGetDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(actionUpdateAnalysisAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionUpdateAnalysisAction.fulfilled, (state, action) => {
        state.loading = false;
        const { id, process_status } = action.payload;
        const alertIndex = state.latestAlerts.findIndex(
          (alert) => alert.id === id
        );
        if (alertIndex !== -1) {
          state.latestAlerts[alertIndex].process_status = process_status;
        }
        state.error = null;
      })
      .addCase(actionUpdateAnalysisAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(actionGetPeriodStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetPeriodStats.fulfilled, (state, action) => {
        state.loading = false;
        state.periodStats = action.payload;
        state.error = null;
      })
      .addCase(actionGetPeriodStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateTimeRange, clearError, updateLatestAlertStatus } =
  dashboardSlice.actions;

export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectDashboardLoading = (state: RootState) =>
  state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
export const selectLatestAlerts = (state: RootState) =>
  state.dashboard.latestAlerts;
export const selectPeriodStats = (state: RootState) =>
  state.dashboard.periodStats;
export const selectMalwareFamilyChart = (state: RootState) =>
  state.dashboard.malwareFamilyChart;
export const selectServerStatus = (state: RootState) =>
  state.dashboard.serverStatus;
export const selectReports = (state: RootState) => state.dashboard.reports;

export const selectDashboardFullState = (state: RootState) => ({
  latestAlerts: state.dashboard.latestAlerts,
  periodStats: state.dashboard.periodStats,
  malwareFamilyChart: state.dashboard.malwareFamilyChart,
  serverStatus: state.dashboard.serverStatus,
  reports: state.dashboard.reports,
  loading: state.dashboard.loading,
  error: state.dashboard.error,
});

export default dashboardSlice.reducer;

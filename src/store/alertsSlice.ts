import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

// Types for alert data
export interface Alert {
  id: string;
  fileName: string;
  serverIP: string;
  riskLevel: "high" | "medium" | "low";
  malwareType: string;
  createdAt: string;
  status: "pending" | "no_action" | "quarantine" | "delete";
  completedAt?: string;
  icon?: string;
  alertName: string;
  riskPercentage: number;
  verdict: "Malware" | "Benign" | "Suspicious";
  analyzedAt: string;
}

export interface AlertsState {
  latestAlerts: Alert[];
  alertCount: number;
  loading: boolean;
  error: string | null;
}

const mockAlerts: Alert[] = [
  {
    id: "101",
    fileName: "invoice.exe",
    serverIP: "10.2.3.15",
    riskLevel: "high",
    malwareType: "Trojan",
    createdAt: "2025-07-30T14:15:00Z",
    status: "pending",
    alertName: "Malware Detection",
    riskPercentage: 96.2,
    verdict: "Malware",
    analyzedAt: "14:17",
  },
  {
    id: "102",
    fileName: "update.dll",
    serverIP: "10.2.3.12",
    riskLevel: "low",
    malwareType: "Unknown",
    createdAt: "2025-07-30T13:40:00Z",
    status: "no_action",
    completedAt: "2025-07-30T13:42:00Z",
    alertName: "Whitelist Attention",
    riskPercentage: 0.8,
    verdict: "Benign",
    analyzedAt: "13:42",
  },
  {
    id: "103",
    fileName: "suspicious_script.js",
    serverIP: "10.2.3.18",
    riskLevel: "medium",
    malwareType: "Script",
    createdAt: "2025-07-30T13:20:00Z",
    status: "pending",
    alertName: "Suspicious Activity",
    riskPercentage: 67.5,
    verdict: "Suspicious",
    analyzedAt: "13:22",
  },
];

const initialState: AlertsState = {
  latestAlerts: mockAlerts,
  alertCount: mockAlerts.filter((alert) => alert.status === "pending").length,
  loading: false,
  error: null,
};

export const fetchLatestAlerts = createAsyncThunk(
  "alerts/fetchLatest",
  async (_, { rejectWithValue }) => {
    try {
      return {
        alerts: mockAlerts,
        totalCount: mockAlerts.filter((alert) => alert.status === "pending")
          .length,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateAlertAction = createAsyncThunk(
  "alerts/updateAction",
  async (
    {
      id,
      action,
    }: {
      id: string;
      action: "pending" | "no_action" | "quarantine" | "delete";
    },
    { rejectWithValue }
  ) => {
    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 400)
      );

      if (Math.random() < 0.05) {
        throw new Error("Network error");
      }

      return { id, action };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAlerts: (state) => {
      state.latestAlerts = [];
      state.alertCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.latestAlerts = action.payload.alerts || [];
        state.alertCount = action.payload.totalCount || 0;
        state.error = null;
      })
      .addCase(fetchLatestAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAlertAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlertAction.fulfilled, (state, action) => {
        state.loading = false;
        const { id, action: newAction } = action.payload;

        const alertIndex = state.latestAlerts.findIndex(
          (alert) => alert.id === id
        );
        if (alertIndex !== -1) {
          state.latestAlerts[alertIndex].status = newAction;
          state.latestAlerts[alertIndex].completedAt = new Date().toISOString();
        }

        if (newAction !== "pending") {
          state.alertCount = Math.max(0, state.alertCount - 1);
        }

        state.error = null;
      })
      .addCase(updateAlertAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetAlerts } = alertsSlice.actions;

export const selectLatestAlerts = (state: RootState) =>
  state.alerts.latestAlerts;
export const selectAlertCount = (state: RootState) => state.alerts.alertCount;
export const selectAlertsLoading = (state: RootState) => state.alerts.loading;
export const selectAlertsError = (state: RootState) => state.alerts.error;

export default alertsSlice.reducer;

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
}

export interface AlertsState {
  latestAlerts: Alert[];
  alertCount: number;
  loading: boolean;
  error: string | null;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    fileName: "malware_sample.exe",
    serverIP: "192.168.1.100",
    riskLevel: "high",
    malwareType: "Trojan",
    createdAt: "2024-01-29T14:30:25Z",
    status: "pending",
  },
  {
    id: "2",
    fileName: "suspicious_script.js",
    serverIP: "192.168.1.101",
    riskLevel: "medium",
    malwareType: "Script",
    createdAt: "2024-01-29T14:25:15Z",
    status: "pending",
  },
  {
    id: "3",
    fileName: "unknown_binary.bin",
    serverIP: "192.168.1.102",
    riskLevel: "low",
    malwareType: "Unknown",
    createdAt: "2024-01-29T14:20:05Z",
    status: "quarantine",
    completedAt: "2024-01-29T14:22:30Z",
  },
  {
    id: "4",
    fileName: "virus_detected.dll",
    serverIP: "192.168.1.103",
    riskLevel: "high",
    malwareType: "Virus",
    createdAt: "2024-01-29T14:15:00Z",
    status: "pending",
  },
  {
    id: "5",
    fileName: "adware_component.exe",
    serverIP: "192.168.1.104",
    riskLevel: "medium",
    malwareType: "Adware",
    createdAt: "2024-01-29T14:10:30Z",
    status: "no_action",
    completedAt: "2024-01-29T14:12:00Z",
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

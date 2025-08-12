import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Alert, EAlertProcessStatus } from "@/interfaces/app";
import { mockAlertsData } from "@/data/mockAlerts";

type IInitialState = {
  latestAlerts: Alert[];
  alertCount: number;
  pendingCount: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  updatingAlerts: string[];
  pollingEnabled: boolean;
};

// Use centralized mock data
const mockAlerts: Alert[] = mockAlertsData;

const initialState: IInitialState = {
  latestAlerts: mockAlerts,
  alertCount: mockAlerts.length,
  pendingCount: mockAlerts.filter((alert) => alert.process_status === "pending")
    .length,
  loading: false,
  error: null,
  lastFetched: null,
  updatingAlerts: [],
  pollingEnabled: false,
};

export const actionFetchLatestAlerts = createAsyncThunk(
  "alerts/actionFetchLatestAlerts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const now = Date.now();
      const lastFetched = state.alerts.lastFetched;

      // Avoid spam requests - minimum 5 seconds between fetches
      if (lastFetched && now - lastFetched < 5000) {
        return {
          alerts: state.alerts.latestAlerts,
          totalCount: state.alerts.alertCount,
          pendingCount: state.alerts.pendingCount,
          cached: true,
        };
      }

      // For development - simulate API call delay and use mock data
      await new Promise((resolve) =>
        setTimeout(resolve, 300 + Math.random() * 200)
      );

      // Simulate occasional API errors for testing error handling
      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      // Use mock data for development
      return {
        alerts: mockAlerts,
        totalCount: mockAlerts.length,
        pendingCount: mockAlerts.filter(
          (alert) => alert.process_status === "pending"
        ).length,
        cached: false,
      };

      // TODO: Replace with real API call in production
      // const response = await alertsApi.getLatestAlerts();
      // return {
      //   alerts: response.data,
      //   totalCount: response.total_count,
      //   pendingCount: response.pending_count,
      //   cached: false,
      // };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch alerts"
      );
    }
  }
);

export const actionUpdateAlertAction = createAsyncThunk(
  "alerts/actionUpdateAlertAction",
  async (
    {
      alertId,
      action,
      memo: _memo,
      userId: _userId,
      actionType: _actionType,
    }: {
      alertId: string;
      action: EAlertProcessStatus;
      memo?: string;
      userId: string;
      actionType?: "blacklist" | "whitelist";
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Use actionData for real API call in production
      // const actionData: AlertActionRequest = {
      //   process_status: action,
      //   user_id: userId,
      //   comments: memo || "",
      //   action_type: actionType,
      // };

      // For development - simulate API call delay
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 400)
      );

      // Simulate occasional API errors for testing
      if (Math.random() < 0.08) {
        throw new Error("Failed to update alert status");
      }

      // Create updated alert with new status and completion time
      const currentAlert = mockAlerts.find((alert) => alert.id === alertId);
      if (!currentAlert) {
        throw new Error("Alert not found");
      }

      const updatedAlert: Alert = {
        ...currentAlert,
        process_status: action,
        // Add completion timestamp for processed items
        ...(action !== "pending" && {
          malware_status:
            action === "delete" ? "deleted" : currentAlert.malware_status,
        }),
      };

      // Update the mock data for consistency
      const alertIndex = mockAlerts.findIndex((alert) => alert.id === alertId);
      if (alertIndex !== -1) {
        mockAlerts[alertIndex] = updatedAlert;
      }

      return { alertId, updatedAlert };

      // TODO: Replace with real API call in production
      // const updatedAlert = await alertsApi.updateAlertAction(alertId, actionData);
      // return { alertId, updatedAlert };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update alert action"
      );
    }
  }
);

export const slice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAlerts: (state) => {
      state.latestAlerts = [];
      state.alertCount = 0;
      state.pendingCount = 0;
      state.error = null;
      state.lastFetched = null;
      state.updatingAlerts = [];
    },
    setPollingEnabled: (state, action) => {
      state.pollingEnabled = action.payload;
    },
    addUpdatingAlert: (state, action) => {
      const alertId = action.payload;
      if (!state.updatingAlerts.includes(alertId)) {
        state.updatingAlerts.push(alertId);
      }
    },
    removeUpdatingAlert: (state, action) => {
      const alertId = action.payload;
      state.updatingAlerts = state.updatingAlerts.filter(
        (id) => id !== alertId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionFetchLatestAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionFetchLatestAlerts.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cached) {
          state.latestAlerts = action.payload.alerts || [];
          state.alertCount = action.payload.totalCount || 0;
          state.pendingCount = action.payload.pendingCount || 0;
          state.lastFetched = Date.now();
        }
        state.error = null;
      })
      .addCase(actionFetchLatestAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(actionUpdateAlertAction.pending, (state, action) => {
        const alertId = action.meta.arg.alertId;
        if (!state.updatingAlerts.includes(alertId)) {
          state.updatingAlerts.push(alertId);
        }
        state.error = null;
      })
      .addCase(actionUpdateAlertAction.fulfilled, (state, action) => {
        const { alertId, updatedAlert } = action.payload;

        // Remove from updating list
        state.updatingAlerts = state.updatingAlerts.filter(
          (id) => id !== alertId
        );

        // Update alert in list
        const alertIndex = state.latestAlerts.findIndex(
          (alert) => alert.id === alertId
        );
        if (alertIndex !== -1) {
          state.latestAlerts[alertIndex] = updatedAlert;
        }

        // Update counts
        const pendingAlerts = state.latestAlerts.filter(
          (alert) => alert.process_status === "pending"
        );
        state.pendingCount = pendingAlerts.length;

        state.error = null;
      })
      .addCase(actionUpdateAlertAction.rejected, (state, action) => {
        const alertId = action.meta.arg.alertId;
        state.updatingAlerts = state.updatingAlerts.filter(
          (id) => id !== alertId
        );
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  resetAlerts,
  setPollingEnabled,
  addUpdatingAlert,
  removeUpdatingAlert,
} = slice.actions;

// Selectors
export const selectLatestAlerts = (state: RootState) =>
  state.alerts.latestAlerts;
export const selectAlertCount = (state: RootState) => state.alerts.alertCount;
export const selectPendingCount = (state: RootState) =>
  state.alerts.pendingCount;
export const selectAlertsLoading = (state: RootState) => state.alerts.loading;
export const selectAlertsError = (state: RootState) => state.alerts.error;
export const selectUpdatingAlerts = (state: RootState) =>
  new Set(state.alerts.updatingAlerts);
export const selectPollingEnabled = (state: RootState) =>
  state.alerts.pollingEnabled;
export const selectLastFetched = (state: RootState) => state.alerts.lastFetched;

// Combined selectors
export const selectAlertsState = (state: RootState) => ({
  alerts: state.alerts.latestAlerts,
  alertCount: state.alerts.alertCount,
  pendingCount: state.alerts.pendingCount,
  loading: state.alerts.loading,
  error: state.alerts.error,
  updatingAlerts: new Set(state.alerts.updatingAlerts),
  pollingEnabled: state.alerts.pollingEnabled,
});

export default slice.reducer;

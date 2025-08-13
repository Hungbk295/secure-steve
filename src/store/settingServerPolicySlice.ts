import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";
import { MOCK_SettingPolicy_2 } from "@/constants/mockAlert";

// Server Settings State Types
interface ServerSettingsItem {
  server_id: string;
  server_ip: string;
  comm_status: string;
  mgmt_name: string;
  priority: string;
  last_scan_at: string;
  realtime: boolean;
  scheduled: boolean;
}

type ISettingServerPolicyState = {
  servers: ServerSettingsItem[];
  loading: boolean;
  error: string | null;
  holdServersLoading: boolean;
  scanSettingsLoading: boolean;
  quarantineFolderLoading: boolean;
  filters: {
    clusterName: string;
    serverManager: string;
    settingType: string;
    timeRange: string[] | null;
    searchText: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  selectedRowKeys: string[];
};

const initialSettingServerPolicyState: ISettingServerPolicyState = {
  servers: [],
  loading: false,
  error: null,
  holdServersLoading: false,
  scanSettingsLoading: false,
  quarantineFolderLoading: false,
  filters: {
    clusterName: "",
    serverManager: "",
    settingType: "",
    timeRange: null,
    searchText: "",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
  selectedRowKeys: [],
};

// Async Actions
export const actionGetServerSettingsList = createAsyncThunk(
  "settingServerPolicy/actionGetServerSettingsList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/server-settings",
      //   method: "GET",
      //   params: filters,
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate occasional errors
      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      // Transform mock data to include keys and IDs
      const transformedData = MOCK_SettingPolicy_2.map((item) => ({
        ...item,
        key: item.server_id,
      }));

      // Apply filters
      let filteredData = transformedData;

      if (filters.clusterName) {
        filteredData = filteredData.filter(
          (item) => item.mgmt_name === filters.clusterName
        );
      }

      if (filters.serverManager) {
        filteredData = filteredData.filter(
          (item) => item.priority === filters.serverManager
        );
      }

      if (filters.settingType) {
        filteredData = filteredData.filter((item) => {
          switch (filters.settingType) {
            case "realtime":
              return item.realtime === true;
            case "scheduled":
              return item.scheduled === true;
            case "offline":
              return item.comm_status === "Offline";
            case "online":
              return item.comm_status === "Online";
            default:
              return true;
          }
        });
      }

      if (filters.searchText) {
        const searchTerm = filters.searchText.toLowerCase();
        filteredData = filteredData.filter(
          (item) =>
            item.server_ip.toLowerCase().includes(searchTerm) ||
            item.server_id.toLowerCase().includes(searchTerm) ||
            item.mgmt_name.toLowerCase().includes(searchTerm) ||
            item.comm_status.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.timeRange && filters.timeRange.length === 2) {
        const [startDate, endDate] = filters.timeRange;
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.last_scan_at);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return itemDate >= start && itemDate <= end;
        });
      }

      return {
        data: filteredData,
        total: filteredData.length,
        current: filters.page || 1,
        pageSize: filters.pageSize || 30,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch server settings list"
      );
    }
  }
);

// Async Action for Hold Servers
export const actionHoldServers = createAsyncThunk(
  "settingServerPolicy/actionHoldServers",
  async (
    {
      serverIds,
    }: {
      serverIds: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/servers/hold",
      //   method: "PUT",
      //   data: { server_ids: serverIds, user_id: userId },
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() < 0.1) {
        throw new Error("Failed to hold servers");
      }

      return {
        heldIds: serverIds,
        heldAt: new Date().toISOString(),
        count: serverIds.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to hold servers"
      );
    }
  }
);

// Async Action for Scan Settings
export const actionUpdateScanSettings = createAsyncThunk(
  "settingServerPolicy/actionUpdateScanSettings",
  async (
    {
      serverIds,
      scanSettings,
    }: {
      serverIds: string[];
      scanSettings: {
        agent_update_interval: string;
        scan_interval: string;
        scan_schedule: string;
        scan_realtime: boolean;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/servers/scan-settings",
      //   method: "PUT",
      //   data: { server_ids: serverIds, ...scanSettings, user_id: userId },
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to update scan settings");
      }

      return {
        updatedIds: serverIds,
        scanSettings,
        updatedAt: new Date().toISOString(),
        count: serverIds.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update scan settings"
      );
    }
  }
);

// Async Action for Quarantine Folder
export const actionUpdateQuarantineFolder = createAsyncThunk(
  "settingServerPolicy/actionUpdateQuarantineFolder",
  async (
    {
      serverIds,
      folderPath,
    }: {
      serverIds: string[];
      folderPath: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/servers/quarantine-folder",
      //   method: "PUT",
      //   data: { server_ids: serverIds, folder_path: folderPath, user_id: userId },
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() < 0.1) {
        throw new Error("Failed to update quarantine folder");
      }

      return {
        updatedIds: serverIds,
        folderPath,
        updatedAt: new Date().toISOString(),
        count: serverIds.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update quarantine folder"
      );
    }
  }
);

// Server Settings Slice
export const settingServerPolicySlice = createSlice({
  name: "settingServerPolicy",
  initialState: initialSettingServerPolicyState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1; // Reset to first page when filters change
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSelectedRowKeys: (state, action) => {
      state.selectedRowKeys = action.payload;
    },
    clearSelectedRows: (state) => {
      state.selectedRowKeys = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialSettingServerPolicyState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Server Settings List
      .addCase(actionGetServerSettingsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetServerSettingsList.fulfilled, (state, action) => {
        state.loading = false;
        state.servers = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.error = null;
      })
      .addCase(actionGetServerSettingsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Hold Servers
      .addCase(actionHoldServers.pending, (state) => {
        state.holdServersLoading = true;
        state.error = null;
      })
      .addCase(actionHoldServers.fulfilled, (state, action) => {
        state.holdServersLoading = false;
        const { heldIds } = action.payload;

        // Update servers status to held/pending
        state.servers = state.servers.map((server) =>
          heldIds.includes(server.server_id)
            ? { ...server, comm_status: "Held" }
            : server
        );

        // Clear selected rows
        state.selectedRowKeys = [];
        state.error = null;
      })
      .addCase(actionHoldServers.rejected, (state, action) => {
        state.holdServersLoading = false;
        state.error = action.payload as string;
      })

      // Update Scan Settings
      .addCase(actionUpdateScanSettings.pending, (state) => {
        state.scanSettingsLoading = true;
        state.error = null;
      })
      .addCase(actionUpdateScanSettings.fulfilled, (state, action) => {
        state.scanSettingsLoading = false;
        const { updatedIds, scanSettings } = action.payload;

        // Update servers with new scan settings
        state.servers = state.servers.map((server) =>
          updatedIds.includes(server.server_id)
            ? {
                ...server,
                realtime: scanSettings.scan_realtime,
                last_scan_at: new Date().toISOString(),
              }
            : server
        );

        // Clear selected rows
        state.selectedRowKeys = [];
        state.error = null;
      })
      .addCase(actionUpdateScanSettings.rejected, (state, action) => {
        state.scanSettingsLoading = false;
        state.error = action.payload as string;
      })

      // Update Quarantine Folder
      .addCase(actionUpdateQuarantineFolder.pending, (state) => {
        state.quarantineFolderLoading = true;
        state.error = null;
      })
      .addCase(actionUpdateQuarantineFolder.fulfilled, (state) => {
        state.quarantineFolderLoading = false;

        // Clear selected rows
        state.selectedRowKeys = [];
        state.error = null;
      })
      .addCase(actionUpdateQuarantineFolder.rejected, (state, action) => {
        state.quarantineFolderLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateFilters,
  updatePagination,
  setSelectedRowKeys,
  clearSelectedRows,
  clearError,
  resetFilters,
} = settingServerPolicySlice.actions;

// Selectors
export const selectSettingServerPolicyServers = (state: RootState) =>
  state.settingServerPolicy.servers;
export const selectSettingServerPolicyLoading = (state: RootState) =>
  state.settingServerPolicy.loading;
export const selectSettingServerPolicyHoldServersLoading = (state: RootState) =>
  state.settingServerPolicy.holdServersLoading;
export const selectSettingServerPolicyScanSettingsLoading = (
  state: RootState
) => state.settingServerPolicy.scanSettingsLoading;
export const selectSettingServerPolicyQuarantineFolderLoading = (
  state: RootState
) => state.settingServerPolicy.quarantineFolderLoading;
export const selectSettingServerPolicyError = (state: RootState) =>
  state.settingServerPolicy.error;
export const selectSettingServerPolicyFilters = (state: RootState) =>
  state.settingServerPolicy.filters;
export const selectSettingServerPolicyPagination = (state: RootState) =>
  state.settingServerPolicy.pagination;
export const selectSettingServerPolicySelectedRowKeys = (state: RootState) =>
  state.settingServerPolicy.selectedRowKeys;

// Combined selectors
export const selectSettingServerPolicyState = (state: RootState) => ({
  servers: state.settingServerPolicy.servers,
  loading: state.settingServerPolicy.loading,
  holdServersLoading: state.settingServerPolicy.holdServersLoading,
  scanSettingsLoading: state.settingServerPolicy.scanSettingsLoading,
  quarantineFolderLoading: state.settingServerPolicy.quarantineFolderLoading,
  error: state.settingServerPolicy.error,
  filters: state.settingServerPolicy.filters,
  pagination: state.settingServerPolicy.pagination,
  selectedRowKeys: state.settingServerPolicy.selectedRowKeys,
});

export default settingServerPolicySlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";
import { MOCK_SettingPolicy_1 } from "@/constants/mockAlert";

// Setting Policy State Types
interface ServerManager {
  id: string;
  name: string;
  dept: string;
}

interface PolicyServerItem {
  server_id: string;
  server_ip: string;
  server_cluster: string;
  manager: ServerManager;
  last_malware_detected_at: string;
}

type ISettingPolicyState = {
  servers: PolicyServerItem[];
  loading: boolean;
  error: string | null;
  assignClusterLoading: boolean;
  assignManagerLoading: boolean;
  filters: {
    clusterName: string;
    serverManager: string;
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

const initialSettingPolicyState: ISettingPolicyState = {
  servers: [],
  loading: false,
  error: null,
  assignClusterLoading: false,
  assignManagerLoading: false,
  filters: {
    clusterName: "",
    serverManager: "",
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
export const actionGetServersList = createAsyncThunk(
  "settingPolicy/actionGetServersList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/policy/servers",
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
      const transformedData = MOCK_SettingPolicy_1.map((item) => ({
        ...item,
        key: item.server_id,
      }));

      // Apply filters
      let filteredData = transformedData;

      if (filters.clusterName) {
        filteredData = filteredData.filter(
          (item) => item.server_cluster === filters.clusterName
        );
      }

      if (filters.serverManager) {
        filteredData = filteredData.filter(
          (item) => item.manager.id === filters.serverManager
        );
      }

      if (filters.searchText) {
        const searchTerm = filters.searchText.toLowerCase();
        filteredData = filteredData.filter(
          (item) =>
            item.server_ip.toLowerCase().includes(searchTerm) ||
            item.server_id.toLowerCase().includes(searchTerm) ||
            item.server_cluster.toLowerCase().includes(searchTerm) ||
            item.manager.name.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.timeRange && filters.timeRange.length === 2) {
        const [startDate, endDate] = filters.timeRange;
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.last_malware_detected_at);
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
        error instanceof Error ? error.message : "Failed to fetch servers list"
      );
    }
  }
);

// Async Action for Assigning Cluster
export const actionAssignCluster = createAsyncThunk(
  "settingPolicy/actionAssignCluster",
  async (
    {
      selectedIds,
      clusterName,
    }: {
      selectedIds: string[];
      clusterName: string;
      userId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/policy/servers/assign-cluster",
      //   method: "PUT",
      //   data: { server_ids: selectedIds, cluster_name: clusterName, user_id: userId },
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() < 0.1) {
        throw new Error("Failed to assign cluster");
      }

      return {
        assignedIds: selectedIds,
        clusterName,
        assignedAt: new Date().toISOString(),
        count: selectedIds.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to assign cluster"
      );
    }
  }
);

// Async Action for Assigning Manager
export const actionAssignManager = createAsyncThunk(
  "settingPolicy/actionAssignManager",
  async (
    {
      selectedIds,
      managerId,
    }: {
      selectedIds: string[];
      managerId: string;
      userId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/policy/servers/assign-manager",
      //   method: "PUT",
      //   data: { server_ids: selectedIds, manager_id: managerId, user_id: userId },
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() < 0.1) {
        throw new Error("Failed to assign manager");
      }

      return {
        assignedIds: selectedIds,
        managerId,
        assignedAt: new Date().toISOString(),
        count: selectedIds.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to assign manager"
      );
    }
  }
);

// Setting Policy Slice
export const settingPolicySlice = createSlice({
  name: "settingPolicy",
  initialState: initialSettingPolicyState,
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
      state.filters = initialSettingPolicyState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Servers List
      .addCase(actionGetServersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetServersList.fulfilled, (state, action) => {
        state.loading = false;
        state.servers = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.error = null;
      })
      .addCase(actionGetServersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Assign Cluster
      .addCase(actionAssignCluster.pending, (state) => {
        state.assignClusterLoading = true;
        state.error = null;
      })
      .addCase(actionAssignCluster.fulfilled, (state, action) => {
        state.assignClusterLoading = false;
        const { assignedIds, clusterName } = action.payload;

        // Update servers with new cluster assignment
        state.servers = state.servers.map((server) =>
          assignedIds.includes(server.server_id)
            ? { ...server, server_cluster: clusterName }
            : server
        );

        // Clear selected rows
        state.selectedRowKeys = [];
        state.error = null;
      })
      .addCase(actionAssignCluster.rejected, (state, action) => {
        state.assignClusterLoading = false;
        state.error = action.payload as string;
      })

      // Assign Manager
      .addCase(actionAssignManager.pending, (state) => {
        state.assignManagerLoading = true;
        state.error = null;
      })
      .addCase(actionAssignManager.fulfilled, (state, action) => {
        state.assignManagerLoading = false;
        const { assignedIds, managerId } = action.payload;

        // Find manager details from existing data (in real app, would come from API)
        const managerInfo = state.servers.find(
          (server) => server.manager.id === managerId
        )?.manager;

        if (managerInfo) {
          // Update servers with new manager assignment
          state.servers = state.servers.map((server) =>
            assignedIds.includes(server.server_id)
              ? { ...server, manager: managerInfo }
              : server
          );
        }

        // Clear selected rows
        state.selectedRowKeys = [];
        state.error = null;
      })
      .addCase(actionAssignManager.rejected, (state, action) => {
        state.assignManagerLoading = false;
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
} = settingPolicySlice.actions;

// Selectors
export const selectSettingPolicyServers = (state: RootState) =>
  state.settingPolicy.servers;
export const selectSettingPolicyLoading = (state: RootState) =>
  state.settingPolicy.loading;
export const selectSettingPolicyAssignClusterLoading = (state: RootState) =>
  state.settingPolicy.assignClusterLoading;
export const selectSettingPolicyAssignManagerLoading = (state: RootState) =>
  state.settingPolicy.assignManagerLoading;
export const selectSettingPolicyError = (state: RootState) =>
  state.settingPolicy.error;
export const selectSettingPolicyFilters = (state: RootState) =>
  state.settingPolicy.filters;
export const selectSettingPolicyPagination = (state: RootState) =>
  state.settingPolicy.pagination;
export const selectSettingPolicySelectedRowKeys = (state: RootState) =>
  state.settingPolicy.selectedRowKeys;

// Combined selectors
export const selectSettingPolicyState = (state: RootState) => ({
  servers: state.settingPolicy.servers,
  loading: state.settingPolicy.loading,
  assignClusterLoading: state.settingPolicy.assignClusterLoading,
  assignManagerLoading: state.settingPolicy.assignManagerLoading,
  error: state.settingPolicy.error,
  filters: state.settingPolicy.filters,
  pagination: state.settingPolicy.pagination,
  selectedRowKeys: state.settingPolicy.selectedRowKeys,
});

export default settingPolicySlice.reducer;

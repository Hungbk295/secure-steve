import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DynamicKeyObject } from "@/interfaces/app";
import { RootState } from "@/store";
import request from "@/utils/request";
import { API_URL_TYPE } from "@/constants/apiUrl";
import { getApiUrl } from "@/utils/app";
import { mockApiResponses } from "@/data/mockServerData";

// Types
export interface ServerData {
  id: string;
  serverIP: string;
  serverCluster: string;
  serverOwner: string;
  recentMalwareDetections: number;
  department?: string;
  lastDetectionDate?: string;
}

export interface ClusterOption {
  label: string;
  value: string;
}

export interface ManagerData {
  id: string;
  name: string;
  department: string;
  role: string;
  currentServerCount: number;
}

interface FilterState {
  clusterName: string;
  serverManager: string;
}

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

interface IInitialState {
  // Data
  servers: ServerData[];
  clusters: ClusterOption[];
  managers: ManagerData[];

  // UI State
  selectedRowKeys: string[];
  selectedRows: ServerData[];
  filters: FilterState;
  pagination: PaginationState;

  // Modal State
  clusterPopupVisible: boolean;
  managerPopupVisible: boolean;

  // Loading States
  serversLoading: boolean;
  clustersLoading: boolean;
  managersLoading: boolean;
  assignmentLoading: boolean;
}

const initialState: IInitialState = {
  servers: [],
  clusters: [],
  managers: [],
  selectedRowKeys: [],
  selectedRows: [],
  filters: {
    clusterName: "all",
    serverManager: "all",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
  clusterPopupVisible: false,
  managerPopupVisible: false,
  serversLoading: false,
  clustersLoading: false,
  managersLoading: false,
  assignmentLoading: false,
};

// Development mode flag
const USE_MOCK_DATA = import.meta.env.DEV;

// Async Thunks
export const fetchServers = createAsyncThunk(
  "analyzeDetection/fetchServers",
  async (params: DynamicKeyObject, { rejectWithValue }) => {
    try {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockApiResponses.servers;
      }

      const response = await request({
        url: getApiUrl(API_URL_TYPE.ANALYZE.DETECTION.SERVERS),
        method: "POST",
        data: params,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchClusters = createAsyncThunk(
  "analyzeDetection/fetchClusters",
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockApiResponses.clusters;
      }

      const response = await request({
        url: getApiUrl(API_URL_TYPE.ANALYZE.DETECTION.CLUSTERS),
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchManagers = createAsyncThunk(
  "analyzeDetection/fetchManagers",
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockApiResponses.managers;
      }

      const response = await request({
        url: getApiUrl(API_URL_TYPE.ANALYZE.DETECTION.MANAGERS),
        method: "GET",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkClusterDuplicate = createAsyncThunk(
  "analyzeDetection/checkClusterDuplicate",
  async (clusterName: string, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.ANALYZE.DETECTION.CLUSTER_CHECK),
        method: "POST",
        data: { clusterName },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const assignCluster = createAsyncThunk(
  "analyzeDetection/assignCluster",
  async (
    data: { clusterName: string; serverIds: string[]; addToExisting: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.ANALYZE.DETECTION.ASSIGN_CLUSTER),
        method: "POST",
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const assignManager = createAsyncThunk(
  "analyzeDetection/assignManager",
  async (
    data: { managerId: string; serverIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.ANALYZE.DETECTION.ASSIGN_MANAGER),
        method: "POST",
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const analyzeDetectionSlice = createSlice({
  name: "analyzeDetection",
  initialState,
  reducers: {
    setSelectedRows: (state, action) => {
      state.selectedRowKeys = action.payload.selectedRowKeys;
      state.selectedRows = action.payload.selectedRows;
    },
    clearSelection: (state) => {
      state.selectedRowKeys = [];
      state.selectedRows = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setClusterPopupVisible: (state, action) => {
      state.clusterPopupVisible = action.payload;
    },
    setManagerPopupVisible: (state, action) => {
      state.managerPopupVisible = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    // Fetch Servers
    builder
      .addCase(fetchServers.pending, (state) => {
        state.serversLoading = true;
      })
      .addCase(fetchServers.fulfilled, (state, action) => {
        state.serversLoading = false;
        state.servers = action.payload.data?.servers || [];
        state.pagination.total = action.payload.data?.total || 0;
      })
      .addCase(fetchServers.rejected, (state) => {
        state.serversLoading = false;
      });

    // Fetch Clusters
    builder
      .addCase(fetchClusters.pending, (state) => {
        state.clustersLoading = true;
      })
      .addCase(fetchClusters.fulfilled, (state, action) => {
        state.clustersLoading = false;
        state.clusters = action.payload.data?.clusters || [];
      })
      .addCase(fetchClusters.rejected, (state) => {
        state.clustersLoading = false;
      });

    // Fetch Managers
    builder
      .addCase(fetchManagers.pending, (state) => {
        state.managersLoading = true;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.managersLoading = false;
        state.managers = action.payload.data?.managers || [];
      })
      .addCase(fetchManagers.rejected, (state) => {
        state.managersLoading = false;
      });

    // Assignment operations
    builder
      .addCase(assignCluster.pending, (state) => {
        state.assignmentLoading = true;
      })
      .addCase(assignCluster.fulfilled, (state) => {
        state.assignmentLoading = false;
        state.clusterPopupVisible = false;
        state.selectedRowKeys = [];
        state.selectedRows = [];
      })
      .addCase(assignCluster.rejected, (state) => {
        state.assignmentLoading = false;
      });

    builder
      .addCase(assignManager.pending, (state) => {
        state.assignmentLoading = true;
      })
      .addCase(assignManager.fulfilled, (state) => {
        state.assignmentLoading = false;
        state.managerPopupVisible = false;
        state.selectedRowKeys = [];
        state.selectedRows = [];
      })
      .addCase(assignManager.rejected, (state) => {
        state.assignmentLoading = false;
      });
  },
});

// Actions
export const {
  setSelectedRows,
  clearSelection,
  setFilters,
  setPagination,
  setClusterPopupVisible,
  setManagerPopupVisible,
  resetFilters,
} = analyzeDetectionSlice.actions;

// Selectors
export const selectServers = (state: RootState) =>
  state.analyzeDetection.servers;
export const selectClusters = (state: RootState) =>
  state.analyzeDetection.clusters;
export const selectManagers = (state: RootState) =>
  state.analyzeDetection.managers;
export const selectSelectedRows = (state: RootState) =>
  state.analyzeDetection.selectedRows;
export const selectSelectedRowKeys = (state: RootState) =>
  state.analyzeDetection.selectedRowKeys;
export const selectFilters = (state: RootState) =>
  state.analyzeDetection.filters;
export const selectPagination = (state: RootState) =>
  state.analyzeDetection.pagination;
export const selectClusterPopupVisible = (state: RootState) =>
  state.analyzeDetection.clusterPopupVisible;
export const selectManagerPopupVisible = (state: RootState) =>
  state.analyzeDetection.managerPopupVisible;
export const selectServersLoading = (state: RootState) =>
  state.analyzeDetection.serversLoading;
export const selectClustersLoading = (state: RootState) =>
  state.analyzeDetection.clustersLoading;
export const selectManagersLoading = (state: RootState) =>
  state.analyzeDetection.managersLoading;
export const selectAssignmentLoading = (state: RootState) =>
  state.analyzeDetection.assignmentLoading;

export default analyzeDetectionSlice.reducer;

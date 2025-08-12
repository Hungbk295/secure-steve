import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject, EAlertProcessStatus } from "@/interfaces/app";
import { MOCK_AnalysisDetectionList } from "@/constants/mockAlert";

// Detection List State
type IDetectionListState = {
  items: any[];
  loading: boolean;
  error: string | null;
  filters: {
    timeRange: [string, string] | null;
    risk: string[];
    riskMin?: number;
    riskMax?: number;
    verdict: string[];
    processStatus: string[];
    serverIP: string;
    fileNameOrHash: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  sorting: {
    field: string;
    order: "asc" | "desc";
  };
};

const initialDetectionListState: IDetectionListState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    timeRange: null,
    risk: [],
    verdict: [],
    processStatus: [],
    serverIP: "",
    fileNameOrHash: "",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
  sorting: {
    field: "time",
    order: "desc",
  },
};

// Async Actions for Detection List
export const actionGetDetectionList = createAsyncThunk(
  "detection/actionGetDetectionList",
  async (query: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/analysis/requests",
      //   method: "GET",
      //   params: query,
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate occasional errors
      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      return {
        data: MOCK_AnalysisDetectionList,
        total: MOCK_AnalysisDetectionList.length,
        current: query.page || 1,
        pageSize: query.pageSize || 30,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch detection list"
      );
    }
  }
);

export const actionUpdateProcessStatus = createAsyncThunk(
  "detection/actionUpdateProcessStatus",
  async (
    {
      id,
      processStatus,
    }: {
      id: number | string;
      processStatus: EAlertProcessStatus;
      userId: string;
      comments?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: `/analysis/requests/${id}/action`,
      //   method: "PUT",
      //   data: { process_status: processStatus, user_id: userId, comments },
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to update process status");
      }

      return {
        id,
        processStatus,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update process status"
      );
    }
  }
);

export const actionUpdateFilePolicy = createAsyncThunk(
  "detection/actionUpdateFilePolicy",
  async (
    {
      analysisRequestId,
      filePolicy,
      actionType,
    }: {
      analysisRequestId: number | string;
      filePolicy: "blacklist" | "whitelist";
      actionType?: "delete" | "quarantine";
      comments?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/file-policies",
      //   method: "POST",
      //   data: { analysis_request_id: analysisRequestId, file_policy: filePolicy, action_type: actionType, comments },
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to update file policy");
      }

      return {
        analysisRequestId,
        filePolicy,
        actionType,
        appliedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update file policy"
      );
    }
  }
);

// Detection List Slice
export const detectionListSlice = createSlice({
  name: "detectionList",
  initialState: initialDetectionListState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateSorting: (state, action) => {
      state.sorting = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialDetectionListState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionGetDetectionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetDetectionList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.error = null;
      })
      .addCase(actionGetDetectionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(actionUpdateProcessStatus.fulfilled, (state, action) => {
        const { id, processStatus } = action.payload;
        const itemIndex = state.items.findIndex((item) => item.id == id);
        if (itemIndex !== -1) {
          state.items[itemIndex].process_status = processStatus;
        }
      })
      .addCase(actionUpdateFilePolicy.fulfilled, (state, action) => {
        const { analysisRequestId, filePolicy } = action.payload;
        const itemIndex = state.items.findIndex(
          (item) => item.id == analysisRequestId
        );
        if (itemIndex !== -1) {
          state.items[itemIndex].exception = filePolicy;
        }
      });
  },
});

export const {
  updateFilters,
  updatePagination,
  updateSorting,
  clearError,
  resetFilters,
} = detectionListSlice.actions;

// Selectors
export const selectDetectionItems = (state: RootState) =>
  state.detectionList.items;
export const selectDetectionLoading = (state: RootState) =>
  state.detectionList.loading;
export const selectDetectionError = (state: RootState) =>
  state.detectionList.error;
export const selectDetectionFilters = (state: RootState) =>
  state.detectionList.filters;
export const selectDetectionPagination = (state: RootState) =>
  state.detectionList.pagination;
export const selectDetectionSorting = (state: RootState) =>
  state.detectionList.sorting;

export default detectionListSlice.reducer;

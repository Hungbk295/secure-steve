import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";
import { MOCK_ActionPending_Analysis, MOCK_TasksCompleted } from "@/constants/mockAlert";

// Action State Types
type IActionState = {
  pendingItems: any[];
  completedItems: any[];
  loading: boolean;
  error: string | null;
  filters: {
    risk: string[];
    verdict: string[];
    serverIP: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  selectedRowKeys: string[];
  bulkActionLoading: boolean;
};

const initialActionState: IActionState = {
  pendingItems: [],
  completedItems: [],
  loading: false,
  error: null,
  filters: {
    risk: [],
    verdict: [],
    serverIP: "",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
  selectedRowKeys: [],
  bulkActionLoading: false,
};

// Async Actions for Pending Items
export const actionGetPendingList = createAsyncThunk(
  "action/actionGetPendingList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/analysis/requests/pending",
      //   method: "GET",
      //   params: filters,
      // });

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate occasional errors
      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      // Transform mock data to include keys and IDs
      const transformedData = MOCK_ActionPending_Analysis.map((item, index) => ({
        id: `pending-${index}`,
        key: `pending-${index}`,
        time: item.time,
        file_name: item.file_name,
        risk: item.risk,
        verdict: item.verdict,
        server_ip: item.server_ip,
        process_status: "pending",
      }));

      // Apply filters
      let filteredData = transformedData;
      
      if (filters.risk && filters.risk.length > 0) {
        filteredData = filteredData.filter(item => {
          const riskNum = parseFloat(item.risk.replace('%', ''));
          return filters.risk.some((riskLevel: string) => {
            switch (riskLevel) {
              case 'high': return riskNum >= 80;
              case 'medium': return riskNum >= 50 && riskNum < 80;
              case 'low': return riskNum < 50;
              default: return true;
            }
          });
        });
      }

      if (filters.verdict && filters.verdict.length > 0) {
        filteredData = filteredData.filter(item => 
          filters.verdict.includes(item.verdict.toLowerCase())
        );
      }

      if (filters.serverIP) {
        filteredData = filteredData.filter(item => 
          item.server_ip === filters.serverIP
        );
      }

      return {
        data: filteredData,
        total: filteredData.length,
        current: filters.page || 1,
        pageSize: filters.pageSize || 30,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch pending list"
      );
    }
  }
);

// Async Action for Bulk Processing
export const actionBulkProcess = createAsyncThunk(
  "action/actionBulkProcess",
  async (
    {
      selectedIds,
      action,
      memo,
      userId,
    }: {
      selectedIds: string[];
      action: "delete" | "quarantine" | "no_action" | "pending";
      memo?: string;
      userId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/analysis/requests/bulk-action",
      //   method: "PUT",
      //   data: { ids: selectedIds, process_status: action, user_id: userId, comments: memo },
      // });

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (Math.random() < 0.1) {
        throw new Error("Failed to process bulk action");
      }

      return {
        processedIds: selectedIds,
        action,
        processedAt: new Date().toISOString(),
        count: selectedIds.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to process bulk action"
      );
    }
  }
);

// Async Actions for Completed Items
export const actionGetCompletedList = createAsyncThunk(
  "action/actionGetCompletedList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/analysis/requests/completed",
      //   method: "GET",
      //   params: filters,
      // });

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 600));

      return {
        data: MOCK_TasksCompleted,
        total: MOCK_TasksCompleted.length,
        current: filters.page || 1,
        pageSize: filters.pageSize || 30,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch completed list"
      );
    }
  }
);

// Action Slice
export const actionSlice = createSlice({
  name: "action",
  initialState: initialActionState,
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
      state.filters = initialActionState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Pending List
      .addCase(actionGetPendingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetPendingList.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingItems = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.error = null;
      })
      .addCase(actionGetPendingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Bulk Process
      .addCase(actionBulkProcess.pending, (state) => {
        state.bulkActionLoading = true;
        state.error = null;
      })
      .addCase(actionBulkProcess.fulfilled, (state, action) => {
        state.bulkActionLoading = false;
        const { processedIds, action: processAction } = action.payload;
        
        // If action is not "pending", remove items from pending list
        if (processAction !== "pending") {
          state.pendingItems = state.pendingItems.filter(
            item => !processedIds.includes(item.id)
          );
          state.pagination.total = state.pendingItems.length;
        }
        
        // Clear selected rows
        state.selectedRowKeys = [];
        state.error = null;
      })
      .addCase(actionBulkProcess.rejected, (state, action) => {
        state.bulkActionLoading = false;
        state.error = action.payload as string;
      })
      
      // Get Completed List
      .addCase(actionGetCompletedList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetCompletedList.fulfilled, (state, action) => {
        state.loading = false;
        state.completedItems = action.payload.data || [];
        state.error = null;
      })
      .addCase(actionGetCompletedList.rejected, (state, action) => {
        state.loading = false;
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
} = actionSlice.actions;

// Selectors
export const selectActionPendingItems = (state: RootState) => state.action.pendingItems;
export const selectActionCompletedItems = (state: RootState) => state.action.completedItems;
export const selectActionLoading = (state: RootState) => state.action.loading;
export const selectActionBulkLoading = (state: RootState) => state.action.bulkActionLoading;
export const selectActionError = (state: RootState) => state.action.error;
export const selectActionFilters = (state: RootState) => state.action.filters;
export const selectActionPagination = (state: RootState) => state.action.pagination;
export const selectActionSelectedRowKeys = (state: RootState) => state.action.selectedRowKeys;

// Combined selectors
export const selectActionState = (state: RootState) => ({
  pendingItems: state.action.pendingItems,
  completedItems: state.action.completedItems,
  loading: state.action.loading,
  bulkActionLoading: state.action.bulkActionLoading,
  error: state.action.error,
  filters: state.action.filters,
  pagination: state.action.pagination,
  selectedRowKeys: state.action.selectedRowKeys,
});

export default actionSlice.reducer;
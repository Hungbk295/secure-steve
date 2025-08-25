import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";
import {
  MOCK_FilePolicy_Blacklist,
  MOCK_FilePolicy_Whitelist,
  MOCK_AnalysisRequests_WithException,
} from "@/constants/mockAlert";

interface FilePolicyItem {
  id: string;
  time: string;
  file_name: string;
  file_hash: string;
  risk: number;
  verdict: string;
  server_ip: string;
  policy: "blacklist" | "whitelist";
  list_status: string;
  actioned_by: string;
  process_status?: string;
  comments?: string;
}

interface AnalysisRequestItem {
  id: string;
  time: string;
  file_name: string;
  risk: number;
  verdict: string;
  server_ip: string;
  process_status: string;
  exception: "none" | "blacklist" | "whitelist";
}

type IBlacklistState = {
  blacklistItems: FilePolicyItem[];
  whitelistItems: FilePolicyItem[];
  analysisRequests: AnalysisRequestItem[];
  loading: boolean;
  addPolicyLoading: boolean;
  bulkMoveLoading: boolean;
  bulkRemoveLoading: boolean;
  error: string | null;
  filters: {
    timeRange: string[] | null;
    risk: string;
    triageVerdict: string;
    processStatus: string;
    serverIP: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  selectedRowKeys: string[];
  activeTab: "blacklist" | "whitelist";
};

const initialBlacklistState: IBlacklistState = {
  blacklistItems: [],
  whitelistItems: [],
  analysisRequests: [],
  loading: false,
  addPolicyLoading: false,
  bulkMoveLoading: false,
  bulkRemoveLoading: false,
  error: null,
  filters: {
    timeRange: null,
    risk: "all",
    triageVerdict: "all",
    processStatus: "all",
    serverIP: "all",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
  selectedRowKeys: [],
  activeTab: "blacklist",
};

export const actionGetFilePolicies = createAsyncThunk(
  "blacklist/actionGetFilePolicies",
  async (
    {
      type,
      filters = {},
    }: { type: "blacklist" | "whitelist"; filters?: DynamicKeyObject },
    { rejectWithValue }
  ) => {
    try {
      // return await request({
      //   url: `/file-policies?type=${type}`,
      //   method: "GET",
      //   params: filters,
      // });

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      const mockData =
        type === "blacklist"
          ? MOCK_FilePolicy_Blacklist.map((item) => ({
              ...item,
              key: item.id,
            }))
          : MOCK_FilePolicy_Whitelist.map((item) => ({
              ...item,
              key: item.id,
            }));

      let filteredData = mockData;

      if (filters.risk && filters.risk !== "all") {
        filteredData = filteredData.filter((item) => {
          const riskNum = item.risk;
          switch (filters.risk) {
            case "high":
              return riskNum >= 80;
            case "medium":
              return riskNum >= 50 && riskNum < 80;
            case "low":
              return riskNum < 50;
            default:
              return true;
          }
        });
      }

      if (filters.triageVerdict && filters.triageVerdict !== "all") {
        filteredData = filteredData.filter(
          (item) =>
            item.verdict.toLowerCase() === filters.triageVerdict.toLowerCase()
        );
      }

      if (filters.processStatus && filters.processStatus !== "all") {
        filteredData = filteredData.filter(
          (item) => item.process_status === filters.processStatus
        );
      }

      if (filters.serverIP && filters.serverIP !== "all") {
        filteredData = filteredData.filter(
          (item) => item.server_ip === filters.serverIP
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
        error instanceof Error ? error.message : "Failed to fetch file policies"
      );
    }
  }
);

export const actionGetAnalysisRequests = createAsyncThunk(
  "blacklist/actionGetAnalysisRequests",
  async (_, { rejectWithValue }) => {
    try {
      // return await request({
      //   url: "/analysis/requests",
      //   method: "GET",
      //   params: filters,
      // });

      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockData = MOCK_AnalysisRequests_WithException;

      return {
        data: mockData,
        total: mockData.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch analysis requests"
      );
    }
  }
);

export const actionAddToFilePolicy = createAsyncThunk(
  "blacklist/actionAddToFilePolicy",
  async (
    {
      analysisRequestId,
      filePolicy,
      processStatus,
      comments,
    }: {
      analysisRequestId: string;
      filePolicy: "blacklist" | "whitelist";
      processStatus: string;
      comments?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // return await request({
      //   url: "/file-policies",
      //   method: "POST",
      //   data: {
      //     analysis_request_id: analysisRequestId,
      //     file_policy: filePolicy,
      //     process_status: processStatus,
      //     comments,
      //   },
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() < 0.1) {
        throw new Error("Failed to add to file policy");
      }

      return {
        analysisRequestId,
        filePolicy,
        processStatus,
        comments,
        addedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add to file policy"
      );
    }
  }
);

export const actionBulkMoveFilePolicy = createAsyncThunk(
  "blacklist/actionBulkMoveFilePolicy",
  async (
    {
      selectedIds,
      targetPolicy,
      comments,
    }: {
      selectedIds: string[];
      targetPolicy: "blacklist" | "whitelist";
      comments?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // return await request({
      //   url: "/file-policies/bulk-move",
      //   method: "POST",
      //   data: {
      //     items: selectedIds.map(id => ({ analysis_request_id: id })),
      //     target_policy: targetPolicy,
      //     comments,
      //   },
      // });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to bulk move file policies");
      }

      return {
        movedIds: selectedIds,
        targetPolicy,
        comments,
        movedAt: new Date().toISOString(),
        count: selectedIds.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to bulk move file policies"
      );
    }
  }
);

export const actionBulkRemoveFilePolicy = createAsyncThunk(
  "blacklist/actionBulkRemoveFilePolicy",
  async (
    {
      selectedIds,
      comments,
    }: {
      selectedIds: string[];
      comments?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // return await request({
      //   url: "/file-policies/bulk-remove",
      //   method: "POST",
      //   data: {
      //     items: selectedIds.map(id => ({ analysis_request_id: id })),
      //     comments,
      //   },
      // });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to bulk remove file policies");
      }

      return {
        removedIds: selectedIds,
        comments,
        removedAt: new Date().toISOString(),
        count: selectedIds.length,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to bulk remove file policies"
      );
    }
  }
);

export const blacklistSlice = createSlice({
  name: "blacklist",
  initialState: initialBlacklistState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1;
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
      state.filters = initialBlacklistState.filters;
      state.pagination.current = 1;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.selectedRowKeys = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionGetFilePolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetFilePolicies.fulfilled, (state, action) => {
        state.loading = false;
        const {
          meta: {
            arg: { type },
          },
          payload,
        } = action;

        if (type === "blacklist") {
          state.blacklistItems = (payload.data as any[]) || [];
        } else {
          state.whitelistItems = (payload.data as any[]) || [];
        }

        state.pagination.total = payload.total || 0;
        state.pagination.current = payload.current || 1;
        state.pagination.pageSize = payload.pageSize || 30;
        state.error = null;
      })
      .addCase(actionGetFilePolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(actionGetAnalysisRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetAnalysisRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisRequests = (action.payload.data as any[]) || [];
        state.error = null;
      })
      .addCase(actionGetAnalysisRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(actionAddToFilePolicy.pending, (state) => {
        state.addPolicyLoading = true;
        state.error = null;
      })
      .addCase(actionAddToFilePolicy.fulfilled, (state, action) => {
        state.addPolicyLoading = false;

        const { analysisRequestId, filePolicy } = action.payload;
        state.analysisRequests = state.analysisRequests.map((item) =>
          item.id === analysisRequestId
            ? { ...item, exception: filePolicy }
            : item
        );

        state.error = null;
      })
      .addCase(actionAddToFilePolicy.rejected, (state, action) => {
        state.addPolicyLoading = false;
        state.error = action.payload as string;
      })

      .addCase(actionBulkMoveFilePolicy.pending, (state) => {
        state.bulkMoveLoading = true;
        state.error = null;
      })
      .addCase(actionBulkMoveFilePolicy.fulfilled, (state, action) => {
        state.bulkMoveLoading = false;
        const { movedIds, targetPolicy } = action.payload;

        if (targetPolicy === "blacklist") {
          const itemsToMove = state.whitelistItems.filter((item) =>
            movedIds.includes(item.id)
          );
          state.whitelistItems = state.whitelistItems.filter(
            (item) => !movedIds.includes(item.id)
          );
          state.blacklistItems = [
            ...state.blacklistItems,
            ...itemsToMove.map((item) => ({
              ...item,
              policy: "blacklist" as const,
            })),
          ];
        } else {
          const itemsToMove = state.blacklistItems.filter((item) =>
            movedIds.includes(item.id)
          );
          state.blacklistItems = state.blacklistItems.filter(
            (item) => !movedIds.includes(item.id)
          );
          state.whitelistItems = [
            ...state.whitelistItems,
            ...itemsToMove.map((item) => ({
              ...item,
              policy: "whitelist" as const,
            })),
          ];
        }

        state.selectedRowKeys = [];
        state.error = null;
      })
      .addCase(actionBulkMoveFilePolicy.rejected, (state, action) => {
        state.bulkMoveLoading = false;
        state.error = action.payload as string;
      })

      .addCase(actionBulkRemoveFilePolicy.pending, (state) => {
        state.bulkRemoveLoading = true;
        state.error = null;
      })
      .addCase(actionBulkRemoveFilePolicy.fulfilled, (state, action) => {
        state.bulkRemoveLoading = false;
        const { removedIds } = action.payload;

        state.blacklistItems = state.blacklistItems.filter(
          (item) => !removedIds.includes(item.id)
        );
        state.whitelistItems = state.whitelistItems.filter(
          (item) => !removedIds.includes(item.id)
        );

        state.selectedRowKeys = [];
        state.error = null;
      })
      .addCase(actionBulkRemoveFilePolicy.rejected, (state, action) => {
        state.bulkRemoveLoading = false;
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
  setActiveTab,
} = blacklistSlice.actions;

export const selectBlacklistItems = (state: RootState) =>
  state.blacklist.blacklistItems;
export const selectWhitelistItems = (state: RootState) =>
  state.blacklist.whitelistItems;
export const selectAnalysisRequests = (state: RootState) =>
  state.blacklist.analysisRequests;
export const selectBlacklistLoading = (state: RootState) =>
  state.blacklist.loading;
export const selectAddPolicyLoading = (state: RootState) =>
  state.blacklist.addPolicyLoading;
export const selectBulkMoveLoading = (state: RootState) =>
  state.blacklist.bulkMoveLoading;
export const selectBulkRemoveLoading = (state: RootState) =>
  state.blacklist.bulkRemoveLoading;
export const selectBlacklistError = (state: RootState) => state.blacklist.error;
export const selectBlacklistFilters = (state: RootState) =>
  state.blacklist.filters;
export const selectBlacklistPagination = (state: RootState) =>
  state.blacklist.pagination;
export const selectBlacklistSelectedRowKeys = (state: RootState) =>
  state.blacklist.selectedRowKeys;
export const selectActiveTab = (state: RootState) => state.blacklist.activeTab;

export const selectBlacklistState = (state: RootState) => ({
  blacklistItems: state.blacklist.blacklistItems,
  whitelistItems: state.blacklist.whitelistItems,
  analysisRequests: state.blacklist.analysisRequests,
  loading: state.blacklist.loading,
  addPolicyLoading: state.blacklist.addPolicyLoading,
  bulkMoveLoading: state.blacklist.bulkMoveLoading,
  bulkRemoveLoading: state.blacklist.bulkRemoveLoading,
  error: state.blacklist.error,
  filters: state.blacklist.filters,
  pagination: state.blacklist.pagination,
  selectedRowKeys: state.blacklist.selectedRowKeys,
  activeTab: state.blacklist.activeTab,
});

export default blacklistSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";
import { MOCK_ActionCompleted_Analysis } from "@/constants/mockAlert";

// Complete State Types
type ICompleteState = {
  completedItems: any[];
  loading: boolean;
  error: string | null;
  filters: {
    timeRange: [string, string] | null;
    risk: string[];
    verdict: string[];
    processStatus: string[];
    serverIP: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  csvExportLoading: boolean;
};

const initialCompleteState: ICompleteState = {
  completedItems: [],
  loading: false,
  error: null,
  filters: {
    timeRange: null,
    risk: [],
    verdict: [],
    processStatus: [],
    serverIP: "",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
  csvExportLoading: false,
};

// Async Actions for Completed Items
export const actionGetCompletedList = createAsyncThunk(
  "complete/actionGetCompletedList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/analysis/requests/completed",
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
      const transformedData = MOCK_ActionCompleted_Analysis.map(
        (item, index) => ({
          id: `completed-${index}`,
          key: `completed-${index}`,
          time: item.time,
          file_name: item.file_name,
          risk: item.risk,
          verdict: item.verdict,
          server_ip: item.server_ip,
          process_status: item.process_status,
          actioned_by: item.actioned_by,
        })
      );

      // Apply filters
      let filteredData = transformedData;

      // Time range filter
      if (filters.timeRange && filters.timeRange.length === 2) {
        const [startDate, endDate] = filters.timeRange;
        filteredData = filteredData.filter((item) => {
          // Parse the date from format "16 June 25 | 23:23" to Date
          const dateStr = item.time.split(" | ")[0];
          const itemDate = new Date(
            dateStr.replace(/(\d+) (\w+) (\d+)/, "20$3-$2-$1")
          );
          const start = new Date(startDate);
          const end = new Date(endDate);
          return itemDate >= start && itemDate <= end;
        });
      }

      // Risk filter
      if (filters.risk && filters.risk.length > 0) {
        filteredData = filteredData.filter((item) => {
          const riskNum = parseFloat(item.risk.replace("%", ""));
          return filters.risk.some((riskLevel: string) => {
            switch (riskLevel) {
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
        });
      }

      // Verdict filter
      if (filters.verdict && filters.verdict.length > 0) {
        filteredData = filteredData.filter((item) =>
          filters.verdict.includes(item.verdict.toLowerCase())
        );
      }

      // Process status filter
      if (filters.processStatus && filters.processStatus.length > 0) {
        filteredData = filteredData.filter((item) =>
          filters.processStatus.includes(item.process_status)
        );
      }

      // Server IP filter
      if (filters.serverIP) {
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
        error instanceof Error
          ? error.message
          : "Failed to fetch completed list"
      );
    }
  }
);

// Async Action for CSV Export
export const actionExportCompletedCSV = createAsyncThunk(
  "complete/actionExportCompletedCSV",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      // return await request({
      //   url: "/analysis/requests/completed/export",
      //   method: "GET",
      //   params: filters,
      //   responseType: 'blob',
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() < 0.1) {
        throw new Error("Export failed");
      }

      // Simulate CSV export
      const csvData =
        "data:text/csv;charset=utf-8,Time,File Name,Risk,Verdict,Server IP,Process Status,Actioned By\n";
      const csvContent = MOCK_ActionCompleted_Analysis.map(
        (item) =>
          `${item.time},${item.file_name},${item.risk},${item.verdict},${item.server_ip},${item.process_status},${item.actioned_by}`
      ).join("\n");

      return {
        csvData: csvData + csvContent,
        filename: `completed_actions_${
          new Date().toISOString().split("T")[0]
        }.csv`,
        exportedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to export CSV"
      );
    }
  }
);

// Complete Slice
export const completeSlice = createSlice({
  name: "complete",
  initialState: initialCompleteState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1; // Reset to first page when filters change
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialCompleteState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Completed List
      .addCase(actionGetCompletedList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetCompletedList.fulfilled, (state, action) => {
        state.loading = false;
        state.completedItems = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.error = null;
      })
      .addCase(actionGetCompletedList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CSV Export
      .addCase(actionExportCompletedCSV.pending, (state) => {
        state.csvExportLoading = true;
        state.error = null;
      })
      .addCase(actionExportCompletedCSV.fulfilled, (state) => {
        state.csvExportLoading = false;
        // Download will be handled in component
        state.error = null;
      })
      .addCase(actionExportCompletedCSV.rejected, (state, action) => {
        state.csvExportLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFilters, updatePagination, clearError, resetFilters } =
  completeSlice.actions;

// Selectors
export const selectCompleteItems = (state: RootState) =>
  state.complete.completedItems;
export const selectCompleteLoading = (state: RootState) =>
  state.complete.loading;
export const selectCompleteCSVLoading = (state: RootState) =>
  state.complete.csvExportLoading;
export const selectCompleteError = (state: RootState) => state.complete.error;
export const selectCompleteFilters = (state: RootState) =>
  state.complete.filters;
export const selectCompletePagination = (state: RootState) =>
  state.complete.pagination;

// Combined selectors
export const selectCompleteState = (state: RootState) => ({
  completedItems: state.complete.completedItems,
  loading: state.complete.loading,
  csvExportLoading: state.complete.csvExportLoading,
  error: state.complete.error,
  filters: state.complete.filters,
  pagination: state.complete.pagination,
});

export default completeSlice.reducer;

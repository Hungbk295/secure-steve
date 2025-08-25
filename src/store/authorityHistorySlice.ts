import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { DynamicKeyObject } from "@/interfaces/app";

interface AuthorityHistoryItem {
  key: string;
  id: string;
  time: string;
  user_name: string;
  department: string;
  user_type: string;
  status: string;
}

type IAuthorityHistoryState = {
  items: AuthorityHistoryItem[];
  loading: boolean;
  error: string | null;
  filters: {
    dateRange: string[] | null;
    department: string;
    userType: string;
    status: string;
    searchText: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
};

const MOCK_AUTHORITY_HISTORY: AuthorityHistoryItem[] = [
  {
    key: "1",
    id: "AH001",
    time: "2025-06-27T23:23:00Z",
    user_name: "가나다",
    department: "보안",
    user_type: "사용자",
    status: "삭제(퇴사)",
  },
  {
    key: "2",
    id: "AH002",
    time: "2025-06-26T21:49:00Z",
    user_name: "황골동",
    department: "보안",
    user_type: "사용자",
    status: "신규 승인",
  },
  {
    key: "3",
    id: "AH003",
    time: "2025-06-25T19:53:00Z",
    user_name: "아무개",
    department: "시스템 운영팀",
    user_type: "사용자",
    status: "신규 승인",
  },
  {
    key: "4",
    id: "AH004",
    time: "2025-06-20T09:59:00Z",
    user_name: "가나다",
    department: "보안",
    user_type: "사용자",
    status: "신규 승인",
  },
  {
    key: "5",
    id: "AH005",
    time: "2025-06-15T00:11:00Z",
    user_name: "나글리",
    department: "보안",
    user_type: "관리자",
    status: "반려",
  },
  {
    key: "6",
    id: "AH006",
    time: "2025-06-10T00:11:00Z",
    user_name: "나글리",
    department: "보안",
    user_type: "사용자",
    status: "신규 승인",
  },
  // Additional mock data
  {
    key: "7",
    id: "AH007",
    time: "2025-06-08T14:30:00Z",
    user_name: "김철수",
    department: "개발팀",
    user_type: "사용자",
    status: "신규 승인",
  },
  {
    key: "8",
    id: "AH008",
    time: "2025-06-05T16:45:00Z",
    user_name: "이영희",
    department: "시스템 운영팀",
    user_type: "관리자",
    status: "반려",
  },
  {
    key: "9",
    id: "AH009",
    time: "2025-06-03T10:20:00Z",
    user_name: "박민수",
    department: "보안",
    user_type: "사용자",
    status: "신규 승인",
  },
  {
    key: "10",
    id: "AH010",
    time: "2025-06-01T08:15:00Z",
    user_name: "최지혜",
    department: "개발팀",
    user_type: "관리자",
    status: "삭제(퇴사)",
  },
  {
    key: "11",
    id: "AH011",
    time: "2025-05-30T13:25:00Z",
    user_name: "정현우",
    department: "시스템 운영팀",
    user_type: "사용자",
    status: "신규 승인",
  },
  {
    key: "12",
    id: "AH012",
    time: "2025-05-28T11:40:00Z",
    user_name: "송미경",
    department: "보안",
    user_type: "사용자",
    status: "반려",
  },
];

const initialAuthorityHistoryState: IAuthorityHistoryState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    dateRange: null,
    department: "",
    userType: "",
    status: "",
    searchText: "",
  },
  pagination: {
    current: 1,
    pageSize: 30,
    total: 0,
  },
};

export const actionGetAuthorityHistoryList = createAsyncThunk(
  "authorityHistory/actionGetAuthorityHistoryList",
  async (filters: DynamicKeyObject = {}, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      let filteredData = MOCK_AUTHORITY_HISTORY;

      if (filters.department && filters.department !== "All") {
        filteredData = filteredData.filter(
          (item) => item.department === filters.department
        );
      }

      if (filters.userType && filters.userType !== "All") {
        filteredData = filteredData.filter(
          (item) => item.user_type === filters.userType
        );
      }

      if (filters.status && filters.status !== "All") {
        filteredData = filteredData.filter(
          (item) => item.status === filters.status
        );
      }

      if (filters.searchText) {
        const searchTerm = filters.searchText.toLowerCase();
        filteredData = filteredData.filter(
          (item) =>
            item.user_name.toLowerCase().includes(searchTerm) ||
            item.department.toLowerCase().includes(searchTerm) ||
            item.user_type.toLowerCase().includes(searchTerm) ||
            item.status.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.time);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return itemDate >= start && itemDate <= end;
        });
      }

      filteredData.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );

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
          : "Failed to fetch authority history list"
      );
    }
  }
);

export const actionExportCSV = createAsyncThunk(
  "authorityHistory/actionExportCSV",
  async (data: AuthorityHistoryItem[], { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const headers = ["Time", "사용자", "부서", "사용자 구분", "Status"];
      const csvContent = [
        headers.join(","),
        ...data.map((item) =>
          [
            new Date(item.time).toLocaleString(),
            item.user_name,
            item.department,
            item.user_type,
            item.status,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `authority_history_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to export CSV"
      );
    }
  }
);

export const authorityHistorySlice = createSlice({
  name: "authorityHistory",
  initialState: initialAuthorityHistoryState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialAuthorityHistoryState.filters;
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionGetAuthorityHistoryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetAuthorityHistoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.current = action.payload.current || 1;
        state.pagination.pageSize = action.payload.pageSize || 30;
        state.error = null;
      })
      .addCase(actionGetAuthorityHistoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(actionExportCSV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionExportCSV.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(actionExportCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFilters, updatePagination, clearError, resetFilters } =
  authorityHistorySlice.actions;

export const selectAuthorityHistoryState = (state: RootState) =>
  state.authorityHistory;
export const selectAuthorityHistoryItems = (state: RootState) =>
  state.authorityHistory.items;
export const selectAuthorityHistoryLoading = (state: RootState) =>
  state.authorityHistory.loading;
export const selectAuthorityHistoryError = (state: RootState) =>
  state.authorityHistory.error;
export const selectAuthorityHistoryFilters = (state: RootState) =>
  state.authorityHistory.filters;
export const selectAuthorityHistoryPagination = (state: RootState) =>
  state.authorityHistory.pagination;

export const selectAuthorityHistoryFullState = (state: RootState) => ({
  items: state.authorityHistory.items,
  loading: state.authorityHistory.loading,
  error: state.authorityHistory.error,
  filters: state.authorityHistory.filters,
  pagination: state.authorityHistory.pagination,
});

export default authorityHistorySlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import {
  MOCK_AlertDetail,
  MOCK_AlertDetail_AltItems,
} from "@/constants/mockAlert";

type IAlertDetailState = {
  selectedId: number | string | null;
  isOpen: boolean;
  detail: any | null;
  loading: boolean;
  error: string | null;
};

const initialAlertDetailState: IAlertDetailState = {
  selectedId: null,
  isOpen: false,
  detail: null,
  loading: false,
  error: null,
};

export const actionGetAlertDetail = createAsyncThunk(
  "alertDetail/actionGetAlertDetail",
  async (id: number | string, { rejectWithValue }) => {
    try {
      // return await request({
      //   url: `/analysis/requests/${id}`,
      //   method: "GET",
      // });

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id === 9999) {
        throw new Error("Alert not found");
      }

      const allMockData = [MOCK_AlertDetail, ...MOCK_AlertDetail_AltItems];
      const foundItem = allMockData.find((item) => item.id == id);

      if (!foundItem) {
        throw new Error("Alert not found");
      }

      return foundItem;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch alert detail"
      );
    }
  }
);

export const alertDetailSlice = createSlice({
  name: "alertDetail",
  initialState: initialAlertDetailState,
  reducers: {
    openModal: (state, action) => {
      state.selectedId = action.payload;
      state.isOpen = true;
      state.error = null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.selectedId = null;
      state.detail = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateDetailProcessStatus: (state, action) => {
      if (state.detail && state.detail.id == action.payload.id) {
        state.detail.process_status = action.payload.processStatus;
      }
    },
    updateDetailException: (state, action) => {
      if (state.detail && state.detail.id == action.payload.id) {
        state.detail.exception = action.payload.exception;
        if (action.payload.exception === "blacklist") {
          state.detail.blacklist_flag = true;
          state.detail.whitelist_flag = false;
        } else if (action.payload.exception === "whitelist") {
          state.detail.blacklist_flag = false;
          state.detail.whitelist_flag = true;
        } else {
          state.detail.blacklist_flag = false;
          state.detail.whitelist_flag = false;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionGetAlertDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetAlertDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
        state.error = null;
      })
      .addCase(actionGetAlertDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (action.payload === "Alert not found") {
          state.isOpen = false;
          state.selectedId = null;
        }
      });
  },
});

export const {
  openModal,
  closeModal,
  clearError,
  updateDetailProcessStatus,
  updateDetailException,
} = alertDetailSlice.actions;

export const selectAlertDetailSelectedId = (state: RootState) =>
  state.alertDetail.selectedId;
export const selectAlertDetailIsOpen = (state: RootState) =>
  state.alertDetail.isOpen;
export const selectAlertDetail = (state: RootState) => state.alertDetail.detail;
export const selectAlertDetailLoading = (state: RootState) =>
  state.alertDetail.loading;
export const selectAlertDetailError = (state: RootState) =>
  state.alertDetail.error;

export const selectAlertDetailState = (state: RootState) => ({
  selectedId: state.alertDetail.selectedId,
  isOpen: state.alertDetail.isOpen,
  detail: state.alertDetail.detail,
  loading: state.alertDetail.loading,
  error: state.alertDetail.error,
});

export default alertDetailSlice.reducer;

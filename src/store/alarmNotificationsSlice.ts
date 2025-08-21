import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./index";

interface NotificationData {
  id: string;
  name: string;
  department: string;
  phone: string;
  email: string;
  role: string;
}

interface AlarmNotificationsState {
  loading: boolean;
  data: NotificationData[];
  total: number;
  error: string | null;
}

const initialState: AlarmNotificationsState = {
  loading: false,
  data: [],
  total: 0,
  error: null,
};

export const actionGetNotificationsList = createAsyncThunk(
  "alarmNotifications/getList",
  async () => {
    // Mock data
    const mockData = [
      {
        id: "1",
        name: "홍길동",
        department: "정보화팀",
        phone: "010-1234-1234",
        email: "honggd@gmail.com",
        role: "사용자",
      },
    ];

    return {
      data: mockData,
      total: mockData.length,
    };
  }
);

const alarmNotificationsSlice = createSlice({
  name: "alarmNotifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionGetNotificationsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetNotificationsList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(actionGetNotificationsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      });
  },
});

export const selectAlarmNotificationsLoading = (state: RootState) =>
  state.alarmNotifications.loading;
export const selectAlarmNotificationsData = (state: RootState) =>
  state.alarmNotifications.data;
export const selectAlarmNotificationsTotal = (state: RootState) =>
  state.alarmNotifications.total;

export default alarmNotificationsSlice.reducer;

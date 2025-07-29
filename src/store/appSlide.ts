import { ENotificationType, EModalMode, EUserRole } from "@/interfaces/app";
import { RootState } from "@/store";

import { createSlice } from "@reduxjs/toolkit";

type IInitialState = {
  isLoading: boolean;
  isNavCollapsed: boolean;
  notification: {
    isOpen: boolean;
    message: string;
    type: ENotificationType;
    mode: EModalMode;
    okText?: string;
    cancelText?: string;
    onOk?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
  };
  changePassword: {
    isOpen: boolean;
    role: EUserRole;
    username: string;
    accessToken: string;
  };
};

const initialState: IInitialState = {
  isLoading: false,
  isNavCollapsed: false,
  notification: {
    isOpen: false,
    message: "",
    type: ENotificationType.SUCCESS,
    mode: EModalMode.MULTIPLE,
    okText: "Done",
    cancelText: "Cancel",
    onOk: () => {},
    onCancel: () => {},
    onClose: () => {},
  },
  changePassword: {
    isOpen: false,
    role: EUserRole.MASTER,
    username: "",
    accessToken: "",
  },
};

export const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    actionUpdatePageLoading(state, action) {
      state.isLoading = action.payload;
    },
    actionUpdateNavCollapsed(state, action) {
      state.isNavCollapsed = action.payload;
    },
    actionUpdateNotification(state, action) {
      const { isOpen } = action.payload;
      state.notification = isOpen ? action.payload : initialState.notification;
    },
    actionToggleChangePasswordModal(state, action) {
      state.changePassword = action.payload;
    },
  },
});

export const {
  actionUpdatePageLoading,
  actionUpdateNavCollapsed,
  actionUpdateNotification,
  actionToggleChangePasswordModal,
} = slice.actions;

export const selectActionLoading = (state: RootState) => state.app.isLoading;
export const selectActionIsNavCollapsed = (state: RootState) =>
  state.app.isNavCollapsed;
export const selectActionNotification = (state: RootState) =>
  state.app.notification;
export const selectChangePasswordModal = (state: RootState) =>
  state.app.changePassword;

export default slice.reducer;

import { API_URL_TYPE } from "@/constants/apiUrl";
import { DynamicKeyObject, EUserRole } from "@/interfaces/app";
import { getApiUrl } from "@/utils/app";
import { RootState } from "@/store";
import request from "@/utils/request";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { get } from "lodash";

interface IInfoLogin {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  passwordTime: number;
  configuration: string;
  role: EUserRole;
  email: string;
  expiresTime: number;
}

type IInitialState = {
  infoLogin: IInfoLogin;
  isLogin: boolean;
  emailResend: {
    isCountDown: boolean;
    remaining: number;
  };
};

const initialState: IInitialState = {
  infoLogin: {
    accessToken: "",
    refreshToken: "",
    expiresIn: 0,
    passwordTime: 0,
    configuration: "",
    role: EUserRole.MASTER,
    email: "",
    expiresTime: 0,
  },
  isLogin: false,
  emailResend: {
    isCountDown: false,
    remaining: 0,
  },
};

export const actionLogin = createAsyncThunk(
  "auth/actionLogin",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    const { userRole, ...payload } = data;
    try {
      return await request({
        url: `/auth/signin/${userRole}`,
        method: "POST",
        data: payload,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const actionLogout = createAsyncThunk(
  "auth/actionLogout",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    const { userRole, accessToken } = data;
    try {
      return await request({
        url: `/api/${userRole}/signout`,
        method: "POST",
        data: { accessToken },
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const actionRefreshToken = createAsyncThunk(
  "auth/actionRefreshToken",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.REFRESH_TOKEN),
        method: "POST",
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    actionUpdateRemainingEmailResend: (state, action) => {
      state.emailResend = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionLogin.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data", initialState.infoLogin);
        const decodedToken: DynamicKeyObject = jwtDecode(data.accessToken);
        state.infoLogin = {
          ...data,
          role: decodedToken["cognito:groups"]?.[1]?.split(":").pop(),
          email: decodedToken.username,
          expiresTime: decodedToken.exp,
        };
        state.isLogin = true;
      })
      .addCase(actionLogin.rejected, (state) => {
        state.infoLogin = initialState.infoLogin;
        state.isLogin = false;
      })
      .addCase(actionRefreshToken.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data", initialState.infoLogin);
        const decodedToken: DynamicKeyObject = jwtDecode(data.accessToken);
        state.infoLogin = {
          ...state.infoLogin,
          accessToken: data.accessToken,
          expiresTime: decodedToken.exp,
        };
      })
      .addCase(actionRefreshToken.rejected, (state) => {
        state.infoLogin = initialState.infoLogin;
        state.isLogin = false;
      })
      .addCase(actionLogout.pending, (state) => {
        state.isLogin = false;
      });
  },
});

export const { actionUpdateRemainingEmailResend } = slice.actions;
export const selectAccessToken = (state: RootState) =>
  state.auth.infoLogin.accessToken;
export const selectInfoLogin = (state: RootState) => state.auth.infoLogin;
export const selectIsLogin = (state: RootState) => state.auth.isLogin;
export const selectEmailResend = (state: RootState) => state.auth.emailResend;

export default slice.reducer;

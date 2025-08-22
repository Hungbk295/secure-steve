import { DynamicKeyObject, EUserRole } from "@/interfaces/app";
import { RootState } from "@/store";
import request from "@/utils/request";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { get } from "lodash";
import { authenticateUser, MockUser } from "@/data/mockUsers";
import { UserRole } from "@/constants/roleConfig";

interface IInfoLogin {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  passwordTime: number;
  configuration: string;
  role: EUserRole;
  email: string;
  expiresTime: number;
  // New user fields
  id?: number;
  name?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  username?: string; // Add username field
  userRole?: UserRole; // New role field using our UserRole enum
}

type IInitialState = {
  infoLogin: IInfoLogin;
  isLogin: boolean;
  emailResend: {
    isCountDown: boolean;
    remaining: number;
  };
  currentUser?: MockUser; // Add current user data
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
    const { username, password} = data;
    
    try {
      // Use mock authentication for development
      const mockUser = authenticateUser(username, password);
      
      if (mockUser) {
        // Simulate successful login response
        const mockToken = btoa(JSON.stringify({
          username: mockUser.username,
          role: mockUser.role,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
          "cognito:groups": [`system:${mockUser.role}`]
        }));
        
        return {
          data: {
            data: {
              accessToken: mockToken,
              refreshToken: "mock-refresh-token",
              expiresIn: 86400,
              passwordTime: Date.now(),
              configuration: "mock-config",
              ...mockUser
            }
          }
        };
      } else {
        throw new Error("Invalid credentials");
      }
      
      // Original API call (commented for mock usage)
      // return await request({
      //   url: `/auth/signin/${userRole}`,
      //   method: "POST",
      //   data: payload,
      // });
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

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    actionUpdateRemainingEmailResend: (state, action) => {
      state.emailResend = action.payload;
    },
    actionLogoutLocal: (state) => {
      state.infoLogin = initialState.infoLogin;
      state.isLogin = false;
      state.currentUser = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionLogin.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data", initialState.infoLogin);
        let decodedToken: DynamicKeyObject = {};
        
        try {
          decodedToken = JSON.parse(atob(data.accessToken));
        } catch {
          decodedToken = jwtDecode(data.accessToken);
        }
        
        state.infoLogin = {
          ...data,
          role: decodedToken["cognito:groups"]?.[0]?.split(":").pop() || data.role,
          email: decodedToken.username || data.email,
          expiresTime: decodedToken.exp,
          userRole: data.role as UserRole, // Store our UserRole enum
          username: data.email || data.username,
          id: data.id,
          name: data.name,
          department: data.department,
          phone: data.phone,
          avatar: data.avatar,
        };
        
        // Store current user data
        state.currentUser = {
          id: data.id || 0,
          username: data.email || data.username || "",
          password: "", // Don't store password
          role: data.role as UserRole,
          name: data.name || "",
          department: data.department || "",
          email: data.email || "",
          phone: data.phone,
          avatar: data.avatar,
        };
        
        state.isLogin = true;
      })
      .addCase(actionLogin.rejected, (state) => {
        state.infoLogin = initialState.infoLogin;
        state.isLogin = false;
        state.currentUser = undefined;
      })
      .addCase(actionLogout.pending, (state) => {
        state.isLogin = false;
        state.currentUser = undefined;
      })
      .addCase(actionLogout.rejected, (state) => {
        state.isLogin = false;
        state.currentUser = undefined;
      });
  },
});

export const { actionUpdateRemainingEmailResend, actionLogoutLocal } = slice.actions;

// Existing selectors
export const selectAccessToken = (state: RootState) =>
  state.auth.infoLogin.accessToken;
export const selectInfoLogin = (state: RootState) => state.auth.infoLogin;
export const selectIsLogin = (state: RootState) => state.auth.isLogin;
export const selectEmailResend = (state: RootState) => state.auth.emailResend;

// New role-based selectors
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectUserRole = (state: RootState) => state.auth.currentUser?.role || UserRole.USER;
export const selectUserName = (state: RootState) => state.auth.currentUser?.name || "";
export const selectUserDepartment = (state: RootState) => state.auth.currentUser?.department || "";

export default slice.reducer;

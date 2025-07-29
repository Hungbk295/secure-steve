import { DynamicKeyObject } from "@/interfaces/app";
import { RootState } from "@/store";
import request from "@/utils/request";
import { API_URL_TYPE } from "@/constants/apiUrl";
import { getApiUrl } from "@/utils/app";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { get } from "lodash";

type IInitialState = {
  loading: boolean;
  customerAccounts: DynamicKeyObject[];
  customerAccountDetails: any;
  timeZones: DynamicKeyObject[];
  iataNumberDuplicate: boolean;
};

const initialState: IInitialState = {
  loading: false,
  customerAccounts: [],
  customerAccountDetails: {},
  timeZones: [],
  iataNumberDuplicate: false,
};

export const actionGetCustomerAccounts = createAsyncThunk(
  "customer/actionGetCustomerAccounts",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.CUSTOMER_ACCOUNT_SEARCH),
        method: "POST",
        data,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const actionGetCustomerAccountDetail = createAsyncThunk(
  "customer/actionGetCustomerAccountDetail",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.CUSTOMER_ACCOUNT_SEARCH_DETAIL),
        method: "POST",
        data,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const actionSaveCustomerAccountDetails = createAsyncThunk(
  "customer/actionSaveCustomerAccountDetails",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.CUSTOMER_ACCOUNT_UPDATE),
        method: "POST",
        data,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const actionGetTimeZones = createAsyncThunk(
  "customer/actionGetTimeZones",
  async (nationTwoCode: string, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.CUSTOMER_ACCOUNT_TIMEZONE),
        method: "POST",
        data: { nationTwoCode },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const actionCheckIataNumberDuplicate = createAsyncThunk(
  "customer/actionCheckIataNumberDuplicate",
  async (iataNumber: string, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.CUSTOMER_ACCOUNT_DUP_IATA),
        method: "POST",
        data: { iataNumber },
      });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const slice = createSlice({
  name: "customerAccountSlice",
  initialState,
  reducers: {
  },
  extraReducers: (builder) =>
    builder
      .addCase(actionGetCustomerAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetCustomerAccounts.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data.DataList", []);
        state.customerAccounts = data;
        state.loading = false;
      })
      .addCase(actionGetCustomerAccounts.rejected, (state) => {
        state.customerAccounts = [];
        state.loading = false;
      })
      .addCase(actionGetCustomerAccountDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetCustomerAccountDetail.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data", []);
        state.customerAccountDetails = data[0];
        state.loading = false;
      })
      .addCase(actionGetCustomerAccountDetail.rejected, (state) => {
        state.customerAccountDetails = [];
        state.loading = false;
      })

      // Save Customer Account Details
      .addCase(actionSaveCustomerAccountDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionSaveCustomerAccountDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(actionSaveCustomerAccountDetails.rejected, (state) => {
        state.loading = false;
      })

      // Get Time Zones
      .addCase(actionGetTimeZones.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetTimeZones.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data.DataList", []);
        state.timeZones = data;
        state.loading = false;
      })
      .addCase(actionGetTimeZones.rejected, (state) => {
        state.timeZones = [];
        state.loading = false;
      })

      // Check IATA Number Duplicate
      .addCase(actionCheckIataNumberDuplicate.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionCheckIataNumberDuplicate.fulfilled, (state, action) => {
        const dupflag = get(action, "payload.data.data.dupflag", false);
        state.iataNumberDuplicate = dupflag;
        state.loading = false;
      })
      .addCase(actionCheckIataNumberDuplicate.rejected, (state) => {
        state.iataNumberDuplicate = false;
        state.loading = false;
      }),
});


export const selectCustomerAccounts = (state: RootState) =>
  state.customerAccountSlice.customerAccounts;

export const selectTimeZones = (state: RootState) =>
  state.customerAccountSlice.timeZones;

export const selectIataNumberDuplicate = (state: RootState) =>
  state.customerAccountSlice.iataNumberDuplicate;

export const selectLoading = (state: RootState) =>
  state.customerAccountSlice.loading;

export const selectCustomerAccountDetails = (state: RootState) =>
  state.customerAccountSlice.customerAccountDetails;

export default slice.reducer;

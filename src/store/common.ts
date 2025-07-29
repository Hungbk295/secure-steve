import { DynamicKeyObject } from "@/interfaces/app";
import { RootState } from "@/store";
import request from "@/utils/request";
import { API_URL_TYPE } from "@/constants/apiUrl";
import { convertDataToAntdOptions, getApiUrl } from "@/utils/app";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

type IInitialState = {
  timezoneList: DynamicKeyObject[];
  providerGrpList: DynamicKeyObject[];
  airlineList: DynamicKeyObject[];
};

const initialState: IInitialState = {
  timezoneList: [],
  providerGrpList: [],
  airlineList: [],
};

export const actionGetTimezoneList = createAsyncThunk(
  "common/actionGetTimezoneList",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.COMMON.TIMEZONE),
        method: "POST",
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const actionGetProviderGrpList = createAsyncThunk(
  "common/actionGetProviderGrpList",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.COMMON.PROVIDER_GRP),
        method: "POST",
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const actionGetAirlineList = createAsyncThunk(
  "common/actionGetAirlineList",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.COMMON.AIRLINE),
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
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(actionGetTimezoneList.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data.timezoneList", []);
        state.timezoneList = convertDataToAntdOptions(data, {
          labelText: "timezoneName",
          valueText: "timezoneIdx",
        });
      })
      .addCase(actionGetTimezoneList.rejected, (state) => {
        state.timezoneList = [];
      })
      .addCase(actionGetProviderGrpList.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data.providerList", []);
        state.providerGrpList = convertDataToAntdOptions(data, {
          labelText: "providerGroupName",
          valueText: "providerGroupIdx",
        });
      })
      .addCase(actionGetProviderGrpList.rejected, (state) => {
        state.providerGrpList = [];
      })
      .addCase(actionGetAirlineList.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data.airlineList", []);
        state.airlineList = convertDataToAntdOptions(data, {
          labelText: "airlineName",
          valueText: "airlineId",
        });
      })
      .addCase(actionGetAirlineList.rejected, (state) => {
        state.airlineList = [];
      }),
});

// export const {} = slice.actions;

export const selectTimezoneList = (state: RootState) =>
  state.common.timezoneList;
export const selectProviderGrpList = (state: RootState) =>
  state.common.providerGrpList;
export const selectAirlineList = (state: RootState) => state.common.airlineList;

export default slice.reducer;

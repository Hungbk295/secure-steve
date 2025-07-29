import { get } from "lodash";
import { DynamicKeyObject } from "@/interfaces/app";
import { RootState } from "@/store";
import request from "@/utils/request";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL_TYPE } from "@/constants/apiUrl";
import { getApiUrl } from "@/utils/app";

type IInitialState = {
  personalInfo: DynamicKeyObject;
};

const initialState: IInitialState = {
  personalInfo: {},
};

export const actionGetPersonalInfo = createAsyncThunk(
  "personal/actionGetPersonalInfo",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: getApiUrl(API_URL_TYPE.PERSONAL_INFO),
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
  name: "personal",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(actionGetPersonalInfo.fulfilled, (state, action) => {
        const data = get(action, "payload.data.data", {});
        state.personalInfo = data;
      })
      .addCase(actionGetPersonalInfo.rejected, (state) => {
        state.personalInfo = {};
      }),
});

export const selectPersonalInfo = (state: RootState) =>
  state.personal.personalInfo;

export default slice.reducer;

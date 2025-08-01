import authSlide from "@/store/authSlide";
import appSlice from "@/store/appSlide";
import customerAccountSlice from "@/store/customerAccountSlice";
import personalSlice from "@/store/personalSlice";
import commonSlice from "@/store/common";
import alertsSlice from "@/store/alertsSlice";
import analyzeDetectionSlice from "@/store/analyzeDetectionSlice";

import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["infoLogin", "isLogin", "emailResend"],
  version: 1,
};

const reducers = {
  auth: persistReducer(authPersistConfig, authSlide),
  app: appSlice,
  customerAccountSlice,
  personal: personalSlice,
  common: commonSlice,
  alerts: alertsSlice,
  analyzeDetection: analyzeDetectionSlice,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

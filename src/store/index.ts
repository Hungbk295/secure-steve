import authSlide from "@/store/authSlide";
import appSlice from "@/store/appSlide";
// import personalSlice from "@/store/personalSlice";
import alertsSlice from "@/store/alertsSlice";
import detectionSlice from "@/store/detectionSlice";
import alertDetailSlice from "@/store/alertDetailSlice";
import actionSlice from "@/store/actionSlice";
import completeSlice from "@/store/completeSlice";
import settingPolicySlice from "@/store/settingPolicySlice";
import settingServerPolicySlice from "@/store/settingServerPolicySlice";
import blacklistSlice from "@/store/blacklistSlice";
import adminPolicySlice from "@/store/adminPolicySlice";
import authorityHistorySlice from "@/store/authorityHistorySlice";
import alarmScheduleSlice from "@/store/alarmScheduleSlice";
import dashboardSlice from "@/store/dashboardSlice";
import alarmNotificationsSlice from "@/store/alarmNotificationsSlice";
import reportListSlice from "@/store/reportListSlice";
import reportRegularSlice from "@/store/reportRegularSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["infoLogin", "isLogin", "emailResend", "currentUser"],
  version: 1,
};

const reducers = {
  auth: persistReducer(authPersistConfig, authSlide),
  app: appSlice,
  // personal: personalSlice,
  alerts: alertsSlice,
  detectionList: detectionSlice,
  alertDetail: alertDetailSlice,
  action: actionSlice,
  complete: completeSlice,
  settingPolicy: settingPolicySlice,
  settingServerPolicy: settingServerPolicySlice,
  blacklist: blacklistSlice,
  adminPolicy: adminPolicySlice,
  authorityHistory: authorityHistorySlice,
  alarmSchedule: alarmScheduleSlice,
  dashboard: dashboardSlice,
  alarmNotifications: alarmNotificationsSlice,
  reportList: reportListSlice,
  reportRegular: reportRegularSlice,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

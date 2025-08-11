import authSlide from "@/store/authSlide";
import appSlice from "@/store/appSlide";
// import personalSlice from "@/store/personalSlice";
import alertsSlice from "@/store/alertsSlice";

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
  // personal: personalSlice,
  alerts: alertsSlice,
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

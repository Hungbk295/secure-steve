import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  actionAutoLogin,
  selectIsLogin,
  selectCurrentUser,
  selectAccessToken,
  isTokenValid,
  actionLogoutLocal,
} from "@/store/authSlide";
import Routers from "@/layouts/Routers";
import Loading from "@/app/components/common/Loading";
import CustomNotification from "@/app/components/common/CustomNotification";
import ChangePasswordModal from "./app/pages/Login/ChangePasswordModal";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLogin = useAppSelector(selectIsLogin);
  const currentUser = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectAccessToken);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const hasLoggedOut = localStorage.getItem("hasLoggedOut") === "true";

      if (
        accessToken &&
        isTokenValid(accessToken) &&
        currentUser &&
        !hasLoggedOut
      ) {
        console.log("Valid token found, maintaining login state");
        setIsInitializing(false);
        return;
      }

      if (accessToken && !isTokenValid(accessToken)) {
        console.log("Token expired, clearing auth state");
        dispatch(actionLogoutLocal());
      }

      if ((!isLogin || !currentUser) && !hasLoggedOut) {
        try {
          console.log("Auto-logging in as admin@company.com");
          await dispatch(actionAutoLogin()).unwrap();
          localStorage.removeItem("hasLoggedOut");
        } catch (error) {
          console.log("error", error);
        }
      }

      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch, isLogin, currentUser, accessToken]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Loading />
      <CustomNotification />
      <ChangePasswordModal />
      <Routers />
    </>
  );
};

export default App;

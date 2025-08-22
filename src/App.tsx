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
    // Initialize auth state
    const initializeAuth = async () => {
      // Check if user manually logged out (flag in localStorage)
      const hasLoggedOut = localStorage.getItem("hasLoggedOut") === "true";

      // Check if we have a valid token from persistence
      if (
        accessToken &&
        isTokenValid(accessToken) &&
        currentUser &&
        !hasLoggedOut
      ) {
        // Token is valid and user data exists, keep logged in
        console.log("Valid token found, maintaining login state");
        setIsInitializing(false);
        return;
      }

      // If token is invalid or no user data, clear state
      if (accessToken && !isTokenValid(accessToken)) {
        console.log("Token expired, clearing auth state");
        dispatch(actionLogoutLocal());
      }

      // Auto-login as admin if no valid session AND user hasn't manually logged out
      if ((!isLogin || !currentUser) && !hasLoggedOut) {
        try {
          console.log("Auto-logging in as admin@company.com");
          await dispatch(actionAutoLogin()).unwrap();
          // Clear the logout flag after successful auto-login
          localStorage.removeItem("hasLoggedOut");
        } catch (error) {
          console.log("error", error);
        }
      }

      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch, isLogin, currentUser, accessToken]);

  // Show loading while initializing auth
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

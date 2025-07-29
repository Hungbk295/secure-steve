import { useAppSelector } from "@/store";
import { selectIsLogin } from "@/store/authSlide";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import URL from "@/constants/url";
import AlbusLogoLogin from "@/assets/svgs/albus-logo-login.svg";
import ForgotPasswordForm from "@/app/pages/Login/ForgotPasswordForm";
import SignInForm from "@/app/pages/Login/SignInForm";
import AlbusCover from "./AlbusCover";
import "@/styles/login.css";

function Login() {
  const isLogin = useAppSelector(selectIsLogin);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return !isLogin ? (
    <div className="flex items-center h-screen">
      <AlbusCover />
      <div className="flex-1">
        <div className="w-[400px] mx-auto flex flex-col gap-8 items-center">
          <AlbusLogoLogin />
          {isForgotPassword ? (
            <ForgotPasswordForm onSignIn={() => setIsForgotPassword(false)} />
          ) : (
            <SignInForm onForgotPassword={() => setIsForgotPassword(true)} />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to={URL.Home} replace />
  );
}

export default Login;

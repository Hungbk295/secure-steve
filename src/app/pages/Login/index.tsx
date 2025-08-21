import { useAppSelector } from "@/store";
import { selectIsLogin } from "@/store/authSlide";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import ForgotPasswordForm from "@/app/pages/Login/ForgotPasswordForm";
import SignInForm from "@/app/pages/Login/SignInForm";
import "@/styles/login.css";
import ROUTES from "@/constants/routes";

function Login() {
  const isLogin = useAppSelector(selectIsLogin);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return !isLogin ? (
    <div className="flex items-center h-screen">
      <div className="flex-1">
        <div className="w-[400px] mx-auto flex flex-col gap-8 items-center">
          {isForgotPassword ? (
            <ForgotPasswordForm onSignIn={() => setIsForgotPassword(false)} />
          ) : (
            <SignInForm
              onForgotPassword={() => setIsForgotPassword(true)}
              isForgot={isForgotPassword}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to={ROUTES.Home.Index} replace />
  );
}

export default Login;

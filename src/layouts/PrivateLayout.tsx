import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import URL from "@/constants/url";
import { useAppSelector } from "@/store";
import { selectAccessToken, selectIsLogin } from "@/store/authSlide";
import { instanceAxios } from "@/utils/request";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  // TODO: apply later
  const isLogin = useAppSelector(selectIsLogin);
  const token = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (token) {
      instanceAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  const isDevelopment = true;

  if (isLogin || isDevelopment) {
    return children;
  }

  return <Navigate to={URL.SignIn} replace />;
}

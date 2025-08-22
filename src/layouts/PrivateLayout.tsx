import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store";
import { selectAccessToken, selectIsLogin, selectUserRole } from "@/store/authSlide";
import { instanceAxios } from "@/utils/request";
import ROUTES from "@/constants/routes";
import { canAccessRoute } from "@/constants/roleConfig";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const isLogin = useAppSelector(selectIsLogin);
  const token = useAppSelector(selectAccessToken);
  const userRole = useAppSelector(selectUserRole);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      instanceAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  const isDevelopment = true;

  // Check if user is logged in
  if (!isLogin && !isDevelopment) {
    return <Navigate to={ROUTES.SignIn} replace />;
  }

  // Check if user has access to current route
  const currentPath = location.pathname;
  const hasAccess = canAccessRoute(userRole, currentPath);

  // Debug logging
  console.log('PrivateLayout Debug:', {
    currentPath,
    userRole,
    hasAccess,
    isLogin,
    isDevelopment
  });

  if ((isLogin || isDevelopment) && !hasAccess) {
    console.log(`Access denied for ${userRole} to ${currentPath}`);
    return <Navigate to={ROUTES.Forbidden} replace />;
  }

  if (isLogin || isDevelopment) {
    return <>{children}</>;
  }

  return <Navigate to={ROUTES.SignIn} replace />;
}

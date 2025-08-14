import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ROUTES from "@/constants/routes";

const SCREEN_TITLES: Record<string, string> = {
  [ROUTES.Home.Dashboard]: "Security Dashboard",

  [ROUTES.Analysis.Detection]: "Malware Detection",
  [ROUTES.Analysis.Action]: "Security Actions",
  [ROUTES.Analysis.Requests]: "Analysis Requests",
  [ROUTES.Analysis.RequestDetail]: "Analysis Request Detail",
  [ROUTES.Analysis.Pending]: "Pending Actions",
  [ROUTES.Analysis.Completed]: "Completed Actions",

  [ROUTES.Policy.SystemSettings]: "System Settings",
  [ROUTES.Policy.AdminPolicy]: "Administrator Policy",
  [ROUTES.Policy.UserPolicy]: "User Policy Settings",
  [ROUTES.Policy.BlacklistWhitelist]: "Blacklist & Whitelist",

  [ROUTES.History.BlacklistWhitelist]: "Blacklist History",
  [ROUTES.History.Inspection]: "Inspection History",
  // [ROUTES.History.Action]: "Action History",
  [ROUTES.History.PolicyChanges]: "Policy Change History",
  [ROUTES.History.AiLearning]: "AI Learning History",
  [ROUTES.History.Authority]: "Authority History",

  [ROUTES.Alarm.Notifications]: "Alarm Notifications",
  [ROUTES.Alarm.Schedule]: "Alarm Schedule",

  [ROUTES.Report.List]: "Security Reports",
  [ROUTES.Report.Regular]: "Regular Reports",

  [ROUTES.User.ChangeInfo]: "User Information",
  [ROUTES.User.Permissions]: "User Permissions",

  [ROUTES.SignIn]: "Sign In",
  [ROUTES.Forbidden]: "Access Forbidden",
};

export function useScreenTitle(): string {
  const location = useLocation();
  const [screenTitle, setScreenTitle] = useState<string>("Security Dashboard");

  useEffect(() => {
    const currentPath = location.pathname;

    if (SCREEN_TITLES[currentPath]) {
      setScreenTitle(SCREEN_TITLES[currentPath]);
      return;
    }

    const matchedRoute = Object.keys(SCREEN_TITLES).find((route) => {
      if (route.includes(":id")) {
        const routePattern = route.replace(":id", "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(currentPath);
      }
      return false;
    });

    if (matchedRoute) {
      setScreenTitle(SCREEN_TITLES[matchedRoute]);
      return;
    }

    setScreenTitle("Security Dashboard");
  }, [location.pathname]);

  return screenTitle;
}

export function useSetScreenTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} - Security Dashboard`;
  }, [title]);
}

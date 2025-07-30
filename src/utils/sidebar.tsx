import { ReactNode } from "react";
import ROUTES from "@/constants/routes";

export interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon?: ReactNode;
  children?: MenuItem[];
  permission?: string[];
}

export const getMenuItems = (): MenuItem[] => [
  {
    id: "home",
    label: "Home",
    route: ROUTES.Home,
    icon: <i className="ri-home-5-line text-lg" />,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    route: ROUTES.Dashboard,
    icon: <i className="ri-dashboard-line text-lg" />,
  },
  {
    id: "analyze",
    label: "Analyze",
    route: "/analyze",
    icon: <i className="ri-search-line text-lg" />,
    children: [
      {
        id: "detection",
        label: "Detection",
        route: ROUTES.Analyze.Detection,
      },
      {
        id: "action",
        label: "Action",
        route: ROUTES.Analyze.Action,
      },
    ],
  },
  {
    id: "policy",
    label: "Policy",
    route: "/policy",
    icon: <i className="ri-settings-3-line text-lg" />,
    children: [
      {
        id: "system-settings",
        label: "System Settings",
        route: ROUTES.Policy.SystemSettings,
      },
      {
        id: "admin-policy",
        label: "Administrator Policy Settings",
        route: ROUTES.Policy.AdminPolicy,
      },
      {
        id: "user-policy",
        label: "User Policy Settings",
        route: ROUTES.Policy.UserPolicy,
      },
      {
        id: "blacklist-whitelist",
        label: "Black / Whitelist",
        route: ROUTES.Policy.BlacklistWhitelist,
      },
    ],
  },
  {
    id: "history",
    label: "History",
    route: "/history",
    icon: <i className="ri-history-line text-lg" />,
    children: [
      {
        id: "history-blacklist",
        label: "Black / Whitelist",
        route: ROUTES.History.BlacklistWhitelist,
      },
      {
        id: "inspection-history",
        label: "Inspection history",
        route: ROUTES.History.Inspection,
      },
      {
        id: "action-history",
        label: "Action history",
        route: ROUTES.History.Action,
      },
      {
        id: "policy-changes",
        label: "History of policy changes",
        route: ROUTES.History.PolicyChanges,
      },
      {
        id: "ai-learning",
        label: "AI learning history",
        route: ROUTES.History.AiLearning,
      },
      {
        id: "authority-history",
        label: "Authority history",
        route: ROUTES.History.Authority,
      },
    ],
  },
  {
    id: "alarm",
    label: "Alarm",
    route: "/alarm",
    icon: <i className="ri-alarm-warning-line text-lg" />,
    children: [
      {
        id: "notifications",
        label: "Notification List",
        route: ROUTES.Alarm.Notifications,
      },
      {
        id: "schedule",
        label: "Schedule",
        route: ROUTES.Alarm.Schedule,
      },
    ],
  },
  {
    id: "report",
    label: "Report",
    route: "/report",
    icon: <i className="ri-file-text-line text-lg" />,
    children: [
      {
        id: "report-list",
        label: "List of reports",
        route: ROUTES.Report.List,
      },
      {
        id: "regular-report",
        label: "Regular Report",
        route: ROUTES.Report.Regular,
      },
    ],
  },
  {
    id: "user",
    label: "User",
    route: "/user",
    icon: <i className="ri-user-line text-lg" />,
    children: [
      {
        id: "change-info",
        label: "Change Information",
        route: ROUTES.User.ChangeInfo,
      },
      {
        id: "permissions",
        label: "Modify Permissions",
        route: ROUTES.User.Permissions,
      },
    ],
  },
];

export const findActiveMenuItem = (
  pathname: string,
  menuItems: MenuItem[] = getMenuItems()
): { parentId?: string; childId?: string } => {
  for (const item of menuItems) {
    if (item.route === pathname) {
      return { parentId: item.id };
    }

    if (item.children) {
      for (const child of item.children) {
        if (child.route === pathname) {
          return { parentId: item.id, childId: child.id };
        }
      }

      if (pathname.startsWith(item.route) && item.route !== "/") {
        return { parentId: item.id };
      }
    }
  }

  return {};
};

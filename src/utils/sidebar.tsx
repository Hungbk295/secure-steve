import { ReactNode } from "react";
import ROUTES from "@/constants/routes";
import { UserRole, CURRENT_USER_ROLE } from "@/constants/roleConfig";

export interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon?: ReactNode;
  children?: MenuItem[];
  permission?: string[];
  roles?: UserRole[]; // Add role-based access
}

export const getAllMenuItems = (): MenuItem[] => [
  {
    id: "home",
    label: "Home",
    route: ROUTES.Home.Dashboard,
    icon: <i className="ri-home-5-line text-lg" />,
    roles: [UserRole.USER, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "dashboard",
        label: "Dashboard",
        route: ROUTES.Home.Dashboard,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR],
      },
    ],
  },

  {
    id: "analyze",
    label: "Analyze",
    route: "/analyze",
    icon: <i className="ri-search-line text-lg" />,
    roles: [UserRole.USER, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "detection",
        label: "Detection",
        route: ROUTES.Analysis.Detection,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR],
      },
      {
        id: "action",
        label: "Action",
        route: ROUTES.Analysis.Action,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR],
      },
      {
        id: "requests",
        label: "Analysis Requests",
        route: ROUTES.Analysis.Requests,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR],
      },
    ],
  },
  {
    id: "policy",
    label: "Policy",
    route: "/policy",
    icon: <i className="ri-settings-3-line text-lg" />,
    roles: [UserRole.USER, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "system-settings",
        label: "System Settings",
        route: ROUTES.Policy.SystemSettings,
        roles: [UserRole.ADMINISTRATOR], // Admin only
      },
      {
        id: "admin-policy",
        label: "Administrator Policy Settings",
        route: ROUTES.Policy.AdminPolicy,
        roles: [UserRole.ADMINISTRATOR], // Admin only
      },
      {
        id: "user-policy",
        label: "User Policy Settings",
        route: ROUTES.Policy.UserPolicy,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR],
      },
      {
        id: "blacklist-whitelist",
        label: "Black / Whitelist",
        route: ROUTES.Policy.BlacklistWhitelist,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR],
      },
    ],
  },
  {
    id: "history",
    label: "History",
    route: "/history",
    icon: <i className="ri-history-line text-lg" />,
    roles: [UserRole.USER, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "inspection-history",
        label: "Inspection history",
        route: ROUTES.History.Inspection,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR], // Both can access, but see different data
      },
      {
        id: "action-history",
        label: "Action history",
        route: ROUTES.History.Action,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR], // Both can access, but see different data
      },
      {
        id: "policy-changes",
        label: "History of policy changes",
        route: ROUTES.History.PolicyChanges,
        roles: [UserRole.ADMINISTRATOR], // Admin only
      },
      {
        id: "ai-learning",
        label: "AI learning history",
        route: ROUTES.History.AiLearning,
        roles: [UserRole.ADMINISTRATOR], // Admin only
      },
      {
        id: "authority-history",
        label: "Authority history",
        route: ROUTES.History.Authority,
        roles: [UserRole.ADMINISTRATOR], // Admin only
      },
    ],
  },
  {
    id: "alarm",
    label: "Alarm",
    route: "/alarm",
    icon: <i className="ri-alarm-warning-line text-lg" />,
    roles: [UserRole.ADMINISTRATOR], // Admin only
    children: [
      {
        id: "notifications",
        label: "Notification List",
        route: ROUTES.Alarm.Notifications,
        roles: [UserRole.ADMINISTRATOR],
      },
      {
        id: "schedule",
        label: "Schedule",
        route: ROUTES.Alarm.Schedule,
        roles: [UserRole.ADMINISTRATOR],
      },
    ],
  },
  {
    id: "report",
    label: "Report",
    route: "/report",
    icon: <i className="ri-file-text-line text-lg" />,
    roles: [UserRole.USER, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "report-list",
        label: "List of reports",
        route: ROUTES.Report.List,
        roles: [UserRole.ADMINISTRATOR], // Admin sees all reports
      },
      {
        id: "regular-report",
        label: "Regular Report",
        route: ROUTES.Report.Regular,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR], // Both can access
      },
    ],
  },
  {
    id: "user",
    label: "User",
    route: "/user",
    icon: <i className="ri-user-line text-lg" />,
    roles: [UserRole.USER, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "change-info",
        label: "Change Information",
        route: ROUTES.User.ChangeInfo,
        roles: [UserRole.USER, UserRole.ADMINISTRATOR],
      },
      {
        id: "permissions",
        label: "Modify Permissions",
        route: ROUTES.User.Permissions,
        roles: [UserRole.ADMINISTRATOR], // Admin only
      },
    ],
  },
];

// Filter menu items based on user role
export function getMenuItems(role: UserRole = CURRENT_USER_ROLE): MenuItem[] {
  return getAllMenuItems().filter((item) => filterMenuByRole(item, role));
}

function filterMenuByRole(item: MenuItem, role: UserRole): boolean {
  // Check if user has access to this menu item
  if (item.roles && !item.roles.includes(role)) {
    return false;
  }

  // Filter children if they exist
  if (item.children) {
    item.children = item.children.filter((child) =>
      filterMenuByRole(child, role)
    );
    // If no children remain and this is a parent-only item, hide it
    if (item.children.length === 0 && item.route.endsWith("/*")) {
      return false;
    }
  }

  return true;
}

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

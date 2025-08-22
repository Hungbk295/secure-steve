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
    roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "dashboard",
        label: "Dashboard",
        route: ROUTES.Home.Dashboard,
        roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
      },
    ],
  },

  {
    id: "analyze",
    label: "Analyze",
    route: "/analyze",
    icon: <i className="ri-search-line text-lg" />,
    roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "detection",
        label: "Detection",
        route: ROUTES.Analysis.Detection,
        roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
      },
      {
        id: "action",
        label: "Action",
        route: ROUTES.Analysis.Action,
        roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
      },
    ],
  },
  {
    id: "policy",
    label: "Policy",
    route: "/policy",
    icon: <i className="ri-settings-3-line text-lg" />,
    roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
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
        id: "blacklist-whitelist",
        label: "Black / Whitelist",
        route: ROUTES.Policy.BlacklistWhitelist,
        roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
      },
    ],
  },
  {
    id: "history",
    label: "History",
    route: "/history",
    icon: <i className="ri-history-line text-lg" />,
    roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "inspection-history",
        label: "Inspection history",
        route: ROUTES.History.Inspection,
        roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
      },
      {
        id: "ai-learning",
        label: "AI learning history",
        route: ROUTES.History.AiLearning,
        roles: [UserRole.ADMINISTRATOR], // Operator and Admin
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
    roles: [UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR], // Operator and Admin
    children: [
      {
        id: "notifications",
        label: "Notification List",
        route: ROUTES.Alarm.Notifications,
        roles: [UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
      },
      {
        id: "schedule",
        label: "Schedule",
        route: ROUTES.Alarm.Schedule,
        roles: [UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
      },
    ],
  },
  {
    id: "report",
    label: "Report",
    route: "/report",
    icon: <i className="ri-file-text-line text-lg" />,
    roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "report-list",
        label: "List of reports",
        route: ROUTES.Report.List,
        roles: [UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR], // Operator and Admin see all reports
      },
      {
        id: "regular-report",
        label: "Regular Report",
        route: ROUTES.Report.Regular,
        roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR], // All can access
      },
    ],
  },
  {
    id: "user",
    label: "User",
    route: "/user",
    icon: <i className="ri-user-line text-lg" />,
    roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
    children: [
      {
        id: "change-info",
        label: "Change Information",
        route: ROUTES.User.ChangeInfo,
        roles: [UserRole.USER, UserRole.SECURITY_OPERATOR, UserRole.ADMINISTRATOR],
      },
    ],
  },
];

// Filter menu items based on user role
export function getMenuItems(role: UserRole = CURRENT_USER_ROLE): MenuItem[] {
  return getAllMenuItems()
    .map(item => filterMenuByRole(item, role))
    .filter(item => item !== null) as MenuItem[];
}

function filterMenuByRole(item: MenuItem, role: UserRole): MenuItem | null {
  // Check if user has access to this menu item
  if (item.roles && !item.roles.includes(role)) {
    return null;
  }

  // Create a copy to avoid mutation
  const filteredItem = { ...item };

  // Filter children if they exist
  if (item.children) {
    const filteredChildren = item.children
      .map(child => filterMenuByRole(child, role))
      .filter(child => child !== null) as MenuItem[];
    
    filteredItem.children = filteredChildren;
    
    // If no children remain and this is a parent-only item, hide it
    if (filteredChildren.length === 0 && item.route.endsWith("/*")) {
      return null;
    }
  }

  return filteredItem;
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

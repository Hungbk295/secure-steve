export enum UserRole {
  USER = "user",
  ADMINISTRATOR = "administrator",
}

export const USER_ROUTES = [
  "/",
  "/dashboard",

  "/analyze/detection",
  "/analyze/action",

  "/policy/user-policy",
  "/policy/blacklist-whitelist",

  "/history/inspection",
  "/history/action",

  "/report/personal",
  "/report/regular",

  "/user/change-info",

  "/sign-in",
  "/forbidden",
];

export const ADMIN_ROUTES = [
  ...USER_ROUTES,

  "/policy/system-settings",
  "/policy/admin-policy",

  "/history/policy-changes",
  "/history/ai-learning",
  "/history/authority",
  "/history/blacklist-whitelist",

  "/report/list",
  "/report/system",

  "/user/permissions",
  "/account/management",
  "/account/approval",

  "/system/settings",
  "/system/servers",
  "/system/agents",
];

export const USER_SIDEBAR_MENUS = [
  "home",
  "dashboard",
  "analyze",
  "policy",
  "history",
  "report",
  "user",
];

export const ADMIN_SIDEBAR_MENUS = [
  "home",
  "dashboard",
  "analyze",
  "policy",
  "history",
  "alarm",
  "report",
  "user",
  "account",
  "system",
];

export const TOPBAR_FEATURES = {
  [UserRole.USER]: {
    showVerificationCounter: false,
    showAlarmNotifications: true,
    showServerStatus: true,
    showUserMenu: true,
    alarmTypes: ["personal", "group"],
    maxAlarmCount: 50,
  },
  [UserRole.ADMINISTRATOR]: {
    showVerificationCounter: true,
    showAlarmNotifications: true,
    showServerStatus: true,
    showUserMenu: true,
    alarmTypes: ["personal", "group", "system"],
    maxAlarmCount: 999,
  },
};

export const COMPONENT_FILTERS = {
  dashboard: {
    [UserRole.USER]: {
      showPersonalMetrics: true,
      showGroupMetrics: true,
      showSystemMetrics: false,
      showVerificationQueue: false,
      showUserManagement: false,
      dataScope: "personal_and_group",
    },
    [UserRole.ADMINISTRATOR]: {
      showPersonalMetrics: true,
      showGroupMetrics: true,
      showSystemMetrics: true,
      showVerificationQueue: true,
      showUserManagement: true,
      dataScope: "system_wide",
    },
  },

  history: {
    [UserRole.USER]: {
      canViewPersonal: true,
      canViewGroup: true,
      canViewSystem: false,
      canDelete: false,
      canExport: true,
      dataScope: "personal_and_group",
    },
    [UserRole.ADMINISTRATOR]: {
      canViewPersonal: true,
      canViewGroup: true,
      canViewSystem: true,
      canDelete: true,
      canExport: true,
      dataScope: "system_wide",
    },
  },

  reports: {
    [UserRole.USER]: {
      canViewPersonal: true,
      canViewGroup: true,
      canViewSystem: false,
      canCreateReports: false,
      canDeleteReports: false,
      availableTemplates: ["personal", "group_summary"],
    },
    [UserRole.ADMINISTRATOR]: {
      canViewPersonal: true,
      canViewGroup: true,
      canViewSystem: true,
      canCreateReports: true,
      canDeleteReports: true,
      availableTemplates: [
        "personal",
        "group_summary",
        "system_audit",
        "compliance",
      ],
    },
  },

  userManagement: {
    [UserRole.USER]: {
      canEditOwnProfile: true,
      canEditOtherProfiles: false,
      canViewUserList: false,
      canManagePermissions: false,
      canApproveUsers: false,
    },
    [UserRole.ADMINISTRATOR]: {
      canEditOwnProfile: true,
      canEditOtherProfiles: true,
      canViewUserList: true,
      canManagePermissions: true,
      canApproveUsers: true,
    },
  },

  policy: {
    [UserRole.USER]: {
      canEditUserPolicy: true,
      canEditSystemPolicy: false,
      canEditAdminPolicy: false,
      canViewPolicyHistory: false,
      scope: "user_only",
    },
    [UserRole.ADMINISTRATOR]: {
      canEditUserPolicy: true,
      canEditSystemPolicy: true,
      canEditAdminPolicy: true,
      canViewPolicyHistory: true,
      scope: "system_wide",
    },
  },
};

export function canAccessRoute(role: UserRole, route: string): boolean {
  const allowedRoutes =
    role === UserRole.ADMINISTRATOR ? ADMIN_ROUTES : USER_ROUTES;
  return allowedRoutes.some((allowedRoute) => {
    return route === allowedRoute || route.startsWith(allowedRoute + "/");
  });
}

export function getSidebarMenus(role: UserRole): string[] {
  return role === UserRole.ADMINISTRATOR
    ? ADMIN_SIDEBAR_MENUS
    : USER_SIDEBAR_MENUS;
}

export function getTopBarFeatures(role: UserRole) {
  return TOPBAR_FEATURES[role];
}

export function getComponentFilter(
  component: keyof typeof COMPONENT_FILTERS,
  role: UserRole
) {
  return COMPONENT_FILTERS[component][role];
}

export const CURRENT_USER_ROLE = UserRole.ADMINISTRATOR;

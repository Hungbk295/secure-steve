export enum UserRole {
  USER = "user",
  SECURITY_OPERATOR = "security_operator",
  ADMINISTRATOR = "administrator",
}

export const USER_ROUTES = [
  "/",
  "/dashboard",

  "/analysis/detection",
  "/analysis/action",

  "/policy/user-policy",
  "/policy/blacklist-whitelist",

  "/history/inspection",
  "/history/action",

  "/report/regular",

  "/user/change-info",

  "/sign-in",
  "/sign-up",
  "/forbidden",
];

export const ADMIN_ROUTES = [
  ...USER_ROUTES,

  "/policy/system-settings",
  "/policy/admin-policy",

  "/history/policy-changes",
  "/history/ai-learning",
  "/history/authority",

  "/report/list",

  "/user/permissions",

  "/alarm/notifications",
  "/alarm/schedule",
];

export const OPERATOR_ROUTES = [
  "/",
  "/dashboard",

  "/analysis/requests",
  "/analysis/requests/:id",
  "/analysis/detection",
  "/analysis/action",
  "/analysis/action/pending",
  "/analysis/action/completed",

  "/policy/blacklist-whitelist",

  "/history/inspection",
  "/history/action",
  "/history/blacklist-whitelist",

  "/report/regular",
  "/report/list",

  "/alarm/notifications",
  "/alarm/schedule",

  "/user/change-info",

  "/sign-in",
  "/sign-up",
  "/forbidden",
];

export const OPERATOR_SIDEBAR_MENUS = [
  "home","dashboard","analyze","policy","history","alarm","report","user"
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
    canManageAlerts: false,
  },
  [UserRole.SECURITY_OPERATOR]: {
    showVerificationCounter: true,
    showAlarmNotifications: true,
    showServerStatus: true,
    showUserMenu: true,
    alarmTypes: ["personal", "group", "security"],
    maxAlarmCount: 200,
    canManageAlerts: true,
  },
  [UserRole.ADMINISTRATOR]: {
    showVerificationCounter: true,
    showAlarmNotifications: true,
    showServerStatus: true,
    showUserMenu: true,
    alarmTypes: ["personal", "group", "system"],
    maxAlarmCount: 999,
    canManageAlerts: true,
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
    [UserRole.SECURITY_OPERATOR]: {
      showPersonalMetrics: true,
      showGroupMetrics: true,
      showSystemMetrics: true,
      showVerificationQueue: true,
      showUserManagement: false,
      dataScope: "security_operations",
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
    [UserRole.SECURITY_OPERATOR]: {
      canViewPersonal: true,
      canViewGroup: true,
      canViewSystem: true,
      canDelete: false,
      canExport: true,
      dataScope: "security_operations",
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
    [UserRole.SECURITY_OPERATOR]: {
      canViewPersonal: true,
      canViewGroup: true,
      canViewSystem: true,
      canCreateReports: true,
      canDeleteReports: false,
      availableTemplates: ["personal", "group_summary", "security_audit"],
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
    [UserRole.SECURITY_OPERATOR]: {
      canEditOwnProfile: true,
      canEditOtherProfiles: false,
      canViewUserList: true,
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
    [UserRole.SECURITY_OPERATOR]: {
      canEditUserPolicy: true,
      canEditSystemPolicy: false,
      canEditAdminPolicy: false,
      canViewPolicyHistory: true,
      scope: "security_operations",
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
  let allowedRoutes: string[];
  
  switch (role) {
    case UserRole.ADMINISTRATOR:
      allowedRoutes = ADMIN_ROUTES;
      break;
    case UserRole.SECURITY_OPERATOR:
      allowedRoutes = OPERATOR_ROUTES;
      break;
    case UserRole.USER:
    default:
      allowedRoutes = USER_ROUTES;
      break;
  }
  
  const hasAccess = allowedRoutes.some((allowedRoute) => {
    return route === allowedRoute || route.startsWith(allowedRoute + "/");
  });

  // Debug logging
  console.log('canAccessRoute Debug:', {
    role,
    route,
    allowedRoutes,
    hasAccess
  });
  
  return hasAccess;
}

export function getSidebarMenus(role: UserRole): string[] {
  switch (role) {
    case UserRole.ADMINISTRATOR:
      return ADMIN_SIDEBAR_MENUS;
    case UserRole.SECURITY_OPERATOR:
      return OPERATOR_SIDEBAR_MENUS;
    case UserRole.USER:
    default:
      return USER_SIDEBAR_MENUS;
  }
}

export function getTopBarFeatures(role: UserRole) {
  return TOPBAR_FEATURES[role] || TOPBAR_FEATURES[UserRole.USER];
}

export function getComponentFilter(
  component: keyof typeof COMPONENT_FILTERS,
  role: UserRole
) {
  return COMPONENT_FILTERS[component][role] || COMPONENT_FILTERS[component][UserRole.USER];
}

export const CURRENT_USER_ROLE = UserRole.ADMINISTRATOR;

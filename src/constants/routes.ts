const ROUTES = {
  Home: {
    Index: "/",
    Dashboard: "/dashboard",
  },
  SignIn: "/sign-in",
  SignInMaster: "/sign-in/master",
  ResetPassword: "/reset-password",
  SignUp: "/sign-up",
  Login: "/sign-in",
  Logout: "/logout",
  Forbidden: "/forbidden",

  Analysis: {
    Requests: "/analysis/requests",
    RequestDetail: "/analysis/requests/:id",
    Detection: "/analysis/detection",
    Action: "/analysis/action",
    Pending: "/analysis/action/pending",
    Completed: "/analysis/action/completed",
  },
  Policy: {
    SystemSettings: "/policy/system-settings",
    AdminPolicy: "/policy/admin-policy",
    UserPolicy: "/policy/user-policy",
    BlacklistWhitelist: "/policy/blacklist-whitelist",
  },
  History: {
    BlacklistWhitelist: "/history/blacklist-whitelist",
    Inspection: "/history/inspection",
    Action: "/history/action",
    PolicyChanges: "/history/policy-changes",
    AiLearning: "/history/ai-learning",
    Authority: "/history/authority",
  },
  Alarm: {
    Notifications: "/alarm/notifications",
    Schedule: "/alarm/schedule",
  },
  User: {
    ChangeInfo: "/user/change-info",
    Permissions: "/user/permissions",
  },
  Report: {
    List: "/report/list",
    Regular: "/report/regular",
  },
};

export default ROUTES;

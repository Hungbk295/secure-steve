const ROUTES = {
  Home: "/",
  SignIn: "/sign-in",
  SignInMaster: "/sign-in/master",
  ResetPassword: "/reset-password",
  SignUp: "/sign-up",
  Login: "/sign-in",
  Logout: "/logout",
  Forbidden: "/forbidden",
  Dashboard: "/dashboard",
  Analyze: {
    Detection: "/analyze/detection",
    Action: "/analyze/action",
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
  Report: {
    List: "/report/list",
    Regular: "/report/regular",
  },
  User: {
    ChangeInfo: "/user/change-info",
    Permissions: "/user/permissions",
  },
  PersonalSettings: "/user/change-info",
  ShoppingOffer: {
    Promotion: "/shopping-offer/promotion",
    SearchRule: "/shopping-offer/search-rule",
  },
  Aggregator: {
    HaloAirlineControl: "/aggregator/halo-airline-control",
    CreateHaloAirlineControl: "/aggregator/halo-airline-control/create",
    DetailHaloAirlineControl: "/aggregator/halo-airline-control/detail/:id",
    HaloCredential: "/aggregator/halo-credential",
    ProviderAirline: "/aggregator/provider-airline",
    ProviderAirlineDetails: "/aggregator/provider-airline/:id",
    DetailHaloCredential: "/aggregator/halo-credential/detail/:id",
    AirlineProfile: "/aggregator/airline-profile",
  },
  Account: {
    CustomerAccount: "/account/customer-account",
    CustomerAccountDetails: "/account/customer-account/detail/:id",
    AlbusAdminUser: "/account/albus-admin-user",
    LunaAdmin: "/account/luna-admin",
    AlbusMaster: "/account/albus-master",
    CreateAlbusMaster: "/account/albus-master/create",
    DetailAlbusMaster: "/account/albus-master/detail/:id",
    CreateLunaAdmin: "/account/luna-admin/create",
    DetailLunaAdmin: "/account/luna-admin/detail/:id",
  },
  UsageAndBilling: {
    AccountBilling: "/usage-billing/account-billing",
    AirlineBilling: "/usage-billing/airline-billing",
  },
};

export default ROUTES;

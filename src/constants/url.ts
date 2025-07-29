const URL = {
  Home: "/",
  SignIn: "/sign-in",
  SignInMaster: "/sign-in/master",
  ResetPassword: "/reset-password",
  SignUp: "/sign-up",
  Forbidden: "/forbidden",
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
  Report: {
    Reservation: "/report/reservation",
    ApiCall: "/report/api-call",
  },
  UsageAndBilling: {
    AccountBilling: "/usage-billing/account-billing",
    AirlineBilling: "/usage-billing/airline-billing",
  },
  PersonalSettings: "/personal-settings",
};

export default URL;

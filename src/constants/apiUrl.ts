import { EUserRole } from "@/interfaces/app";

export const API_URL_TYPE = {
  ALBUS_ADMIN_USER_SEARCH_LIST: "ALBUS_ADMIN_USER_SEARCH_LIST",
  CUSTOMER_ACCOUNT_SEARCH: "CUSTOMER_ACCOUNT_SEARCH",
  CUSTOMER_ACCOUNT_SEARCH_DETAIL: "CUSTOMER_ACCOUNT_SEARCH_DETAIL",
  CUSTOMER_ACCOUNT_DETAILS: "CUSTOMER_ACCOUNT_DETAILS",
  CUSTOMER_ACCOUNT_UPDATE: "CUSTOMER_ACCOUNT_UPDATE",
  CUSTOMER_ACCOUNT_TIMEZONE: "CUSTOMER_ACCOUNT_TIMEZONE",
  CUSTOMER_ACCOUNT_DUP_IATA: "CUSTOMER_ACCOUNT_DUP_IATA",
  PERSONAL_INFO: "PERSONAL_INFO",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  COMMON: {
    TIMEZONE: "COMMON_TIMEZONE",
    PROVIDER_GRP: "COMMON_PROVIDER_GRP",
    AIRLINE: "COMMON_AIRLINE",
  },
  AGGREGATOR: {
    HALO_CREDENTIAL: {
      SEARCH: "AGGREGATOR_HALO_CREDENTIAL_SEARCH",
    },
    HALO_AIRLINE_CONTROL: {
      SEARCH: "AGGREGATOR_HALO_AIRLINE_CONTROL_SEARCH",
      CHANGE_HISTORY: "AGGREGATOR_HALO_AIRLINE_CONTROL_CHANGE_HISTORY",
    },
    PROVIDER_AIRLINE: {
      SEARCH: "AGGREGATOR_PROVIDER_AIRLINE_SEARCH",
      DETAILS: "AGGREGATOR_PROVIDER_AIRLINE_DETAILS",
    },
  },
  ACCOUNT: {
    LUNA_ADMIN: {
      SEARCH_LIST: "ACCOUNT_LUNA_ADMIN_SEARCH_LIST",
      ADD: "ACCOUNT_LUNA_ADMIN_ADD",
      DETAIL: "ACCOUNT_LUNA_ADMIN_DETAIL",
      UPDATE: "ACCOUNT_LUNA_ADMIN_UPDATE",
      DELETE: "ACCOUNT_LUNA_ADMIN_DELETE",
      ACCOUNT_LIST: "ACCOUNT_LUNA_ADMIN_ACCOUNT_LIST",
    },
  },
};

export const API_URL: Record<string, any> = {
  [API_URL_TYPE.CUSTOMER_ACCOUNT_SEARCH]: {
    [EUserRole.MASTER]: "/api/master/customer/searchList",
    [EUserRole.ADMIN]: "/api/admin/customer/searchList",
  },
  [API_URL_TYPE.CUSTOMER_ACCOUNT_SEARCH_DETAIL]: {
    [EUserRole.MASTER]: "/api/master/customer/searchDetail",
    [EUserRole.ADMIN]: "/api/admin/customer/searchDetail",
  },
  [API_URL_TYPE.CUSTOMER_ACCOUNT_DETAILS]: {
    [EUserRole.MASTER]: "/api/master/customer/details",
    [EUserRole.ADMIN]: "/api/admin/customer/details",
  },
  [API_URL_TYPE.CUSTOMER_ACCOUNT_UPDATE]: {
    [EUserRole.MASTER]: "/api/master/customer/update",
    [EUserRole.ADMIN]: "/api/admin/customer/update",
  },
  [API_URL_TYPE.CUSTOMER_ACCOUNT_TIMEZONE]: {
    [EUserRole.MASTER]: "/api/master/customer/searchTimezone",
    [EUserRole.ADMIN]: "/api/admin/customer/searchTimezone",
  },
  [API_URL_TYPE.CUSTOMER_ACCOUNT_DUP_IATA]: {
    [EUserRole.MASTER]: "/api/master/customer/dupIataNumber",
    [EUserRole.ADMIN]: "/api/admin/customer/dupIataNumber",
  },
  [API_URL_TYPE.ALBUS_ADMIN_USER_SEARCH_LIST]: {
    [EUserRole.MASTER]: "/api/master/account/user/searchList",
    [EUserRole.ADMIN]: "/api/admin/account/user/searchList",
  },
  [API_URL_TYPE.PERSONAL_INFO]: {
    [EUserRole.MASTER]: "/api/master/profile/info",
    [EUserRole.ADMIN]: "/api/admin/profile/info",
    [EUserRole.USER]: "/api/user/profile/info",
  },
  [API_URL_TYPE.REFRESH_TOKEN]: {
    [EUserRole.MASTER]: "/api/master/refreshtoken",
    [EUserRole.ADMIN]: "/api/admin/refreshtoken",
    [EUserRole.USER]: "/api/user/refreshtoken",
  },
  [API_URL_TYPE.AGGREGATOR.HALO_CREDENTIAL.SEARCH]: {
    [EUserRole.MASTER]: "/api/master/aggr/credential",
    [EUserRole.ADMIN]: "/api/admin/aggr/credential",
  },
  [API_URL_TYPE.AGGREGATOR.HALO_AIRLINE_CONTROL.SEARCH]: {
    [EUserRole.MASTER]: "/api/master/aggr/airctrl/list",
  },
  [API_URL_TYPE.AGGREGATOR.HALO_AIRLINE_CONTROL.CHANGE_HISTORY]: {
    [EUserRole.MASTER]: "/api/master/aggr/airctrl/history",
  },
  [API_URL_TYPE.AGGREGATOR.PROVIDER_AIRLINE.SEARCH]: {
    [EUserRole.MASTER]: "/api/master/aggr/provider/list",
    [EUserRole.ADMIN]: "/api/admin/aggr/provider/list",
  },
  [API_URL_TYPE.AGGREGATOR.PROVIDER_AIRLINE.DETAILS]: {
    [EUserRole.MASTER]: "/api/master/aggr/provider/mapping",
    [EUserRole.ADMIN]: "/api/admin/aggr/provider/mapping",
  },
  [API_URL_TYPE.COMMON.TIMEZONE]: {
    [EUserRole.MASTER]: "/api/master/common/timezonelist",
    [EUserRole.ADMIN]: "/api/admin/common/timezonelist",
    [EUserRole.USER]: "/api/user/common/timezonelist",
  },
  [API_URL_TYPE.COMMON.PROVIDER_GRP]: {
    [EUserRole.MASTER]: "/api/master/common/providergrplist",
    [EUserRole.ADMIN]: "/api/admin/common/providergrplist",
    [EUserRole.USER]: "/api/user/common/providergrplist",
  },
  [API_URL_TYPE.COMMON.AIRLINE]: {
    [EUserRole.MASTER]: "/api/master/common/airlinelist",
    [EUserRole.ADMIN]: "/api/admin/common/airlinelist",
    [EUserRole.USER]: "/api/user/common/airlinelist",
  },
  [API_URL_TYPE.ACCOUNT.LUNA_ADMIN.SEARCH_LIST]: {
    [EUserRole.MASTER]: "/api/master/luna/searchList",
    [EUserRole.ADMIN]: "/api/admin/luna/searchList",
  },
  [API_URL_TYPE.ACCOUNT.LUNA_ADMIN.ADD]: {
    [EUserRole.MASTER]: "/api/master/luna/add",
    [EUserRole.ADMIN]: "/api/admin/luna/add",
  },
  [API_URL_TYPE.ACCOUNT.LUNA_ADMIN.ACCOUNT_LIST]: {
    [EUserRole.MASTER]: "/api/master/luna/searchAccount",
    [EUserRole.ADMIN]: "/api/admin/luna/searchAccount",
  },
  [API_URL_TYPE.ACCOUNT.LUNA_ADMIN.DETAIL]: {
    [EUserRole.MASTER]: "/api/master/luna/searchDetail",
    [EUserRole.ADMIN]: "/api/admin/luna/searchDetail",
  },
  [API_URL_TYPE.ACCOUNT.LUNA_ADMIN.UPDATE]: {
    [EUserRole.MASTER]: "/api/master/luna/update",
    [EUserRole.ADMIN]: "/api/admin/luna/update",
  },
  [API_URL_TYPE.ACCOUNT.LUNA_ADMIN.DELETE]: {
    [EUserRole.MASTER]: "/api/master/luna/delete",
    [EUserRole.ADMIN]: "/api/admin/luna/delete",
  },
};

import { DynamicKeyObject, EUserRole } from "@/interfaces/app";
import URL from "@/constants/url";

export const MAPPED_ROLE_PERMISSION: DynamicKeyObject = {
  [EUserRole.USER]: 1,
  [EUserRole.ADMIN]: 2,
  [EUserRole.MASTER]: 3,
};

export const EXTRA_SIDEBAR_LIST: DynamicKeyObject[] = [
  {
    id: 7,
    label: "Personal settings",
    key: URL.PersonalSettings,
  },
];

export const EXTRA_BREADCRUMB_LIST: DynamicKeyObject = {
  [URL.Account.CustomerAccount]: [
    {
      id: 1,
      label: "Customer Account Details",
      key: URL.Account.CustomerAccountDetails,
    },
  ],
  [URL.Account.AlbusMaster]: [
    {
      id: 1,
      label: "ALBUS Master Details",
      key: URL.Account.DetailAlbusMaster,
    },
    {
      id: 2,
      label: "Create ALBUS Master",
      key: URL.Account.CreateAlbusMaster,
    },
  ],
  [URL.Account.LunaAdmin]: [
    {
      id: 1,
      label: "LUNA Admin Details",
      key: URL.Account.DetailLunaAdmin,
    },
    {
      id: 2,
      label: "Create LUNA Admin",
      key: URL.Account.CreateLunaAdmin,
    },
  ],
  [URL.Aggregator.HaloCredential]: [
    {
      id: 1,
      label: "HALO Credential Details",
      key: URL.Aggregator.DetailHaloCredential,
    },
  ],
  [URL.Aggregator.HaloAirlineControl]: [
    {
      id: 1,
      label: "Create HALO Airline Control",
      key: URL.Aggregator.CreateHaloAirlineControl,
    },
    {
      id: 2,
      label: "HALO Airline Control Details",
      key: URL.Aggregator.DetailHaloAirlineControl,
    },
  ],
  [URL.Aggregator.ProviderAirline]: [
    {
      id: 1,
      label: "Provider/Airline Details",
      key: URL.Aggregator.ProviderAirlineDetails,
    },
  ],
};

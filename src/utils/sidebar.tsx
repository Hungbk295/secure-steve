import IconTipping from "@/assets/svgs/tipping.svg";
import IconAggregatorLine from "@/assets/svgs/aggregator-line.svg";
import IconHomeSelected from "@/assets/svgs/home-selected.svg";
import IconTippingSelected from "@/assets/svgs/tipping-selected.svg";
import IconAggregatorLineSelected from "@/assets/svgs/aggregator-line-selected.svg";
import { cn } from "@/libs/utils";
import { EUserRole } from "@/interfaces/app";
import { store } from "@/store";
import { MAPPED_ROLE_PERMISSION } from "@/constants/sidebar";
import URL from "@/constants/url";

export function getSideBarListByAction(
  collapsed: boolean = false,
  parentPathSelected: string = "/"
) {
  function isSelected(path: string) {
    return path === parentPathSelected;
  }
  const userRole = store.getState().auth.infoLogin.role;

  const sidebarList = [
    {
      id: 1,
      label: "Home",
      key: "/",
      permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
      icon:
        !collapsed && isSelected("/") ? (
          <IconHomeSelected />
        ) : (
          <i className={cn("!text-[20px] text-grey-80 ri-home-5-line")} />
        ),
    },
    {
      id: 2,
      label: "Shopping offer",
      key: "/shopping-offer",
      disable: true,
      permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
      icon:
        !collapsed && isSelected("/shopping-offer") ? (
          <IconTippingSelected />
        ) : (
          <IconTipping />
        ),
      children: [
        {
          id: 21,
          label: "Promotion",
          key: URL.ShoppingOffer.Promotion,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
        },
        {
          id: 22,
          label: "Search Rule",
          key: URL.ShoppingOffer.SearchRule,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.MASTER],
        },
      ],
    },
    {
      id: 3,
      label: "Aggregator",
      key: "/aggregator",
      disable: true,
      permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
      icon:
        !collapsed && isSelected("/aggregator") ? (
          <IconAggregatorLineSelected />
        ) : (
          <IconAggregatorLine />
        ),
      children: [
        {
          id: 31,
          label: "Provider/Airline",
          key: URL.Aggregator.ProviderAirline,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.MASTER],
        },
        {
          id: 32,
          label: "HALO Credential",
          key: URL.Aggregator.HaloCredential,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
        },
        {
          id: 33,
          label: "Airline Profile",
          key: URL.Aggregator.AirlineProfile,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
        },
        {
          id: 34,
          label: "HALO Airline Control",
          key: URL.Aggregator.HaloAirlineControl,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.MASTER],
        },
      ],
    },
    {
      id: 4,
      label: "Account",
      key: "/account",
      disable: true,
      permission: MAPPED_ROLE_PERMISSION[EUserRole.ADMIN],
      icon: (
        <i
          className={cn(
            "!text-[20px] text-grey-80",
            !collapsed && isSelected("/account")
              ? "ri-user-settings-fill"
              : "ri-user-settings-line"
          )}
        />
      ),
      children: [
        {
          id: 41,
          label: "Customer Account",
          key: URL.Account.CustomerAccount,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.ADMIN],
        },
        {
          id: 42,
          label: "ALBUS Admin/User",
          key: URL.Account.AlbusAdminUser,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.ADMIN],
        },
        {
          id: 43,
          label: "LUNA Admin",
          key: URL.Account.LunaAdmin,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.ADMIN],
        },
        {
          id: 44,
          label: "ALBUS Master",
          key: URL.Account.AlbusMaster,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.MASTER],
        },
      ],
    },
    {
      id: 5,
      label: "Usage & Billing",
      key: "/usage-billing",
      disable: true,
      permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
      icon: (
        <i
          className={cn(
            "!text-[20px] text-grey-80",
            !collapsed && isSelected("/usage-billing")
              ? "ri-money-dollar-circle-fill"
              : "ri-money-dollar-circle-line"
          )}
        />
      ),
      children: [
        {
          id: 51,
          label: "Account Billing",
          key: URL.UsageAndBilling.AccountBilling,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
        },
        {
          id: 52,
          label: "Airline Billing",
          key: URL.UsageAndBilling.AirlineBilling,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.MASTER],
        },
      ],
    },
    {
      id: 6,
      label: "Report",
      key: "/report",
      disable: true,
      permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
      icon: (
        <i
          className={cn(
            "!text-[20px] text-grey-80",
            !collapsed && isSelected("/report")
              ? "ri-article-fill"
              : "ri-article-line"
          )}
        />
      ),
      children: [
        {
          id: 61,
          label: "Reservation",
          key: URL.Report.Reservation,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.USER],
        },
        {
          id: 62,
          label: "API Call",
          key: URL.Report.ApiCall,
          permission: MAPPED_ROLE_PERMISSION[EUserRole.MASTER],
        },
      ],
    },
  ];

  const filteredSidebarList = sidebarList.filter((item) => {
    const hasPermission = item.permission <= MAPPED_ROLE_PERMISSION[userRole];
    if (hasPermission && item.children) {
      item.children = item.children.filter(
        (child) => child.permission <= MAPPED_ROLE_PERMISSION[userRole]
      );
    }
    return hasPermission;
  });
  return filteredSidebarList;
}

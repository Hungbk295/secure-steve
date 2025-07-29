import { API_URL } from "@/constants/apiUrl";
import { store } from "@/store";
import { DynamicKeyObject, EUserRole } from "@/interfaces/app";
import { EXTRA_BREADCRUMB_LIST, EXTRA_SIDEBAR_LIST } from "@/constants/sidebar";
import { getSideBarListByAction } from "@/utils/sidebar";
import { FormInstance } from "antd";

const appendBreadcrumbIntoSidebar = () => {
  const sidebarList = [...getSideBarListByAction(), ...EXTRA_SIDEBAR_LIST];
  return sidebarList.map((item) => {
    if (item.children?.length) {
      item.children = item.children.map((child: any) => {
        if (Object.keys(EXTRA_BREADCRUMB_LIST).includes(child.key)) {
          return {
            ...child,
            children: EXTRA_BREADCRUMB_LIST[child.key],
          };
        }
        return child;
      });
    }
    return item;
  });
};

export function getSelectedKeySidebar(pathName: string) {
  const sidebarList = appendBreadcrumbIntoSidebar();

  function findPath(
    nodes: DynamicKeyObject[],
    breadcrumbs: DynamicKeyObject[] = []
  ): DynamicKeyObject | null {
    for (const node of nodes) {
      const newBreadcrumbs = [...breadcrumbs, node];
      const keyBase = node.key?.replace(":id", "");
      const isExactMatch = pathName === node.key;
      const isDynamicMatch =
        node.key?.includes(":id") && pathName.includes(keyBase);
      if (isExactMatch || isDynamicMatch) {
        const parentKey = breadcrumbs[0]?.key ?? node.key;
        const childKey = breadcrumbs[1]?.key ?? node.key;
        return {
          parentKey,
          childKey,
          breakcrumbs: [{ label: "Home", key: "/" }, ...newBreadcrumbs],
        };
      }
      if (node.children) {
        const result = findPath(node.children, newBreadcrumbs);
        if (result) return result;
      }
    }
    return null;
  }

  const result = findPath(sidebarList);
  return result || { parentKey: "", childKey: "" };
}

export function nvl(str: string, defaultVal: string | number) {
  let defaultValue = typeof defaultVal === "number" ? 0 : "";

  if (typeof defaultVal != "undefined") {
    defaultValue = defaultVal;
  }

  if (
    typeof str == "undefined" ||
    str == null ||
    str == "" ||
    str == "undefined"
  ) {
    return defaultValue;
  }

  return str;
}

export function getApiUrl(urlType: string, initRole?: EUserRole) {
  const userRole = store.getState().auth.infoLogin.role;
  const foundedUrl = API_URL[urlType][initRole ?? userRole];

  // MASTER DEFAULT
  if (!foundedUrl) return Object.values(API_URL[urlType])[0];

  return foundedUrl;
}

export function getTagType(status: string, list: DynamicKeyObject[]) {
  const tag = list.find((item) => item.value === status);
  return tag?.tag;
}

export const convertSecondsToMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export const getValidatedAntdFormValues = async (form: FormInstance<any>) => {
  try {
    const values = await form.validateFields();
    return values;
  } catch {
    return null;
  }
};

export const convertDataToAntdOptions = (
  list: DynamicKeyObject[],
  { labelText, valueText }: { labelText: string; valueText: string }
) =>
  list.map((item) => ({
    label: item[labelText],
    value: item[valueText],
  }));

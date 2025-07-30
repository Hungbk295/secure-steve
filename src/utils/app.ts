import { API_URL } from "@/constants/apiUrl";
import { store } from "@/store";
import { DynamicKeyObject, EUserRole } from "@/interfaces/app";
import { findActiveMenuItem } from "@/utils/sidebar";
import { FormInstance } from "antd";

export function getSelectedKeySidebar(pathName: string) {
  const result = findActiveMenuItem(pathName);
  return {
    parentKey: result.parentId || "",
    childKey: result.childId || "",
    breakcrumbs: [{ label: "Home", key: "/" }], // Simple breadcrumb
  };
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

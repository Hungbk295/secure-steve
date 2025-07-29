import { ReactNode } from "react";

export interface ISidebar {
  id: number;
  label: string;
  key: string;
  icon?: ReactNode;
  children?: ISidebar[];
}

export interface DynamicKeyObject {
  [key: string]: any;
}

export enum ETagType {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
  SECONDARY = "secondary",
}

export enum EUserRole {
  USER = "user",
  ADMIN = "admin",
  MASTER = "master",
  LUNA_ADMIN = "luna",
}

export enum ENotificationType {
  NONE = "none",
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
}

export enum EModalMode {
  SINGLE = "single",
  MULTIPLE = "multiple",
}

export enum EInitialYn {
  Y = "Y",
  N = "N",
}

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

export interface Alert {
  id: string;
  file_name: string;
  client_server_ip: string;
  file_created_at: string;
  analysis_time: string;
  malware_status: string;
  process_status: "pending" | "no_action" | "quarantine" | "delete";
  risk: number;
  alert_name: string;
  malware_type: string;
  verdict: "Malware" | "Benign" | "Suspicious";
}

export interface AlertActionRequest {
  process_status: "pending" | "no_action" | "quarantine" | "delete";
  user_id: string;
  comments?: string;
  action_type?: "blacklist" | "whitelist";
}

export interface LatestAlertsResponse {
  data: Alert[];
  total_count: number;
  pending_count: number;
}

export enum EAlertProcessStatus {
  PENDING = "pending",
  NO_ACTION = "no_action", 
  QUARANTINE = "quarantine",
  DELETE = "delete",
}

export enum EAlertActionType {
  BLACKLIST = "blacklist",
  WHITELIST = "whitelist",
}

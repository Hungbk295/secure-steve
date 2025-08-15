export interface PolicyItem {
  id: string;
  cluster_name: string;
  server_manager: string;
  department: string;
  malware_definition_ref: number;
  malware_definition_user: number;
  isolation_ref: number;
  isolation_user: number;
  report_ref: number;
  report_user: number;
  regular_report_ref: number;
  regular_report_user: number;
  selected?: boolean;
}

export interface ImportanceTemplate {
  id: string;
  name: string;
  label: string;
  isolation_value: number;
  reporting_value: number;
}

export interface SensitivityConfig {
  malware_definition: number;
  isolation: number;
  report: number;
  regular_report: number;
}

export interface PolicyFilter {
  cluster_name?: string;
  server_manager?: string;
}

export interface PolicyActionRequest {
  selected_ids: string[];
  action_type: "assign_cluster" | "assign_manager" | "apply_policy";
  payload?: {
    cluster_name?: string;
    management_name?: string;
    importance?: string;
    user_id?: string;
    department?: string;
    api_id?: string;
    sensitivity_config?: SensitivityConfig;
  };
}

export interface APIDescription {
  id: string;
  name: string;
  description: string;
  parameters?: any[];
}
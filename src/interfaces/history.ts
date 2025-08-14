export interface ScanHistoryItem {
  id: string;
  time: string;
  server_ip: string;
  test_status: "Completed" | "Fail(Error)" | "Fail(None exe)";
  test_type: "Total" | "Streaming";
  detected_count: number;
  total_count: number;
  owner: string;
}

export interface ActionHistoryItem {
  id: string;
  time: string;
  file_name: string;
  risk: number;
  verdict: "Malware" | "Benign" | "Suspicious" | "Unknown";
  server_ip: string;
  process_status: "delete" | "quarantine" | "no_action" | "pending";
  actioned_by: string;
}

export interface ScanHistoryFilter {
  timeRange?: [string, string] | null;
  serverIP?: string;
  testStatus?: string;
  testType?: string;
  owner?: string;
}

export interface ActionHistoryFilter {
  timeRange?: [string, string] | null;
  risk?: string[];
  verdict?: string[];
  processStatus?: string[];
  serverIP?: string;
}

export interface AILearningHistoryItem {
  id: string;
  time: string;
  model_version: string;
  agent_release: "Completed" | "Fail(Error)";
}

export interface AILearningHistoryFilter {
  timeRange?: [string, string] | null;
}
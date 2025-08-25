import { EAlertProcessStatus } from "@/interfaces/app";

export const TRIAGE_VERDICT_OPTIONS = [
  { value: "Malware", label: "Malware" },
  { value: "Benign", label: "Benign" },
  { value: "Suspicious", label: "Suspicious" },
  { value: "Unknown", label: "Unknown" },
];

export const RISK_LEVEL_OPTIONS = [
  { value: "high", label: "High (80-100%)" },
  { value: "medium", label: "Medium (50-79%)" },
  { value: "low", label: "Low (0-49%)" },
];

export const PROCESS_STATUS_OPTIONS = [
  { value: EAlertProcessStatus.PENDING, label: "Pending" },
  { value: EAlertProcessStatus.NO_ACTION, label: "No Action" },
  { value: EAlertProcessStatus.QUARANTINE, label: "Quarantine" },
  { value: EAlertProcessStatus.DELETE, label: "Delete" },
];

export const EXCEPTION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "blacklist", label: "Blacklist" },
  { value: "whitelist", label: "Whitelist" },
];

export const BLACKLIST_ACTION_OPTIONS = [
  { value: "delete", label: "Delete" },
  { value: "quarantine", label: "Quarantine" },
];

export const TIME_RANGE_PRESETS = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 30, label: "30" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

export const SORT_OPTIONS = [
  { value: "time_desc", label: "Time (Newest)" },
  { value: "time_asc", label: "Time (Oldest)" },
  { value: "risk_desc", label: "Risk (High to Low)" },
  { value: "risk_asc", label: "Risk (Low to High)" },
  { value: "file_name_asc", label: "File Name (A-Z)" },
  { value: "file_name_desc", label: "File Name (Z-A)" },
];

export const getVerdictColor = (verdict: string): string => {
  switch (verdict) {
    case "Malware":
      return "bg-red-50 text-red-700 border-red-200";
    case "Suspicious":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Benign":
      return "bg-green-50 text-green-700 border-green-200";
    case "Unknown":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getRiskLevel = (
  risk: string | number
): "high" | "medium" | "low" => {
  const riskValue =
    typeof risk === "string" ? parseFloat(risk.replace("%", "")) : risk;
  if (riskValue >= 80) return "high";
  if (riskValue >= 50) return "medium";
  return "low";
};

export const getRiskBadgeColor = (risk: string | number): string => {
  const level = getRiskLevel(risk);
  switch (level) {
    case "high":
      return "bg-red-50 text-red-700 border-red-200";
    case "medium":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "low":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleString();
};

export const getTimeDisplay = (timeString: string) => {
  const date = new Date(timeString);
  return {
    local: date.toLocaleString(),
    iso: timeString,
  };
};

export const canChangeProcessStatus = (currentStatus: string): boolean => {
  return currentStatus === EAlertProcessStatus.PENDING;
};

export const getExceptionLabel = (exception: string): string => {
  const option = EXCEPTION_OPTIONS.find((opt) => opt.value === exception);
  return option?.label || exception;
};

export const getVerdictLabel = (verdict: string): string => {
  const option = TRIAGE_VERDICT_OPTIONS.find((opt) => opt.value === verdict);
  return option?.label || verdict;
};

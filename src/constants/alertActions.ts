import { EAlertProcessStatus } from "@/interfaces/app";

export const ALERT_ACTION_OPTIONS = [
  { value: EAlertProcessStatus.PENDING, label: "Pending" },
  { value: EAlertProcessStatus.NO_ACTION, label: "No Action" },
  { value: EAlertProcessStatus.QUARANTINE, label: "Quarantine" },
  { value: EAlertProcessStatus.DELETE, label: "Delete" },
];

export const ALERT_ACTION_HTML_OPTIONS = [
  { value: "pending", text: "Pending" },
  { value: "no_action", text: "No Action" },
  { value: "quarantine", text: "Quarantine" },
  { value: "delete", text: "Delete" },
];

export const getActionLabel = (action: string): string => {
  const option = ALERT_ACTION_OPTIONS.find((opt) => opt.value === action);
  return option?.label || action;
};

export const getActionMessage = (action: string): string => {
  switch (action) {
    case EAlertProcessStatus.PENDING:
      return "mark as pending";
    case EAlertProcessStatus.NO_ACTION:
      return "mark as no action";
    case EAlertProcessStatus.QUARANTINE:
      return "quarantine";
    case EAlertProcessStatus.DELETE:
      return "delete";
    default:
      return "process";
  }
};

export const getActionColor = (action: string): string => {
  switch (action) {
    case EAlertProcessStatus.PENDING:
      return "text-orange-700";
    case EAlertProcessStatus.NO_ACTION:
      return "text-gray-700";
    case EAlertProcessStatus.QUARANTINE:
      return "text-yellow-700";
    case EAlertProcessStatus.DELETE:
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

export const getActionIcon = (action: string): string => {
  switch (action) {
    case EAlertProcessStatus.PENDING:
      return "ri-time-line";
    case EAlertProcessStatus.NO_ACTION:
      return "ri-check-circle-line";
    case EAlertProcessStatus.QUARANTINE:
      return "ri-shield-line";
    case EAlertProcessStatus.DELETE:
      return "ri-delete-bin-line";
    default:
      return "ri-question-line";
  }
};

import { EAlertProcessStatus } from "@/interfaces/app";

/**
 * Alert Action Options for Select Components
 * Centralized place to manage alert action options used throughout the project
 */

// For Ant Design Select components
export const ALERT_ACTION_OPTIONS = [
  { value: EAlertProcessStatus.PENDING, label: "Pending" },
  { value: EAlertProcessStatus.NO_ACTION, label: "No Action" },
  { value: EAlertProcessStatus.QUARANTINE, label: "Quarantine" },
  { value: EAlertProcessStatus.DELETE, label: "Delete" },
];

// For HTML select elements  
export const ALERT_ACTION_HTML_OPTIONS = [
  { value: "pending", text: "Pending" },
  { value: "no_action", text: "No Action" },
  { value: "quarantine", text: "Quarantine" },
  { value: "delete", text: "Delete" },
];

// Simple label mapping
export const getActionLabel = (action: EAlertProcessStatus): string => {
  const option = ALERT_ACTION_OPTIONS.find(opt => opt.value === action);
  return option?.label || action;
};

// Action messages for confirmation dialogs
export const getActionMessage = (action: EAlertProcessStatus): string => {
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

// Action colors for styling
export const getActionColor = (action: EAlertProcessStatus): string => {
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

// Action icons
export const getActionIcon = (action: EAlertProcessStatus): string => {
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
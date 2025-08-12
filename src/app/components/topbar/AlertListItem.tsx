import { Alert, EAlertProcessStatus } from "@/interfaces/app";
import Select from "@/app/components/common/Select";
import { ALERT_ACTION_OPTIONS, getActionIcon } from "@/constants/alertActions";

interface AlertListItemProps {
  alert: Alert;
  onItemClick: (alertId: string | number) => void;
  onActionSelect: (alertId: string | number, action: EAlertProcessStatus) => void;
  isUpdating?: boolean;
}

const getStatusIcon = (status: string): string => {
  const baseIcon = getActionIcon(status as EAlertProcessStatus);
  switch (status) {
    case "pending":
      return `${baseIcon} text-orange-500`;
    case "no_action":
      return `${baseIcon} text-gray-500`;
    case "quarantine":
      return `${baseIcon} text-yellow-500`;
    case "delete":
      return `${baseIcon} text-red-500`;
    default:
      return `${baseIcon} text-orange-500`;
  }
};

function AlertListItem({
  alert,
  onItemClick,
  onActionSelect,
  isUpdating = false,
}: AlertListItemProps) {
  const handleItemClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".action-dropdown")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onItemClick(alert.id);
  };

  const handleActionChange = (value: EAlertProcessStatus) => {
    onActionSelect(alert.id, value);
  };

  const isActionDisabled = alert.process_status !== "pending" || isUpdating;

  return (
    <div
      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleItemClick}
    >
      <div className="flex items-start justify-between space-x-2">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-1">
            <i className={`${getStatusIcon(alert.process_status)} text-lg`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm mb-1">
              {alert.alert_name || alert.file_name}
            </div>

            <div className="text-sm text-gray-700 mb-2">
              <div className="truncate" title={alert.file_name}>
                {alert.file_name}
              </div>
              <div className="text-xs text-gray-500">
                {alert.client_server_ip}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-40">
          <div className="action-dropdown" onClick={(e) => e.stopPropagation()}>
            <Select
              value={alert.process_status}
              onChange={handleActionChange}
              disabled={isActionDisabled}
              size="small"
              className="w-full"
              loading={isUpdating}
              options={ALERT_ACTION_OPTIONS}
            />
          </div>

          {isUpdating && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <i className="ri-loader-2-line animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertListItem;

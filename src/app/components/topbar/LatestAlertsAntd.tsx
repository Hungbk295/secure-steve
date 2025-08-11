import { useEffect, useRef, useState } from "react";
import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchLatestAlerts,
  updateAlertAction,
  selectLatestAlerts,
  selectAlertsLoading,
  selectAlertsError,
  Alert,
} from "@/store/alertsSlice";
import Select from "@/app/components/common/Select";

interface LatestAlertsAntdProps {
  onClose: () => void;
  alertCount: number;
}

const actionOptions = [
  { value: "pending", label: "Pending" },
  { value: "no_action", label: "No Action" },
  { value: "quarantine", label: "Quarantine" },
  { value: "delete", label: "Delete" },
];

function LatestAlertsAntd({ onClose, alertCount }: LatestAlertsAntdProps) {
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [updatingAlerts, setUpdatingAlerts] = useState<Set<string>>(new Set());

  const latestAlerts = useAppSelector(selectLatestAlerts);
  const loading = useAppSelector(selectAlertsLoading);
  const error = useAppSelector(selectAlertsError);

  useEffect(() => {
    dispatch(fetchLatestAlerts());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (updatingAlerts.size === 0) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, updatingAlerts.size]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <i className="ri-time-line text-orange-500" />;
      case "no_action":
        return <i className="ri-check-circle-line text-gray-500" />;
      case "quarantine":
        return <i className="ri-shield-line text-yellow-500" />;
      case "delete":
        return <i className="ri-delete-bin-line text-red-500" />;
      default:
        return <i className="ri-time-line text-orange-500" />;
    }
  };

  const handleActionSelect = async (alertId: string, action: string) => {
    setUpdatingAlerts((prev) => new Set(prev).add(alertId));

    try {
      const hideLoading = message.loading(
        `Updating alert action to ${action}...`,
        0
      );

      await dispatch(
        updateAlertAction({
          id: alertId,
          action: action as "pending" | "no_action" | "quarantine" | "delete",
        })
      ).unwrap();

      hideLoading();

      message.success(`Alert action updated to ${action} successfully!`);

      await dispatch(fetchLatestAlerts());
    } catch (error) {
      console.error("Failed to update alert action:", error);
      message.error("Failed to update alert action. Please try again.");
    } finally {
      setUpdatingAlerts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const columns: ColumnsType<Alert> = [
    {
      title: "File / Server",
      key: "file",
      width: "35%",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(record.status)}
          <div>
            <div
              className="font-medium text-gray-900 text-sm truncate max-w-[120px]"
              title={record.fileName}
            >
              {record.fileName}
            </div>
            <div className="text-xs text-gray-600">IP: {record.serverIP}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Risk",
      dataIndex: "riskLevel",
      key: "risk",
      width: "20%",
      render: (level: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
            level
          )}`}
        >
          {level.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "malwareType",
      key: "type",
      width: "20%",
      render: (type: string) => (
        <span className="text-sm text-gray-700">{type}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "30%",
      render: (_, record) => (
        <Select
          value={record.status}
          size="small"
          className="w-full"
          loading={updatingAlerts.has(record.id)}
          disabled={updatingAlerts.has(record.id)}
          onChange={(value) => handleActionSelect(record.id, value)}
          options={actionOptions}
          placeholder="Select action..."
        />
      ),
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Latest Alerts</h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{alertCount} total</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Close alerts"
            >
              <i className="ri-close-line text-lg" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-hidden">
        {error && (
          <div className="p-8 text-center text-red-500">
            <i className="ri-error-warning-line text-2xl mb-2" />
            <p>Failed to load alerts</p>
          </div>
        )}

        {!error && (
          <Table
            columns={columns}
            dataSource={latestAlerts.slice(0, 10)}
            loading={loading}
            pagination={false}
            size="small"
            rowKey="id"
            scroll={{ y: 280 }}
            className="alerts-table"
            locale={{
              emptyText: (
                <div className="p-8 text-center text-gray-500">
                  <i className="ri-notification-off-line text-3xl mb-2" />
                  <p>No alerts available</p>
                </div>
              ),
            }}
          />
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Alerts
        </button>
      </div>
    </div>
  );
}

export default LatestAlertsAntd;

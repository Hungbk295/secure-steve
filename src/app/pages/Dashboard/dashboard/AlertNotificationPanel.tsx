import { useState, useEffect } from "react";
import { Table, Tag, Select, Button, Card, message, Col, Row } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchLatestAlerts,
  updateAlertAction,
  selectLatestAlerts,
  selectAlertsLoading,
  Alert,
} from "@/store/alertsSlice";
import { CURRENT_USER_ROLE, getTopBarFeatures } from "@/constants/roleConfig";
import styles from "./AlertNotificationPanel.module.css";
import ActionConfirmModal from "./ActionConfirmModal";

const actionOptions = [
  { value: "pending", label: "Pending" },
  { value: "no_action", label: "No Action" },
  { value: "quarantine", label: "Quarantine" },
  { value: "delete", label: "Delete" },
];

function AlertNotificationPanel() {
  const dispatch = useAppDispatch();
  const [updatingAlerts, setUpdatingAlerts] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<{
    id: string;
    action: string;
    alertName: string;
  } | null>(null);

  const latestAlerts = useAppSelector(selectLatestAlerts);
  const loading = useAppSelector(selectAlertsLoading);

  const topBarFeatures = getTopBarFeatures(CURRENT_USER_ROLE);

  useEffect(() => {
    dispatch(fetchLatestAlerts());
  }, [dispatch]);

  const getRiskColor = (riskPercentage: number) => {
    if (riskPercentage >= 80) return "bg-red-100 text-red-800";
    if (riskPercentage >= 50) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "no_action":
        return "default";
      case "quarantine":
        return "gold";
      case "delete":
        return "red";
      default:
        return "default";
    }
  };

  const handleActionSelect = async (alertId: string, action: string) => {
    const alert = latestAlerts.find((a) => a.id === alertId);
    if (!alert) return;

    if (action === "quarantine" || action === "delete") {
      setSelectedAlert({
        id: alertId,
        action,
        alertName: alert.alertName,
      });
      setShowConfirmModal(true);
      return;
    }

    await executeAction(alertId, action);
  };

  const executeAction = async (alertId: string, action: string) => {
    setUpdatingAlerts((prev) => new Set(prev).add(alertId));

    try {
      await dispatch(
        updateAlertAction({ id: alertId, action: action as any })
      ).unwrap();
      message.success(`Alert action updated to ${action}`);
    } catch (error) {
      message.error("Failed to update alert action");
      console.error("Error updating alert action:", error);
    } finally {
      setUpdatingAlerts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedAlert) return;

    await executeAction(selectedAlert.id, selectedAlert.action);
    setShowConfirmModal(false);
    setSelectedAlert(null);
  };

  const handleDownloadCSV = async () => {
    try {
      const csvData = latestAlerts.map((alert) => ({
        "Alert ID": alert.id,
        "Alert Name": alert.alertName,
        "File Name": alert.fileName,
        "Server IP": alert.serverIP,
        "Risk Percentage": alert.riskPercentage,
        Verdict: alert.verdict,
        "Malware Type": alert.malwareType,
        "Risk Level": alert.riskLevel,
        "Created Date": new Date(alert.createdAt).toLocaleString("ko-KR"),
        "Analyzed Time": alert.analyzedAt,
        Status: alert.status,
        "Completed Date": alert.completedAt
          ? new Date(alert.completedAt).toLocaleString("ko-KR")
          : "",
      }));

      if (csvData.length === 0) {
        message.warning("No data available to download");
        return;
      }

      const csvContent = [
        Object.keys(csvData[0]).join(","),
        ...csvData.map((row) =>
          Object.values(row)
            .map((value) =>
              typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value
            )
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `security_alerts_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      message.success("CSV file downloaded successfully");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      message.error("Failed to download CSV file");
    }
  };

  const handleRowClick = (record: Alert) => {
    // Navigate to analysis page - mock for now
    console.log(`Navigate to /analysis/detection/${record.id}`);
    message.info(`Opening analysis for ${record.fileName}`);
  };

  const columns: ColumnsType<Alert> = [
    {
      title: "",
      dataIndex: "icon",
      key: "icon",
      width: 40,
      render: (icon: string) => (
        <span className="text-lg" aria-label="Alert status">
          {icon}
        </span>
      ),
    },
    {
      title: "Alert Name",
      dataIndex: "alertName",
      key: "alertName",
      ellipsis: true,
      render: (text: string, record: Alert) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleRowClick(record);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {text}
        </a>
      ),
    },
    {
      title: "File / Server IP",
      key: "fileServer",
      render: (_, record: Alert) => (
        <div>
          <div
            className="font-medium text-gray-900 truncate max-w-[150px]"
            title={record.fileName}
          >
            {record.fileName}
          </div>
          <div className="text-xs text-gray-600">{record.serverIP}</div>
        </div>
      ),
    },
    {
      title: "Risk / Verdict",
      key: "riskVerdict",
      sorter: (a, b) => a.riskPercentage - b.riskPercentage,
      defaultSortOrder: "descend",
      render: (_, record: Alert) => (
        <div>
          <Tag className={`${getRiskColor(record.riskPercentage)} border-0`}>
            {record.riskPercentage}%
          </Tag>
          <div className="text-xs text-gray-600 mt-1">{record.verdict}</div>
        </div>
      ),
    },
    {
      title: "Created / Analyzed",
      key: "timing",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (_, record: Alert) => (
        <div>
          <div className="text-sm">
            {new Date(record.createdAt).toLocaleDateString("ko-KR")}{" "}
            {new Date(record.createdAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-xs text-gray-600">{record.analyzedAt}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "No Action", value: "no_action" },
        { text: "Quarantine", value: "quarantine" },
        { text: "Delete", value: "delete" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.replace("_", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (_, record: Alert) => {
        const isDisabled =
          updatingAlerts.has(record.id) ||
          ["delete", "quarantine", "no_action"].includes(record.status) ||
          !topBarFeatures.canManageAlerts;

        return (
          <Select
            value={record.status}
            size="small"
            className="w-full"
            loading={updatingAlerts.has(record.id)}
            disabled={isDisabled}
            onChange={(value) => handleActionSelect(record.id, value)}
            options={actionOptions}
            placeholder="Select action..."
          />
        );
      },
    },
  ];

  return (
    <>
      <Card
        title="Alert / 알림명"
        size="small"
        className="mb-6"
        extra={
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownloadCSV}
            size="small"
          >
            Download CSV
          </Button>
        }
      >
        {/* {error && (
          <div className="p-8 text-center text-red-500 bg-red-50 rounded mb-4">
            <i className="ri-error-warning-line text-2xl mb-2" />
            <p>Failed to load alerts</p>
          </div>
        )} */}
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <div>Image</div>
          </Col>
          <Col span={18}>
            <Table
              columns={columns}
              dataSource={latestAlerts.slice(0, 10)}
              loading={loading}
              pagination={false}
              size="small"
              rowKey="id"
              scroll={{ x: 800 }}
              className={`alerts-notification-table ${styles["alerts-notification-table"]}`}
              locale={{
                emptyText: (
                  <div className="p-8 text-center text-gray-500">
                    <i className="ri-notification-off-line text-3xl mb-2" />
                    <p>No alerts available</p>
                  </div>
                ),
              }}
            />
          </Col>
        </Row>
      </Card>

      {showConfirmModal && selectedAlert && (
        <ActionConfirmModal
          alertName={selectedAlert.alertName}
          action={selectedAlert.action}
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedAlert(null);
          }}
        />
      )}
    </>
  );
}

export default AlertNotificationPanel;

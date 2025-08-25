import React, { useState } from "react";
import { Card, Space, Tag, List } from "antd";
import { ExclamationCircleOutlined, BugOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectLatestAlerts,
  actionUpdateAnalysisAction,
} from "@/store/dashboardSlice";
import useScreenWidth from "@/hooks/useScreenWidth";
import BulkActionModal from "@/app/pages/Analyze/action/BulkActionModal";

interface LatestAlertCardProps {
  loading: boolean;
}

const LatestAlertCard: React.FC<LatestAlertCardProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const latestAlerts = useAppSelector(selectLatestAlerts);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedAlertId, setSelectedAlertId] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const isScreenWidth = useScreenWidth();
  const isMobile = isScreenWidth.isMobile || isScreenWidth.isTablet;
  const processStatusOptions = [
    { label: "Pending", value: "pending" },
    { label: "No Action", value: "no_action" },
    { label: "Quarantine", value: "quarantine" },
    { label: "Delete", value: "delete" },
  ];

  const handleProcessStatusChange = (value: string, alertId: string) => {
    const alert = latestAlerts.find((a) => a.id === alertId);
    setSelectedAlertId(alertId);
    setSelectedAction(value);
    setSelectedItems(
      alert
        ? [
            {
              file_name: alert.file_name,
              server_ip: alert.client_server_ip,
            },
          ]
        : []
    );
    setShowActionModal(true);
  };

  const handleActionConfirm = async (action: string, memo: string) => {
    dispatch(
      actionUpdateAnalysisAction({
        id: selectedAlertId,
        process_status: action,
        comments: memo,
      })
    );
    setShowActionModal(false);
    setSelectedAction("");
    setSelectedAlertId("");
    setSelectedItems([]);
  };

  const handleActionCancel = () => {
    setShowActionModal(false);
    setSelectedAction("");
    setSelectedAlertId("");
    setSelectedItems([]);
  };

  const handleAlertClick = () => {
    console.log("Navigate to Analysis Detection page");
  };

  const getRiskIcon = (malwareStatus: string) => {
    const color = malwareStatus === "malware" ? "#ff4d4f" : "#fa8c16";
    return <ExclamationCircleOutlined style={{ color, fontSize: "16px" }} />;
  };

  const getMalwareIcon = (malwareStatus: string) => {
    const color = malwareStatus === "malware" ? "#ff4d4f" : "#fa8c16";
    return <BugOutlined style={{ color, fontSize: "16px" }} />;
  };

  const getRiskTag = (risk: string) => {
    const color =
      risk === "High" ? "red" : risk === "Medium" ? "orange" : "green";
    return <Tag color={color}>{risk}</Tag>;
  };

  const getMalwareStatusTag = (status: string) => {
    const color = status === "malware" ? "red" : "orange";
    return <Tag color={color}>{status}</Tag>;
  };
  const isActionDisabled = (processStatus: string) => {
    return ["no_action", "quarantine", "delete"].includes(processStatus);
  };

  if (!latestAlerts || latestAlerts.length === 0) {
    return (
      <Card loading={loading} title="Latest Alerts">
        <div className="text-center text-gray-500">No alerts available</div>
      </Card>
    );
  }

  return (
    <>
      <Card
        loading={loading}
        title={`Latest Alerts`}
        className="latest-alert-card"
      >
        <List
          dataSource={latestAlerts}
          renderItem={(alert) => (
            <List.Item className={`${isMobile ? "overflow-x-auto" : ""} px-4`}>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg w-full">
                <div className="flex-shrink-0">
                  {getRiskIcon(alert.malware_status)}
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={handleAlertClick}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                  >
                    Alert / 알림명
                  </button>
                </div>

                <div className="flex-shrink-0">
                  {getMalwareIcon(alert.malware_status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {alert.file_name} | {alert.client_server_ip}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Space>
                    {getRiskTag(alert.risk)}
                    {getMalwareStatusTag(alert.malware_status)}
                  </Space>
                </div>

                <div className="flex-shrink-0 w-32">
                  <Select
                    value={alert.process_status}
                    onChange={(value) =>
                      handleProcessStatusChange(value, alert.id)
                    }
                    placeholder="조치 (actions ▾)"
                    options={processStatusOptions}
                    size="small"
                    disabled={isActionDisabled(alert.process_status)}
                    className="w-full"
                  />
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <BulkActionModal
        visible={showActionModal}
        action={selectedAction}
        selectedCount={selectedItems.length}
        selectedItems={selectedItems}
        onConfirm={handleActionConfirm}
        onCancel={handleActionCancel}
      />
    </>
  );
};

export default LatestAlertCard;

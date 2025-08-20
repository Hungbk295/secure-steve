import React, { useState } from "react";
import { Card, Space, Tag, Modal, Input, List } from "antd";
import { ExclamationCircleOutlined, BugOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectLatestAlerts,
  actionUpdateAnalysisAction,
} from "@/store/dashboardSlice";
import useScreenWidth from "@/hooks/useScreenWidth";

interface LatestAlertCardProps {
  loading: boolean;
}

const LatestAlertCard: React.FC<LatestAlertCardProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const latestAlerts = useAppSelector(selectLatestAlerts);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteComments, setDeleteComments] = useState("");
  const [selectedAlertId, setSelectedAlertId] = useState<string>("");
  const isScreenWidth = useScreenWidth();
  const isMobile = isScreenWidth.isMobile || isScreenWidth.isTablet;
  const processStatusOptions = [
    { label: "Pending", value: "pending" },
    { label: "No Action", value: "no_action" },
    { label: "Quarantine", value: "quarantine" },
    { label: "Delete", value: "delete" },
  ];

  const handleProcessStatusChange = (value: string, alertId: string) => {
    if (value === "delete") {
      setSelectedAlertId(alertId);
      setDeleteModalVisible(true);
    } else {
      dispatch(
        actionUpdateAnalysisAction({
          id: alertId,
          process_status: value,
          comments: "",
        })
      );
    }
  };

  const handleDeleteConfirm = () => {
    dispatch(
      actionUpdateAnalysisAction({
        id: selectedAlertId,
        process_status: "delete",
        comments: deleteComments,
      })
    );
    setDeleteModalVisible(false);
    setDeleteComments("");
    setSelectedAlertId("");
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeleteComments("");
    setSelectedAlertId("");
  };

  const handleAlertClick = () => {
    console.log("Navigate to Analysis Detection page");
    // TODO: Navigate to ANALYSIS Detection list page
    // navigate('/analysis/detection');
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

  // const formatDateTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString("ko-KR", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

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
                {/* Risk Icon */}
                <div className="flex-shrink-0">
                  {getRiskIcon(alert.malware_status)}
                </div>

                {/* Alert Name - Clickable */}
                <div className="flex-shrink-0">
                  <button
                    onClick={handleAlertClick}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                  >
                    Alert / 알림명
                  </button>
                </div>

                {/* Malware Icon */}
                <div className="flex-shrink-0">
                  {getMalwareIcon(alert.malware_status)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {alert.file_name} | {alert.client_server_ip}
                  </div>
                </div>

                {/* Risk and Status */}
                <div className="flex-shrink-0">
                  <Space>
                    {getRiskTag(alert.risk)}
                    {getMalwareStatusTag(alert.malware_status)}
                  </Space>
                </div>

                {/* Timestamps */}
                {/* <div className="flex-shrink-0 text-right">
                  <div className="text-xs text-gray-500">
                    Created: {formatDateTime(alert.file_created_at)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Analyzed: {formatDateTime(alert.analysis_time)}
                  </div>
                </div> */}

                {/* Actions Dropdown */}
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

      {/* Delete Confirmation Modal */}
      <Modal
        title="파일 삭제 확인"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="확인"
        cancelText="취소"
        width={400}
      >
        <div className="space-y-4">
          <p>파일명을 서버IP에서 삭제 하시겠습니까?</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모 (선택사항)
            </label>
            <Input.TextArea
              value={deleteComments}
              onChange={(e) => setDeleteComments(e.target.value)}
              placeholder="삭제 사유를 입력하세요..."
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LatestAlertCard;

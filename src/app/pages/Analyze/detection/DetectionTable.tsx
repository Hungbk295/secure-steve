import React, { useEffect, useState } from "react";
import { Tag, message, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  actionGetDetectionList,
  selectDetectionItems,
  selectDetectionLoading,
  actionUpdateProcessStatus,
  actionUpdateFilePolicy,
} from "@/store/detectionSlice";
import { openModal } from "@/store/alertDetailSlice";
import {
  getVerdictColor,
  getRiskBadgeColor,
  getTimeDisplay,
  canChangeProcessStatus,
  PROCESS_STATUS_OPTIONS,
  EXCEPTION_OPTIONS,
} from "@/constants/detectionConstants";
import AlertDetailModal from "./AlertDetailModal";
import ProcessActionModal from "./ProcessActionModal";
import ExceptionModal from "./ExceptionModal";
import useScreenWidth from "@/hooks/useScreenWidth";
import Select from "../../../components/common/Select";
import Table from "../../../components/common/Table";

interface DetectionItem {
  id: number;
  time: string;
  file_name: string;
  risk: string;
  verdict: string;
  server_ip: string;
  process_status: string;
  exception: string;
}

interface DetectionTableProps {
  filters: any;
  loading: boolean;
}

const DetectionTable: React.FC<DetectionTableProps> = ({
  filters,
  loading: externalLoading,
}) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectDetectionItems);
  const internalLoading = useAppSelector(selectDetectionLoading);

  const loading = externalLoading || internalLoading;

  const [selectedAlert, setSelectedAlert] = useState<DetectionItem | null>(
    null
  );
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [exceptionModalVisible, setExceptionModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedExceptionType, setSelectedExceptionType] =
    useState<string>("");
  const [updatingRows, setUpdatingRows] = useState<Set<number>>(new Set());

  const { isDesktop } = useScreenWidth();

  useEffect(() => {
    if (data.length === 0) {
      dispatch(actionGetDetectionList(filters));
    }
  }, [dispatch, data.length, filters]);

  const handleFileNameClick = (record: DetectionItem) => {
    dispatch(openModal(record.id));
  };

  const handleProcessStatusChange = (
    record: DetectionItem,
    newStatus: string
  ) => {
    if (!canChangeProcessStatus(record.process_status)) {
      message.warning("Only pending alerts can be processed");
      return;
    }

    setSelectedAlert(record);
    setSelectedAction(newStatus);
    setActionModalVisible(true);
  };

  const handleExceptionChange = (
    record: DetectionItem,
    exceptionType: string
  ) => {
    if (exceptionType === "none") {
      handleUpdateException(record, exceptionType);
      return;
    }

    setSelectedAlert(record);
    setSelectedExceptionType(exceptionType);
    setExceptionModalVisible(true);
  };

  const handleProcessActionConfirm = async (
    alertId: number,
    action: string,
    memo: string
  ) => {
    setUpdatingRows((prev) => new Set(prev).add(alertId));

    try {
      await dispatch(
        actionUpdateProcessStatus({
          id: alertId,
          processStatus: action as any,
          userId: "current_user", // TODO: Get from auth state
          comments: memo,
        })
      ).unwrap();

      message.success(`Alert ${action} successfully`);
      setActionModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to process alert");
    } finally {
      setUpdatingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const handleUpdateException = async (
    record: DetectionItem,
    exceptionType: string,
    actionType?: string,
    memo?: string
  ) => {
    setUpdatingRows((prev) => new Set(prev).add(record.id));

    try {
      if (exceptionType === "none") {
        message.success("Exception cleared successfully");
        setExceptionModalVisible(false);
      } else {
        await dispatch(
          actionUpdateFilePolicy({
            analysisRequestId: record.id,
            filePolicy: exceptionType as "blacklist" | "whitelist",
            actionType: actionType as "delete" | "quarantine" | undefined,
            comments: memo,
          })
        ).unwrap();

        message.success(`Exception ${exceptionType} applied successfully`);
        setExceptionModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to update exception");
    } finally {
      setUpdatingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(record.id);
        return newSet;
      });
    }
  };

  const columns: ColumnsType<DetectionItem> = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 180,
      sorter: true,
      render: (time: string) => {
        const { local, iso } = getTimeDisplay(time);
        return (
          <Tooltip title={`ISO: ${iso}`}>
            <span className="text-sm font-mono">{local}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
      width: 200,
      sorter: true,
      render: (fileName: string, record: DetectionItem) => (
        <Tooltip title={fileName}>
          <button
            onClick={() => handleFileNameClick(record)}
            className="text-blue-600 hover:text-blue-800 hover:underline text-left text-sm max-w-[180px] truncate block"
          >
            {fileName}
          </button>
        </Tooltip>
      ),
    },
    {
      title: "Risk",
      dataIndex: "risk",
      key: "risk",
      width: 120,
      sorter: true,
      render: (risk: string) => (
        <Tag
          className={`${getRiskBadgeColor(risk)} border font-medium text-xs`}
        >
          {risk}
        </Tag>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      key: "verdict",
      width: 120,
      filters: [
        { text: "Malware", value: "Malware" },
        { text: "Benign", value: "Benign" },
        { text: "Suspicious", value: "Suspicious" },
        { text: "Unknown", value: "Unknown" },
      ],
      render: (verdict: string) => (
        <Tag
          className={`${getVerdictColor(verdict)} border font-medium text-xs`}
        >
          {verdict}
        </Tag>
      ),
    },
    {
      title: "Server IP",
      dataIndex: "server_ip",
      key: "server_ip",
      width: 140,
      render: (ip: string) => (
        <Tooltip title="Reverse DNS lookup (feature pending)">
          <span className="font-mono text-sm">{ip}</span>
        </Tooltip>
      ),
    },
    {
      title: "Process Status",
      dataIndex: "process_status",
      key: "process_status",
      width: 150,
      filters: PROCESS_STATUS_OPTIONS.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      render: (status: string, record: DetectionItem) => {
        const isUpdating = updatingRows.has(record.id);
        const canChange = canChangeProcessStatus(status);

        return (
          <Select
            value={status}
            size="small"
            className="w-full"
            disabled={!canChange || isUpdating}
            loading={isUpdating}
            options={PROCESS_STATUS_OPTIONS}
            onChange={(value) => handleProcessStatusChange(record, value)}
            placeholder="Select action"
          />
        );
      },
    },
    {
      title: "Exception",
      dataIndex: "exception",
      key: "exception",
      width: 130,
      render: (exception: string, record: DetectionItem) => {
        const isUpdating = updatingRows.has(record.id);

        return (
          <Select
            value={exception}
            size="small"
            className="w-full"
            loading={isUpdating}
            disabled={isUpdating}
            options={EXCEPTION_OPTIONS}
            onChange={(value) => handleExceptionChange(record, value)}
          />
        );
      },
    },
  ];

  const getColumns = () => {
    if (isDesktop) {
      return columns;
    }

    return columns.filter(
      (_, index) => index !== 4 && index !== 5 && index !== 6
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table
        columns={getColumns()}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: isDesktop ? 1200 : 800 }}
        expandable={
          !isDesktop
            ? {
                expandedRowRender: (record: DetectionItem) => (
                  <div className="bg-gray-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Server IP:
                      </span>
                      <span className="font-mono text-sm">
                        {record.server_ip}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Process Status:
                      </span>
                      <span className="font-mono text-sm">
                        <Select
                          value={record.process_status}
                          size="small"
                          className="w-32"
                          options={PROCESS_STATUS_OPTIONS}
                          onChange={(value) =>
                            handleProcessStatusChange(record, value)
                          }
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Exception:
                      </span>
                      <Select
                        value={record.exception}
                        size="small"
                        className="w-32"
                        options={EXCEPTION_OPTIONS}
                        onChange={(value) =>
                          handleExceptionChange(record, value)
                        }
                        loading={updatingRows.has(record.id)}
                        disabled={updatingRows.has(record.id)}
                      />
                    </div>
                  </div>
                ),
                rowExpandable: () => !isDesktop,
                columnTitle: "Details",
              }
            : undefined
        }
      />

      <ProcessActionModal
        visible={actionModalVisible}
        onCancel={() => setActionModalVisible(false)}
        onConfirm={handleProcessActionConfirm}
        alert={selectedAlert}
        action={selectedAction}
      />

      <ExceptionModal
        visible={exceptionModalVisible}
        onCancel={() => setExceptionModalVisible(false)}
        onConfirm={handleUpdateException}
        alert={selectedAlert}
        exceptionType={selectedExceptionType}
      />

      <AlertDetailModal />
    </div>
  );
};

export default DetectionTable;

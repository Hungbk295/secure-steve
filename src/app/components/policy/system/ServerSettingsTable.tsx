import React, { useEffect, useMemo } from "react";
import { Button, Card, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSettingServerPolicyServers,
  selectSettingServerPolicyLoading,
  selectSettingServerPolicySelectedRowKeys,
  setSelectedRowKeys,
  selectSettingServerPolicyHoldServersLoading,
  selectSettingServerPolicyScanSettingsLoading,
  selectSettingServerPolicyQuarantineFolderLoading,
} from "@/store/settingServerPolicySlice";
import Table from "../../common/Table";
import ServerSettingsFilterBar from "./ServerSettingsFilterBar";

interface ServerSettingsItem {
  key: string;
  server_id: string;
  server_ip: string;
  comm_status: string;
  mgmt_name: string;
  priority: string;
  last_scan_at: string;
  realtime: boolean;
  scheduled: boolean;
}

interface ServerSettingsTableProps {
  loading: boolean;
  onActionButtonsRender?: (actionButtons: React.ReactNode) => void;
  onHoldServers?: () => void;
  onScanSettings?: () => void;
  onQuarantineFolder?: () => void;
}

const ServerSettingsTable: React.FC<ServerSettingsTableProps> = ({
  loading: externalLoading,
  onActionButtonsRender,
  onHoldServers,
  onScanSettings,
  onQuarantineFolder,
}) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectSettingServerPolicyServers);
  const loading = useAppSelector(selectSettingServerPolicyLoading) || externalLoading;
  const selectedRowKeys = useAppSelector(selectSettingServerPolicySelectedRowKeys);
  const holdServersLoading = useAppSelector(selectSettingServerPolicyHoldServersLoading);
  const scanSettingsLoading = useAppSelector(selectSettingServerPolicyScanSettingsLoading);
  const quarantineFolderLoading = useAppSelector(selectSettingServerPolicyQuarantineFolderLoading);

  const hasSelectedItems = selectedRowKeys.length > 0;

  const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
    dispatch(setSelectedRowKeys(selectedKeys as string[]));
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} | ${hours}:${minutes}`;
  };

  // Get communication status color
  const getCommStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-100 text-green-800 border-green-200";
      case "Offline":
        return "bg-red-100 text-red-800 border-red-200";
      case "Unknown":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Held":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "최상":
        return "bg-red-100 text-red-800 border-red-200";
      case "높음":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "보통":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "낮음":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const columns: ColumnsType<ServerSettingsItem> = [
    {
      title: "Server IP",
      dataIndex: "server_ip",
      key: "server_ip",
      width: 150,
      sorter: true,
      render: (ip: string) => <span className="font-mono text-sm">{ip}</span>,
    },
    {
      title: "Cluster Name",
      dataIndex: "mgmt_name",
      key: "mgmt_name",
      width: 150,
      sorter: true,
      render: (name: string) => (
        <span className="text-sm">{name}</span>
      ),
    },
    {
      title: "Server Manager",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority: string) => (
        <Tag
          className={`${getPriorityColor(priority)} border font-medium text-xs`}
        >
          {priority}
        </Tag>
      ),
    },
    {
      title: "Setting Type",
      key: "setting_type",
      width: 150,
      render: (_, record: ServerSettingsItem) => (
        <div className="space-y-1">
          <Tag
            className={`${
              record.realtime
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            } border font-medium text-xs`}
          >
            {record.realtime ? "Realtime" : "Manual"}
          </Tag>
          <Tag
            className={`${
              record.scheduled
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            } border font-medium text-xs`}
          >
            {record.scheduled ? "Scheduled" : "On-Demand"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Setting Value",
      dataIndex: "comm_status",
      key: "comm_status",
      width: 120,
      render: (status: string) => (
        <Tag
          className={`${getCommStatusColor(status)} border font-medium text-xs`}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "last_scan_at",
      key: "last_scan_at",
      width: 200,
      sorter: true,
      render: (dateTime: string) => (
        <span className="text-sm font-mono">{formatDateTime(dateTime)}</span>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
    getCheckboxProps: (record: ServerSettingsItem) => ({
      disabled: loading,
      name: record.server_id,
    }),
  };

  const actionButtons = useMemo(
    () => (
      <div className="flex items-center gap-2 justify-end">
        <Button
          disabled={!hasSelectedItems}
          loading={holdServersLoading}
          onClick={onHoldServers}
        >
          보류 (Hold)
        </Button>
        <Button
          type="primary"
          disabled={!hasSelectedItems}
          loading={scanSettingsLoading}
          onClick={onScanSettings}
        >
          Scan 설정 (Scan Settings)
        </Button>
        <Button
          disabled={!hasSelectedItems}
          loading={quarantineFolderLoading}
          onClick={onQuarantineFolder}
        >
          격리 폴더 설정 (Quarantine Folder Settings)
        </Button>
      </div>
    ),
    [
      hasSelectedItems,
      holdServersLoading,
      scanSettingsLoading,
      quarantineFolderLoading,
      onHoldServers,
      onScanSettings,
      onQuarantineFolder,
    ]
  );

  useEffect(() => {
    if (onActionButtonsRender) {
      onActionButtonsRender(actionButtons);
    }
  }, [onActionButtonsRender, actionButtons]);

  return (
    <div className="flex flex-col gap-4">
      <Card
        size="small"
        className="server-settings-filter-bar"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-100)",
          borderRadius: "8px",
        }}
      >
        <ServerSettingsFilterBar loading={loading} />
      </Card>
      <div className="server-settings-table-container">
        <div className="mb-1 flex justify-end mr-3">{actionButtons}</div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{ x: 900 }}
          rowSelection={rowSelection}
          rowKey="server_id"
        />
      </div>
    </div>
  );
};

export default ServerSettingsTable;
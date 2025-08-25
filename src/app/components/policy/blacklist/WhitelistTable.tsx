import React from "react";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectWhitelistItems,
  selectBlacklistSelectedRowKeys,
  setSelectedRowKeys,
} from "@/store/blacklistSlice";
import {
  getVerdictColor,
  getRiskBadgeColor,
} from "@/constants/detectionConstants";
import Table from "../../common/Table";

interface WhitelistItem {
  id: string;
  time: string;
  file_name: string;
  file_hash: string;
  risk: number;
  verdict: string;
  server_ip: string;
  policy: string;
  list_status: string;
  actioned_by: string;
  process_status?: string;
  comments?: string;
}

interface WhitelistTableProps {
  loading: boolean;
}

const WhitelistTable: React.FC<WhitelistTableProps> = ({
  loading,
}) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectWhitelistItems);
  const selectedRowKeys = useAppSelector(selectBlacklistSelectedRowKeys);

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

  // Get list status color
  const getListStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Re-check":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "None":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get process status color
  const getProcessStatusColor = (status?: string) => {
    switch (status) {
      case "delete":
        return "bg-red-100 text-red-800 border-red-200";
      case "quarantine":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "no_action":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProcessStatusText = (status?: string) => {
    switch (status) {
      case "delete":
        return "Delete";
      case "quarantine":
        return "Quarantine";
      case "no_action":
        return "No Action";
      case "pending":
        return "Pending";
      default:
        return status || "Unknown";
    }
  };

  const columns: ColumnsType<WhitelistItem> = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 180,
      sorter: true,
      render: (time: string) => (
        <span className="text-sm font-mono">{formatDateTime(time)}</span>
      ),
    },
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
      width: 200,
      sorter: true,
      render: (fileName: string) => (
        <span className="text-sm font-medium text-gray-900 max-w-[180px] truncate block">
          {fileName}
        </span>
      ),
    },
    {
      title: "Risk",
      dataIndex: "risk",
      key: "risk",
      width: 100,
      sorter: true,
      render: (risk: number) => (
        <Tag
          className={`${getRiskBadgeColor(`${risk}%`)} border font-medium text-xs`}
        >
          {risk}%
        </Tag>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      key: "verdict",
      width: 120,
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
      render: (ip: string) => <span className="font-mono text-sm">{ip}</span>,
    },
    {
      title: "List Status",
      dataIndex: "list_status",
      key: "list_status",
      width: 120,
      render: (status: string) => (
        <Tag
          className={`${getListStatusColor(status)} border font-medium text-xs`}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Process Status",
      dataIndex: "process_status",
      key: "process_status",
      width: 130,
      render: (status: string) => (
        <Tag
          className={`${getProcessStatusColor(status)} border font-medium text-xs`}
        >
          {getProcessStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Actioned by",
      dataIndex: "actioned_by",
      key: "actioned_by",
      width: 120,
      render: (actionedBy: string) => (
        <span className="text-sm">{actionedBy}</span>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
    getCheckboxProps: (record: WhitelistItem) => ({
      disabled: loading,
      name: record.id,
    }),
  };

  return (
    <div className="whitelist-table-container p-4">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
        rowSelection={rowSelection}
        rowKey="id"
      />
    </div>
  );
};

export default WhitelistTable;
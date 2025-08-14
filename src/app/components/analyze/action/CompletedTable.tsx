import React, { useEffect, useMemo } from "react";
import { Tag, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import {
  getVerdictColor,
  getRiskBadgeColor,
} from "@/constants/detectionConstants";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectCompleteItems,
  selectCompleteLoading,
  selectCompleteCSVLoading,
  actionExportCompletedCSV,
} from "@/store/completeSlice";
import { openModal } from "@/store/alertDetailSlice";
import Table from "../../common/Table";

interface CompletedItem {
  key: string;
  time: string;
  file_name: string;
  risk: string;
  verdict: string;
  server_ip: string;
  process_status: string;
  actioned_by: string;
}

interface CompletedTableProps {
  loading: boolean;
  onCSVDownloadRender?: (csvButton: React.ReactNode) => void;
}

const CompletedTable: React.FC<CompletedTableProps> = ({
  loading: externalLoading,
  onCSVDownloadRender,
}) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectCompleteItems);
  const loading = useAppSelector(selectCompleteLoading) || externalLoading;
  const csvLoading = useAppSelector(selectCompleteCSVLoading);

  const handleFileNameClick = (record: CompletedItem) => {
    dispatch(openModal(record.key));
  };

  const handleCSVExport = async () => {
    try {
      const result = await dispatch(actionExportCompletedCSV()).unwrap();

      const link = document.createElement("a");
      link.href = result.csvData;
      link.download = result.filename;
      link.click();

      message.success("CSV exported successfully");
    } catch (error) {
      message.error("Failed to export CSV");
      console.error("CSV export failed:", error);
    }
  };

  // Get process status color
  const getProcessStatusColor = (status: string) => {
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

  const getProcessStatusText = (status: string) => {
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
        return status;
    }
  };

  const columns: ColumnsType<CompletedItem> = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 180,
      sorter: true,
      render: (time: string) => (
        <span className="text-sm font-mono">{time}</span>
      ),
    },
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
      width: 200,
      sorter: true,
      render: (fileName: string, record: CompletedItem) => (
        <button
          onClick={() => handleFileNameClick(record)}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left text-sm max-w-[180px] truncate block"
        >
          {fileName}
        </button>
      ),
    },
    {
      title: "Risk",
      dataIndex: "risk",
      key: "risk",
      width: 100,
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
      title: "Process Status",
      dataIndex: "process_status",
      key: "process_status",
      width: 130,
      render: (status: string) => (
        <Tag
          className={`${getProcessStatusColor(
            status
          )} border font-medium text-xs`}
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

  const csvDownloadButton = useMemo(
    () => (
      <Button
        icon={<DownloadOutlined />}
        loading={csvLoading}
        onClick={handleCSVExport}
        size="middle"
      >
        CSV 다운로드 (CSV Download)
      </Button>
    ),
    [csvLoading]
  );

  useEffect(() => {
    if (onCSVDownloadRender) {
      onCSVDownloadRender(csvDownloadButton);
    }
  }, [onCSVDownloadRender, csvDownloadButton]);

  return (
    <div className="completed-table-container">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default CompletedTable;

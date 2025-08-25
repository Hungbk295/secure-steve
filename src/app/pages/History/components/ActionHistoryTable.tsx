import { useState } from "react";
import { Typography, Tag } from "antd";
import Table from "@/app/components/common/Table";
import { DynamicKeyObject } from "@/interfaces/app";
import { ActionHistoryItem } from "@/interfaces/history";

const { Text, Link } = Typography;

interface ActionHistoryTableProps {
  loading?: boolean;
  onCSVDownloadRender?: (csvButton: React.ReactNode) => void;
}

const mockActionHistoryData: ActionHistoryItem[] = [
  {
    id: "req_abc123",
    time: "2025-06-16 23:23:00",
    file_name: "malware.exe",
    risk: 99.5,
    verdict: "Malware",
    server_ip: "66.211.75.1",
    process_status: "delete",
    actioned_by: "홍길동",
  },
  {
    id: "req_def456",
    time: "2025-06-16 22:15:00",
    file_name: "suspicious.dll",
    risk: 75.2,
    verdict: "Suspicious",
    server_ip: "66.211.75.2",
    process_status: "quarantine",
    actioned_by: "김철수",
  },
  {
    id: "req_ghi789",
    time: "2025-06-16 21:30:00",
    file_name: "benign.txt",
    risk: 15.8,
    verdict: "Benign",
    server_ip: "66.211.75.3",
    process_status: "no_action",
    actioned_by: "이영희",
  },
  {
    id: "req_jkl012",
    time: "2025-06-16 20:45:00",
    file_name: "pending.bin",
    risk: 60.3,
    verdict: "Unknown",
    server_ip: "66.211.75.4",
    process_status: "pending",
    actioned_by: "박민수",
  },
];

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

function ActionHistoryTable({ loading }: ActionHistoryTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [data] = useState(mockActionHistoryData);

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      sorter: true,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "File name",
      dataIndex: "file_name",
      key: "file_name",
      render: (text: string, record: DynamicKeyObject) => (
        <Link
          onClick={(e) => {
            e.stopPropagation();
            handleFileClick(record);
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Risk",
      dataIndex: "risk",
      key: "risk",
      render: (risk: number) => <Text>{risk.toFixed(1)}%</Text>,
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      key: "verdict",
      render: (verdict: string) => <Tag>{verdict}</Tag>,
    },
    {
      title: "Server IP",
      dataIndex: "server_ip",
      key: "server_ip",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Process Status",
      dataIndex: "process_status",
      key: "process_status",
      render: (status: string) => <Tag>{getProcessStatusText(status)}</Tag>,
    },
    {
      title: "Actioned by",
      dataIndex: "actioned_by",
      key: "actioned_by",
      render: (text: string) => <Text>{text}</Text>,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[]) => setSelectedRowKeys(keys),
  };

  const handleFileClick = (record: DynamicKeyObject) => {
    console.log("File clicked:", record);
  };

  const handleRowClick = (record: DynamicKeyObject) => {
    console.log("Action history row clicked:", record);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      rowSelection={rowSelection}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
        style: { cursor: "pointer" },
      })}
      showPagination={true}
      showPageSizeChanger={true}
      total={data.length}
    />
  );
}

export default ActionHistoryTable;

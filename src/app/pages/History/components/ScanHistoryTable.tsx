import { useState } from "react";
import { Typography, Tag } from "antd";
import Table from "@/app/components/common/Table";
import { DynamicKeyObject } from "@/interfaces/app";
import { ScanHistoryItem } from "@/interfaces/history";

const { Text } = Typography;

interface ScanHistoryTableProps {
  loading?: boolean;
  onCSVDownloadRender?: (csvButton: React.ReactNode) => void;
}

const mockScanHistoryData: ScanHistoryItem[] = [
  {
    id: "scan_2025-06-16T23:23Z_66.211.75.1",
    time: "2025-06-16 23:23:00",
    server_ip: "66.211.75.1",
    test_status: "Completed",
    test_type: "Total",
    detected_count: 3,
    total_count: 150,
    owner: "홍길동",
  },
  {
    id: "scan_2025-06-16T22:15Z_66.211.75.2",
    time: "2025-06-16 22:15:00",
    server_ip: "66.211.75.2",
    test_status: "Fail(Error)",
    test_type: "Streaming",
    detected_count: 0,
    total_count: 0,
    owner: "김철수",
  },
  {
    id: "scan_2025-06-16T21:30Z_66.211.75.3",
    time: "2025-06-16 21:30:00",
    server_ip: "66.211.75.3",
    test_status: "Completed",
    test_type: "Total",
    detected_count: 12,
    total_count: 245,
    owner: "이영희",
  },
];

function ScanHistoryTable({ loading }: ScanHistoryTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [data] = useState(mockScanHistoryData);

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      sorter: true,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Server IP",
      dataIndex: "server_ip",
      key: "server_ip",
      sorter: true,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Test Status",
      dataIndex: "test_status",
      key: "test_status",
      sorter: true,
      render: (status: string) => <Tag>{status}</Tag>,
    },
    {
      title: "Type",
      dataIndex: "test_type",
      key: "test_type",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Detection/Malware",
      key: "detection",
      render: (record: DynamicKeyObject) => (
        <Text>
          {record.detected_count}/{record.total_count}
        </Text>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (text: string) => <Text>{text}</Text>,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[]) => setSelectedRowKeys(keys),
  };


  const handleRowClick = (record: DynamicKeyObject) => {
    console.log("Scan job clicked:", record);
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

export default ScanHistoryTable;

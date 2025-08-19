import { useEffect, useState, useMemo } from "react";
import { Button, Typography, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Table from "@/app/components/common/Table";
import CustomExcelExport from "@/app/components/common/CustomExcelExport";
import { DynamicKeyObject } from "@/interfaces/app";
import { AILearningHistoryItem } from "@/interfaces/history";

const { Text } = Typography;

interface AILearningHistoryTableProps {
  loading?: boolean;
  onCSVDownloadRender?: (csvButton: React.ReactNode) => void;
}

const mockAILearningHistoryData: AILearningHistoryItem[] = [
  {
    id: "ai_learning_001",
    time: "16 June 25 | 23:23",
    model_version: "model_v250725",
    agent_release: "Completed",
  },
  {
    id: "ai_learning_002",
    time: "14 June 25 | 14:01",
    model_version: "model_v250713",
    agent_release: "Fail(Error)",
  },
  {
    id: "ai_learning_003",
    time: "10 June 25 | 09:45",
    model_version: "model_v250710",
    agent_release: "Completed",
  },
  {
    id: "ai_learning_004",
    time: "08 June 25 | 21:15",
    model_version: "model_v250708",
    agent_release: "Completed",
  },
  {
    id: "ai_learning_005",
    time: "05 June 25 | 16:55",
    model_version: "model_v250705",
    agent_release: "Fail(Error)",
  },
  {
    id: "ai_learning_006",
    time: "03 June 25 | 11:20",
    model_version: "model_v250703",
    agent_release: "Completed",
  },
];

const columns = [
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    sorter: true,
    render: (text: string) => <Text>{text}</Text>,
  },
  {
    title: "Model Version",
    dataIndex: "model_version",
    key: "model_version",
    sorter: true,
    render: (text: string) => <Text>{text}</Text>,
  },
  {
    title: "Agent Release",
    dataIndex: "agent_release",
    key: "agent_release",
    sorter: true,
    render: (status: string) => <Tag>{status}</Tag>,
  },
];

// const getAgentReleaseColor = (status: string) => {
//   switch (status) {
//     case "Completed":
//       return "green";
//     case "Fail(Error)":
//       return "red";
//     default:
//       return "default";
//   }
// };

function AILearningHistoryTable({
  loading,
  onCSVDownloadRender,
}: AILearningHistoryTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [data] = useState(mockAILearningHistoryData);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[]) => setSelectedRowKeys(keys),
  };

  const csvData = useMemo(() => {
    return selectedRowKeys.length > 0
      ? data.filter((item) => selectedRowKeys.includes(item.id))
      : data;
  }, [data, selectedRowKeys]);

  useEffect(() => {
    const csvButton = (
      <CustomExcelExport
        data={csvData}
        columns={columns}
        fileName="ai_learning_history"
      >
        <Button type="primary" icon={<DownloadOutlined />} disabled={loading}>
          CSV 다운로드
        </Button>
      </CustomExcelExport>
    );

    onCSVDownloadRender?.(csvButton);
  }, [csvData, loading, onCSVDownloadRender]);

  const handleRowClick = (record: DynamicKeyObject) => {
    console.log("AI Learning history clicked:", record);
    // Read-only screen - no action needed
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

export default AILearningHistoryTable;

import { Table, Checkbox, Tag } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";

export interface ServerData {
  id: string;
  serverIP: string;
  serverCluster: string;
  serverOwner: string;
  recentMalwareDetections: number;
  department?: string;
  lastDetectionDate?: string;
}

interface ServerTableProps {
  dataSource: ServerData[];
  selectedRowKeys: string[];
  onSelectChange: (
    selectedRowKeys: string[],
    selectedRows: ServerData[]
  ) => void;
  onMasterCheckboxChange: (checked: boolean) => void;
  onBulkSelectMenuClick: (action: "selectAll" | "selectNone") => void;
  loading?: boolean;
  pagination?: TableProps<ServerData>["pagination"];
  onChange?: TableProps<ServerData>["onChange"];
  className?: string;
}

function ServerTable({
  dataSource,
  selectedRowKeys,
  onSelectChange,
  onMasterCheckboxChange,
  onBulkSelectMenuClick,
  loading = false,
  pagination,
  onChange,
  className,
}: ServerTableProps) {
  const isAllSelected =
    selectedRowKeys.length === dataSource.length && dataSource.length > 0;
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length;

  const columns: ColumnsType<ServerData> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={(e) => {
              if (e.target.checked) {
                onBulkSelectMenuClick("selectAll");
              } else {
                onBulkSelectMenuClick("selectNone");
              }
              onMasterCheckboxChange(e.target.checked);
            }}
          />
        </div>
      ),
      key: "selection",
      width: 80,
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => {
            const newSelectedKeys = e.target.checked
              ? [...selectedRowKeys, record.id]
              : selectedRowKeys.filter((key) => key !== record.id);
            const newSelectedRows = dataSource.filter((item) =>
              newSelectedKeys.includes(item.id)
            );
            onSelectChange(newSelectedKeys, newSelectedRows);
          }}
        />
      ),
    },
    {
      title: "Server IP",
      dataIndex: "serverIP",
      key: "serverIP",
      width: 150,
      render: (ip: string) => <span className="font-mono text-sm">{ip}</span>,
    },
    {
      title: "ServerCluster",
      dataIndex: "serverCluster",
      key: "serverCluster",
      width: 150,
      render: (cluster: string) => <Tag color="blue">{cluster}</Tag>,
    },
    {
      title: "Server Owner",
      dataIndex: "serverOwner",
      key: "serverOwner",
      width: 150,
      render: (owner: string, record) => (
        <div>
          <div className="font-medium">{owner}</div>
          {record.department && (
            <div className="text-xs text-gray-500">{record.department}</div>
          )}
        </div>
      ),
    },
    {
      title: "Recent Malware Detections",
      dataIndex: "recentMalwareDetections",
      key: "recentMalwareDetections",
      width: 200,
      render: (count: number, record) => (
        <div>
          <span
            className={`font-semibold ${
              count > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {count}
          </span>
          {record.lastDetectionDate && count > 0 && (
            <div className="text-xs text-gray-500">
              Last: {record.lastDetectionDate}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={`server-table ${className || ""}`}>
      <Table<ServerData>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        size="middle"
        scroll={{ x: 800 }}
        className="border border-gray-200 rounded-lg"
      />
    </div>
  );
}

export default ServerTable;

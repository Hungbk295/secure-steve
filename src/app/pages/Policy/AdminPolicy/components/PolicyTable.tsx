import { Typography } from "antd";
import Table from "@/app/components/common/Table";
import { PolicyItem } from "@/interfaces/policy";

const { Text } = Typography;

interface PolicyTableProps {
  data: PolicyItem[];
  loading?: boolean;
  selectedRowKeys: string[];
  onSelectionChange: (keys: string[]) => void;
}

const mockPolicyData: PolicyItem[] = [
  {
    id: "policy_001",
    cluster_name: "Production-Cluster-A",
    server_manager: "김철수|개발팀",
    department: "개발팀",
    malware_definition_ref: 70,
    malware_definition_user: 75,
    isolation_ref: 90,
    isolation_user: 95,
    report_ref: 70,
    report_user: 80,
    regular_report_ref: 80,
    regular_report_user: 85,
  },
  {
    id: "policy_002", 
    cluster_name: "Development-Cluster-B",
    server_manager: "이영희|보안팀",
    department: "보안팀",
    malware_definition_ref: 70,
    malware_definition_user: 70,
    isolation_ref: 90,
    isolation_user: 90,
    report_ref: 70,
    report_user: 70,
    regular_report_ref: 80,
    regular_report_user: 80,
  },
  {
    id: "policy_003",
    cluster_name: "Testing-Cluster-C", 
    server_manager: "박민수|운영팀",
    department: "운영팀",
    malware_definition_ref: 70,
    malware_definition_user: 80,
    isolation_ref: 90,
    isolation_user: 100,
    report_ref: 70,
    report_user: 75,
    regular_report_ref: 80,
    regular_report_user: 90,
  },
  {
    id: "policy_004",
    cluster_name: "Security-Cluster-D",
    server_manager: "최지연|인프라팀", 
    department: "인프라팀",
    malware_definition_ref: 70,
    malware_definition_user: 85,
    isolation_ref: 90,
    isolation_user: 95,
    report_ref: 70,
    report_user: 85,
    regular_report_ref: 80,
    regular_report_user: 95,
  },
];

function PolicyTable({ 
  data = mockPolicyData, 
  loading, 
  selectedRowKeys, 
  onSelectionChange 
}: PolicyTableProps) {
  
  const columns = [
    {
      title: "Cluster Name",
      dataIndex: "cluster_name", 
      key: "cluster_name",
      sorter: true,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Server Manager",
      dataIndex: "server_manager",
      key: "server_manager", 
      sorter: true,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Malware Definition",
      key: "malware_definition",
      render: (record: PolicyItem) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            Ref: {record.malware_definition_ref}%
          </div>
          <div className="font-medium">
            User: {record.malware_definition_user}%
          </div>
        </div>
      ),
    },
    {
      title: "Isolation",
      key: "isolation",
      render: (record: PolicyItem) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            Ref: {record.isolation_ref}%
          </div>
          <div className="font-medium">
            User: {record.isolation_user}%
          </div>
        </div>
      ),
    },
    {
      title: "Report", 
      key: "report",
      render: (record: PolicyItem) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            Ref: {record.report_ref}%
          </div>
          <div className="font-medium">
            User: {record.report_user}%
          </div>
        </div>
      ),
    },
    {
      title: "Regular Report",
      key: "regular_report", 
      render: (record: PolicyItem) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            Ref: {record.regular_report_ref}%
          </div>
          <div className="font-medium">
            User: {record.regular_report_user}%
          </div>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[]) => onSelectionChange(keys),
    getCheckboxProps: (record: PolicyItem) => ({
      name: record.cluster_name,
    }),
  };

  const handleRowClick = (record: PolicyItem) => {
    console.log("Policy row clicked:", record);
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

export default PolicyTable;
import { Table, Typography, Progress, Checkbox, Alert } from "antd";
import { PolicyItem, SensitivityConfig } from "@/interfaces/policy";
import DraggableProgress from "./DraggableProgress";

const { Text, Title } = Typography;

interface SensitivityRangeTableProps {
  data: PolicyItem[];
  selectedRowKeys: string[];
  onSelectionChange: (keys: string[]) => void;
  onConfigChange: (id: string, config: Partial<SensitivityConfig>) => void;
  loading?: boolean;
}

// Constraint rules based on your specifications
const constraintRules = {
  isolation: {
    label: "Isolation (Quarantine)",
    referenceValue: 70,
    minValue: 70,
    description: "Users cannot quarantine malware with an accuracy lower than {critical accuracy}.",
  },
  report: {
    label: "Report (Notification)", 
    referenceValue: 80,
    minValue: 80,
    description: "Users will receive notifications with an accuracy less than {reference accuracy}.",
  },
  regular_report: {
    label: "Regular Report",
    referenceValue: 85,
    minValue: 85, 
    description: "In the regular report to the manager, greater than {criterion accuracy}. Provides detailed reports on malware of the same type.",
  }
};

function SensitivityRangeTable({ 
  data,
  selectedRowKeys, 
  onSelectionChange,
  onConfigChange,
  loading = false 
}: SensitivityRangeTableProps) {

  const handleProgressChange = (recordId: string, field: keyof SensitivityConfig, value: number) => {
    onConfigChange(recordId, { [field]: value });
  };


  const columns = [
    {
      title: "Selected",
      width: 80,
      render: (record: PolicyItem) => {
        const isSelected = selectedRowKeys.includes(record.id);
        return (
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              const newKeys = e.target.checked 
                ? [...selectedRowKeys, record.id]
                : selectedRowKeys.filter(key => key !== record.id);
              onSelectionChange(newKeys);
            }}
          />
        );
      },
    },
    {
      title: "Cluster / Manager",
      width: 200,
      render: (record: PolicyItem) => (
        <div>
          <div className="font-medium">{record.cluster_name}</div>
          <div className="text-xs text-gray-500">{record.server_manager}</div>
        </div>
      ),
    },
    {
      title: "Reference Accuracy",
      width: 180,
      children: [
        {
          title: "Isolation",
          width: 60,
          render: () => (
            <div className="text-center">
              <Progress
                type="circle"
                size={40}
                percent={constraintRules.isolation.referenceValue}
                showInfo={false}
                strokeColor="#52c41a"
              />
              <div className="text-xs mt-1">
                {constraintRules.isolation.referenceValue}%
              </div>
            </div>
          ),
        },
        {
          title: "Report", 
          width: 60,
          render: () => (
            <div className="text-center">
              <Progress
                type="circle"
                size={40}
                percent={constraintRules.report.referenceValue}
                showInfo={false}
                strokeColor="#52c41a"
              />
              <div className="text-xs mt-1">
                {constraintRules.report.referenceValue}%
              </div>
            </div>
          ),
        },
        {
          title: "Regular",
          width: 60,
          render: () => (
            <div className="text-center">
              <Progress
                type="circle"
                size={40}
                percent={constraintRules.regular_report.referenceValue}
                showInfo={false}
                strokeColor="#52c41a"
              />
              <div className="text-xs mt-1">
                {constraintRules.regular_report.referenceValue}%
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: "User Configurable Range",
      children: [
        {
          title: "Isolation",
          width: 120,
          render: (record: PolicyItem) => (
            <DraggableProgress
              value={record.isolation_user}
              minValue={constraintRules.isolation.minValue}
              onChange={(value) => handleProgressChange(record.id, 'isolation', value)}
              disabled={loading}
            />
          ),
        },
        {
          title: "Report",
          width: 120, 
          render: (record: PolicyItem) => (
            <DraggableProgress
              value={record.report_user}
              minValue={constraintRules.report.minValue}
              onChange={(value) => handleProgressChange(record.id, 'report', value)}
              disabled={loading}
            />
          ),
        },
        {
          title: "Regular Report",
          width: 120,
          render: (record: PolicyItem) => (
            <DraggableProgress
              value={record.regular_report_user}
              minValue={constraintRules.regular_report.minValue}
              onChange={(value) => handleProgressChange(record.id, 'regular_report', value)}
              disabled={loading}
            />
          ),
        },
      ],
    },
  ];

  const hasInvalidConfig = data.some(item => 
    selectedRowKeys.includes(item.id) && (
      item.isolation_user < constraintRules.isolation.minValue ||
      item.report_user < constraintRules.report.minValue ||
      item.regular_report_user < constraintRules.regular_report.minValue
    )
  );

  return (
    <div className="sensitivity-range-table">
      <div className="mb-4">
        <Title level={4}>Sensitivity Range Configuration</Title>
        <Text type="secondary">
          Configure sensitivity thresholds for each policy item. Drag the progress bars to adjust values.
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 800 }}
        size="middle"
        bordered
      />

      {/* Constraint Descriptions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <Title level={5} className="!mb-3">Configuration Constraints</Title>
        <div className="space-y-2 text-sm">
          {Object.entries(constraintRules).map(([key, rule]) => (
            <div key={key}>
              <Text>
                • <Text strong>{rule.label}</Text>: {rule.description.replace('{critical accuracy}', `${rule.minValue}%`).replace('{reference accuracy}', `${rule.minValue}%`).replace('{criterion accuracy}', `${rule.minValue}%`)}
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Alert */}
      {hasInvalidConfig && (
        <Alert
          message="Configuration Invalid"
          description="Some selected items have values below the minimum required thresholds. Please adjust the progress bars to meet the constraint requirements."
          type="error"
          showIcon
          className="mt-4"
        />
      )}
    </div>
  );
}

export default SensitivityRangeTable;
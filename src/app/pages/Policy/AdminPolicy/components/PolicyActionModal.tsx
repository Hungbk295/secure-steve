import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Typography, Alert } from "antd";
import { APIDescription } from "@/interfaces/policy";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface PolicyActionModalProps {
  visible: boolean;
  mode: "add" | "edit" | "api_select";
  selectedCount: number;
  onCancel: () => void;
  onSave: (data: any) => void;
  loading?: boolean;
}

const mockAPIs: APIDescription[] = [
  {
    id: "api_001",
    name: "Malware Detection API v2.1",
    description: "Advanced malware detection using AI/ML algorithms with real-time threat analysis capabilities. Supports multiple file formats and provides detailed threat intelligence reports.",
    parameters: ["file_hash", "scan_mode", "threat_level"]
  },
  {
    id: "api_002", 
    name: "Behavioral Analysis API v1.5",
    description: "Dynamic behavioral analysis system that monitors file execution patterns and identifies suspicious activities through sandbox environments.",
    parameters: ["execution_time", "behavior_pattern", "environment_type"]
  },
  {
    id: "api_003",
    name: "Signature-based Detection API v3.0", 
    description: "Traditional signature-based detection system with updated virus definitions and heuristic analysis capabilities for known threats.",
    parameters: ["signature_db", "heuristic_level", "update_frequency"]
  },
  {
    id: "api_004",
    name: "Cloud Threat Intelligence API v2.0",
    description: "Cloud-based threat intelligence service providing real-time updates on emerging threats and global security incidents.",
    parameters: ["threat_feed", "geo_location", "severity_filter"]
  }
];


function PolicyActionModal({
  visible,
  mode,
  selectedCount,
  onCancel,
  onSave,
  loading = false
}: PolicyActionModalProps) {
  const [form] = Form.useForm();
  const [selectedAPI, setSelectedAPI] = useState<APIDescription | null>(null);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setSelectedAPI(null);
    }
  }, [visible, form]);

  const handleAPIChange = (apiId: string) => {
    const api = mockAPIs.find(a => a.id === apiId);
    setSelectedAPI(api || null);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const saveData = {
        ...values,
        selected_api: selectedAPI,
        selected_count: selectedCount,
      };
      onSave(saveData);
    });
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return `Add Policy (${selectedCount} selected)`;
      case "edit":
        return `Edit Policy (${selectedCount} selected)`;
      case "api_select":
        return `Select API (${selectedCount} selected)`;
      default:
        return "Policy Action";
    }
  };

  const renderModalContent = () => {
    switch (mode) {
      case "add":
      case "edit":
        return (
          <div className="space-y-6">
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                label="Policy Name"
                name="policy_name"
                rules={[{ required: true, message: "Please enter policy name" }]}
              >
                <Input placeholder="Enter policy name" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Enter policy description" 
                />
              </Form.Item>

              <Form.Item
                label="Select API"
                name="api_id"
                rules={[{ required: true, message: "Please select an API" }]}
              >
                <Select 
                  placeholder="Choose an API"
                  onChange={handleAPIChange}
                >
                  {mockAPIs.map(api => (
                    <Option key={api.id} value={api.id}>
                      {api.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {selectedAPI && (
                <Alert
                  message="API Description"
                  description={selectedAPI.description}
                  type="info"
                  showIcon
                  className="mb-4"
                />
              )}
            </Form>

            <Alert
              message="Sensitivity Configuration"
              description="Sensitivity configuration will be handled in the main table after modal actions."
              type="info"
              className="mt-4"
            />
          </div>
        );

      case "api_select":
        return (
          <div className="space-y-6">
            <Alert
              message={`Selected Items: ${selectedCount}`}
              description="Choose an API to apply to the selected policy items"
              type="info"
              showIcon
            />

            <Form form={form} layout="vertical">
              <Form.Item
                label="Select API"
                name="api_id"
                rules={[{ required: true, message: "Please select an API" }]}
              >
                <Select 
                  placeholder="Choose an API"
                  onChange={handleAPIChange}
                  size="large"
                >
                  {mockAPIs.map(api => (
                    <Option key={api.id} value={api.id}>
                      <div className="py-2">
                        <div className="font-medium">{api.name}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {api.description}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>

            {selectedAPI && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Title level={5} className="!mb-2 !text-blue-800">
                  {selectedAPI.name}
                </Title>
                <Text className="text-blue-700">
                  {selectedAPI.description}
                </Text>
                {selectedAPI.parameters && (
                  <div className="mt-3">
                    <Text strong className="text-blue-800">Parameters: </Text>
                    <Text className="text-blue-700">
                      {selectedAPI.parameters.join(", ")}
                    </Text>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText={mode === "api_select" ? "Apply API" : "Save (완료)"}
      cancelText="Cancel"
      width={mode === "api_select" ? 600 : 800}
      confirmLoading={loading}
      okButtonProps={{
        disabled: loading
      }}
    >
      {renderModalContent()}
    </Modal>
  );
}

export default PolicyActionModal;
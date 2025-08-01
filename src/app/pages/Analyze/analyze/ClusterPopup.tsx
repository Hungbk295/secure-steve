import { useState, useEffect } from "react";
import { Form, Input, Checkbox, List, Typography, Alert } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import CustomModal from "@/app/components/common/CustomModal";
import { EModalMode } from "@/interfaces/app";

interface ClusterPopupProps {
  visible: boolean;
  selectedServerIPs: string[];
  onCancel: () => void;
  onConfirm: (clusterName: string, addToExisting: boolean) => void;
  onCheckDuplicate?: (clusterName: string) => Promise<boolean>;
  loading?: boolean;
}

function ClusterPopup({
  visible,
  selectedServerIPs,
  onCancel,
  onConfirm,
  onCheckDuplicate,
}: ClusterPopupProps) {
  const [form] = Form.useForm();
  const [clusterName, setClusterName] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    "success" | "error" | "warning" | ""
  >("");
  const [validationMessage, setValidationMessage] = useState("");
  const [clusterExists, setClusterExists] = useState(false);
  const [addToExisting, setAddToExisting] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setClusterName("");
      setValidationStatus("");
      setValidationMessage("");
      setClusterExists(false);
      setAddToExisting(false);
    }
  }, [visible, form]);

  // Handle cluster name validation on blur
  const handleClusterNameBlur = async () => {
    if (!clusterName.trim()) {
      setValidationStatus("");
      setValidationMessage("");
      setClusterExists(false);
      return;
    }

    if (onCheckDuplicate) {
      setIsValidating(true);
      try {
        const exists = await onCheckDuplicate(clusterName.trim());
        setClusterExists(exists);

        if (exists) {
          setValidationStatus("warning");
          setValidationMessage("Cluster name already exists");
        } else {
          setValidationStatus("success");
          setValidationMessage("Cluster name is available");
        }
      } catch (error) {
        console.error("Failed to check cluster name:", error);
        setValidationStatus("error");
        setValidationMessage("Failed to check cluster name");
        setClusterExists(false);
      } finally {
        setIsValidating(false);
      }
    }
  };

  // Handle form submission
  const handleOk = async () => {
    try {
      await form.validateFields();
      onConfirm(clusterName.trim(), addToExisting);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  // Get validation icon
  const getValidationIcon = () => {
    if (isValidating) return null;
    switch (validationStatus) {
      case "success":
        return <CheckCircleOutlined className="text-green-500" />;
      case "warning":
        return <ExclamationCircleOutlined className="text-orange-500" />;
      case "error":
        return <ExclamationCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <CustomModal
      title="ServerCluster Assignment"
      mode={EModalMode.MULTIPLE}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Assign"
      cancelText="Cancel"
      width={600}
      className="cluster-popup"
    >
      <div className="space-y-6">
        {/* Cluster Name Input */}
        <Form form={form} layout="vertical">
          <Form.Item
            label="Cluster Name"
            name="clusterName"
            rules={[
              { required: true, message: "Please enter cluster name" },
              { min: 2, message: "Cluster name must be at least 2 characters" },
              {
                max: 50,
                message: "Cluster name must not exceed 50 characters",
              },
            ]}
            validateStatus={validationStatus}
            help={validationMessage}
          >
            <Input
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
              onBlur={handleClusterNameBlur}
              placeholder="Enter cluster name"
              suffix={getValidationIcon()}
              size="large"
            />
          </Form.Item>
        </Form>

        {/* Add to Existing Cluster Checkbox */}
        {clusterExists && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <Checkbox
              checked={addToExisting}
              onChange={(e) => setAddToExisting(e.target.checked)}
              className="text-orange-700"
            >
              기존 클러스터에 추가 (Add to existing cluster)
            </Checkbox>
          </div>
        )}

        {/* Selected Server IPs */}
        <div>
          <Typography.Title level={5} className="mb-3">
            Selected Servers ({selectedServerIPs.length})
          </Typography.Title>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            <List
              size="small"
              dataSource={selectedServerIPs}
              renderItem={(ip) => (
                <List.Item className="px-4 py-2">
                  <Typography.Text code>{ip}</Typography.Text>
                </List.Item>
              )}
              locale={{ emptyText: "No servers selected" }}
            />
          </div>
        </div>

        {/* Info Alert */}
        <Alert
          message="Cluster Assignment"
          description={
            addToExisting
              ? "Selected servers will be added to the existing cluster."
              : "A new cluster will be created with the selected servers."
          }
          type="info"
          showIcon
        />
      </div>
    </CustomModal>
  );
}

export default ClusterPopup;

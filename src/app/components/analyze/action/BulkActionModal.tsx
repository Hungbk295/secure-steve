import React, { useState } from "react";
import { Modal, Input, Button, Alert } from "antd";
import {
  DeleteOutlined,
  SafetyOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

interface BulkActionModalProps {
  visible: boolean;
  action: string;
  selectedCount: number;
  selectedItems: any[];
  onConfirm: (action: string, memo: string) => void;
  onCancel: () => void;
}

const BulkActionModal: React.FC<BulkActionModalProps> = ({
  visible,
  action,
  selectedCount,
  selectedItems,
  onConfirm,
  onCancel,
}) => {
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(action, memo);
      setMemo("");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMemo("");
    onCancel();
  };

  // Get action details
  const getActionConfig = (actionType: string) => {
    switch (actionType) {
      case "delete":
        return {
          title: "삭제 확인 (Confirm Delete)",
          icon: <DeleteOutlined className="text-red-500" />,
          color: "red",
          description:
            selectedCount === 1
              ? `Delete file "${selectedItems[0]?.file_name}" on ${selectedItems[0]?.server_ip}?`
              : `Delete ${selectedCount} selected files?`,
          confirmText: "Delete",
          danger: true,
        };
      case "quarantine":
        return {
          title: "격리 확인 (Confirm Quarantine)",
          icon: <SafetyOutlined className="text-orange-500" />,
          color: "orange",
          description:
            selectedCount === 1
              ? `Quarantine file "${selectedItems[0]?.file_name}" on ${selectedItems[0]?.server_ip}?`
              : `Quarantine ${selectedCount} selected files?`,
          confirmText: "Quarantine",
          danger: false,
        };
      case "no_action":
        return {
          title: "이상없음 확인 (Confirm No Action)",
          icon: <CheckOutlined className="text-green-500" />,
          color: "green",
          description:
            selectedCount === 1
              ? `Mark as No Action for "${selectedItems[0]?.file_name}"?`
              : `Mark ${selectedCount} selected files as No Action?`,
          confirmText: "No Action",
          danger: false,
        };
      case "pending":
        return {
          title: "보류 확인 (Confirm Pending)",
          icon: <ClockCircleOutlined className="text-blue-500" />,
          color: "blue",
          description:
            selectedCount === 1
              ? `Mark as Pending for "${selectedItems[0]?.file_name}"?`
              : `Mark ${selectedCount} selected files as Pending?`,
          confirmText: "Pending",
          danger: false,
        };
      default:
        return {
          title: "Confirm Action",
          icon: <ExclamationCircleOutlined />,
          color: "gray",
          description: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          danger: false,
        };
    }
  };

  const config = getActionConfig(action);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {config.icon}
          <span>{config.title}</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger={config.danger}
          loading={loading}
          onClick={handleConfirm}
        >
          {config.confirmText}
        </Button>,
      ]}
      width={500}
      maskClosable={false}
    >
      <div className="space-y-4 flex flex-col gap-4 pt-4">
        {/* Action Description */}
        <Alert
          message={config.description}
          type={config.danger ? "error" : "info"}
          showIcon
          className="mb-4"
        />

        {/* Selected Files Preview */}
        {selectedCount > 1 && (
          <div className="bg-gray-50 p-3 rounded border">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Selected Files ({selectedCount}):
            </div>
            <div className="max-h-32 overflow-y-auto">
              {selectedItems.slice(0, 5).map((item, index) => (
                <div key={index} className="text-sm text-gray-600 py-1">
                  • {item.file_name} ({item.server_ip})
                </div>
              ))}
              {selectedItems.length > 5 && (
                <div className="text-sm text-gray-500 italic">
                  ... and {selectedItems.length - 5} more files
                </div>
              )}
            </div>
          </div>
        )}

        {/* Memo Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Memo (Optional)
          </label>
          <TextArea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Enter reason or notes for this action..."
            rows={3}
            maxLength={500}
            showCount
          />
        </div>

        {/* Warning for Delete Action */}
        {action === "delete" && (
          <Alert
            message="Warning: This action cannot be undone!"
            type="warning"
            showIcon
          />
        )}
      </div>
    </Modal>
  );
};

export default BulkActionModal;

import React, { useState } from "react";
import { Modal, Input, Button, Select, Typography } from "antd";
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { BLACKLIST_ACTION_OPTIONS } from "@/constants/detectionConstants";

const { TextArea } = Input;
const { Text } = Typography;

interface ExceptionModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (
    alert: any,
    exceptionType: string,
    actionType?: string,
    memo?: string
  ) => Promise<void>;
  alert: any;
  exceptionType: string;
}

const ExceptionModal: React.FC<ExceptionModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  alert,
  exceptionType,
}) => {
  const [memo, setMemo] = useState("");
  const [actionType, setActionType] = useState("delete"); // Default for blacklist
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!alert) return;

    setLoading(true);
    try {
      await onConfirm(
        alert,
        exceptionType,
        exceptionType === "blacklist" ? actionType : undefined,
        memo
      );
      setMemo("");
      setActionType("delete");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMemo("");
    setActionType("delete");
    onCancel();
  };

  if (!alert || !exceptionType) return null;

  const isBlacklist = exceptionType === "blacklist";
  const isWhitelist = exceptionType === "whitelist";

  const getTitle = () => {
    if (isBlacklist) return "Add to Blacklist";
    if (isWhitelist) return "Add to Whitelist";
    return "Update Exception";
  };

  const getDescription = () => {
    if (isBlacklist) {
      return "This file hash will be automatically quarantined or deleted in future detections.";
    }
    if (isWhitelist) {
      return "This file hash will be trusted and skip future analysis.";
    }
    return "";
  };

  const getIconColor = () => {
    if (isBlacklist) return "text-red-500";
    if (isWhitelist) return "text-green-500";
    return "text-blue-500";
  };

  return (
    <Modal
      title={getTitle()}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <div className="space-y-4">
        {/* File Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex">
              <span className="font-medium min-w-20">File:</span>
              <span className="break-all">{alert.file_name}</span>
            </div>
            <div className="flex">
              <span className="font-medium min-w-20">Server:</span>
              <span>{alert.server_ip}</span>
            </div>
            <div className="flex">
              <span className="font-medium min-w-20">Risk:</span>
              <span>{alert.risk}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start space-x-2">
          <InfoCircleOutlined className={`${getIconColor()} mt-1`} />
          <Text type="secondary" className="text-sm">
            {getDescription()}
          </Text>
        </div>

        {/* Blacklist Action Type Selection */}
        {isBlacklist && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action for Future Detections
            </label>
            <Select
              value={actionType}
              onChange={setActionType}
              options={BLACKLIST_ACTION_OPTIONS}
              className="w-full"
            />
            <Text type="secondary" className="text-xs mt-1 block">
              Choose what action to take when this file is detected again
            </Text>
          </div>
        )}

        {/* Memo Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Memo {isWhitelist ? "(Optional)" : "(Required for Blacklist)"}
          </label>
          <TextArea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={
              isBlacklist
                ? "Reason for blacklisting this file..."
                : "Reason for whitelisting this file..."
            }
            rows={3}
            maxLength={500}
            showCount
          />
        </div>

        {/* Warning for Blacklist */}
        {isBlacklist && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <ExclamationCircleOutlined className="text-red-500 mt-1" />
              <div>
                <Text className="text-red-700 font-medium text-sm">
                  Warning
                </Text>
                <Text className="text-red-600 text-sm block">
                  Blacklisting will affect all future detections of this file
                  hash.
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={isBlacklist && !memo.trim()} // Require memo for blacklist
            className={
              isBlacklist
                ? "bg-red-600 hover:bg-red-700 border-red-600"
                : "bg-green-600 hover:bg-green-700 border-green-600"
            }
          >
            {loading
              ? "Processing..."
              : `Confirm ${exceptionType
                  .charAt(0)
                  .toUpperCase()}${exceptionType.slice(1)}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExceptionModal;

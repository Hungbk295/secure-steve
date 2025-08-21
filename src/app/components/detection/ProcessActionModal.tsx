import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import {
  getActionMessage,
  getActionColor,
  getActionIcon,
} from "@/constants/alertActions";

const { TextArea } = Input;

interface ProcessActionModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (alertId: number, action: string, memo: string) => Promise<void>;
  alert: any;
  action: string;
}

const ProcessActionModal: React.FC<ProcessActionModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  alert,
  action,
}) => {
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!alert) return;

    setLoading(true);
    try {
      await onConfirm(alert.id, action, memo);
      setMemo("");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMemo("");
    onCancel();
  };

  if (!alert || !action) return null;

  const actionMessage = getActionMessage(action);
  const actionColor = getActionColor(action);
  const actionIcon = getActionIcon(action);

  return (
    <Modal
      title="Confirm Process Action"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={480}
      destroyOnClose
    >
      <div className="space-y-4">
        {/* Action Icon and Message */}
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${actionColor}`}>
            <i className={`${actionIcon} text-2xl`} />
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-medium mb-2">
              Do you want to{" "}
              <span className={`${actionColor} font-semibold`}>
                {actionMessage}
              </span>{" "}
              this file?
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex">
                <span className="font-medium min-w-20">File:</span>
                <span className="break-all">{alert.file_name}</span>
              </div>
              <div className="flex">
                <span className="font-medium min-w-20">Server:</span>
                <span>{alert.server_ip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Memo Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Memo (Optional)
          </label>
          <TextArea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Add a note about this action..."
            rows={3}
            maxLength={500}
            showCount
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleConfirm}
            loading={loading}
            className={
              action === "delete"
                ? "bg-red-600 hover:bg-red-700 border-red-600"
                : action === "quarantine"
                ? "bg-yellow-600 hover:bg-yellow-700 border-yellow-600"
                : "bg-blue-600 hover:bg-blue-700 border-blue-600"
            }
          >
            {loading
              ? "Processing..."
              : `Confirm ${actionMessage
                  .charAt(0)
                  .toUpperCase()}${actionMessage.slice(1)}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProcessActionModal;

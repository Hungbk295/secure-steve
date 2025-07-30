import { useState } from "react";
import { Input, Form } from "antd";
import CustomModal from "@/app/components/common/CustomModal";
import { EModalMode } from "@/interfaces/app";

interface ActionConfirmModalProps {
  alertName: string;
  action: string;
  onConfirm: (memo: string) => void;
  onCancel: () => void;
}

function ActionConfirmModal({
  alertName,
  action,
  onConfirm,
  onCancel,
}: ActionConfirmModalProps) {
  const [form] = Form.useForm();
  const [memo, setMemo] = useState("");

  const getActionTitle = (action: string) => {
    switch (action) {
      case "quarantine":
        return "Quarantine Alert";
      case "delete":
        return "Delete Alert";
      default:
        return "Confirm Action";
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case "quarantine":
        return "This will move the file to quarantine folder. This action cannot be undone.";
      case "delete":
        return "This will permanently delete the file. This action cannot be undone.";
      default:
        return "Are you sure you want to perform this action?";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "quarantine":
        return "text-yellow-600";
      case "delete":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "quarantine":
        return "ri-shield-line";
      case "delete":
        return "ri-delete-bin-line";
      default:
        return "ri-question-line";
    }
  };

  const handleConfirm = () => {
    form.validateFields().then(() => {
      onConfirm(memo);
    });
  };

  return (
    <CustomModal
      title={getActionTitle(action)}
      mode={EModalMode.MULTIPLE}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="Confirm"
      cancelText="Cancel"
      className="action-confirm-modal"
    >
      <div className="space-y-4">
        {/* Alert Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <i
              className={`${getActionIcon(action)} text-2xl ${getActionColor(
                action
              )}`}
            />
            <div>
              <h4 className="font-medium text-gray-900">{alertName}</h4>
              <p className={`text-sm ${getActionColor(action)}`}>
                {getActionDescription(action)}
              </p>
            </div>
          </div>
        </div>
        {/* {(action === "quarantine" || action === "delete") && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <i className="ri-alert-line text-yellow-600 text-lg mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Security Action Required
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  This action requires administrator approval and will be logged for audit purposes.
                </p>
              </div>
            </div>
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item
            label="Reason / Memo"
            name="memo"
            rules={[
              {
                required: action === "quarantine" || action === "delete",
                message: "Please provide a reason for this action",
              },
              {
                min: 10,
                message: "Reason must be at least 10 characters",
              },
            ]}
          >
            <Input.TextArea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder={
                action === "quarantine" || action === "delete"
                  ? "Please provide a detailed reason for this security action..."
                  : "Optional: Add a note about this action..."
              }
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>

        {/* Action Summary */}
        {/* <div className="border-t pt-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Action:</span>
            <span className={`font-medium ${getActionColor(action)}`}>
              {action.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600">Timestamp:</span>
            <span className="text-gray-900">
              {new Date().toLocaleString("ko-KR")}
            </span>
          </div>
        </div> */}
      </div>
    </CustomModal>
  );
}

export default ActionConfirmModal;

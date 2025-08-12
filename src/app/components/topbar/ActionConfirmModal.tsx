import { useState } from "react";
import { Alert, EAlertProcessStatus, EModalMode } from "@/interfaces/app";
import CustomModal from "@/app/components/common/CustomModal";

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    alertId: string,
    action: EAlertProcessStatus,
    memo: string
  ) => void;
  alert: Alert | null;
  selectedAction: EAlertProcessStatus | null;
  loading?: boolean;
}

const getActionMessage = (action: EAlertProcessStatus): string => {
  switch (action) {
    case EAlertProcessStatus.PENDING:
      return "mark as pending";
    case EAlertProcessStatus.NO_ACTION:
      return "mark as no action";
    case EAlertProcessStatus.QUARANTINE:
      return "quarantine";
    case EAlertProcessStatus.DELETE:
      return "delete";
    default:
      return "process";
  }
};

const getActionColor = (action: EAlertProcessStatus): string => {
  switch (action) {
    case EAlertProcessStatus.PENDING:
      return "text-orange-700";
    case EAlertProcessStatus.NO_ACTION:
      return "text-gray-700";
    case EAlertProcessStatus.QUARANTINE:
      return "text-yellow-700";
    case EAlertProcessStatus.DELETE:
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

const getActionIcon = (action: EAlertProcessStatus): string => {
  switch (action) {
    case EAlertProcessStatus.PENDING:
      return "ri-time-line";
    case EAlertProcessStatus.NO_ACTION:
      return "ri-check-circle-line";
    case EAlertProcessStatus.QUARANTINE:
      return "ri-shield-line";
    case EAlertProcessStatus.DELETE:
      return "ri-delete-bin-line";
    default:
      return "ri-question-line";
  }
};

function ActionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  alert,
  selectedAction,
  loading = false,
}: ActionConfirmModalProps) {
  const [memo, setMemo] = useState("");

  if (!isOpen || !alert || !selectedAction) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(alert.id, selectedAction, memo);
    setMemo("");
  };

  const handleClose = () => {
    setMemo("");
    onClose();
  };

  const actionMessage = getActionMessage(selectedAction);
  const actionColor = getActionColor(selectedAction);
  const actionIcon = getActionIcon(selectedAction);

  const confirmButtonText = loading ? (
    <div className="flex items-center space-x-2">
      <i className="ri-loader-2-line text-sm animate-spin" />
      <span>Processing...</span>
    </div>
  ) : (
    `Confirm ${actionMessage.charAt(0).toUpperCase()}${actionMessage.slice(1)}`
  );

  return (
    <CustomModal
      open={isOpen}
      title="Confirm Action"
      mode={EModalMode.MULTIPLE}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={handleConfirm}
      cancelText="Cancel"
      okText={confirmButtonText}
      width={480}
      className="action-confirm-modal"
      okButtonProps={{
        loading: loading,
        disabled: loading,
        className: `${
          selectedAction === EAlertProcessStatus.DELETE
            ? "!bg-red-600 hover:!bg-red-700"
            : selectedAction === EAlertProcessStatus.QUARANTINE
            ? "!bg-yellow-600 hover:!bg-yellow-700"
            : "!bg-blue-600 hover:!bg-blue-700"
        }`
      }}
      cancelButtonProps={{
        disabled: loading
      }}
    >
      {/* Action Icon and Message */}
      <div className="flex items-start space-x-3 mb-4">
        <div className={`flex-shrink-0 ${actionColor}`}>
          <i className={`${actionIcon} text-2xl`} />
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium mb-1">
            Do you want to{" "}
            <span className={`${actionColor} font-semibold`}>
              {actionMessage}
            </span>{" "}
            this file?
          </p>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex">
              <span className="font-medium min-w-16">File:</span>
              <span className="break-all">{alert.file_name}</span>
            </div>
            <div className="flex">
              <span className="font-medium min-w-16">Server:</span>
              <span>{alert.client_server_ip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memo Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Memo (Optional)
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          disabled={loading}
          placeholder="Add a note about this action..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          rows={3}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1">
          {memo.length}/500 characters
        </div>
      </div>
    </CustomModal>
  );
}

export default ActionConfirmModal;

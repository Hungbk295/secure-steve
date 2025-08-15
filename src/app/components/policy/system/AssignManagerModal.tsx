import React, { useState } from "react";
import { Modal, Alert, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSettingPolicySelectedRowKeys,
  selectSettingPolicyAssignManagerLoading,
  actionAssignManager,
  actionGetServersList,
} from "@/store/settingPolicySlice";

interface AssignManagerModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AssignManagerModal: React.FC<AssignManagerModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const [selectedManager, setSelectedManager] = useState<string>("");
  const dispatch = useAppDispatch();
  const selectedRowKeys = useAppSelector(selectSettingPolicySelectedRowKeys);
  const loading = useAppSelector(selectSettingPolicyAssignManagerLoading);

  const selectedCount = selectedRowKeys.length;

  const handleConfirm = async () => {
    if (!selectedManager) {
      message.error("매니저를 선택해주세요.");
      return;
    }

    try {
      await dispatch(
        actionAssignManager({
          selectedIds: selectedRowKeys,
          managerId: selectedManager,
          userId: "current-user", // TODO: Get from auth state
        })
      ).unwrap();

      const managerName = managerOptions.find(
        (option) => option.value === selectedManager
      )?.label;

      message.success(
        `${selectedCount}개 서버의 매니저가 "${managerName}"로 변경되었습니다.`
      );

      // Refresh the servers list
      dispatch(actionGetServersList({}));

      setSelectedManager("");
      onConfirm();
    } catch (error) {
      console.error("Failed to assign manager:", error);
      message.error("매니저 할당에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setSelectedManager("");
    onCancel();
  };

  const managerOptions = [
    { label: "홍길동 (보안)", value: "u001" },
    { label: "김철수 (서비스)", value: "u002" },
    { label: "아무개 (시스템 운영팀)", value: "u003" },
    { label: "박영수 (네트워크)", value: "u004" },
    { label: "이민수 (데이터베이스)", value: "u005" },
  ];

  const getSelectedManagerName = () => {
    return (
      managerOptions.find((option) => option.value === selectedManager)
        ?.label || ""
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-orange-500" />
          <span>매니저 할당</span>
        </div>
      }
      open={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="할당"
      cancelText="취소"
      confirmLoading={loading}
      width={500}
      okButtonProps={{
        disabled: !selectedManager,
      }}
    >
      <div className="py-4 flex flex-col gap-4">
        <Alert
          message={`선택된 서버 ${selectedCount}개의 매니저를 변경하시겠습니까?`}
          description="이 작업은 선택된 모든 서버에 새로운 매니저를 할당합니다."
          type="warning"
          showIcon
          className="mb-6"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할당할 매니저 선택 *
          </label>
          <Select
            placeholder="매니저를 선택하세요"
            value={selectedManager}
            onChange={setSelectedManager}
            options={managerOptions}
            className="w-full"
            size="large"
            showSearch
            disabled={loading}
          />
        </div>

        {selectedManager && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>선택된 매니저:</strong> {getSelectedManagerName()}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              {selectedCount}개의 서버가 이 매니저로 할당됩니다.
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignManagerModal;

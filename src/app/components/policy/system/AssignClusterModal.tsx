import React, { useState } from "react";
import { Modal, Alert, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSettingPolicySelectedRowKeys,
  selectSettingPolicyAssignClusterLoading,
  actionAssignCluster,
  actionGetServersList,
} from "@/store/settingPolicySlice";

interface AssignClusterModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AssignClusterModal: React.FC<AssignClusterModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const dispatch = useAppDispatch();
  const selectedRowKeys = useAppSelector(selectSettingPolicySelectedRowKeys);
  const loading = useAppSelector(selectSettingPolicyAssignClusterLoading);

  const selectedCount = selectedRowKeys.length;

  const handleConfirm = async () => {
    if (!selectedCluster) {
      message.error("클러스터를 선택해주세요.");
      return;
    }

    try {
      await dispatch(
        actionAssignCluster({
          selectedIds: selectedRowKeys,
          clusterName: selectedCluster,
          userId: "current-user", // TODO: Get from auth state
        })
      ).unwrap();

      message.success(
        `${selectedCount}개 서버의 클러스터가 "${selectedCluster}"로 변경되었습니다.`
      );

      // Refresh the servers list
      dispatch(actionGetServersList({}));

      setSelectedCluster("");
      onConfirm();
    } catch (error) {
      console.error("Failed to assign cluster:", error);
      message.error("클러스터 할당에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setSelectedCluster("");
    onCancel();
  };

  const clusterOptions = [
    { label: "미지정", value: "미지정" },
    { label: "네트워크", value: "네트워크" },
    { label: "서비스", value: "서비스" },
    { label: "ERP", value: "ERP" },
    { label: "CRM", value: "CRM" },
    { label: "보안", value: "보안" },
    { label: "내부 서비스", value: "내부 서비스" },
    { label: "데이터베이스", value: "데이터베이스" },
    { label: "웹 서비스", value: "웹 서비스" },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-orange-500" />
          <span>클러스터 할당</span>
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
        disabled: !selectedCluster,
      }}
    >
      <div className="py-4 flex flex-col gap-4">
        <Alert
          message={`선택된 서버 ${selectedCount}개의 클러스터를 변경하시겠습니까?`}
          description="이 작업은 선택된 모든 서버에 새로운 클러스터를 할당합니다."
          type="warning"
          showIcon
          className="mb-6"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할당할 클러스터 선택 *
          </label>
          <Select
            placeholder="클러스터를 선택하세요"
            value={selectedCluster}
            onChange={setSelectedCluster}
            options={clusterOptions}
            className="w-full"
            size="large"
            showSearch
            disabled={loading}
          />
        </div>

        {selectedCluster && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>선택된 클러스터:</strong> {selectedCluster}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              {selectedCount}개의 서버가 이 클러스터로 할당됩니다.
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignClusterModal;

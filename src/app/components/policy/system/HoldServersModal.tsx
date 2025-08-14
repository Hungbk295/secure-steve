import React from "react";
import { Modal, Alert, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSettingServerPolicySelectedRowKeys,
  selectSettingServerPolicyHoldServersLoading,
  actionHoldServers,
  actionGetServerSettingsList,
} from "@/store/settingServerPolicySlice";

interface HoldServersModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const HoldServersModal: React.FC<HoldServersModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const selectedRowKeys = useAppSelector(
    selectSettingServerPolicySelectedRowKeys
  );
  const loading = useAppSelector(selectSettingServerPolicyHoldServersLoading);

  const selectedCount = selectedRowKeys.length;

  const handleConfirm = async () => {
    try {
      await dispatch(
        actionHoldServers({
          serverIds: selectedRowKeys,
        })
      ).unwrap();

      message.success(`${selectedCount}개 서버가 보류 상태로 변경되었습니다.`);

      // Refresh the servers list
      dispatch(actionGetServerSettingsList({}));

      onConfirm();
    } catch (error) {
      console.error("Failed to hold servers:", error);
      message.error("서버 보류 처리에 실패했습니다.");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-orange-500" />
          <span>서버 보류</span>
        </div>
      }
      open={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="보류 (Hold)"
      cancelText="취소 (Cancel)"
      confirmLoading={loading}
      width={500}
    >
      <div className="py-4 flex flex-col gap-4">
        <Alert
          message={`선택된 서버 ${selectedCount}개를 보류 상태로 변경하시겠습니까?`}
          description="이 작업은 선택된 모든 서버의 상태를 보류로 변경하며, 스캔 작업이 일시 중단됩니다."
          type="warning"
          showIcon
          className="mb-6"
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-sm text-yellow-800">
            <strong>주의사항:</strong>
          </div>
          <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
            <li>보류된 서버는 자동 스캔이 중단됩니다</li>
            <li>수동으로 다시 활성화할 때까지 보류 상태가 유지됩니다</li>
            <li>{selectedCount}개의 서버가 영향을 받습니다</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default HoldServersModal;

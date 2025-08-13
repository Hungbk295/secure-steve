import { Modal, Alert, message, Form, Input } from "antd";
import { ExclamationCircleOutlined, FolderOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSettingServerPolicySelectedRowKeys,
  selectSettingServerPolicyQuarantineFolderLoading,
  actionUpdateQuarantineFolder,
  actionGetServerSettingsList,
} from "@/store/settingServerPolicySlice";

interface QuarantineFolderModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const QuarantineFolderModal: React.FC<QuarantineFolderModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const selectedRowKeys = useAppSelector(
    selectSettingServerPolicySelectedRowKeys
  );
  const loading = useAppSelector(
    selectSettingServerPolicyQuarantineFolderLoading
  );

  const selectedCount = selectedRowKeys.length;

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();

      await dispatch(
        actionUpdateQuarantineFolder({
          serverIds: selectedRowKeys,
          folderPath: values.folder_path,
        })
      ).unwrap();

      message.success(
        `${selectedCount}개 서버의 격리 폴더가 "${values.folder_path}"로 설정되었습니다.`
      );

      // Refresh the servers list
      dispatch(actionGetServerSettingsList({}));

      form.resetFields();
      onConfirm();
    } catch (error) {
      console.error("Failed to update quarantine folder:", error);
      message.error("격리 폴더 설정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Common quarantine folder paths
  const commonPaths = [
    "C:\\Quarantine",
    "D:\\Quarantine",
    "/var/quarantine",
    "/opt/quarantine",
    "C:\\Program Files\\AntiVirus\\Quarantine",
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-orange-500" />
          <span>격리 폴더 설정 (Quarantine Folder Settings)</span>
        </div>
      }
      open={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="적용 (Apply)"
      cancelText="취소 (Cancel)"
      confirmLoading={loading}
      width={600}
      okButtonProps={{
        disabled: loading,
      }}
    >
      <div className="py-4">
        <Alert
          message={`선택된 서버 ${selectedCount}개의 격리 폴더를 설정하시겠습니까?`}
          description="이 작업은 선택된 모든 서버에 동일한 격리 폴더 경로를 적용합니다."
          type="warning"
          showIcon
          className="mb-6"
        />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            folder_path: "C:\\Quarantine",
          }}
        >
          <Form.Item
            label="격리 폴더 경로"
            name="folder_path"
            rules={[
              { required: true, message: "격리 폴더 경로를 입력해주세요" },
              { min: 3, message: "폴더 경로는 최소 3자 이상이어야 합니다" },
              { max: 255, message: "폴더 경로는 255자를 초과할 수 없습니다" },
            ]}
          >
            <Input
              placeholder="격리 폴더 경로를 입력하세요"
              prefix={<FolderOutlined />}
              size="large"
              disabled={loading}
            />
          </Form.Item>

          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              일반적인 격리 폴더 경로 예시:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {commonPaths.map((path, index) => (
                <button
                  key={index}
                  type="button"
                  className="text-left text-xs text-blue-600 hover:text-blue-800 hover:underline p-1 rounded hover:bg-blue-50"
                  onClick={() => form.setFieldsValue({ folder_path: path })}
                  disabled={loading}
                >
                  {path}
                </button>
              ))}
            </div>
          </div>
        </Form>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-sm text-yellow-800">
            <strong>주의사항:</strong>
          </div>
          <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
            <li>지정된 폴더는 해당 서버에 존재해야 합니다</li>
            <li>충분한 디스크 공간이 있는지 확인하세요</li>
            <li>적절한 권한 설정이 필요합니다</li>
            <li>{selectedCount}개의 서버가 영향을 받습니다</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default QuarantineFolderModal;

import { Modal, Alert, message, Form, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectAddPolicyLoading,
  actionAddToFilePolicy,
  actionGetFilePolicies,
  selectActiveTab,
} from "@/store/blacklistSlice";

const { TextArea } = Input;

interface AddToWhitelistModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  analysisRequestId?: string;
  fileName?: string;
}

const AddToWhitelistModal: React.FC<AddToWhitelistModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  analysisRequestId = "req_54321", // Mock data for demo
  fileName = "system.dll", // Mock data for demo
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAddPolicyLoading);
  const activeTab = useAppSelector(selectActiveTab);

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();

      await dispatch(
        actionAddToFilePolicy({
          analysisRequestId,
          filePolicy: "whitelist",
          processStatus: "no_action",
          comments: values.comments,
        })
      ).unwrap();

      message.success(`${fileName} 파일이 화이트리스트에 추가되었습니다.`);

      // Refresh the current tab list
      dispatch(actionGetFilePolicies({ type: activeTab }));

      form.resetFields();
      onConfirm();
    } catch (error) {
      console.error("Failed to add to whitelist:", error);
      message.error("화이트리스트 추가에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-green-500" />
          <span>화이트리스트 추가 (Add to Whitelist)</span>
        </div>
      }
      open={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="확인"
      cancelText="취소"
      confirmLoading={loading}
      width={600}
      okButtonProps={{
        disabled: loading,
      }}
    >
      <div className="py-4">
        <Alert
          message={`${fileName} 파일을 화이트리스트로 설정하시겠습니까?`}
          description="동일 파일이 발견 시 더 이상 분석을 진행하지 않습니다. 계속하시겠습니까?"
          type="info"
          showIcon
          className="mb-6"
        />

        <Form form={form} layout="vertical">
          <Form.Item
            label="메모 (Comments)"
            name="comments"
            rules={[{ max: 500, message: "메모는 500자를 초과할 수 없습니다" }]}
          >
            <TextArea
              placeholder="화이트리스트 추가 사유를 입력하세요 (선택사항)"
              rows={4}
              disabled={loading}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="text-sm text-green-800">
            <strong>화이트리스트 정보:</strong>
          </div>
          <ul className="text-sm text-green-700 mt-1 ml-4 list-disc">
            <li>화이트리스트에 추가된 파일은 분석을 건너뜁니다</li>
            <li>동일한 해시를 가진 모든 파일에 적용됩니다</li>
            <li>신뢰할 수 있는 파일만 추가하세요</li>
            <li>자동으로 "조치 없음" 상태로 처리됩니다</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default AddToWhitelistModal;

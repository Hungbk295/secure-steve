import { Modal, Alert, message, Form, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectAddPolicyLoading,
  actionAddToFilePolicy,
  actionGetFilePolicies,
  selectActiveTab,
} from "@/store/blacklistSlice";

const { TextArea } = Input;

interface AddToBlacklistModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  analysisRequestId?: string;
  fileName?: string;
}

const AddToBlacklistModal: React.FC<AddToBlacklistModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  analysisRequestId = "req_12345", // Mock data for demo
  fileName = "suspicious.exe", // Mock data for demo
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
          filePolicy: "blacklist",
          processStatus: values.process_status,
          comments: values.comments,
        })
      ).unwrap();

      message.success(`${fileName} 파일이 블랙리스트에 추가되었습니다.`);

      // Refresh the current tab list
      dispatch(actionGetFilePolicies({ type: activeTab }));

      form.resetFields();
      onConfirm();
    } catch (error) {
      console.error("Failed to add to blacklist:", error);
      message.error("블랙리스트 추가에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const processStatusOptions = [
    { label: "삭제 (Delete)", value: "delete" },
    { label: "격리 (Quarantine)", value: "quarantine" },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-red-500" />
          <span>블랙리스트 추가 (Add to Blacklist)</span>
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
          message={`${fileName} 파일을 블랙리스트로 설정하시겠습니까?`}
          description="동일 파일이 발견 시 분석을 건너뛰고 파일은 선택한 작업을 수행합니다."
          type="warning"
          showIcon
          className="mb-6"
        />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            process_status: "delete",
          }}
        >
          <Form.Item
            label="처리 방식 (Process Action)"
            name="process_status"
            rules={[{ required: true, message: "처리 방식을 선택해주세요" }]}
          >
            <Select
              placeholder="처리 방식을 선택하세요"
              options={processStatusOptions}
              className="w-full"
              size="large"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="메모 (Comments)"
            name="comments"
            rules={[{ max: 500, message: "메모는 500자를 초과할 수 없습니다" }]}
          >
            <TextArea
              placeholder="블랙리스트 추가 사유를 입력하세요 (선택사항)"
              rows={4}
              disabled={loading}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
          <div className="text-sm text-red-800">
            <strong>주의사항:</strong>
          </div>
          <ul className="text-sm text-red-700 mt-1 ml-4 list-disc">
            <li>블랙리스트에 추가된 파일은 자동으로 처리됩니다</li>
            <li>동일한 해시를 가진 모든 파일에 적용됩니다</li>
            <li>처리된 후에는 되돌릴 수 없습니다</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default AddToBlacklistModal;

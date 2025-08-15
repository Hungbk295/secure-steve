import { Modal, Alert, message, Form, Switch } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSettingServerPolicySelectedRowKeys,
  selectSettingServerPolicyScanSettingsLoading,
  actionUpdateScanSettings,
  actionGetServerSettingsList,
} from "@/store/settingServerPolicySlice";

interface ScanSettingsModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ScanSettingsModal: React.FC<ScanSettingsModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const selectedRowKeys = useAppSelector(
    selectSettingServerPolicySelectedRowKeys
  );
  const loading = useAppSelector(selectSettingServerPolicyScanSettingsLoading);

  const selectedCount = selectedRowKeys.length;

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      const scanSchedule = values.scan_schedule
        ? values.scan_schedule.format("YYYY-MM-DDTHH:mm:ss[Z]")
        : new Date().toISOString();

      await dispatch(
        actionUpdateScanSettings({
          serverIds: selectedRowKeys,
          scanSettings: {
            agent_update_interval: values.agent_update_interval,
            scan_interval: values.scan_interval,
            scan_schedule: scanSchedule,
            scan_realtime: values.scan_realtime,
          },
        })
      ).unwrap();

      message.success(
        `${selectedCount}개 서버의 스캔 설정이 업데이트되었습니다.`
      );

      // Refresh the servers list
      dispatch(actionGetServerSettingsList({}));

      form.resetFields();
      onConfirm();
    } catch (error) {
      console.error("Failed to update scan settings:", error);
      message.error("스캔 설정 업데이트에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const agentUpdateIntervalOptions = [
    { label: "6시간", value: "6h" },
    { label: "12시간", value: "12h" },
    { label: "24시간", value: "24h" },
    { label: "48시간", value: "48h" },
    { label: "일주일", value: "7d" },
  ];

  const scanIntervalOptions = [
    { label: "30분", value: "30m" },
    { label: "1시간", value: "1h" },
    { label: "3시간", value: "3h" },
    { label: "6시간", value: "6h" },
    { label: "12시간", value: "12h" },
    { label: "24시간", value: "24h" },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-blue-500" />
          <span>스캔 설정</span>
        </div>
      }
      open={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="적용"
      cancelText="취소"
      confirmLoading={loading}
      width={600}
      okButtonProps={{
        disabled: loading,
      }}
    >
      <div className="py-4 flex flex-col gap-4">
        <Alert
          message={`선택된 서버 ${selectedCount}개의 스캔 설정을 변경하시겠습니까?`}
          description="이 작업은 선택된 모든 서버에 새로운 스캔 설정을 적용합니다."
          type="info"
          showIcon
          className="mb-6"
        />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            agent_update_interval: "24h",
            scan_interval: "12h",
            scan_realtime: false,
          }}
        >
          <Form.Item
            label="Agent 업데이트 주기"
            name="agent_update_interval"
            rules={[
              { required: true, message: "Agent 업데이트 주기를 선택해주세요" },
            ]}
          >
            <Select
              placeholder="Agent 업데이트 주기 선택"
              options={agentUpdateIntervalOptions}
              className="w-full"
              size="large"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Scan 주기"
            name="scan_interval"
            rules={[{ required: true, message: "Scan 주기를 선택해주세요" }]}
          >
            <Select
              placeholder="Scan 주기 선택"
              options={scanIntervalOptions}
              className="w-full"
              size="large"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Scan 예약"
            name="scan_schedule"
            rules={[
              { required: true, message: "Scan 예약 시간을 선택해주세요" },
            ]}
          >
            <CustomDatePicker
              form={form}
              showTime={false}
              name="scan_schedule"
              showQuickPicker={false}
            />
          </Form.Item>

          <Form.Item
            label="Scan 실시간 여부"
            name="scan_realtime"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={loading}
            />
          </Form.Item>
        </Form>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="text-sm text-blue-800">
            <strong>설정 정보:</strong>
          </div>
          <div className="text-sm text-blue-600 mt-1">
            {selectedCount}개의 서버에 동일한 스캔 설정이 적용됩니다.
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ScanSettingsModal;

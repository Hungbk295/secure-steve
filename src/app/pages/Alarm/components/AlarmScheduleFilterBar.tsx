import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";
import { DynamicKeyObject } from "@/interfaces/app";

interface AlarmScheduleFilterBarProps {
  loading?: boolean;
  className?: string;
}

const initialFormData = {
  timeRange: null,
  risk: "all",
  triageVerdict: "all",
  processStatus: "all",
  serverIP: "all",
};

function AlarmScheduleFilterBar({
  loading = false,
  className,
}: AlarmScheduleFilterBarProps) {
  const [form] = Form.useForm();

  function getPayload(values: DynamicKeyObject) {
    const { timeRange, risk, triageVerdict, processStatus, serverIP } = values;

    const payload = {
      timeRange:
        timeRange && timeRange.length === 2
          ? [
              timeRange[0].format("YYYY-MM-DD"),
              timeRange[1].format("YYYY-MM-DD"),
            ]
          : null,
      risk: risk === "all" ? "" : risk,
      triageVerdict: triageVerdict === "all" ? "" : triageVerdict,
      processStatus: processStatus === "all" ? "" : processStatus,
      serverIP: serverIP === "all" ? "" : serverIP,
    };
    return payload;
  }

  function onFinish(values: DynamicKeyObject) {
    const payload = getPayload(values);
    console.log("Alarm Schedule Filter:", payload);
    // TODO: Dispatch action to fetch alarm schedule data
  }

  function onReset() {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    console.log("Reset Alarm Schedule Filter:", payload);
    // TODO: Dispatch action to fetch alarm schedule data
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    console.log("Initialize Alarm Schedule Filter:", payload);
    // TODO: Dispatch action to fetch alarm schedule data
  }, []);

  const riskOptions = [
    { label: "All", value: "all" },
    { label: "High (80-100%)", value: "high" },
    { label: "Medium (50-79%)", value: "medium" },
    { label: "Low (0-49%)", value: "low" },
    { label: "Critical", value: "critical" },
  ];

  const triageVerdictOptions = [
    { label: "All", value: "all" },
    { label: "Malware", value: "malware" },
    { label: "Benign", value: "benign" },
    { label: "Suspicious", value: "suspicious" },
    { label: "Unknown", value: "unknown" },
  ];

  const processStatusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "No Action", value: "no_action" },
    { label: "Quarantine", value: "quarantine" },
    { label: "Delete", value: "delete" },
    { label: "신규 승인", value: "신규 승인" },
    { label: "보류", value: "보류" },
    { label: "삭제(퇴사)", value: "삭제(퇴사)" },
  ];

  const serverIPOptions = [
    { label: "All", value: "all" },
    { label: "66.211.75.1", value: "66.211.75.1" },
    { label: "66.211.75.2", value: "66.211.75.2" },
    { label: "66.211.75.3", value: "66.211.75.3" },
    { label: "66.211.75.4", value: "66.211.75.4" },
    { label: "192.168.1.10", value: "192.168.1.10" },
    { label: "192.168.1.20", value: "192.168.1.20" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={className}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={4}>
          <Form.Item label="Time Range" name="timeRange">
            <CustomDatePicker
              form={form}
              showTime={false}
              name="timeRange"
              showQuickPicker={false}
              placeholder={["Start Date", "End Date"]}
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Risk" name="risk">
            <Select
              placeholder="Select Risk Level"
              showSearch
              options={riskOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Triage Verdict" name="triageVerdict">
            <Select
              placeholder="Select Triage Verdict"
              showSearch
              options={triageVerdictOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Process Status" name="processStatus">
            <Select
              placeholder="Select Process Status"
              showSearch
              options={processStatusOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Server IP" name="serverIP">
            <Select
              placeholder="Select Server IP"
              showSearch
              options={serverIPOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={6} lg={4}>
          <div className="filter-actions flex justify-end space-x-2 flex-1">
            <Button
              className="!h-[45px] !w-12"
              type="default"
              icon={<ReloadOutlined />}
              onClick={onReset}
              disabled={loading}
            />
            <Button
              className="!h-[45px] !w-[240px]"
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Apply
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default AlarmScheduleFilterBar;
import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { DynamicKeyObject } from "@/interfaces/app";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";

interface ActionHistoryFilterBarProps {
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

function ActionHistoryFilterBar({
  loading = false,
  className,
}: ActionHistoryFilterBarProps) {
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
    console.log("Action History Filter:", payload);
    // TODO: Dispatch action to fetch action history data
  }

  function onReset() {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    console.log("Reset Action History Filter:", payload);
    // TODO: Dispatch action to fetch action history data
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    console.log("Initialize Action History Filter:", payload);
    // TODO: Dispatch action to fetch action history data
  }, []);

  const riskLevelOptions = [
    { label: "All", value: "all" },
    { label: "High (80-100%)", value: "high" },
    { label: "Medium (50-79%)", value: "medium" },
    { label: "Low (0-49%)", value: "low" },
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
    { label: "Delete", value: "delete" },
    { label: "Quarantine", value: "quarantine" },
    { label: "No Action", value: "no_action" },
    { label: "Pending", value: "pending" },
  ];

  const serverIPOptions = [
    { label: "All", value: "all" },
    { label: "66.211.75.1", value: "66.211.75.1" },
    { label: "66.211.75.2", value: "66.211.75.2" },
    { label: "66.211.75.3", value: "66.211.75.3" },
    { label: "66.211.75.4", value: "66.211.75.4" },
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
              name="dateRange"
              showQuickPicker={false}
              placeholder={["Start Time", "End Time"]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Risk" name="risk">
            <Select
              placeholder="Risk Level"
              showSearch
              options={riskLevelOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Triage Verdict" name="triageVerdict">
            <Select
              placeholder="Triage Verdict"
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
              placeholder="Process Status"
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
              placeholder="Server IP"
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

export default ActionHistoryFilterBar;

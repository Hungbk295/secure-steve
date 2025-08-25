import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";

interface ScanHistoryFilterBarProps {
  loading?: boolean;
  className?: string;
}

const initialFormData = {
  timeRange: null,
  serverIP: "all",
  testStatus: "all",
  testType: "all",
  owner: "all",
};

function ScanHistoryFilterBar({
  loading = false,
  className,
}: ScanHistoryFilterBarProps) {
  const [form] = Form.useForm();

  function onFinish() {}

  function onReset() {
    form.setFieldsValue(initialFormData);
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
  }, []);

  const serverIPOptions = [
    { label: "All", value: "all" },
    { label: "66.211.75.1", value: "66.211.75.1" },
    { label: "66.211.75.2", value: "66.211.75.2" },
    { label: "66.211.75.3", value: "66.211.75.3" },
    { label: "66.211.75.4", value: "66.211.75.4" },
  ];

  const testStatusOptions = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Fail(Error)", value: "fail_error" },
    { label: "Fail(None exe)", value: "fail_none_exe" },
  ];

  const testTypeOptions = [
    { label: "All", value: "all" },
    { label: "Total", value: "total" },
    { label: "Streaming", value: "streaming" },
  ];

  const ownerOptions = [
    { label: "All", value: "all" },
    { label: "홍길동", value: "홍길동" },
    { label: "김철수", value: "김철수" },
    { label: "이영희", value: "이영희" },
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

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Test Status" name="testStatus">
            <Select
              placeholder="Test Status"
              showSearch
              options={testStatusOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Test Type" name="testType">
            <Select
              placeholder="Test Type"
              showSearch
              options={testTypeOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Owner" name="owner">
            <Select
              placeholder="Owner"
              showSearch
              options={ownerOptions}
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

export default ScanHistoryFilterBar;

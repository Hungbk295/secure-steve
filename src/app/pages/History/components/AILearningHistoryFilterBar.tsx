import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";

interface AILearningHistoryFilterBarProps {
  loading?: boolean;
  className?: string;
}

const initialFormData = {
  timeRange: null,
};

function AILearningHistoryFilterBar({
  loading = false,
  className,
}: AILearningHistoryFilterBarProps) {
  const [form] = Form.useForm();

  // function getPayload(values: DynamicKeyObject) {
  //   const { timeRange } = values;

  //   const payload = {
  //     timeRange:
  //       timeRange && timeRange.length === 2
  //         ? [
  //             timeRange[0].format("YYYY-MM-DD"),
  //             timeRange[1].format("YYYY-MM-DD"),
  //           ]
  //         : null,
  //   };
  //   return payload;
  // }

  function onFinish() {}

  function onReset() {
    form.setFieldsValue(initialFormData);
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={className}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={6}>
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

        <Col xs={24} sm={24} md={16} lg={18}>
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

export default AILearningHistoryFilterBar;

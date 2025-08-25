import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";
import { DynamicKeyObject } from "@/interfaces/app";
import { useAppDispatch } from "@/store";
import { actionGetReportList, updateFilters } from "@/store/reportListSlice";

interface ReportListFilterBarProps {
  loading?: boolean;
  className?: string;
}

const getInitialFormData = () => {
  const endDate = new Date();
  const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

  return {
    timeRange: [startDate, endDate],
    status: "all",
    actionedBy: "all",
  };
};

function ReportListFilterBar({
  loading = false,
  className,
}: ReportListFilterBarProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  function getPayload(values: DynamicKeyObject) {
    const { timeRange, status, actionedBy } = values;

    const payload = {
      timeRange:
        timeRange && timeRange.length === 2
          ? [
              timeRange[0].format("YYYY-MM-DD"),
              timeRange[1].format("YYYY-MM-DD"),
            ]
          : null,
      status: status === "all" ? "" : status,
      actionedBy: actionedBy === "all" ? "" : actionedBy,
    };
    return payload;
  }

  function onFinish(values: DynamicKeyObject) {
    const payload = getPayload(values);
    dispatch(updateFilters(payload));
    dispatch(actionGetReportList(payload));
  }

  function onReset() {
    const initialData = getInitialFormData();
    form.setFieldsValue(initialData);
    const payload = getPayload(initialData);
    dispatch(updateFilters(payload));
    dispatch(actionGetReportList(payload));
  }

  useEffect(() => {
    const initialData = getInitialFormData();
    form.setFieldsValue(initialData);
  }, [form]);

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "읽음", value: "read" },
    { label: "안읽음", value: "unread" },
  ];

  const actionedByOptions = [
    { label: "All", value: "all" },
    { label: "시스템", value: "시스템" },
    { label: "KISA DB", value: "KISA DB" },
    { label: "관리자", value: "관리자" },
    { label: "보안팀", value: "보안팀" },
    { label: "운영팀", value: "운영팀" },
  ];

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
              name="timeRange"
              showQuickPicker={false}
              placeholder={["Start Date", "End Date"]}
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select Status"
              showSearch
              options={statusOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Actioned by" name="actionedBy">
            <Select
              placeholder="Select Actioned by"
              showSearch
              options={actionedByOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={6} lg={10}>
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

export default ReportListFilterBar;

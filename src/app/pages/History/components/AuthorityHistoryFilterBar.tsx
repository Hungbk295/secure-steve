import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import RangePicker from "@/app/components/common/RangePicker";
import Input from "@/app/components/common/Input";
import { DynamicKeyObject } from "@/interfaces/app";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";

interface AuthorityHistoryFilterBarProps {
  loading?: boolean;
  className?: string;
}

const initialFormData = {
  timeRange: null,
  department: "all",
  userType: "all",
  status: "all",
  searchText: "",
};

function AuthorityHistoryFilterBar({
  loading = false,
  className,
}: AuthorityHistoryFilterBarProps) {
  const [form] = Form.useForm();

  function getPayload(values: DynamicKeyObject) {
    const { timeRange, department, userType, status, searchText } = values;

    const payload = {
      timeRange:
        timeRange && timeRange.length === 2
          ? [
              timeRange[0].format("YYYY-MM-DD"),
              timeRange[1].format("YYYY-MM-DD"),
            ]
          : null,
      department: department === "all" ? "" : department,
      userType: userType === "all" ? "" : userType,
      status: status === "all" ? "" : status,
      searchText: searchText || "",
    };
    return payload;
  }

  function onFinish(values: DynamicKeyObject) {
    const payload = getPayload(values);
    console.log("Authority History Filter:", payload);
    // TODO: Dispatch action to fetch authority history data
  }

  function onReset() {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    console.log("Reset Authority History Filter:", payload);
    // TODO: Dispatch action to fetch authority history data
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    console.log("Initialize Authority History Filter:", payload);
    // TODO: Dispatch action to fetch authority history data
  }, []);

  const departmentOptions = [
    { label: "All", value: "all" },
    { label: "보안", value: "보안" },
    { label: "시스템 운영팀", value: "시스템 운영팀" },
    { label: "개발팀", value: "개발팀" },
  ];

  const userTypeOptions = [
    { label: "All", value: "all" },
    { label: "사용자", value: "사용자" },
    { label: "관리자", value: "관리자" },
  ];

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "신규 승인", value: "신규 승인" },
    { label: "반려", value: "반려" },
    { label: "삭제(퇴사)", value: "삭제(퇴사)" },
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
              placeholder={["From Date", "To Date"]}
              disabled={loading}
              showTime={false}
              showQuickPicker={false}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Department" name="department">
            <Select
              placeholder="Select Department"
              showSearch
              options={departmentOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="User Type" name="userType">
            <Select
              placeholder="Select User Type"
              showSearch
              options={userTypeOptions}
              className="w-full"
              size="middle"
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
          <Form.Item label="Search" name="searchText">
            <Input
              placeholder="Search users..."
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

export default AuthorityHistoryFilterBar;

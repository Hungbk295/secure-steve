import { useEffect } from "react";
import { Row, Col, Form, Button as AntdButton } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";
import { DynamicKeyObject } from "@/interfaces/app";
import { useAppDispatch } from "@/store";
import { actionGetServersList } from "@/store/settingPolicySlice";
import Input from "../../common/Input";
import Button from "../../common/Button";

interface AssignServersFilterBarProps {
  loading?: boolean;
  className?: string;
}

const initialFormData = {
  clusterName: "all",
  serverManager: "all",
  timeRange: null,
  searchText: "",
};

function AssignServersFilterBar({
  loading = false,
  className,
}: AssignServersFilterBarProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  function getPayload(values: DynamicKeyObject) {
    const { clusterName, serverManager, timeRange, searchText } = values;

    const payload = {
      clusterName: clusterName === "all" ? "" : clusterName,
      serverManager: serverManager === "all" ? "" : serverManager,
      timeRange:
        timeRange && timeRange.length === 2
          ? [
              timeRange[0].format("YYYY-MM-DD"),
              timeRange[1].format("YYYY-MM-DD"),
            ]
          : null,
      searchText: searchText || "",
    };
    return payload;
  }

  function onFinish(values: DynamicKeyObject) {
    const payload = getPayload(values);
    dispatch(actionGetServersList(payload));
  }

  function onReset() {
    form.setFieldsValue(initialFormData);
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    dispatch(actionGetServersList(payload));
  }, [dispatch]);

  const clusterNameOptions = [
    { label: "All", value: "all" },
    { label: "미지정", value: "미지정" },
    { label: "네트워크", value: "네트워크" },
    { label: "서비스", value: "서비스" },
    { label: "ERP", value: "ERP" },
    { label: "CRM", value: "CRM" },
    { label: "보안", value: "보안" },
    { label: "내부 서비스", value: "내부 서비스" },
  ];

  const serverManagerOptions = [
    { label: "All", value: "all" },
    { label: "홍길동 (보안)", value: "u001" },
    { label: "김철수 (서비스)", value: "u002" },
    { label: "아무개 (시스템 운영팀)", value: "u003" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={className}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="Cluster Name" name="clusterName">
            <Select
              placeholder="Cluster Name"
              showSearch
              options={clusterNameOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Server Manager" name="serverManager">
            <Select
              placeholder="Server Manager"
              showSearch
              options={serverManagerOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Form.Item label="Time Range" name="timeRange">
            <CustomDatePicker
              form={form}
              showTime={false}
              name="timeRange"
              showQuickPicker={false}
              placeholder={["Start Time", "End Time"]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Search IP/Text" name="searchText">
            <Input
              placeholder="Search by IP or Text"
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        {/* Action Buttons */}
        <Col xs={24} sm={16} md={6} lg={8}>
          <div className="filter-actions flex justify-end space-x-2">
            <AntdButton
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

export default AssignServersFilterBar;
